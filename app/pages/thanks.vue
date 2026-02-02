<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Thanks</p>
          <h1 class="mt-2 font-display text-3xl text-gold">三宅家で導入して良かったもの</h1>
          <p class="mt-2 text-sm text-white/85">独断と偏見ランキング</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center whitespace-nowrap">ホームへ戻る</NuxtLink>
      </div>

      <p class="text-sm leading-relaxed text-white/70">
        引っ越してから今日までのベストバイを勝手に紹介します。
      </p>

      <div class="mt-6 grid gap-5">
        <article v-for="item in rankingItems" :key="item.rank" class="luxe-card">
          <div class="luxe-card__inner">
            <div class="grid gap-4 md:grid-cols-[240px_1fr] md:items-center">
              <div class="text-lg font-black tracking-[0.24em] text-white/85" style="font-weight: 800;">第{{ item.rank }}位</div>
              <a
                :href="item.linkUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30 md:aspect-auto md:h-full"
                :aria-label="`${item.title}のリンクへ移動`"
              >
                <img
                  :src="item.image"
                  :alt="item.imageAlt"
                  class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <div>
                <h2 class="mt-1 font-display text-2xl text-gold">
                  <span v-if="item.titleLines" v-for="(line, lineIdx) in item.titleLines" :key="`${item.rank}-title-${lineIdx}`" class="block">
                    {{ line }}
                  </span>
                  <span v-else>{{ item.title }}</span>
                </h2>
                <p class="mt-2 text-sm text-white/85">{{ item.catch }}</p>
                <p class="mt-3 text-sm leading-relaxed text-white/70">{{ item.story }}</p>
                <div class="mt-3 grid gap-2 text-xs text-white/70">
                  <p v-for="(point, idx) in item.points" :key="`${item.rank}-pt-${idx}`" class="flex items-start gap-2">
                    <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-gold/70"></span>
                    <span>{{ point }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const rankingItems = [
  {
    rank: 3,
    title: 'ワイヤレスコントローラー for Nintendo Switch',
    titleLines: ['ワイヤレスコントローラー', 'for Nintendo Switch'],
    catch: '吸い込み力でテンションも勝率もアップ。',
    story: '誰かが握った瞬間、コントローラー争奪戦の火ぶたが切られる。',
    points: ['ボタンの押し心地が気持ち良すぎて交代拒否が発生。', '見た目が可愛すぎて気分だけでも勝利。'],
    image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/My%20Nintendo%20Store/EN-US/Nintendo%20Switch%20Accessories/Controllers/wireless-controller-for-nintendo-switch-kirby-120745/120745-powera-wireless-controller-kirby-front-1200x675',
    imageAlt: 'Kirby wireless controller',
    linkUrl: 'https://www.nintendo.com/us/store/products/wireless-controller-for-nintendo-switch-kirby-120745/',
    linkLabel: 'リンクを見る'
  },
  {
    rank: 2,
    title: 'popIn Aladdin 2',
    catch: '天井から映画が降ってくる、家が一瞬でシアター化。',
    story: '壁がスクリーンになった瞬間、帰宅のテンションが上がりすぎる。',
    points: ['配線がすっきりで生活感が減る。', 'リモコン一発で映画館スイッチ。'],
    image: 'https://www.aladdinx.jp/cdn/shop/articles/2020-04-28_13.30.20_32d7519f-bd1a-4469-b0e4-dd731fd314cd.png?v=1588048285',
    imageAlt: 'popIn Aladdin',
    linkUrl: 'https://www.aladdinx.jp/blogs/news/popin-aladdin-2',
    linkLabel: 'リンクを見る'
  },
  {
    rank: 1,
    title: '象印 炎舞炊き',
    catch: '炊き上がりで食卓が本番モードに突入。',
    story: '香りに呼ばれて家族が集合、無言でおかわりが始まる。',
    points: ['お米が主役になって、おかずが脇役になる。', '冷めても美味しくて翌日もテンション維持。'],
    image: 'https://www.zojirushi.co.jp/syohin/rice/ricecooker/enbudaki/img/ogp_enbudaki.png',
    imageAlt: '炎舞炊き',
    linkUrl: 'https://www.zojirushi.co.jp/syohin/rice/ricecooker/enbudaki/',
    linkLabel: 'リンクを見る'
  }
]

const { displayCouple } = useEventData()

useHead(() => {
  const pageTitle = `Thanks | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '三宅家で導入して良かったものランキング' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
