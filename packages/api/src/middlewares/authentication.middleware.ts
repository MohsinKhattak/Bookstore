import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utility/jwt.util";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }

    try {
        req.user = verifyToken(token);
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
