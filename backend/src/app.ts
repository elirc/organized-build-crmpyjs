import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { AppError } from "./shared/errors/AppError.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "lightweight-crm-backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/health/db", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Lightweight CRM API",
    version: "0.1.0",
    phase: "auth-and-rbac"
  });
});

app.use("/api/auth", authRouter);

app.use((error: unknown, _req: express.Request, res: express.Response) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
  }

  res.status(500).json({
    message: "Internal server error"
  });
});
