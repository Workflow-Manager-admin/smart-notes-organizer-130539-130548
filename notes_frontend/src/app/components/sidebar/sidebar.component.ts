import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNavList, MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatNavList,
    MatListModule,
    MatIconModule,
  ]
})
export class SidebarComponent {
  @Input() tags: string[] = [];
  @Input() folders: string[] = [];
  @Input() selectedTag: string = '';
  @Input() selectedFolder: string = '';

  @Output() tagSelected = new EventEmitter<string>();
  @Output() folderSelected = new EventEmitter<string>();

  selectTag(tag: string) {
    this.tagSelected.emit(tag);
  }
  selectFolder(folder: string) {
    this.folderSelected.emit(folder);
  }
}
