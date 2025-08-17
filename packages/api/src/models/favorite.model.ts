import mongoose, { Schema } from "mongoose";
import { IFavorite } from "../types/interface";



const favoriteSchema = new Schema<IFavorite>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
