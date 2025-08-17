import { Request, Response } from "express";
import * as bookService from "../services/book.service";
import * as fileService from "../services/file.service"

export const addBook = async (req: Request, res: Response) => {
    try {
        const { title, author, description } = req.body;
        if (!title || !author || !description || !req.file) {
            return res.status(400).json({ message: "Please Enter Complete Details" });
        }

        const imagePath = `/uploads/${req.file.filename}`;
        const book = await bookService.createBook({ title, author, description, image: imagePath });

        return res.status(201).json({ message: "Book Added Successfully", book });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const book = await bookService.deleteBookById(req.params.id);
        fileService.deleteFileIfExists(book.image);

        return res.status(200).json({ message: "Book Deleted Successfully" });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookService.getAllBooks({
            title: req.query.title as string,
            author: req.query.author as string,
            userId: req.query.userId as string,
        });

        return res.status(200).json({ message: "Success", books });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        return res.status(200).json({ message: "Success", book });
    } catch (error: any) {
        console.error(error);
        if (error.message === "Invalid book ID") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Book not found") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};