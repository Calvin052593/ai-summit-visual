import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['pixi.js', 'pixi-filters'],
  serverExternalPackages: ['@dicebear/core', '@dicebear/bottts'],
}

export default nextConfig
