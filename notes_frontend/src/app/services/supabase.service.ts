import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * SupabaseService handles authentication, notes, tags, and folders with Supabase.
 *
 * Uses NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY from environment variables.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private session: Session | null = null;

  constructor() {
    let url = '';
    let key = '';
    // Try Angular/SSR safe environment detection first (process.env), then window (when in browser)
    if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
      url = (globalThis as any).process.env['NG_APP_SUPABASE_URL'] || '';
      key = (globalThis as any).process.env['NG_APP_SUPABASE_KEY'] || '';
    }
    // Use window in browser only (guard rigorously for Node)
    if ((!url || !key) && typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined') {
      url = (globalThis as any).window['NG_APP_SUPABASE_URL'] || '';
      key = (globalThis as any).window['NG_APP_SUPABASE_KEY'] || '';
    }
    // Fallback to import.meta.env (for Vite/modern)
    if ((!url || !key) && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      url = (import.meta as any).env['NG_APP_SUPABASE_URL'] || '';
      key = (import.meta as any).env['NG_APP_SUPABASE_KEY'] || '';
    }
    this.supabase = createClient(url, key);
  }

  // PUBLIC_INTERFACE
  async signIn(email: string, password: string) {
    /** Sign in using Supabase authentication */
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // PUBLIC_INTERFACE
  async signUp(email: string, password: string) {
    /** Sign up for a new account */
    return this.supabase.auth.signUp({ email, password });
  }

  // PUBLIC_INTERFACE
  async signOut() {
    /** Sign out the current user */
    return this.supabase.auth.signOut();
  }

  // PUBLIC_INTERFACE
  async getSession(): Promise<Session | null> {
    /** Get the current user session */
    const { data } = await this.supabase.auth.getSession();
    return data.session || null;
  }

  // PUBLIC_INTERFACE
  async getUser(): Promise<User | null> {
    /** Get the currently authenticated user */
    const { data } = await this.supabase.auth.getUser();
    return data.user || null;
  }

  // PUBLIC_INTERFACE
  async getNotes(options?: { tag?: string, folder?: string, search?: string }) {
    /**
     * Get list of notes with optional filters: tag, folder, search
     */
    let q = this.supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (options?.tag) {
      q = q.contains('tags', [options.tag]);
    }
    if (options?.folder) {
      q = q.eq('folder', options.folder);
    }
    if (options?.search) {
      q = q.ilike('title', `%${options.search}%`);
    }

    const { data, error } = await q;
    return { data, error };
  }

  // PUBLIC_INTERFACE
  async getNoteById(id: string) {
    /**
     * Get note by ID
     */
    return this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
  }

  // PUBLIC_INTERFACE
  async createNote(note: { title: string, content: string, tags: string[], folder: string }) {
    return this.supabase
      .from('notes')
      .insert([note])
      .select()
      .single();
  }

  // PUBLIC_INTERFACE
  async updateNote(id: string, note: { title: string, content: string, tags: string[], folder: string }) {
    return this.supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .select()
      .single();
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string) {
    return this.supabase
      .from('notes')
      .delete()
      .eq('id', id);
  }

  // PUBLIC_INTERFACE
  async getTags() {
    /*
     * Gets unique tags from all notes
     */
    const { data, error } = await this.supabase
      .from('notes')
      .select('tags');
    let tags: string[] = [];
    if (data) {
      tags = [
        ...new Set(
          data.flatMap((row: any) => Array.isArray(row.tags) ? (row.tags as string[]) : [])
        ),
      ].filter(t => typeof t === 'string');
    }
    return { data: tags, error };
  }

  // PUBLIC_INTERFACE
  async getFolders() {
    /*
     * Gets unique folders from all notes
     */
    const { data, error } = await this.supabase
      .from('notes')
      .select('folder');
    let folders: string[] = [];
    if (data) {
      folders = [
        ...new Set(
          data.flatMap((row: any) => typeof row.folder === 'string' ? [row.folder] : [])
        ),
      ].filter(f => typeof f === 'string' && f);
    }
    return { data: folders, error };
  }
}
