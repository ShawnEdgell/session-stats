import { supabase } from '$lib/supabaseClient';
import type { FileList } from '$lib/types';

export async function deleteItem(tableName: string, id: number, fileUrl: string | undefined) {
    try {
        const { error } = await supabase.from(tableName).delete().eq('id', id).single();

        if (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            console.error(`Error deleting item: ${err.message}`);
            return;
        }

        console.log('Item deleted successfully');

        if (fileUrl && typeof fileUrl === 'string') { // Ensure fileUrl is a string
            const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            await supabase.storage.from(`session-public-${tableName}-settings`).remove([fileName]);
        }
    } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Error deleting item: ${err.message}`);
    }
}


export async function updateItem(tableName: string, item: { id: number; title: string; description: string; file_url?: string }, files: FileList | null) {
    try {
        let updateData: { title: string; description: string; file_url?: string } = { title: item.title, description: item.description };
        if (files) {
            const file = files[0];
            const uniqueFileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from(`session-public-${tableName}-settings`)
                .upload(uniqueFileName, file, { cacheControl: '3600' });

            if (error) {
                const err = error instanceof Error ? error : new Error('Unknown error');
                console.error(`Error uploading file: ${err.message}`);
                return;
            }

            const fileUrl = data?.path;

            if (!fileUrl) {
                console.error('File URL not found');
                return;
            }

            const previousFileUrl = item.file_url;
            if (previousFileUrl) {
                const fileName = previousFileUrl.substring(previousFileUrl.lastIndexOf('/') + 1);
                await supabase.storage.from(`session-public-${tableName}-settings`).remove([fileName]);
            }

            updateData = { ...updateData, file_url: fileUrl };
        }

        const { error } = await supabase.from(tableName).update(updateData).eq('id', item.id);

        if (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            console.error(`Error updating item: ${err.message}`);
            return;
        }

        console.log('Item updated successfully');
    } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Error updating item: ${err.message}`);
    }
}
