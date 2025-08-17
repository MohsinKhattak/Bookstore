import { useState } from "react";

interface NewBook {
    title: string;
    author: string;
    description: string;
    image: File | null;
}

export function useBookForm() {
    const [newBook, setNewBook] = useState<NewBook>({
        title: "",
        author: "",
        description: "",
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setNewBook({ ...newBook, image: file });
    };

    return { newBook, setNewBook, handleChange, handleImageChange };
}
