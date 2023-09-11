import {
  URL,
  USERNAME,
  AUTH_KEY,
  AUTH_SECRET,
  AUTH_TOKEN,
} from '../constants';

export const prerender = true;
export const trailingSlash = 'always';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const response = await fetch(`${URL}/users/${USERNAME}/collection/folders`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${AUTH_KEY}, secret=${AUTH_SECRET}, token=${AUTH_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  const folders = response.json();

  const lists = [
    {
      href: "/lists/7-10-Singles/1361017",
      name: '7" & 10" Singles'
    }, {
      href: "/lists/12Singles-EP/1361029",
      name: '12" Singles & EP'
    }, {
      href: "/lists/LP/1361032",
      name: 'LP'
    }, {
      href: "/lists/CD/1361020",
      name: 'CD'
    }
  ];

  return {
    folders,
    lists,
  };
}