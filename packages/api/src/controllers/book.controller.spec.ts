// __tests__/book.controller.test.ts
import { addBook, deleteBook, getBooks, getBookById } from './book.controller';
import * as bookService from '../services/book.service';
import * as fileService from '../services/file.service';

// Mock the services your controller calls
jest.mock('../services/book.service');
jest.mock('../services/file.service');

type MockReq = Partial<{
  body: any;
  params: any;
  query: any;
  file?: any;
}>;
type MockRes = {
  status: jest.Mock;
  json: jest.Mock;
};

function mockRes(): MockRes {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res as MockRes;
}

describe('book.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addBook', () => {
    it('400 when details are incomplete (missing fields or file)', async () => {
      const req: MockReq = {
        body: { title: 'T', author: 'A', description: '' },
        file: undefined,
      };
      const res = mockRes();

      await addBook(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please Enter Complete Details',
      });
      expect(bookService.createBook).not.toHaveBeenCalled();
    });

    it('201 when book is created', async () => {
      const req: MockReq = {
        body: { title: 'T', author: 'A', description: 'D' },
        file: { filename: 'img.png' },
      };
      const res = mockRes();

      (bookService.createBook as jest.Mock).mockResolvedValue({
        _id: 'b1',
        title: 'T',
        author: 'A',
        description: 'D',
        image: '/uploads/img.png',
      });

      await addBook(req as any, res as any);

      expect(bookService.createBook).toHaveBeenCalledWith({
        title: 'T',
        author: 'A',
        description: 'D',
        image: '/uploads/img.png',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book Added Successfully',
        book: expect.objectContaining({ _id: 'b1', title: 'T' }),
      });
    });

    it('400 when service throws (message echoed)', async () => {
      const req: MockReq = {
        body: { title: 'T', author: 'A', description: 'D' },
        file: { filename: 'img.png' },
      };
      const res = mockRes();

      (bookService.createBook as jest.Mock).mockRejectedValue(
        new Error('Boom')
      );

      await addBook(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Boom' });
    });
  });

  describe('deleteBook', () => {
    it('200 and deletes file when book is deleted', async () => {
      const req: MockReq = { params: { id: 'id123' } };
      const res = mockRes();

      (bookService.deleteBookById as jest.Mock).mockResolvedValue({
        _id: 'id123',
        image: '/uploads/a.png',
      });

      await deleteBook(req as any, res as any);

      expect(bookService.deleteBookById).toHaveBeenCalledWith('id123');
      expect(fileService.deleteFileIfExists).toHaveBeenCalledWith(
        '/uploads/a.png'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Book Deleted Successfully',
      });
    });

    it('400 when service throws (message echoed)', async () => {
      const req: MockReq = { params: { id: 'id123' } };
      const res = mockRes();

      (bookService.deleteBookById as jest.Mock).mockRejectedValue(
        new Error('No Such Book Found')
      );

      await deleteBook(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No Such Book Found' });
    });
  });

  describe('getBooks', () => {
    it('200 with books payload', async () => {
      const req: MockReq = { query: { title: 'T', author: 'A', userId: 'U' } };
      const res = mockRes();

      (bookService.getAllBooks as jest.Mock).mockResolvedValue([{ _id: 'b1' }]);

      await getBooks(req as any, res as any);

      expect(bookService.getAllBooks).toHaveBeenCalledWith({
        title: 'T',
        author: 'A',
        userId: 'U',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Success',
        books: [{ _id: 'b1' }],
      });
    });

    it('400 when service throws', async () => {
      const req: MockReq = { query: {} };
      const res = mockRes();

      (bookService.getAllBooks as jest.Mock).mockRejectedValue(
        new Error('Oops')
      );

      await getBooks(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Oops' });
    });
  });

  describe('getBookById', () => {
    it('200 when found', async () => {
      const req: MockReq = { params: { id: 'id123' } };
      const res = mockRes();

      (bookService.getBookById as jest.Mock).mockResolvedValue({
        _id: 'id123',
        title: 'Book',
      });

      await getBookById(req as any, res as any);

      expect(bookService.getBookById).toHaveBeenCalledWith('id123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Success',
        book: { _id: 'id123', title: 'Book' },
      });
    });

    it('400 when service throws "Invalid book ID"', async () => {
      const req: MockReq = { params: { id: 'bad' } };
      const res = mockRes();

      (bookService.getBookById as jest.Mock).mockRejectedValue(
        new Error('Invalid book ID')
      );

      await getBookById(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID' });
    });

    it('404 when service throws "Book not found"', async () => {
      const req: MockReq = { params: { id: 'missing' } };
      const res = mockRes();

      (bookService.getBookById as jest.Mock).mockRejectedValue(
        new Error('Book not found')
      );

      await getBookById(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
    });

    it('500 on unexpected error', async () => {
      const req: MockReq = { params: { id: 'id123' } };
      const res = mockRes();

      (bookService.getBookById as jest.Mock).mockRejectedValue(
        new Error('Boom')
      );

      await getBookById(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });
});
