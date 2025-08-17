import { Document, Types } from "mongoose";
import { Book, UserPayload } from '@bookstore/shared-types';


export type IBook = Book<Types.ObjectId> & Document

export interface IFavorite extends Document {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    createdAt: Date;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export type { UserPayload };