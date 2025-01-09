<script lang="ts">
	import type { defaultSettings } from '$lib/shared';
	import Guess from './Guess.svelte';
	import type { Question } from '$lib/utils';
	import { getCorrespondingEmoji } from '$lib/client';

	let {
		currentGame = $bindable(),
		loading = $bindable(),
		guesses = $bindable()
	}: { currentGame: Question; loading: number; guesses: [number, number] | null } = $props();

	let guessPlayer1 = $state<string>(guesses ? guesses[0].toString() : '10000');
	let guessPlayer2 = $state<string>(guesses ? guesses[1].toString() : '10000');

	function generateShareText() {
		let diff1 = (guesses as [number, number])[0] - Math.round(currentGame.answer.users[0].tr);
		let diff2 = (guesses as [number, number])[1] - Math.round(currentGame.answer.users[1].tr);
		return `Tetradle Infinite
https://tetradle.superfi.re/#${currentGame.answer.replayid}
Player 1: ${diff1 >= 0 ? '+' : ''}${diff1} ${getCorrespondingEmoji(
			diff1,
			currentGame.answer.users[0].tr
		)}
Player 2: ${diff2 >= 0 ? '+' : ''}${diff2} ${getCorrespondingEmoji(
			diff2,
			currentGame.answer.users[1].tr
		)}`;
	}

	function guess() {
		guesses = [+guessPlayer1, +guessPlayer2];
	}
</script>

<div class="guesses">
	<div class="card m0r" style="--color: #266dcd">
		<Guess bind:val={guessPlayer1} pnum="1" {guesses} user={currentGame.answer.users[0]} />
	</div>
	<div class="card m0l" style="--color: #cd2626">
		<Guess bind:val={guessPlayer2} pnum="2" {guesses} user={currentGame.answer.users[1]} />
	</div>
</div>
{#if guesses}
	<div class="card">
		<p>Click a button below to share your game and your results (without spoiling the answers)!</p>
		<a
			class="button"
			rel="noopener noreferrer"
			target="_blank"
			href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText())}`}
			>Share To Twitter</a
		>

		<button
			class="button"
			onclick={() => {
				navigator.clipboard
					// @ts-ignore
					.writeText(generateShareText())
					.then(() => alert('Results Copied!'));
			}}>Copy Results</button
		>
	</div>
{:else}
	<button class="guess button" onclick={guess}>Click Here to Guess</button>
{/if}
