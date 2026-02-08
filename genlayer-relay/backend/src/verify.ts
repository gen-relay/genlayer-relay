import { FastifyPluginAsync } from "fastify";
import crypto from "crypto";

// ----------------- ENV -----------------
const SIGN_SECRET = process.env.SIGN_SECRET || "";

// ----------------- PLUGIN -----------------
export const verifyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const { message, signature } = request.body as { message?: string; signature?: string };

    if (!SIGN_SECRET) {
      reply.code(500);
      return { status: "error", message: "SIGN_SECRET missing in .env" };
    }

    if (!message || !signature) {
      reply.code(400);
      return { status: "error", message: "Missing message or signature" };
    }

    try {
      const expected = crypto
        .createHmac("sha256", SIGN_SECRET)
        .update(message)
        .digest("hex");

      const valid = crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signature)
      );

      return {
        status: "ok",
        valid,
        message,
      };
    } catch (err: any) {
      reply.code(500);
      return { status: "error", message: err.message };
    }
  });
};
