import { HDate, months } from '@hebcal/core';
import { HOLIDAY_DAYS } from './constants.js';

const MONTH_MAP = {
  'Tishrei': months.TISHREI,
  'Cheshvan': months.CHESHVAN,
  'Kislev': months.KISLEV,
  'Tevet': months.TEVET,
  'Shvat': months.SHVAT,
  'Adar': months.ADAR_II,      // resolves to Adar in non-leap, Adar II in leap
  'Adar I': months.ADAR_I,
  'Adar II': months.ADAR_II,
  'Nisan': months.NISAN,
  'Iyyar': months.IYYAR,
  'Sivan': months.SIVAN,
  'Tammuz': months.TAMUZ,
  'Av': months.AV,
  'Elul': months.ELUL,
};

function hebrewToGregorian(hebrewYear, monthName, day) {
  try {
    const monthNum = MONTH_MAP[monthName];
    if (!monthNum) return null;
    const hd = new HDate(day, monthNum, hebrewYear);
    return hd.greg();
  } catch {
    return null;
  }
}

export function getNextHoliday(now, config) {
  const { diaspora = true, major_holiday_lead_days = 14, minor_holiday_lead_days = 5 } = config;
  const hdate = new HDate(now);
  const currentYear = hdate.getFullYear();

  const holidays = HOLIDAY_DAYS.filter(h => {
    if (h.diasporaOnly === true && !diaspora) return false;
    return true;
  });

  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let best = null;

  for (const year of [currentYear, currentYear + 1]) {
    for (const h of holidays) {
      const gregDate = hebrewToGregorian(year, h.month, h.day);
      if (!gregDate) continue;

      const holidayMs = new Date(gregDate.getFullYear(), gregDate.getMonth(), gregDate.getDate()).getTime();
      const daysUntil = Math.round((holidayMs - todayMs) / 86400000);

      if (daysUntil < 0) continue;

      const threshold = h.category === 'major' ? major_holiday_lead_days : minor_holiday_lead_days;
      if (daysUntil > threshold) continue;

      if (!best || daysUntil < best.daysUntil) {
        best = {
          name: h.name,
          category: h.category,
          festival: h.festival,
          sensorName: h.sensorName,
          daysUntil,
          startDate: gregDate,
        };
      }
    }
  }

  return best;
}

export function getHolidayMode(nextHoliday, issur, activeSensorHoliday) {
  if (!nextHoliday) return 'off';

  const sensorName = activeSensorHoliday || '';
  const holidayActive = sensorName && sensorName === nextHoliday.sensorName;

  if (holidayActive && issur) return 'shabbat_overlap';
  if (holidayActive) return 'active';
  if (issur) return 'shabbat_merge';
  return 'approaching';
}
