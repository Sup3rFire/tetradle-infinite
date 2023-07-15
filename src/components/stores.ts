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
