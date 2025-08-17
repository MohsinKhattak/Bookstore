import { Book } from '@bookstore/shared-types';
import { useState, useEffect } from "react";
import { bookService } from "services/book.service";

export function useBook(id: string) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await bookService.getBookById(id);
                setBook(response?.book || null);
            } catch (err) {
                setError("Failed to fetch the book.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id]);

    return { book, loading, error };
}
