import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { verifyAccessToken } from "../shared/utils/jwt.js";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Express.User["role"]
    };

    return next();
  } catch {
    return next(new AppError("Invalid access token", 401, "INVALID_ACCESS_TOKEN"));
  }
}
