'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block bg-brand-orange rounded-xl px-4 py-2 mb-4">
            <span className="font-bold text-white text-sm tracking-wide">Gen AI Summit Asia 2026</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to access the dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 border-zinc-700 text-white placeholder-zinc-600 outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 border-zinc-700 text-white placeholder-zinc-600 outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-orange hover:bg-orange-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
