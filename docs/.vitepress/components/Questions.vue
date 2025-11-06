<template>
	<details class="cyu">
		<summary class="cyu__summary">
			<span class="cyu__title">{{ title }}</span>
			<span class="cyu__chev" aria-hidden="true">▸</span>
		</summary>
		<div class="cyu__body">
			<slot />
		</div>
	</details>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
	title: 'Questions'
})
</script>

<style scoped>
.cyu {
	--cy-accent:#7c3aed;
	--cy-border: rgba(124,58,237,.5);
	--cy-bg1: rgba(124,58,237,.12);
	--cy-bg2: rgba(124,58,237,.06);
	border: 1px solid var(--cy-border);
	border-left-width: 8px; /* keep thick left border even when collapsed */
	border-radius: 6px;
	background: transparent; /* minimal when collapsed */
	padding: 0;
	margin: 6px 0;
}
.cyu[open] {
	background: linear-gradient(180deg, var(--cy-bg1), var(--cy-bg2));
	box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	padding: 6px 8px;
}
.cyu__summary { list-style: none; cursor: pointer; display:flex; align-items:center; justify-content: space-between; padding: 2px 6px; color: var(--cy-accent); }
.cyu__summary::-webkit-details-marker { display: none; }
.cyu__title { font-weight: 800; font-size: .92rem; }
.cyu__chev { color: var(--cy-accent); transition: transform .2s ease; }
.cyu[open] .cyu__chev { transform: rotate(90deg); }
.cyu__body { margin-top: 6px; line-height: 1.5; }
.cyu__body :deep(ol) { padding-left: 1.2rem; }
.cyu__body :deep(li) { margin: 6px 0; }

@media (prefers-color-scheme: dark) { .cyu[open] { box-shadow: 0 4px 12px rgba(0,0,0,0.25);} }
</style>

