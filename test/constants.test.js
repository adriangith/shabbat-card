import { describe, it, expect } from 'vitest';
import { HOLIDAY_DAYS, FESTIVAL_PERIODS, HOLIDAY_THEMES } from '../src/constants.js';

describe('HOLIDAY_DAYS', () => {
  it('contains entries for all major Yom Tov days', () => {
    const names = HOLIDAY_DAYS.map(h => h.sensorName);
    expect(names).toContain('Pesach');
    expect(names).toContain('Rosh Hashana I');
    expect(names).toContain('Yom Kippur');
    expect(names).toContain('Sukkot');
    expect(names).toContain('Shavuot');
  });

  it('every entry has required fields', () => {
    for (const h of HOLIDAY_DAYS) {
      expect(h).toHaveProperty('month');
      expect(h).toHaveProperty('day');
      expect(h).toHaveProperty('name');
      expect(h).toHaveProperty('category');
      expect(h).toHaveProperty('sensorName');
      expect(['major', 'minor', 'fast']).toContain(h.category);
    }
  });

  it('diasporaOnly entries exist for second days', () => {
    const diaspora = HOLIDAY_DAYS.filter(h => h.diasporaOnly === true);
    expect(diaspora.length).toBeGreaterThan(0);
    const names = diaspora.map(h => h.name);
    expect(names).toContain('Pesach II');
    expect(names).toContain('Pesach VIII');
  });
});

describe('FESTIVAL_PERIODS', () => {
  it('contains multi-day festivals', () => {
    const names = FESTIVAL_PERIODS.map(f => f.name);
    expect(names).toContain('Pesach');
    expect(names).toContain('Sukkot');
    expect(names).toContain('Chanukah');
  });

  it('every entry has start and end dates', () => {
    for (const f of FESTIVAL_PERIODS) {
      expect(f).toHaveProperty('startMonth');
      expect(f).toHaveProperty('startDay');
      expect(f).toHaveProperty('endMonth');
      expect(f).toHaveProperty('endDay');
    }
  });
});

describe('HOLIDAY_THEMES', () => {
  it('has a theme for every unique sensorName and festival', () => {
    const allNames = [
      ...new Set(HOLIDAY_DAYS.map(h => h.festival || h.sensorName)),
    ];
    for (const name of allNames) {
      expect(HOLIDAY_THEMES).toHaveProperty(name);
      expect(HOLIDAY_THEMES[name]).toHaveProperty('gradient');
      expect(HOLIDAY_THEMES[name]).toHaveProperty('category');
    }
  });
});
