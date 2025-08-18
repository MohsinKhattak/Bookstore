// __tests__/favorite.service.test.ts
import mongoose from 'mongoose';
import { Favorite } from '../models/favorite.model';
import { Book } from '../models/book.model';
import { addFavorite, removeFavorite, listFavorites } from './favorite.service';

// Mock the Mongoose models
jest.mock('../models/book.model', () => ({
  Book: {
    findById: jest.fn(),
  },
}));

jest.mock('../models/favorite.model', () => {
  // constructor function we can inspect
  const FavoriteCtor = jest.fn();
  // attach statics that the service calls
  (FavoriteCtor as any).findOne = jest.fn();
  (FavoriteCtor as any).find = jest.fn();
  return { Favorite: FavoriteCtor };
});

describe('favorite.service', () => {
  const userId = 'user-1';
  const bookId = '64f0c9b4f1f3c2a1b2c3d4e5';

  // ✅ keep a typed spy variable; no casting to SpyInstance on the function itself
  let isValidSpy: jest.SpyInstance<boolean, [any]>;

  beforeEach(() => {
    jest.clearAllMocks();
    isValidSpy = jest.spyOn(mongoose, 'isValidObjectId');
    isValidSpy.mockReturnValue(true);
  });

  afterEach(() => {
    isValidSpy.mockRestore();
  });

  describe('addFavorite', () => {
    it('throws if bookId is invalid', async () => {
      isValidSpy.mockReturnValue(false);

      await expect(addFavorite(userId, 'bad-id')).rejects.toThrow(
        'Invalid book ID'
      );
    });

    it('throws if book not found', async () => {
      (Book.findById as jest.Mock).mockResolvedValue(null);

      await expect(addFavorite(userId, bookId)).rejects.toThrow(
        'Book not found'
      );
      expect(Book.findById).toHaveBeenCalledWith(bookId);
    });

    it('throws if already in favorites', async () => {
      (Book.findById as jest.Mock).mockResolvedValue({ _id: bookId });
      (Favorite.findOne as jest.Mock).mockResolvedValue({ _id: 'fav-1' });

      await expect(addFavorite(userId, bookId)).rejects.toThrow(
        'Book already in favorites'
      );
      expect(Favorite.findOne).toHaveBeenCalledWith({ userId, bookId });
    });

    it('creates and saves a new favorite', async () => {
      (Book.findById as jest.Mock).mockResolvedValue({ _id: bookId });
      (Favorite.findOne as jest.Mock).mockResolvedValue(null);

      const save = jest
        .fn()
        .mockResolvedValue({ _id: 'fav-2', userId, bookId });

      // When `new Favorite({ userId, bookId })` is called, return object with save()
      (Favorite as unknown as jest.Mock).mockImplementation((params) => ({
        ...params,
        _id: 'fav-2',
        save,
      }));

      const result = await addFavorite(userId, bookId);

      expect(Favorite).toHaveBeenCalledWith({ userId, bookId });
      expect(save).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'fav-2', userId, bookId });
    });
  });

  describe('removeFavorite', () => {
    it('throws if bookId is invalid', async () => {
      isValidSpy.mockReturnValue(false);

      await expect(removeFavorite(userId, 'bad-id')).rejects.toThrow(
        'Invalid book ID'
      );
    });

    it('throws if favorite not found', async () => {
      (Favorite.findOne as jest.Mock).mockResolvedValue(null);

      await expect(removeFavorite(userId, bookId)).rejects.toThrow(
        'Favorite not found'
      );
      expect(Favorite.findOne).toHaveBeenCalledWith({ userId, bookId });
    });

    it('deletes and returns the favorite', async () => {
      const mockFav = {
        _id: 'fav-3',
        deleteOne: jest.fn().mockResolvedValue(undefined),
      };
      (Favorite.findOne as jest.Mock).mockResolvedValue(mockFav);

      const result = await removeFavorite(userId, bookId);

      expect(mockFav.deleteOne).toHaveBeenCalled();
      expect(result).toBe(mockFav);
    });
  });

  describe('listFavorites', () => {
    it('returns populated book documents only', async () => {
      const populated = [
        { bookId: { _id: 'b1', title: 'B1' } },
        { bookId: { _id: 'b2', title: 'B2' } },
      ];

      const populate = jest.fn().mockResolvedValue(populated);
      (Favorite.find as jest.Mock).mockReturnValue({ populate });

      const result = await listFavorites(userId);

      expect(Favorite.find).toHaveBeenCalledWith({ userId });
      expect(populate).toHaveBeenCalledWith('bookId');
      expect(result).toEqual([
        { _id: 'b1', title: 'B1' },
        { _id: 'b2', title: 'B2' },
      ]);
    });
  });
});
