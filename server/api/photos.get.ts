import { createError, getQuery } from 'h3'
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { extname } from 'node:path'
import { getS3Client, getS3Config, normalizePrefix, toPublicUrl } from '../utils/s3'

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp'])

const isImageKey = (key: string) => IMAGE_EXTS.has(extname(key).toLowerCase())

export default defineEventHandler(async (event) => {
  const config = getS3Config()
  const { region, bucket, prefix, publicBaseUrl } = config
  const s3 = getS3Client(config)
  const rawLimit = Number(getQuery(event).limit ?? 40)
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 40
  const normalizedPrefix = normalizePrefix(prefix)
  const listPrefix = normalizedPrefix ? `${normalizedPrefix}/` : undefined

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
    throw createError({ statusCode: 500, statusMessage: 'Failed to list photos' })
  }

  const candidates = objects
    .filter((item) => item.Key && isImageKey(item.Key))
    .map((item) => ({
      key: item.Key as string,
      lastModified: item.LastModified?.toISOString() || ''
    }))
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    .slice(0, limit)

  const items = publicBaseUrl
    ? candidates.map((item) => ({ ...item, url: toPublicUrl(publicBaseUrl, item.key) }))
    : await Promise.all(candidates.map(async (item) => ({
      ...item,
      url: await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: bucket, Key: item.key }),
        { expiresIn: 60 * 60 }
      )
    })))

  return { items }
})
