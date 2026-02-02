import { d as defineEventHandler, u as useRuntimeConfig, g as getCookie, a as getHeader, c as createError } from '../../nitro/nitro.mjs';
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

const eventConfig = {
  couple: "Tomoya & Mihono",
  eventDateIso: "2026-02-07",
  venueName: "\u30B6\u30FB\u30EA\u30C3\u30C4\u30FB\u30AB\u30FC\u30EB\u30C8\u30F3\u5927\u962A",
  monogramUrl: "/shared/favicon.png",
  seating: {
    tables: [
      {
        name: "A",
        seats: [
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u77F3\u539F \u5927\u4E45" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u4E2D\u897F \u8CB4\u4E4B" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u5C0F\u6FF1 \u76F4\u5927" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u51FA\u4E95 \u53EF\u5948\u5B50" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u5C71\u5D0E \u4FEE\u5E73" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u6839\u672C \u535A\u5B88" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u52A0\u85E4 \u745E\u8CB4" },
          { role: "\u65B0\u90CE\u65B0\u5A66\u53CB\u4EBA", name: "\u677E\u4E95 \u7406\u7D17" }
        ]
      },
      {
        name: "B",
        seats: [
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u5317\u5206 \u53CB\u8CB4" },
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u677E\u672C \u611B\u6D0B" },
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u718A\u8C37 \u5C06\u5E73" },
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u570B\u672C \u99FF" },
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u9AD8\u7956 \u5927\u5730" },
          { role: "\u65B0\u90CE\u53CB\u4EBA", name: "\u85E4\u539F \u5E79\u592A" }
        ]
      },
      {
        name: "C",
        seats: [
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u4F50\u91CE \u4E03\u6D77" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u5CA1\u7530 \u745E\u7A42" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u5C71\u7530 \u7F8E\u6C99\u7D00" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u9999\u53D6 \u7F8E\u679C" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u4E0A\u7530 \u8309\u8389\u5B50" }
        ]
      },
      {
        name: "D",
        seats: [
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u5409\u677E \u7DB8\u5B50" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u6C60\u7530 \u3042\u308A\u3055" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u5800\u5834 \u82BD\u8863" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u5B89\u7530 \u606D\u5B50" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u4F0A\u85E4 \u3042\u304B\u308A" }
        ]
      },
      {
        name: "E",
        seats: [
          { role: "\u65B0\u90CE\u4F2F\u7236", name: "\u4E09\u5B85 \u4E00\u4E5F" },
          { role: "\u65B0\u90CE\u4F2F\u6BCD", name: "\u4E09\u5B85 \u4FCA\u6075" },
          { role: "\u65B0\u90CE\u6BCD", name: "\u4E09\u5B85 \u4E00\u6075", suffix: "" },
          { role: "\u65B0\u90CE\u4F2F\u7236", name: "\u4E09\u5B85 \u5F18" },
          { role: "\u65B0\u90CE\u7236", name: "\u4E09\u5B85 \u6BC5", suffix: "" }
        ]
      },
      {
        name: "F",
        seats: [
          { role: "\u65B0\u90CE\u53D4\u6BCD", name: "\u6797 \u7F8E\u6075" },
          { role: "\u65B0\u90CE\u5F93\u59B9", name: "\u6797 \u91CC\u54B2" },
          { role: "\u65B0\u90CE\u59C9", name: "\u4E09\u5B85 \u91CC\u7A42", suffix: "" },
          { role: "\u65B0\u90CE\u7FA9\u5144", name: "\u4E09\u5B85 \u96C5\u5927", suffix: "" },
          { role: "\u65B0\u90CE\u7525", name: "\u4E09\u5B85 \u5FEB\u7406", suffix: "\u304F\u3093" },
          { role: "\u65B0\u90CE\u59EA", name: "\u4E09\u5B85 \u67DA", suffix: "\u3061\u3083\u3093" }
        ]
      },
      {
        name: "G",
        seats: [
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u677E\u6FA4 \u91CC\u5948" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u674E \u793C\u771F" },
          { role: "\u65B0\u5A66\u53CB\u4EBA", name: "\u6C60\u7530 \u963F\u4F51\u7F8E" }
        ]
      },
      {
        name: "H",
        leftCount: 3,
        seats: [
          { role: "\u65B0\u5A66\u53D4\u7236", name: "\u6CB3\u6751 \u8CE2\u6CBB" },
          { role: "\u65B0\u5A66\u53D4\u6BCD", name: "\u6CB3\u6751 \u5CF0\u5B50" },
          { role: "\u65B0\u5A66\u7236", name: "\u5C0F\u677E \u5FE0\u96C4", suffix: "" },
          { role: "\u65B0\u5A66\u5F93\u59B9", name: "\u6CB3\u6751 \u6731\u97F3" },
          { role: "\u65B0\u5A66\u5F93\u59B9", name: "\u6CB3\u6751 \u771F\u8863" },
          { role: "\u65B0\u5A66\u7956\u6BCD", name: "\u6CB3\u6751 \u8C4A\u5B50" },
          { role: "\u65B0\u5A66\u6BCD", name: "\u5C0F\u677E \u4EAC\u5B50", suffix: "" }
        ]
      }
    ]
  },
  notes: [
    { title: "\u5199\u771F\u64AE\u5F71", body: "\u5199\u771F\u3082\u52D5\u753B\u3082\u305F\u304F\u3055\u3093\u64AE\u3063\u3066\u304F\u3060\u3055\u3044 \u3042\u3068\u3067\u9001\u3063\u3066\u3082\u3089\u3048\u308B\u3068\u5B09\u3057\u3044\u3067\u3059" },
    { title: "\u304A\u98DF\u4E8B", body: "\u3044\u3063\u3071\u3044\u98DF\u3079\u3066\u3044\u3063\u3071\u3044\u98F2\u3093\u3067\u304F\u3060\u3055\u3044 \u8FF7\u3063\u305F\u3089\u597D\u304D\u306A\u3082\u306E\u304B\u3089\u3069\u3046\u305E" },
    { title: "\u304A\u5E2D", body: "\u5E2D\u6B21\u8868\u3067\u304A\u5E2D\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044 \u8FF7\u3063\u305F\u3089\u30B9\u30BF\u30C3\u30D5\u306B\u58F0\u304B\u3051\u3066\u306D" },
    { title: "\u55AB\u7159", body: "\u55AB\u7159\u306F\u6C7A\u307E\u3063\u305F\u5834\u6240\u3067\u304A\u9858\u3044\u3057\u307E\u3059 \u4F1A\u5834\u5185\u306F\u7981\u7159\u3067\u3059" }
  ],
  photoShare: {
    title: "\u5199\u771F\u5171\u6709",
    subtitle: "\u64AE\u5F71\u3057\u305F\u5199\u771F\u3092\u304A\u9001\u308A\u3044\u305F\u3060\u3051\u308B\u3068\u5B09\u3057\u3044\u3067\u3059"
  },
  profile: {
    groom: { name: "\u4E09\u5B85 \u667A\u4E5F", image: "/pages/profile/groom.JPG" },
    bride: { name: "\u5C0F\u677E \u7F8E\u7A42\u4E43", image: "/pages/profile/bride.JPG" },
    rows: [
      { label: "\u751F\u5E74\u6708\u65E5", left: "1997.9.3", right: "1995.5.12" },
      { label: "\u8840\u6DB2\u578B", left: "A\u578B", right: "AB\u578B" },
      { label: "\u51FA\u8EAB\u5730", left: "\u5CA1\u5C71\u770C \u7389\u91CE\u5E02", right: "\u5343\u8449\u770C \u5343\u8449\u5E02" },
      { label: "\u6027\u683C", left: "\u304A\u304A\u3050\u3089\u3044", right: ["\u307E\u3051\u305A\u304E\u3089\u3044", "\u203B\u30C9\u30E9\u30AF\u30A83\u3088\u308A"] },
      { label: "\u7279\u6280", left: ["10\u6642\u9593\u7761\u7720", "(\u6BCE\u65E5)"], right: "\u304A\u3084\u3059\u307F3\u79D2" },
      { label: "\u597D\u304D\u306A\u98DF\u3079\u7269", left: ["\u305F\u307E\u3054 \u304D\u304F\u3089\u3052 ", "\u30BF\u30EB\u30C8"], right: "\u30B1\u30FC\u30AD" },
      { label: "\u5F97\u610F\u6599\u7406", left: ["\u304A\u597D\u307F\u713C\u304D", "(\u30D0\u30A4\u30C8\u3057\u3066\u305F)"], right: "\u30D1\u30B9\u30BF\u304B\u306A..." },
      { label: "\u7B2C\u4E00\u5370\u8C61", left: ["\u7814\u4FEE\u4E2D", "\u30D8\u30C9\u30D0\u30F3\u3057\u3066\u308B\u4EBA"], right: ["\u5927\u304D\u3044", "\u304F\u307E\u306E\u306C\u3044\u3050\u308B\u307F"] },
      { label: "\u76F8\u624B\u306E\u597D\u304D\u306A\u3068\u3053\u308D", left: "\u82AF\u304C\u3042\u308B", right: ["\u3068\u306B\u304B\u304F\u512A\u3057\u3044", "\u3088\u304F\u7B11\u3046"] },
      { label: "\u3044\u3064\u304B\u4E00\u7DD2\u306B\u3057\u305F\u3044\u3053\u3068", left: ["\u4E16\u754C\u4E00\u5468", "(\u30D5\u30A7\u30EA\u30FC\u306FNG\u3089\u3057\u3044)"], right: ["\u30A4\u30F3\u30C9\u3067\u30AB\u30EC\u30FC\u98DF\u3079\u308B", "\u7DBA\u9E97\u306A\u661F\u3092\u898B\u308B"] }
    ]
  },
  message: {
    lines: [
      "\u672C\u65E5\u306F\u3054\u591A\u7528\u306E\u3068\u3053\u308D\u304A\u8D8A\u3057\u304F\u3060\u3055\u308A",
      "\u8AA0\u306B\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059",
      "",
      "\u3053\u306E\u65E5\u3092\u8FCE\u3048\u3089\u308C\u307E\u3057\u305F\u306E\u3082",
      "\u3072\u3068\u3048\u306B\u7686\u69D8\u306E\u304A\u529B\u6DFB\u3048\u306E\u304A\u304B\u3052\u3067\u3042\u308A",
      "\u5FC3\u3088\u308A\u5FA1\u793C\u7533\u3057\u4E0A\u3052\u307E\u3059",
      "",
      "\u672A\u719F\u306A\u3075\u305F\u308A\u3067\u3059\u304C \u624B\u3092\u53D6\u308A\u5408\u3044",
      "\u5171\u306B\u6B69\u3093\u3067\u3044\u304D\u305F\u3044\u3068\u601D\u3044\u307E\u3059",
      "",
      "\u4ECA\u5F8C\u3068\u3082\u672B\u6C38\u3044\u3054\u6307\u5C0E\u3068\u304A\u4ED8\u304D\u5408\u3044\u306E\u307B\u3069",
      "\u4F55\u5352\u3088\u308D\u3057\u304F\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059",
      "",
      "\u3055\u3055\u3084\u304B\u3067\u306F\u3054\u3056\u3044\u307E\u3059\u304C",
      "\u697D\u3057\u3044\u3072\u3068\u3068\u304D\u3092\u304A\u904E\u3054\u3057\u304F\u3060\u3055\u3044"
    ],
    date: "2026\u5E742\u67087\u65E5",
    signature: "\u4E09\u5B85 \u667A\u4E5F\u30FB\u7F8E\u7A42\u4E43"
  },
  storyboard: [
    { id: "seating", label: "Seating", title: "\u5E2D\u6B21\u8868", subtitle: "\u5E2D\u6B21\u8868\u306E\u78BA\u8A8D", image: "/pages/seating/ritz-lounge.JPG", to: "/seating" },
    { id: "notes", label: "Notes", title: "\u304A\u9858\u3044", subtitle: "\u5F53\u65E5\u306E\u3054\u6CE8\u610F", image: "/pages/notes/story-2.jpg", to: "/notes" },
    { id: "profile", label: "Profile", title: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB", subtitle: "\u65B0\u90CE\u65B0\u5A66\u306E\u3054\u7D39\u4ECB", image: "/pages/profile/two.JPG", to: "/profile" },
    { id: "message", label: "Message", title: "\u30E1\u30C3\u30BB\u30FC\u30B8", subtitle: "\u3054\u6328\u62F6", image: "/pages/message/IMG_5206.jpg", to: "/message" },
    { id: "fav-1", label: "Favorites", title: "\u63A8\u3057\u306E\u5199\u771F\u2460", subtitle: "Tomoya", image: "/pages/favorites-1/201579_0.jpg", to: "/favorites-1" },
    { id: "fav-2", label: "Favorites", title: "\u63A8\u3057\u306E\u5199\u771F\u2461", subtitle: "Mihono", image: "/pages/favorites-2/IMG_8799.jpg", to: "/favorites-2" },
    { id: "photos", label: "Photos", title: "\u5199\u771F\u5171\u6709", subtitle: "\u64AE\u5F71\u3057\u305F\u5199\u771F\u3092\u9001\u308B", image: "/pages/photos/story-4.jpg", to: "/photos" },
    { id: "guide", label: "Extras", title: "\uFF1F", subtitle: "\u304A\u697D\u3057\u307F\u30B3\u30FC\u30CA\u30FC", image: "/pages/guide/night-1.jpg", to: "/guide" },
    { id: "thanks", label: "Thanks", title: "\uFF1F", subtitle: "\u6E96\u5099\u4E2D", image: "/pages/thanks/IMG_4922.jpg" }
  ]
};

const event_get = defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const requiredKey = String(config.inviteAccessKey || "").trim();
  if (requiredKey) {
    const cookieKey = String(getCookie(event, "invite_key") || "").trim();
    const headerKey = String(getHeader(event, "x-invite-key") || "").trim();
    const provided = cookieKey || headerKey;
    if (!provided || provided !== requiredKey) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
  }
  return eventConfig;
});

export { event_get as default };
//# sourceMappingURL=event.get.mjs.map
