export interface Book<TId = string> {
    _id: TId;
    title: string;
    author: string;
    description?: string;
    image: string;
    isFavorite: boolean;
    createdAt?: string;
}
