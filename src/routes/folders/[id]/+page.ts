import {
  URL,
  USERNAME,
  AUTH_KEY,
  AUTH_SECRET,
  AUTH_TOKEN,
} from '../../../constants';

/** @type {import('./$types').PageLoad} */
export const load = async ({ params, fetch }) => {
  const id = params.id ? params.id : 0;
  const collectionRes = await fetch(`${URL}/users/${USERNAME}/collection/folders/${id}/releases?sort=artist&per_page=50`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  const collectionData = await collectionRes.json();

  return { id, collectionData };
}