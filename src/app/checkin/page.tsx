'use client'

import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { enqueue } from '@/lib/offline-queue'
import { useOfflineQueue } from '@/hooks/useOfflineQueue'
import { cn } from '@/lib/utils'
import type { Attendee, CheckInResponse } from '@/types/attendee'

const COUNTRY_CODES = ['+60', '+65', '+62', '+66', '+84', '+63', '+95', '+855', '+856', '+673',
  '+91', '+86', '+81', '+82', '+886', '+852', '+853', '+61', '+64', '+1', '+44']

const RESET_DELAY = 5000

function MobileCheckInForm() {
  useOfflineQueue()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event') ?? undefined

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+60')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<{ attendee: Attendee; count: number; type: 'new' | 'welcome_back' } | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = 'First name required'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required'
    if (!phone.trim()) e.phone = 'Phone number required'
    if (!gender) e.gender = 'Please select your gender'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const reset = useCallback(() => {
    setFirstName(''); setLastName(''); setEmail(''); setPhone('')
    setCountryCode('+60'); setGender(''); setConsent(false); setErrors({}); setSuccess(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      country_code: countryCode,
      gender: gender || undefined,
      display_consent: consent,
      event_id: eventId,
    }

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data: CheckInResponse = await res.json()
      setSuccess({ attendee: data.attendee, count: data.total_count, type: data.type })
    } catch {
      enqueue(payload)
      const temp: Attendee = {
        id: crypto.randomUUID(),
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        email: email.trim(),
        phone: phone.trim(),
        country_code: countryCode,
        checked_in_at: new Date().toISOString(),
        avatar_seed: `bot-offline-${Math.random().toString(36).slice(2)}`,
        avatar_color: '#FF4F00',
        gender: (gender as 'male' | 'female') || null,
        is_dummy: false,
        display_consent: consent,
        is_active: true,
        created_at: new Date().toISOString(),
        event_id: eventId ?? null,
      }
      setSuccess({ attendee: temp, count: 0, type: 'new' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (success) {
      timerRef.current = setTimeout(reset, RESET_DELAY)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [success, reset])

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF4F00] via-[#FFB800] to-[#00E5FF]" />

      <div className="flex-1 w-full flex flex-col items-center justify-center px-5 py-8">
        {/* Header */}
        <div className="w-full max-w-sm mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF4F00] rounded-xl px-4 py-2 mb-4">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-white text-sm tracking-wide">AI Summit</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1">Check In</h1>
          <p className="text-zinc-500 text-sm">{"You're Gen AI"}</p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm text-center space-y-4"
            >
              <div className="text-6xl mb-2">
                {success.type === 'welcome_back' ? '👋' : '🎉'}
              </div>
              <h2 className="text-white text-2xl font-bold">
                {success.type === 'welcome_back'
                  ? `Welcome back, ${success.attendee.first_name}!`
                  : `You're in, ${success.attendee.first_name}!`}
              </h2>
              {success.type === 'new' && success.count > 0 && (
                <p className="text-[#FF4F00] font-mono text-lg font-bold">
                  Gen AI #{success.count.toLocaleString()}
                </p>
              )}
              <p className="text-zinc-400 text-sm">
                {success.type === 'welcome_back'
                  ? 'Your check-in has been updated.'
                  : 'You are now checked in. Welcome to AI Summit!'}
              </p>
              <div className="bg-zinc-900 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Name</span>
                  <span className="text-white">{success.attendee.first_name} {success.attendee.last_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Email</span>
                  <span className="text-zinc-300 text-xs">{success.attendee.email}</span>
                </div>
              </div>
              <p className="text-zinc-600 text-xs">This screen will reset in a few seconds…</p>
              <button
                onClick={reset}
                className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="w-full max-w-sm space-y-3"
            >
              {/* First + Last */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 text-white placeholder-zinc-600 outline-none focus:border-[#FF4F00] transition-colors text-base',
                      errors.firstName ? 'border-red-500' : 'border-zinc-800'
                    )}
                  />
                  {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>}
                </div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-white placeholder-zinc-600 outline-none focus:border-[#FF4F00] transition-colors text-base"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 text-white placeholder-zinc-600 outline-none focus:border-[#FF4F00] transition-colors text-base',
                    errors.email ? 'border-red-500' : 'border-zinc-800'
                  )}
                />
                {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <div className={cn(
                  'flex rounded-xl bg-zinc-900 border-2 overflow-hidden focus-within:border-[#FF4F00] transition-colors',
                  errors.phone ? 'border-red-500' : 'border-zinc-800'
                )}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-zinc-800 text-white px-3 py-3 text-sm outline-none border-r border-zinc-700 appearance-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder-zinc-600 outline-none text-base"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>}
              </div>

              {/* Gender */}
              <div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | '')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-zinc-900 border-2 text-white outline-none focus:border-[#FF4F00] transition-colors text-base appearance-none',
                    errors.gender ? 'border-red-500' : gender ? 'border-zinc-800' : 'border-zinc-800',
                    !gender && 'text-zinc-600'
                  )}
                >
                  <option value="" disabled>Select Gender *</option>
                  <option value="male">♂  Male</option>
                  <option value="female">♀  Female</option>
                </select>
                {errors.gender && <p className="mt-1 text-red-400 text-xs">{errors.gender}</p>}
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-zinc-900 border-2 border-zinc-800">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-5 h-5 accent-[#FF4F00] shrink-0"
                />
                <span className="text-zinc-400 text-sm leading-snug">
                  Show my name on the event hall live screen
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-4 rounded-xl text-lg font-bold text-white transition-all',
                  loading
                    ? 'bg-zinc-700 cursor-not-allowed'
                    : 'bg-[#FF4F00] hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-900/30'
                )}
              >
                {loading ? 'Checking in…' : '🤖 Check In'}
              </button>

              <p className="text-center text-zinc-700 text-xs mt-2">
                8–9 Aug 2026 · MITEC Kuala Lumpur
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-zinc-500">Loading…</div>}>
      <MobileCheckInForm />
    </Suspense>
  )
}
