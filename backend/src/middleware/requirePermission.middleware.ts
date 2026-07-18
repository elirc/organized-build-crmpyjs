import type { NextFunction, Request, Response } from "express";

import { hasPermission, type Permission } from "../auth/permissions.js";
import { AppError } from "../shared/errors/AppError.js";

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }

    return next();
  };
}
