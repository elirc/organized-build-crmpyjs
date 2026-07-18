import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import type { ZodTypeAny } from "zod";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas.js";

function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten()
      });
    }

    req.body = result.data;
    return next();
  };
}

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), asyncHandler(authController.register.bind(authController)));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(authController.login.bind(authController)));
authRouter.post("/refresh", validateBody(refreshSchema), asyncHandler(authController.refresh.bind(authController)));
authRouter.post("/logout", validateBody(refreshSchema), asyncHandler(authController.logout.bind(authController)));
authRouter.get("/me", authMiddleware, asyncHandler(authController.me.bind(authController)));
