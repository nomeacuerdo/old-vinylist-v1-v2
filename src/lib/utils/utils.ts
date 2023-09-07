const namingMatrix = [
  // Style Changes
  ['Молчат Дома = Молчат Дома', 'Molchat Doma (Молчат Дома)'],
  ['Filter (2)', 'Filter'],
  ['Tool (2)', 'Tool'],
  ['Poison Idea / Pantera', 'Pantera / Poison Idea'],
  ['Prodigy [The] Featuring Sleaford Mods', 'Prodigy [The]'],
  // Who tf is Mock Gordon
  ['Mick Gordon', 'Doom'],
  ['Geinoh Yamashirogumi', 'Akira (Geinoh Yamashirogumi)'],
  ['Yoko Takahashi , Megumi Hayashibara', 'Evangelion (Yoko Takahashi)'],
  ['Seatbelts [The]', 'Cowboy Bebop (Seatbelts)'],
  ['AIR Sung By Gordon Tracks', 'Air'],
  // The artist formerly known as
  ['JARV IS...', 'Jarvis Cocker (JARV IS...)'],
  ['Trent Reznor And Atticus Ross', 'Watchmen'],
  // Various Artists means nothing
  ['Saturday Morning - Cartoons\' Greatest Hits', 'Saturday Morning (Various)'],
  ['Jojo Rabbit Original Motion Picture Soundtrack', 'Jojo Rabbit (Various)'],
  ['Trainspotting (Music From The Motion Picture)', 'Trainspotting (Various)'],
  ['Rodrigo D. No Futuro', 'Rodrigo D. No Futuro (Various)'],
  ['Dust Brothers [The]', 'Fight Club (The Dust Brothers)'],
];

export const stupidSpecificArtistNamingCriteria = (diskInfo, multi) => {
  let artist = multi
    ? diskInfo.artists.reduce((sum, itm) => {
      const normalizedName = itm.name.startsWith('The ') ? `${itm.name.substring(3)} [The]` : itm.name;
      return `${sum} ${normalizedName} ${itm.join}`;
    }, '').trim()
    : diskInfo.artists[0].name;

  artist = artist.startsWith('The ') ? `${artist.substring(3)} [The]`.trim() : artist;

  namingMatrix.forEach((dupla) => {
    let returnValue = artist;

    if (returnValue.startsWith('Various')) {
      returnValue = diskInfo.title;
    }

    returnValue = (returnValue === dupla[0]) ? dupla[1] : returnValue;

    artist = returnValue;
  });

  return artist;
};

export const tableDataFormatter = (item: any) => {
  const artist = item.basic_information.artists.length > 1
      ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
      : stupidSpecificArtistNamingCriteria(item.basic_information, false);

  return {
    id: item.id,
    cover: `<img src="${item.basic_information.cover_image}" class="w-16 rounded-sm" />`,
    image: item.basic_information.cover_image,
    name: item.basic_information.title,
    artist,
    released: item.notes ? item.notes[1]?.value : '',
    acquired: item.notes ? item.notes[0].value : '',
  }
}