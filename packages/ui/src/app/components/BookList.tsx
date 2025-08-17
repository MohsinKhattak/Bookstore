import { FC } from "react";
import BookCard from "components/BookCard";
import { Book, User } from '@bookstore/shared-types';


interface BookListProps {
    books: Book[];
    toggleFavorite: (bookId: string, isCurrentlyFavorite: boolean) => void;
    currentUser: User | null;
    navigate: (path: string) => void;
}

const BookList: FC<BookListProps> = ({ books, toggleFavorite, currentUser, navigate }) => (
    <div className="row g-3 mt-5">
        {books.map((item: Book) => (
            <BookCard
                key={item._id}
                title={item.title}
                author={item.author}
                image={item.image}
                isFavorite={item.isFavorite}
                onFavoriteClick={() => toggleFavorite(item._id, !!item.isFavorite)}
                showFavorite={!!currentUser}
                onClick={() => navigate(`/book/${item._id}`)}
            />
        ))}
    </div>
);

export default BookList;
