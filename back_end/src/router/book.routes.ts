import { Router } from "express";
import { celebrate } from "celebrate";
import { BookController } from "../controllers/book.controller";
import { BooksService } from "../services/book.service";
import { BooksRepository } from "../repositories/book.repository";
import { BooksModel } from "../models/book.model";

const { Create, Update, Get, Search, AssignBook } = BooksModel;

const router = Router();
const booksRepository = new BooksRepository();
const booksService = new BooksService(booksRepository);
const booksController = new BookController(booksService);

router.post("/", celebrate(Create), booksController.createBook);
router.put("/:id", celebrate(Update), booksController.updateBook);
router.delete("/:id", celebrate(Get), booksController.deleteBook);
router.post("/search", celebrate(Search), booksController.searchBooks);
router.get("/:id", celebrate(Get), booksController.getBookById);
router.post(
  "/:id/assign-book",
  celebrate(AssignBook),
  booksController.assignBook
);

export default router;
