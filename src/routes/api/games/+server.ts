import { API } from '$lib';
import { defaultSettings } from '$lib/shared';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const settings = { ...defaultSettings, ...body } as typeof defaultSettings;
  const tr = await API.randomTR(settings.minTR, settings.maxTR, settings.randomizeBasedOnRank);
  const user = await API.fetchUser(tr);
  const game = await API.randomGame(user)
  return text(game);
};