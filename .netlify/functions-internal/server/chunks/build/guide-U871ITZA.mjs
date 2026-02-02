import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

const MAX_NAME_LEN = 12;
const tapDurationMs = 1e4;
const stopTargetMs = 11110;
const stopHideMs = 8e3;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "guide",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple } = useEventData();
    const nickname = ref("");
    const nicknameError = ref("");
    const nicknameCount = computed(() => nickname.value.length);
    const hasNickname = computed(() => nickname.value.trim().length > 0);
    const activeGame = ref("tap10");
    const leaderboard = ref({ tap10: [], stop11: [] });
    const liveConnected = ref(false);
    const leaderboardError = ref("");
    const leaderboardUpdatedAt = ref(null);
    const formatSeconds = (ms) => (ms / 1e3).toFixed(2);
    const formatDelta = (ms) => `${formatSeconds(ms)}s`;
    const lastUpdatedLabel = computed(() => {
      if (!leaderboardUpdatedAt.value) return "";
      return new Date(leaderboardUpdatedAt.value).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit"
      });
    });
    const tapTimeLeftMs = ref(tapDurationMs);
    const tapScore = ref(0);
    const tapBest = ref(0);
    const tapActive = ref(false);
    const tapProgress = computed(() => Math.max(0, Math.min(1, tapTimeLeftMs.value / tapDurationMs)));
    const tapTimeLabel = computed(() => formatSeconds(tapTimeLeftMs.value).replace(/\.00$/, ""));
    const tapMessage = computed(() => {
      if (tapActive.value) return "連打でスコアアップ！";
      if (tapScore.value === 0) return "スタートで10秒間タップできます";
      if (tapScore.value >= 40) return "超高速！";
      if (tapScore.value >= 25) return "ナイス！";
      return "もう一回挑戦してみよう";
    });
    const tapCanSubmit = computed(() => !tapActive.value && tapScore.value > 0);
    const tapStatusLabel = computed(() => tapActive.value ? "プレイ中" : tapScore.value > 0 ? "完了" : "準備");
    const tapStatusClass = computed(() => {
      if (tapActive.value) return "game-chip--live";
      if (tapScore.value > 0) return "game-chip--done";
      return "game-chip--ready";
    });
    const stopActive = ref(false);
    const stopElapsedMs = ref(0);
    const stopResultMs = ref(null);
    const stopBestDelta = ref(null);
    const stopDeltaMs = computed(() => {
      if (stopResultMs.value === null) return null;
      return Math.abs(stopResultMs.value - stopTargetMs);
    });
    const stopDisplay = computed(() => {
      if (stopActive.value && stopElapsedMs.value >= stopHideMs) return "??.??";
      return formatSeconds(stopElapsedMs.value);
    });
    const stopMessage = computed(() => {
      if (stopActive.value) return "ストップを狙って！";
      if (stopResultMs.value === null) return "スタートしてタイミングを合わせよう";
      const delta = stopDeltaMs.value ?? 0;
      if (delta <= 30) return `ほぼ完璧！差 ${formatDelta(delta)}`;
      if (delta <= 120) return `惜しい！差 ${formatDelta(delta)}`;
      return `差 ${formatDelta(delta)}`;
    });
    const stopCanSubmit = computed(() => !stopActive.value && stopResultMs.value !== null);
    const stopProgress = computed(() => Math.max(0, Math.min(1, stopElapsedMs.value / stopTargetMs)));
    const stopProgressVisible = computed(() => !stopActive.value || stopElapsedMs.value < stopHideMs);
    const stopStatusLabel = computed(() => stopActive.value ? "プレイ中" : stopResultMs.value !== null ? "完了" : "準備");
    const stopStatusClass = computed(() => {
      if (stopActive.value) return "game-chip--live";
      if (stopResultMs.value !== null) return "game-chip--done";
      return "game-chip--ready";
    });
    const tapSubmitState = ref("idle");
    const stopSubmitState = ref("idle");
    const tapSubmitReady = computed(() => tapCanSubmit.value && hasNickname.value && tapSubmitState.value !== "saving");
    const stopSubmitReady = computed(() => stopCanSubmit.value && hasNickname.value && stopSubmitState.value !== "saving");
    const tapSubmitLabel = computed(() => {
      if (!hasNickname.value) return "ニックネームを入力";
      if (tapSubmitState.value === "saving") return "送信中...";
      return "ランキングに送る";
    });
    const stopSubmitLabel = computed(() => {
      if (!hasNickname.value) return "ニックネームを入力";
      if (stopSubmitState.value === "saving") return "送信中...";
      return "ランキングに送る";
    });
    useHead(() => {
      const pageTitle = `Extras | ${displayCouple.value}`;
      const desc = "10秒タップと11.11秒ストップのミニゲーム";
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
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "game-arcade min-h-screen" }, _attrs))}><section class="game-screen"><div class="dq-header"><div class="dq-title-panel"><p class="dq-kicker">EXTRAS</p><h1 class="dq-title">ミニゲーム</h1><p class="dq-subtitle">10秒タップ &amp; 11.11秒ストップ</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "dq-home-btn"
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
      _push(`</div><div class="dq-hud"><div class="luxe-card dq-panel"><div class="luxe-card__inner dq-panel__inner dq-panel--stats"><div class="flex items-center justify-between gap-3"><p class="dq-label">ステータス</p><span class="${ssrRenderClass([hasNickname.value ? "game-chip--ready" : "game-chip--idle", "game-chip"])}">${ssrInterpolate(hasNickname.value ? "OK" : "なまえ")}</span></div><p class="mt-1 text-sm text-white">ニックネームを入力するとランキングに反映されます</p><div class="mt-2"><label for="nickname" class="dq-label">なまえ</label><input id="nickname"${ssrRenderAttr("value", nickname.value)} type="text" maxlength="12" placeholder="例）Tomoya" class="game-input mt-2 w-full px-4 py-3 text-sm"><div class="mt-1 flex items-center justify-between text-[10px] text-white/55"><span>12文字まで</span><span>${ssrInterpolate(nicknameCount.value)}/${ssrInterpolate(MAX_NAME_LEN)}</span></div>`);
      if (nicknameError.value) {
        _push(`<p class="mt-1 text-xs text-rose-200">${ssrInterpolate(nicknameError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="luxe-card dq-panel dq-panel--command"><div class="luxe-card__inner dq-panel__inner"><p class="dq-label">ゲームを選択</p><div class="mt-3 game-tabs" role="tablist" aria-label="ミニゲーム"><button id="tab-tap10" type="button" role="tab"${ssrRenderAttr("aria-selected", activeGame.value === "tap10")}${ssrRenderAttr("tabindex", activeGame.value === "tap10" ? 0 : -1)} aria-controls="panel-tap10" class="${ssrRenderClass([{ "is-active": activeGame.value === "tap10" }, "game-tab"])}"><span class="game-tab__label">10秒タップ</span><span class="game-tab__sub">タップ</span><span class="game-tab__meta"><span class="${ssrRenderClass([tapStatusClass.value, "game-chip game-tab__state"])}">${ssrInterpolate(tapStatusLabel.value)}</span>`);
      if (tapBest.value > 0) {
        _push(`<span class="score-pill">Best ${ssrInterpolate(tapBest.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></button><button id="tab-stop11" type="button" role="tab"${ssrRenderAttr("aria-selected", activeGame.value === "stop11")}${ssrRenderAttr("tabindex", activeGame.value === "stop11" ? 0 : -1)} aria-controls="panel-stop11" class="${ssrRenderClass([{ "is-active": activeGame.value === "stop11" }, "game-tab"])}"><span class="game-tab__label">11.11秒ストップ</span><span class="game-tab__sub">ストップ</span><span class="game-tab__meta"><span class="${ssrRenderClass([stopStatusClass.value, "game-chip game-tab__state"])}">${ssrInterpolate(stopStatusLabel.value)}</span>`);
      if (stopBestDelta.value !== null) {
        _push(`<span class="score-pill">Best Δ ${ssrInterpolate(formatDelta(stopBestDelta.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></button></div></div></div></div><div class="luxe-card dq-panel dq-panel--dialog"><div class="luxe-card__inner dq-panel__inner" aria-live="polite"><div class="flex items-center justify-between"><p class="dq-label">ランキング</p><span class="${ssrRenderClass([liveConnected.value ? "" : "text-white/50 border-white/20", "live-badge"])}"><span class="${ssrRenderClass([liveConnected.value ? "is-on" : "is-off", "live-dot"])}"></span> ${ssrInterpolate(liveConnected.value ? "LIVE" : "OFFLINE")}</span></div><p class="mt-1 text-sm text-white/85">会場内でリアルタイム更新</p>`);
      if (lastUpdatedLabel.value) {
        _push(`<p class="mt-0.5 text-xs text-white/55">更新: ${ssrInterpolate(lastUpdatedLabel.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (leaderboardError.value) {
        _push(`<p class="mt-1 text-xs text-rose-200">${ssrInterpolate(leaderboardError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 grid gap-3 sm:grid-cols-2"><div><div class="flex items-center justify-between"><p class="dq-label text-white/60">10秒タップ</p>`);
      if (tapBest.value > 0) {
        _push(`<span class="score-pill">Best ${ssrInterpolate(tapBest.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (leaderboard.value.tap10.length) {
        _push(`<ol class="mt-2 space-y-2 text-xs"><!--[-->`);
        ssrRenderList(leaderboard.value.tap10, (entry, idx) => {
          _push(`<li class="${ssrRenderClass([{ "is-top": idx === 0 }, "game-entry flex items-center justify-between"])}"><span class="text-white/80">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(entry.name)}</span><span class="text-white">${ssrInterpolate(entry.score)}</span></li>`);
        });
        _push(`<!--]--></ol>`);
      } else {
        _push(`<p class="mt-2 text-xs text-white/60">まだ登録なし</p>`);
      }
      _push(`</div><div><div class="flex items-center justify-between"><p class="dq-label text-white/60">11.11秒ストップ</p>`);
      if (stopBestDelta.value !== null) {
        _push(`<span class="score-pill">Best Δ ${ssrInterpolate(formatDelta(stopBestDelta.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (leaderboard.value.stop11.length) {
        _push(`<ol class="mt-2 space-y-2 text-xs"><!--[-->`);
        ssrRenderList(leaderboard.value.stop11, (entry, idx) => {
          _push(`<li class="${ssrRenderClass([{ "is-top": idx === 0 }, "game-entry flex items-center justify-between"])}"><div><p class="text-white/80">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(entry.name)}</p><p class="text-[10px] text-white/50"> 差 ${ssrInterpolate(formatDelta(entry.meta?.deltaMs ?? entry.score))}</p></div><span class="text-white">${ssrInterpolate(formatSeconds(entry.meta?.timeMs ?? stopTargetMs))}s</span></li>`);
        });
        _push(`<!--]--></ol>`);
      } else {
        _push(`<p class="mt-2 text-xs text-white/60">まだ登録なし</p>`);
      }
      _push(`</div></div></div></div><div class="luxe-card dq-panel dq-panel--arena"><div class="luxe-card__inner dq-panel__inner"><div class="mt-1"><section id="panel-tap10" role="tabpanel" aria-labelledby="tab-tap10" style="${ssrRenderStyle(activeGame.value === "tap10" ? null : { display: "none" })}"><div class="flex items-start justify-between gap-3"><div><p class="dq-label">ゲーム1</p><h2 class="mt-1 dq-title-sm">10秒タップ</h2><p class="mt-1 text-xs text-white/80">10秒で何回タップできるか</p></div><span class="${ssrRenderClass([tapStatusClass.value, "game-chip"])}">${ssrInterpolate(tapStatusLabel.value)}</span></div><div class="mt-3 game-panel game-panel--tap"><div class="game-panel__inner"><div class="grid gap-2"><div class="grid grid-cols-2 gap-2"><div class="game-kpi"><span class="game-kpi__label">Time</span><span class="game-kpi__value">${ssrInterpolate(tapTimeLabel.value)}s</span></div><div class="game-kpi"><span class="game-kpi__label">Taps</span><span class="game-kpi__value">${ssrInterpolate(tapScore.value)}</span></div></div><div class="game-meter"><div class="game-meter__bar" style="${ssrRenderStyle({ width: `${Math.round(tapProgress.value * 100)}%` })}"></div></div><button type="button" class="${ssrRenderClass([{ "is-active": tapActive.value }, "game-pad"])}"${ssrIncludeBooleanAttr(!tapActive.value) ? " disabled" : ""}><span class="game-pad__label">タップ</span><span class="game-pad__sub">${ssrInterpolate(tapActive.value ? "連打！" : "スタート後にタップ")}</span></button></div></div></div><div class="mt-3 flex flex-wrap items-center gap-2"><button type="button" class="btn-primary btn-sm">${ssrInterpolate(tapActive.value ? "リスタート" : "スタート")}</button><button type="button" class="btn-secondary btn-sm"${ssrIncludeBooleanAttr(!tapSubmitReady.value) ? " disabled" : ""}>${ssrInterpolate(tapSubmitLabel.value)}</button></div><p class="mt-2 text-xs text-white/70" aria-live="polite">${ssrInterpolate(tapMessage.value)}</p><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">`);
      if (tapBest.value > 0) {
        _push(`<span class="score-pill">Best ${ssrInterpolate(tapBest.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (tapActive.value) {
        _push(`<span class="score-pill">Now ${ssrInterpolate(tapScore.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (tapSubmitState.value === "done") {
        _push(`<p class="mt-1 text-xs text-gold">送信しました</p>`);
      } else if (tapSubmitState.value === "error") {
        _push(`<p class="mt-1 text-xs text-rose-200">送信できませんでした</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section id="panel-stop11" role="tabpanel" aria-labelledby="tab-stop11" style="${ssrRenderStyle(activeGame.value === "stop11" ? null : { display: "none" })}"><div class="flex items-start justify-between gap-3"><div><p class="dq-label">ゲーム2</p><h2 class="mt-1 dq-title-sm">11.11秒ストップ</h2><p class="mt-1 text-xs text-white/80">11.11秒でストップできるか</p></div><span class="${ssrRenderClass([stopStatusClass.value, "game-chip"])}">${ssrInterpolate(stopStatusLabel.value)}</span></div><div class="mt-3 game-panel game-panel--stop"><div class="game-panel__inner"><div class="flex items-center justify-between"><span class="score-pill">もくひょう 11.11s</span>`);
      if (stopDeltaMs.value !== null) {
        _push(`<span class="score-pill">差 ${ssrInterpolate(formatDelta(stopDeltaMs.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="${ssrRenderClass([{ "is-hidden": stopActive.value && stopElapsedMs.value >= stopHideMs }, "mt-3 game-timer"])}">${ssrInterpolate(stopDisplay.value)}</p>`);
      if (stopProgressVisible.value) {
        _push(`<div class="mt-2 game-meter"><div class="game-meter__bar" style="${ssrRenderStyle({ width: `${Math.round(stopProgress.value * 100)}%` })}"></div></div>`);
      } else {
        _push(`<div class="mt-2 game-meter is-hidden"><div class="game-meter__veil"></div></div>`);
      }
      _push(`<p class="mt-2 text-xs text-white/70" aria-live="polite">${ssrInterpolate(stopMessage.value)}</p></div></div><div class="mt-3 flex flex-wrap items-center gap-2"><button type="button" class="${ssrRenderClass([stopActive.value ? "btn-secondary" : "btn-primary", "btn-sm"])}"${ssrIncludeBooleanAttr(stopActive.value) ? " disabled" : ""}> スタート </button><button type="button" class="${ssrRenderClass([stopActive.value ? "btn-primary" : "btn-secondary", "btn-sm"])}"${ssrIncludeBooleanAttr(!stopActive.value) ? " disabled" : ""}> ストップ </button><button type="button" class="btn-secondary btn-sm">リセット</button><button type="button" class="btn-secondary btn-sm"${ssrIncludeBooleanAttr(!stopSubmitReady.value) ? " disabled" : ""}>${ssrInterpolate(stopSubmitLabel.value)}</button></div><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">`);
      if (stopBestDelta.value !== null) {
        _push(`<span class="score-pill">Best Δ ${ssrInterpolate(formatDelta(stopBestDelta.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (stopResultMs.value !== null) {
        _push(`<span class="score-pill">今回 ${ssrInterpolate(formatSeconds(stopResultMs.value))}s</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (stopSubmitState.value === "done") {
        _push(`<p class="mt-2 text-xs text-gold">送信しました</p>`);
      } else if (stopSubmitState.value === "error") {
        _push(`<p class="mt-2 text-xs text-rose-200">送信できませんでした</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=guide-U871ITZA.mjs.map
