import { renderHook, act, waitFor } from '@testing-library/react';
import { useBooks } from './useBooks';
import { bookService } from 'services/book.service';
import { File } from 'buffer';

const mockToast = {
  success: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock('services/book.service', () => ({
  bookService: {
    getBooks: jest.fn(),
    addBook: jest.fn(),
    addFavorite: jest.fn(),
    deleteFavorite: jest.fn(),
    getFavoriteBooks: jest.fn(), // not used here, but exists on service
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: (...args: any[]) => mockToast.success(...args),
    info: (...args: any[]) => mockToast.info(...args),
    error: (...args: any[]) => mockToast.error(...args),
  },
}));

describe('useBooks', () => {
  const api = bookService as jest.Mocked<typeof bookService>;
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  const u1 = { _id: 'u1', name: 'Alice', email: 'a@a.com' } as any;

  const b1 = {
    _id: 'b1',
    title: 'T1',
    author: 'A1',
    description: 'D1',
    isFavorite: false,
  } as any;
  const b2 = {
    _id: 'b2',
    title: 'T2',
    author: 'A2',
    description: 'D2',
    isFavorite: true,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  it('fetches books on mount without userId when currentUser is null', async () => {
    api.getBooks.mockResolvedValue({ books: [b1, b2] });

    const { result } = renderHook(() => useBooks(null, '', ''));

    await waitFor(() => expect(result.current.books).toHaveLength(2));
    expect(api.getBooks).toHaveBeenCalledTimes(1);
    expect(api.getBooks).toHaveBeenCalledWith({ title: '', author: '' });
    expect(result.current.books).toEqual([b1, b2]);
  });

  it('includes userId in filters when currentUser is provided', async () => {
    api.getBooks.mockResolvedValue({ books: [b1] });

    const { result } = renderHook(() => useBooks(u1, 'x', 'y'));

    await waitFor(() => expect(result.current.books).toHaveLength(1));
    expect(api.getBooks).toHaveBeenCalledWith({
      title: 'x',
      author: 'y',
      userId: 'u1',
    });
  });

  it('re-fetches when title/author change', async () => {
    api.getBooks.mockResolvedValueOnce({ books: [b1] }); // initial call
    api.getBooks.mockResolvedValueOnce({ books: [b2] }); // after change

    const { result, rerender } = renderHook(
      ({ user, title, author }) => useBooks(user, title, author),
      { initialProps: { user: null as any, title: 'one', author: 'a' } }
    );

    await waitFor(() => expect(result.current.books).toEqual([b1]));
    expect(api.getBooks).toHaveBeenLastCalledWith({
      title: 'one',
      author: 'a',
    });

    rerender({ user: null, title: 'two', author: 'b' });

    await waitFor(() => expect(result.current.books).toEqual([b2]));
    expect(api.getBooks).toHaveBeenLastCalledWith({
      title: 'two',
      author: 'b',
    });
    expect(api.getBooks).toHaveBeenCalledTimes(2);
  });

  it('toggleFavorite removes favorite and shows info when currently favorite', async () => {
    api.getBooks.mockResolvedValue({ books: [b2] }); // b2 isFavorite true
    api.deleteFavorite.mockResolvedValue();

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toHaveLength(1));

    await act(async () => {
      await result.current.toggleFavorite('b2', true);
    });

    expect(api.deleteFavorite).toHaveBeenCalledWith('b2');
    expect(mockToast.info).toHaveBeenCalledWith('Removed from favorites');
    expect(result.current.books[0]).toMatchObject({
      _id: 'b2',
      isFavorite: false,
    });
  });

  it('toggleFavorite adds favorite and shows success when currently not favorite', async () => {
    api.getBooks.mockResolvedValue({ books: [b1] }); // b1 isFavorite false
    api.addFavorite.mockResolvedValue();

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toHaveLength(1));

    await act(async () => {
      await result.current.toggleFavorite('b1', false);
    });

    expect(api.addFavorite).toHaveBeenCalledWith('b1');
    expect(mockToast.success).toHaveBeenCalledWith('Added to favorites');
    expect(result.current.books[0]).toMatchObject({
      _id: 'b1',
      isFavorite: true,
    });
  });

  it('toggleFavorite shows error toast on failure', async () => {
    api.getBooks.mockResolvedValue({ books: [b1] });
    api.addFavorite.mockRejectedValue(new Error('nope'));

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toHaveLength(1));

    await act(async () => {
      await result.current.toggleFavorite('b1', false);
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      'Something went wrong while updating favorites'
    );
    expect(logSpy).toHaveBeenCalled(); // from catch branch
  });

  it('addBook validates required fields and shows info without calling API', async () => {
    const file = null; // missing file
    const newBook = { title: 'T', author: 'A', description: 'D', image: file };

    api.getBooks.mockResolvedValue({ books: [] });

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toEqual([]));

    await act(async () => {
      await result.current.addBook(newBook);
    });

    expect(mockToast.info).toHaveBeenCalledWith('All fields are required');
    expect(api.addBook).not.toHaveBeenCalled();
  });

  it('addBook success appends book and shows success', async () => {
    api.getBooks.mockResolvedValue({ books: [b1] });

    const created = {
      _id: 'b3',
      title: 'New',
      author: 'Auth',
      description: 'Desc',
      isFavorite: false,
    } as any;
    api.addBook.mockResolvedValue({ book: created });

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toEqual([b1]));

    const file = new File([new Blob(['x'])], 'cover.png', {
      type: 'image/png',
    });
    await act(async () => {
      await result.current.addBook({
        title: 'New',
        author: 'Auth',
        description: 'Desc',
        image: file,
      });
    });

    expect(api.addBook).toHaveBeenCalledWith({
      title: 'New',
      author: 'Auth',
      description: 'Desc',
      image: file,
    });
    expect(result.current.books.map((b) => b._id)).toEqual(['b1', 'b3']);
    expect(mockToast.success).toHaveBeenCalledWith('Book Added Successfully');
  });

  it('addBook shows conflict message (409)', async () => {
    api.getBooks.mockResolvedValue({ books: [] });

    const err: any = new Error('conflict');
    err.response = { status: 409 };
    api.addBook.mockRejectedValue(err);

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toEqual([]));

    const file = new File([new Blob(['x'])], 'cover.png', {
      type: 'image/png',
    });
    await act(async () => {
      await result.current.addBook({
        title: 'New',
        author: 'Auth',
        description: 'Desc',
        image: file,
      });
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      'Book with same name already exists'
    );
  });

  it('addBook shows generic error and logs', async () => {
    api.getBooks.mockResolvedValue({ books: [] });

    const err = new Error('server down');
    api.addBook.mockRejectedValue(err);

    const { result } = renderHook(() => useBooks(null, '', ''));
    await waitFor(() => expect(result.current.books).toEqual([]));

    const file = new File([new Blob(['x'])], 'cover.png', {
      type: 'image/png',
    });
    await act(async () => {
      await result.current.addBook({
        title: 'New',
        author: 'Auth',
        description: 'Desc',
        image: file,
      });
    });

    expect(mockToast.error).toHaveBeenCalledWith('Error Creating Book');
    expect(logSpy).toHaveBeenCalledWith(err);
  });
});
