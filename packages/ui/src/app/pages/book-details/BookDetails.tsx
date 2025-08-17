// pages/BookDetails.tsx
import { useParams } from "react-router-dom";
import { useBook } from "hooks/useBook";
import BookImage from "components/BookImage";
import BookInfo from "components/BookInfo";
import config from "config/config";

export default function BookDetails() {
    const { id } = useParams<{ id: string }>();
    const { book, loading, error } = useBook(id || "");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!book) return <p className="text-center mt-5">Book not found.</p>;

    return (
        <div className="container mt-5">
            <div className="row">
                <BookImage image={`${config.BASE_URL}${book.image}`} title={book.title} />
                <BookInfo title={book.title} author={book.author} description={book.description} />
            </div>
        </div>
    );
}
