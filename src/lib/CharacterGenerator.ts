/**
 * Procedural chibi character SVG — large head, thick outlines, big anime eyes.
 * ViewBox 80×160, rendered at 44×88 in PixiJS. Deterministic from seed + gender.
 */

// ── Seeded helpers ────────────────────────────────────────────────────────────

function h(seed: string, idx: number): number {
  let v = 5381 + idx * 127
  for (let i = 0; i < seed.length; i++) {
    v = (((v << 5) + v) ^ seed.charCodeAt(i)) & 0x7fffffff
  }
  return v
}
const pick = <T>(arr: readonly T[], seed: string, idx: number): T =>
  arr[h(seed, idx) % arr.length]
const bool = (seed: string, idx: number): boolean => h(seed, idx) % 2 === 0
const shade = (hex: string, amt: number): string => {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

// ── Palettes ──────────────────────────────────────────────────────────────────

const SKINS   = ['#FDDCB5', '#F5C28A', '#D4956A', '#B07040', '#7D5030'] as const
const HAIR    = ['#1C1C1E', '#2C1010', '#5A2D10', '#1A1A40', '#243010', '#3D2A08'] as const

const TOPS    = [
  '#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA',
  '#00ACC1', '#E91E8C', '#C9A800', '#ECEFF1', '#546E7A',
  '#00897B', '#F4511E', '#039BE5', '#7CB342', '#F06292',
  '#5E35B1', '#FF7043', '#26A69A', '#EC407A', '#29B6F6',
] as const

const JACKETS = [
  '#1565C0', '#B71C1C', '#1B5E20', '#4A148C', '#004D40',
  '#E65100', '#212121', '#880E4F', '#BF360C', '#263238',
  '#006064', '#311B92', '#1A237E', '#33691E', '#4E342E',
] as const

const PANTS   = [
  '#1A2A4A', '#2E3440', '#1A2E1A', '#111111', '#2C1A0A',
  '#1C2B3A', '#1F1F1F', '#0D1B2A', '#2A1F1F', '#1A2A1A',
] as const

const SKIRTS  = [
  '#F06292', '#90CAF9', '#CE93D8', '#EF9A9A', '#FFFFFF',
  '#80DEEA', '#FFF176', '#B39DDB', '#80CBC4', '#FFCC80',
  '#F48FB1', '#81D4FA', '#FFAB91', '#A5D6A7', '#E1BEE7',
] as const

const SHOES   = [
  ['#ECEFF1', '#607D8B'], ['#1C1C1E', '#37474F'], ['#D32F2F', '#B71C1C'],
  ['#1565C0', '#0D47A1'], ['#6D4C41', '#4E342E'], ['#2E7D32', '#1B5E20'],
  ['#F57F17', '#E65100'], ['#4527A0', '#311B92'],
] as const

const CAPS    = [
  '#D32F2F', '#1565C0', '#1C1C1E', '#2E7D32', '#6A1B9A',
  '#E65100', '#37474F', '#AD1457', '#00838F', '#F9A825',
] as const

const IRISES  = ['#1565C0', '#1B5E20', '#B71C1C', '#4A148C', '#37474F', '#1C1C1E'] as const
const ACCENTS = [
  '#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA',
  '#F06292', '#FF7043', '#EC407A', '#29B6F6', '#FDD835',
] as const

// ── Common stroke helpers ─────────────────────────────────────────────────────

const OL  = 'stroke="#1C1C1E" stroke-width="2.5"'  // main outline
const OL2 = 'stroke="#1C1C1E" stroke-width="2"'    // thinner outline
const OL1 = 'stroke="#1C1C1E" stroke-width="1.5"'  // detail
const NS  = 'stroke="none"'                         // no stroke

function ground() {
  return `<ellipse cx="40" cy="157" rx="24" ry="5" fill="#000" fill-opacity="0.18" ${NS}/>`
}

// ── Shared face ───────────────────────────────────────────────────────────────

function face(
  skin: string,
  hair: string,
  irisColor: string,
  eyeCY: number,
  isF: boolean
): string {
  const ex1 = 27, ex2 = 53          // eye x positions
  const eR  = isF ? 12 : 11         // eye white radius
  const iR  = isF ? 9  : 8          // iris radius
  const pR  = isF ? 5.5 : 5         // pupil radius
  const bw  = isF ? 2.2 : 2.5       // brow stroke width
  const eyeTop = eyeCY - eR + 3     // sparkle y

  const brows = isF
    ? `<path d="M18 ${eyeCY - 13} Q26 ${eyeCY - 18} 33 ${eyeCY - 13}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>
       <path d="M47 ${eyeCY - 13} Q54 ${eyeCY - 18} 62 ${eyeCY - 13}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`
    : `<path d="M19 ${eyeCY - 13} Q26 ${eyeCY - 18} 34 ${eyeCY - 13}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>
       <path d="M46 ${eyeCY - 13} Q54 ${eyeCY - 18} 61 ${eyeCY - 13}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`

  const lashes = isF
    ? `<path d="M15 ${eyeCY - 9} L16 ${eyeCY - 13}" stroke="${hair}" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M19 ${eyeCY - 11} L21 ${eyeCY - 15}" stroke="${hair}" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M41 ${eyeCY - 11} L43 ${eyeCY - 15}" stroke="${hair}" stroke-width="1.5" stroke-linecap="round"/>
       <path d="M45 ${eyeCY - 9} L46 ${eyeCY - 13}" stroke="${hair}" stroke-width="1.5" stroke-linecap="round"/>`
    : ''

  return `
  ${brows}
  ${lashes}
  <!-- Eyes -->
  <ellipse cx="${ex1}" cy="${eyeCY}" rx="${eR}" ry="${eR}" fill="white" ${OL2}/>
  <ellipse cx="${ex2}" cy="${eyeCY}" rx="${eR}" ry="${eR}" fill="white" ${OL2}/>
  <circle cx="${ex1}" cy="${eyeCY}" r="${iR}" fill="${irisColor}" ${NS}/>
  <circle cx="${ex2}" cy="${eyeCY}" r="${iR}" fill="${irisColor}" ${NS}/>
  <circle cx="${ex1}" cy="${eyeCY}" r="${pR}" fill="#1A1A1A" ${NS}/>
  <circle cx="${ex2}" cy="${eyeCY}" r="${pR}" fill="#1A1A1A" ${NS}/>
  <!-- Eye sparkles -->
  <circle cx="${ex1 + 5}" cy="${eyeTop}" r="3.5" fill="white" ${NS}/>
  <circle cx="${ex2 + 5}" cy="${eyeTop}" r="3.5" fill="white" ${NS}/>
  <circle cx="${ex1 - 3}" cy="${eyeCY + 4}" r="1.8" fill="white" fill-opacity="0.75" ${NS}/>
  <circle cx="${ex2 - 3}" cy="${eyeCY + 4}" r="1.8" fill="white" fill-opacity="0.75" ${NS}/>
  <!-- Blush -->
  <ellipse cx="14" cy="${eyeCY + 9}" rx="9" ry="6" fill="#FFB3B3" fill-opacity="0.6" ${NS}/>
  <ellipse cx="66" cy="${eyeCY + 9}" rx="9" ry="6" fill="#FFB3B3" fill-opacity="0.6" ${NS}/>
  <!-- Nose -->
  <path d="M37 ${eyeCY + 13} Q40 ${eyeCY + 16} 43 ${eyeCY + 13}" stroke="#C07060" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <!-- Mouth -->
  <path d="M30 ${eyeCY + 21} Q40 ${eyeCY + 29} 50 ${eyeCY + 21}" stroke="#C07060" stroke-width="2" fill="none" stroke-linecap="round"/>`
}

// ── Male ──────────────────────────────────────────────────────────────────────

function male(seed: string): string {
  const skin       = pick(SKINS,   seed, 0)
  const hair       = pick(HAIR,    seed, 1)
  const hairStyle  = h(seed, 2) % 3
  const top        = pick(TOPS,    seed, 3)
  const hasCap     = bool(seed, 4)
  const cap        = pick(CAPS,    seed, 5)
  const hasJacket  = bool(seed, 6)
  const jacket     = pick(JACKETS, seed, 7)
  const pants      = pick(PANTS,   seed, 8)
  const shoePair   = pick(SHOES,   seed, 9)
  const irisColor  = pick(IRISES,  seed, 10)

  const shU = shoePair[0], shL = shoePair[1]
  const arm = hasJacket ? jacket : top
  const pantsDark = shade(pants, -25)
  const capDark   = shade(cap, -40)
  const capLight  = shade(cap, 55)

  // ── Hair ──
  let hairSVG: string
  if (hasCap) {
    hairSVG = `
      <rect x="10" y="48" width="8" height="22" rx="4" fill="${hair}" ${NS}/>
      <rect x="62" y="48" width="8" height="22" rx="4" fill="${hair}" ${NS}/>`
  } else if (hairStyle === 0) {
    // Spiky
    hairSVG = `
      <path d="M10 54 Q10 16 40 16 Q70 16 70 54" fill="${hair}" ${OL2}/>
      <polygon points="14,48 9,24 23,44" fill="${hair}" ${OL1} stroke-linejoin="round"/>
      <polygon points="27,26 24,8 36,24" fill="${hair}" ${OL1} stroke-linejoin="round"/>
      <polygon points="40,18 38,2 52,16" fill="${hair}" ${OL1} stroke-linejoin="round"/>
      <polygon points="54,24 57,6 66,22" fill="${hair}" ${OL1} stroke-linejoin="round"/>
      <polygon points="66,42 71,20 76,44" fill="${hair}" ${OL1} stroke-linejoin="round"/>
      <rect x="10" y="48" width="8" height="22" rx="4" fill="${hair}" ${NS}/>
      <rect x="62" y="48" width="8" height="22" rx="4" fill="${hair}" ${NS}/>`
  } else if (hairStyle === 1) {
    // Bowl cut
    hairSVG = `
      <path d="M10 54 Q10 16 40 16 Q70 16 70 54" fill="${hair}" ${OL2}/>
      <rect x="10" y="48" width="60" height="12" rx="6" fill="${hair}" ${NS}/>
      <rect x="10" y="46" width="8" height="24" rx="4" fill="${hair}" ${NS}/>
      <rect x="62" y="46" width="8" height="24" rx="4" fill="${hair}" ${NS}/>`
  } else {
    // Side-part with swoosh
    hairSVG = `
      <path d="M10 54 Q10 16 40 16 Q70 16 70 54" fill="${hair}" ${OL2}/>
      <path d="M14 32 Q26 22 42 30" fill="${skin}" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>
      <rect x="10" y="46" width="8" height="24" rx="4" fill="${hair}" ${NS}/>
      <rect x="62" y="46" width="8" height="24" rx="4" fill="${hair}" ${NS}/>`
  }

  const capSVG = hasCap ? `
    <path d="M10 52 Q10 14 40 14 Q70 14 70 52" fill="${cap}" ${OL2}/>
    <rect x="4"  y="46" width="72" height="14" rx="7" fill="${capDark}" ${OL2}/>
    <rect x="4"  y="46" width="72" height="6"  rx="3" fill="${cap}" fill-opacity="0.35" ${NS}/>
    <circle cx="40" cy="28" r="8" fill="${capDark}" fill-opacity="0.5" ${NS}/>
    <circle cx="40" cy="28" r="4" fill="${capLight}" fill-opacity="0.45" ${NS}/>` : ''

  const jackDark = shade(jacket, -35)
  const jacketSVG = hasJacket ? `
    <rect x="16" y="88" width="18" height="34" rx="7" fill="${jacket}" ${OL2}/>
    <rect x="46" y="88" width="18" height="34" rx="7" fill="${jacket}" ${OL2}/>
    <line x1="16" y1="88"  x2="16" y2="122" stroke="${jackDark}" stroke-width="1.5"/>
    <line x1="64" y1="88"  x2="64" y2="122" stroke="${jackDark}" stroke-width="1.5"/>
    <path d="M36 88 L34 100 L40 106 L46 100 L44 88" fill="${top}" stroke="#1C1C1E" stroke-width="1"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 160">
  ${ground()}

  <!-- Shoes -->
  <rect x="10" y="133" width="26" height="18" rx="9" fill="${shU}" ${OL}/>
  <rect x="44" y="133" width="26" height="18" rx="9" fill="${shU}" ${OL}/>
  <rect x="10" y="142" width="26" height="9"  rx="4" fill="${shL}" ${NS}/>
  <rect x="44" y="142" width="26" height="9"  rx="4" fill="${shL}" ${NS}/>
  <rect x="13" y="135" width="10" height="4"  rx="2" fill="white" fill-opacity="0.3" ${NS}/>
  <rect x="47" y="135" width="10" height="4"  rx="2" fill="white" fill-opacity="0.3" ${NS}/>

  <!-- Legs -->
  <rect x="12" y="112" width="22" height="26" rx="11" fill="${pants}" ${OL}/>
  <rect x="46" y="112" width="22" height="26" rx="11" fill="${pants}" ${OL}/>
  <!-- Belt -->
  <rect x="10" y="104" width="60" height="14" rx="7" fill="${pantsDark}" ${OL}/>

  <!-- Body -->
  <rect x="16" y="82"  width="48" height="28" rx="10" fill="${top}" ${OL}/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="2"  y="84" width="16" height="28" rx="8" fill="${arm}" ${OL}/>
  <rect x="62" y="84" width="16" height="28" rx="8" fill="${arm}" ${OL}/>
  <!-- Hands -->
  <circle cx="10" cy="114" r="10" fill="${skin}" ${OL}/>
  <circle cx="70" cy="114" r="10" fill="${skin}" ${OL}/>

  <!-- Neck -->
  <rect x="32" y="74" width="16" height="12" fill="${skin}" ${NS}/>

  <!-- Ears -->
  <circle cx="6"  cy="50" r="9" fill="${skin}" ${OL}/>
  <circle cx="74" cy="50" r="9" fill="${skin}" ${OL}/>
  <circle cx="6"  cy="50" r="5" fill="${shade(skin, -15)}" ${NS}/>
  <circle cx="74" cy="50" r="5" fill="${shade(skin, -15)}" ${NS}/>

  <!-- Head -->
  <circle cx="40" cy="48" r="34" fill="${skin}" ${OL}/>

  <!-- Hair -->
  ${hairSVG}
  ${capSVG}

  ${face(skin, hair, irisColor, 48, false)}
</svg>`
}

// ── Female ────────────────────────────────────────────────────────────────────

function female(seed: string): string {
  const skin       = pick(SKINS,   seed, 0)
  const hair       = pick(HAIR,    seed, 1)
  const hairStyle  = h(seed, 2) % 3
  const top        = pick(TOPS,    seed, 3)
  const hasCap     = bool(seed, 4)
  const cap        = pick(CAPS,    seed, 5)
  const hasJacket  = bool(seed, 6)
  const jacket     = pick(JACKETS, seed, 7)
  const skirt      = pick(SKIRTS,  seed, 8)
  const shoePair   = pick(SHOES,   seed, 9)
  const irisColor  = pick(IRISES,  seed, 10)
  const accent     = pick(ACCENTS, seed, 11)

  const shU = shoePair[0], shL = shoePair[1]
  const arm = hasJacket ? jacket : top
  const skirtDark = shade(skirt, -40)
  const capDark   = shade(cap, -40)
  const capLight  = shade(cap, 55)

  // ── Hair ──
  let hairSVG: string
  if (hasCap) {
    hairSVG = `
      <rect x="8"  y="44" width="9" height="28" rx="4.5" fill="${hair}" ${NS}/>
      <rect x="63" y="44" width="9" height="28" rx="4.5" fill="${hair}" ${NS}/>`
  } else if (hairStyle === 0) {
    // High ponytail with bow
    hairSVG = `
      <ellipse cx="40" cy="34" rx="30" ry="22" fill="${hair}" ${OL2}/>
      <rect x="8"  y="42" width="9" height="26" rx="4.5" fill="${hair}" ${NS}/>
      <rect x="63" y="42" width="9" height="26" rx="4.5" fill="${hair}" ${NS}/>
      <!-- Ponytail shaft -->
      <rect x="35" y="8"  width="10" height="22" rx="5" fill="${hair}" ${OL2}/>
      <!-- Bow left wing -->
      <path d="M22 14 Q15 7 18 15 Q15 23 24 19 L36 14 Z" fill="${accent}" ${OL1} stroke-linejoin="round"/>
      <!-- Bow right wing -->
      <path d="M58 14 Q65 7 62 15 Q65 23 56 19 L44 14 Z" fill="${accent}" ${OL1} stroke-linejoin="round"/>
      <!-- Bow knot -->
      <circle cx="40" cy="14" r="5" fill="white" fill-opacity="0.9" ${NS}/>`
  } else if (hairStyle === 1) {
    // Twin-tails
    hairSVG = `
      <ellipse cx="40" cy="34" rx="30" ry="20" fill="${hair}" ${OL2}/>
      <!-- Left tail -->
      <ellipse cx="12" cy="50" rx="11" ry="16" fill="${hair}" ${OL2}/>
      <!-- Right tail -->
      <ellipse cx="68" cy="50" rx="11" ry="16" fill="${hair}" ${OL2}/>
      <!-- Hair ties -->
      <rect x="14" y="40" width="12" height="7" rx="3.5" fill="${accent}" ${OL1}/>
      <rect x="54" y="40" width="12" height="7" rx="3.5" fill="${accent}" ${OL1}/>
      <rect x="8"  y="42" width="9"  height="12" rx="4" fill="${hair}" ${NS}/>
      <rect x="63" y="42" width="9"  height="12" rx="4" fill="${hair}" ${NS}/>`
  } else {
    // Short bob with clip
    hairSVG = `
      <ellipse cx="40" cy="36" rx="32" ry="24" fill="${hair}" ${OL2}/>
      <rect x="8"  y="42" width="9" height="22" rx="4.5" fill="${hair}" ${NS}/>
      <rect x="63" y="42" width="9" height="22" rx="4.5" fill="${hair}" ${NS}/>
      <!-- Hair clip -->
      <rect x="50" y="20" width="13" height="7"  rx="3.5" fill="${accent}" ${OL1}/>
      <circle cx="56" cy="23" r="3" fill="white" fill-opacity="0.7" ${NS}/>`
  }

  const capSVG = hasCap ? `
    <path d="M10 48 Q10 12 40 12 Q70 12 70 48" fill="${cap}" ${OL2}/>
    <rect x="4"  y="42" width="72" height="14" rx="7" fill="${capDark}" ${OL2}/>
    <rect x="4"  y="42" width="72" height="6"  rx="3" fill="${cap}" fill-opacity="0.35" ${NS}/>
    <circle cx="40" cy="26" r="8" fill="${capDark}" fill-opacity="0.5" ${NS}/>
    <circle cx="40" cy="26" r="4" fill="${capLight}" fill-opacity="0.45" ${NS}/>` : ''

  const jackDark = shade(jacket, -35)
  const jacketSVG = hasJacket ? `
    <rect x="16" y="80" width="16" height="30" rx="6" fill="${jacket}" ${OL2}/>
    <rect x="48" y="80" width="16" height="30" rx="6" fill="${jacket}" ${OL2}/>
    <line x1="16" y1="80" x2="16" y2="110" stroke="${jackDark}" stroke-width="1.5"/>
    <line x1="64" y1="80" x2="64" y2="110" stroke="${jackDark}" stroke-width="1.5"/>
    <path d="M34 80 L32 90 L40 96 L48 90 L46 80" fill="${top}" stroke="#1C1C1E" stroke-width="1"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 160">
  ${ground()}

  <!-- Shoes (rounded Mary-Jane style) -->
  <rect x="12" y="136" width="23" height="16" rx="8"  fill="${shU}" ${OL}/>
  <rect x="45" y="136" width="23" height="16" rx="8"  fill="${shU}" ${OL}/>
  <rect x="12" y="136" width="23" height="7"  rx="3.5" fill="${shL}" ${NS}/>
  <rect x="45" y="136" width="23" height="7"  rx="3.5" fill="${shL}" ${NS}/>
  <!-- Strap -->
  <rect x="14" y="138" width="14" height="4" rx="2" fill="${shL}" ${NS}/>
  <rect x="47" y="138" width="14" height="4" rx="2" fill="${shL}" ${NS}/>

  <!-- Legs (bare skin) -->
  <rect x="14" y="116" width="20" height="24" rx="10" fill="${skin}" ${OL}/>
  <rect x="46" y="116" width="20" height="24" rx="10" fill="${skin}" ${OL}/>

  <!-- Skirt -->
  <path d="M14 92 Q4 118 22 130 Q40 136 58 130 Q76 118 66 92 Z" fill="${skirt}" ${OL}/>
  <path d="M18 96 Q16 112 22 122" stroke="white" stroke-width="1.8" fill="none" stroke-opacity="0.3" stroke-linecap="round"/>
  <!-- Waistband -->
  <rect x="14" y="86" width="52" height="10" rx="5" fill="${skirtDark}" ${OL}/>

  <!-- Body (top) -->
  <rect x="16" y="74" width="48" height="18" rx="10" fill="${top}" ${OL}/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="2"  y="76" width="16" height="26" rx="8" fill="${arm}" ${OL}/>
  <rect x="62" y="76" width="16" height="26" rx="8" fill="${arm}" ${OL}/>
  <!-- Hands -->
  <circle cx="10" cy="104" r="10" fill="${skin}" ${OL}/>
  <circle cx="70" cy="104" r="10" fill="${skin}" ${OL}/>

  <!-- Neck -->
  <rect x="32" y="66" width="16" height="12" fill="${skin}" ${NS}/>

  <!-- Ears + earrings -->
  <circle cx="6"  cy="48" r="9" fill="${skin}" ${OL}/>
  <circle cx="74" cy="48" r="9" fill="${skin}" ${OL}/>
  <circle cx="6"  cy="48" r="5" fill="${shade(skin, -15)}" ${NS}/>
  <circle cx="74" cy="48" r="5" fill="${shade(skin, -15)}" ${NS}/>
  <circle cx="5"  cy="58" r="4" fill="${accent}" stroke="#1C1C1E" stroke-width="1.5"/>
  <circle cx="75" cy="58" r="4" fill="${accent}" stroke="#1C1C1E" stroke-width="1.5"/>

  <!-- Head -->
  <circle cx="40" cy="46" r="34" fill="${skin}" ${OL}/>

  <!-- Hair -->
  ${hairSVG}
  ${capSVG}

  ${face(skin, hair, irisColor, 46, true)}
</svg>`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateCharacterSvg(seed: string, gender: 'male' | 'female'): string {
  return gender === 'female' ? female(seed) : male(seed)
}
