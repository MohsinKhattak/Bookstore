import jwt from "jsonwebtoken";
import { UserPayload } from "../types/interface";
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
}

const TOKEN_EXPIRY = "7d";

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRY,
    });
};

export const verifyToken = (token: string): UserPayload => {
    return jwt.verify(token, process.env.SECRET_KEY as string) as UserPayload;
};

