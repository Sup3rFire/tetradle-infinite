
export interface Cache {
  status: string;
  cached_at: number;
  cached_until: number;
}

export type DefaultResponse<T, U = object> = {
  success: true;
  cache: Cache;
  data: T;
} | {
  success: false;
  error: U;
}

export type LeagueRanksResponse = DefaultResponse<LeagueRanksData>

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
    }
  } & {
    total: number;
  };
}
