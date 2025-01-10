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
	const ttrmData = data;

	ttrmData.replay.leaderboard[0].stats.apm = 0;
	ttrmData.replay.leaderboard[0].stats.pps = 0;
	ttrmData.replay.leaderboard[0].stats.vsscore = 0;
	ttrmData.replay.leaderboard[1].stats.apm = 0;
	ttrmData.replay.leaderboard[1].stats.pps = 0;
	ttrmData.replay.leaderboard[1].stats.vsscore = 0;
	ttrmData.replay.leaderboard[0].wins = 0;
	ttrmData.replay.leaderboard[1].wins = 0;
	while (ttrmData.replay.rounds.length > 3) {
		ttrmData.replay.rounds.pop();
	}
	for (let roundnum = 0; roundnum < ttrmData.replay.rounds.length; roundnum++) {
		ttrmData.replay.rounds[roundnum][0].lifetime = 0;
		ttrmData.replay.rounds[roundnum][0].stats.pps = 0;
		ttrmData.replay.rounds[roundnum][0].stats.apm = 0;
		ttrmData.replay.rounds[roundnum][0].stats.vsscore = 0;
		ttrmData.replay.rounds[roundnum][1].lifetime = 0;
		ttrmData.replay.rounds[roundnum][1].stats.pps = 0;
		ttrmData.replay.rounds[roundnum][1].stats.apm = 0;
		ttrmData.replay.rounds[roundnum][1].stats.vsscore = 0;
	}

	return ttrmData
}
