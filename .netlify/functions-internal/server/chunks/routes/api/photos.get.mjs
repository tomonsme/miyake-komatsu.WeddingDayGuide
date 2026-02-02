import { d as defineEventHandler, b as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'node:path';
import { g as getS3Config, a as getS3Client, n as normalizePrefix, t as toPublicUrl } from '../../_/s3.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'unhead';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:crypto';
import 'vue';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';

const IMAGE_EXTS = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"]);
const isImageKey = (key) => IMAGE_EXTS.has(extname(key).toLowerCase());
const photos_get = defineEventHandler(async (event) => {
  var _a;
  const { region, bucket, prefix, publicBaseUrl } = getS3Config();
  const s3 = getS3Client(region);
  const rawLimit = Number((_a = getQuery(event).limit) != null ? _a : 40);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 40;
  const normalizedPrefix = normalizePrefix(prefix);
  const listPrefix = normalizedPrefix ? `${normalizedPrefix}/` : void 0;
  const objects = [];
  let token;
  try {
    do {
      const response = await s3.send(new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: listPrefix,
        ContinuationToken: token
      }));
      if (response.Contents) objects.push(...response.Contents);
      token = response.IsTruncated ? response.NextContinuationToken : void 0;
    } while (token);
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: "Failed to list photos" });
  }
  const candidates = objects.filter((item) => item.Key && isImageKey(item.Key)).map((item) => {
    var _a2;
    return {
      key: item.Key,
      lastModified: ((_a2 = item.LastModified) == null ? void 0 : _a2.toISOString()) || ""
    };
  }).sort((a, b) => b.lastModified.localeCompare(a.lastModified)).slice(0, limit);
  const items = publicBaseUrl ? candidates.map((item) => ({ ...item, url: toPublicUrl(publicBaseUrl, item.key) })) : await Promise.all(candidates.map(async (item) => ({
    ...item,
    url: await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: item.key }),
      { expiresIn: 60 * 60 }
    )
  })));
  return { items };
});

export { photos_get as default };
//# sourceMappingURL=photos.get.mjs.map
