import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export const isAuthenticated = writable(false);
export const user = writable<User | null>(null); // Specify the type explicitly

// Use subscribe() method to update isAuthenticated store
supabase.auth.getSession().then((response) => {
    const session = response.data.session;
    isAuthenticated.set(!!session);
    user.set(session?.user || null); // Explicitly handle the null case
}).catch((error) => {
    console.error('Error retrieving session:', error.message);
});

// Update isAuthenticated and user stores onAuthStateChange
supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.set(!!session);
    user.set(session?.user || null); // Explicitly handle the null case
});
