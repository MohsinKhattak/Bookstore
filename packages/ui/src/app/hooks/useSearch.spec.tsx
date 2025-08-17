import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';

describe('useSearch', () => {
  it('returns initial empty strings for title and author', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.title).toBe('');
    expect(result.current.author).toBe('');
  });

  it('updates title when setTitle is called', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setTitle('The Hobbit');
    });

    expect(result.current.title).toBe('The Hobbit');
  });

  it('updates author when setAuthor is called', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setAuthor('Tolkien');
    });

    expect(result.current.author).toBe('Tolkien');
  });
});
