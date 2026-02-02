import { createError } from 'h3'
import { S3Client } from '@aws-sdk/client-s3'

type S3Config = {
  region: string
  bucket: string
  prefix: string
  publicBaseUrl: string
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
}

let cachedClient: S3Client | null = null
let cachedKey = ''

export const getS3Config = (): S3Config => {
  const config = useRuntimeConfig()
  const region = String(config.s3Region || '').trim()
  const bucket = String(config.s3Bucket || '').trim()
  const prefix = String(config.s3Prefix || 'uploads').trim()
  const publicBaseUrl = String(config.s3PublicBaseUrl || '').trim()
  const accessKeyId = String(config.s3AccessKeyId || '').trim()
  const secretAccessKey = String(config.s3SecretAccessKey || '').trim()
  const sessionToken = String(config.s3SessionToken || '').trim()

  if (!region || !bucket) {
    throw createError({ statusCode: 500, statusMessage: 'S3 configuration missing' })
  }

  if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
    throw createError({ statusCode: 500, statusMessage: 'S3 credentials incomplete' })
  }

  return { region, bucket, prefix, publicBaseUrl, accessKeyId, secretAccessKey, sessionToken }
}

export const getS3Client = (config: Pick<S3Config, 'region' | 'accessKeyId' | 'secretAccessKey' | 'sessionToken'>) => {
  const { region, accessKeyId, secretAccessKey, sessionToken } = config
  const cacheKey = [region, accessKeyId, sessionToken ? 'with-token' : ''].join(':')
  if (!cachedClient || cachedKey !== cacheKey) {
    const credentials = accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey, sessionToken: sessionToken || undefined }
      : undefined
    cachedClient = new S3Client({ region, credentials })
    cachedKey = cacheKey
  }
  return cachedClient
}

export const normalizePrefix = (prefix: string) => prefix.replace(/^\/+|\/+$/g, '')

export const toPublicUrl = (baseUrl: string, key: string) => {
  const trimmed = baseUrl.replace(/\/+$/, '')
  const encoded = key.split('/').map((part) => encodeURIComponent(part)).join('/')
  return `${trimmed}/${encoded}`
}
