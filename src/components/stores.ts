import { writable } from "svelte/store";

let usersDefault = localStorage.getItem("users");

let currentDefault = localStorage.getItem("current");
if (!currentDefault) usersDefault = null;
if (!currentDefault && window.location.hash) {
  currentDefault = window.location.hash.slice(1);
}

if (usersDefault) usersDefault = JSON.parse(usersDefault);

export const current = writable(currentDefault);
export const users = writable(usersDefault);

export const guessPlayer1 = writable("12500");
export const guessPlayer2 = writable("12500");

let settingsLS = localStorage.getItem("settings");
const defaultSettings = {
  minTR: 0,
  maxTR: 25000,
  randomizeBasedOnRank: false,
};
export const settings = writable<typeof defaultSettings>({
  ...defaultSettings,
  ...(settingsLS ? JSON.parse(settingsLS) : {}),
});
