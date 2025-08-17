import fs from "fs";
import path from "path";

export const deleteFileIfExists = (relativePath: string) => {
    const fullPath = path.join(__dirname, "..", relativePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};
