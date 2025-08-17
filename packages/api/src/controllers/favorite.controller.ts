import { Request, Response } from "express";
import { Favorite } from "../models/favorite.model";
import { Book } from "../models/book.model";

export const addFavorite = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.body;
        const userId = req.user?.id;

        if (!bookId) {
            return res
                .status(400)
                .json({ message: "Please Select A Book To Add To Favorite" });
        }

        const bookExists = await Book.findById(bookId);
        if (!bookExists) {
            return res.status(404).json({ message: "Book not found" });
        }

        const favoriteExists = await Favorite.findOne({ bookId, userId });
        if (favoriteExists) {
            return res
                .status(409)
                .json({ message: `Book is already in your favorites` });
        }

        const newFavorite = new Favorite({
            userId,
            bookId,
        });

        await newFavorite.save();

        return res.status(201).json({ message: "Book is now in your favorites" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteFavorite = async (
    req: Request,
    res: Response
) => {
    try {
        const { bookId } = req.query;
        const userId = req.user?.id;

        if (!bookId) {
            return res
                .status(400)
                .json({
                    message: "Please Select A Book To Remove From Your Favorite",
                });
        }

        const bookExists = await Book.findById(bookId);
        if (!bookExists) {
            return res.status(404).json({ message: "Book not found" });
        }

        const favorite = await Favorite.findOne({ bookId, userId });
        if (!favorite) {
            return res
                .status(404)
                .json({ message: "This book is not in your favorites" });
        }

        await favorite.deleteOne();

        return res
            .status(201)
            .json({ message: "Book is removed from your favorites", favorite });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserFavorites = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.id;

        const favorites = await Favorite.find({ userId }).populate("bookId");

        const favoriteBooks = favorites.map((fav) => fav.bookId);

        return res.status(200).json({ message: "Success", books: favoriteBooks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
