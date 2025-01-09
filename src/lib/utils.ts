import type { GamesResponse } from './types';

export interface Question {
	answer: {
		users: { id: string; username: string; tr: number; rank: string }[];
		replayid: string;
	};
	replay: string;
}

export function generateQuestion(game: GamesResponse['game']): Question {
	let replay = JSON.stringify(removeReplayData(game.replay));

	game.results.leaderboard.forEach((x, idx) => {
		replay = replay
			.replaceAll(`"${x.username}"`, `"P${idx + 1}"`)
			.replaceAll(x.id, ['5e81a6dcd0c40c6c8067278b', '5f193de9272cc46c0ff85110'][idx]);
	});

	return {
		replay,
		answer: {
			users: game.results.leaderboard.map((x) => ({
				id: x.id,
				username: x.username,
				tr: game.extras.league[x.id][1].tr,
				rank: game.extras.league[x.id][1].rank
			})),
			replayid: game.replayid
		}
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeReplayData(data: any) {
	return data;
}
