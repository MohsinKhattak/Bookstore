import { FC } from "react";
import InputBox from "components/InputBox";

interface SearchFormProps {
    title: string;
    setTitle: (title: string) => void;
    author: string;
    setAuthor: (author: string) => void;
}

const SearchForm: FC<SearchFormProps> = ({ title, setTitle, author, setAuthor }) => (
    <>
        <InputBox
            type="text"
            placeholder="Search By Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <InputBox
            type="text"
            placeholder="Search By Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
        />
    </>

);

export default SearchForm;
