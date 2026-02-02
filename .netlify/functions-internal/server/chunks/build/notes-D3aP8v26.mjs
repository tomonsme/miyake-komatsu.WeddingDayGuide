import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "notes",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, notes } = useEventData();
    useHead(() => {
      const pageTitle = `Notes | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "当日のお願い事項" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/85">Notes</p><h1 class="mt-2 font-display text-3xl text-gold">お願い</h1><p class="mt-2 text-sm text-white/85">当日のご注意</p></div>`);
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
      _push(`</div><div class="grid gap-4 md:grid-cols-2"><!--[-->`);
      ssrRenderList(unref(notes), (note, i) => {
        _push(`<div class="luxe-card"><div class="luxe-card__inner"><p class="text-xs uppercase tracking-[0.3em] text-white/80">${ssrInterpolate(note.title)}</p><p class="mt-2 text-sm leading-relaxed text-white/90">${ssrInterpolate(note.body)}</p></div></div>`);
      });
      _push(`<!--]--></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notes-D3aP8v26.mjs.map
