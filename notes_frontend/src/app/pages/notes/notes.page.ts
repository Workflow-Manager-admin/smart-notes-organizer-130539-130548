import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Note } from '../../models/note.model';

import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { AuthComponent } from '../../components/auth/auth.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-notes-page',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    NotesListComponent,
    NoteEditorComponent,
    AuthComponent,
    MatCardModule,
    MatChipsModule,
  ]
})
export class NotesPageComponent implements OnInit {
  tags: string[] = [];
  folders: string[] = [];
  notes: Note[] = [];
  selectedNote: Note | null = null;
  selectedTag = '';
  selectedFolder = '';
  searchValue = '';
  showEditor = false;
  editorNote: Note | null = null;
  showAuth = false;

  constructor(
  ) {}

  async ngOnInit() {
    await this.refreshAll();
    this.auth.isAuthenticated().subscribe(status => {
      this.showAuth = !status;
    });
  }

  async refreshAll() {
    await Promise.all([this.loadTags(), this.loadFolders(), this.loadNotes()]);
  }

  async loadTags() {
    const res = await this.supabase.getTags();
    if (!res.error) this.tags = res.data;
  }
  async loadFolders() {
    const res = await this.supabase.getFolders();
    if (!res.error) this.folders = res.data;
  }
  async loadNotes() {
    const res = await this.supabase.getNotes({
      tag: this.selectedTag,
      folder: this.selectedFolder,
      search: this.searchValue
    });
    if (!res.error && res.data) this.notes = res.data;
    if (this.selectedNote) {
      this.selectedNote = this.notes.find(n => n.id === this.selectedNote?.id) || null;
    }
  }
  async onSelectNote(id: string) {
    const result = await this.supabase.getNoteById(id);
    if (!result.error) {
      this.selectedNote = result.data;
      this.showEditor = false;
    }
  }

  onNewNote() {
    this.showEditor = true;
    this.editorNote = null;
  }

  async onSaveNote(noteObj: Partial<Note>) {
    if (this.editorNote) {
      // Edit existing
      await this.supabase.updateNote(this.editorNote.id, {
        ...noteObj,
        tags: noteObj.tags,
        folder: noteObj.folder
      } as any);
    } else {
      // New note
      await this.supabase.createNote({
        ...noteObj,
        tags: noteObj.tags,
        folder: noteObj.folder,
        content: noteObj.content,
        title: noteObj.title
      } as any);
    }
    await this.refreshAll();
    this.showEditor = false;
  }

  async onDeleteNote(id: string) {
    await this.supabase.deleteNote(id);
    await this.refreshAll();
    this.selectedNote = null;
  }

  onSelectTag(tag: string) {
    this.selectedTag = tag;
    this.selectedFolder = '';
    this.loadNotes();
  }

  onSelectFolder(folder: string) {
    this.selectedFolder = folder;
    this.selectedTag = '';
    this.loadNotes();
  }

  onSearch(value: string) {
    this.searchValue = value;
    this.loadNotes();
  }

  onEditNote() {
    this.editorNote = this.selectedNote;
    this.showEditor = true;
  }

  onCancelEditor() {
    this.showEditor = false;
  }

  async onLogout() {
    await this.auth.logout();
    this.showAuth = true;
  }

  async onLogin({email, password}: {email: string, password: string}) {
    const res = await this.auth.login(email, password);
    if (!res.error) {
      this.showAuth = false;
      await this.refreshAll();
    }
  }

  async onSignup({email, password}: {email: string, password: string}) {
    const res = await this.auth.signup(email, password);
    if (!res.error) {
      this.showAuth = false;
      await this.refreshAll();
    }
  }
}
