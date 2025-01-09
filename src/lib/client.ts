import type { defaultSettings } from "./shared";

export async function loadGame(id: string) {
    const game = await fetch(`/api/games/${id}`).then((res) => res.json()).catch(
      (e) => {
        alert(e);
        window.location.reload();
      },
    );
    return game
}

export async function randomGame(settings: typeof defaultSettings) {
  const gameId = await fetch("/api/games", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  }).then((res) => res.text()).catch(
    (e) => {
      alert(e);
      window.location.reload();
    },
  );
  if (gameId) {
    window.location.hash = gameId;
    return await loadGame(gameId);
  }
}