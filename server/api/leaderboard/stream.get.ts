import { setHeader } from 'h3'
import { type LeaderboardSnapshot, getLeaderboardSnapshotFresh, subscribe } from '../../utils/leaderboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store, no-transform')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')

  const res = event.node.res
  const req = event.node.req

  res.flushHeaders?.()

  let closed = false
  const send = (payload: LeaderboardSnapshot) => {
    if (closed) return
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  }

  const initialSnapshot = await getLeaderboardSnapshotFresh()
  send(initialSnapshot)

  const unsubscribe = subscribe((snapshot) => {
    send(snapshot)
  })

  const keepAlive = setInterval(() => {
    if (closed) return
    res.write(':keep-alive\n\n')
  }, 25000)

  req.on('close', () => {
    closed = true
    clearInterval(keepAlive)
    unsubscribe()
    res.end()
  })
})
