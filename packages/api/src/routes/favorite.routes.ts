import { Router } from "express";
import { authenticate } from "../middlewares/authentication.middleware";
import {
    addFavorite,
    deleteFavorite,
    getUserFavorites,
} from "../controllers/favorite.controller";

const router = Router();

router.post("/", authenticate, addFavorite);
router.delete("/", authenticate, deleteFavorite);
router.get("/", authenticate, getUserFavorites);

export default router;
