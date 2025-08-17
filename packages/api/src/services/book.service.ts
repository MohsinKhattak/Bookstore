import mongoose from "mongoose";
import { Book } from "../models/book.model";
import { Favorite } from "../models/favorite.model";

export const createBook = async ({ title, author, description, image }: { title: string; author: string; description: string; image: string }) => {
    const existing = await Book.findOne({ title });
    if (existing) throw new Error(`Book with title:${title} already exists`);

    const book = new Book({ title, author, description, image });
    return book.save();
};


export const deleteBookById = async (id: string) => {
    const book = await Book.findById(id);
    if (!book) throw new Error("No Such Book Found");

    await book.deleteOne();
    return book;
};

export const getAllBooks = async (filters: { title?: string; author?: string; userId?: string }) => {
    const whereClause: Record<string, any> = {};
    if (filters.title) whereClause.title = new RegExp(filters.title, "i");
    if (filters.author) whereClause.author = new RegExp(filters.author, "i");

    const books = await Book.find(whereClause).lean();

    let favoriteIds: string[] = [];
    if (filters.userId) {
        const favorites = await Favorite.find({ userId: filters.userId });
        favoriteIds = favorites.map(fav => fav.bookId.toString());
    }

    return books.map((book: any) => ({
        ...book,
        isFavorite: favoriteIds.includes(book._id.toString())
    }));
};


export const getBookById = async (id: string) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid book ID");
    }

    const book = await Book.findById(id);
    if (!book) {
        throw new Error("Book not found");
    }

    return book;
};