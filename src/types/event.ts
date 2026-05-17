export interface Event {
  id: string
  name: string
  capacity: number
  starts_at: string | null
  ends_at: string | null
  is_live: boolean
}
