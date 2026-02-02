export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'invite',
    (to) => {
      const { public: publicConfig } = useRuntimeConfig()
      if (!publicConfig.inviteAccessEnabled) return
      if (to.path === '/access') return

      const inviteKey = useCookie<string | null>('invite_key')
      if (!inviteKey.value) {
        return navigateTo(`/access?to=${encodeURIComponent(to.fullPath)}`)
      }
    },
    { global: true }
  )
})
