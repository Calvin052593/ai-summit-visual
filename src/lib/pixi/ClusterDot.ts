import { Container, Graphics } from 'pixi.js'
import type { WaypointSystem } from './WaypointSystem'

export class ClusterDot extends Container {
  readonly attendeeId: string

  constructor(attendeeId: string, color: string, waypoints: WaypointSystem) {
    super()
    this.attendeeId = attendeeId

    const pos = waypoints.randomWaypoint()
    this.x = pos.x + (Math.random() - 0.5) * 30
    this.y = pos.y + (Math.random() - 0.5) * 30

    const dot = new Graphics()
    const c = parseInt(color.replace('#', ''), 16)
    dot.circle(0, 0, 4).fill({ color: c, alpha: 0.6 })
    this.addChild(dot)
  }
}
