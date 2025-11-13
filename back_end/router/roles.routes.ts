import { Router } from "express";
import { RolesController } from "../src/controllers/roles.controller";
import { RolesRepository } from "../src/repositories/roles.repository";
import { RolesServices } from "../src/services/roles.service";
import { RolesModel } from "../src/models/roles.model";
import { celebrate } from "celebrate";
import { CommonRepository } from "../src/repositories/common.repository";
import { authorizationUser } from "../common/base-controller";

const rolesRepository = new RolesRepository();
const commonRepository = new CommonRepository();
const rolesServices = new RolesServices(rolesRepository, commonRepository);
const rolesController = new RolesController(rolesServices);

const { Create, Update, Get, Search } = RolesModel;

const router = Router();

router.post("/search", celebrate(Search), rolesController.searchRoles);
router.post("/", celebrate(Create), rolesController.createRole);
router.put("/:id", celebrate(Update), rolesController.updateRole);
router.delete("/:id", celebrate(Get), rolesController.deleteRole);
router.get("/:id", celebrate(Get), rolesController.getRoleById);
export default router;
