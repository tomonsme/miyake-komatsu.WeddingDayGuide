import { createError, getQuery, setHeader } from 'h3'
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { extname } from 'node:path'
import { getS3Client, getS3Config, toPublicUrl } from '../utils/s3'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp'])
const CACHE_TTL_MS = 20000

const galleryCache = new Map<string, { expiresAt: number; payload: { items: { key: string; url: string; lastModified: string }[]; total: number } }>()

const isImageKey = (key: string) => IMAGE_EXTS.has(extname(key).toLowerCase())
const shuffleInPlace = <T>(items: T[]) => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}
const toErrorPayload = (err: unknown) => {
  if (err instanceof Error) return { name: err.name, message: err.message }
  return { message: String(err) }
}

export default defineEventHandler(async (event) => {
  try {
    setHeader(event, 'Cache-Control', 'no-store')
    const config = getS3Config()
    const { region, bucket, publicBaseUrl } = config
    const s3 = getS3Client(config)
    const rawLimit = Number(getQuery(event).limit ?? 40)
    const rawOrder = String(getQuery(event).order ?? 'random')
    const order = rawOrder === 'latest' ? 'latest' : 'random'
    const rawFresh = getQuery(event).fresh
    const fresh = rawFresh === '1' || rawFresh === 'true'
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 40
    const listPrefix = undefined

    const cacheKey = `${bucket}:${order}:${limit}`
    const now = Date.now()
    if (!fresh) {
      const cached = galleryCache.get(cacheKey)
      if (cached && cached.expiresAt > now) return cached.payload
    }

    const objects: { Key?: string; LastModified?: Date }[] = []
    let token: string | undefined

    try {
      do {
        const response = await s3.send(new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: listPrefix,
          ContinuationToken: token
        }))
        if (response.Contents) objects.push(...response.Contents)
        token = response.IsTruncated ? response.NextContinuationToken : undefined
      } while (token)
    } catch (err) {
      console.error('photos.get list failed', {
        ...toErrorPayload(err),
        bucket,
        region,
        prefix: listPrefix || ''
      })
      throw createError({ statusCode: 500, statusMessage: 'Failed to list photos' })
    }

    const candidates = objects
      .filter((item) => item.Key && isImageKey(item.Key))
      .map((item) => ({
        key: item.Key as string,
        lastModified: item.LastModified?.toISOString() || ''
      }))
    const ordered = order === 'latest'
      ? candidates.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
      : shuffleInPlace(candidates)
    const selected = ordered.slice(0, limit)

    const items = publicBaseUrl
      ? selected.map((item) => ({ ...item, url: toPublicUrl(publicBaseUrl, item.key) }))
      : await Promise.all(selected.map(async (item) => ({
        ...item,
        url: await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: bucket, Key: item.key }),
          { expiresIn: 60 * 60 }
        )
      })))

    const payload = { items, total: candidates.length }
    galleryCache.set(cacheKey, { expiresAt: now + CACHE_TTL_MS, payload })
    return payload
  } catch (err) {
    console.error('photos.get failed', toErrorPayload(err))
    throw err
  }
})
