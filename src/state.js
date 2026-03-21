import { ENTITIES, PREVIEW_DATA } from './constants.js';

function getState(hass, entityId) {
  return hass?.states?.[entityId]?.state || '';
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatCountdown(ms) {
  if (ms <= 0) return '0m';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatTargetTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString([], { weekday: 'long' });
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${day} ${time}`;
}

export function computeState(hass, config, cache) {
  const preview = config?.preview || 'off';

  if (preview !== 'off' && PREVIEW_DATA[preview]) {
    return { ...PREVIEW_DATA[preview], error: null };
  }

  const issurState = getState(hass, ENTITIES.issurMelacha);
  if (!issurState || issurState === 'unavailable') {
    return { error: 'Jewish Calendar integration not found. Install it from Settings \u2192 Integrations.' };
  }

  const issur = issurState === 'on';
  const motzei = getState(hass, ENTITIES.motzei) === 'on';
  const holiday = getState(hass, ENTITIES.holiday);
  const hasHoliday = holiday && holiday !== 'unknown' && holiday !== 'unavailable';
  const parsha = getState(hass, ENTITIES.parsha);
  const hebrewDate = getState(hass, ENTITIES.hebrewDate);

  const candleLightingIso = getState(hass, ENTITIES.candleLighting);
  const havdalahIso = getState(hass, ENTITIES.havdalah);
  const candleLightingTs = new Date(candleLightingIso).getTime();
  const havdalahTs = new Date(havdalahIso).getTime();
  const now = Date.now();

  let statusText, statusSubtitle;
  if (issur && hasHoliday) {
    statusText = '\u05D7\u05D2 \u05E9\u05DE\u05D7';
    statusSubtitle = holiday;
  } else if (issur) {
    statusText = '\u05E9\u05D1\u05EA \u05E9\u05DC\u05D5\u05DD';
    statusSubtitle = parsha || '';
  } else if (motzei) {
    statusText = '\u05E9\u05D1\u05D5\u05E2 \u05D8\u05D5\u05D1';
    statusSubtitle = hasHoliday ? holiday : (parsha || '');
  } else {
    statusText = '\u05E9\u05D1\u05EA \u05E9\u05DC\u05D5\u05DD';
    statusSubtitle = parsha || '';
  }

  if (issur) {
    if (!cache.candleLightingTs) {
      if (candleLightingTs > now) {
        const estDuration = hasHoliday ? 26 * 3600000 : 25 * 3600000;
        cache.candleLightingTs = havdalahTs - estDuration;
      } else {
        cache.candleLightingTs = candleLightingTs;
      }
      cache.havdalahTs = havdalahTs;
    }
  } else {
    cache.candleLightingTs = null;
    cache.havdalahTs = null;
  }

  let progress = 0;
  if (issur && cache.candleLightingTs && cache.havdalahTs) {
    const span = cache.havdalahTs - cache.candleLightingTs;
    if (span > 0) {
      progress = Math.max(0, Math.min(100, ((now - cache.candleLightingTs) / span) * 100));
    }
  }

  let countdown, countdownLabel, targetTimeLocal;
  if (issur && cache.havdalahTs) {
    const remaining = cache.havdalahTs - now;
    countdown = remaining > 0 ? formatCountdown(remaining) : '0m';
    countdownLabel = 'Until Havdalah';
    targetTimeLocal = formatTargetTime(havdalahIso);
  } else {
    const remaining = candleLightingTs - now;
    countdown = remaining > 0 ? formatCountdown(remaining) : '';
    countdownLabel = 'Until Candle Lighting';
    targetTimeLocal = formatTargetTime(candleLightingIso);
  }

  const candleLighting = formatTime(candleLightingIso);
  const havdalah = formatTime(havdalahIso);

  return {
    issur, motzei, holiday: hasHoliday ? holiday : '',
    progress, statusText, statusSubtitle,
    countdown, countdownLabel, targetTimeLocal,
    candleLighting, havdalah, hebrewDate,
    error: null,
  };
}

export function buildDataKey(hass) {
  const entityIds = Object.values(ENTITIES);
  return entityIds.map(e => {
    const s = hass?.states?.[e];
    return (s?.state || '') + JSON.stringify(s?.attributes || {});
  }).join('|');
}
