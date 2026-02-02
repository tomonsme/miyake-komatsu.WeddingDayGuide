import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
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
  __name: "message",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, message } = useEventData();
    const messageDate = computed(() => message.value?.date ?? "");
    const messageSignature = computed(() => message.value?.signature ?? "");
    const messageParagraphs = computed(() => {
      const lines = message.value?.lines ?? [];
      const paragraphs = [];
      let current = [];
      for (const line of lines) {
        if (!line) {
          if (current.length) {
            paragraphs.push(current);
            current = [];
          }
          continue;
        }
        current.push(line);
      }
      if (current.length) paragraphs.push(current);
      return paragraphs;
    });
    useHead(() => {
      const pageTitle = `Message | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "ご挨拶" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/85">Message</p><h1 class="mt-2 font-display text-3xl text-gold">メッセージ</h1><p class="mt-2 text-sm text-white/85">ご挨拶</p></div>`);
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
      _push(`</div><div class="message-card message-card--clear"><div class="message-card__inner"><section><div class="text-center"></div><div class="mt-5 space-y-4 text-sm leading-relaxed text-white/85 text-center"><!--[-->`);
      ssrRenderList(unref(messageParagraphs), (paragraph, idx) => {
        _push(`<p><!--[-->`);
        ssrRenderList(paragraph, (line, lineIdx) => {
          _push(`<span class="block">${ssrInterpolate(line)}</span>`);
        });
        _push(`<!--]--></p>`);
      });
      _push(`<!--]--></div>`);
      if (unref(messageDate) || unref(messageSignature)) {
        _push(`<div class="mt-6 text-center text-sm text-white/70">`);
        if (unref(messageDate)) {
          _push(`<p>${ssrInterpolate(unref(messageDate))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(messageSignature)) {
          _push(`<p class="mt-1 font-display text-base text-white">${ssrInterpolate(unref(messageSignature))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/message.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=message-CpPtdmOY.mjs.map
