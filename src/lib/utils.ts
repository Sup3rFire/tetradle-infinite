export type RoleType = "anon" | "user" | "bot" | "mod" | "admin";

export type MiddleRanks =
    | "D+"
    | "C-"
    | "C"
    | "C+"
    | "B-"
    | "B"
    | "B+"
    | "A-"
    | "A"
    | "A+"
    | "S-"
    | "S"
    | "S+"
    | "SS"
    | "U";
export type AllRanks = (MiddleRanks & "D") | "X" | "Z";

export type LeagueInfosType = {
    /** The amount of TETRA LEAGUE games played by this user. */
    gamesplayed: number;
    /** The amount of TETRA LEAGUE games won by this user. */
    gameswon: number;

    /** This user's TR (Tetra Rating), or -1 if less than 10 games were played. */
    rating: number;
    /** This user's letter rank. Z is unranked. */
    rank: AllRanks;

    /** This user's Glicko-2 rating. */
    glicko?: number;
    /** This user's Glicko-2 Rating Deviation. If over 100, this user is unranked. */
    rd?: number;

    /** This user's average APM (attack per minute) over the last 10 games. */
    apm?: number;
    /** This user's average PPS (pieces per second) over the last 10 games. */
    pps?: number;
    /** This user's average VS (versus score) over the last 10 games. */
    vs?: number;
    /** Whether this user's RD is rising (has not played in the last week). */
    decaying: boolean;
};

export type LeagueInfosFullType = LeagueInfosType & {
    /** This user's position in global leaderboards, or -1 if not applicable. */
    standing: number;
    /** This user's position in local leaderboards, or -1 if not applicable. */
    standing_local: number;

    /** The next rank this user can achieve, if they win more games, or null if unranked (or the best rank). */
    next_rank?: MiddleRanks | null;
    /** The previous rank this user can achieve, if they lose more games, or null if unranked (or the worst rank). */
    prev_rank?: MiddleRanks | null;

    /** The position of the best player in the user's current rank, surpass them to go up a rank. -1 if unranked (or the best rank). */
    next_at: number;
    /** The position of the worst player in the user's current rank, dip below them to go down a rank. -1 if unranked (or the worst rank). */
    prev_at: number;

    /** This user's percentile position (0 is best, 1 is worst). */
    percentile: number;

    /** This user's percentile rank, or Z if not applicable. */
    percentile_rank: AllRanks;
};

export type userInfosType = {
    /** The user's internal ID. */
    _id: string;
    /** The user's username. */
    username: string;
    /** The user's role. */
    role: RoleType;
    /** When the user account was created. If not set, this account was created before join dates were recorded. */
    ts?: string;

    /** If this user is a bot, the bot's operator. */
    botmaster?: string;

    /** The user's badges: */
    badges: {
        /** The badge's internal ID, and the filename of the badge icon (all PNGs within `/res/badges/`) */
        id: string;
        /** The badge's label, shown when hovered. */
        label: string;
        /** The badge's timestamp, if shown. */
        ts?: string;
    }[];

    /** The user's XP in points. */
    xp: number;

    /** The amount of online games played by this user. If the user has chosen to hide this statistic, it will be -1. */
    gamesplayed: number;
    /** The amount of online games won by this user. If the user has chosen to hide this statistic, it will be -1. */
    gameswon: number;
    /** The amount of seconds this user spent playing, both on- and offline. If the user has chosen to hide this statistic, it will be -1. */
    gametime: number;

    /** The user's ISO 3166-1 country code, or null if hidden/unknown. Some vanity flags exist. */
    country?: string;
    /** Whether this user currently has a bad standing (recently banned). */
    badstanding?: boolean;

    /** Whether this user is currently supporting TETR.IO <3 */
    supporter: boolean;
    /** An indicator of their total amount supported, between 0 and 4 inclusive. */
    supporter_tier: number;
    /** Whether this user is a verified account. */
    verified: boolean;

    /** This user's current TETRA LEAGUE standing: */
    league: LeagueInfosFullType;

    /** This user's avatar ID. Get their avatar at `https://tetr.io/user-content/avatars/{ USERID }.jpg?rv={ AVATAR_REVISION }` */
    avatar_revision?: number;
    /** This user's banner ID. Get their banner at `https://tetr.io/user-content/banners/{ USERID }.jpg?rv={ BANNER_REVISION }`. Ignore this field if the user is not a supporter. */
    banner_revision?: number;
    /** This user's "About Me" section. Ignore this field if the user is not a supporter. */
    bio?: string;

    /** The amount of players who have added this user to their friends list. */
    friend_count: number;
};

// tetr.js types (outdated)

export function censor(dataD: any) {
    let data = JSON.parse(JSON.stringify(dataD));
    data._id = "";
    data.shortid = "";
    const users = data.endcontext.map((x: { user: any }) => x.user);

    const wins = [0, 0];

    for (let i = 0; wins[0] < 3 && wins[1] < 3 && i < data.data.length; i++) {
        if (data.data[i].board[0].success) wins[0]++;
        if (data.data[i].board[1].success) wins[1]++;
        data.data[i].replays[0].events[
            data.data[i].replays[0].events.length - 1
        ].data.export.aggregatestats.apm = 0;
        data.data[i].replays[0].events[
            data.data[i].replays[0].events.length - 1
        ].data.export.aggregatestats.pps = 0;
        data.data[i].replays[0].events[
            data.data[i].replays[0].events.length - 1
        ].data.export.aggregatestats.vsscore = 0;
        data.data[i].replays[1].events[
            data.data[i].replays[1].events.length - 1
        ].data.export.aggregatestats.apm = 0;
        data.data[i].replays[1].events[
            data.data[i].replays[1].events.length - 1
        ].data.export.aggregatestats.pps = 0;
        data.data[i].replays[1].events[
            data.data[i].replays[1].events.length - 1
        ].data.export.aggregatestats.vsscore = 0;
    }

    const games = wins[0] + wins[1];
    data.data = data.data.slice(0, games);

    data.endcontext = (data.endcontext as any[]).map((ctx, idx) => {
        ctx.wins = wins[idx];
        ctx.points.primary = wins[idx];
        ctx.points.secondary = 0;
        ctx.points.tertiary = 0;
        ctx.points.extra.vs = 0;

        ctx.points.secondaryAvgTracking = Array(games).fill(0);
        ctx.points.tertiaryAvgTracking = Array(games).fill(0);
        ctx.points.extraAvgTracking.aggregatestats___vsscore = Array(games).fill(0);
        return ctx;
    });

    data = JSON.stringify(data);
    data = data.replaceAll(users[0]._id, "5e81a6dcd0c40c6c8067278b");
    data = data.replaceAll(users[1]._id, "5f193de9272cc46c0ff85110");
    data = data.replaceAll(`"${users[0].username}"`, '"P1"');
    data = data.replaceAll(`"${users[1].username}"`, '"P2"');

    return data;
}

// copied from https://github.com/25Pi25/tetradle/blob/main/src/components/Modal.tsx
export function getMinimumCorrectRating(tr: number, mult = 1) {
    return 1.5 * mult * (-0.000008707 * Math.pow(tr, 2) + 0.178725036 * tr + 976.46);
}
export function getCorrespondingEmoji(ratingDifference: number, realRating: number) {
    if (ratingDifference == 0) return "🟦";
    if (Math.abs(ratingDifference) < getMinimumCorrectRating(realRating)) return "🟩";
    if (Math.abs(ratingDifference) < getMinimumCorrectRating(realRating, 1.25))
        return "🟨";
    return "🟥";
}
