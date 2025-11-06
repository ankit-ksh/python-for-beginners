<template>
  <!-- Renders nothing in the page flow; mounts global playground overlays -->
  <PyPlayground ref="pg" title="Python Playground" :show-bar="false" :prefetch="false" />
  <TrinketPlayground ref="tpg" title="Playground (Experimental)" />
  <!-- No visible output in normal DOM flow -->
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import PyPlayground from './PyPlayground.vue'
import TrinketPlayground from './TrinketPlayground.vue'

const pg = ref<InstanceType<typeof PyPlayground> | null>(null)
const tpg = ref<InstanceType<typeof TrinketPlayground> | null>(null)

function maybeOpenFromEvent(e: Event) {
  const target = e.target as HTMLElement | null
  if (!target) return
  const a = target.closest('a') as HTMLAnchorElement | null
  if (!a) return
  // Robustly detect any anchor whose hash equals #playground regardless of absolute/relative href
  let isPlayground = false
  let isExperimental = false
  try {
    const url = new URL(a.href, location.href)
    isPlayground = url.hash === '#playground'
    isExperimental = url.hash === '#playground-experimental'
  } catch {
    const href = a.getAttribute('href') || ''
    isPlayground = href.endsWith('#playground') || href === '#playground'
    isExperimental = href.endsWith('#playground-experimental') || href === '#playground-experimental'
  }
  if (isPlayground || isExperimental) {
    // prevent any navigation or hash changes
    e.preventDefault()
    if ('stopImmediatePropagation' in e && typeof (e as any).stopImmediatePropagation === 'function') {
      ;(e as any).stopImmediatePropagation()
    }
    e.stopPropagation()
    if (isPlayground) pg.value?.openOverlay?.()
    else tpg.value?.openOverlay?.()
  }
}

onMounted(() => {
  document.addEventListener('click', maybeOpenFromEvent, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', maybeOpenFromEvent, true)
})
</script>

<style scoped>
/* no visible host styles */
</style>
