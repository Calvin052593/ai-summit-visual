'use client'

import { useState, useCallback, useEffect } from 'react'
import { PhoneField } from './PhoneField'
import { NumPad } from './NumPad'
import { WelcomeOverlay } from './WelcomeOverlay'
import { WelcomeBackOverlay } from './WelcomeBackOverlay'
import { QRCodeCanvas } from '@/components/QRCodeCanvas'
import { enqueue } from '@/lib/offline-queue'
import { useOfflineQueue } from '@/hooks/useOfflineQueue'
import { cn } from '@/lib/utils'
import { malePool, femalePool } from '@/lib/character-pool'
import type { Attendee, CheckInResponse } from '@/types/attendee'

const RESET_DELAY = 4500

type Step = 'form' | 'avatar'

export function CheckInForm() {
  useOfflineQueue()

  const [mobileUrl, setMobileUrl] = useState('')

  useEffect(() => {
    fetch('/api/local-ip')
      .then((r) => r.json())
      .then(({ ip }) => setMobileUrl(`http://${ip}:3000/checkin`))
      .catch(() => setMobileUrl(`${window.location.origin}/checkin`))
  }, [])

  const [step, setStep] = useState<Step>('form')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+60')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [consent, setConsent] = useState(false)
  const [showNumPad, setShowNumPad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newAttendee, setNewAttendee] = useState<Attendee | null>(null)
  const [welcomeBack, setWelcomeBack] = useState<Attendee | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = 'First name is required'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email is required'
    if (!phone.trim()) e.phone = 'Phone number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setStep('avatar')
  }

  const handleSubmit = async (selectedGender: 'male' | 'female') => {
    setGender(selectedGender)
    setLoading(true)

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      country_code: countryCode,
      gender: selectedGender,
      display_consent: consent,
    }

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data: CheckInResponse = await res.json()
      setTotalCount(data.total_count)

      if (data.type === 'welcome_back') {
        setWelcomeBack(data.attendee)
      } else {
        setNewAttendee(data.attendee)
      }
    } catch {
      // Offline — queue for later, show success anyway with temp data
      enqueue(payload)
      const tempAttendee: Attendee = {
        id: crypto.randomUUID(),
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        email: email.trim(),
        phone: phone.trim(),
        country_code: countryCode,
        checked_in_at: new Date().toISOString(),
        avatar_seed: `bot-offline-${Math.random().toString(36).slice(2)}`,
        avatar_color: '#FF4F00',
        gender: selectedGender,
        character_id: 0,
        is_dummy: false,
        display_consent: consent,
        is_active: true,
        created_at: new Date().toISOString(),
        event_id: null,
      }
      setNewAttendee(tempAttendee)
    } finally {
      setLoading(false)
    }
  }

  const reset = useCallback(() => {
    setStep('form')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setCountryCode('+60')
    setGender('')
    setConsent(false)
    setErrors({})
    setShowNumPad(false)
    setNewAttendee(null)
    setWelcomeBack(null)
  }, [])

  const handleOverlayDone = () => {
    setTimeout(reset, 100)
  }

  const startAutoReset = useCallback(() => {
    setTimeout(reset, RESET_DELAY)
  }, [reset])

  if (newAttendee) {
    startAutoReset()
    return <WelcomeOverlay attendee={newAttendee} count={totalCount} onDone={handleOverlayDone} />
  }
  if (welcomeBack) {
    startAutoReset()
    return <WelcomeBackOverlay attendee={welcomeBack} onDone={handleOverlayDone} />
  }

  // Step 2: Avatar gender card selection
  if (step === 'avatar') {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="inline-block bg-brand-orange rounded-xl px-5 py-2 mb-4">
              <span className="font-heading font-bold text-white text-lg tracking-wide">AI Summit</span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-white">Choose Your Avatar</h1>
            <p className="text-zinc-400 mt-2">Select your character for the event hall display</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {(['male', 'female'] as const).map((g) => {
              const pool = g === 'male' ? malePool : femalePool
              const previewSrc = pool[0]
              return (
                <button
                  key={g}
                  onClick={() => handleSubmit(g)}
                  disabled={loading}
                  className={cn(
                    'relative flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer',
                    'bg-zinc-900 hover:bg-zinc-800',
                    'border-zinc-700 hover:border-brand-orange',
                    'hover:shadow-[0_0_32px_rgba(255,79,0,0.4)]',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt={g}
                    className="w-36 h-36 object-contain"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(255,79,0,0.3))' }}
                  />
                  <span className="font-heading text-xl font-bold text-white capitalize">
                    {g === 'male' ? '♂  Male' : '♀  Female'}
                  </span>
                </button>
              )
            })}
          </div>

          {loading && (
            <div className="text-center text-brand-orange font-mono animate-pulse">
              Checking in…
            </div>
          )}

          <button
            onClick={() => setStep('form')}
            disabled={loading}
            className="w-full py-3 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            ← Back to form
          </button>

          <p className="text-center text-zinc-600 text-sm mt-4">
            8–9 Aug 2026 · MITEC Kuala Lumpur
          </p>
        </div>
      </div>
    )
  }

  // Step 1: Form details
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-brand-orange rounded-xl px-5 py-2 mb-4">
            <span className="font-heading font-bold text-white text-lg tracking-wide">
              AI Summit
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white">Check In</h1>
          <p className="text-zinc-400 mt-2">{"You're not Gen X, not Gen Y — You're Gen AI"}</p>
        </div>

        <form onSubmit={handleFormNext} className="space-y-4">
          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={cn(
                  'w-full px-5 py-4 rounded-2xl bg-zinc-800 border-2 text-xl text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition-colors',
                  errors.firstName ? 'border-red-500' : 'border-zinc-700'
                )}
              />
              {errors.firstName && <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>}
            </div>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-zinc-800 border-2 border-zinc-700 text-xl text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full px-5 py-4 rounded-2xl bg-zinc-800 border-2 text-xl text-white placeholder-zinc-500 outline-none focus:border-brand-orange transition-colors',
                errors.email ? 'border-red-500' : 'border-zinc-700'
              )}
            />
            {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <PhoneField
              value={phone}
              countryCode={countryCode}
              onValueChange={setPhone}
              onCountryChange={setCountryCode}
              onFocus={() => setShowNumPad(true)}
            />
            {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
          </div>

          {/* NumPad */}
          {showNumPad && (
            <NumPad
              onDigit={(d) => setPhone((p) => p + d)}
              onBackspace={() => setPhone((p) => p.slice(0, -1))}
              onDone={() => setShowNumPad(false)}
            />
          )}

          {/* Privacy consent */}
          <label className="flex items-start gap-4 cursor-pointer p-4 rounded-2xl bg-zinc-800 border-2 border-zinc-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 accent-brand-orange cursor-pointer"
            />
            <span className="text-zinc-300 text-base leading-relaxed">
              I agree to have my first name displayed on the event hall live screen
            </span>
          </label>

          {/* Next */}
          <button
            type="submit"
            className="w-full py-5 rounded-2xl text-2xl font-bold text-white transition-all active:scale-98 bg-brand-orange hover:bg-orange-600 shadow-lg shadow-orange-900/40"
          >
            Next — Choose Avatar →
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-sm mt-6">
          8–9 Aug 2026 · MITEC Kuala Lumpur
        </p>
      </div>

      {/* Mobile check-in QR — bottom-right corner */}
      {mobileUrl && (
        <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 z-10">
          <div className="bg-white rounded-2xl p-3 shadow-2xl">
            <QRCodeCanvas value={mobileUrl} size={100} darkColor="#0a0a0a" lightColor="#ffffff" />
          </div>
          <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-zinc-800">
            <p className="text-zinc-400 text-xs text-center leading-tight">
              Scan to check in<br />
              <span className="text-brand-orange font-mono text-[10px]">on your phone</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
