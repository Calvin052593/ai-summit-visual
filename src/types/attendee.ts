export interface Attendee {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string
  country_code: string
  checked_in_at: string
  avatar_seed: string
  avatar_color: string | null
  is_dummy: boolean
  display_consent: boolean
  is_active: boolean
  created_at: string
  event_id: string | null
}

export interface CheckInPayload {
  first_name: string
  last_name?: string
  email: string
  phone: string
  country_code: string
  display_consent: boolean
}

export interface CheckInResponse {
  type: 'new' | 'welcome_back'
  attendee: Attendee
  total_count: number
}
