
import config from "config/config";
import Star from "../assets/svgs/star";

interface BookCardProps {
    title: string;
    author: string;
    image: string;
    isFavorite?: boolean
    onClick?: () => void
    onFavoriteClick?: () => void;
    showFavorite: boolean

}
export default function BookCard({ title, author, image, isFavorite, onClick, onFavoriteClick, showFavorite }: BookCardProps) {

    return (
        <div className="col-12 col-md-6 col-lg-3" onClick={onClick}>
            <div
                className="book-card position-relative rounded overflow-hidden shadow"
                style={{
                    backgroundImage: `url(${config.BASE_URL}${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px',
                    color: 'white'
                }}
            >
                {showFavorite && <div className="book-overlay position-absolute d-flex justify-content-end top-5 right-5 w-100 p-2 bg-transparent"  >
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteClick?.();
                        }}
                        style={{ cursor: "pointer" }}
                    >  <Star fill={isFavorite ? 'gold' : 'white'} size='20' />
                    </span>
                </div>}
                <div className="book-overlay position-absolute bottom-0 w-100 p-2 bg-dark"  >
                    <h5 className="mb-1">{title}</h5>
                    <p className="mb-0 small">{author}</p>
                </div>
            </div>
        </div >
    );
}
