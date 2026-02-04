import { setHeader } from 'h3'
import { clearLeaderboard, getLeaderboardSnapshot } from '../../utils/leaderboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  await clearLeaderboard()
  return getLeaderboardSnapshot()
})
