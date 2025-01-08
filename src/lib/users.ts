import { Cache } from './';
import type { LeagueRanksData, LeagueRanksResponse } from './types';

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
		data = cache.set('/labs/league_ranks', res.data);
	}

	// assuming decreasing tr
	const cutoffs: number[] = [];
	cutoffs.push(maximum);
	cutoffs.push(minimum);
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
