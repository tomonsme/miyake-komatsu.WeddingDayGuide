<template>
  <main class="bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 md:pt-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Thanks</p>
          <h1 class="mt-2 font-display text-3xl text-gold">三宅家で導入して良かったもの</h1>
          <p class="mt-2 text-sm text-white/85">独断と偏見ランキング</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center whitespace-nowrap home-back-btn">ホームへ戻る</NuxtLink>
      </div>

      <p class="text-sm leading-relaxed text-white/70">
        引っ越してから今日までのベストバイを勝手に紹介します 
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
                <NuxtImg
                  :src="item.image"
                  :alt="item.imageAlt"
                  class="h-full w-full object-cover transition duration-200"
                  width="720"
                  height="540"
                  sizes="xs:92vw sm:90vw md:88vw lg:86vw xl:84vw 2xl:640px"
                  preset="album"
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
                <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/70">{{ item.story }}</p>
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
    title: 'カービィプロコン',
    catch: 'ともやからのクリスマスプレゼント！',
    story: '楽しみにしてたぷよテト 全然勝てなくて拗ねそう',
    points: [],
    image: '/pages/thanks/3note.jpg',
    imageAlt: 'カービィプロコン',
    linkUrl: 'https://www.amazon.co.jp/%E3%80%90%E4%BB%BB%E5%A4%A9%E5%A0%82%E3%83%A9%E3%82%A4%E3%82%BB%E3%83%B3%E3%82%B9%E5%95%86%E5%93%81%E3%80%91PowerA-%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9%E3%83%BC-Nintendo-Switch-2%E5%B9%B4%E4%BF%9D%E8%A8%BC%E3%80%91NSGP0348JP-01/dp/B0DHCCN7YQ/ref=asc_df_B0DHCCN7YQ?mcid=faadce7ae017341eb459a525bf3037a5&th=1&tag=jpgo-22&linkCode=df0&hvadid=707565314537&hvpos=&hvnetw=g&hvrand=4265257877264297499&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1009561&hvtargid=pla-2366208117571&hvocijid=4265257877264297499-B0DHCCN7YQ-&hvexpln=0',
    linkLabel: 'リンクを見る'
  },
  {
    rank: 2,
    title: 'ポップインアラジン',
    catch: 'テレビ廃止して寝室に導入 ',
    story: '休日ベッドでビール飲みながらサッカー見れるの最高！\nあんま勝たへんけど(´･_･`)',
    points: [],
    image: 'https://www.aladdinx.jp/cdn/shop/files/OGP_3e75dbdc-eba4-48e7-9ea3-33309dc1c1c0.jpg?v=1670815010',
    imageAlt: 'Aladdin X2 Plus',
    linkUrl: 'https://www.aladdinx.jp/pages/aladdin-x2-plus',
    linkLabel: 'リンクを見る'
  },
  {
    rank: 1,
    title: '炎舞炊き',
    catch: '三宅家のお米を炊けば至高のうまさ ',
    story: '甘みがすんごい QOL爆上がりです！！',
    points: [],
    image: '/pages/thanks/202088.jpg',
    imageAlt: '炎舞炊き',
    linkUrl: 'https://www.zojirushi.co.jp/syohin/rice/ricecooker/nw-na/#container',
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
