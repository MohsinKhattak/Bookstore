import { bookService } from './book.service';

// Mock the default-exported ApiClient module that book.service imports
jest.mock('./apiclient.service', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

// Pull the mocked fns for type-safe access
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ApiClient = require('./apiclient.service').default as {
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
};

describe('bookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addBook', () => {
    it('posts multipart form-data with the right fields and headers and returns the response', async () => {
      // Arrange: fake "File" (Blob is fine for FormData in tests)
      const image = new Blob(['img-bytes'], {
        type: 'image/png',
      }) as unknown as File;

      const payload = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'A handbook of agile software craftsmanship.',
        image,
      };

      const serverResponse = {
        book: {
          id: 'b1',
          title: payload.title,
          author: payload.author,
          description: payload.description,
          // …include whatever fields your Book type has
        },
      };

      ApiClient.post.mockResolvedValue(serverResponse);

      // Act
      const result = await bookService.addBook(payload);

      // Assert return value
      expect(result).toEqual(serverResponse);

      // Assert ApiClient.post called correctly
      expect(ApiClient.post).toHaveBeenCalledTimes(1);
      const [url, formData, options] = ApiClient.post.mock.calls[0];
      expect(url).toBe('/books/add');

      // Verify FormData fields
      // NOTE: jsdom FormData supports .get()
      expect(formData instanceof FormData).toBe(true);
      expect(formData.get('title')).toBe(payload.title);
      expect(formData.get('author')).toBe(payload.author);
      expect(formData.get('description')).toBe(payload.description);
      // file will be a Blob; we can check type/name presence loosely
      const fileInForm = formData.get('file') as Blob | null;
      expect(fileInForm).toBeTruthy();
      expect((fileInForm as Blob).type).toBe('image/png');

      // Verify headers
      expect(options).toMatchObject({
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });
  });

  describe('getBooks', () => {
    it('calls GET /books with optional filters and returns the response', async () => {
      const filters = { title: 'Clean', author: 'Martin' };
      const serverResponse = {
        books: [{ id: 'b1', title: 'Clean Code', author: 'Robert C. Martin' }],
      };
      ApiClient.get.mockResolvedValue(serverResponse);

      const result = await bookService.getBooks(filters);

      expect(ApiClient.get).toHaveBeenCalledWith('/books', filters);
      expect(result).toEqual(serverResponse);
    });

    it('calls GET /books with no filters', async () => {
      const serverResponse = { books: [] };
      ApiClient.get.mockResolvedValue(serverResponse);

      const result = await bookService.getBooks();

      expect(ApiClient.get).toHaveBeenCalledWith('/books', undefined);
      expect(result).toEqual(serverResponse);
    });
  });

  describe('getBookById', () => {
    it('calls GET /books/:id and returns the response', async () => {
      const id = 'abc123';
      const serverResponse = { book: { id, title: 'DDD', author: 'Evans' } };
      ApiClient.get.mockResolvedValue(serverResponse);

      const result = await bookService.getBookById(id);

      expect(ApiClient.get).toHaveBeenCalledWith(`/books/${id}`);
      expect(result).toEqual(serverResponse);
    });
  });

  describe('getFavoriteBooks', () => {
    it('calls GET /favorite and returns the response', async () => {
      const serverResponse = {
        books: [{ id: 'fav1', title: 'Refactoring', author: 'Fowler' }],
      };
      ApiClient.get.mockResolvedValue(serverResponse);

      const result = await bookService.getFavoriteBooks();

      expect(ApiClient.get).toHaveBeenCalledWith('/favorite');
      expect(result).toEqual(serverResponse);
    });
  });

  describe('addFavorite', () => {
    it('posts to /favorite with bookId', async () => {
      ApiClient.post.mockResolvedValue(undefined);

      await bookService.addFavorite('b1');

      expect(ApiClient.post).toHaveBeenCalledWith('/favorite', {
        bookId: 'b1',
      });
    });
  });

  describe('deleteFavorite', () => {
    it('deletes from /favorite with bookId', async () => {
      ApiClient.delete.mockResolvedValue(undefined);

      await bookService.deleteFavorite('b1');

      expect(ApiClient.delete).toHaveBeenCalledWith('/favorite', {
        bookId: 'b1',
      });
    });
  });
});
