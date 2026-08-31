/**
 * Tests for the useLiveKpis custom hook.
 * Adapted from main (Jest) for Vitest fake timers.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLiveKpis } from '~/routes/projects.annotation-dashboard/dashboard/useLiveKpis';
import { BASE_KPIS } from '~/routes/projects.annotation-dashboard/dashboard/dashboardData';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useLiveKpis()', () => {
  it('returns BASE_KPIS on initial render', () => {
    const { result } = renderHook(() => useLiveKpis());
    expect(result.current).toEqual(BASE_KPIS);
  });

  it('updates KPIs after one interval tick', () => {
    const { result } = renderHook(() => useLiveKpis(5000));
    const initial = { ...result.current };

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const changed =
      result.current.totalThroughput !== initial.totalThroughput ||
      result.current.errorRate !== initial.errorRate ||
      result.current.teamEfficiency !== initial.teamEfficiency ||
      result.current.capacityUtilization !== initial.capacityUtilization;
    expect(changed).toBe(true);
  });

  it('updates again after a second interval tick', () => {
    const { result } = renderHook(() => useLiveKpis(5000));

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const afterFirst = { ...result.current };

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const afterSecond = { ...result.current };

    expect(afterSecond).not.toEqual(afterFirst);
  });

  it('respects a custom interval duration', () => {
    const { result } = renderHook(() => useLiveKpis(1000));
    const initial = { ...result.current };

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toEqual(initial);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).not.toEqual(initial);
  });

  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useLiveKpis(5000));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('returned KPI numeric values stay in plausible ranges', () => {
    const { result } = renderHook(() => useLiveKpis(5000));

    act(() => {
      vi.advanceTimersByTime(25_000);
    });

    expect(result.current.totalThroughput).toBeGreaterThan(0);
    expect(result.current.errorRate).toBeGreaterThan(0);
    expect(result.current.teamEfficiency).toBeGreaterThan(0);
    expect(result.current.capacityUtilization).toBeGreaterThan(0);
  });
});
