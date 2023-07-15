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
