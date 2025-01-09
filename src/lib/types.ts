export interface Cache {
	status: string;
	cached_at: number;
	cached_until: number;
}

export type DefaultResponse<T, U = object> =
	| {
			success: true;
			cache: Cache;
			data: T;
	  }
	| {
			success: false;
			error: U;
	  };

export type LeagueRanksResponse = DefaultResponse<LeagueRanksData>;

export interface LeagueRanksData {
	_id: string;
	s: string;
	t: Date;
	data: {
		[k: Exclude<string, 'total'>]: {
			pos: number;
			percentile: number;
			tr: number;
			targettr: number;
			apm: number | null;
			pps: number;
			vs: number | null;
			count: number;
		};
	} & {
		total: number;
	};
}

export type UserLeaderboardResponse = DefaultResponse<UserLeaderboardData>;

export interface UserLeaderboardData {
	entries: UserLeaderboardEntry[];
}

export interface UserLeaderboardEntry {
	_id: string;
	username: string;
	role: string;
	xp: number;
	league: LeagueData;
	country: string;
	ts: Date;
	gamesplayed: number;
	gameswon: number;
	gametime: number;
	ar: number;
	ar_counts: { [key: string]: number };
	p: {
		pri: number;
		sec: number;
		ter: number;
	};
}

export interface LeagueData {
	gamesplayed: number;
	gameswon: number;
	glicko: number;
	rd: number;
	tr: number;
	gxe: number;
	rank: string;
	bestrank: string;
	apm: number;
	pps: number;
	vs: number;
	decaying: boolean;
}

export type UserLeagueRecordsResponse = DefaultResponse<UserLeagueRecordsData>;

export interface UserLeagueRecordsData {
	entries: UserLeagueRecordsEntry[];
}

export interface UserLeagueRecordsEntry {
	_id: string;
	replayid: string;
	stub: boolean;
	gamemode: 'league';
	ts: string;
	otherusers: [
		{
			id: string;
			username: string;
		}
	];
	extras: {
		league: {
			[key: string]: [LeagueExtraData | null, LeagueExtraData | null];
		};
	};
}

export interface LeagueExtraData {
	glicko: number;
	rd: number;
	tr: number;
	rank: string;
	placement?: number;
}

export interface GamesResponse {
	success: boolean;
	game: {
		_id: string;
		extras: {
			league: {
				[key: string]: [LeagueExtraData | null, LeagueExtraData];
			};
			result: string;
		};
		otherusers: [UserInfoCompact];
		prune_at: number;
		replayid: string;
		results: {
			leaderboard: [GamesLeaderboardUser, GamesLeaderboardUser];
			rounds: unknown;
		};
		revolution: null;
		stub: boolean;
		ts: string;
		user: UserInfoCompact;
		version: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		replay: any;
	};
}

export interface UserInfoCompact {
	id: string;
	username: string;
	avatar_revision?: number;
	banner_revision?: number;
	flags: number;
	country?: string;
}

export interface GamesLeaderboardUser {
	id: string;
	username: string;
	active: boolean;
	naturalorder: number;
	shadows: unknown;
	shadowedBy: unknown;
	wins: number;
	stats: {
		apm: number;
		pps: number;
		vsscore: number;
		garbagesent: number;
		garbagereceived: number;
		kills: number;
		altitude: number;
		rank: number;
		targetingfactor: number;
		targetinggrace: number;
		btb: number;
		revives: number;
	};
}
