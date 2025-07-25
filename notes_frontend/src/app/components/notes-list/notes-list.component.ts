import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatChipModule,
    MatIconModule,
  ]
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: string | null = null;

  @Output() noteSelected = new EventEmitter<string>();
  @Output() deleteNote = new EventEmitter<string>();

  onSelect(id: string) {
    this.noteSelected.emit(id);
  }
  onDelete(id: string, e: Event) {
    e.stopPropagation();
    this.deleteNote.emit(id);
  }
}
