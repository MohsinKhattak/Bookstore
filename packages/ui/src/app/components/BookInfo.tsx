interface BookInfoProps {
    title: string;
    author: string;
    description?: string;
}

const BookInfo: React.FC<BookInfoProps> = ({ title, author, description }) => (
    <div className="col-md-8">
        <div className="d-flex align-items-center col-12 justify-content-between">
            <h2 className="col-8">{title}</h2>
        </div>
        <h5 className="text-muted mb-3">by {author}</h5>
        <p>{description}</p>
    </div>
);

export default BookInfo;
