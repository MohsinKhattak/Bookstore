import { renderHook, act } from '@testing-library/react';
import { useBookForm } from './useBookForm';
import { File } from 'buffer';

describe('useBookForm', () => {
  it('initializes with empty values', () => {
    const { result } = renderHook(() => useBookForm());

    expect(result.current.newBook).toEqual({
      title: '',
      author: '',
      description: '',
      image: null,
    });
  });

  it('handleChange updates text fields', () => {
    const { result } = renderHook(() => useBookForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'title', value: 'Clean Code' },
      } as any);
    });
    expect(result.current.newBook.title).toBe('Clean Code');

    act(() => {
      result.current.handleChange({
        target: { name: 'author', value: 'Robert C. Martin' },
      } as any);
    });
    expect(result.current.newBook.author).toBe('Robert C. Martin');

    act(() => {
      result.current.handleChange({
        target: {
          name: 'description',
          value: 'A book about writing cleaner code.',
        },
      } as any);
    });
    expect(result.current.newBook.description).toBe(
      'A book about writing cleaner code.'
    );
  });

  it('handleImageChange sets image and preserves other fields', () => {
    const { result } = renderHook(() => useBookForm());

    // pre-fill some fields
    act(() => {
      result.current.handleChange({
        target: { name: 'title', value: 'T' },
      } as any);
      result.current.handleChange({
        target: { name: 'author', value: 'A' },
      } as any);
    });

    const file = new File([new Blob(['x'])], 'cover.png', {
      type: 'image/png',
    });

    act(() => {
      result.current.handleImageChange({
        target: { files: [file] },
      } as any);
    });

    expect(result.current.newBook.image).toBe(file);
    expect(result.current.newBook.title).toBe('T');
    expect(result.current.newBook.author).toBe('A');
  });

  it('handleImageChange does nothing when no file selected', () => {
    const { result } = renderHook(() => useBookForm());

    act(() => {
      result.current.handleImageChange({
        target: { files: [] },
      } as any);
    });

    expect(result.current.newBook.image).toBeNull();
  });

  it('supports setting the full object via setNewBook', () => {
    const { result } = renderHook(() => useBookForm());
    const file = new File([new Blob(['y'])], 'another.png', {
      type: 'image/png',
    });

    act(() => {
      result.current.setNewBook({
        title: 'New',
        author: 'Someone',
        description: 'Desc',
        image: file,
      });
    });

    expect(result.current.newBook).toEqual({
      title: 'New',
      author: 'Someone',
      description: 'Desc',
      image: file,
    });
  });
});
