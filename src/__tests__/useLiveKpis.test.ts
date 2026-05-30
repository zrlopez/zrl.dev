/**
 * useLiveKpis.test.ts
 * Tests for the useLiveKpis custom hook.
 * Uses fake timers to control setInterval without real waiting.
 */

import { renderHook, act } from '@testing-library/react';
import { useLiveKpis } from '@/app/projects/annotation-dashboard/_components/useLiveKpis';
import { BASE_KPIS } from '@/app/projects/annotation-dashboard/_components/dashboardData';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('useLiveKpis()', () => {
  it('returns BASE_KPIS on initial render', () => {
    const { result } = renderHook(() => useLiveKpis());
    expect(result.current).toEqual(BASE_KPIS);
  });

  it('updates KPIs after one interval tick', () => {
    const { result } = renderHook(() => useLiveKpis(5000));
    const initial = { ...result.current };

    act(() => { jest.advanceTimersByTime(5000); });

    // At least one KPI value should have nudged from the base
    const changed = (
      result.current.totalThroughput      !== initial.totalThroughput ||
      result.current.errorRate            !== initial.errorRate        ||
      result.current.teamEfficiency       !== initial.teamEfficiency   ||
      result.current.capacityUtilization  !== initial.capacityUtilization
    );
    expect(changed).toBe(true);
  });

  it('updates again after a second interval tick', () => {
    const { result } = renderHook(() => useLiveKpis(5000));

    act(() => { jest.advanceTimersByTime(5000); });
    const afterFirst = { ...result.current };

    act(() => { jest.advanceTimersByTime(5000); });
    const afterSecond = { ...result.current };

    // State object reference should differ between ticks
    expect(afterSecond).not.toBe(afterFirst);
  });

  it('respects a custom interval duration', () => {
    const { result } = renderHook(() => useLiveKpis(1000));
    const initial = { ...result.current };

    // Should NOT update before the interval fires
    act(() => { jest.advanceTimersByTime(999); });
    expect(result.current).toEqual(initial);

    // Should update exactly at the interval
    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).not.toBe(initial);
  });

  it('clears the interval on unmount', () => {
    const clearSpy = jest.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useLiveKpis(5000));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('returned KPI numeric values stay in plausible ranges', () => {
    const { result } = renderHook(() => useLiveKpis(5000));

    // Advance several ticks
    act(() => { jest.advanceTimersByTime(25_000); });

    expect(result.current.totalThroughput).toBeGreaterThan(0);
    expect(result.current.errorRate).toBeGreaterThan(0);
    expect(result.current.teamEfficiency).toBeGreaterThan(0);
    expect(result.current.capacityUtilization).toBeGreaterThan(0);
  });

  it('change strings always contain %', () => {
    const { result } = renderHook(() => useLiveKpis(5000));
    act(() => { jest.advanceTimersByTime(5000); });

    expect(result.current.throughputChange).toContain('%');
    expect(result.current.errorRateChange).toContain('%');
    expect(result.current.teamEfficiencyChange).toContain('%');
    expect(result.current.capacityUtilizationChange).toContain('%');
  });
});
