import { u as useHead, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const MAX_FILES = 20;
const MAX_FILE_MB = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "photos",
  __ssrInlineRender: true,
  setup(__props) {
    const { displayCouple, photoShare } = useEventData();
    const photo = computed(() => photoShare.value);
    const hasBackupLink = computed(() => {
      const link = photo.value?.linkUrl || "";
      return Boolean(link);
    });
    const senderName = ref("");
    const selectedItems = ref([]);
    const uploadState = ref("idle");
    const uploadError = ref("");
    const isDragging = ref(false);
    ref(null);
    const galleryItems = ref([]);
    const galleryState = ref("idle");
    const galleryError = ref("");
    const currentSlide = ref(0);
    let slideshowTimer = null;
    const fileCountLabel = computed(() => `選択 ${selectedItems.value.length}件`);
    const totalSize = computed(() => selectedItems.value.reduce((sum, item) => sum + item.file.size, 0));
    const totalSizeLabel = computed(() => `合計 ${formatBytes(totalSize.value)}`);
    const canUpload = computed(() => selectedItems.value.length > 0 && uploadState.value !== "uploading");
    const uploadButtonLabel = computed(() => {
      if (uploadState.value === "uploading") return "送信中...";
      return "送信する";
    });
    const slideshowItems = computed(() => galleryItems.value);
    const formatBytes = (bytes) => {
      if (bytes < 1024) return `${bytes}B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(1)}KB`;
      const mb = kb / 1024;
      return `${mb.toFixed(1)}MB`;
    };
    const stopSlideshow = () => {
      if (slideshowTimer) clearInterval(slideshowTimer);
      slideshowTimer = null;
    };
    const startSlideshow = () => {
      stopSlideshow();
      if (slideshowItems.value.length <= 1) return;
      slideshowTimer = setInterval();
    };
    watch(
      () => slideshowItems.value.length,
      (len) => {
        if (!len) {
          currentSlide.value = 0;
          stopSlideshow();
          return;
        }
        if (currentSlide.value >= len) currentSlide.value = 0;
        startSlideshow();
      }
    );
    useHead(() => {
      const pageTitle = `Photos | ${displayCouple.value}`;
      return {
        title: pageTitle,
        meta: [
          { name: "description", content: "写真共有" },
          { property: "og:title", content: pageTitle }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen overflow-x-hidden bg-gradient-to-b from-ink to-midnight text-white" }, _attrs))}><section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20"><div class="mb-6 flex items-start justify-between gap-4 sm:mb-8"><div><p class="text-xs uppercase tracking-[0.3em] text-white/85">Photos</p><h1 class="mt-2 font-display text-3xl text-gold">${ssrInterpolate(photo.value.title)}</h1>`);
      if (photo.value.subtitle) {
        _push(`<p class="mt-2 text-sm text-white/85">${ssrInterpolate(photo.value.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
      _push(`</div><div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div class="grid gap-4"><div class="luxe-card"><div class="luxe-card__inner"><div class="mt-5 share-frame text-center"><p class="share-frame__title">Files</p><div class="${ssrRenderClass([{ "is-dragging": isDragging.value }, "mt-3 share-drop"])}"><input type="file" class="sr-only" accept="image/*,video/*" multiple><button type="button" class="btn-secondary btn-sm"> ファイルを選ぶ </button><p class="mt-3 text-xs text-white/60">最大${ssrInterpolate(MAX_FILES)}件・1件${ssrInterpolate(MAX_FILE_MB)}MBまで</p></div>`);
      if (uploadError.value) {
        _push(`<p class="mt-3 text-xs text-rose-200">${ssrInterpolate(uploadError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (selectedItems.value.length) {
        _push(`<div class="mt-4 w-full"><div class="share-preview-wrap"><div class="share-preview"><!--[-->`);
        ssrRenderList(selectedItems.value, (item, idx) => {
          _push(`<div class="share-preview__item">`);
          if (!item.isVideo) {
            _push(`<img${ssrRenderAttr("src", item.url)}${ssrRenderAttr("alt", item.file.name)} class="share-preview__media" loading="lazy" decoding="async">`);
          } else {
            _push(`<video${ssrRenderAttr("src", item.url)} class="share-preview__media" muted playsinline preload="metadata"></video>`);
          }
          if (item.isVideo) {
            _push(`<span class="share-preview__badge">VIDEO</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button type="button" class="share-preview__remove" aria-label="削除">×</button></div>`);
        });
        _push(`<!--]--></div></div><div class="mt-3 flex items-center justify-between text-xs text-white/60"><span>${ssrInterpolate(fileCountLabel.value)}</span><span>${ssrInterpolate(totalSizeLabel.value)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-5 share-frame"><p class="share-frame__title">Sender</p><div class="mt-3"><label for="sender" class="text-[10px] uppercase tracking-[0.28em] text-white/60">お名前（任意）</label><input id="sender"${ssrRenderAttr("value", senderName.value)} type="text" maxlength="20" placeholder="例）Tomoya" class="mt-2 w-full rounded-2xl border border-gold/30 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60"></div><div class="share-divider"></div><div class="flex flex-col gap-2 sm:flex-row"><button type="button" class="btn-gold btn-sm w-full sm:w-auto"${ssrIncludeBooleanAttr(!canUpload.value) ? " disabled" : ""}>${ssrInterpolate(uploadButtonLabel.value)}</button></div>`);
      if (uploadState.value === "done") {
        _push(`<p class="mt-3 text-xs text-gold">送信しました</p>`);
      } else if (uploadState.value === "error") {
        _push(`<p class="mt-3 text-xs text-rose-200">送信できませんでした</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="grid gap-4"><div class="luxe-card"><div class="luxe-card__inner"><div class="flex items-center justify-between"><p class="text-xs uppercase tracking-[0.3em] text-white/80">Gallery</p><button type="button" class="text-[10px] uppercase tracking-[0.28em] text-white/60 transition hover:text-white"${ssrIncludeBooleanAttr(galleryState.value === "loading") ? " disabled" : ""}> 更新 </button></div>`);
      if (galleryState.value === "loading") {
        _push(`<div class="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-xs text-white/70"> 読み込み中... </div>`);
      } else if (galleryState.value === "error") {
        _push(`<div class="mt-4 rounded-2xl border border-rose-300/30 bg-rose-200/10 px-4 py-6 text-center text-xs text-rose-200">${ssrInterpolate(galleryError.value || "読み込みできませんでした")}</div>`);
      } else if (slideshowItems.value.length) {
        _push(`<div class="mt-4"><div class="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20 bg-black/40"><!--[-->`);
        ssrRenderList(slideshowItems.value, (item, idx) => {
          _push(`<div class="${ssrRenderClass([idx === currentSlide.value ? "opacity-100" : "opacity-0", "absolute inset-0 transition-opacity duration-700 ease-out"])}"><img${ssrRenderAttr("src", item.url)}${ssrRenderAttr("alt", `Shared photo ${idx + 1}`)} class="h-full w-full object-cover" loading="lazy" decoding="async"></div>`);
        });
        _push(`<!--]--><button type="button" class="absolute inset-0" aria-label="次の写真"></button><div class="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] text-white/70">${ssrInterpolate(currentSlide.value + 1)} / ${ssrInterpolate(slideshowItems.value.length)}</div></div><p class="mt-3 text-[10px] text-white/60">タップで次の写真へ</p></div>`);
      } else {
        _push(`<div class="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-xs text-white/60"> まだ写真がありません。送ってくれた写真がここに表示されます。 </div>`);
      }
      _push(`<p class="mt-3 text-[10px] text-white/55">動画は保存されますが、スライドショーには表示されません。</p></div></div>`);
      if (hasBackupLink.value) {
        _push(`<div class="luxe-card"><div class="luxe-card__inner"><p class="text-xs uppercase tracking-[0.3em] text-white/80">Backup Link</p><p class="mt-3 text-xs text-white/75">送信がうまくいかない場合はこちら</p><a${ssrRenderAttr("href", photo.value.linkUrl)} target="_blank" rel="noopener noreferrer" class="btn-secondary btn-sm mt-4 w-full justify-center">${ssrInterpolate(photo.value.linkLabel || "リンクを開く")}</a></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/photos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=photos-D9scwLEK.mjs.map
