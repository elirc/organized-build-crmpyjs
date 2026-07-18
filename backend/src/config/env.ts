import "dotenv/config";
import { z } from "zod";

const runtimeEnv = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    (process.env.NODE_ENV === "test"
      ? "postgresql://postgres:postgres@localhost:5432/lightweight_crm_test?schema=public"
      : undefined),
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ??
    (process.env.NODE_ENV === "test" ? "test-access-secret-12345" : undefined),
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ??
    (process.env.NODE_ENV === "test" ? "test-refresh-secret-12345" : undefined)
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d")
});

export const env = envSchema.parse(runtimeEnv);
