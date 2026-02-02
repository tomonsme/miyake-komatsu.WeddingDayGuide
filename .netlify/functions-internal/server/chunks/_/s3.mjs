import { u as useRuntimeConfig, c as createError } from '../nitro/nitro.mjs';
import { S3Client } from '@aws-sdk/client-s3';

let cachedClient = null;
let cachedRegion = "";
const getS3Config = () => {
  const config = useRuntimeConfig();
  const region = String(config.s3Region || "").trim();
  const bucket = String(config.s3Bucket || "").trim();
  const prefix = String(config.s3Prefix || "uploads").trim();
  const publicBaseUrl = String(config.s3PublicBaseUrl || "").trim();
  if (!region || !bucket) {
    throw createError({ statusCode: 500, statusMessage: "S3 configuration missing" });
  }
  return { region, bucket, prefix, publicBaseUrl };
};
const getS3Client = (region) => {
  if (!cachedClient || cachedRegion !== region) {
    cachedClient = new S3Client({ region });
    cachedRegion = region;
  }
  return cachedClient;
};
const normalizePrefix = (prefix) => prefix.replace(/^\/+|\/+$/g, "");
const toPublicUrl = (baseUrl, key) => {
  const trimmed = baseUrl.replace(/\/+$/, "");
  const encoded = key.split("/").map((part) => encodeURIComponent(part)).join("/");
  return `${trimmed}/${encoded}`;
};

export { getS3Client as a, getS3Config as g, normalizePrefix as n, toPublicUrl as t };
//# sourceMappingURL=s3.mjs.map
