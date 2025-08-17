import { UserPayload } from "./interface";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

// This is needed so TypeScript treats it as a module
export { };
