import mongoose from 'mongoose';
import { Favorite } from '../models/favorite.model';
import { Book } from '../models/book.model';

export async function addFavorite(userId: string, bookId: string) {
  if (!bookId || !mongoose.isValidObjectId(bookId)) {
    throw new Error('Invalid book ID');
  }

  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');

  const exists = await Favorite.findOne({ userId, bookId });
  if (exists) throw new Error('Book already in favorites');

  const fav = new Favorite({ userId, bookId });
  return fav.save();
}

export async function removeFavorite(userId: string, bookId: string) {
  if (!bookId || !mongoose.isValidObjectId(bookId)) {
    throw new Error('Invalid book ID');
  }

  const favorite = await Favorite.findOne({ userId, bookId });
  if (!favorite) throw new Error('Favorite not found');

  await favorite.deleteOne();
  return favorite;
}

export async function listFavorites(userId: string) {
  const favorites = await Favorite.find({ userId }).populate('bookId');
  return favorites.map((f) => f.bookId);
}
