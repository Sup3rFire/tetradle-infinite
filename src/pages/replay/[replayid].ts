import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params, request }) => {
    const replayid = params.replayid;

    if (replayid) {
        try {
            const req = await fetch(`https://tetr.io/api/games/${replayid}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${import.meta.env.TOKEN}`,
                },
            });

            if (!req.ok) {
                return new Response("", {
                    status: 404,
                });
            }

            const records = (await req.json()).game;

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
