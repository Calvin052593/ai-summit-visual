export const BRAND = {
  orange: '#FF4F00',
  black: '#0A0A0A',
  white: '#FAFAFA',
  gold: '#FFB800',
  cyan: '#00E5FF',
} as const

export const AVATAR_COLORS = [
  BRAND.orange,
  BRAND.gold,
  BRAND.cyan,
  '#FF6B35',
  '#FF8C42',
  '#FFC947',
  '#00C9E0',
  '#FF3D00',
  '#FFCA28',
  '#18FFFF',
] as const

export type AvatarColor = typeof AVATAR_COLORS[number]

export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

export const EVENT = {
  name: 'AI Summit',
  tagline: "You're not Gen X, not Gen Y — You're Gen AI",
  capacity: 3000,
  day1: 'Sat Aug 8, 2026',
  day2: 'Sun Aug 9, 2026',
  venue: 'MITEC Kuala Lumpur, Malaysia',
} as const
