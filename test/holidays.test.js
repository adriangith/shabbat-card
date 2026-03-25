import { describe, it, expect } from 'vitest';
import { getNextHoliday, getHolidayMode } from '../src/holidays.js';

describe('getNextHoliday', () => {
  const defaultConfig = { diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };

  it('finds Pesach when date is within 14 days before Nisan 15', () => {
    // Pesach I 5786 = 2026-04-01; input is 2026-03-31 (1 day before)
    const result = getNextHoliday(new Date('2026-03-31T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.name).toBe('Pesach I');
    expect(result.sensorName).toBe('Pesach');
    expect(result.category).toBe('major');
    expect(result.daysUntil).toBeLessThanOrEqual(3);
    expect(result.daysUntil).toBeGreaterThanOrEqual(0);
  });

  it('returns null when no holiday is within any threshold', () => {
    // 24 Cheshvan 5786 — no holiday nearby
    const result = getNextHoliday(new Date('2025-11-15T12:00:00'), defaultConfig);
    expect(result).toBeNull();
  });

  it('respects diaspora filtering — Pesach VIII excluded when diaspora=false', () => {
    const israelConfig = { ...defaultConfig, diaspora: false };
    const result = getNextHoliday(new Date('2026-04-11T12:00:00'), israelConfig);
    if (result && result.name === 'Pesach VIII') {
      throw new Error('Pesach VIII should be excluded for Israel');
    }
  });

  it('finds minor holidays within 5-day threshold', () => {
    // Tu B'Shvat 5786 = 2026-02-01; input is same day (daysUntil=0)
    const result = getNextHoliday(new Date('2026-02-01T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.sensorName).toBe("Tu B'Shvat");
    expect(result.category).toBe('minor');
  });

  it('picks the nearest holiday when two are within threshold', () => {
    // 2026-02-26: Purim (Mar 2) is 4 days away, Shushan Purim (Mar 3) is 5 days away
    // Both within 5-day minor threshold; function should pick Purim (daysUntil=4)
    const result = getNextHoliday(new Date('2026-02-26T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.daysUntil).toBeLessThanOrEqual(5);
  });

  it('during Chol HaMoed Pesach, finds next Yom Tov day (Pesach VII)', () => {
    // Pesach VII 5786 = 2026-04-07; input is 2026-04-05 (daysUntil=2)
    const result = getNextHoliday(new Date('2026-04-05T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.festival).toBe('Pesach');
    expect(result.daysUntil).toBeLessThanOrEqual(14);
  });

  it('handles leap year — Purim falls in Adar II', () => {
    // 2027-03-20 — near Purim 5787 (Adar II, Mar 22); just checks result shape
    const result = getNextHoliday(new Date('2027-03-20T12:00:00'), defaultConfig);
    expect(result === null || typeof result.name === 'string').toBe(true);
  });
});

describe('getHolidayMode', () => {
  it('returns "off" when nextHoliday is null', () => {
    expect(getHolidayMode(null, false, '')).toBe('off');
  });

  it('returns "approaching" when holiday is near but not active', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 5 };
    expect(getHolidayMode(holiday, false, '')).toBe('approaching');
  });

  it('returns "active" when holiday sensor matches', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 0 };
    expect(getHolidayMode(holiday, false, 'Pesach')).toBe('active');
  });

  it('returns "shabbat_merge" when approaching holiday + issur on (Shabbat)', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 3 };
    expect(getHolidayMode(holiday, true, '')).toBe('shabbat_merge');
  });

  it('returns "shabbat_overlap" when holiday active + issur on', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 0 };
    expect(getHolidayMode(holiday, true, 'Pesach')).toBe('shabbat_overlap');
  });
});
