import type { APIRoute } from "astro";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

interface CacheData {
    cache: {
        status: string;
        cached_at: number;
        cached_until: number;
    };
    data: any;
}
const cache: Map<string, CacheData> = new Map();

function checkCache(key: string) {
    const cacheData = cache.get(key);
    if (!!cacheData && new Date().getTime() < cacheData.cache.cached_until)
        return cacheData.data;
}

async function getRecords(userId: string): Promise<string[]> {
    const cacheData = checkCache(userId);
    if (cacheData)
        return cacheData.records.map((record: { replayid: string }) => record.replayid);

    const data = await (
        await fetch(
            encodeURI(`https://ch.tetr.io/api/streams/league_userrecent_${userId}`),
            {
                headers: { "X-Session-ID": cacheSessionID },
            }
        )
    ).json();

    if (!data.success) throw new Error(data.error);

    cache.set(userId, data);
    return data.data.records.map((record: { replayid: string }) => record.replayid);
}

export const get: APIRoute = async ({ params, request }) => {
    const userid = params.userid;

    if (userid) {
        try {
            const records = await getRecords(userid);

            return {
                body: JSON.stringify(records),
            };
        } catch (e: any) {
            console.error(e);
            return new Response("", {
                status: 500,
            });
        }
    }

    return new Response("", {
        status: 400,
    });
};
