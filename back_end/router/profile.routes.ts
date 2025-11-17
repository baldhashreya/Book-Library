import { Router } from "express";
import { ProfileController } from "../src/controllers/profile.controller";
import { CommonRepository } from "../src/repositories/common.repository";
import { ProfileService } from "../src/services/profile.service";
import { authorizationUser } from "../common/base-controller";

const commonRepository = new CommonRepository();
const profileService = new ProfileService(commonRepository);
const profileController = new ProfileController(profileService);

const router = Router()

router.get("/me", authorizationUser,profileController.getUser);
export default router;