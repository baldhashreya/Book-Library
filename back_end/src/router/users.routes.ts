import { Router } from "express";
import { UsersRepository } from "../repositories/users.repository";
import { UsersServices } from "../services/users.service";
import { UsersControllers } from "../controllers/users.controller";
import { CommonRepository } from "../repositories/common.repository";
import { UserModel } from "../models/users.model";
import { celebrate } from "celebrate";

const { Create, Update, Get, Search, UpdateStatus } = UserModel;

const router = Router();

const usersRepository = new UsersRepository();
const commonRepository = new CommonRepository();
const usersServices = new UsersServices(usersRepository, commonRepository);
const usersController = new UsersControllers(usersServices);

router.get("/create-users", usersController.createUsers);
router.post("/", celebrate(Create), usersController.createUser);
router.post("/search", celebrate(Search), usersController.searchUsers);
router.get("/:id", celebrate(Get), usersController.getUserById);
router.put("/:id", celebrate(Update), usersController.updateUsers);
router.delete("/:id", celebrate(Get), usersController.deleteUser);
router.patch(
  "/:id/status",
  celebrate(UpdateStatus),
  usersController.updateUserStatus
);
export default router;
