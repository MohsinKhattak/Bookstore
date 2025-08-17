import ApiClient from "./apiclient.service";
import { Book } from '@bookstore/shared-types';


interface BookPayload {
    title: string;
    author: string;
    description: string;
    image: File;
}

export const bookService = {
    addBook: async ({ title, author, description, image }: BookPayload): Promise<{ book: Book }> => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("description", description);
        formData.append("file", image);

        const response = await ApiClient.post<{ book: Book }>("/books/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response;
    },


    getBooks: async (filters?: { title?: string; author?: string }): Promise<{ books: Book[] }> => {
        const response = await ApiClient.get<{ books: Book[] }>("/books", filters);
        return response; // Return response containing `books`
    },

    getBookById: async (id: string): Promise<{ book: Book }> => {
        const response = await ApiClient.get<{ book: Book }>(`/books/${id}`);
        return response; // Return response containing `books`
    },

    getFavoriteBooks: async (): Promise<{ books: Book[] }> => {
        const response = await ApiClient.get<{ books: Book[] }>("/favorite");
        return response; // Return response containing `books`
    },

    addFavorite: async (bookId: string): Promise<void> => {
        return ApiClient.post<void>("/favorite", { bookId });
    },

    deleteFavorite: async (bookId: string): Promise<void> => {
        return ApiClient.delete<void>("/favorite", { bookId });
    },
};
