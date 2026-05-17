import { Container, Graphics } from 'pixi.js'
import type { Application } from 'pixi.js'

export class EntranceEffect {
  static play(app: Application, stage: Container, x: number, y: number, onComplete: () => void) {
    const duration = 800
    const startTime = performance.now()

    // Glow ring
    const ring = new Graphics()
    ring.circle(0, 0, 28).stroke({ color: 0x00e5ff, width: 3, alpha: 0.9 })
    ring.position.set(x, y - 24)
    stage.addChild(ring)

    // Scan-line bars (6 horizontal bars that sweep top→bottom)
    const barCount = 6
    const barHeight = 3
    const scanRange = 60
    const bars: Graphics[] = Array.from({ length: barCount }, (_, i) => {
      const bar = new Graphics()
      bar.rect(-24, 0, 48, barHeight).fill({ color: 0x00e5ff, alpha: 0.7 })
      bar.position.set(x, y - scanRange / 2 + i * (scanRange / barCount))
      stage.addChild(bar)
      return bar
    })

    const tickHandler = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 2)

      // Ring: scale up and fade
      ring.scale.set(eased * 1.6)
      ring.alpha = 1 - eased

      // Bars: sweep down and fade
      bars.forEach((bar, i) => {
        const offset = i * (scanRange / barCount)
        bar.y = (y - scanRange / 2 + offset) + eased * scanRange
        bar.alpha = 1 - eased
      })

      if (progress >= 1) {
        app.ticker.remove(tickHandler)
        ring.destroy()
        bars.forEach((b) => b.destroy())
        onComplete()
      }
    }

    app.ticker.add(tickHandler)
  }
}
