import { getUser, signOut } from "./auth.js";
import { createPlaylist, getMyPlaylists } from "./playlists.js";

const create = document.querySelector("#create");
const logout = document.querySelector("#logout");
const list = document.querySelector("#list");

const user = await getUser();
if (!user) {
    window.location.href = "index.html";
}

async function load() {
    const playlists = await getMyPlaylists(user.id);
    list.innerHTML = playlists.map(
        p => `<div><a href="/src/pages/editor.html?id=${p.id}">${p.title}</a></div>`
    ).join("");
}

create.addEventListener("click", async () => {
    const t = prompt("Playlist title:");
    if (!t) return;
    await createPlaylist(t, user.id);
    load();
})

logout.addEventListener("click", signOut);
load();