/**
 * Procedural game-character SVG.
 * Beefy chibi — thick outlines, eye visor, open jacket, warrior aesthetic.
 * ViewBox 100×130. All output is deterministic from seed + gender.
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

const SKINS   = ['#F4A87C', '#E8956A', '#D4795A', '#C46448', '#A05030'] as const
const HAIR    = ['#1C1C1E', '#3C1810', '#5A2D10', '#2A2040', '#B09060', '#C83020'] as const
const BEARDS  = ['#8B6040', '#6B4020', '#4A3010', '#2C1810', '#B09060'] as const
const JACKETS = [
  '#1C1C2E', '#2A1A1A', '#1A2A1A', '#1C2430', '#2E1818',
  '#182830', '#241820', '#1A1A14', '#2A2410', '#0E1A2A',
] as const
const VESTS   = ['#9EA8B4', '#B4A898', '#A8B490', '#9898B8', '#B4A0A0', '#A0B4A8'] as const
const PANTS   = [
  '#2B4590', '#1A3070', '#222222', '#1C2C1C', '#3A2010',
  '#6B4030', '#1A3A3A', '#2A2040', '#3A1010', '#0A2030',
] as const
const BOOTS   = ['#111111', '#1C0E08', '#0E1414', '#1A1010', '#101828'] as const
const VISOR_M = ['#0A0A0A', '#06060E', '#0A0608', '#080606', '#060808'] as const
const VISOR_F = ['#1565C0', '#00695C', '#6A1B9A', '#C62828', '#37474F', '#2E7D32'] as const
const IRISES  = ['#1565C0', '#2E7D32', '#C62828', '#6A1B9A', '#37474F', '#00838F'] as const
const ACCENTS = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'] as const

const OL  = 'stroke="#1C1C1E" stroke-width="2.5"'
const OL2 = 'stroke="#1C1C1E" stroke-width="2"'
const OL1 = 'stroke="#1C1C1E" stroke-width="1.5"'
const NS  = 'stroke="none"'

function ground(): string {
  return `<ellipse cx="50" cy="127" rx="26" ry="5" fill="#000" fill-opacity="0.2" ${NS}/>`
}

// ── Male ──────────────────────────────────────────────────────────────────────

function male(seed: string): string {
  const skin      = pick(SKINS,   seed, 0)
  const jacket    = pick(JACKETS, seed, 1)
  const vest      = pick(VESTS,   seed, 2)
  const pants     = pick(PANTS,   seed, 3)
  const boot      = pick(BOOTS,   seed, 4)
  const visor     = pick(VISOR_M, seed, 5)
  const beard     = pick(BEARDS,  seed, 6)
  const hairCol   = pick(HAIR,    seed, 7)
  const hairStyle = h(seed, 8) % 3   // 0=bald  1=short crop  2=mohawk
  const beardStyle= h(seed, 9) % 3   // 0=full  1=goatee      2=stubble

  const skinDark  = shade(skin,   -35)
  const beardDark = shade(beard,  -40)
  const jackDark  = shade(jacket, -25)
  const jackLight = shade(jacket,  40)
  const vestDark  = shade(vest,   -35)
  const pantsDark = shade(pants,  -30)

  // ── Hair ──
  let hairSVG = ''
  if (hairStyle === 1) {
    hairSVG = `
    <path d="M22 30 Q22 8 50 8 Q78 8 78 30" fill="${hairCol}" ${OL2}/>
    <rect x="22" y="27" width="56" height="7" rx="3.5" fill="${hairCol}" ${NS}/>`
  } else if (hairStyle === 2) {
    hairSVG = `
    <path d="M40 26 Q42 4 50 2 Q58 4 60 26" fill="${hairCol}" ${OL2}/>
    <rect x="38" y="22" width="24" height="6" rx="3" fill="${hairCol}" ${NS}/>`
  }
  const baldShine = hairStyle === 0
    ? `<ellipse cx="40" cy="17" rx="9" ry="5" fill="white" fill-opacity="0.1" ${NS}/>`
    : ''

  // ── Beard ──
  let beardSVG = ''
  if (beardStyle === 0) {
    beardSVG = `
    <path d="M24 44 Q22 63 50 64 Q78 63 76 44 Q66 54 50 54 Q34 54 24 44Z" fill="${beard}" ${OL2}/>
    <circle cx="35" cy="52" r="1.8" fill="${beardDark}" ${NS}/>
    <circle cx="42" cy="56" r="1.8" fill="${beardDark}" ${NS}/>
    <circle cx="50" cy="58" r="1.8" fill="${beardDark}" ${NS}/>
    <circle cx="58" cy="56" r="1.8" fill="${beardDark}" ${NS}/>
    <circle cx="65" cy="52" r="1.8" fill="${beardDark}" ${NS}/>
    <circle cx="38" cy="59" r="1.4" fill="${beardDark}" ${NS}/>
    <circle cx="50" cy="61" r="1.4" fill="${beardDark}" ${NS}/>
    <circle cx="62" cy="59" r="1.4" fill="${beardDark}" ${NS}/>`
  } else if (beardStyle === 1) {
    beardSVG = `
    <ellipse cx="50" cy="55" rx="14" ry="10" fill="${beard}" ${OL2}/>
    <circle cx="43" cy="54" r="1.5" fill="${beardDark}" ${NS}/>
    <circle cx="50" cy="58" r="1.5" fill="${beardDark}" ${NS}/>
    <circle cx="57" cy="54" r="1.5" fill="${beardDark}" ${NS}/>`
  } else {
    beardSVG = `
    <circle cx="29" cy="46" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="35" cy="51" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="42" cy="55" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="50" cy="57" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="58" cy="55" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="65" cy="51" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="71" cy="46" r="1.3" fill="${beardDark}" ${NS}/>
    <circle cx="38" cy="58" r="1.1" fill="${beardDark}" ${NS}/>
    <circle cx="62" cy="58" r="1.1" fill="${beardDark}" ${NS}/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
  ${ground()}

  <!-- Boots -->
  <rect x="20" y="110" width="28" height="16" rx="8" fill="${boot}" ${OL}/>
  <rect x="52" y="110" width="28" height="16" rx="8" fill="${boot}" ${OL}/>
  <rect x="22" y="112" width="12" height="5" rx="2.5" fill="white" fill-opacity="0.07" ${NS}/>
  <rect x="54" y="112" width="12" height="5" rx="2.5" fill="white" fill-opacity="0.07" ${NS}/>

  <!-- Legs -->
  <rect x="22" y="93" width="24" height="22" rx="8" fill="${pants}" ${OL}/>
  <rect x="54" y="93" width="24" height="22" rx="8" fill="${pants}" ${OL}/>
  <line x1="34" y1="93" x2="34" y2="115" stroke="${pantsDark}" stroke-width="1.5"/>
  <line x1="66" y1="93" x2="66" y2="115" stroke="${pantsDark}" stroke-width="1.5"/>

  <!-- Jacket base -->
  <rect x="8" y="60" width="84" height="36" rx="14" fill="${jacket}" ${OL}/>

  <!-- Vest centre panel -->
  <rect x="28" y="60" width="44" height="36" rx="0" fill="${vest}" ${NS}/>

  <!-- Jacket lapels (V-opening) -->
  <polygon points="28,60 50,82 28,96" fill="${jacket}" ${NS}/>
  <polygon points="72,60 50,82 72,96" fill="${jacket}" ${NS}/>
  <line x1="28" y1="60" x2="50" y2="82" stroke="${jackLight}" stroke-width="1.5"/>
  <line x1="72" y1="60" x2="50" y2="82" stroke="${jackLight}" stroke-width="1.5"/>

  <!-- Vest detail lines -->
  <line x1="50" y1="82" x2="50" y2="94" stroke="${vestDark}" stroke-width="1"/>

  <!-- Belt -->
  <rect x="8" y="90" width="84" height="8" rx="4" fill="${jackDark}" ${OL2}/>
  <rect x="44" y="89" width="12" height="10" rx="2" fill="${shade(jacket, 35)}" ${OL1}/>
  <rect x="46" y="91" width="8"  height="6"  rx="1" fill="${jackDark}" ${NS}/>

  <!-- Shoulder caps -->
  <ellipse cx="15" cy="66" rx="14" ry="12" fill="${jacket}" ${OL}/>
  <ellipse cx="85" cy="66" rx="14" ry="12" fill="${jacket}" ${OL}/>

  <!-- Arms -->
  <rect x="1"  y="65" width="16" height="28" rx="8" fill="${jacket}" ${OL}/>
  <rect x="83" y="65" width="16" height="28" rx="8" fill="${jacket}" ${OL}/>

  <!-- Fists -->
  <circle cx="9"  cy="95" r="11" fill="${skin}" ${OL}/>
  <circle cx="91" cy="95" r="11" fill="${skin}" ${OL}/>
  <path d="M3  92 Q9  89 15 92" stroke="${skinDark}" stroke-width="1.2" fill="none"/>
  <path d="M85 92 Q91 89 97 92" stroke="${skinDark}" stroke-width="1.2" fill="none"/>

  <!-- Neck -->
  <rect x="38" y="57" width="24" height="10" rx="5" fill="${skin}" ${NS}/>

  <!-- Ears -->
  <circle cx="22" cy="34" r="9" fill="${skin}" ${OL}/>
  <circle cx="78" cy="34" r="9" fill="${skin}" ${OL}/>
  <circle cx="22" cy="34" r="5" fill="${skinDark}" ${NS}/>
  <circle cx="78" cy="34" r="5" fill="${skinDark}" ${NS}/>

  <!-- Head -->
  <ellipse cx="50" cy="32" rx="28" ry="25" fill="${skin}" ${OL}/>
  ${baldShine}

  <!-- Hair -->
  ${hairSVG}

  <!-- Eye visor -->
  <rect x="24" y="22" width="52" height="17" rx="7" fill="${visor}" ${OL}/>
  <rect x="26" y="24" width="22" height="5" rx="2.5" fill="white" fill-opacity="0.09" ${NS}/>

  <!-- Nose -->
  <ellipse cx="50" cy="45" rx="5" ry="4" fill="${skinDark}" ${NS}/>

  <!-- Beard -->
  ${beardSVG}
</svg>`
}

// ── Female ────────────────────────────────────────────────────────────────────

function female(seed: string): string {
  const skin      = pick(SKINS,   seed, 0)
  const jacket    = pick(JACKETS, seed, 1)
  const vest      = pick(VESTS,   seed, 2)
  const pants     = pick(PANTS,   seed, 3)
  const boot      = pick(BOOTS,   seed, 4)
  const visorCol  = pick(VISOR_F, seed, 5)
  const iris      = pick(IRISES,  seed, 6)
  const hairCol   = pick(HAIR,    seed, 7)
  const hairStyle = h(seed, 8) % 3   // 0=high-bun  1=ponytail  2=pixie
  const accent    = pick(ACCENTS, seed, 9)

  const skinDark  = shade(skin,   -35)
  const jackDark  = shade(jacket, -25)
  const jackLight = shade(jacket,  40)
  const vestDark  = shade(vest,   -35)
  const pantsDark = shade(pants,  -30)
  const hairDark  = shade(hairCol, -40)

  // ── Hair ──
  let hairSVG = ''
  if (hairStyle === 0) {
    // High bun
    hairSVG = `
    <ellipse cx="50" cy="14" rx="14" ry="13" fill="${hairCol}" ${OL2}/>
    <rect x="44" y="10" width="12" height="16" rx="6" fill="${hairCol}" ${NS}/>
    <path d="M22 28 Q22 8 50 8 Q78 8 78 28" fill="${hairCol}" ${OL2}/>
    <rect x="22" y="26" width="56" height="7" rx="3.5" fill="${hairCol}" ${NS}/>
    <rect x="12" y="25" width="8" height="22" rx="4" fill="${hairCol}" ${NS}/>
    <rect x="80" y="25" width="8" height="22" rx="4" fill="${hairCol}" ${NS}/>
    <ellipse cx="50" cy="12" rx="8" ry="5" fill="${hairDark}" fill-opacity="0.4" ${NS}/>`
  } else if (hairStyle === 1) {
    // High ponytail
    hairSVG = `
    <path d="M22 28 Q22 7 50 7 Q78 7 78 28" fill="${hairCol}" ${OL2}/>
    <rect x="22" y="26" width="56" height="7" rx="3.5" fill="${hairCol}" ${NS}/>
    <rect x="12" y="26" width="8" height="24" rx="4" fill="${hairCol}" ${NS}/>
    <rect x="80" y="26" width="8" height="24" rx="4" fill="${hairCol}" ${NS}/>
    <!-- Ponytail -->
    <path d="M42 8 Q38 0 50 0 Q62 0 58 8" fill="${hairCol}" ${OL2}/>
    <path d="M44 8 Q46 18 50 24 Q54 18 56 8" fill="${hairCol}" ${NS}/>
    <!-- Hair tie -->
    <rect x="44" y="6" width="12" height="5" rx="2.5" fill="${accent}" ${OL1}/>`
  } else {
    // Pixie / undercut
    hairSVG = `
    <path d="M22 28 Q22 8 50 8 Q78 8 78 28" fill="${hairCol}" ${OL2}/>
    <rect x="22" y="26" width="56" height="8" rx="4" fill="${hairCol}" ${NS}/>
    <rect x="12" y="26" width="8" height="16" rx="4" fill="${hairCol}" ${NS}/>
    <rect x="80" y="26" width="8" height="16" rx="4" fill="${hairCol}" ${NS}/>
    <!-- Side swept fringe -->
    <path d="M22 28 Q30 18 52 22" fill="${hairCol}" ${OL1}/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
  ${ground()}

  <!-- Boots -->
  <rect x="20" y="110" width="28" height="16" rx="8" fill="${boot}" ${OL}/>
  <rect x="52" y="110" width="28" height="16" rx="8" fill="${boot}" ${OL}/>
  <rect x="22" y="112" width="12" height="5" rx="2.5" fill="white" fill-opacity="0.07" ${NS}/>
  <rect x="54" y="112" width="12" height="5" rx="2.5" fill="white" fill-opacity="0.07" ${NS}/>

  <!-- Legs -->
  <rect x="22" y="93" width="24" height="22" rx="8" fill="${pants}" ${OL}/>
  <rect x="54" y="93" width="24" height="22" rx="8" fill="${pants}" ${OL}/>
  <line x1="34" y1="93" x2="34" y2="115" stroke="${pantsDark}" stroke-width="1.5"/>
  <line x1="66" y1="93" x2="66" y2="115" stroke="${pantsDark}" stroke-width="1.5"/>

  <!-- Jacket base -->
  <rect x="8" y="60" width="84" height="36" rx="14" fill="${jacket}" ${OL}/>

  <!-- Vest centre panel -->
  <rect x="28" y="60" width="44" height="36" rx="0" fill="${vest}" ${NS}/>

  <!-- Jacket lapels (V-opening) -->
  <polygon points="28,60 50,82 28,96" fill="${jacket}" ${NS}/>
  <polygon points="72,60 50,82 72,96" fill="${jacket}" ${NS}/>
  <line x1="28" y1="60" x2="50" y2="82" stroke="${jackLight}" stroke-width="1.5"/>
  <line x1="72" y1="60" x2="50" y2="82" stroke="${jackLight}" stroke-width="1.5"/>
  <line x1="50" y1="82" x2="50" y2="94" stroke="${vestDark}" stroke-width="1"/>

  <!-- Belt -->
  <rect x="8" y="90" width="84" height="8" rx="4" fill="${jackDark}" ${OL2}/>
  <rect x="44" y="89" width="12" height="10" rx="2" fill="${shade(jacket, 35)}" ${OL1}/>
  <rect x="46" y="91" width="8"  height="6"  rx="1" fill="${jackDark}" ${NS}/>

  <!-- Shoulder caps -->
  <ellipse cx="15" cy="66" rx="14" ry="12" fill="${jacket}" ${OL}/>
  <ellipse cx="85" cy="66" rx="14" ry="12" fill="${jacket}" ${OL}/>

  <!-- Arms -->
  <rect x="1"  y="65" width="16" height="28" rx="8" fill="${jacket}" ${OL}/>
  <rect x="83" y="65" width="16" height="28" rx="8" fill="${jacket}" ${OL}/>

  <!-- Fists -->
  <circle cx="9"  cy="95" r="11" fill="${skin}" ${OL}/>
  <circle cx="91" cy="95" r="11" fill="${skin}" ${OL}/>
  <path d="M3  92 Q9  89 15 92" stroke="${skinDark}" stroke-width="1.2" fill="none"/>
  <path d="M85 92 Q91 89 97 92" stroke="${skinDark}" stroke-width="1.2" fill="none"/>

  <!-- Neck -->
  <rect x="38" y="57" width="24" height="10" rx="5" fill="${skin}" ${NS}/>

  <!-- Ear + earring -->
  <circle cx="22" cy="34" r="9" fill="${skin}" ${OL}/>
  <circle cx="78" cy="34" r="9" fill="${skin}" ${OL}/>
  <circle cx="22" cy="34" r="5" fill="${skinDark}" ${NS}/>
  <circle cx="78" cy="34" r="5" fill="${skinDark}" ${NS}/>
  <circle cx="20" cy="42" r="4" fill="${accent}" stroke="#1C1C1E" stroke-width="1.5"/>
  <circle cx="80" cy="42" r="4" fill="${accent}" stroke="#1C1C1E" stroke-width="1.5"/>

  <!-- Head -->
  <ellipse cx="50" cy="32" rx="28" ry="25" fill="${skin}" ${OL}/>

  <!-- Hair -->
  ${hairSVG}

  <!-- Eyes (visible — fierce, no opaque visor) -->
  <!-- Eyebrows — sharp / angled -->
  <path d="M24 22 L36 26" stroke="${hairCol}" stroke-width="3" stroke-linecap="round"/>
  <path d="M64 22 L76 26" stroke="${hairCol}" stroke-width="3" stroke-linecap="round"/>

  <!-- Eye whites -->
  <ellipse cx="33" cy="32" rx="9" ry="8" fill="white" ${OL2}/>
  <ellipse cx="67" cy="32" rx="9" ry="8" fill="white" ${OL2}/>

  <!-- Iris -->
  <circle cx="33" cy="32" r="6" fill="${iris}" ${NS}/>
  <circle cx="67" cy="32" r="6" fill="${iris}" ${NS}/>
  <circle cx="33" cy="32" r="3.5" fill="#1A1A1A" ${NS}/>
  <circle cx="67" cy="32" r="3.5" fill="#1A1A1A" ${NS}/>

  <!-- Tinted visor (semi-transparent — eyes show through) -->
  <rect x="24" y="22" width="52" height="16" rx="7" fill="${visorCol}" fill-opacity="0.45" ${OL}/>
  <rect x="26" y="24" width="20" height="5" rx="2.5" fill="white" fill-opacity="0.1" ${NS}/>

  <!-- Eye sparkle (visible through visor) -->
  <circle cx="36" cy="29" r="2.5" fill="white" fill-opacity="0.9" ${NS}/>
  <circle cx="70" cy="29" r="2.5" fill="white" fill-opacity="0.9" ${NS}/>

  <!-- Nose -->
  <ellipse cx="50" cy="43" rx="4" ry="3" fill="${skinDark}" ${NS}/>

  <!-- Mouth — slight fierce smirk -->
  <path d="M40 51 Q50 56 58 51" stroke="${skinDark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>

  <!-- Blush (subtle) -->
  <ellipse cx="26" cy="40" rx="7" ry="4" fill="#FFB3B3" fill-opacity="0.35" ${NS}/>
  <ellipse cx="74" cy="40" rx="7" ry="4" fill="#FFB3B3" fill-opacity="0.35" ${NS}/>
</svg>`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateCharacterSvg(seed: string, gender: 'male' | 'female'): string {
  return gender === 'female' ? female(seed) : male(seed)
}
