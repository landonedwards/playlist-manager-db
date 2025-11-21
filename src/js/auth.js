import { supabase } from './supabaseClient.js';

export async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) alert(error.message);
}

export async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({
        email,
        password
    });
    if (error) alert(error.message);
}

export async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/pages/index.html";
}

export async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
}