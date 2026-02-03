import { computed } from 'vue'

export type SeatingSeat = { name: string; role?: string; suffix?: string } | string
export type SeatingTable = { name: string; group?: string; seats: SeatingSeat[]; leftCount?: number; pairWithNext?: boolean }
export type SeatingPlan = { headTable?: SeatingTable; tables: SeatingTable[] }
export type NoteItem = { title: string; body: string }
export type StoryboardItem = { id: string; label: string; title: string; subtitle?: string; image?: string; to?: string }
export type ProfileRow = { label: string; left: string | string[]; right: string | string[] }
export type ProfileInfo = {
  groom: { name: string; image?: string }
  bride: { name: string; image?: string }
  rows: ProfileRow[]
}
export type MessageInfo = { lines: string[]; date?: string; signature?: string }
export type PhotoShareInfo = {
  title: string
  subtitle?: string
  body?: string
  linkUrl?: string
  linkLabel?: string
}

export type EventConfig = {
  couple?: string
  eventDateIso?: string
  venueName?: string
  venueRoom?: string
  monogramUrl?: string
  seatingPdfUrl?: string
  seating?: SeatingPlan
  notes?: NoteItem[]
  photoShare?: PhotoShareInfo
  profile?: ProfileInfo
  message?: MessageInfo
  storyboard?: StoryboardItem[]
}

const DEFAULT_EVENT: EventConfig = {
  couple: '',
  eventDateIso: '',
  venueName: '',
  venueRoom: '',
  seating: { tables: [] },
  notes: [],
  photoShare: {
    title: '写真共有'
  },
  profile: {
    groom: { name: '' },
    bride: { name: '' },
    rows: []
  },
  message: {
    lines: []
  },
  storyboard: []
}

function parseLocalDate(iso?: string) {
  if (!iso) return null
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(iso)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  return new Date(y, mo, d)
}

export function useEventData() {
  const headers = process.server ? useRequestHeaders(['cookie']) : undefined
  const { data: eventData } = useAsyncData<EventConfig | null>('event-config', async () => {
    try {
      return await $fetch<EventConfig>('/api/event', { headers })
    } catch (err: any) {
      if (process.client && err?.statusCode === 401) {
        const inviteCookie = useCookie<string | null>('invite_key')
        inviteCookie.value = null
        const route = useRoute()
        if (route.path !== '/access') {
          navigateTo(`/access?to=${encodeURIComponent(route.fullPath)}`)
        }
      }
      return null
    }
  })

  const event = computed(() => eventData.value || DEFAULT_EVENT)

  const displayCouple = computed(() => event.value.couple || 'Wedding Day')
  const venue = computed(() => event.value.venueName || '')
  const venueRoom = computed(() => event.value.venueRoom || '')
  const seatingPdfUrl = computed(() => event.value.seatingPdfUrl || '')

  const seating = computed(() => event.value.seating || DEFAULT_EVENT.seating)
  const notes = computed(() => (event.value.notes && event.value.notes.length) ? event.value.notes : DEFAULT_EVENT.notes)
  const photoShare = computed(() => event.value.photoShare || DEFAULT_EVENT.photoShare)
  const profile = computed(() => event.value.profile || DEFAULT_EVENT.profile)
  const message = computed(() => event.value.message || DEFAULT_EVENT.message)
  const storyboardItems = computed(() => (event.value.storyboard && event.value.storyboard.length) ? event.value.storyboard : DEFAULT_EVENT.storyboard)

  const displayDateParts = computed(() => {
    const d = parseLocalDate(event.value.eventDateIso)
    if (!d || Number.isNaN(d.getTime())) return { date: '', dow: '' }
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dowJ = new Intl.DateTimeFormat('ja-JP', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(d)
    return { date: `${y}.${m}.${day}`, dow: `(${dowJ})` }
  })

  return {
    event,
    displayCouple,
    venue,
    venueRoom,
    seatingPdfUrl,
    seating,
    notes,
    photoShare,
    profile,
    message,
    storyboardItems,
    displayDateParts
  }
}
