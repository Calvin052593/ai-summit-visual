import { createNoise3D } from 'simplex-noise'

const noise3D = createNoise3D()

export class NoiseMotion {
  private time = 0

  tick(dt: number) {
    this.time += dt * 0.016 // ~60fps baseline
  }

  get(x: number, y: number, scale = 0.002, strength = 0.8): { nx: number; ny: number } {
    const t = this.time * 0.0004
    const nx = noise3D(x * scale, y * scale, t) * strength
    const ny = noise3D(x * scale + 100, y * scale, t) * strength
    return { nx, ny }
  }
}
