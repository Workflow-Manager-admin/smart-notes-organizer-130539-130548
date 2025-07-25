import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class HeaderComponent {
  @Input() searchValue = '';
  @Output() search = new EventEmitter<string>();
  @Output() newNote = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  doSearch(value: string) {
    this.search.emit(value);
  }
  createNote() {
    this.newNote.emit();
  }
  doLogout() {
    this.logout.emit();
  }
}
