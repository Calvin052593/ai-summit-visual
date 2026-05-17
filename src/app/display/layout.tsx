'use client'

import { useEffect, useRef } from 'react'

export default function DisplayLayout({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const setScale = () => {
      if (!rootRef.current) return
      const scaleX = window.innerWidth / 1920
      const scaleY = window.innerHeight / 1080
      const scale = Math.min(scaleX, scaleY)
      rootRef.current.style.setProperty('--display-scale', String(scale))
      rootRef.current.style.transform = `scale(${scale})`
    }
    setScale()
    window.addEventListener('resize', setScale)
    return () => window.removeEventListener('resize', setScale)
  }, [])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-start justify-start">
      <div
        ref={rootRef}
        style={{
          width: '1920px',
          height: '1080px',
          transformOrigin: 'top left',
          overflow: 'hidden',
        }}
        className="display-no-cursor display-no-scroll"
      >
        {children}
      </div>
    </div>
  )
}
