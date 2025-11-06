<template>
  <div class="pg">
    <div v-if="showBar" class="pg__bar">
      <span class="pg__title">{{ title }}</span>
      <button class="pg__open" @click="open = true">Open Editor</button>
    </div>

    <div v-if="open" class="pg__overlay" @click.self="open = false">
      <div class="pg__panel" role="dialog" aria-modal="true" :aria-label="title">
        <div class="pg__top">
          <span class="pg__topTitle">{{ title }}</span>
          <div class="pg__center">
            <button class="pg__runMain" @click="runCode" :disabled="loading" aria-label="Run code" title="Run (Ctrl+Enter)">
              <svg class="pg__runIcon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
              <span>{{ loading ? 'Running…' : 'Run' }}</span>
            </button>
          </div>
          <div class="pg__actions">
            <button class="pg__btn pg__btn--ghost" @click="resetCode" :disabled="loading">Reset</button>
            <button class="pg__btn pg__btn--ghost" @click="open = false" aria-label="Close">Close</button>
          </div>
        </div>
        <div class="pg__body">
          <div class="pg__left">
            <div class="pg__inHead">
              <span class="pg__label">Code</span>
            </div>
            <textarea
              v-model="code"
              class="pg__ta"
              spellcheck="false"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
            ></textarea>
          </div>
          <div class="pg__right">
            <div class="pg__outHead">
              <span class="pg__label">Output</span>
              <span v-if="meta" class="pg__meta">{{ meta }}</span>
            </div>
            <pre v-if="error" class="pg__err">{{ error }}</pre>
            <pre v-else class="pg__out" :class="{ 'pg__out--empty': !output }">{{ output || 'No output yet' }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{ title?: string; code?: string; showBar?: boolean; prefetch?: boolean }>(), {
  title: 'Python Playground',
  code: '',
  showBar: true,
  prefetch: false
})

const open = ref(false)
const code = ref(props.code)
const output = ref('')
const error = ref('')
const loading = ref(false)
const meta = ref('')

declare global { interface Window { loadPyodide?: any; __pyodidePromise?: Promise<any> } }
// Keep track of the element that had focus before opening the overlay
let __prevActiveEl: HTMLElement | null = null

// Keyboard shortcuts when overlay is open:
// - Ctrl/Cmd + Enter to run
// - Escape to close
const onKey = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (!loading.value) runCode()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
  }
}

async function getPyodide() {
  if (!window.__pyodidePromise) {
    window.__pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load Pyodide'))
          document.head.appendChild(s)
        })
      }
      const pyodide = await window.loadPyodide?.({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' })
      return pyodide
    })()
  }
  return window.__pyodidePromise!
}

async function runCode() {
  loading.value = true
  output.value = ''
  error.value = ''
  meta.value = ''
  try {
    if (!window.__pyodidePromise) {
      meta.value = 'Initializing Python runtime…'
    }
    const pyodide = await getPyodide()
    const t0 = performance.now()
    const py = `import sys, io\n_sys = sys.stdout\nsys.stdout = io.StringIO()\ntry:\n${code.value.split('\n').map(l=>'    '+l).join('\n')}\n    _o = sys.stdout.getvalue()\nfinally:\n    sys.stdout = _sys\n_o`
    const result = await pyodide.runPythonAsync(py)
    output.value = String(result ?? '')
    meta.value = `Ran in ${Math.max(0, Math.round(performance.now()-t0))} ms`
  } catch (e:any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

function resetCode() {
  code.value = props.code || ''
  output.value = ''
  error.value = ''
  meta.value = ''
}

// expose programmatic controls so a global nav button can toggle it
defineExpose({
  openOverlay: () => (open.value = true),
  closeOverlay: () => (open.value = false)
})

// Preload Pyodide to reduce first-run delay:
// - When the overlay is opened, start loading immediately
// - Also attempt an idle-time prefetch after mount
watch(open, (val) => {
  if (val && !window.__pyodidePromise) {
    meta.value = 'Loading Python runtime…'
    // Fire and forget
    getPyodide().then(() => {
      if (open.value) meta.value = 'Runtime ready'
    }).catch(() => {
      if (open.value) meta.value = 'Failed to load runtime'
    })
  }
  // Lock or unlock background page scroll when overlay toggles
  if (val) lockBodyScroll()
  else unlockBodyScroll()
  // Capture the previously focused element when opening; on close, blur it to avoid focus ring on the trigger
  if (typeof document !== 'undefined') {
    if (val) {
      __prevActiveEl = (document.activeElement as HTMLElement) || null
    } else {
      // Option A: blur to remove the visible focus ring on the trigger element
      // (If you'd rather restore focus to the trigger for accessibility, replace with __prevActiveEl?.focus())
      __prevActiveEl?.blur?.()
      __prevActiveEl = null
    }
  }
})

onMounted(() => {
  if (props.prefetch) {
    const ric = (window as any).requestIdleCallback as ((cb: () => void, opts?: any) => number) | undefined
    const idleLoad = () => {
      if (!window.__pyodidePromise) {
        // Soft prefetch without touching UI state
        getPyodide().catch(() => {/* ignore */})
      }
    }
    if (typeof ric === 'function') {
      ric(idleLoad, { timeout: 3000 })
    } else {
      // Fallback after a short delay
      setTimeout(idleLoad, 2000)
    }
  }

  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  // Ensure scroll is restored if component unmounts while open
  unlockBodyScroll()
})

// --- Scroll lock helpers ---
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
</script>

<style scoped>
.pg { margin: 10px 0; }
.pg__bar { display:flex; align-items:center; justify-content:space-between; }
.pg__title { font-weight:700; color:#334155; }
.pg__open { background: transparent; color:#334155; border:1px solid rgba(0,0,0,.1); border-radius:8px; padding:6px 10px; cursor:pointer; }
.pg__open:hover { background: rgba(0,0,0,.03); }

.pg__overlay { position: fixed; inset: 0; background: rgba(0,0,0,.38); /* lighter blur for better perf */ backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); display:flex; align-items:center; justify-content:center; z-index: 9999; padding: 16px; will-change: opacity; overscroll-behavior: contain; }
.pg__panel { width: min(1200px, 96vw); height: min(80vh, 900px); background: #ffffff; color:#0b1020; border:1px solid rgba(0,0,0,.08); border-radius:12px; box-shadow: 0 20px 60px rgba(0,0,0,.35); display:flex; flex-direction:column; overflow:hidden; }
.pg__top { display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(0,0,0,.06); background: linear-gradient(180deg, rgba(148,163,184,.14), rgba(148,163,184,.04)); }
.pg__topTitle { font-weight:800; letter-spacing:.01em; }
.pg__center { justify-self:center; }
.pg__actions { display:flex; align-items:center; gap:8px; justify-self:end; }
.pg__btn { border:none; cursor:pointer; font-weight:700; border-radius:8px; transition: all .15s ease; }
.pg__btn--ghost { background: transparent; color:#334155; padding:6px 10px; border:1px solid rgba(0,0,0,.08); }
.pg__btn--ghost:hover { background: rgba(0,0,0,.03); }

/* Centered Replit-like Run button */
.pg__runMain { display:inline-flex; align-items:center; gap:8px; padding:8px 18px; border:none; border-radius:9999px; font-weight:800; letter-spacing:.01em; background:#16a34a; color:#ffffff; cursor:pointer; box-shadow: 0 2px 8px rgba(22,163,74,.35);
  transition: transform .06s ease, box-shadow .15s ease, filter .15s ease; }
.pg__runMain:hover { filter: brightness(1.05); box-shadow: 0 4px 14px rgba(22,163,74,.35); }
.pg__runMain:active { transform: translateY(1px); }
.pg__runMain:disabled { opacity:.7; cursor:not-allowed; }
.pg__runIcon { display:block; }

.pg__body { display:grid; grid-template-columns: 1fr 1fr; gap:12px; padding:12px; height:100%; }
.pg__left, .pg__right { min-height: 0; display:flex; flex-direction:column; }
/* Make left editor container a full dark block like the right output */
.pg__left { background:#0b1020; color:#e6edf3; border-radius:10px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); padding:8px; }
.pg__left .pg__label, .pg__left .pg__meta { color:#94a3b8; }
.pg__ta { width:100%; height: 100%; background:#0b1020; color:#e2e8f0; border:none; border-radius:10px; padding:12px; resize:none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:.92rem; line-height:1.45; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
.pg__outHead { display:flex; align-items:center; justify-content:space-between; margin:2px 2px 6px; }
.pg__inHead { display:flex; align-items:center; justify-content:space-between; margin:2px 2px 6px; }
.pg__label { font-size:.8rem; color:#64748b; font-weight:700; text-transform: uppercase; letter-spacing:.06em; }
.pg__meta { font-size:.78rem; color:#64748b; }
.pg__right { background:#0b1020; color:#e6edf3; border-radius:10px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); padding:8px; }
.pg__right .pg__label, .pg__right .pg__meta { color:#94a3b8; }
.pg__out { background:transparent; color:#e6edf3; padding:12px; border-radius:0; white-space:pre-wrap; overflow:auto; flex:1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:.92rem; line-height:1.45; }
.pg__out--empty { color:#94a3b8; opacity:.8; font-style: italic; }
.pg__err { background:#1f0b0b; color:#fecaca; padding:12px; border-radius:10px; margin-top:8px; white-space:pre-wrap; overflow:auto; flex:1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:.92rem; line-height:1.45; }

@media (max-width: 900px) {
  .pg__body { grid-template-columns: 1fr; grid-auto-rows: 1fr auto; }
  .pg__right { min-height: 180px; }
}

@media (prefers-color-scheme: dark){
  .pg__title, .pg__open { color:#e5e7eb; }
  .pg__panel { background:#0f172a; color:#e5e7eb; border-color: rgba(148,163,184,.24); box-shadow: 0 20px 80px rgba(0,0,0,.6); }
  .pg__top { border-bottom-color: rgba(148,163,184,.2); background: linear-gradient(180deg, rgba(2,6,23,.7), rgba(2,6,23,.35)); }
  .pg__btn--ghost { color:#e5e7eb; border-color: rgba(148,163,184,.24); }
  .pg__btn--ghost:hover { background: rgba(255,255,255,.04); }
  .pg__ta { background:#0b1020; color:#e6edf3; }
  .pg__label, .pg__meta { color:#94a3b8; }
  .pg__runMain { background:#16a34a; color:#ffffff; box-shadow: 0 2px 10px rgba(22,163,74,.45); }
}
html.dark .pg__title, .dark .pg__title, [data-theme='dark'] .pg__title { color:#e5e7eb; }
html.dark .pg__open, .dark .pg__open, [data-theme='dark'] .pg__open { color:#e5e7eb; border-color: rgba(148,163,184,.24); }
html.dark .pg__panel, .dark .pg__panel, [data-theme='dark'] .pg__panel { background:#0f172a; color:#e5e7eb; border-color: rgba(148,163,184,.24); box-shadow: 0 20px 80px rgba(0,0,0,.6); }
html.dark .pg__top, .dark .pg__top, [data-theme='dark'] .pg__top { border-bottom-color: rgba(148,163,184,.2); background: linear-gradient(180deg, rgba(2,6,23,.7), rgba(2,6,23,.35)); }
html.dark .pg__btn--ghost, .dark .pg__btn--ghost, [data-theme='dark'] .pg__btn--ghost { color:#e5e7eb; border-color: rgba(148,163,184,.24); }
html.dark .pg__btn--ghost:hover, .dark .pg__btn--ghost:hover, [data-theme='dark'] .pg__btn--ghost:hover { background: rgba(255,255,255,.04); }
html.dark .pg__ta, .dark .pg__ta, [data-theme='dark'] .pg__ta { background:#0b1020; color:#e6edf3; }
html.dark .pg__label, .dark .pg__label, [data-theme='dark'] .pg__label, html.dark .pg__meta, .dark .pg__meta, [data-theme='dark'] .pg__meta { color:#94a3b8; }
</style>
