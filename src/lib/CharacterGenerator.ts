/**
 * Procedural flat-style character SVG generator.
 * Chibi proportions, bold flat colours, thin outlines — reads clearly at 44×88 px.
 * All output is deterministic from seed + gender.
 */

// ── Seeded helpers ────────────────────────────────────────────────────────────

function h(seed: string, idx: number): number {
  let v = 5381 + idx * 127
  for (let i = 0; i < seed.length; i++) {
    v = (((v << 5) + v) ^ seed.charCodeAt(i)) & 0x7fffffff
  }
  return v
}
const pick = <T>(arr: readonly T[], seed: string, idx: number): T => arr[h(seed, idx) % arr.length]
const bool = (seed: string, idx: number): boolean => h(seed, idx) % 2 === 0
const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

// ── Palettes ──────────────────────────────────────────────────────────────────

const SKINS  = ['#FDDCB5','#F5C28A','#D4956A','#B07040','#7D5030'] as const
const HAIR   = ['#1C1C1E','#2C1010','#6B3520','#1A1A40','#3D1F08','#2A3A10'] as const

const TOPS   = [
  '#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA',
  '#00ACC1','#E91E8C','#C9A800','#F5F5F5','#546E7A',
  '#00897B','#F4511E','#039BE5','#7CB342','#F06292',
  '#5E35B1','#FF7043','#26A69A','#EC407A','#29B6F6',
] as const

const JACKETS = [
  '#1565C0','#B71C1C','#1B5E20','#4A148C','#004D40',
  '#E65100','#212121','#880E4F','#BF360C','#263238',
  '#006064','#311B92','#1A237E','#33691E','#4E342E',
] as const

const PANTS  = [
  '#1A2A4A','#2E3440','#1A2E1A','#111111','#2C1A0A',
  '#1C2B3A','#1F1F1F','#0D1B2A','#2A1F1F','#1A2A1A',
] as const

const SKIRTS = [
  '#F06292','#90CAF9','#CE93D8','#EF9A9A','#FFFFFF',
  '#80DEEA','#FFF176','#B39DDB','#80CBC4','#FFCC80',
  '#F48FB1','#81D4FA','#FFAB91','#A5D6A7','#E1BEE7',
] as const

const SHOES  = [
  ['#ECEFF1','#607D8B'],['#1C1C1E','#37474F'],['#D32F2F','#B71C1C'],
  ['#1565C0','#0D47A1'],['#6D4C41','#4E342E'],['#2E7D32','#1B5E20'],
  ['#F57F17','#E65100'],['#4527A0','#311B92'],
] as const

const CAPS   = [
  '#D32F2F','#1565C0','#1C1C1E','#2E7D32','#6A1B9A',
  '#E65100','#37474F','#AD1457','#00838F','#F9A825',
] as const

const EYES   = ['#1C1C1E','#3E2723','#1A237E','#1B5E20','#3E1E00'] as const

// ── Shared pieces ─────────────────────────────────────────────────────────────

const O = 'stroke="#1C1C1E" stroke-opacity="0.25" stroke-width="0.6"'  // subtle outline

function ground() {
  return `<ellipse cx="22" cy="87" rx="13" ry="3" fill="#000" fill-opacity="0.22"/>`
}

// ── Male ──────────────────────────────────────────────────────────────────────

function male(seed: string): string {
  const skin       = pick(SKINS,   seed, 0)
  const hair       = pick(HAIR,    seed, 1)
  const hairStyle  = h(seed, 2) % 3              // 0 spiky · 1 flat · 2 side-part
  const top        = pick(TOPS,    seed, 3)
  const hasCap     = bool(seed, 4)
  const cap        = pick(CAPS,    seed, 5)
  const hasJacket  = bool(seed, 6)
  const jacket     = pick(JACKETS, seed, 7)
  const pants      = pick(PANTS,   seed, 8)
  const [shU, shL] = pick(SHOES,   seed, 9)
  const eye        = pick(EYES,    seed, 10)

  const pantsDark  = shade(pants, -20)
  const arm        = hasJacket ? jacket : top

  // Hair
  let hairSVG: string
  if (hasCap) {
    hairSVG = `
      <rect x="6" y="19" width="3.5" height="8" rx="1.75" fill="${hair}"/>
      <rect x="34.5" y="19" width="3.5" height="8" rx="1.75" fill="${hair}"/>`
  } else if (hairStyle === 0) {
    // Spiky
    hairSVG = `
      <path d="M6 22 Q6 5 22 5 Q38 5 38 22" fill="${hair}"/>
      <polygon points="9,21 11,12 14,20" fill="${hair}"/>
      <polygon points="15,9 18,3 21,10" fill="${hair}"/>
      <polygon points="21,7 24,3 27,9" fill="${hair}"/>
      <polygon points="26,12 29,5 32,14" fill="${hair}"/>
      <rect x="6"  y="20" width="3.5" height="9" rx="1.75" fill="${hair}"/>
      <rect x="34.5" y="20" width="3.5" height="9" rx="1.75" fill="${hair}"/>`
  } else if (hairStyle === 1) {
    // Flat bowl
    hairSVG = `
      <path d="M6 22 Q6 7 22 7 Q38 7 38 22" fill="${hair}"/>
      <rect x="6" y="20" width="32" height="5" rx="2.5" fill="${hair}"/>
      <rect x="6"  y="19" width="3.5" height="10" rx="1.75" fill="${hair}"/>
      <rect x="34.5" y="19" width="3.5" height="10" rx="1.75" fill="${hair}"/>`
  } else {
    // Side-part
    hairSVG = `
      <path d="M6 22 Q6 7 22 7 Q38 7 38 22" fill="${hair}"/>
      <path d="M8 12 Q15 8 21 13" fill="${skin}" stroke="${skin}" stroke-width="1"/>
      <rect x="6"  y="19" width="3.5" height="10" rx="1.75" fill="${hair}"/>
      <rect x="34.5" y="19" width="3.5" height="10" rx="1.75" fill="${hair}"/>`
  }

  // Cap
  const capDark = shade(cap, -35)
  const capSVG = hasCap ? `
    <path d="M7 21 Q7 5 22 5 Q37 5 37 21" fill="${cap}"/>
    <rect x="3" y="18" width="38" height="6" rx="3" fill="${capDark}"/>
    <rect x="3" y="18" width="38" height="2.5" rx="1.5" fill="${cap}" fill-opacity="0.45"/>
    <circle cx="22" cy="12" r="4" fill="${capDark}" fill-opacity="0.6"/>
    <circle cx="22" cy="12" r="2.2" fill="${shade(cap, 40)}" fill-opacity="0.5"/>` : ''

  // Jacket
  const jackDark = shade(jacket, -30)
  const jacketSVG = hasJacket ? `
    <rect x="10" y="35" width="10" height="20" rx="3" fill="${jacket}"/>
    <rect x="24" y="35" width="10" height="20" rx="3" fill="${jacket}"/>
    <line x1="10" y1="35" x2="10" y2="55" stroke="${jackDark}" stroke-width="0.8"/>
    <line x1="34" y1="35" x2="34" y2="55" stroke="${jackDark}" stroke-width="0.8"/>
    <path d="M20 35 L18 41 L22 46 L26 41 L24 35" fill="${top}"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 88">
  ${ground()}

  <!-- Shoes -->
  <rect x="5"  y="76" width="15" height="11" rx="5.5" fill="${shU}" ${O}/>
  <rect x="24" y="76" width="15" height="11" rx="5.5" fill="${shU}" ${O}/>
  <rect x="5"  y="82" width="15" height="5"  rx="2.5" fill="${shL}"/>
  <rect x="24" y="82" width="15" height="5"  rx="2.5" fill="${shL}"/>
  <rect x="6"  y="77" width="5"  height="2"  rx="1"   fill="white" fill-opacity="0.25"/>
  <rect x="25" y="77" width="5"  height="2"  rx="1"   fill="white" fill-opacity="0.25"/>

  <!-- Pants -->
  <rect x="6"  y="55" width="13" height="23" rx="6"  fill="${pants}" ${O}/>
  <rect x="25" y="55" width="13" height="23" rx="6"  fill="${pants}" ${O}/>
  <rect x="5"  y="50" width="34" height="10" rx="4"  fill="${pantsDark}" ${O}/>

  <!-- Body (shirt) -->
  <rect x="10" y="35" width="24" height="20" rx="5" fill="${top}" ${O}/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="2"  y="35" width="9" height="20" rx="4.5" fill="${arm}" ${O}/>
  <rect x="33" y="35" width="9" height="20" rx="4.5" fill="${arm}" ${O}/>
  <circle cx="6.5"  cy="56" r="5" fill="${skin}" ${O}/>
  <circle cx="37.5" cy="56" r="5" fill="${skin}" ${O}/>

  <!-- Neck -->
  <rect x="18" y="30" width="8" height="7" fill="${skin}"/>

  <!-- Head -->
  <circle cx="22" cy="21" r="17" fill="${skin}" ${O}/>

  <!-- Hair -->
  ${hairSVG}
  ${capSVG}

  <!-- Ears -->
  <circle cx="5"  cy="22" r="3.5" fill="${skin}" ${O}/>
  <circle cx="39" cy="22" r="3.5" fill="${skin}" ${O}/>

  <!-- Eyebrows -->
  <path d="M12 17 Q16 15 19 17" stroke="${hair}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M25 17 Q28 15 32 17" stroke="${hair}" stroke-width="1.6" fill="none" stroke-linecap="round"/>

  <!-- Eyes -->
  <ellipse cx="16" cy="22" rx="3.8" ry="3.8" fill="white" ${O}/>
  <ellipse cx="28" cy="22" rx="3.8" ry="3.8" fill="white" ${O}/>
  <circle  cx="16" cy="22" r="2.4" fill="${eye}"/>
  <circle  cx="28" cy="22" r="2.4" fill="${eye}"/>
  <circle  cx="17" cy="21" r="1"   fill="white"/>
  <circle  cx="29" cy="21" r="1"   fill="white"/>

  <!-- Mouth -->
  <path d="M18 27.5 Q22 31 26 27.5" stroke="#B07060" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`
}

// ── Female ────────────────────────────────────────────────────────────────────

function female(seed: string): string {
  const skin       = pick(SKINS,   seed, 0)
  const hair       = pick(HAIR,    seed, 1)
  const hairStyle  = h(seed, 2) % 3              // 0 ponytail · 1 twin-tails · 2 bob
  const top        = pick(TOPS,    seed, 3)
  const hasCap     = bool(seed, 4)
  const cap        = pick(CAPS,    seed, 5)
  const hasJacket  = bool(seed, 6)
  const jacket     = pick(JACKETS, seed, 7)
  const skirt      = pick(SKIRTS,  seed, 8)
  const [shU, shL] = pick(SHOES,   seed, 9)
  const eye        = pick(EYES,    seed, 10)
  const accent     = pick(TOPS,    seed, 11)     // bow / hair-tie colour

  const skirtDark  = shade(skirt, -35)
  const arm        = hasJacket ? jacket : top

  // Hair
  let hairSVG: string
  if (hasCap) {
    hairSVG = `
      <rect x="4"  y="15" width="5" height="22" rx="2.5" fill="${hair}"/>
      <rect x="35" y="15" width="5" height="22" rx="2.5" fill="${hair}"/>`
  } else if (hairStyle === 0) {
    // High ponytail with bow
    hairSVG = `
      <ellipse cx="22" cy="17" rx="15" ry="12" fill="${hair}"/>
      <rect x="4"  y="14" width="5"  height="20" rx="2.5" fill="${hair}"/>
      <rect x="35" y="14" width="5"  height="20" rx="2.5" fill="${hair}"/>
      <!-- Pony shaft -->
      <rect x="19" y="3" width="6" height="11" rx="3" fill="${hair}"/>
      <!-- Bow left wing -->
      <path d="M14 5 Q10 1 12 6 Q10 11 15 8 L20 5.5 Z" fill="${accent}"/>
      <!-- Bow right wing -->
      <path d="M30 5 Q34 1 32 6 Q34 11 29 8 L24 5.5 Z" fill="${accent}"/>
      <!-- Bow knot -->
      <circle cx="22" cy="5.5" r="2.5" fill="white" fill-opacity="0.85"/>`
  } else if (hairStyle === 1) {
    // Twin-tails
    hairSVG = `
      <ellipse cx="22" cy="17" rx="15" ry="11" fill="${hair}"/>
      <!-- Left tail -->
      <path d="M6 16 Q-1 18 0 26 Q0 34 6 33 Q5 26 8 20" fill="${hair}"/>
      <!-- Right tail -->
      <path d="M38 16 Q45 18 44 26 Q44 34 38 33 Q39 26 36 20" fill="${hair}"/>
      <!-- Hair ties -->
      <circle cx="7"  cy="16" r="3" fill="${accent}"/>
      <circle cx="37" cy="16" r="3" fill="${accent}"/>`
  } else {
    // Short bob with clip
    hairSVG = `
      <ellipse cx="22" cy="18" rx="15" ry="12" fill="${hair}"/>
      <rect x="4"  y="15" width="5" height="13" rx="2.5" fill="${hair}"/>
      <rect x="35" y="15" width="5" height="13" rx="2.5" fill="${hair}"/>
      <!-- Side clip -->
      <rect x="27" y="11" width="7" height="3.5" rx="1.75" fill="${accent}"/>
      <circle cx="30.5" cy="12.75" r="1.5" fill="white" fill-opacity="0.7"/>`
  }

  // Cap
  const capDark = shade(cap, -35)
  const capSVG = hasCap ? `
    <path d="M7 20 Q7 4 22 4 Q37 4 37 20" fill="${cap}"/>
    <rect x="3" y="17" width="38" height="6" rx="3" fill="${capDark}"/>
    <rect x="3" y="17" width="38" height="2.5" rx="1.5" fill="${cap}" fill-opacity="0.45"/>
    <circle cx="22" cy="11" r="4" fill="${capDark}" fill-opacity="0.6"/>
    <circle cx="22" cy="11" r="2.2" fill="${shade(cap, 40)}" fill-opacity="0.5"/>` : ''

  // Jacket
  const jackDark = shade(jacket, -30)
  const jacketSVG = hasJacket ? `
    <rect x="10" y="34" width="9"  height="20" rx="3" fill="${jacket}"/>
    <rect x="25" y="34" width="9"  height="20" rx="3" fill="${jacket}"/>
    <line x1="10" y1="34" x2="10" y2="54" stroke="${jackDark}" stroke-width="0.8"/>
    <line x1="34" y1="34" x2="34" y2="54" stroke="${jackDark}" stroke-width="0.8"/>
    <path d="M19 34 L17.5 40 L22 45 L26.5 40 L25 34" fill="${top}"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 88">
  ${ground()}

  <!-- Shoes / Boots -->
  <rect x="6"  y="74" width="13" height="13" rx="5.5" fill="${shU}" ${O}/>
  <rect x="25" y="74" width="13" height="13" rx="5.5" fill="${shU}" ${O}/>
  <rect x="6"  y="74" width="13" height="5"  rx="2.5" fill="${shL}"/>
  <rect x="25" y="74" width="13" height="5"  rx="2.5" fill="${shL}"/>
  <rect x="7"  y="75" width="5"  height="2"  rx="1"   fill="white" fill-opacity="0.3"/>
  <rect x="26" y="75" width="5"  height="2"  rx="1"   fill="white" fill-opacity="0.3"/>

  <!-- Legs -->
  <rect x="7"  y="60" width="12" height="16" rx="5" fill="${skin}" ${O}/>
  <rect x="25" y="60" width="12" height="16" rx="5" fill="${skin}" ${O}/>

  <!-- Skirt -->
  <path d="M8 50 Q6 70 22 70 Q38 70 36 50 Z" fill="${skirt}" ${O}/>
  <path d="M10 51 Q9 62 16 66" stroke="white" stroke-width="1.2" fill="none" stroke-opacity="0.25" stroke-linecap="round"/>
  <rect x="10" y="47" width="24" height="7" rx="3.5" fill="${skirtDark}" ${O}/>

  <!-- Body (top) -->
  <rect x="10" y="33" width="24" height="19" rx="5" fill="${top}" ${O}/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="2"  y="33" width="9" height="19" rx="4.5" fill="${arm}" ${O}/>
  <rect x="33" y="33" width="9" height="19" rx="4.5" fill="${arm}" ${O}/>
  <circle cx="6.5"  cy="53" r="5" fill="${skin}" ${O}/>
  <circle cx="37.5" cy="53" r="5" fill="${skin}" ${O}/>

  <!-- Neck -->
  <rect x="18" y="28" width="8" height="7" fill="${skin}"/>

  <!-- Head -->
  <circle cx="22" cy="20" r="17" fill="${skin}" ${O}/>

  <!-- Hair -->
  ${hairSVG}
  ${capSVG}

  <!-- Ears + earrings -->
  <circle cx="5"  cy="21" r="3.5" fill="${skin}" ${O}/>
  <circle cx="39" cy="21" r="3.5" fill="${skin}" ${O}/>
  <circle cx="4.5"  cy="24" r="1.8" fill="${accent}"/>
  <circle cx="39.5" cy="24" r="1.8" fill="${accent}"/>

  <!-- Eyebrows (softer) -->
  <path d="M11 16 Q15 14 18 16" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M26 16 Q29 14 33 16" stroke="${hair}" stroke-width="1.5" fill="none" stroke-linecap="round"/>

  <!-- Eyes (larger) -->
  <ellipse cx="15.5" cy="21" rx="4.2" ry="4.2" fill="white" ${O}/>
  <ellipse cx="28.5" cy="21" rx="4.2" ry="4.2" fill="white" ${O}/>
  <circle  cx="15.5" cy="21" r="2.8" fill="${eye}"/>
  <circle  cx="28.5" cy="21" r="2.8" fill="${eye}"/>
  <circle  cx="16.5" cy="20" r="1.1" fill="white"/>
  <circle  cx="29.5" cy="20" r="1.1" fill="white"/>

  <!-- Eyelashes -->
  <path d="M11.5 18 L12.5 16" stroke="${hair}" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M13.5 17 L14.2 15" stroke="${hair}" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M23.5 17 L24.2 15" stroke="${hair}" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M25.5 18 L26.5 16" stroke="${hair}" stroke-width="0.9" stroke-linecap="round"/>

  <!-- Blush -->
  <ellipse cx="10" cy="24" rx="3.5" ry="2" fill="#FFB3B3" fill-opacity="0.5"/>
  <ellipse cx="34" cy="24" rx="3.5" ry="2" fill="#FFB3B3" fill-opacity="0.5"/>

  <!-- Mouth -->
  <path d="M17.5 27 Q22 30.5 26.5 27" stroke="#B07060" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateCharacterSvg(seed: string, gender: 'male' | 'female'): string {
  return gender === 'female' ? female(seed) : male(seed)
}
