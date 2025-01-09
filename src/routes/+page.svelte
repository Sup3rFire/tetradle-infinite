<script lang="ts">
	import { loadGame, randomGame } from '$lib/client';
	import Game from '../components/Game.svelte';
	import { defaultSettings } from '$lib/shared';

	const settingsLS = localStorage.getItem('settings');
	let settings = $state<typeof defaultSettings>({
		...defaultSettings,
		...(settingsLS ? JSON.parse(settingsLS) : {})
	});
	$effect(() => {
		let saveSettings = settings;
		for (const k in settings) {
			if (settings[k as keyof typeof settings] === null)
				// @ts-ignore
				saveSettings[k] = defaultSettings[k];
		}
		localStorage.setItem('settings', JSON.stringify(saveSettings));
	});

	const currentGameDefault = localStorage.getItem('current_game');
	let currentGame = $state<import('$lib/utils').Question | null>(
		currentGameDefault ? JSON.parse(currentGameDefault) : null
	);
	$effect(() => {
		localStorage.setItem('current_game', JSON.stringify(currentGame));
	});

	const guessesDefault = localStorage.getItem('guesses');
	let guesses = $state<[number, number] | null>(
		guessesDefault ? (guessesDefault.split(',').map(Number) as [number, number]) : null
	);
	$effect(() => {
		if (guesses) localStorage.setItem('guesses', `${guesses[0]},${guesses[1]}`);
		else localStorage.removeItem('guesses');
	});

	let loading = $state<number>(0);

	async function downloadReplay() {
		const a = document.createElement('a');
		a.download = 'replay.ttrm';
		a.href = (window.webkitURL || window.URL).createObjectURL(
			new Blob([currentGame?.replay ?? ''], { type: 'text/plain;charset=utf-8' })
		);
		a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	let instructionsOpen = $state<boolean>(false);
	let settingsOpen = $state<boolean>(false);
</script>

{#if loading > 0}
	<div id="loading">Loading</div>
{/if}

{#if instructionsOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal"
		onclick={function (e) {
			// @ts-ignore
			if (e.target !== this) return;
			else instructionsOpen = false;
		}}
	>
		<div class="card" style="width: 700px;">
			<h2 style="text-align: center;">Instructions</h2>
			<p class="modal-desc" style="text-align: center;">
				Click outside to close these instructions
			</p>
			<ol>
				<li>Download the replay</li>
				<li>Open the replay in TETR.IO by dragging it into the game</li>
				<li>Guess the ratings of the players</li>
			</ol>
		</div>
	</div>
{/if}
{#if settingsOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal"
		onclick={function (e) {
			// @ts-ignore
			if (e.target !== this) return;
			else settingsOpen = false;
		}}
	>
		<div class="card" style="width: 700px;">
			<h2 style="text-align: center;">Settings</h2>
			<p class="modal-desc" style="text-align: center;">
				Click outside to close, settings are automatically saved
			</p>
			<div class="inputs">
				<h3>Game Settings</h3>
				<div class="input-group">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label>Min TR</label>
					<input type="number" bind:value={settings.minTR} min="0" max="25000" step="1" />
				</div>
				<div class="input-group">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label>Max TR</label>
					<input type="number" bind:value={settings.maxTR} min="0" max="25000" step="1" />
				</div>
				<div class="input-group">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label>Randomize based on rank</label>
					<input type="checkbox" bind:checked={settings.randomizeBasedOnRank} />
				</div>
			</div>
		</div>
	</div>
{/if}

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
					loading++;
					currentGame = await randomGame(settings).catch((e) => {
						alert(e);
						window.location.reload();
					});
					guesses = null;
					loading--;
				}}>New Game</button
			>
		{/if}
		{#if window.location.hash.length > 1}
			<button
				class="button"
				onclick={async () => {
					loading++;
					currentGame = await loadGame(window.location.hash.toLowerCase().slice(1)).catch((e) => {
						alert(e);
						window.location.reload();
					});
					guesses = null;
					loading--;
				}}>Play Tetradle #{window.location.hash.slice(1)}</button
			>
		{/if}
	</div>
{:else}
	<h1>Tetradle Infinite</h1>

	<p class="id">#{currentGame.answer.replayid}</p>
	<div class="card">
		<p>
			Original <a class="link" href="https://tetradle.xyz/">tetradle</a> was made by 25pi25,
			infinite version made by
			<a class="link" href="https://superfi.re">SuperFire</a>
			<span class="mini"
				>(<span class="link">remilia.tetris</span> on discord). Like the original, all replays are trimmed
				to FT3 and the players and their stats are hidden.</span
			>
		</p>
		<button class="button m0l" onclick={downloadReplay}>Download Replay</button>
		<button
			class={`button ${guesses ? 'accent' : ''}`}
			onclick={async () => {
				if (confirm('Are you sure you want to start a new game?')) {
					loading++;
					currentGame = await randomGame(settings).catch((e) => {
						alert(e);
						window.location.reload();
					});
					guesses = null;
					loading--;
				}
			}}>New Game</button
		>
		<button class="button" onclick={() => (settingsOpen = true)}>Settings</button>
		<button class="button" onclick={() => (instructionsOpen = true)}>Instructions</button>
	</div>
	<Game bind:currentGame bind:loading bind:guesses></Game>
{/if}
