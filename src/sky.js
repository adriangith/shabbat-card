import { html, nothing } from 'lit';

export function computeSky(sunElevation, issur, motzei, progress, preview, preShabbat = false) {
  let bg;
  let isNightSky = false;

  if ((issur || preShabbat) && preview === 'off' && sunElevation !== undefined) {
    const elev = parseFloat(sunElevation);
    if (elev < -18) {
      bg = 'linear-gradient(180deg, #0a0a2e 0%, #0d1137 35%, #1a1a4e 70%, #1e2761 100%)';
      isNightSky = true;
    } else if (elev < -6) {
      const t = (elev + 18) / 12;
      const topR = Math.round(10 + t * 16);
      const topG = Math.round(10 + t * 5);
      const topB = Math.round(46 + t * 5);
      const botR = Math.round(30 + t * 170);
      const botG = Math.round(39 + t * 50);
      const botB = Math.round(97 - t * 70);
      bg = `linear-gradient(180deg, rgb(${topR},${topG},${topB}) 0%, #1a1a4e 40%, rgb(${Math.round(45+t*100)},${Math.round(25+t*50)},${Math.round(105-t*40)}) 70%, rgb(${botR},${botG},${botB}) 100%)`;
      isNightSky = true;
    } else if (elev < 0) {
      const t = (elev + 6) / 6;
      const topR = Math.round(26 + t * 80);
      const topG = Math.round(15 + t * 30);
      const topB = Math.round(51 + t * 20);
      bg = `linear-gradient(180deg, rgb(${topR},${topG},${topB}) 0%, rgb(${Math.round(74+t*100)},${Math.round(25+t*60)},${Math.round(66-t*20)}) 30%, rgb(${Math.round(200+t*45)},${Math.round(90+t*60)},${Math.round(23+t*30)}) 60%, rgb(${Math.round(245)},${Math.round(197+t*20)},${Math.round(99+t*30)}) 100%)`;
      isNightSky = t < 0.5;
    } else if (elev < 15) {
      const t = elev / 15;
      bg = `linear-gradient(180deg, rgb(${Math.round(30+t*10)},${Math.round(60+t*22)},${Math.round(114+t*30)}) 0%, rgb(${Math.round(42+t*20)},${Math.round(82+t*30)},${Math.round(152+t*20)}) 40%, rgb(${Math.round(74+t*30)},${Math.round(139+t*20)},${Math.round(194+t*10)}) 70%, rgb(${Math.round(135+t*20)},${Math.round(206+t*10)},${Math.round(235)}) 100%)`;
      isNightSky = false;
    } else {
      bg = 'linear-gradient(180deg, #1e3c72 0%, #2a5298 40%, #4a8bc2 70%, #87CEEB 100%)';
      isNightSky = false;
    }
  } else if (issur || preShabbat) {
    if (progress < 10) { bg = 'linear-gradient(180deg, #1a0533 0%, #4a1942 30%, #c85a17 60%, #f5c563 100%)'; isNightSky = true; }
    else if (progress > 85) { bg = 'linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 40%, #2d1b69 70%, #e8a040 100%)'; isNightSky = true; }
    else { bg = 'linear-gradient(180deg, #0a0a2e 0%, #0d1137 35%, #1a1a4e 70%, #1e2761 100%)'; isNightSky = true; }
  } else if (motzei) {
    bg = 'linear-gradient(180deg, #0d1137 0%, #1a1a4e 40%, #2d2b69 70%, #4a3f8a 100%)';
    isNightSky = true;
  } else {
    bg = 'linear-gradient(180deg, #1e3c72 0%, #2a5298 40%, #4a8bc2 70%, #87CEEB 100%)';
  }

  return { background: bg, isNightSky };
}

export function renderStars(showStars, manyStars) {
  if (!showStars) return nothing;
  const chars = ['\u2726', '\u2727', '\u2726', '\u2727', '\u2726', '\u2727', '\u2726', '\u2727', '\u2726'];
  const count = manyStars ? 9 : 3;
  return html`<div class="sc-stars">
    ${chars.slice(0, count).map(c => html`<span class="sc-star">${c}</span>`)}
  </div>`;
}
