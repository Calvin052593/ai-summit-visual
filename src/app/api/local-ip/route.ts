import { NextResponse } from 'next/server'
import { networkInterfaces } from 'os'

export async function GET() {
  const nets = networkInterfaces()
  const ip =
    Object.values(nets)
      .flat()
      .find((n) => n && n.family === 'IPv4' && !n.internal)?.address ?? 'localhost'

  return NextResponse.json({ ip })
}
