interface BookImageProps {
    image: string;
    title: string;
}

const BookImage: React.FC<BookImageProps> = ({ image, title }) => (
    <div className="col-md-4">
        <img
            src={image}
            alt={title}
            className="img-fluid rounded shadow"
        />
    </div>
);

export default BookImage;
