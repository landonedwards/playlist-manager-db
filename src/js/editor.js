import { getUser, signOut } from "./auth.js";
import {
  getPlaylistById,
  updatePlaylistTitle,
  deletePlaylist,
} from "./playlists.js";
import { getSongsForPlaylist, addSong, removeSong } from "./songs.js";
import { searchItunes } from "./itunes.js";

const params = new URLSearchParams(location.search);
const playlistId = params.get("id");

let currentUser;
let playlist;

// DOM
const playlistTitleEl = document.getElementById("playlistTitle");
const titleInput = document.getElementById("titleInput");
const saveTitleBtn = document.getElementById("saveTitle");
const deleteBtn = document.getElementById("deletePlaylist");
const songList = document.getElementById("songList");
const manualAdd = document.getElementById("manualAdd");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const songThumb = document.getElementById("songThumb");

const itunesQuery = document.getElementById("itunesQuery");
const searchItunesBtn = document.getElementById("searchItunes");
const itunesResults = document.getElementById("itunesResults");

async function init() {
  console.log('Getting user...');
  currentUser = await getUser();
  console.log('Current user:', currentUser);
  
  if (!currentUser) {
    console.log('No user found, redirecting...');
    return (location.href = "/index.html");
  }
  
  if (!playlistId) return alert("No playlist id provided.");

  playlist = await getPlaylistById(playlistId);
  console.log('Playlist:', playlist);
  
  if (!playlist) return alert("Playlist not found.");

  playlistTitleEl.textContent = playlist.title;
  titleInput.value = playlist.title;

  loadSongs();
}


async function loadSongs() {
  const songs = await getSongsForPlaylist(playlistId);
  songList.innerHTML = songs
    .map(
      (s) => `
        <li data-id="${s.id}">
          <img class="thumb" src="${s.thumbnail || "/music-placeholder.png"}" alt="" />
          <div class="meta">
            <strong>${escapeHtml(s.title)}</strong><br/>
            <small>${escapeHtml(s.artist)}</small>
          </div>
          <button class="remove" data-id="${s.id}">Remove</button>
        </li>
      `
    )
    .join("");
  attachRemoveHandlers();
}

function attachRemoveHandlers() {
  songList.querySelectorAll(".remove").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (!confirm("Remove this song?")) return;
      await removeSong(id);
      loadSongs();
    })
  );
}

manualAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log('Adding song...', {
    playlistId,
    title: songTitle.value.trim(),
    artist: songArtist.value.trim(),
    thumb: songThumb.value.trim()
  });
  
  try {
    const result = await addSong(
      playlistId,
      songTitle.value.trim(),
      songArtist.value.trim(),
      songThumb.value.trim() || null
    );
    console.log('Song added:', result);
    songTitle.value = songArtist.value = songThumb.value = "";
    await loadSongs();
  } catch (error) {
    console.error('Error adding song:', error);
    alert('Failed to add song: ' + error.message);
  }
});

saveTitleBtn.addEventListener("click", async () => {
  const newTitle = titleInput.value.trim();
  if (!newTitle) return alert("Title cannot be empty.");
  await updatePlaylistTitle(playlistId, newTitle);
  playlistTitleEl.textContent = newTitle;
  alert("Title updated.");
});

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Delete this playlist and all its songs?")) return;
  await deletePlaylist(playlistId);
  location.href = "/src/pages/dashboard.html";
});

// iTunes search
searchItunesBtn.addEventListener("click", async () => {
  const q = itunesQuery.value.trim();
  if (!q) return;
  searchItunesBtn.disabled = true;
  itunesResults.innerHTML = "<li>Searching…</li>";
  try {
    const results = await searchItunes(q);
    if (!results.length) itunesResults.innerHTML = "<li>No results</li>";
    else {
      itunesResults.innerHTML = results
        .map(
          (r) => `
            <li class="itunes-item">
              <img class="thumb" src="${r.artworkUrl100}" alt="" />
              <div class="meta">
                <strong>${escapeHtml(
                  r.trackName || r.collectionName
                )}</strong><br/>
                <small>${escapeHtml(r.artistName)}</small>
              </div>
              <button class="add-itunes" data-title="${escapeAttr(
                r.trackName || r.collectionName
              )}" data-artist="${escapeAttr(
            r.artistName
          )}" data-thumb="${escapeAttr(r.artworkUrl100)}">Add</button>
            </li>
          `
        )
        .join("");
      attachItunesAddHandlers();
    }
  } catch (err) {
    console.error(err);
    alert("iTunes search failed");
  } finally {
    searchItunesBtn.disabled = false;
  }
});

function attachItunesAddHandlers() {
  itunesResults.querySelectorAll(".add-itunes").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const el = e.currentTarget;
      await addSong(
        playlistId,
        el.dataset.title,
        el.dataset.artist,
        el.dataset.thumb
      );
      loadSongs();
    })
  );
}

// simple escaping helpers
function escapeHtml(s) {
  return String(s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}
function escapeAttr(s) {
  return (s || "").replace(/"/g, "&quot;");
}

init();
