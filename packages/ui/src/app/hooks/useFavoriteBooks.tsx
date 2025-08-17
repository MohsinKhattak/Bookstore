import { useState, useEffect } from "react";
import { bookService } from "services/book.service";
import { toast } from "react-toastify";
import { Book } from '@bookstore/shared-types';

export default function useFavoriteBooks() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchFavoriteBooks();
    }, []);

    const fetchFavoriteBooks = async () => {
        try {
            const response = await bookService.getFavoriteBooks();
            const booksWithFavorite = response.books.map((book: Book) => ({
                ...book,
                isFavorite: true,
            }));
            setBooks(booksWithFavorite);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleFavorite = async (bookId: string, isCurrentlyFavorite: boolean) => {
        try {
            if (isCurrentlyFavorite) {
                await bookService.deleteFavorite(bookId);
                toast.info("Removed from favorites");
                setBooks((prev) => prev.filter((book) => book._id !== bookId));
            } else {
                await bookService.addFavorite(bookId);
                toast.success("Added to favorites");
            }

            setBooks((prev) =>
                prev.map((book) =>
                    book._id === bookId ? { ...book, isFavorite: !isCurrentlyFavorite } : book
                )
            );
        } catch (error: any) {
            toast.error("Something went wrong while updating favorites");
            console.log(error);
        }
    };

    return { books, toggleFavorite };
}
