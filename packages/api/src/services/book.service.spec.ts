import mongoose from 'mongoose';
import { Book } from '../models/book.model';
import { Favorite } from '../models/favorite.model';
import {
  createBook,
  deleteBookById,
  getAllBooks,
  getBookById,
} from './book.service';

// Mock the Mongoose models
jest.mock('../models/book.model');
jest.mock('../models/favorite.model');

describe('Book Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('throws if book with title already exists', async () => {
      (Book.findOne as jest.Mock).mockResolvedValue({ title: 'Existing' });

      await expect(
        createBook({
          title: 'Existing',
          author: 'A',
          description: 'D',
          image: 'img.png',
        })
      ).rejects.toThrow('Book with title:Existing already exists');
    });

    it('creates a new book if not existing', async () => {
      (Book.findOne as jest.Mock).mockResolvedValue(null);
      (Book as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: '1', title: 'New' }),
      }));

      const result = await createBook({
        title: 'New',
        author: 'A',
        description: 'D',
        image: 'img.png',
      });

      expect(result).toHaveProperty('title', 'New');
    });
  });

  describe('deleteBookById', () => {
    it('throws if book not found', async () => {
      (Book.findById as jest.Mock).mockResolvedValue(null);

      await expect(deleteBookById('123')).rejects.toThrow('No Such Book Found');
    });

    it('deletes and returns book if found', async () => {
      const mockBook = { deleteOne: jest.fn(), title: 'DeleteMe' };
      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      const result = await deleteBookById('123');

      expect(mockBook.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('getAllBooks', () => {
    it('returns books with favorites marked', async () => {
      (Book.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: 'b1', title: 'Book1' }]),
      });
      (Favorite.find as jest.Mock).mockResolvedValue([{ bookId: 'b1' }]);

      const result = await getAllBooks({ userId: 'u1' });

      expect(result[0]).toMatchObject({ _id: 'b1', isFavorite: true });
    });
  });

  describe('getBookById', () => {
    it('throws if invalid object id', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      await expect(getBookById('bad-id')).rejects.toThrow('Invalid book ID');
    });

    it('throws if book not found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      (Book.findById as jest.Mock).mockResolvedValue(null);

      await expect(getBookById('id123')).rejects.toThrow('Book not found');
    });

    it('returns book if found', async () => {
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
      (Book.findById as jest.Mock).mockResolvedValue({
        _id: 'id123',
        title: 'Book1',
      });

      const result = await getBookById('id123');

      expect(result).toHaveProperty('title', 'Book1');
    });
  });
});
