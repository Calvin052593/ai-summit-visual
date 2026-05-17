// Elegant banquet hall floor area — matches mitec-bg.svg layout
// Ceiling y=0-245, back wall y=245-505, floor y=455-900
// Carpet zone x=130-1150, marble dance floor x=1100-1790

export const FLOOR_BOUNDS = {
  x: 150,
  y: 460,
  width: 1620,
  height: 415,
}

// Waypoints spread across the floor — in gaps between tables and open dance floor
// Tables at approx: (270,700) (530,640) (390,830) (720,760) (880,570) (830,840) (1050,700)
// Dance floor (right, x>1130) is open — robots roam freely there
const BASE_WAYPOINTS: { x: number; y: number }[] = [
  // Back row (y ≈ 490-520) — narrow strip near wall
  { x: 200, y: 495 }, { x: 440, y: 490 }, { x: 660, y: 488 }, { x: 960, y: 490 },
  { x: 1200, y: 492 }, { x: 1440, y: 490 }, { x: 1680, y: 495 }, { x: 1760, y: 495 },

  // Row 2 (y ≈ 560) — between back wall and first table row
  { x: 170, y: 558 }, { x: 380, y: 555 }, { x: 660, y: 552 }, { x: 960, y: 555 },
  { x: 1160, y: 558 }, { x: 1360, y: 555 }, { x: 1580, y: 558 }, { x: 1750, y: 560 },

  // Row 3 (y ≈ 630) — between T2/T5 and dance floor
  { x: 180, y: 632 }, { x: 410, y: 628 }, { x: 650, y: 630 },
  { x: 1000, y: 628 }, { x: 1180, y: 632 }, { x: 1380, y: 630 },
  { x: 1580, y: 632 }, { x: 1760, y: 635 },

  // Row 4 (y ≈ 710) — between T1/T4/T7
  { x: 160, y: 710 }, { x: 420, y: 708 }, { x: 640, y: 710 },
  { x: 860, y: 712 }, { x: 1160, y: 710 }, { x: 1360, y: 712 },
  { x: 1560, y: 710 }, { x: 1750, y: 712 },

  // Row 5 (y ≈ 790) — between T1/T3/T4/T6
  { x: 175, y: 792 }, { x: 620, y: 790 }, { x: 960, y: 792 },
  { x: 1160, y: 792 }, { x: 1380, y: 790 }, { x: 1600, y: 792 }, { x: 1760, y: 795 },

  // Row 6 (y ≈ 860) — front strip
  { x: 180, y: 858 }, { x: 620, y: 860 }, { x: 970, y: 860 },
  { x: 1180, y: 858 }, { x: 1400, y: 860 }, { x: 1620, y: 858 }, { x: 1760, y: 860 },
]

export class WaypointSystem {
  private waypoints = BASE_WAYPOINTS

  randomWaypoint(): { x: number; y: number } {
    return this.waypoints[Math.floor(Math.random() * this.waypoints.length)]
  }

  randomSpawnPoint(): { x: number; y: number } {
    const edge = Math.floor(Math.random() * 3)
    switch (edge) {
      case 0: // top edge
        return { x: FLOOR_BOUNDS.x + Math.random() * FLOOR_BOUNDS.width, y: FLOOR_BOUNDS.y + 20 }
      case 1: // left edge
        return { x: FLOOR_BOUNDS.x + 20, y: FLOOR_BOUNDS.y + Math.random() * FLOOR_BOUNDS.height }
      default: // right edge
        return { x: FLOOR_BOUNDS.x + FLOOR_BOUNDS.width - 20, y: FLOOR_BOUNDS.y + Math.random() * FLOOR_BOUNDS.height }
    }
  }

  clamp(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(FLOOR_BOUNDS.x + 30, Math.min(FLOOR_BOUNDS.x + FLOOR_BOUNDS.width - 30, x)),
      y: Math.max(FLOOR_BOUNDS.y + 20, Math.min(FLOOR_BOUNDS.y + FLOOR_BOUNDS.height - 20, y)),
    }
  }
}
