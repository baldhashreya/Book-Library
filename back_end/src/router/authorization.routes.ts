import * as Express from "express";
import { AuthorizationController } from "../controllers/authorization.controller";
import { AuthorizationServices } from "../services/authorization.service";
import { AuthorizationRepository } from "../repositories/authorization.repository";
import { CommonRepository } from "../repositories/common.repository";
import { UsersRepository } from "../repositories/users.repository";
import { AuthorizationModel } from "../models/authorization.model";
import { celebrate } from "celebrate";

const router = Express.Router();
const authorizationRepository = new AuthorizationRepository();
const commonRepository = new CommonRepository();
const authorizationServices = new AuthorizationServices(
  authorizationRepository,
  commonRepository
);
const authorizationController = new AuthorizationController(
  authorizationServices
);

const { login, logout, signup, refreshToken, resetPassword } =
  AuthorizationModel;

router.post("/login", celebrate(login), authorizationController.loginUser);
router.get(
  "/logout/:id",
  celebrate(logout),
  authorizationController.logoutUser
);
router.post("/signup", celebrate(signup), authorizationController.signUpUser);
router.patch(
  "/refresh-token",
  celebrate(refreshToken),
  authorizationController.refreshToken
);
router.post(
  "/reset-password",
  celebrate(resetPassword),
  authorizationController.resetPassword
);

export default router;
