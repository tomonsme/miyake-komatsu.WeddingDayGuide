import { getLeaderboardSnapshot, subscribe } from '../../utils/leaderboard'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const res = event.node.res
  const req = event.node.req

  res.flushHeaders?.()

  let closed = false
  const send = (payload: ReturnType<typeof getLeaderboardSnapshot>) => {
    if (closed) return
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  }

  send(getLeaderboardSnapshot())

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
