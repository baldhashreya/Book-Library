import { Router } from "express";
import { UsersRepository } from "../src/repositories/users.repository";
import { UsersServices } from "../src/services/users.service";
import { UsersControllers } from "../src/controllers/users.controller";
import { CommonRepository } from "../src/repositories/common.repository";
import { UserModel } from "../src/models/users.model";
import { celebrate } from "celebrate";
import { authorizationUser } from "../common/base-controller";

const { Create, Update, Get, Search, UpdateStatus } = UserModel;

const router = Router();

const usersRepository = new UsersRepository();
const commonRepository = new CommonRepository();
const usersServices = new UsersServices(usersRepository, commonRepository);
const usersController = new UsersControllers(usersServices);

router.get("/create-users", usersController.createUsers);
router.post(
  "/",
  authorizationUser,
  celebrate(Create),
  usersController.createUser
);
router.post(
  "/search",
  authorizationUser,
  celebrate(Search),
  usersController.searchUsers
);
router.get(
  "/:id",
  authorizationUser,
  celebrate(Get),
  usersController.getUserById
);
router.put(
  "/:id",
  authorizationUser,
  celebrate(Update),
  usersController.updateUsers
);
router.delete(
  "/:id",
  authorizationUser,
  celebrate(Get),
  usersController.deleteUser
);
router.patch(
  "/:id/status",
  authorizationUser,
  celebrate(UpdateStatus),
  usersController.updateUserStatus
);
export default router;
