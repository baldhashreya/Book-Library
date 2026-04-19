import { Router } from "express";
import { celebrate } from "celebrate";
import { BookController } from "../src/controllers/book.controller";
import { BooksService } from "../src/services/book.service";
import { BooksRepository } from "../src/repositories/book.repository";
import { BooksModel } from "../src/models/book.model";
import { authorizationUser } from "common";

const { Create, Update, Get, Search, AssignBook } = BooksModel;

const router = Router();
const booksRepository = new BooksRepository();
const booksService = new BooksService(booksRepository);
const booksController = new BookController(booksService);

router.post("/", authorizationUser, celebrate(Create), booksController.createBook);
router.put("/:id", authorizationUser, celebrate(Update), booksController.updateBook);
router.delete("/:id", authorizationUser, celebrate(Get), booksController.deleteBook);
router.post("/search", authorizationUser, celebrate(Search), booksController.searchBooks);
router.get("/:id", authorizationUser, celebrate(Get), booksController.getBookById);
router.post("/:id/assign-book", authorizationUser, celebrate(AssignBook), booksController.assignBook);

export default router;

