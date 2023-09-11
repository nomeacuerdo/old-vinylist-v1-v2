import {
  URL,
  USERNAME,
  AUTH_KEY,
  AUTH_SECRET,
  AUTH_TOKEN,
} from '../../constants';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch }) => {
  const collectionRes = await fetch(`${URL}/users/${USERNAME}/wants?per_page=100`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  const wants = await collectionRes.json();
  return wants;
}
