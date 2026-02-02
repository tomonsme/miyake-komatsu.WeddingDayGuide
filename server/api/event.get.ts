import { createError, getCookie, getHeader } from 'h3'
import { eventConfig } from '../data/event'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const requiredKey = String(config.inviteAccessKey || '').trim()
  if (requiredKey) {
    const cookieKey = String(getCookie(event, 'invite_key') || '').trim()
    const headerKey = String(getHeader(event, 'x-invite-key') || '').trim()
    const provided = cookieKey || headerKey
    if (!provided || provided !== requiredKey) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  return eventConfig
})
