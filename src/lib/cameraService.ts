import { supabase } from '$lib/supabaseClient';

export interface CameraSetting {
    id: number;
    title: string;
    description: string;
    created_at?: Date;
}

export async function fetchCameraSettings(): Promise<CameraSetting[]> {
    const { data, error } = await supabase
        .from('camera_settings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching camera settings:', error.message);
        return [];
    }

    return data || [];
}

export async function submitCameraSetting(title: string, description: string): Promise<void> {
    if (!title.trim() || !description.trim()) {
        console.error('Title and description cannot be empty.');
        return;
    }

    const { data, error } = await supabase.from('camera_settings').insert([{ title, description }]);
    if (error) {
        console.error('Error submitting data:', error.message);
        return;
    }

    console.log('Submitted:', data);
}
