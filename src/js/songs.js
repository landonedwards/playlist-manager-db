import { supabase } from './supabaseClient.js';

/** Songs CRUD */

export async function addSong(playlistId, title, artist, thumbnail_url = null) {
  const payload = { playlist_id: playlistId, title, artist, thumbnail_url };
  const { data, error } = await supabase
    .from('songs')
    .insert([payload])
    .select();
  if (error) throw error;
  return data;
}

export async function addMultipleSongs(playlistId, songsArray) {
  // songsArray: [{title, artist, thumbnail_url}, ...]
  const payload = songsArray.map(s => ({ playlist_id: playlistId, title: s.title, artist: s.artist, thumbnail_url: s.thumbnail_url || null }));
  const { data, error } = await supabase
    .from('songs')
    .insert(payload)
    .select();
  if (error) throw error;
  return data;
}

export async function getSongsForPlaylist(playlistId) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function removeSong(songId) {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId);
  if (error) throw error;
}
