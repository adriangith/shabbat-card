import { describe, it, expect } from 'vitest';
import { computeState } from '../src/state.js';

function mockHass(overrides = {}) {
  const states = {
    'binary_sensor.jewish_calendar_issur_melacha_in_effect': { state: 'off', attributes: {} },
    'binary_sensor.jewish_calendar_motzei_shabbat_hag': { state: 'off', attributes: {} },
    'sensor.jewish_calendar_upcoming_candle_lighting': { state: '2026-04-03T18:03:00+00:00', attributes: {} },
    'sensor.jewish_calendar_upcoming_havdalah': { state: '2026-04-04T19:00:00+00:00', attributes: {} },
    'sensor.jewish_calendar_parshat_hashavua': { state: 'Tzav', attributes: {} },
    'sensor.jewish_calendar_holiday': { state: '', attributes: {} },
    'sensor.jewish_calendar_date': { state: '5 Nisan 5786', attributes: {} },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
    ...overrides,
  };
  return { states };
}

describe('computeState holiday fields', () => {
  it('includes holidayMode and nextHoliday in returned state', () => {
    const hass = mockHass();
    const config = { preview: 'off', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    const cache = {};
    const state = computeState(hass, config, cache, new Date('2026-03-30T12:00:00'));
    expect(state).toHaveProperty('holidayMode');
    expect(state).toHaveProperty('nextHoliday');
  });

  it('returns holidayMode "off" when no holiday is near', () => {
    const hass = mockHass();
    const config = { preview: 'off', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    const state = computeState(hass, config, {}, new Date('2025-11-15T12:00:00'));
    expect(state.holidayMode).toBe('off');
  });

  it('preview modes include holiday fields', () => {
    const config = { preview: 'holiday_approaching', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    const state = computeState({}, config, {});
    expect(state).toHaveProperty('holidayMode');
    expect(state.holidayMode).toBe('approaching');
  });
});
