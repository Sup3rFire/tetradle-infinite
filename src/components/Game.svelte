<script lang="ts">
    import { current, guessPlayer1, guessPlayer2, users } from "./stores";
    import { censor } from "../lib/utils";
    import Player from "./Player.svelte";
    import { onMount } from "svelte";
    import Guess from "./Guess.svelte";

    function getRandomValue<T>(array: T[]): T {
        if (array.length <= 0) throw new Error("Array doesn't have any values.");
        return array[Math.floor(Math.random() * array.length)];
    }

    function getReplayIds(userId: string): Promise<string[]> {
        return fetch(`/replays/${userId}`).then((req) => req.json());
    }

    let loaded = !!($current && $users);
    let guessed = !!localStorage.getItem("guessed");

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
        localStorage.removeItem("guessed");
        guessed = false;
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

    function guess() {
        guessed = true;
        console.log("d");
    }

    let instructionsOpen = false;
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
    {#if instructionsOpen}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="modal"
            on:click={function (e) {
                if (e.target !== this) return;
                else instructionsOpen = false;
            }}
        >
            <div class="card" style="width: 700px;">
                <h2 style="text-align: center;">Instructions</h2>
                <p class="modal-desc" style="text-align: center;">
                    Click outside to close these instructions
                </p>
                <ol>
                    <li>Download the replay</li>
                    <li>Open the replay in TETR.IO by dragging it into the game</li>
                    <li>Guess the ratings of the players</li>
                </ol>
            </div>
        </div>
    {/if}
    <p class="id">#{$current}</p>
    <div class="card">
        <p>
            Original <a href="https://tetradle.xyz/">tetradle</a> was made by 25pi25,
            infinite version made by <a href="https://superfi.re">SuperFire</a>
            <span class="mini"
                >(<span class="link">remilia.tetris</span> on discord). Like the original,
                all replays are trimmed to FT3 and the players and their stats are hidden.</span
            >
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
        <button on:click={() => (instructionsOpen = true)}>Instructions</button>
    </div>

    <div class="guesses">
        <div class="card m0r" style="--color: #266dcd">
            <Guess val={guessPlayer1} pnum="1" />
        </div>
        <div class="card m0l" style="--color: #cd2626">
            <Guess val={guessPlayer2} pnum="2" />
        </div>
    </div>
    {#if !guessed}
        <button class="guess" on:click={guess}>Guess</button>
    {/if}
{/if}

<style>
    .guess {
        margin: 0 0.5rem;
        display: block;
        width: calc(100% - 1rem);
        font-size: 1.2rem;
    }
    .guesses {
        gap: 0.5rem;
        display: flex;
    }
    .guesses div {
        width: 50%;
        background: var(--color);
    }
    .modal-desc {
        font-size: 0.8rem;
        margin: 0;
        margin-top: -0.9rem;
        margin-bottom: 1.2rem;
    }
    ol {
        padding-left: 1.2rem;
    }
    li {
        margin-bottom: 0.6rem;
    }
    .mini {
        font-size: 0.9em;
        margin-left: 0.2rem;
    }
    .m0l {
        margin-left: 0;
    }
    .m0r {
        margin-right: 0;
    }
    .id {
        text-align: center;
        margin: 0;
        margin-top: -1rem;
        margin-bottom: 1.5rem;
    }
    .modal,
    #loading {
        position: fixed;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    #loading {
        font-weight: 700;
        user-select: none;
        font-size: 3rem;
        animation: pulse 3s ease-in-out infinite;
    }
    .modal::after,
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
