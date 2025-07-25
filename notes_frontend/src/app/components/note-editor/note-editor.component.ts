import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ]
})
export class NoteEditorComponent {
  @Input() note: Note | null = null;
  @Input() allTags: string[] = [];
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() cancel = new EventEmitter<void>();

  editNote: Partial<Note> = {};

  ngOnChanges() {
    this.editNote = this.note
      ? {
          ...this.note,
          tags: [...(this.note.tags || [])]
        }
      : { title: '', content: '', tags: [], folder: '' };
  }

  onSave() {
    this.save.emit(this.editNote);
  }
  onCancel() {
    this.cancel.emit();
  }
}
