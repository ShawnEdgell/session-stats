import { supabase } from '$lib/supabaseClient';

export interface Stat {
    id: number;
    title: string;
    description: string;
    created_at?: Date;
}

export async function fetchStats(): Promise<Stat[]> {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stats:', error.message);
        return [];
    }

    return data || [];
}

export async function submitStat(title: string, description: string): Promise<void> {
    if (!title.trim() || !description.trim()) {
        console.error('Title and description cannot be empty.');
        return;
    }

    const { data, error } = await supabase.from('stats').insert([{ title, description }]);
    if (error) {
        console.error('Error submitting data:', error.message);
        return;
    }

    console.log('Submitted:', data);
    // Optionally, you can return the newly inserted data
    // return data;
}
