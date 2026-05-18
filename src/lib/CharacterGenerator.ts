/**
 * Procedural Pokémon-trainer-style character SVG generator.
 * Characters are fully deterministic from `seed` + `gender`.
 * No two seeds produce identical characters (caps, jackets, colours all vary).
 */

// ── Deterministic seeded helpers ─────────────────────────────────────────────

function h(seed: string, idx: number): number {
  let v = 5381 + idx * 127
  for (let i = 0; i < seed.length; i++) {
    v = (((v << 5) + v) ^ seed.charCodeAt(i)) & 0x7fffffff
  }
  return v
}

function pick<T>(arr: readonly T[], seed: string, idx: number): T {
  return arr[h(seed, idx) % arr.length]
}

function bool(seed: string, idx: number): boolean {
  return h(seed, idx) % 2 === 0
}

function shade(hex: string, amt: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amt))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amt))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amt))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// ── Palettes ─────────────────────────────────────────────────────────────────

const SKINS = [
  ['#FDDCB5', '#F0A875'],
  ['#F5C08A', '#E09050'],
  ['#D4956A', '#B07040'],
  ['#B07040', '#8A5528'],
  ['#7D5030', '#5A3010'],
] as const

const HAIR = ['#1C1C1E', '#2C1010', '#7B3F1E', '#1A1A3E', '#3D2010', '#1A3010'] as const

const TOPS = [
  '#EF4444', '#3B82F6', '#22C55E', '#F97316', '#8B5CF6',
  '#06B6D4', '#EC4899', '#EAB308', '#F8FAFC', '#64748B',
  '#10B981', '#F43F5E', '#0EA5E9', '#84CC16', '#F59E0B',
  '#6366F1', '#14B8A6', '#FB7185', '#A3E635', '#38BDF8',
] as const

const JACKETS = [
  '#1D4ED8', '#B91C1C', '#15803D', '#7C3AED', '#0F766E',
  '#92400E', '#1F2937', '#BE185D', '#C2410C', '#374151',
  '#0E7490', '#6D28D9', '#065F46', '#9A3412', '#1E3A5F',
  '#312E81', '#701A75', '#064E3B', '#1C1917', '#0C4A6E',
] as const

const PANTS = [
  '#1E3A5F', '#374151', '#1A3320', '#1C1C1E', '#3B2E1A',
  '#1E293B', '#292524', '#1F2937', '#0F172A', '#27272A',
] as const

const SKIRTS = [
  '#F472B6', '#93C5FD', '#C4B5FD', '#FCA5A5', '#F8FAFC',
  '#6EE7B7', '#FDE68A', '#A78BFA', '#34D399', '#FB923C',
  '#E879F9', '#38BDF8', '#F9A8D4', '#BAE6FD', '#DDD6FE',
] as const

const SHOES = [
  ['#F1F5F9', '#64748B'],
  ['#1C1C1E', '#374151'],
  ['#DC2626', '#991B1B'],
  ['#2563EB', '#1D4ED8'],
  ['#92400E', '#78350F'],
  ['#166534', '#14532D'],
  ['#C2410C', '#9A3412'],
  ['#4F46E5', '#3730A3'],
] as const

const CAPS = [
  '#DC2626', '#2563EB', '#1C1C1E', '#15803D',
  '#7C3AED', '#F97316', '#0F172A', '#B45309',
  '#0E7490', '#BE185D', '#374151', '#166534',
] as const

const EYE_COLORS = ['#1C1C1E', '#3B1F0F', '#1A3040', '#1A1A3E', '#1A3A1A'] as const

// ── SVG helpers ───────────────────────────────────────────────────────────────

function shadow(): string {
  return `<ellipse cx="20" cy="79" rx="11" ry="2.5" fill="#000" fill-opacity="0.3"/>`
}

// ── Male character ────────────────────────────────────────────────────────────

function maleSVG(seed: string): string {
  const [skinBase, skinShadow] = pick(SKINS, seed, 0)
  const hairColor = pick(HAIR, seed, 1)
  const hairStyle = h(seed, 2) % 3          // 0=spiky  1=flat/bowl  2=side-part
  const topColor = pick(TOPS, seed, 3)
  const hasCap = bool(seed, 4)
  const capColor = pick(CAPS, seed, 5)
  const hasJacket = bool(seed, 6)
  const jacketColor = pick(JACKETS, seed, 7)
  const pantsColor = pick(PANTS, seed, 8)
  const [shoeUpper, shoeSole] = pick(SHOES, seed, 9)
  const eyeColor = pick(EYE_COLORS, seed, 10)
  const pantsDark = shade(pantsColor, -25)
  const armColor = hasJacket ? jacketColor : topColor

  // ── Hair ──
  let hairSVG: string
  if (hasCap) {
    // Only sideburns + neck hair visible under cap
    hairSVG = `
      <rect x="7" y="15" width="3" height="6" rx="1.5" fill="${hairColor}"/>
      <rect x="30" y="15" width="3" height="6" rx="1.5" fill="${hairColor}"/>`
  } else if (hairStyle === 0) {
    // Spiky (Red / Ash style)
    hairSVG = `
      <path d="M7 16 Q7 3 20 3 Q33 3 33 16" fill="${hairColor}"/>
      <polygon points="10,15 13,7 16,14" fill="${hairColor}"/>
      <polygon points="16,7 19,1 22,7" fill="${hairColor}"/>
      <polygon points="22,7 25,3 28,9" fill="${hairColor}"/>
      <rect x="7" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>
      <rect x="30" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>`
  } else if (hairStyle === 1) {
    // Flat / bowl cut
    hairSVG = `
      <path d="M7 16 Q7 4 20 4 Q33 4 33 16" fill="${hairColor}"/>
      <rect x="7" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>
      <rect x="30" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>
      <rect x="7" y="14" width="26" height="4" rx="2" fill="${hairColor}"/>`
  } else {
    // Side-part
    hairSVG = `
      <path d="M7 16 Q7 4 20 4 Q33 4 33 16" fill="${hairColor}"/>
      <path d="M8 10 Q14 6 20 10" fill="${skinBase}" stroke="${skinBase}" stroke-width="1"/>
      <rect x="7" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>
      <rect x="30" y="14" width="3" height="8" rx="1.5" fill="${hairColor}"/>`
  }

  // ── Cap ──
  const capDark = shade(capColor, -30)
  const capSVG = hasCap ? `
    <path d="M8 14 Q8 3 20 3 Q32 3 32 14" fill="${capColor}"/>
    <rect x="3" y="12" width="34" height="5" rx="2.5" fill="${capDark}"/>
    <rect x="3" y="12" width="34" height="2" rx="1.5" fill="${capColor}" fill-opacity="0.5"/>
    <circle cx="20" cy="8" r="3.5" fill="${capDark}" fill-opacity="0.7"/>
    <circle cx="20" cy="8" r="2" fill="${shade(capColor, 30)}" fill-opacity="0.5"/>` : ''

  // ── Jacket ──
  const jacketDark = shade(jacketColor, -30)
  const jacketSVG = hasJacket ? `
    <rect x="9" y="27" width="9" height="23" rx="3" fill="${jacketColor}"/>
    <rect x="22" y="27" width="9" height="23" rx="3" fill="${jacketColor}"/>
    <path d="M18 27 L16 33 L20 37 L24 33 L22 27" fill="${topColor}"/>
    <line x1="9" y1="27" x2="9" y2="50" stroke="${jacketDark}" stroke-width="0.8"/>
    <line x1="31" y1="27" x2="31" y2="50" stroke="${jacketDark}" stroke-width="0.8"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 80">
  ${shadow()}

  <!-- Shoes -->
  <rect x="4" y="70" width="13" height="9" rx="4.5" fill="${shoeUpper}"/>
  <rect x="23" y="70" width="13" height="9" rx="4.5" fill="${shoeUpper}"/>
  <rect x="4" y="75" width="13" height="4" rx="2" fill="${shoeSole}"/>
  <rect x="23" y="75" width="13" height="4" rx="2" fill="${shoeSole}"/>
  <rect x="5" y="70" width="4" height="2" rx="1" fill="white" fill-opacity="0.2"/>
  <rect x="24" y="70" width="4" height="2" rx="1" fill="white" fill-opacity="0.2"/>

  <!-- Pants -->
  <rect x="5" y="52" width="12" height="20" rx="5" fill="${pantsColor}"/>
  <rect x="23" y="52" width="12" height="20" rx="5" fill="${pantsColor}"/>
  <rect x="4" y="46" width="32" height="11" rx="4" fill="${pantsDark}"/>

  <!-- Body -->
  <rect x="9" y="27" width="22" height="23" rx="5" fill="${topColor}"/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="1" y="27" width="9" height="18" rx="4.5" fill="${armColor}"/>
  <rect x="30" y="27" width="9" height="18" rx="4.5" fill="${armColor}"/>
  <circle cx="5.5" cy="46" r="4" fill="${skinBase}"/>
  <circle cx="34.5" cy="46" r="4" fill="${skinBase}"/>

  <!-- Neck -->
  <rect x="16" y="21" width="8" height="8" fill="${skinBase}"/>

  <!-- Head -->
  <circle cx="20" cy="15" r="13" fill="${skinBase}"/>
  <circle cx="20" cy="21" r="8" fill="${skinShadow}" fill-opacity="0.15"/>

  ${hairSVG}
  ${capSVG}

  <!-- Ears -->
  <circle cx="7" cy="16" r="2.8" fill="${skinBase}"/>
  <circle cx="33" cy="16" r="2.8" fill="${skinBase}"/>

  <!-- Eyebrows -->
  <path d="M12 12 Q15 10.5 17.5 12" stroke="${hairColor}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M22.5 12 Q25 10.5 28 12" stroke="${hairColor}" stroke-width="1.4" fill="none" stroke-linecap="round"/>

  <!-- Eyes -->
  <ellipse cx="15" cy="16.5" rx="3.2" ry="3.2" fill="white"/>
  <ellipse cx="25" cy="16.5" rx="3.2" ry="3.2" fill="white"/>
  <circle cx="15" cy="16.5" r="2.1" fill="${eyeColor}"/>
  <circle cx="25" cy="16.5" r="2.1" fill="${eyeColor}"/>
  <circle cx="15.8" cy="15.8" r="0.85" fill="white"/>
  <circle cx="25.8" cy="15.8" r="0.85" fill="white"/>

  <!-- Mouth -->
  <path d="M17 21 Q20 23.5 23 21" stroke="#B07060" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</svg>`
}

// ── Female character ──────────────────────────────────────────────────────────

function femaleSVG(seed: string): string {
  const [skinBase, skinShadow] = pick(SKINS, seed, 0)
  const hairColor = pick(HAIR, seed, 1)
  const hairStyle = h(seed, 2) % 3          // 0=ponytail  1=twin-tails  2=bob
  const topColor = pick(TOPS, seed, 3)
  const hasCap = bool(seed, 4)
  const capColor = pick(CAPS, seed, 5)
  const hasJacket = bool(seed, 6)
  const jacketColor = pick(JACKETS, seed, 7)
  const skirtColor = pick(SKIRTS, seed, 8)
  const [shoeUpper, shoeSole] = pick(SHOES, seed, 9)
  const eyeColor = pick(EYE_COLORS, seed, 10)
  const skirtDark = shade(skirtColor, -30)
  const armColor = hasJacket ? jacketColor : topColor
  const bowColor = pick(TOPS, seed, 11)   // hair accessory colour differs from top

  // ── Hair ──
  let hairSVG: string
  if (hasCap) {
    // Long side strands visible below cap
    hairSVG = `
      <rect x="5" y="13" width="5" height="20" rx="2.5" fill="${hairColor}"/>
      <rect x="30" y="13" width="5" height="20" rx="2.5" fill="${hairColor}"/>`
  } else if (hairStyle === 0) {
    // High ponytail
    hairSVG = `
      <ellipse cx="20" cy="11" rx="13" ry="9" fill="${hairColor}"/>
      <rect x="5" y="9" width="5" height="20" rx="2.5" fill="${hairColor}"/>
      <rect x="30" y="9" width="5" height="20" rx="2.5" fill="${hairColor}"/>
      <rect x="17.5" y="1" width="5" height="8" rx="2.5" fill="${hairColor}"/>
      <!-- Bow -->
      <path d="M14 3 Q11 0 13 4 Q11 8 15 6 L19.5 3.5 Z" fill="${bowColor}"/>
      <path d="M26 3 Q29 0 27 4 Q29 8 25 6 L20.5 3.5 Z" fill="${bowColor}"/>
      <circle cx="20" cy="3.5" r="2.2" fill="white" fill-opacity="0.8"/>`
  } else if (hairStyle === 1) {
    // Twin-tails (pigtails)
    hairSVG = `
      <ellipse cx="20" cy="12" rx="13" ry="8" fill="${hairColor}"/>
      <path d="M6 11 Q0 12 0 20 Q0 26 5 26 Q4 20 7 15" fill="${hairColor}"/>
      <path d="M34 11 Q40 12 40 20 Q40 26 35 26 Q36 20 33 15" fill="${hairColor}"/>
      <!-- Hair ties -->
      <circle cx="7" cy="11" r="2.5" fill="${bowColor}"/>
      <circle cx="33" cy="11" r="2.5" fill="${bowColor}"/>`
  } else {
    // Short bob
    hairSVG = `
      <ellipse cx="20" cy="13" rx="13" ry="10" fill="${hairColor}"/>
      <rect x="5" y="11" width="5" height="11" rx="2.5" fill="${hairColor}"/>
      <rect x="30" y="11" width="5" height="11" rx="2.5" fill="${hairColor}"/>
      <!-- Small clip -->
      <rect x="24" y="8" width="6" height="3" rx="1.5" fill="${bowColor}"/>`
  }

  // ── Cap ──
  const capDark = shade(capColor, -30)
  const capSVG = hasCap ? `
    <path d="M8 13 Q8 2 20 2 Q32 2 32 13" fill="${capColor}"/>
    <rect x="3" y="11" width="34" height="5" rx="2.5" fill="${capDark}"/>
    <rect x="3" y="11" width="34" height="2" rx="1.5" fill="${capColor}" fill-opacity="0.5"/>
    <circle cx="20" cy="7" r="3.5" fill="${capDark}" fill-opacity="0.7"/>
    <circle cx="20" cy="7" r="2" fill="${shade(capColor, 30)}" fill-opacity="0.5"/>` : ''

  // ── Jacket ──
  const jacketDark = shade(jacketColor, -30)
  const jacketSVG = hasJacket ? `
    <rect x="9" y="26" width="8" height="22" rx="3" fill="${jacketColor}"/>
    <rect x="23" y="26" width="8" height="22" rx="3" fill="${jacketColor}"/>
    <path d="M17 26 L15.5 32 L20 36 L24.5 32 L23 26" fill="${topColor}"/>
    <line x1="9" y1="26" x2="9" y2="48" stroke="${jacketDark}" stroke-width="0.8"/>
    <line x1="31" y1="26" x2="31" y2="48" stroke="${jacketDark}" stroke-width="0.8"/>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 80">
  ${shadow()}

  <!-- Boots / Shoes -->
  <rect x="5" y="67" width="12" height="12" rx="5" fill="${shoeUpper}"/>
  <rect x="23" y="67" width="12" height="12" rx="5" fill="${shoeUpper}"/>
  <rect x="5" y="67" width="12" height="4.5" rx="2" fill="${shoeSole}"/>
  <rect x="23" y="67" width="12" height="4.5" rx="2" fill="${shoeSole}"/>
  <rect x="6" y="68" width="4" height="2" rx="1" fill="white" fill-opacity="0.25"/>
  <rect x="24" y="68" width="4" height="2" rx="1" fill="white" fill-opacity="0.25"/>

  <!-- Legs -->
  <rect x="6" y="55" width="11" height="14" rx="4" fill="${skinBase}"/>
  <rect x="23" y="55" width="11" height="14" rx="4" fill="${skinBase}"/>

  <!-- Skirt -->
  <path d="M7 45 Q5 64 20 64 Q35 64 33 45 Z" fill="${skirtColor}"/>
  <path d="M9 45 Q8 56 15 60" stroke="white" stroke-width="1" fill="none" stroke-opacity="0.25" stroke-linecap="round"/>
  <rect x="9" y="43" width="22" height="6" rx="3" fill="${skirtDark}"/>

  <!-- Body -->
  <rect x="9" y="25" width="22" height="22" rx="5" fill="${topColor}"/>
  ${jacketSVG}

  <!-- Arms -->
  <rect x="1" y="25" width="9" height="18" rx="4.5" fill="${armColor}"/>
  <rect x="30" y="25" width="9" height="18" rx="4.5" fill="${armColor}"/>
  <circle cx="5.5" cy="44" r="4" fill="${skinBase}"/>
  <circle cx="34.5" cy="44" r="4" fill="${skinBase}"/>

  <!-- Neck -->
  <rect x="16" y="19" width="8" height="8" fill="${skinBase}"/>

  <!-- Head -->
  <circle cx="20" cy="14" r="13" fill="${skinBase}"/>
  <circle cx="20" cy="20" r="8" fill="${skinShadow}" fill-opacity="0.15"/>

  ${hairSVG}
  ${capSVG}

  <!-- Ears -->
  <circle cx="7" cy="15" r="2.8" fill="${skinBase}"/>
  <circle cx="33" cy="15" r="2.8" fill="${skinBase}"/>

  <!-- Eyebrows (softer curve) -->
  <path d="M11 11 Q14 9.5 17 11" stroke="${hairColor}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M23 11 Q26 9.5 29 11" stroke="${hairColor}" stroke-width="1.3" fill="none" stroke-linecap="round"/>

  <!-- Eyes (larger, feminine) -->
  <ellipse cx="14.5" cy="15" rx="3.5" ry="3.5" fill="white"/>
  <ellipse cx="25.5" cy="15" rx="3.5" ry="3.5" fill="white"/>
  <circle cx="14.5" cy="15" r="2.4" fill="${eyeColor}"/>
  <circle cx="25.5" cy="15" r="2.4" fill="${eyeColor}"/>
  <circle cx="15.3" cy="14.3" r="0.9" fill="white"/>
  <circle cx="26.3" cy="14.3" r="0.9" fill="white"/>

  <!-- Eyelashes -->
  <path d="M11 12.5 L11.8 11" stroke="${hairColor}" stroke-width="0.8" stroke-linecap="round"/>
  <path d="M13 11.5 L13.5 10" stroke="${hairColor}" stroke-width="0.8" stroke-linecap="round"/>
  <path d="M22 11.5 L22.5 10" stroke="${hairColor}" stroke-width="0.8" stroke-linecap="round"/>
  <path d="M24 12.5 L24.8 11" stroke="${hairColor}" stroke-width="0.8" stroke-linecap="round"/>

  <!-- Blush -->
  <ellipse cx="10" cy="18" rx="3" ry="1.5" fill="#FFB3B3" fill-opacity="0.55"/>
  <ellipse cx="30" cy="18" rx="3" ry="1.5" fill="#FFB3B3" fill-opacity="0.55"/>

  <!-- Mouth -->
  <path d="M16.5 20 Q20 22.5 23.5 20" stroke="#B07060" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</svg>`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateCharacterSvg(seed: string, gender: 'male' | 'female'): string {
  return gender === 'female' ? femaleSVG(seed) : maleSVG(seed)
}
