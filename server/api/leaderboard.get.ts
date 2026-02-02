import { setHeader } from 'h3'
import { getLeaderboardSnapshotFresh } from '../utils/leaderboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  return await getLeaderboardSnapshotFresh()
})
