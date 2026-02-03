import { createError, readMultipartFormData } from 'h3'
import { extname } from 'node:path'
import { randomBytes } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client, getS3Config, normalizePrefix } from '../utils/s3'

type UploadPart = {
  name?: string
  filename?: string
  type?: string
  data?: Buffer | string
}

const MAX_FILES = 10
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp'
])
const ALLOWED_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
  '.heif',
  '.webp'
])

const toErrorPayload = (err: unknown) => {
  if (err instanceof Error) return { name: err.name, message: err.message }
  return { message: String(err) }
}

const ensureExtension = (filename: string, mimeType: string) => {
  const ext = extname(filename || '').toLowerCase()
  if (ext) return ext
  if (mimeType === 'image/jpeg') return '.jpg'
  if (mimeType === 'image/png') return '.png'
  if (mimeType === 'image/webp') return '.webp'
  if (mimeType === 'image/heic') return '.heic'
  if (mimeType === 'image/heif') return '.heif'
  return ''
}

const sanitizeBaseName = (filename: string) => {
  const base = filename.replace(/\.[^/.]+$/, '')
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned.slice(0, 40)
}

const sanitizeSenderSegment = (name: string) => {
  const cleaned = name
    .trim()
    .replace(/[\/\\]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned.slice(0, 40)
}

const buildFileName = (filename: string, ext: string, index: number) => {
  const base = sanitizeBaseName(filename)
  const unique = `${Date.now()}-${randomBytes(12).toString('hex')}-${index + 1}`
  return base ? `${base}-${unique}${ext}` : `${unique}${ext}`
}

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    if (!form) {
      throw createError({ statusCode: 400, statusMessage: 'Missing form data' })
    }

    const files = form.filter((part) => part.filename && part.data && Buffer.isBuffer(part.data)) as UploadPart[]
    const senderField = form.find((part) => part.name === 'name' && !part.filename)
    const senderName = typeof senderField?.data === 'string' ? senderField.data.trim().slice(0, 50) : ''
    const senderMetadata = senderName ? encodeURIComponent(senderName) : ''
    if (!files.length) {
      throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
    }

    if (files.length > MAX_FILES) {
      throw createError({ statusCode: 400, statusMessage: `Too many files (max ${MAX_FILES})` })
    }

    const config = getS3Config()
    const { region, bucket, prefix } = config
    const s3 = getS3Client(config)
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const normalizedPrefix = normalizePrefix(prefix)
    const senderSegment = senderName ? sanitizeSenderSegment(senderName) : ''
    const baseFolder = normalizedPrefix ? `${normalizedPrefix}/${today}` : today
    const folderKey = senderSegment ? `${baseFolder}/${senderSegment}` : baseFolder

    for (const [index, file] of files.entries()) {
      const mimeType = file.type || ''
      const rawExt = extname(file.filename || '').toLowerCase()
      const isAllowed = ALLOWED_TYPES.has(mimeType) || ALLOWED_EXTS.has(rawExt)
      if (!isAllowed) {
        throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
      }
      const data = file.data as Buffer
      const ext = ensureExtension(file.filename || '', mimeType)
      const fileName = buildFileName(file.filename || '', ext, index)
      const objectKey = `${folderKey}/${fileName}`
      try {
        await s3.send(new PutObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Body: data,
          ContentType: mimeType || undefined,
          CacheControl: 'public, max-age=31536000',
          Metadata: senderMetadata ? { sender: senderMetadata } : undefined
        }))
      } catch (err) {
        console.error('photos.post put failed', {
          ...toErrorPayload(err),
          bucket,
          region,
          key: objectKey
        })
        throw createError({ statusCode: 500, statusMessage: 'Failed to upload photo' })
      }
    }

    return { ok: true, count: files.length }
  } catch (err) {
    const statusCode = (err as { statusCode?: number }).statusCode
    const statusMessage = (err as { statusMessage?: string }).statusMessage
    console.error('photos.post failed', {
      ...toErrorPayload(err),
      statusCode,
      statusMessage
    })
    throw err
  }
})
