/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // const res = await fetch(`/api/discogs`);
  // const item = await res.json();

  console.log('heehee', params);

  return { 
    items: {
      slug: params.slug,
      id: params.id,
  } };
}