import { Application, Container, Text, TextStyle, Texture } from 'pixi.js'
import { RobotSprite } from './RobotSprite'
import { ClusterDot } from './ClusterDot'
import { WaypointSystem } from './WaypointSystem'
import { NoiseMotion } from './NoiseMotion'
import { EntranceEffect } from './EntranceEffect'
import { getCharacterCanvas } from '@/lib/avatar'
import { BRAND } from '@/lib/brand'
import type { Attendee } from '@/types/attendee'

const CLUSTER_THRESHOLD = 250
const SPATIAL_GRID_CELL = 80

export class RobotManager {
  private app: Application
  private stage: Container
  private sprites = new Map<string, RobotSprite>()
  private dots = new Map<string, ClusterDot>()
  private insertionOrder: string[] = []
  private waypoints = new WaypointSystem()
  private noise = new NoiseMotion()
  private overflowLabel: Text | null = null
  private overflowCount = 0
  private tickerBound: (() => void) | null = null

  constructor(app: Application) {
    this.app = app
    this.stage = new Container()
    app.stage.addChild(this.stage)
    this.startTicker()
  }

  private startTicker() {
    const tick = () => {
      this.noise.tick(this.app.ticker.deltaTime)
      const spriteList = Array.from(this.sprites.values())

      // Build coarse spatial grid for separation
      const grid = new Map<string, RobotSprite[]>()
      for (const s of spriteList) {
        const gx = Math.floor(s.x / SPATIAL_GRID_CELL)
        const gy = Math.floor(s.y / SPATIAL_GRID_CELL)
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${gx + dx},${gy + dy}`
            if (!grid.has(key)) grid.set(key, [])
            grid.get(key)!.push(s)
          }
        }
      }

      for (const sprite of spriteList) {
        const gx = Math.floor(sprite.x / SPATIAL_GRID_CELL)
        const gy = Math.floor(sprite.y / SPATIAL_GRID_CELL)
        const nearby = grid.get(`${gx},${gy}`) ?? []
        sprite.update(this.app.ticker.deltaTime, this.noise, this.waypoints, nearby)
      }
    }
    this.app.ticker.add(tick)
    this.tickerBound = tick
  }

  async loadInitialAttendees(attendees: Attendee[]) {
    const activeCount = attendees.length
    const visibleCount = Math.min(activeCount, CLUSTER_THRESHOLD)
    const visible = attendees.slice(-visibleCount)
    const clustered = attendees.slice(0, activeCount - visibleCount)

    for (const a of visible) {
      await this.spawnRobot(a, false)
    }
    for (const a of clustered) {
      this.spawnDot(a)
    }
    this.updateOverflowLabel()
  }

  async addAttendee(attendee: Attendee) {
    if (this.sprites.size >= CLUSTER_THRESHOLD) {
      const oldestId = this.insertionOrder[0]
      if (oldestId) {
        const old = this.sprites.get(oldestId)
        if (old) {
          this.stage.removeChild(old)
          old.destroy()
          this.sprites.delete(oldestId)
        }
        this.insertionOrder.shift()
        // Add as cluster dot instead
        const oldAttendee = { id: oldestId, avatar_color: BRAND.orange } as Attendee
        this.spawnDot(oldAttendee)
      }
    }
    await this.spawnRobot(attendee, true)
    this.updateOverflowLabel()
  }

  private async spawnRobot(attendee: Attendee, withEntrance: boolean) {
    const texture = await this.loadTexture(attendee.gender ?? (Math.random() < 0.5 ? 'male' : 'female'))
    const spawnPos = this.waypoints.randomSpawnPoint()
    const targetPos = this.waypoints.randomWaypoint()
    const color = attendee.avatar_color ?? BRAND.orange

    const sprite = new RobotSprite(
      attendee.id,
      attendee.first_name,
      texture,
      color,
      spawnPos.x,
      spawnPos.y,
      targetPos.x,
      targetPos.y
    )
    sprite.visible = !withEntrance

    this.stage.addChild(sprite)
    this.sprites.set(attendee.id, sprite)
    this.insertionOrder.push(attendee.id)

    if (withEntrance) {
      EntranceEffect.play(this.app, this.stage, spawnPos.x, spawnPos.y - 24, () => {
        sprite.visible = true
      })
    }
  }

  private spawnDot(attendee: Attendee) {
    if (this.dots.has(attendee.id)) return
    const dot = new ClusterDot(attendee.id, attendee.avatar_color ?? BRAND.orange, this.waypoints)
    this.stage.addChild(dot)
    this.dots.set(attendee.id, dot)
    this.overflowCount = this.dots.size
  }

  private async loadTexture(gender: 'male' | 'female'): Promise<Texture> {
    try {
      const canvas = await getCharacterCanvas(gender, 40, 80)
      return Texture.from(canvas)
    } catch {
      return Texture.WHITE
    }
  }

  private updateOverflowLabel() {
    const count = this.dots.size
    if (count === 0) {
      this.overflowLabel?.destroy()
      this.overflowLabel = null
      return
    }
    if (!this.overflowLabel) {
      const style = new TextStyle({
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        fill: '#FAFAFA',
      })
      this.overflowLabel = new Text({ text: '', style })
      this.overflowLabel.alpha = 0.6
      this.overflowLabel.x = 20
      this.overflowLabel.y = this.app.canvas.height - 80
      this.app.stage.addChild(this.overflowLabel)
    }
    this.overflowLabel.text = `+${count.toLocaleString()} more Gen AI`
  }

  destroy() {
    if (this.tickerBound) this.app.ticker.remove(this.tickerBound)
    this.stage.destroy({ children: true })
    this.overflowLabel?.destroy()
  }
}
