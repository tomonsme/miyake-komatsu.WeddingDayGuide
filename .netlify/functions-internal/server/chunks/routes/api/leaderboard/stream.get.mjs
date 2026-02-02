import { d as defineEventHandler, s as setHeader } from '../../../nitro/nitro.mjs';
import { g as getLeaderboardSnapshot, s as subscribe } from '../../../_/leaderboard.mjs';
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

const stream_get = defineEventHandler((event) => {
  var _a;
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");
  const res = event.node.res;
  const req = event.node.req;
  (_a = res.flushHeaders) == null ? void 0 : _a.call(res);
  let closed = false;
  const send = (payload) => {
    if (closed) return;
    res.write(`data: ${JSON.stringify(payload)}

`);
  };
  send(getLeaderboardSnapshot());
  const unsubscribe = subscribe((snapshot) => {
    send(snapshot);
  });
  const keepAlive = setInterval(() => {
    if (closed) return;
    res.write(":keep-alive\n\n");
  }, 25e3);
  req.on("close", () => {
    closed = true;
    clearInterval(keepAlive);
    unsubscribe();
    res.end();
  });
});

export { stream_get as default };
//# sourceMappingURL=stream.get.mjs.map
