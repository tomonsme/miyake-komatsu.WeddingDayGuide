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
  const env = process.env
  const region = String(config.s3Region || env.S3_REGION || env.AWS_REGION || '').trim()
  const bucket = String(config.s3Bucket || env.S3_BUCKET || '').trim()
  const prefix = String(config.s3Prefix || env.S3_PREFIX || 'uploads').trim()
  const publicBaseUrl = String(config.s3PublicBaseUrl || env.S3_PUBLIC_BASE_URL || '').trim()
  const s3AccessKeyId = String(config.s3AccessKeyId || env.S3_ACCESS_KEY_ID || '').trim()
  const s3SecretAccessKey = String(config.s3SecretAccessKey || env.S3_SECRET_ACCESS_KEY || '').trim()
  const s3SessionToken = String(config.s3SessionToken || env.S3_SESSION_TOKEN || '').trim()
  const awsAccessKeyId = String(env.AWS_ACCESS_KEY_ID || '').trim()
  const awsSecretAccessKey = String(env.AWS_SECRET_ACCESS_KEY || '').trim()
  const awsSessionToken = String(env.AWS_SESSION_TOKEN || '').trim()
  const useS3Creds = Boolean(s3AccessKeyId || s3SecretAccessKey || s3SessionToken)
  const accessKeyId = useS3Creds ? s3AccessKeyId : awsAccessKeyId
  const secretAccessKey = useS3Creds ? s3SecretAccessKey : awsSecretAccessKey
  let sessionToken = useS3Creds ? s3SessionToken : awsSessionToken

  if (!region || !bucket) {
    throw createError({ statusCode: 500, statusMessage: 'S3 configuration missing' })
  }

  const needsSessionToken = accessKeyId.startsWith('ASIA')
  if (!needsSessionToken) {
    sessionToken = ''
  } else if (!sessionToken) {
    throw createError({ statusCode: 500, statusMessage: 'S3 session token missing' })
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
    cachedClient = new S3Client({
      region,
      credentials,
      requestChecksumCalculation: 'WHEN_REQUIRED'
    })
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
