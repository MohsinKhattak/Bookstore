import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_ORIGIN, UPLOADS_DIR } from "./config/contants";
import routes from "./routes";

const app = express();

// Middlewares
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// Routes
app.use("/api", routes);

export default app;
