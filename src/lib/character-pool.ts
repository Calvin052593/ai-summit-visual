/**
 * Character sprite pool for the display floor.
 *
 * Drop real avatar sprites into:
 *   /public/characters/male/   — male_01.png … male_10.png
 *   /public/characters/female/ — female_01.png … female_10.png
 *
 * Sprites should be 512×512 transparent PNG, full-body adult, smart-casual attire.
 * See README for full spec and sources.
 *
 * To expand the pool: add files + extend the arrays below.
 */

// REPLACE: swap .svg extensions to .png once real sprites are dropped in
export const malePool: string[] = Array.from({ length: 10 }, (_, i) =>
  `/characters/male/male_${String(i + 1).padStart(2, '0')}.svg`
)

export const femalePool: string[] = Array.from({ length: 10 }, (_, i) =>
  `/characters/female/female_${String(i + 1).padStart(2, '0')}.svg`
)

function hashSeed(seed: string): number {
  let v = 5381
  for (let i = 0; i < seed.length; i++) {
    v = (((v << 5) + v) ^ seed.charCodeAt(i)) & 0x7fffffff
  }
  return v
}

/**
 * Deterministically pick a character index from the correct gender pool.
 * Returns both the URL path and the integer id for storage.
 */
export function getCharacterForAttendee(
  gender: 'male' | 'female',
  seed: string
): { path: string; characterId: number } {
  const pool = gender === 'female' ? femalePool : malePool
  const characterId = Math.abs(hashSeed(seed)) % pool.length
  return { path: pool[characterId], characterId }
}

export function getCharacterPath(gender: 'male' | 'female', characterId: number): string {
  const pool = gender === 'female' ? femalePool : malePool
  return pool[characterId % pool.length]
}
