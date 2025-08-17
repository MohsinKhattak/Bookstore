// components/BookModal.tsx
import { FC, useRef } from "react";
import Button from "components/Button";
import InputBox from "components/InputBox";
import Textarea from "components/Textarea";
import Modal from "./Modal";

interface BookModalProps {
    showModal: boolean;
    onClose: () => void;
    onSubmit: () => void;
    newBook: { title: string; author: string; description: string; image: File | null };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BookModal: FC<BookModalProps> = ({ showModal, onClose, onSubmit, newBook, handleChange, handleImageChange }) => {
    const fileUploadRef = useRef<HTMLInputElement | null>(null);
    return (
        <Modal show={showModal} onClose={onClose} title="Add Book" SubmitText="Save" onSubmit={onSubmit}>
            <InputBox placeholder="Title" type="text" value={newBook.title} onChange={handleChange} name="title" />
            <InputBox placeholder="Author" type="text" value={newBook.author} onChange={handleChange} name="author" />
            <Textarea placeholder="Description" rows={4} value={newBook.description} onChange={handleChange} name="description" />
            <Button type="button" title="Upload Image" background="light" onClick={() => fileUploadRef.current?.click()} />
            {newBook?.image?.name && (
                <p className="small text-bold ">
                    <span className="text-muted">File Selected:</span> {newBook?.image?.name}
                </p>
            )}
            <input type="file" className="d-none" ref={fileUploadRef} onChange={handleImageChange} />
        </Modal>
    );
};

export default BookModal;
