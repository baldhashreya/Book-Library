import { Request, Response } from "express";
import { baseController } from "../../common/base-controller";
import { HttpStatusCode, LogLevel } from "../../common/enum";
import { ProfileService } from "../services/profile.service";
import { addLog } from "../../common/logger";

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
