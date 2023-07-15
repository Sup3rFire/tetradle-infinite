import type { APIRoute } from "astro";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

async function getId(after?: number, before?: number): Promise<string> {
    const data = await (
        await fetch(
            encodeURI(
                `https://ch.tetr.io/api/users/lists/league?limit=${1}${
                    after ? `&after=${after}` : ""
                }${before ? `&before=${before}` : ""}`
            ),
            {
                headers: { "X-Session-ID": cacheSessionID },
            }
        )
    ).json();

    if (!data.success) throw new Error(data.error);
    if (data.data.users.length === 0) return "";
    return data.data.users[0]._id;
}

export const get: APIRoute = async ({ params, request }) => {
    const trrange = params.trrange;

    if (trrange && +trrange) {
        const tr = +trrange;
        if (tr >= 0 && tr <= 25000) {
            try {
                let id = await getId(tr);
                if (id === "") id = await getId(undefined, tr);
                return {
                    body: id,
                };
            } catch (e: any) {
                console.error(e);
                return new Response("", {
                    status: 500,
                });
            }
        }
    }

    return new Response("", {
        status: 400,
    });
};
