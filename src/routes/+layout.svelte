<script lang="ts">
	import '@fontsource-variable/plus-jakarta-sans';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		margin: auto;
		max-width: 1200px;
	}
</style>
