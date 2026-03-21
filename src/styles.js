import { css } from 'lit';

export const styles = css`
  @keyframes sc-flicker1 {
    0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
    25% { transform: scale(1.05) rotate(1deg); opacity: 1; }
    50% { transform: scale(0.95) rotate(-2deg); opacity: 0.85; }
    75% { transform: scale(1.02) rotate(0.5deg); opacity: 0.95; }
  }
  @keyframes sc-flicker2 {
    0%, 100% { transform: scale(0.95) rotate(1deg); opacity: 0.85; }
    30% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
    60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
    80% { transform: scale(0.98) rotate(-0.5deg); opacity: 0.9; }
  }
  @keyframes sc-glow-anim {
    0%, 100% { filter: blur(4px) brightness(1); }
    50% { filter: blur(6px) brightness(1.3); }
  }
  @keyframes sc-twinkle1 { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
  @keyframes sc-twinkle2 { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 0.9; transform: scale(1.1); } }
  @keyframes sc-twinkle3 { 0%, 100% { opacity: 0.1; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.3); } }
  @keyframes sc-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes sc-pulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
  }

  .sc-melt-candle { display: flex; justify-content: center; }
  .sc-content:not(.sc-two-col) .sc-melt-candle { margin-bottom: 8px; }

  .sc-melt-candle .sc-fl-body {
    animation: sc-flicker1 2.5s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .sc-melt-candle .sc-fl-core {
    animation: sc-flicker2 3s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .sc-melt-candle .sc-fl-glow {
    animation: sc-glow-anim 2.5s ease-in-out infinite;
  }
  .sc-melt-candle .sc-ambient {
    animation: sc-pulse 5s ease-in-out infinite;
  }

  .sc-two-col {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--sc-two-col-gap, 14px);
    align-items: center;
    text-align: left;
    width: 100%;
  }
  .sc-col-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .sc-col-right {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .sc-two-col .sc-title { text-align: left; }
  .sc-two-col .sc-subtitle { text-align: left; }
  .sc-two-col .sc-countdown { text-align: left; letter-spacing: 2px; margin-top: 6px; }
  .sc-two-col .sc-cd-label { text-align: left; }
  .sc-two-col .sc-ring-wrap { justify-content: center; margin: 4px 0; }
  .sc-two-col .sc-times { justify-content: flex-start; }
  .sc-two-col .sc-date { text-align: left; }

  .sc-widget {
    position: relative;
    padding: var(--sc-padding);
    text-align: center;
    min-height: var(--sc-min-height);
    display: flex;
    flex-direction: var(--sc-direction, column);
    align-items: center;
    justify-content: center;
    gap: var(--sc-gap, 0);
    color: var(--sc-text-color, #FFFFFF);
  }
  .sc-content {
    position: relative; z-index: 1;
    width: 100%;
  }
  .sc-content.sc-horizontal {
    display: flex;
    align-items: center;
    gap: 10px;
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
  }
  .sc-bg {
    position: absolute; inset: 0; z-index: 0;
    background: var(--sc-bg);
  }

  .sc-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .sc-star {
    position: absolute; color: #FFFDE7;
    text-shadow: 0 0 6px rgba(255,253,231,0.8);
  }
  .sc-star:nth-child(1) { top: 8%; left: 12%; font-size: 16px; animation: sc-twinkle1 3s ease-in-out infinite; }
  .sc-star:nth-child(2) { top: 5%; right: 18%; font-size: 20px; animation: sc-twinkle2 4s ease-in-out infinite 0.5s; }
  .sc-star:nth-child(3) { top: 18%; left: 45%; font-size: 14px; animation: sc-twinkle3 3.5s ease-in-out infinite 1s; }
  .sc-star:nth-child(4) { top: 4%; left: 32%; font-size: 10px; animation: sc-twinkle1 2.8s ease-in-out infinite 1.5s; }
  .sc-star:nth-child(5) { top: 14%; right: 8%; font-size: 12px; animation: sc-twinkle2 3.2s ease-in-out infinite 2s; }
  .sc-star:nth-child(6) { top: 22%; left: 22%; font-size: 11px; animation: sc-twinkle3 4.5s ease-in-out infinite 0.8s; }
  .sc-star:nth-child(7) { top: 10%; left: 68%; font-size: 13px; animation: sc-twinkle1 3.8s ease-in-out infinite 2.5s; }
  .sc-star:nth-child(8) { top: 28%; right: 30%; font-size: 9px; animation: sc-twinkle2 2.5s ease-in-out infinite 1.2s; }
  .sc-star:nth-child(9) { top: 3%; left: 55%; font-size: 15px; animation: sc-twinkle3 3s ease-in-out infinite 0.3s; }

  .sc-hero { font-size: var(--sc-hero-size); margin-bottom: var(--sc-hero-margin); }
  .sc-float { animation: sc-float 4s ease-in-out infinite; }

  .sc-title {
    font-size: var(--sc-title-size); font-weight: 600; margin: 4px 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    animation: sc-float 6s ease-in-out infinite;
  }
  .sc-subtitle {
    font-size: var(--sc-subtitle-size); opacity: 0.85; margin-top: 2px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .sc-ring-wrap { display: flex; justify-content: center; margin: var(--sc-ring-margin); }
  .sc-ring { position: relative; width: var(--sc-ring-size); height: var(--sc-ring-size); }
  .sc-ring svg { transform: rotate(-90deg); width: var(--sc-ring-size); height: var(--sc-ring-size); }
  .sc-ring-bg { fill: none; stroke: rgba(255,255,255,0.12); stroke-width: var(--sc-ring-stroke); }
  .sc-ring-fg {
    fill: none; stroke: url(#scGold); stroke-width: var(--sc-ring-stroke); stroke-linecap: round;
    animation: sc-pulse 4s ease-in-out infinite;
  }
  .sc-ring-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); text-align: center; line-height: 1.3;
  }
  .sc-ring-pct { font-size: var(--sc-ring-pct-size); font-weight: 300; }
  .sc-ring-lbl { font-size: var(--sc-ring-lbl-size); opacity: 0.5; }

  .sc-countdown { font-size: var(--sc-countdown-size); font-weight: 200; letter-spacing: 3px; margin-top: 10px;
    text-shadow: 0 2px 14px rgba(0,0,0,0.3); }
  .sc-cd-label { font-size: var(--sc-cd-label-size); opacity: 0.55; margin-top: 4px; }

  .sc-times {
    display: flex; justify-content: center; gap: var(--sc-times-gap);
    margin-top: var(--sc-times-margin); font-size: var(--sc-times-size);
  }
  .sc-time-label { font-size: 0.8em; opacity: 0.45; margin-bottom: 3px; }
  .sc-time-val { font-weight: 500; font-size: 1.15em; }

  .sc-date { margin-top: 12px; font-size: var(--sc-date-size); opacity: 0.4; }

  .sc-error {
    padding: 16px;
    text-align: center;
    color: var(--primary-text-color, #333);
  }
  .sc-error-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
`;
