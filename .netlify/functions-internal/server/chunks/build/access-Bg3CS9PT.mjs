import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useRoute, b as useCookie } from './server.mjs';
import '../nitro/nitro.mjs';
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
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'vue-router';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import 'framesync';
import 'popmotion';
import 'style-value-types';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "access",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const accessKey = ref("");
    const error = ref("");
    const isSubmitting = ref(false);
    computed(() => typeof route.query.to === "string" ? route.query.to : "/");
    useCookie("invite_key", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-md px-4 py-16 sm:py-20"><div class="luxe-card"><div class="luxe-card__inner"><p class="text-xs uppercase tracking-[0.3em] text-white/80">Access</p><h1 class="mt-2 font-display text-3xl text-gold">アクセスコード</h1><p class="mt-2 text-sm text-white/70">招待状に記載のコードを入力してください</p><form class="mt-6 grid gap-3"><label for="access-key" class="text-[10px] uppercase tracking-[0.28em] text-white/60">Code</label><input id="access-key"${ssrRenderAttr("value", accessKey.value)} type="password" autocomplete="one-time-code" placeholder="例）1234" class="mt-1 w-full rounded-2xl border border-gold/30 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60"><button type="submit" class="btn-gold btn-sm w-full justify-center"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""}>${ssrInterpolate(isSubmitting.value ? "確認中..." : "入る")}</button></form>`);
      if (error.value) {
        _push(`<p class="mt-3 text-xs text-rose-200">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/access.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=access-Bg3CS9PT.mjs.map
