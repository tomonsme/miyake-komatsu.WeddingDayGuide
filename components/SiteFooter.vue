<template>
  <footer class="mt-12 border-t border-[#DCC08E]/30 bg-gradient-to-b from-[#0E1828] to-[#111E33]">
    <div class="mx-auto max-w-screen-lg px-6 py-3">
      <div class="mb-2 flex flex-col items-center">
        <span class="block h-px w-12 bg-[#DCC08E]/50"></span>
      </div>
      
      <div class="grid gap-3 text-center">
        <div class="max-w-prose mx-auto md:mx-0">
          <h3 class="font-display text-base tracking-wide text-white">Wedding Day</h3>
          <LeafDivider />
          <p class="mt-2 text-[13px] leading-relaxed text-white/80">本日はご来場ありがとうございます</p>
        </div>
      </div>
      <div class="mt-3 text-center text-[11px] text-white/40 tracking-wide">
        <p>&copy; {{ new Date().getFullYear() }} Wedding Day</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LeafDivider from './LeafDivider.vue'
</script>
