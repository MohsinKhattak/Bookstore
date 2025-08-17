import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  it('starts with showModal as false', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.showModal).toBe(false);
  });

  it('openModal sets showModal to true', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.showModal).toBe(true);
  });

  it('closeModal sets showModal back to false', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.showModal).toBe(false);
  });
});
