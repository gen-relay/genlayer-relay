import Fastify from "fastify";
import cors from "@fastify/cors";
import staticPlugin from "@fastify/static";
import path from "path";
import { config } from "dotenv";
import { z } from "zod";

// ----------------- LOAD ENV -----------------
const result = config({ path: path.join(__dirname, "../.env") });
if (result.error) {
  console.error("❌ Failed to load .env file:", result.error);
  process.exit(1);
}

// ----------------- VALIDATE ENV -----------------
const envSchema = z.object({
  WEATHER_API_KEY: z.string().min(1, "WEATHER_API_KEY is required"),
  PORT: z.string().optional(),
});

const envParse = envSchema.safeParse(process.env);
if (!envParse.success) {
  console.error("❌ Invalid environment variables:", envParse.error.format());
  process.exit(1);
}

const ENV = envParse.data;

// ----------------- IMPORT ROUTES -----------------
import { pricesRoutes } from "./prices";
import { weatherRoutes } from "./weather";
import { randomnessRoutes } from "./randomness";
import { verifyRoutes } from "./verify";
import { signRoutes } from "./sign";

// ----------------- START SERVER -----------------
async function start() {
  const app = Fastify({ logger: true });

  // ----------------- CORS -----------------
  await app.register(cors, { origin: true });

  // ----------------- API ROUTES -----------------
  app.register(pricesRoutes, { prefix: "/prices" });
  app.register(weatherRoutes, { prefix: "/weather" });
  app.register(randomnessRoutes, { prefix: "/random" });
  app.register(verifyRoutes, { prefix: "/verify" });
  app.register(signRoutes, { prefix: "/sign" });

  // ----------------- STATIC FRONTEND -----------------
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");

  await app.register(staticPlugin, {
    root: frontendDist,
    prefix: "/",          // serve assets
  });

  // SPA fallback (MUST be after static plugin)
  app.setNotFoundHandler((req, reply) => {
    reply.sendFile("index.html");
  });

  const PORT = Number(ENV.PORT || 3000);

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
