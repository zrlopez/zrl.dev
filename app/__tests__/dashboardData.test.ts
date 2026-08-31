/**
 * Unit tests for annotation dashboard seed data and KPI constants.
 * Adapted from main (Jest) for Vitest on the Remix revamp.
 */

import { describe, it, expect } from 'vitest';
import {
  BASE_KPIS,
  SEED_DATA,
  type Kpis,
} from '~/routes/projects.annotation-dashboard/dashboard/dashboardData';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(str: string): boolean {
  return ISO_DATE_RE.test(str) && !isNaN(Date.parse(str));
}

describe('BASE_KPIS', () => {
  it('has all required KPI keys', () => {
    const keys: (keyof Kpis)[] = [
      'totalThroughput',
      'throughputChange',
      'errorRate',
      'errorRateChange',
      'teamEfficiency',
      'teamEfficiencyChange',
      'capacityUtilization',
      'capacityUtilizationChange',
    ];
    keys.forEach(k => expect(BASE_KPIS).toHaveProperty(k));
  });

  it('has numeric throughput above zero', () => {
    expect(BASE_KPIS.totalThroughput).toBeGreaterThan(0);
  });

  it('has error rate between 0 and 100', () => {
    expect(BASE_KPIS.errorRate).toBeGreaterThanOrEqual(0);
    expect(BASE_KPIS.errorRate).toBeLessThanOrEqual(100);
  });

  it('has team efficiency between 0 and 100', () => {
    expect(BASE_KPIS.teamEfficiency).toBeGreaterThan(0);
    expect(BASE_KPIS.teamEfficiency).toBeLessThanOrEqual(100);
  });

  it('has capacity utilization between 0 and 100', () => {
    expect(BASE_KPIS.capacityUtilization).toBeGreaterThan(0);
    expect(BASE_KPIS.capacityUtilization).toBeLessThanOrEqual(100);
  });

  it('change strings are non-empty and contain %', () => {
    const changeKeys: (keyof Kpis)[] = [
      'throughputChange',
      'errorRateChange',
      'teamEfficiencyChange',
      'capacityUtilizationChange',
    ];
    changeKeys.forEach(k => {
      expect(typeof BASE_KPIS[k]).toBe('string');
      expect(BASE_KPIS[k] as string).toContain('%');
    });
  });
});

describe('SEED_DATA.throughputData', () => {
  it('has 24 hourly data points', () => {
    expect(SEED_DATA.throughputData.hourly).toHaveLength(24);
  });

  it('hourly entries have time and positive value', () => {
    SEED_DATA.throughputData.hourly.forEach(({ time, value }) => {
      expect(typeof time).toBe('string');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('has 25 daily data points with valid ISO dates', () => {
    expect(SEED_DATA.throughputData.daily).toHaveLength(25);
    SEED_DATA.throughputData.daily.forEach(({ date }) => {
      expect(isValidIsoDate(date)).toBe(true);
    });
  });

  it('daily dates are in ascending order', () => {
    const dates = SEED_DATA.throughputData.daily.map(d => d.date);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] >= dates[i - 1]).toBe(true);
    }
  });

  it('byProcess entries sum to approximately 100%', () => {
    const total = SEED_DATA.throughputData.byProcess.reduce(
      (s, p) => s + p.percentage,
      0
    );
    expect(total).toBeCloseTo(100, 0);
  });
});

describe('SEED_DATA.errorData', () => {
  it('has 25 trend data points with valid ISO dates', () => {
    expect(SEED_DATA.errorData.trends).toHaveLength(25);
    SEED_DATA.errorData.trends.forEach(({ date }) => {
      expect(isValidIsoDate(date)).toBe(true);
    });
  });

  it('resolution time average is less than target', () => {
    const { average, target } = SEED_DATA.errorData.resolutionTime;
    expect(average).toBeLessThan(target);
  });

  it('byType entries have positive resolution times', () => {
    SEED_DATA.errorData.resolutionTime.byType.forEach(({ time }) => {
      expect(time).toBeGreaterThan(0);
    });
  });
});

describe('SEED_DATA.teamData', () => {
  it('has at least one team member', () => {
    expect(SEED_DATA.teamData.members.length).toBeGreaterThan(0);
  });

  it('each member has productivity between 0 and 100', () => {
    SEED_DATA.teamData.members.forEach(({ productivity }) => {
      expect(productivity).toBeGreaterThan(0);
      expect(productivity).toBeLessThanOrEqual(100);
    });
  });

  it('each member has a non-empty name and avatar', () => {
    SEED_DATA.teamData.members.forEach(({ name, avatar }) => {
      expect(name.length).toBeGreaterThan(0);
      expect(avatar.length).toBeGreaterThan(0);
    });
  });

  it('has 25 productivity data points with valid ISO dates', () => {
    expect(SEED_DATA.teamData.productivity).toHaveLength(25);
    SEED_DATA.teamData.productivity.forEach(({ date }) => {
      expect(isValidIsoDate(date)).toBe(true);
    });
  });
});

describe('SEED_DATA.capacityData', () => {
  it('forecast entries have future dates', () => {
    const today = new Date().toISOString().slice(0, 10);
    SEED_DATA.capacityData.forecast.forEach(({ date }) => {
      expect(date > today).toBe(true);
    });
  });

  it('forecast entries have null actual values', () => {
    SEED_DATA.capacityData.forecast.forEach(({ actual }) => {
      expect(actual).toBeNull();
    });
  });

  it('historical entries have non-null actual values', () => {
    SEED_DATA.capacityData.historical.forEach(({ actual }) => {
      expect(actual).not.toBeNull();
    });
  });

  it('bottlenecks have valid severity levels', () => {
    const valid = new Set(['low', 'medium', 'high']);
    SEED_DATA.capacityData.bottlenecks.forEach(({ severity }) => {
      expect(valid.has(severity)).toBe(true);
    });
  });

  it('bottleneck utilization is between 0 and 100', () => {
    SEED_DATA.capacityData.bottlenecks.forEach(({ utilization }) => {
      expect(utilization).toBeGreaterThan(0);
      expect(utilization).toBeLessThanOrEqual(100);
    });
  });
});

describe('SEED_DATA.alertsData', () => {
  it('active alerts have valid priority levels', () => {
    const valid = new Set(['low', 'medium', 'high']);
    SEED_DATA.alertsData.active.forEach(({ priority }) => {
      expect(valid.has(priority)).toBe(true);
    });
  });

  it('active alerts have valid status values', () => {
    const valid = new Set(['active', 'acknowledged', 'resolved']);
    SEED_DATA.alertsData.active.forEach(({ status }) => {
      expect(valid.has(status)).toBe(true);
    });
  });

  it('thresholds have current values below threshold when status is ok', () => {
    SEED_DATA.alertsData.thresholds
      .filter(t => t.status === 'ok')
      .forEach(({ threshold, current }) => {
        expect(current).toBeLessThan(threshold);
      });
  });

  it('has 5 alert history entries with valid ISO dates', () => {
    expect(SEED_DATA.alertsData.history).toHaveLength(5);
    SEED_DATA.alertsData.history.forEach(({ date }) => {
      expect(isValidIsoDate(date)).toBe(true);
    });
  });
});
