import { supabase } from './supabaseClient.js';

// Playlists CRUD

export async function createPlaylist(title, userId) {
  const { data, error } = await supabase
    .from('playlists')
    .insert([{ title, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMyPlaylists(userId) {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllPlaylists(search = '') {
  // basic search by title or user_id
  let query = supabase.from('playlists').select('*').order('created_at', { ascending: false });
  if (search) {
    // simple ilike search on title
    query = query.ilike('title', `%${search}%`);
    // Note: to also search by user id, you could run an OR - keep simple for now
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPlaylistById(id) {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updatePlaylistTitle(id, newTitle) {
  const { data, error } = await supabase
    .from('playlists')
    .update({ title: newTitle })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlaylist(id) {
  // songs table has cascade delete if schema set - otherwise remove songs first
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
