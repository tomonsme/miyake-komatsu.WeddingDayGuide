import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useEventData } from './useEventData-Da3dhjSG.mjs';
import { u as useHead } from './server.mjs';
import 'perfect-debounce';
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

const eventLine = "Wedding Day Guide";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, venue, displayDateParts, storyboardItems } = useEventData();
    useHead(() => {
      const pageTitle = `${displayCouple.value} | Wedding Day Home`;
      const desc = `${displayDateParts.value.date} ${displayDateParts.value.dow} ${venue.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: desc },
          { property: "og:title", content: pageTitle },
          { property: "og:description", content: desc }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="relative min-h-screen overflow-hidden"><div class="absolute inset-0"><div class="absolute inset-0 hero-ambient" aria-hidden="true"></div></div><div class="relative z-10 mx-auto flex min-h-screen w-full max-w-screen-lg flex-col justify-center px-4 py-10 sm:px-6 sm:py-12"><div class="text-center"><div class="mx-auto max-w-xl rounded-3xl hero-panel px-5 py-5 sm:px-6 sm:py-6"><h1 class="font-display text-[clamp(1.35rem,6.5vw,3rem)] sm:text-4xl md:text-5xl tracking-wide text-white/95 text-shadow-soft whitespace-nowrap">${ssrInterpolate(unref(displayCouple))}</h1><p class="mt-3 text-[clamp(0.6rem,2.6vw,0.85rem)] uppercase tracking-[0.22em] text-white/80 text-shadow-soft whitespace-nowrap">${ssrInterpolate(eventLine)}</p></div></div><div class="mt-6 sm:mt-10"><p class="text-center text-[12px] uppercase tracking-[0.3em] text-white/85">Home</p><div class="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:place-items-center sm:gap-4 md:gap-5"><!--[-->`);
      ssrRenderList(unref(storyboardItems), (item) => {
        _push(`<button type="button" class="group story-card relative w-full aspect-[1/1] sm:aspect-auto sm:w-[200px] sm:h-[250px] md:w-[230px] md:h-[288px] lg:w-[240px] lg:h-[300px] border border-gold/30 bg-white/5 text-left shadow-[0_18px_36px_-26px_rgba(0,0,0,.55)] transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"${ssrRenderAttr("aria-label", item.title)}>`);
        if (item.image) {
          _push(`<img${ssrRenderAttr("src", item.image)} alt="" class="story-card__media absolute inset-0 h-full w-full object-cover" loading="lazy">`);
        } else {
          _push(`<!---->`);
        }
        if (item.image) {
          _push(`<span class="story-card__overlay" aria-hidden="true"></span>`);
        } else {
          _push(`<span class="story-card__bg" aria-hidden="true"></span>`);
        }
        _push(`<span class="story-card__body"><span class="story-card__caption"><span class="story-card__label">${ssrInterpolate(item.label)}</span><span class="story-card__title">${ssrInterpolate(item.title)}</span>`);
        if (item.subtitle) {
          _push(`<span class="story-card__sub">${ssrInterpolate(item.subtitle)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span></span></button>`);
      });
      _push(`<!--]--></div></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BDqXkT85.mjs.map
