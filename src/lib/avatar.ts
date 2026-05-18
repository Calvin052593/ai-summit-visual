'use client'

// DiceBear bottts avatar → PixiJS-compatible Texture
// Runs fully client-side; @dicebear/bottts is bundled so display works offline once loaded.

import { createAvatar } from '@dicebear/core'
import * as bottts from '@dicebear/bottts'

// LRU cache: max 500 textures to bound memory on long-running displays
const MAX_CACHE = 500
const svgCache = new Map<string, string>()

function evictIfNeeded() {
  if (svgCache.size >= MAX_CACHE) {
    const firstKey = svgCache.keys().next().value
    if (firstKey) svgCache.delete(firstKey)
  }
}

export function generateAvatarSvg(seed: string): string {
  const cacheKey = seed
  if (svgCache.has(cacheKey)) return svgCache.get(cacheKey)!

  const svg = createAvatar(bottts, {
    seed,
    size: 80,
    backgroundColor: ['transparent'],
  }).toString()

  evictIfNeeded()
  svgCache.set(cacheKey, svg)
  return svg
}

export function avatarSvgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

// Rasterize SVG to an HTMLCanvasElement for use with PixiJS Texture.from(canvas)
export async function rasterizeAvatarSvg(svg: string, size = 64): Promise<HTMLCanvasElement> {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image(size, size)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, size, size)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load avatar SVG'))
    }
    img.src = url
  })
}

// Cache for rasterized canvas elements (keyed by seed)
const canvasCache = new Map<string, HTMLCanvasElement>()

export async function getAvatarCanvas(seed: string, size = 64): Promise<HTMLCanvasElement> {
  if (canvasCache.has(seed)) return canvasCache.get(seed)!
  const svg = generateAvatarSvg(seed)
  const canvas = await rasterizeAvatarSvg(svg, size)
  if (canvasCache.size >= MAX_CACHE) {
    const firstKey = canvasCache.keys().next().value
    if (firstKey) canvasCache.delete(firstKey)
  }
  canvasCache.set(seed, canvas)
  return canvas
}

// ── Procedural character sprites (unique per seed + gender) ─────────────────
import { generateCharacterSvg } from './CharacterGenerator'

const charCanvasCache = new Map<string, HTMLCanvasElement>()

export async function getCharacterCanvas(
  seed: string,
  gender: 'male' | 'female',
  width = 44,
  height = 88
): Promise<HTMLCanvasElement> {
  const key = `${seed}-${gender}`
  if (charCanvasCache.has(key)) return charCanvasCache.get(key)!
  if (charCanvasCache.size >= MAX_CACHE) {
    const firstKey = charCanvasCache.keys().next().value
    if (firstKey) charCanvasCache.delete(firstKey)
  }

  const svgText = generateCharacterSvg(seed, gender)
  const blob = new Blob([svgText], { type: 'image/svg+xml' })
  const blobUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image(width * 2, height * 2)
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      const canvas = document.createElement('canvas')
      canvas.width = width * 2
      canvas.height = height * 2
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width * 2, height * 2)
      charCanvasCache.set(key, canvas)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      reject(new Error('Failed to rasterise character SVG'))
    }
    img.src = blobUrl
  })
}
