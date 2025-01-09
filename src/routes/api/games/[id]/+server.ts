import { API, Utils } from '$lib';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  return json(Utils.generateQuestion(await API.fetchGame(params.id)));
};