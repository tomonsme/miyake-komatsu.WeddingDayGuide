import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "seating",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, seating, profile, displayDateParts, venue, venueRoom } = useEventData();
    const tables = computed(() => seating.value?.tables ?? []);
    const isFullscreen = ref(false);
    const isToggling = ref(false);
    ref(0);
    ref(null);
    const tableRows = computed(() => {
      const cols = 4;
      const ordered = [...tables.value];
      const rows = [];
      for (let i = 0; i < ordered.length; i += cols) {
        const row = ordered.slice(i, i + cols);
        while (row.length < cols) row.push(null);
        rows.push(row);
      }
      return rows;
    });
    const groomName = computed(() => profile.value?.groom?.name ?? "");
    const brideName = computed(() => profile.value?.bride?.name ?? "");
    const dateLine = computed(() => {
      const date = displayDateParts.value?.date;
      if (!date) return "";
      const [y, m, d] = date.split(".");
      const dow = displayDateParts.value?.dow ?? "";
      if (!y || !m || !d) return "";
      return `${y}年${m}月${d}日 ${dow}`;
    });
    function normalizeSeat(seat) {
      if (typeof seat === "string") return { name: seat };
      return seat;
    }
    function seatColumns(table) {
      const seats = table.seats.map(normalizeSeat);
      const leftCount = table.leftCount ?? Math.ceil(seats.length / 2);
      return {
        left: seats.slice(0, leftCount),
        right: seats.slice(leftCount)
      };
    }
    function seatingClass(table) {
      const columns = seatColumns(table);
      const maxCount = Math.max(columns.left.length, columns.right.length);
      if (maxCount <= 2) return "seating-diagram--compact";
      if (maxCount <= 3) return "seating-diagram--snug";
      return "seating-diagram--dense";
    }
    function seatSuffix(seat) {
      if (seat.suffix === "") return "";
      return seat.suffix ?? "様";
    }
    watch(isFullscreen, (value) => {
      return;
    });
    useHead(() => {
      const pageTitle = `Seating | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "席次表" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/85">Seating</p><h1 class="mt-2 font-display text-3xl text-gold">席次表</h1><p class="mt-2 text-sm text-white/85">お席のご案内</p></div>`);
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
      _push(`</div><div class="${ssrRenderClass([{ "seating-shell--fullscreen": unref(isFullscreen) }, "seating-shell"])}"><div class="seating-controls sm:hidden">`);
      if (!unref(isFullscreen)) {
        _push(`<div class="seating-hints"><span class="seating-pill">横向き推奨</span><span class="seating-pill">横にスワイプ</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="seating-fullscreen-btn"${ssrIncludeBooleanAttr(unref(isToggling)) ? " disabled" : ""}${ssrRenderAttr("aria-busy", unref(isToggling))}>${ssrInterpolate(unref(isFullscreen) ? "閉じる" : "全画面で見る")}</button></div><div class="${ssrRenderClass([{ "seating-scroll--fullscreen": unref(isFullscreen) }, "seating-scroll"])}"><div class="seating-sheet"><div class="seating-header"><div class="seating-header__left"><p class="seating-kicker-row"><span class="seating-kicker">Seating Chart</span><span class="seating-sub">席次表</span></p></div><div class="seating-header__center"><p class="seating-script">Wedding Reception</p><div class="seating-couple">`);
      if (unref(groomName)) {
        _push(`<div><span class="seating-label">新郎</span><span class="seating-name">${ssrInterpolate(unref(groomName))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(brideName)) {
        _push(`<div><span class="seating-label">新婦</span><span class="seating-name">${ssrInterpolate(unref(brideName))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="seating-header__right">`);
      if (unref(dateLine)) {
        _push(`<p class="seating-meta">${ssrInterpolate(unref(dateLine))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(venue)) {
        _push(`<p class="seating-meta">${ssrInterpolate(unref(venue))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(venueRoom)) {
        _push(`<p class="seating-meta">${ssrInterpolate(unref(venueRoom))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="seating-grid"><!--[-->`);
      ssrRenderList(unref(tableRows), (row, rowIndex) => {
        _push(`<div class="seating-row"><!--[-->`);
        ssrRenderList(row, (table) => {
          _push(`<div class="${ssrRenderClass([{ "seating-table--empty": !table }, "seating-table"])}">`);
          if (table) {
            _push(`<div class="${ssrRenderClass([seatingClass(table), "seating-diagram"])}"><div class="seating-column seating-column--left"><!--[-->`);
            ssrRenderList(seatColumns(table).left, (seat) => {
              _push(`<div class="seating-seat-card">`);
              if (seat.role) {
                _push(`<span class="seating-seat-role">${ssrInterpolate(seat.role)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<span class="seating-seat-name">${ssrInterpolate(seat.name)}`);
              if (seatSuffix(seat)) {
                _push(`<span class="seating-seat-suffix">${ssrInterpolate(seatSuffix(seat))}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span></div>`);
            });
            _push(`<!--]--></div><div class="seating-table__circle"><span class="seating-table__center">${ssrInterpolate(table.name)}</span></div><div class="seating-column seating-column--right"><!--[-->`);
            ssrRenderList(seatColumns(table).right, (seat) => {
              _push(`<div class="seating-seat-card">`);
              if (seat.role) {
                _push(`<span class="seating-seat-role">${ssrInterpolate(seat.role)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<span class="seating-seat-name">${ssrInterpolate(seat.name)}`);
              if (seatSuffix(seat)) {
                _push(`<span class="seating-seat-suffix">${ssrInterpolate(seatSuffix(seat))}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</span></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div></div></div><p class="mt-3 hidden text-xs text-white/70 sm:block">※ 横にスクロールできます</p></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/seating.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=seating-Dir6v7mP.mjs.map
