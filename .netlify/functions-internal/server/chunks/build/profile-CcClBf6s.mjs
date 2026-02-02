import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, profile } = useEventData();
    const profileRows = computed(() => profile.value?.rows ?? []);
    const groom = computed(() => profile.value?.groom ?? { name: "", image: "" });
    const bride = computed(() => profile.value?.bride ?? { name: "", image: "" });
    function splitProfileLine(value) {
      const trimmed = value.trim();
      const match = /^(.+?)(\([^()]+\))$/.exec(trimmed);
      if (match) return [match[1], match[2]];
      return [value];
    }
    function toLines(value) {
      if (!value) return [];
      const lines = Array.isArray(value) ? value : [value];
      return lines.flatMap((line) => splitProfileLine(line));
    }
    useHead(() => {
      const pageTitle = `Profile | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "新郎新婦のプロフィール" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/85">Profile</p><h1 class="mt-2 font-display text-3xl text-gold">プロフィール</h1><p class="mt-2 text-sm text-white/85">新郎新婦のご紹介</p></div>`);
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
      _push(`</div><div class="paper-sheet"><div class="paper-sheet__inner grain"><section><div class="text-center"><p class="profile-heading">Profile</p><p class="mt-1 text-[11px] text-[#b89358]/80">プロフィール</p><div class="divider"></div></div><div class="mt-6 grid grid-cols-2 gap-4"><div class="text-center">`);
      if (unref(groom).image) {
        _push(`<img${ssrRenderAttr("src", unref(groom).image)}${ssrRenderAttr("alt", unref(groom).name)} class="profile-photo mx-auto h-24 w-24 sm:h-28 sm:w-28" loading="lazy" decoding="async">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-3 font-display text-base text-[#2b2a28]">${ssrInterpolate(unref(groom).name)}</p></div><div class="text-center">`);
      if (unref(bride).image) {
        _push(`<img${ssrRenderAttr("src", unref(bride).image)}${ssrRenderAttr("alt", unref(bride).name)} class="profile-photo mx-auto h-24 w-24 sm:h-28 sm:w-28" loading="lazy" decoding="async">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-3 font-display text-base text-[#2b2a28]">${ssrInterpolate(unref(bride).name)}</p></div></div><div class="mt-6"><table class="profile-table"><tbody><!--[-->`);
      ssrRenderList(unref(profileRows), (row) => {
        _push(`<tr class="profile-row"><td class="profile-row__cell"><!--[-->`);
        ssrRenderList(toLines(row.left), (line, idx) => {
          _push(`<span>${ssrInterpolate(line)}</span>`);
        });
        _push(`<!--]--></td><th scope="row" class="profile-row__label">${ssrInterpolate(row.label)}</th><td class="profile-row__cell"><!--[-->`);
        ssrRenderList(toLines(row.right), (line, idx) => {
          _push(`<span>${ssrInterpolate(line)}</span>`);
        });
        _push(`<!--]--></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-CcClBf6s.mjs.map
