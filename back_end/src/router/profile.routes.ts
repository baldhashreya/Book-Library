import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { CommonRepository } from "../repositories/common.repository";
import { ProfileService } from "../services/profile.service";
import { authorizationUser } from "../../common/base-controller";

const commonRepository = new CommonRepository();
const profileService = new ProfileService(commonRepository);
const profileController = new ProfileController(profileService);

const router = Router();

router.get("/me", authorizationUser, profileController.getUser);
export default router;
