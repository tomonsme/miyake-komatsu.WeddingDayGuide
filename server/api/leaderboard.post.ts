import { createError, readBody, setHeader } from 'h3'
import { addEntry, type GameId } from '../utils/leaderboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const body = await readBody(event)
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Missing body' })
  }

  const game = body.game as GameId
  if (game !== 'tap10' && game !== 'stop11') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid game' })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Missing nickname' })
  }

  const score = Number(body.score)
  if (!Number.isFinite(score)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid score' })
  }

  const meta = body.meta && typeof body.meta === 'object' ? body.meta : undefined

  return await addEntry({
    game,
    name,
    score,
    meta
  })
})
