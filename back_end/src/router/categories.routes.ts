import { Router } from "express";
import { celebrate } from "celebrate";

import { CategoriesController } from "../controllers/categories.controller";
import { CategoriesService } from "../services/categories.service";
import { CategoriesRepository } from "../repositories/categories.repository";
import { CategoriesModel } from "../models/categories.model";

const { Create, Update, Get, Search, CreateMoreCategories } = CategoriesModel;

const router = Router();
const categoriesRepository = new CategoriesRepository();
const categoriesService = new CategoriesService(categoriesRepository);
const categoriesController = new CategoriesController(categoriesService);

router.post("/", celebrate(Create), categoriesController.createCategory);
router.put("/:id", celebrate(Update), categoriesController.updateCategory);
router.delete("/:id", celebrate(Get), categoriesController.deleteCategory);
router.post("/search", celebrate(Search), categoriesController.searchCategory);
router.get("/:id", celebrate(Get), categoriesController.getCategoryById);
router.post(
  "/create-multiple",
  celebrate(CreateMoreCategories),
  categoriesController.createMoreCategories
);
export default router;
