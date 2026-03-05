import { Request, Response } from "express";
import { HttpStatusCode, LogLevel,baseController, addLog } from "common";
import { ProfileService } from "../services/profile.service";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
    this.profileService = profileService;
  }

  public getUser = async (req: Request, res: Response) => {
    addLog(LogLevel.info, "getUser Controller", (req as any).userId);
    const user = await this.profileService.getUser((req as any).userId);
    return baseController.getResult(res, HttpStatusCode.Ok, user);
  };
}
