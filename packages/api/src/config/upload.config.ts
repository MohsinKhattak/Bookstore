import fs from "fs";
import multer from "multer";
import { Request } from "express";
import { UPLOADS_DIR } from "./contants";



if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req: Request, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req: Request, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage });
