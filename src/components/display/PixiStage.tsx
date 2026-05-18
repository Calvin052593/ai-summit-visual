'use client'

import { useEffect, useRef } from 'react'
import type { Attendee } from '@/types/attendee'

interface PixiStageProps {
  initialAttendees: Attendee[]
  newAttendee: Attendee | null
}

export function PixiStage({ initialAttendees, newAttendee }: PixiStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const managerRef = useRef<import('@/lib/pixi/RobotManager').RobotManager | null>(null)
  const appRef = useRef<import('pixi.js').Application | null>(null)

  // One-time initialization
  useEffect(() => {
    if (!canvasRef.current) return
    let destroyed = false

    const init = async () => {
      const { Application } = await import('pixi.js')
      const { RobotManager } = await import('@/lib/pixi/RobotManager')

      if (destroyed || !canvasRef.current) return

      const app = new Application()
      await app.init({
        canvas: canvasRef.current,
        width: 1920,
        height: 900,
        backgroundColor: 0x0a0a0a,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })

      if (destroyed) { app.destroy(false); return }

      appRef.current = app
      const manager = new RobotManager(app)
      managerRef.current = manager

      // Load background image
      const { Sprite, Assets } = await import('pixi.js')
      try {
        const bgTexture = await Assets.load('/images/mitec-bg.svg')
        const bg = new Sprite(bgTexture)
        bg.width = 1920
        bg.height = 900
        app.stage.addChildAt(bg, 0)
      } catch {
        // Background placeholder not available — continue without it
      }

      // Overlay scan-lines for "rendered simulation" aesthetic
      const { Graphics } = await import('pixi.js')
      const scanlines = new Graphics()
      for (let y = 0; y < 900; y += 4) {
        scanlines.rect(0, y, 1920, 1).fill({ color: 0x000000, alpha: 0.08 })
      }
      app.stage.addChild(scanlines)

      await manager.loadInitialAttendees(initialAttendees)
    }

    init().catch(console.error)

    return () => {
      destroyed = true
      managerRef.current?.destroy()
      appRef.current?.destroy(false)
      appRef.current = null
      managerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally empty — init once only

  // Add new attendees without re-initializing
  useEffect(() => {
    if (!newAttendee || !managerRef.current) return
    managerRef.current.addAttendee(newAttendee).catch(console.error)
  }, [newAttendee])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full"
      style={{ height: '900px', imageRendering: 'auto' }}
    />
  )
}
