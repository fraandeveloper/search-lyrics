import './base.scss';

const elementForm = document.querySelector('#form');
const elementInput = document.querySelector('#search');
const songsContainer = document.querySelector('#main-songs');
const nextOrPrev = document.querySelector('#nextorprev');

const apiUrl = 'https://api.lyrics.ovh';

const fetchData = async url => {
  const response = await fetch(url);
  return await response.json();
};

// eslint-disable-next-line no-unused-vars
const getMoreSongs = async url => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
  insertSongsInPage(data);
};

const insertSongsInPage = songs => {
  songsContainer.innerHTML = songs.data.map(song => `
		<li class="main-songs__item">
				<span><strong>${song.artist.name}</strong> - ${song.title}</span>
				<button class="main-songs__seelyrics button" data-artist="${song.artist.name}" data-song-title="${song.title}">See lyrics</button>
		</li>
	`).join('');

  if (songs.prev || songs.next) {
    nextOrPrev.innerHTML = `
				${songs.prev ? `<button class="button" onClick="getMoreSongs('${songs.prev}')">Prev</button>` : ''}
				${songs.next ? `<button class="button" onClick="getMoreSongs('${songs.next}')">Next</button>` : ''}
		`;
    return;
  }

  nextOrPrev.innerHTML = '';
};

const getSongs = async term => {
  const data = await fetchData(`${apiUrl}/suggest/${term}`);
  insertSongsInPage(data);
};

elementForm.addEventListener('submit', event => {
  event.preventDefault();

  const search = elementInput.value.trim();
  elementInput.value = '';
  elementInput.focus();

  if (!search) {
    songsContainer.innerHTML = '<li>You have entered a blank search</li>';
    return;
  }

  getSongs(search);
});

const insertLyricsToPage = ({lyrics, artist, songTitle}) => {
  songsContainer.innerHTML = `
		<section class="main-song__lyrics">
				<h2>${artist} - ${songTitle}</h2>
				<p>${lyrics}</p>
		</section>
  `;
};

const getLyrics = async (artist, songTitle) => {
  const data = await fetchData(`${apiUrl}/v1/${artist}/${songTitle}`);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br />');

  insertLyricsToPage({lyrics, artist, songTitle});
};

const handleSongsContainerClick = event => {
  const clickedElement = event.target;

  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-song-title');

    nextOrPrev.innerHTML = '';

    getLyrics(artist, songTitle);
  }
};

songsContainer.addEventListener('click', handleSongsContainerClick);
