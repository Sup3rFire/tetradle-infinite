import type { APIRoute } from "astro";
import type { userInfosType } from "../../lib/utils";

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
    // console.log("x", cacheData);
    if (!!cacheData && new Date().getTime() < cacheData.cache.cached_until)
        return cacheData.data;
}

async function getUser(user: string): Promise<userInfosType> {
    const cacheData = checkCache(user);
    if (cacheData) return cacheData.user;

    const data = await (
        await fetch(encodeURI(`https://ch.tetr.io/api/users/${user}`), {
            headers: { "X-Session-ID": cacheSessionID },
        })
    ).json();

    if (!data.success) throw new Error(data.error);

    cache.set(user, data);
    return data.data.user;
}

export const get: APIRoute = async ({ params, request }) => {
    const user = params.user;

    if (user) {
        try {
            let data = await getUser(user);
            return {
                body: JSON.stringify(data),
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
