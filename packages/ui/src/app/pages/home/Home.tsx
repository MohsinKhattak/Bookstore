import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import { useBooks } from "hooks/useBooks";
import { useSearch } from "hooks/useSearch";
import { useBookForm } from "hooks/useBookForm";
import { useModal } from "hooks/useModal";
import Button from "components/Button";
import BookModal from "components/BookModal";
import SearchForm from "components/SearchForm";
import BookList from "components/BookList";

export default function Home() {
    const { title, setTitle, author, setAuthor } = useSearch();
    const { newBook, handleChange, handleImageChange } = useBookForm();
    const { showModal, openModal, closeModal } = useModal();

    const { currentUser } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { books, toggleFavorite, addBook } = useBooks(currentUser, title, author);

    const handleSubmit = async () => {
        addBook(newBook);
        closeModal();
    };

    return (
        <div className="d-flex flex-column align-items-center w-100 min-vh-100 p-5">
            <div className="col-12 d-flex align-items-center justify-content-start py-3">
                <h1>Home</h1>
            </div>
            <div className="col-12 flex-grow-1 d-flex flex-column">
                <div className="col-12 d-flex justify-content-start gap-3">
                    <SearchForm title={title} setTitle={setTitle} author={author} setAuthor={setAuthor} />
                    <Button type="button" title="Add Book" background="success" onClick={openModal} />
                </div>
                {books.length > 0 ? (
                    <BookList
                        books={books}
                        toggleFavorite={toggleFavorite}
                        currentUser={currentUser}
                        navigate={navigate}
                    />
                ) : (
                    <p>No Books Found</p>
                )}
            </div>
            <BookModal
                showModal={showModal}
                onClose={closeModal}
                onSubmit={handleSubmit}
                newBook={newBook}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
            />
        </div>
    );
}
