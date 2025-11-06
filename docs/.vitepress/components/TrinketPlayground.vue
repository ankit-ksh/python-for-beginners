<template>
  <div>
    <div v-if="open" class="pg__overlay" @click.self="close">
      <div class="pg__panel" role="dialog" aria-modal="true" :aria-label="title">
        <div class="pg__top">
          <span class="pg__topTitle">{{ title }}</span>
          <div class="pg__actions">
            <a class="pg__btn pg__btn--ghost" :href="src" target="_blank" rel="noopener">Open in Trinket</a>
            <button class="pg__btn pg__btn--ghost" @click="close" aria-label="Close">Close</button>
          </div>
        </div>
        <div class="pg__bodySolo">
          <iframe
            ref="frame"
            class="pg__iframe"
            :src="src"
            title="Trinket Playground"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{ title?: string; src?: string }>(), {
  title: 'Playground (Experimental)',
  src: 'https://trinket.io/embed/python3?start=result'
})

const open = ref(false)
const frame = ref<HTMLIFrameElement | null>(null)

// Keyboard: Escape closes
const onKey = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

function close() {
  open.value = false
}

// Expose controls to open/close programmatically
defineExpose({
  openOverlay: () => (open.value = true),
  closeOverlay: () => close()
})

// Scroll lock
let __prevOverflow = ''
let __prevPaddingRight = ''
let __scrollLocked = false
function lockBodyScroll() {
  if (typeof document === 'undefined' || __scrollLocked) return
  const body = document.body
  const docEl = document.documentElement
  const scrollBarWidth = window.innerWidth - docEl.clientWidth
  __prevOverflow = body.style.overflow
  __prevPaddingRight = body.style.paddingRight
  if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`
  body.style.overflow = 'hidden'
  __scrollLocked = true
}
function unlockBodyScroll() {
  if (typeof document === 'undefined' || !__scrollLocked) return
  const body = document.body
  body.style.overflow = __prevOverflow
  body.style.paddingRight = __prevPaddingRight
  __scrollLocked = false
}

watch(open, (val) => {
  if (val) lockBodyScroll()
  else unlockBodyScroll()
})

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  unlockBodyScroll()
})
</script>

<style scoped>
.pg__overlay { position: fixed; inset: 0; background: rgba(0,0,0,.38); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); display:flex; align-items:center; justify-content:center; z-index: 9999; padding: 16px; overscroll-behavior: contain; }
.pg__panel { width: min(1200px, 96vw); height: min(80vh, 900px); background: #ffffff; color:#0b1020; border:1px solid rgba(0,0,0,.08); border-radius:12px; box-shadow: 0 20px 60px rgba(0,0,0,.35); display:flex; flex-direction:column; overflow:hidden; }
.pg__top { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid rgba(0,0,0,.06); background: linear-gradient(180deg, rgba(148,163,184,.14), rgba(148,163,184,.04)); }
.pg__topTitle { font-weight:800; letter-spacing:.01em; }
.pg__actions { display:flex; align-items:center; gap:8px; }
.pg__btn { border:none; cursor:pointer; font-weight:700; border-radius:8px; transition: all .15s ease; }
.pg__btn--ghost { background: transparent; color:#334155; padding:6px 10px; border:1px solid rgba(0,0,0,.08); }
.pg__btn--ghost:hover { background: rgba(0,0,0,.03); }

.pg__bodySolo { flex:1; display:flex; min-height:0; }
.pg__iframe { width:100%; height:100%; border:0; background:#0b1020; }

@media (prefers-color-scheme: dark){
  .pg__panel { background:#0f172a; color:#e5e7eb; border-color: rgba(148,163,184,.24); box-shadow: 0 20px 80px rgba(0,0,0,.6); }
  .pg__top { border-bottom-color: rgba(148,163,184,.2); background: linear-gradient(180deg, rgba(2,6,23,.7), rgba(2,6,23,.35)); }
  .pg__btn--ghost { color:#e5e7eb; border-color: rgba(148,163,184,.24); }
  .pg__btn--ghost:hover { background: rgba(255,255,255,.04); }
}
</style>
