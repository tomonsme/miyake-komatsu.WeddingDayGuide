import { createError } from 'h3'
import { S3Client } from '@aws-sdk/client-s3'

type S3Config = {
  region: string
  bucket: string
  prefix: string
  publicBaseUrl: string
}

let cachedClient: S3Client | null = null
let cachedRegion = ''

export const getS3Config = (): S3Config => {
  const config = useRuntimeConfig()
  const region = String(config.s3Region || '').trim()
  const bucket = String(config.s3Bucket || '').trim()
  const prefix = String(config.s3Prefix || 'uploads').trim()
  const publicBaseUrl = String(config.s3PublicBaseUrl || '').trim()

  if (!region || !bucket) {
    throw createError({ statusCode: 500, statusMessage: 'S3 configuration missing' })
  }

  return { region, bucket, prefix, publicBaseUrl }
}

export const getS3Client = (region: string) => {
  if (!cachedClient || cachedRegion !== region) {
    cachedClient = new S3Client({ region })
    cachedRegion = region
  }
  return cachedClient
}

export const normalizePrefix = (prefix: string) => prefix.replace(/^\/+|\/+$/g, '')

export const toPublicUrl = (baseUrl: string, key: string) => {
  const trimmed = baseUrl.replace(/\/+$/, '')
  const encoded = key.split('/').map((part) => encodeURIComponent(part)).join('/')
  return `${trimmed}/${encoded}`
}
