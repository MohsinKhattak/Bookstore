import { useState } from "react";

export function useSearch() {
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    return { title, setTitle, author, setAuthor };
}
