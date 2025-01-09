import { TOKEN } from '$env/static/private';
import { Cache } from '.';
import type {
	GamesResponse,
	LeagueRanksData,
	LeagueRanksResponse,
	UserLeaderboardResponse,
	UserLeagueRecordsResponse
} from './types';

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

const cache = new Cache<{
	'/labs/league_ranks': LeagueRanksData;
}>();

export async function randomTR(minimum = 0, maximum = 25000, randomRank = false) {
	if (!randomRank) return minimum + Math.random() * (maximum - minimum);

	let data = cache.get('/labs/league_ranks');
	if (!data) {
		const res = (await fetch('https://ch.tetr.io/api/labs/league_ranks', {
			headers: { 'X-Session-ID': cacheSessionID }
		}).then((res) => res.json())) as LeagueRanksResponse;
		if (!res.success) throw new Error(JSON.stringify(res.error));
		data = cache.set('/labs/league_ranks', res.data, res.cache.cached_until);
	}

	// assuming decreasing tr
	const cutoffs: number[] = [];
	cutoffs.push(maximum);
	for (const key in data.data) {
		if (key == 'total') continue;
		const tr = data.data[key].tr;
		if (tr >= minimum && tr <= maximum) {
			cutoffs.push(tr);
		}
	}
	const index = Math.floor(Math.random() * (cutoffs.length - 1));

	return cutoffs[index + 1] + Math.random() * (cutoffs[index] - cutoffs[index + 1]);
}

export async function fetchUser(tr: number) {
	const res = (await fetch(
		`https://ch.tetr.io/api/users/by/league?limit=100&after=${encodeURIComponent(tr)}:0:0`,
		{
			headers: { 'X-Session-ID': cacheSessionID }
		}
	).then((res) => res.json())) as UserLeaderboardResponse;
	if (!res.success) throw new Error(JSON.stringify(res.error));
	const entries = res.data.entries.filter((x) => !x.league.decaying || (x.supporter && x.league.rd <= 80))
	if (entries.length == 0) throw new Error('No entries found');
	return entries[0]._id;
}

export async function randomGame(user: string, limit = 10) {
	const res = (await fetch(
		`https://ch.tetr.io/api/users/${encodeURIComponent(user)}/records/league/recent?limit=${encodeURIComponent(limit)}`,
		{
			headers: { 'X-Session-ID': cacheSessionID }
		}
	).then((res) => res.json())) as UserLeagueRecordsResponse;
	if (!res.success) throw new Error(JSON.stringify(res.error));

	const pickableGames = res.data.entries.filter((x) => {
		if (x.stub) return false;
		for (const y in x.extras.league) {
			if (x.extras.league[y][1] == null) return false;
		}
		return true;
	});

	if (pickableGames.length == 0) throw new Error('No suitable games found');

	const picked = pickableGames[Math.floor(Math.random() * pickableGames.length)];

	return picked.replayid;
}

export async function fetchGame(id: string) {
	const res = (await fetch(`https://tetr.io/api/games/${id}`, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${TOKEN}`
		}
	}).then((res) => res.json())) as GamesResponse;
	if (!res.success) throw new Error("Couldn't download replay");

	return res.game;
}
