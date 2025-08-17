import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/interface";



const bookSchema = new Schema<IBook>({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Book = mongoose.model<IBook>("Book", bookSchema);
