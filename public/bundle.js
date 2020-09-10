/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const elementForm = document.querySelector('#form');
const elementInput = document.querySelector('#search');
const songsContainer = document.querySelector('#main-songs');
const nextOrPrev = document.querySelector('#nextorprev');

const apiUrl = `URLAPI`;

const fetchData = async url => {
    const response = await fetch(url);
    return await response.json();
};

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
    insertSongsInPage(data);
}

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
        `
        return;
    }

    nextOrPrev.innerHTML = '';
}

const getSongs = async term => {
    const data = await fetchData(`${apiUrl}/suggest/${term}`);
    insertSongsInPage(data);
}

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


/***/ })
/******/ ]);