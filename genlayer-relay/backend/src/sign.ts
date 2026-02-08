import { FastifyPluginAsync } from "fastify";
import crypto from "crypto";

// ----------------- ENV -----------------
const SIGN_SECRET = process.env.SIGN_SECRET || "";

// ----------------- PLUGIN -----------------
export const signRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const { message } = request.body as { message?: string };

    if (!SIGN_SECRET) {
      reply.code(500);
      return { status: "error", message: "SIGN_SECRET missing in .env" };
    }

    if (!message) {
      reply.code(400);
      return { status: "error", message: "Missing message" };
    }

    try {
      const signature = crypto
        .createHmac("sha256", SIGN_SECRET)
        .update(message)
        .digest("hex");

      return {
        status: "ok",
        message,
        signature,
      };
    } catch (err: any) {
      reply.code(500);
      return { status: "error", message: err.message };
    }
  });
};
