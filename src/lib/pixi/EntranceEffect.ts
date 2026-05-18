import { Container, Graphics } from 'pixi.js'
import type { Application } from 'pixi.js'

export class EntranceEffect {
  static play(app: Application, stage: Container, x: number, y: number, onComplete: () => void) {
    const DURATION = 900
    const startTime = performance.now()

    // Radial orange pulse ring
    const pulse = new Graphics()
    pulse.circle(0, 0, 30).stroke({ color: 0xff4f00, width: 3, alpha: 1 })
    pulse.position.set(x, y - 30)
    stage.addChild(pulse)

    // Secondary softer ring
    const pulse2 = new Graphics()
    pulse2.circle(0, 0, 20).stroke({ color: 0xffb800, width: 2, alpha: 0.7 })
    pulse2.position.set(x, y - 30)
    stage.addChild(pulse2)

    // Spark particles (10 sparks shooting outward)
    const SPARK_COUNT = 10
    const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
      const angle = (i / SPARK_COUNT) * Math.PI * 2
      const speed = 60 + Math.random() * 40
      const spark = new Graphics()
      spark.rect(-1.5, -4, 3, 8).fill({ color: i % 2 === 0 ? 0xff4f00 : 0xffb800, alpha: 1 })
      spark.position.set(x, y - 30)
      spark.rotation = angle
      stage.addChild(spark)
      return { spark, angle, speed }
    })

    const tickHandler = () => {
      const elapsed = performance.now() - startTime
      const t = Math.min(elapsed / DURATION, 1)
      const easeOut = 1 - Math.pow(1 - t, 3)

      // Pulse: scale up and fade out
      pulse.scale.set(1 + easeOut * 2.2)
      pulse.alpha = 1 - easeOut

      pulse2.scale.set(1 + easeOut * 1.5)
      pulse2.alpha = (1 - easeOut) * 0.6

      // Sparks: fly outward and fade
      for (const { spark, angle, speed } of sparks) {
        const dist = easeOut * speed
        spark.x = x + Math.cos(angle) * dist
        spark.y = (y - 30) + Math.sin(angle) * dist
        spark.alpha = t < 0.4 ? 1 : 1 - (t - 0.4) / 0.6
        spark.scale.y = 1 - easeOut * 0.5
      }

      if (t >= 1) {
        app.ticker.remove(tickHandler)
        pulse.destroy()
        pulse2.destroy()
        sparks.forEach(({ spark }) => spark.destroy())
        onComplete()
      }
    }

    app.ticker.add(tickHandler)
  }
}
