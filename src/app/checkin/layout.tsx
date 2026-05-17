import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Check In · Gen AI Summit Asia 2026',
  description: 'Scan to check in to Gen AI Summit Asia 2026',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
}

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
