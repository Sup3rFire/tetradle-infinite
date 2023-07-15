<script lang="ts">
    import { current, users } from "./stores";
    import { censor } from "../lib/utils";
    import Player from "./Player.svelte";
    import { onMount } from "svelte";

    function getRandomValue<T>(array: T[]): T {
        if (array.length <= 0) throw new Error("Array doesn't have any values.");
        return array[Math.floor(Math.random() * array.length)];
    }

    function getReplayIds(userId: string): Promise<string[]> {
        return fetch(`/replays/${userId}`).then((req) => req.json());
    }

    let loaded = !!($current && $users);

    let data: any;
    onMount(async () => {
        if (!$users) {
            if (!$current)
                current.set(
                    getRandomValue(
                        await getReplayIds(
                            await fetch(`/randomuser/${Math.random() * 25000}`).then(
                                (res) => res.text()
                            )
                        )
                    )
                );
            window.location.hash = $current as string;
            await load();
        }
    });

    async function load() {
        const req = await fetch(`/replay/${$current}`);
        if (!req.ok) throw new Error("couldn't get replay");
        data = await req.json();
        const usersVal = data.endcontext.map((x: { user: any }) => x.user);
        localStorage.setItem("current", $current as string);
        localStorage.setItem("users", JSON.stringify(usersVal));
        loaded = true;
    }

    if (!window.location.hash && $current) window.location.hash = $current as string;

    async function downloadReplay() {
        if (!data) {
            data = await fetch(`/replay/${$current}`).then((req) => req.json());
        }

        data = censor(data);

        const a = document.createElement("a");
        a.download = "replay.ttrm";
        a.href = (window.webkitURL || window.URL).createObjectURL(
            new Blob([data], { type: "text/plain;charset=utf-8" })
        );
        a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
</script>

<h1>Tetradle Infinite</h1>
{#if window.location.hash && $current && window.location.hash
        .slice(1)
        .toLowerCase() !== $current}
    <div class="center">
        <div class="card">
            <h2>Tetradle Game Link Detected</h2>
            <button
                on:click={() => {
                    //@ts-ignore
                    window.location.hash = $current;
                    window.location.reload();
                }}>Resume Previous Tetradle</button
            >
            <button
                on:click={async () => {
                    current.set(window.location.hash.toLowerCase().slice(1));
                    await load().catch((e) => {
                        alert(e);
                        window.location.reload();
                    });
                }}>Play Tetradle #{window.location.hash.slice(1)}</button
            >
        </div>
    </div>
{:else}
    {#if !loaded}
        <div id="loading">Loading</div>
    {/if}
    <p class="id">#{$current}</p>
    <div class="card">
        <p>
            Original <a href="https://tetradle.xyz/">tetradle</a> was made by 25pi25,
            infinite version made by <a href="https://superfi.re">SuperFire</a>
        </p>
        <button on:click={downloadReplay} class="m0l">Download Replay</button>
        <button
            on:click={async () => {
                if (confirm("Are you sure you want to start a new game?")) {
                    loaded = false;

                    current.set(
                        getRandomValue(
                            await getReplayIds(
                                await fetch(`/randomuser/${Math.random() * 25000}`).then(
                                    (res) => res.text()
                                )
                            )
                        )
                    );
                    //@ts-ignore
                    window.location.hash = $current;
                    await load();
                }
            }}>New Game</button
        >
    </div>
{/if}

<style>
    .m0l {
        margin-left: 0;
    }
    .id {
        text-align: center;
        margin: 0;
        margin-top: -1rem;
        margin-bottom: 1.5rem;
    }
    #loading {
        position: fixed;
        z-index: 1000;
        font-weight: 700;
        user-select: none;
        font-size: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        animation: pulse 3s ease-in-out infinite;
    }
    #loading::after {
        content: " ";
        z-index: -1;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #00000085;
    }
    @keyframes pulse {
        0% {
            filter: brightness(1);
        }
        50% {
            filter: brightness(0.5);
        }
        100% {
            filter: brightness(1);
        }
    }
    h1 {
        text-align: center;
    }
    .input-group {
        font-size: 0.9rem;
        margin: 0.8rem 0;
    }
    .player {
        position: relative;
        margin-bottom: 0.5rem;
    }
    .hidden::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--dark-1);
    }
</style>
