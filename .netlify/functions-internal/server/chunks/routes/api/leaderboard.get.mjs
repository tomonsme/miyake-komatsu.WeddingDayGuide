import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { g as getLeaderboardSnapshot } from '../../_/leaderboard.mjs';
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

const leaderboard_get = defineEventHandler(() => getLeaderboardSnapshot());

export { leaderboard_get as default };
//# sourceMappingURL=leaderboard.get.mjs.map
