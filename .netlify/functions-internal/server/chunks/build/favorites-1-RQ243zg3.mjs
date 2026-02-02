import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useEventData } from './useEventData-Da3dhjSG.mjs';
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
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "favorites-1",
  __ssrInlineRender: true,
  setup(__props) {
    const photos = [
      { src: "/pages/favorites-1/201579_0.jpg", title: "①パリ逃走中ともや" },
      { src: "/pages/favorites-1/201580_0.jpg", title: "②軍艦島大晴れ男ともや", note: "(大雨予報でほぼ諦めてたのに流石です)" },
      { src: "/pages/favorites-1/201581_0.jpg", title: "③手乗りともや" },
      { src: "/pages/favorites-1/201582_0.jpg", title: "④吉野お花見ニコニコともや" },
      { src: "/pages/favorites-1/201583_0.jpg", title: "⑤ダッフィー耳ともや", note: "(絶対ダッフィーの耳が良かった小松大満足)" }
    ];
    const { displayCouple } = useEventData();
    useHead(() => {
      const pageTitle = `Favorites 1 | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "推しの写真①" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/80">Favorites</p><h1 class="mt-2 font-display text-3xl text-gold">推しの写真①</h1><p class="mt-2 text-sm text-white/85">Tomoya</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "btn-secondary btn-sm justify-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ホームへ戻る`);
          } else {
            return [
              createTextVNode("ホームへ戻る")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="luxe-card"><div class="luxe-card__inner"><p class="text-xs uppercase tracking-[0.3em] text-white/75">Album</p><div class="mt-4 grid gap-4"><!--[-->`);
      ssrRenderList(photos, (photo, idx) => {
        _push(`<figure class="overflow-hidden rounded-2xl border border-gold/20 bg-black/30"><img${ssrRenderAttr("src", photo.src)}${ssrRenderAttr("alt", `推しの写真① ${idx + 1}`)} class="aspect-[4/3] h-auto w-full object-cover" loading="lazy" decoding="async"><figcaption class="px-3 py-2 text-xs text-white/85"><span>${ssrInterpolate(photo.title)}</span>`);
        if (photo.note) {
          _push(`<span class="mt-1 block text-[10px] text-white/60">${ssrInterpolate(photo.note)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</figcaption></figure>`);
      });
      _push(`<!--]--></div></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/favorites-1.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=favorites-1-RQ243zg3.mjs.map
