'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeCanvasProps {
  value: string
  size?: number
  darkColor?: string
  lightColor?: string
  className?: string
}

export function QRCodeCanvas({
  value,
  size = 200,
  darkColor = '#0a0a0a',
  lightColor = '#ffffff',
  className,
}: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      color: { dark: darkColor, light: lightColor },
    })
  }, [value, size, darkColor, lightColor])

  return <canvas ref={canvasRef} width={size} height={size} className={className} />
}
