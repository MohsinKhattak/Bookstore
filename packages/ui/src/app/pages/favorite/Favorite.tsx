import { useNavigate } from "react-router-dom";
import BookCard from "components/BookCard";
import useFavoriteBooks from "hooks/useFavoriteBooks";
import { Book } from '@bookstore/shared-types';


export default function Favorites() {
    const navigate = useNavigate();
    const { books, toggleFavorite } = useFavoriteBooks();

    return (
        <div className="d-flex flex-column align-items-center w-100 min-vh-100 p-5">
            <div className="col-12 d-flex align-items-center justify-content-start py-3">
                <h1>Favorites</h1>
            </div>
            <div className="col-12 flex-grow-1 d-flex flex-column">
                {books.length > 0 ? (
                    <div className="row g-3 mt-5">
                        {books.map((item: Book, index: number) => (
                            <BookCard
                                key={index}
                                title={item.title}
                                author={item.author}
                                image={item.image}
                                isFavorite={item.isFavorite}
                                onFavoriteClick={() => toggleFavorite(item._id, item.isFavorite ?? false)}
                                showFavorite={true}
                                onClick={() => navigate(`/book/${item._id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No Books Found</p>
                )}
            </div>
        </div>
    );
}