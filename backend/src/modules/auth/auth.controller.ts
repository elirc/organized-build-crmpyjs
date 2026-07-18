import type { Request, Response } from "express";

import { authService } from "./auth.service.js";

export class AuthController {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json(result);
  }

  async refresh(req: Request, res: Response) {
    const result = await authService.refresh(req.body.refreshToken);
    res.json(result);
  }

  async logout(req: Request, res: Response) {
    await authService.logout(req.body.refreshToken);
    res.status(204).send();
  }

  async me(req: Request, res: Response) {
    const user = await authService.getCurrentUser(req.user!.id);
    res.json(user);
  }
}

export const authController = new AuthController();
