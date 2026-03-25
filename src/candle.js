import { svg, html, nothing } from 'lit';
import { CANDLE_SIZES } from './constants.js';

export function renderCandle(sizeName, progress) {
  const cs = CANDLE_SIZES[sizeName] || CANDLE_SIZES.large;
  const cx = cs.svgW / 2;
  const bodyMinH = Math.max(6, cs.bodyMaxH * 0.1);
  const bodyH = Math.max(bodyMinH, Math.round(cs.bodyMaxH * (1 - progress / 100)));
  const bodyTop = cs.svgH - bodyH - cs.pad;
  const bodyBot = bodyTop + bodyH;

  const flameTop = bodyTop - cs.flameH + 4;
  const wickBot = bodyTop + 2;
  const wickTop = wickBot - cs.wickH;

  const poolRx = cs.poolRxBase;
  const poolRy = 3 + Math.round(progress / 100 * cs.poolGrow);
  const poolCy = bodyBot + poolRy - 2;

  const drips = [];
  if (sizeName !== 'tiny') {
    if (progress > 15) drips.push({ side: -1, dy: 0.18, h: 0.15 });
    if (progress > 30) drips.push({ side: 1, dy: 0.10, h: 0.20 });
    if (progress > 50) drips.push({ side: -1, dy: 0.40, h: 0.25 });
    if (progress > 65) drips.push({ side: 1, dy: 0.55, h: 0.18 });
    if (progress > 80) drips.push({ side: -1, dy: 0.70, h: 0.20 });
    if (progress > 90) drips.push({ side: 1, dy: 0.30, h: 0.30 });
  }

  const wickStroke = sizeName === 'tiny' ? 0.7 : (sizeName === 'compact' ? 0.9 : 1.2);
  const emberR = sizeName === 'tiny' ? 0.8 : (sizeName === 'compact' ? 1 : 1.5);
  const blurStd = sizeName === 'tiny' ? 1.5 : (sizeName === 'compact' ? 2 : 3);

  return svg`
    <svg width="${cs.svgW}" height="${cs.svgH}" viewBox="0 0 ${cs.svgW} ${cs.svgH}">
      <defs>
        <linearGradient id="scWaxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F5E6C8"/>
          <stop offset="30%" stop-color="#FFF8E7"/>
          <stop offset="70%" stop-color="#FFF3D6"/>
          <stop offset="100%" stop-color="#ECD9A0"/>
        </linearGradient>
        <radialGradient id="scFlameGlow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stop-color="#FFD700" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="#FF8C00" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#FF8C00" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="scFlameBody" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFF8E1"/>
          <stop offset="25%" stop-color="#FFE082"/>
          <stop offset="55%" stop-color="#FFB300"/>
          <stop offset="85%" stop-color="#FF6F00"/>
          <stop offset="100%" stop-color="#E65100"/>
        </linearGradient>
        <linearGradient id="scFlameCore" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="30%" stop-color="#E3F2FD"/>
          <stop offset="70%" stop-color="#42A5F5"/>
          <stop offset="100%" stop-color="#1565C0"/>
        </linearGradient>
        <radialGradient id="scPoolGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#FFF8E7"/>
          <stop offset="50%" stop-color="#FFE082"/>
          <stop offset="100%" stop-color="#E6C35C"/>
        </radialGradient>
        <radialGradient id="scAmbient" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#FFD54F" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#FFD54F" stop-opacity="0"/>
        </radialGradient>
        <filter id="scSoftGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${blurStd}"/>
        </filter>
      </defs>

      <ellipse class="sc-ambient" cx="${cx}" cy="${bodyTop - 10}" rx="${cs.svgW * 0.45}" ry="${cs.svgH * 0.3}" fill="url(#scAmbient)"/>

      <rect x="${cx - cs.bodyW/2}" y="${bodyTop}" width="${cs.bodyW}" height="${bodyH}"
        rx="${cs.bodyW/2}" ry="3" fill="url(#scWaxGrad)" stroke="#D4B968" stroke-width="0.5"/>
      <rect x="${cx - cs.bodyW/2 + 1.5}" y="${bodyTop + 2}" width="${cs.hlW}" height="${Math.max(0, bodyH - 6)}"
        rx="1" fill="rgba(255,255,255,0.25)"/>

      ${drips.map(d => {
        const dx = d.side * (cs.bodyW / 2);
        const dripX = cx + dx;
        const dripTop = bodyTop + bodyH * d.dy;
        const dripH = bodyH * d.h;
        return svg`<path d="M${dripX},${dripTop} q${d.side * 1},${dripH * 0.4} ${d.side * cs.bulge},${dripH * 0.7} q${-d.side * 0.5},${dripH * 0.3} ${-d.side * cs.bulge},${dripH * 0.3}" fill="url(#scWaxGrad)" opacity="0.85"/>`;
      })}

      <ellipse cx="${cx}" cy="${poolCy}" rx="${poolRx}" ry="${poolRy}" fill="url(#scPoolGrad)" opacity="0.9"/>
      <ellipse cx="${cx - 1}" cy="${poolCy - 1}" rx="${poolRx * 0.5}" ry="${poolRy * 0.4}" fill="rgba(255,255,255,0.2)"/>

      <path d="M${cx},${wickBot} Q${cx + 0.8},${wickTop + cs.wickH * 0.4} ${cx - 0.4},${wickTop}"
        stroke="#3E2723" stroke-width="${wickStroke}" fill="none" stroke-linecap="round"/>
      <circle cx="${cx - 0.4}" cy="${wickTop}" r="${emberR}" fill="#FF6F00" opacity="0.8"/>

      <ellipse class="sc-fl-glow" cx="${cx}" cy="${flameTop + cs.flameH * 0.55}"
        rx="${cs.flameW * 1.8}" ry="${cs.flameH * 0.8}" fill="url(#scFlameGlow)" filter="url(#scSoftGlow)"/>

      <path class="sc-fl-body" d="M${cx},${flameTop}
        C${cx + cs.flameW},${flameTop + cs.flameH * 0.35}
         ${cx + cs.flameW * 0.7},${flameTop + cs.flameH * 0.85}
         ${cx},${flameTop + cs.flameH}
        C${cx - cs.flameW * 0.7},${flameTop + cs.flameH * 0.85}
         ${cx - cs.flameW},${flameTop + cs.flameH * 0.35}
         ${cx},${flameTop}Z"
        fill="url(#scFlameBody)" opacity="0.95"/>

      <path class="sc-fl-core" d="M${cx},${flameTop + cs.flameH * 0.3}
        C${cx + cs.flameW * 0.35},${flameTop + cs.flameH * 0.5}
         ${cx + cs.flameW * 0.3},${flameTop + cs.flameH * 0.8}
         ${cx},${flameTop + cs.flameH * 0.9}
        C${cx - cs.flameW * 0.3},${flameTop + cs.flameH * 0.8}
         ${cx - cs.flameW * 0.35},${flameTop + cs.flameH * 0.5}
         ${cx},${flameTop + cs.flameH * 0.3}Z"
        fill="url(#scFlameCore)" opacity="0.7"/>
    </svg>
  `;
}

function unlitCandleSvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="14" width="8" height="24" rx="4" fill="url(#ucWax)" stroke="#D4B968" stroke-width="0.5"/>
    <rect x="22" y="16" width="2" height="18" rx="1" fill="rgba(255,255,255,0.25)"/>
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#E6C35C" opacity="0.6"/>
    <path d="M24,14 Q24.8,10 24,8" stroke="#3E2723" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="24" cy="8" r="1.5" fill="#888" opacity="0.4"/>
    <defs>
      <linearGradient id="ucWax" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F5E6C8"/>
        <stop offset="50%" stop-color="#FFF8E7"/>
        <stop offset="100%" stop-color="#ECD9A0"/>
      </linearGradient>
    </defs>
  </svg>`;
}

function sparklesSvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L26 18 L40 20 L26 22 L24 36 L22 22 L8 20 L22 18 Z" fill="#FFD700" opacity="0.9"/>
    <path d="M36 6 L37 12 L43 13 L37 14 L36 20 L35 14 L29 13 L35 12 Z" fill="#FFF8E1" opacity="0.7"/>
    <path d="M10 28 L11 33 L16 34 L11 35 L10 40 L9 35 L4 34 L9 33 Z" fill="#FFF8E1" opacity="0.7"/>
  </svg>`;
}

function majorHolidaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L28 17 L42 17 L31 26 L35 39 L24 31 L13 39 L17 26 L6 17 L20 17 Z"
      fill="#FFD700" opacity="0.9" stroke="#DAA520" stroke-width="0.5"/>
    <path d="M24 10 L26.5 18.5 L36 18.5 L28.5 24.5 L31 33 L24 27.5 L17 33 L19.5 24.5 L12 18.5 L21.5 18.5 Z"
      fill="#FFF8E1" opacity="0.6"/>
  </svg>`;
}

function minorHolidaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="14" fill="none" stroke="#B8860B" stroke-width="1.5" opacity="0.7"/>
    <path d="M24 10 L26 20 L36 22 L26 24 L24 34 L22 24 L12 22 L22 20 Z"
      fill="#DAA520" opacity="0.8"/>
    <circle cx="24" cy="22" r="3" fill="#FFF8E1" opacity="0.5"/>
  </svg>`;
}

function fastDaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="21" y="12" width="6" height="24" rx="3" fill="#888" opacity="0.6"
      stroke="#666" stroke-width="0.5"/>
    <rect x="22.5" y="14" width="1.5" height="16" rx="0.75" fill="rgba(255,255,255,0.2)"/>
    <ellipse cx="24" cy="36" rx="8" ry="2.5" fill="#666" opacity="0.3"/>
    <path d="M24,12 Q24.5,9 24,7" stroke="#555" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  </svg>`;
}

export function renderIcon(sizeName, issur, motzei, progress, showIcon, preShabbat = false, holidayMode, holidayCategory) {
  if (showIcon === false) return nothing;

  // Holiday approaching mode — show category icon
  if (holidayMode === 'approaching' && holidayCategory) {
    const iconFn = holidayCategory === 'major' ? majorHolidaySvg
      : holidayCategory === 'fast' ? fastDaySvg
      : minorHolidaySvg;
    return html`<div class="sc-hero sc-float">${iconFn(48)}</div>`;
  }

  if (issur || preShabbat) {
    return html`<div class="sc-melt-candle">${renderCandle(sizeName, progress)}</div>`;
  } else if (motzei) {
    return html`<div class="sc-hero sc-float">${sparklesSvg(48)}</div>`;
  } else {
    return html`<div class="sc-hero">${unlitCandleSvg(48)}</div>`;
  }
}
