import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Represents the structure of camera settings objects.
 */
export interface CameraSetting {
    id: number;
    title: string;
    description: string;
    created_at?: Date;
    discord_id?: string;
    editable?: boolean;
    file_url?: string;
    uploader_name?: string;
}

/**
 * Represents the structure of gameplay stat objects.
 */
export interface Stat {
    id: number;
    title: string;
    description: string;
    created_at?: Date;
    discord_id?: string;
    editable?: boolean;
    file_url?: string;
    uploader_name?: string;
}

/**
 * Defines the pagination settings structure used for managing data fetching and presentation.
 */
export interface PaginationSettings {
    page: number;
    limit: number;
    size: number;
    amounts: number[];
}

/**
 * Extends or mirrors the Supabase User type, depending on the needs of your application.
 * This could be directly used as SupabaseUser if no extension is needed.
 */
export type User = SupabaseUser | null | undefined;

/**
 * Structure for managing the state and operations of file uploads.
 */
export interface FileState {
    files: FileList | null;
}

/**
 * Defines the type for function parameters or return types where a URL string is expected.
 */
export type ImageUrl = string | null;

/**
 * Represents a list of files uploaded via file input element.
 */
export interface FileList {
    [index: number]: File;
    readonly length: number;
    item(index: number): File | null;
}