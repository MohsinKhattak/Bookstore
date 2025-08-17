import { useState, useEffect } from "react";
import { bookService } from "services/book.service";
import { toast } from "react-toastify";
import { Book, User } from '@bookstore/shared-types';



export function useBooks(currentUser: User | null, title: string, author: string) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {

                const filters: { title?: string; author?: string; userId?: string } = { title, author };
                if (currentUser?._id) {
                    filters.userId = currentUser._id;
                }

                const response = await bookService.getBooks(filters);
                setBooks(response?.books || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBooks();
    }, [title, author, currentUser]);

    const toggleFavorite = async (bookId: string, isCurrentlyFavorite: boolean) => {
        try {
            console.log(isCurrentlyFavorite, "thebookiscurently");
            if (isCurrentlyFavorite) {
                await bookService.deleteFavorite(bookId);
                toast.info("Removed from favorites");
            } else {
                await bookService.addFavorite(bookId);
                toast.success("Added to favorites");
            }

            setBooks(prev =>
                prev.map(book =>
                    book._id === bookId ? { ...book, isFavorite: !isCurrentlyFavorite } : book
                )
            );
        } catch (error: any) {
            toast.error("Something went wrong while updating favorites");
            console.log(error);
        }
    };

    const addBook = async (newBook: { title: string; author: string; description: string; image: File | null }) => {
        try {
            if (!newBook.image || !newBook.title || !newBook.author || !newBook.description) {
                toast.info("All fields are required");
                return;
            }

            const response = await bookService.addBook({
                title: newBook.title,
                author: newBook.author,
                description: newBook.description,
                image: newBook.image
            });

            setBooks((prev) => [...prev, response.book]);
            toast.success("Book Added Successfully");
        } catch (error: any) {
            if (error?.response?.status === 409) {
                toast.error("Book with same name already exists");
            } else {
                toast.error("Error Creating Book");
                console.log(error);
            }
        }
    };


    return {
        books,
        toggleFavorite,
        addBook,
    };
}
