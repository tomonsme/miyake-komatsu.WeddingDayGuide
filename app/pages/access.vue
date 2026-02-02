<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-md px-4 py-16 sm:py-20">
      <div class="luxe-card">
        <div class="luxe-card__inner">
          <p class="text-xs uppercase tracking-[0.3em] text-white/80">Access</p>
          <h1 class="mt-2 font-display text-3xl text-gold">アクセスコード</h1>
          <p class="mt-2 text-sm text-white/70">招待状に記載のコードを入力してください</p>

          <form class="mt-6 grid gap-3" @submit.prevent="submit">
            <label for="access-key" class="text-[10px] uppercase tracking-[0.28em] text-white/60">Code</label>
            <input
              id="access-key"
              v-model="accessKey"
              type="password"
              autocomplete="one-time-code"
              placeholder="例）1234"
              class="mt-1 w-full rounded-2xl border border-gold/30 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
            <button
              type="submit"
              class="btn-gold btn-sm w-full justify-center"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '確認中...' : '入る' }}
            </button>
          </form>

          <p v-if="error" class="mt-3 text-xs text-rose-200">{{ error }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const route = useRoute()
const accessKey = ref('')
const error = ref('')
const isSubmitting = ref(false)
const redirectTo = computed(() => (typeof route.query.to === 'string' ? route.query.to : '/'))

const inviteCookie = useCookie<string | null>('invite_key', {
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
  sameSite: 'lax'
})

const submit = async () => {
  const trimmed = accessKey.value.trim()
  if (!trimmed) {
    error.value = 'アクセスコードを入力してください'
    return
  }
  isSubmitting.value = true
  error.value = ''
  inviteCookie.value = trimmed
  try {
    await $fetch('/api/event', { headers: { 'x-invite-key': trimmed } })
    await navigateTo(redirectTo.value || '/')
  } catch (err) {
    inviteCookie.value = null
    error.value = 'アクセスコードが違います'
  } finally {
    isSubmitting.value = false
  }
}
</script>
