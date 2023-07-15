<script lang="ts">
    import type { Writable } from "svelte/store";

    export let val: Writable<string>;
    export let pnum: string;
</script>

<div class="container">
    <h2>P{pnum}</h2>
    <div class="display">{$val}</div>
    <input type="range" class="slider" min="0" max="25000" bind:value={$val} />
    <input
        type="number"
        class="numinput"
        bind:value={$val}
        min="0"
        max="25000"
        step="1"
    />
</div>

<style>
    h2 {
        color: #c7c7c7;
        font-size: 1.2rem;
        margin-bottom: -0.1rem;
    }
    .container {
        text-align: center;
        padding: 0.5rem 0;
    }
    input {
        margin: 0;
    }
    .numinput::-webkit-outer-spin-button,
    .numinput::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    .numinput[type="number"] {
        background-color: #fff;
        -moz-appearance: textfield;
    }
    .numinput {
        border-radius: 2px;
        margin-top: 0.5rem;
        background: none;
        border: none;
        font-family: inherit;
        text-align: center;
    }
    .display {
        color: #fff;
        font-weight: 800;
        font-size: 2.5rem;
        margin: 0;
        margin-bottom: 1rem;
        outline: none;
    }
    .display::after {
        content: "TR";
        color: #c7c7c7;
        font-size: 0.7rem;
        margin-left: 0.1rem;
    }
    .slider {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        width: 100%;
    }

    .slider::-webkit-slider-runnable-track {
        border-radius: 4px;
        height: 0.5rem;
        background: linear-gradient(
            to right,
            rgba(145, 120, 145) 0%,
            rgba(130, 90, 130) 2.5%,
            rgba(120, 70, 120) 5%,
            rgba(100, 50, 130) 10%,
            rgba(90, 50, 140) 14%,
            rgba(90, 80, 200) 22%,
            rgba(80, 100, 200) 30%,
            rgba(80, 165, 200) 38%,
            rgba(60, 185, 235) 46%,
            rgba(95, 195, 85) 54%,
            rgba(40, 175, 50) 62%,
            rgba(190, 170, 45) 70%,
            rgba(230, 180, 20) 77%,
            rgba(255, 245, 95) 83%,
            rgba(255, 170, 50) 89%,
            rgba(255, 30, 20) 95%,
            rgba(255, 85, 255) 100%
        );
    }
    .slider::-moz-range-track {
        border-radius: 4px;
        height: 0.5rem;
        background: linear-gradient(
            to right,
            rgba(145, 120, 145) 0%,
            rgba(130, 90, 130) 2.5%,
            rgba(120, 70, 120) 5%,
            rgba(100, 50, 130) 10%,
            rgba(90, 50, 140) 14%,
            rgba(90, 80, 200) 22%,
            rgba(80, 100, 200) 30%,
            rgba(80, 165, 200) 38%,
            rgba(60, 185, 235) 46%,
            rgba(95, 195, 85) 54%,
            rgba(40, 175, 50) 62%,
            rgba(190, 170, 45) 70%,
            rgba(230, 180, 20) 77%,
            rgba(255, 245, 95) 83%,
            rgba(255, 170, 50) 89%,
            rgba(255, 30, 20) 95%,
            rgba(255, 85, 255) 100%
        );
    }
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        margin-top: -0.26rem;
        background-color: #fff;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
    }
    .slider::-moz-range-thumb {
        border: none;
        border-radius: 0;
        background-color: #fff;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
    }
</style>
