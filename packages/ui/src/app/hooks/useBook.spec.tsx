import { renderHook, waitFor, act } from '@testing-library/react';
import { useBook } from './useBook';
import { bookService } from 'services/book.service';
import type { Book } from '@bookstore/shared-types';

jest.mock('services/book.service', () => ({
  bookService: {
    getBookById: jest.fn(),
  },
}));

// Silence the console.error the hook triggers on failure
const consoleErrorSpy = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('useBook', () => {
  const mockBook: Book = {
    _id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A classic',
    imageUrl: 'http://img',
    isFavorite: false,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('exposes initial state', () => {
    const { result } = renderHook(() => useBook('some-id'));
    expect(result.current.book).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches by id and sets book on success', async () => {
    (bookService.getBookById as jest.Mock).mockResolvedValue({
      book: mockBook,
    });

    const { result } = renderHook(() => useBook('b1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(bookService.getBookById).toHaveBeenCalledWith('b1');
    expect(result.current.book).toEqual(mockBook);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure and keeps book null', async () => {
    (bookService.getBookById as jest.Mock).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useBook('b1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(bookService.getBookById).toHaveBeenCalledWith('b1');
    expect(result.current.book).toBeNull();
    expect(result.current.error).toBe('Failed to fetch the book.');
  });

  it('does not fetch when id is falsy', () => {
    renderHook(() => useBook(''));
    expect(bookService.getBookById).not.toHaveBeenCalled();
  });

  it('refetches when id changes', async () => {
    (bookService.getBookById as jest.Mock)
      .mockResolvedValueOnce({ book: mockBook })
      .mockResolvedValueOnce({
        book: { ...mockBook, _id: 'b2', title: 'Clean Architecture' },
      });

    const { result, rerender } = renderHook(({ id }) => useBook(id), {
      initialProps: { id: 'b1' },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.book?._id).toBe('b1');

    // change id
    rerender({ id: 'b2' });

    // loading becomes true again for the next fetch (effect re-runs)
    // wait for it to settle
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(bookService.getBookById).toHaveBeenCalledTimes(2);
    expect(result.current.book?._id).toBe('b2');
  });
});
