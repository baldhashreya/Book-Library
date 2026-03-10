import { Router } from "express";
import { celebrate } from "celebrate";
import { AuthorController } from "../src/controllers/author.controller";
import { AuthorService } from "../src/services/author.service";
import { AuthorRepository } from "../src/repositories/author.repository";
import { AuthorModel } from "../src/models/author.model";

const { Create, Update, Get, Search } = AuthorModel;
const router = Router();
const authorRepository = new AuthorRepository();
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);

router.post("/", celebrate(Create), authorController.createAuthor);
router.put("/:id", celebrate(Update), authorController.updateAuthor);
router.delete("/:id", celebrate(Get), authorController.deleteAuthor);
router.post("/search", celebrate(Search), authorController.searchAuthors);
router.get("/:id", celebrate(Get), authorController.getAuthorById);

export default router;
