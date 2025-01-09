<script lang="ts">
	import { loadGame, randomGame } from '$lib/client';
	import Game from '../components/Game.svelte';
	import { defaultSettings } from '$lib/shared';

	const settingsLS = localStorage.getItem('settings');
	let settings = $state<typeof defaultSettings>({
		...defaultSettings,
		...(settingsLS ? JSON.parse(settingsLS) : {})
	});
	const currentGameDefault = localStorage.getItem('current_game');
	let currentGame = $state<import('$lib/utils').Question | null>(
		currentGameDefault ? JSON.parse(currentGameDefault) : null
	);
	let loading = $state<number>(0);
</script>

{#if !currentGame || window.location.hash.slice(1).toLowerCase() !== currentGame.answer.replayid}
	<div class="center">
		{#if currentGame}
			<button
				class="button"
				onclick={() => {
					//@ts-ignore
					window.location.hash = currentGame?.answer.replayid;
					window.location.reload();
				}}>Resume Previous Tetradle</button
			>
		{:else}
			<button
				class="button"
				onclick={async () => {
					currentGame = await randomGame(settings).catch((e) => {
						alert(e);
						window.location.reload();
					});
				}}>New Game</button
			>
		{/if}
		{#if window.location.hash.length > 1}
			<button
				class="button"
				onclick={async () => {
					currentGame = await loadGame(window.location.hash.toLowerCase().slice(1)).catch((e) => {
						alert(e);
						window.location.reload();
					});
				}}>Play Tetradle #{window.location.hash.slice(1)}</button
			>
		{/if}
	</div>
{:else}
	<Game></Game>
{/if}
