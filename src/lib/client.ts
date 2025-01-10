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

// copied from https://github.com/25Pi25/tetradle/blob/main/src/components/Modal.tsx
export function getMinimumCorrectRating(tr: number, mult = 1) {
  return mult * Math.min(-0.000009 * Math.pow(tr, 2) + 0.15 * tr + 2000, 0.0000096 * Math.pow(tr, 2) - 0.6 * tr + 9020);
}
export function getCorrespondingEmoji(ratingDifference: number, realRating: number) {
  if (ratingDifference == 0) return "🟦";
  if (Math.abs(ratingDifference) < getMinimumCorrectRating(realRating)) return "🟩";
  if (Math.abs(ratingDifference) < getMinimumCorrectRating(realRating, 1.25))
    return "🟨";
  return "🟥";
}