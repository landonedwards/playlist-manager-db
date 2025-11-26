import { getUser } from "./auth.js";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
} from "./playlists.js";
import { getSongsForPlaylist, addMultipleSongs } from "./songs.js";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const playlistsEl = document.getElementById("playlists");

const detailCard = document.getElementById("detailCard");
const detailTitle = document.getElementById("detailTitle");
const detailUser = document.getElementById("detailUser");
const detailSongs = document.getElementById("detailSongs");
const importBtn = document.getElementById("importBtn");
const closeDetail = document.getElementById("closeDetail");

let allPlaylists = [];
let selectedPlaylistId = null;
let currentUser = null;

async function init() {
  currentUser = await getUser();
  load();
}

async function load(q) {
  playlistsEl.innerHTML = "<li>Loading…</li>";
  allPlaylists = await getAllPlaylists(q);
  if (!allPlaylists.length)
    playlistsEl.innerHTML = "<li>No playlists found</li>";
  else {
    playlistsEl.innerHTML = allPlaylists
      .map(
        (p) => `
          <li class="playlist-card" data-id="${p.id}">
            <div class="pl-meta">
              <strong>${escapeHtml(p.title)}</strong><br/>
              <small>by ${escapeHtml(p.user_id)}</small>
            </div>
            <div class="pl-actions">
              <button class="view" data-id="${p.id}">View</button>
            </div>
          </li>
        `
      )
      .join("");
    attachViewHandlers();
  }
}

function attachViewHandlers() {
  playlistsEl.querySelectorAll(".view").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      showDetails(id);
    })
  );
}

async function showDetails(id) {
  selectedPlaylistId = id;
  const pl = await getPlaylistById(id);
  const songs = await getSongsForPlaylist(id);
  detailTitle.textContent = pl.title;
  detailUser.textContent = pl.user_id;
  detailSongs.innerHTML = songs
    .map(
      (s) => `
        <li><img class="thumb" src="${
          s.thumbnail_url || "/vite.svg"
        }"/><div class="meta"><strong>${escapeHtml(
        s.title
      )}</strong><br/><small>${escapeHtml(s.artist)}</small></div></li>
      `
    )
    .join("");
  detailCard.classList.remove("hidden");
}

importBtn.addEventListener("click", async () => {
  if (!currentUser) return (location.href = "/index.html");
  if (!selectedPlaylistId) return;
  // copy playlist: create new playlist with same title + " (imported)"
  const pl = await getPlaylistById(selectedPlaylistId);
  const songs = await getSongsForPlaylist(selectedPlaylistId);
  const newPl = await createPlaylist(pl.title + " (imported)", currentUser.id);
  // bulk insert songs with new playlist id
  await addMultipleSongs(
    newPl.id,
    songs.map((s) => ({
      title: s.title,
      artist: s.artist,
      thumbnail_url: s.thumbnail_url,
    }))
  );
  alert("Imported playlist to your account.");
});

closeDetail.addEventListener("click", () => detailCard.classList.add("hidden"));
searchBtn.addEventListener("click", () => load(searchInput.value.trim()));
refreshBtn.addEventListener("click", () => {
  searchInput.value = "";
  load();
});

function escapeHtml(s) {
  return String(s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}

init();
