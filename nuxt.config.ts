import { withBase } from 'ufo'

// https://nuxt.com/docs/api/configuration/nuxt-config
const nitroPreset = process.env.NITRO_PRESET || (process.env.NETLIFY ? 'netlify' : '')
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Ensure file-based routing is enabled
  pages: true,
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/seo', '@vueuse/motion/nuxt'],
  runtimeConfig: {
    s3Region: '',
    s3Bucket: '',
    s3Prefix: '',
    s3PublicBaseUrl: '',
    s3AccessKeyId: '',
    s3SecretAccessKey: '',
    s3SessionToken: ''
  },
  // components path stays relative to project root
  components: [{ path: './components', pathPrefix: false }],
  css: ['~/assets/css/tailwind.css'],
  nitro: nitroPreset ? { preset: nitroPreset } : {},
  app: {
    baseURL: appBaseURL,
    head: {
      title: 'Wedding Day Seating',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Wedding day guide and seating chart for {{COUPLE}}.' },
        { property: 'og:title', content: 'Wedding Day Seating for {{COUPLE}}' },
        {
          property: 'og:description',
          content: 'Seating chart and timeline for {{COUPLE}} at {{VENUE_NAME}} on {{DATE_ISO}}.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#BDA06A' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: 'any', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'icon', type: 'image/x-icon', href: withBase('/shared/favicon.ico?v=5', appBaseURL) },
        { rel: 'shortcut icon', href: withBase('/shared/favicon.ico?v=5', appBaseURL) },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'icon', type: 'image/png', sizes: '1024x1024', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'apple-touch-icon', sizes: '180x180', href: withBase('/shared/favicon.png?v=5', appBaseURL) },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Preload stylesheet to speed up first render
        {
          rel: 'preload', as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&family=Noto+Serif+JP:wght@400;600;700&display=swap',
          onload: "this.onload=null;this.rel='stylesheet'"
        },
        {
          rel: 'stylesheet',
          // Display: Playfair/Cormorant (Latin). Body/JP: Noto Serif JP
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&family=Noto+Serif+JP:wght@400;600;700&display=swap'
        }
      ]
    }
  },
  routeRules: process.env.NODE_ENV === 'production'
    ? {
        '/api/event': { swr: false },
        '/api/photos': { swr: false },
        '/api/photos/**': { swr: false },
        '/api/leaderboard': { swr: false },
        '/api/leaderboard/**': { swr: false },
        '/**': { swr: true }
      }
    : {},
  image: {
    domains: ['www.aladdinx.jp'],
    screens: {
      xs: 320,
      sm: 360,
      md: 390,
      lg: 430,
      xl: 480,
      '2xl': 640
    },
    presets: {
      hero: {
        // Revert to JPG to ensure compatibility with local static images
        modifiers: { fit: 'cover', format: 'jpg', quality: 76 }
      },
      story: {
        modifiers: { fit: 'cover', format: 'webp', quality: 65 }
      },
      storyContain: {
        modifiers: { fit: 'contain', format: 'webp', background: 'transparent', quality: 68 }
      },
      album: {
        modifiers: { fit: 'cover', format: 'webp', quality: 68 }
      },
      avatar: {
        modifiers: { fit: 'cover', format: 'webp', quality: 75 }
      },
      icon: {
        modifiers: { fit: 'cover', format: 'png', quality: 80 }
      },
      gallery: {
        modifiers: { fit: 'cover', format: 'webp', quality: 70 }
      }
    }
  }
})
