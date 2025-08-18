import { Request, Response } from 'express';
import * as favoriteService from '../services/favorite.service';

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { bookId } = req.body;
    await favoriteService.addFavorite(userId, bookId);
    res.status(201).json({ message: 'Book added to favorites' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const bookId = req.query.bookId as string;
    await favoriteService.removeFavorite(userId, bookId);
    res.status(200).json({ message: 'Book removed from favorites' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const books = await favoriteService.listFavorites(userId);
    res.status(200).json({ message: 'Success', books });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
