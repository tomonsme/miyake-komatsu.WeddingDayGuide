import { createError, readBody } from 'h3'
import { extname } from 'node:path'
import { randomBytes } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3Client, getS3Config, normalizePrefix } from '../../utils/s3'

type PresignFile = {
  name?: string
  type?: string
  size?: number
}

type PresignResponse = {
  uploads: Array<{
    key: string
    url: string
    headers: Record<string, string>
  }>
}

const MAX_FILES = 20
const MAX_FILE_MB = 20
const MAX_FILE_SIZE = MAX_FILE_MB * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'video/mp4',
  'video/quicktime'
])
const ALLOWED_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
  '.heif',
  '.webp',
  '.mp4',
  '.mov'
])

const ensureExtension = (filename: string, mimeType: string) => {
  const ext = extname(filename || '').toLowerCase()
  if (ext) return ext
  if (mimeType === 'image/jpeg') return '.jpg'
  if (mimeType === 'image/png') return '.png'
  if (mimeType === 'image/webp') return '.webp'
  if (mimeType === 'image/heic') return '.heic'
  if (mimeType === 'image/heif') return '.heif'
  if (mimeType === 'video/mp4') return '.mp4'
  if (mimeType === 'video/quicktime') return '.mov'
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

const buildFileName = (filename: string, ext: string, index: number) => {
  const base = sanitizeBaseName(filename)
  const unique = `${Date.now()}-${randomBytes(12).toString('hex')}-${index + 1}`
  return base ? `${base}-${unique}${ext}` : `${unique}${ext}`
}

export default defineEventHandler(async (event): Promise<PresignResponse> => {
  const body = await readBody(event)
  const files = Array.isArray(body?.files) ? body.files as PresignFile[] : []
  if (!files.length) {
    throw createError({ statusCode: 400, statusMessage: 'No files provided' })
  }

  if (files.length > MAX_FILES) {
    throw createError({ statusCode: 400, statusMessage: `Too many files (max ${MAX_FILES})` })
  }

  const config = getS3Config()
  const { bucket, prefix } = config
  const s3 = getS3Client(config)
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const normalizedPrefix = normalizePrefix(prefix)
  const folderKey = normalizedPrefix ? `${normalizedPrefix}/${today}` : today

  const uploads: PresignResponse['uploads'] = []

  for (const [index, file] of files.entries()) {
    const mimeType = String(file.type || '').toLowerCase()
    const filename = String(file.name || '').trim()
    const size = Number(file.size ?? 0)

    if (!Number.isFinite(size) || size <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid file size' })
    }

    if (size > MAX_FILE_SIZE) {
      throw createError({ statusCode: 400, statusMessage: `File too large (max ${MAX_FILE_MB}MB)` })
    }

    const rawExt = extname(filename).toLowerCase()
    const isAllowed = ALLOWED_TYPES.has(mimeType) || ALLOWED_EXTS.has(rawExt)
    if (!isAllowed) {
      throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
    }

    const ext = ensureExtension(filename, mimeType)
    const fileName = buildFileName(filename, ext, index)
    const objectKey = `${folderKey}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: mimeType || undefined
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })

    const headers: Record<string, string> = {}
    if (mimeType) headers['Content-Type'] = mimeType
    uploads.push({ key: objectKey, url, headers })
  }

  return { uploads }
})
