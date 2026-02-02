import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { a as addEntry } from '../../_/leaderboard.mjs';
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
import 'node:path';
import 'node:crypto';
import 'vue';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';

const leaderboard_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: "Missing body" });
  }
  const game = body.game;
  if (game !== "tap10" && game !== "stop11") {
    throw createError({ statusCode: 400, statusMessage: "Invalid game" });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Missing nickname" });
  }
  const score = Number(body.score);
  if (!Number.isFinite(score)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid score" });
  }
  const meta = body.meta && typeof body.meta === "object" ? body.meta : void 0;
  return addEntry({
    game,
    name,
    score,
    meta
  });
});

export { leaderboard_post as default };
//# sourceMappingURL=leaderboard.post.mjs.map
