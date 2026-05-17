import { Container, Sprite, Text, Graphics, Texture, TextStyle } from 'pixi.js'
import type { WaypointSystem } from './WaypointSystem'
import type { NoiseMotion } from './NoiseMotion'

const SPEED = 0.6
const ARRIVAL_THRESHOLD = 12
const PAUSE_MIN = 1500
const PAUSE_MAX = 4000
const MAX_VELOCITY = 1.2
const SEPARATION_RADIUS = 48
const SEPARATION_STRENGTH = 0.3
const WOBBLE_AMOUNT = 0.04

// Portrait dimensions for the character sprite
const CHAR_W = 44
const CHAR_H = 88

export class RobotSprite extends Container {
  readonly attendeeId: string
  readonly firstName: string
  private avatarSprite: Sprite
  private namePill: Container
  private namePillBg: Graphics
  private nameText: Text
  private targetX: number
  private targetY: number
  private vx = 0
  private vy = 0
  private pauseUntil = 0
  private wobbleAngle = 0
  private wobbleSpeed: number
  private speed: number
  color: string

  constructor(
    attendeeId: string,
    firstName: string,
    texture: Texture,
    color: string,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number
  ) {
    super()
    this.attendeeId = attendeeId
    this.firstName = firstName
    this.color = color
    this.x = startX
    this.y = startY
    this.targetX = targetX
    this.targetY = targetY
    this.speed = SPEED * (0.85 + Math.random() * 0.3)
    this.wobbleSpeed = 0.02 + Math.random() * 0.03

    // Character sprite — no tint, natural colors
    this.avatarSprite = new Sprite(texture)
    this.avatarSprite.anchor.set(0.5, 1)
    this.avatarSprite.width = CHAR_W
    this.avatarSprite.height = CHAR_H
    this.addChild(this.avatarSprite)

    // Name pill — positioned above the character head
    this.namePill = new Container()
    this.namePill.y = -(CHAR_H + 12)

    this.namePillBg = new Graphics()
    this.namePill.addChild(this.namePillBg)

    const style = new TextStyle({
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 11,
      fontWeight: '600',
      fill: '#FAFAFA',
      letterSpacing: 0.5,
    })
    this.nameText = new Text({ text: firstName.toUpperCase(), style })
    this.nameText.anchor.set(0.5, 0.5)
    this.namePill.addChild(this.nameText)

    this.drawPill()
    this.addChild(this.namePill)

    // Subtle drop shadow
    this.addChild(this.buildShadow())
  }

  private drawPill() {
    const padding = { x: 8, y: 4 }
    const w = this.nameText.width + padding.x * 2
    const h = this.nameText.height + padding.y * 2
    this.namePillBg.clear()
    this.namePillBg
      .roundRect(-w / 2, -h / 2, w, h, 6)
      .fill({ color: 0xff4f00 })
    this.nameText.x = 0
    this.nameText.y = 0
  }

  private buildShadow(): Graphics {
    const shadow = new Graphics()
    shadow.ellipse(0, 2, 18, 6).fill({ color: 0x000000, alpha: 0.25 })
    return shadow
  }

  setTarget(x: number, y: number) {
    this.targetX = x
    this.targetY = y
  }

  update(
    dt: number,
    noise: NoiseMotion,
    waypoints: WaypointSystem,
    nearbySprites: RobotSprite[]
  ) {
    const now = performance.now()

    if (now < this.pauseUntil) {
      // Idle wobble
      this.wobbleAngle += this.wobbleSpeed * dt
      this.avatarSprite.rotation = Math.sin(this.wobbleAngle) * WOBBLE_AMOUNT
      return
    }

    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < ARRIVAL_THRESHOLD) {
      // Arrived — pick new waypoint and pause
      const next = waypoints.randomWaypoint()
      this.targetX = next.x
      this.targetY = next.y
      this.pauseUntil = now + PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN)
      this.vx = 0
      this.vy = 0
      return
    }

    // Steering toward target
    const steerX = (dx / dist) * this.speed
    const steerY = (dy / dist) * this.speed

    // Perlin noise jitter
    const { nx, ny } = noise.get(this.x, this.y)

    // Separation from nearby robots
    let sepX = 0
    let sepY = 0
    for (const other of nearbySprites) {
      if (other === this) continue
      const ox = this.x - other.x
      const oy = this.y - other.y
      const od = Math.sqrt(ox * ox + oy * oy)
      if (od < SEPARATION_RADIUS && od > 0) {
        sepX += (ox / od) * SEPARATION_STRENGTH
        sepY += (oy / od) * SEPARATION_STRENGTH
      }
    }

    this.vx = (this.vx + steerX + nx + sepX) * 0.85
    this.vy = (this.vy + steerY + ny + sepY) * 0.85

    // Clamp velocity
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (speed > MAX_VELOCITY) {
      this.vx = (this.vx / speed) * MAX_VELOCITY
      this.vy = (this.vy / speed) * MAX_VELOCITY
    }

    this.x += this.vx * dt
    this.y += this.vy * dt

    // Clamp to floor bounds
    const clamped = waypoints.clamp(this.x, this.y)
    this.x = clamped.x
    this.y = clamped.y

    // Flip sprite to face direction
    if (Math.abs(this.vx) > 0.1) {
      this.avatarSprite.scale.x = this.vx > 0 ? 1 : -1
    }

    // Walking wobble
    this.wobbleAngle += this.wobbleSpeed * dt
    this.avatarSprite.rotation = Math.sin(this.wobbleAngle) * WOBBLE_AMOUNT * 0.5
  }
}
