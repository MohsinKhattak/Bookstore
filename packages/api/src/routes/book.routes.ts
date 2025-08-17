import { Router } from "express";
import { addBook, deleteBook, getBooks, getBookById } from "../controllers/book.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { upload } from "../config/upload.config";

const router: Router = Router();

router.post("/add", authenticate, upload.single("file"), addBook);
router.delete("/:id", authenticate, deleteBook);
router.get("/", getBooks);
router.get("/:id", getBookById);

export default router;
