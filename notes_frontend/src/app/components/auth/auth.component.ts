import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class AuthComponent {
  @Output() login = new EventEmitter<{ email: string, password: string }>();
  @Output() signup = new EventEmitter<{ email: string, password: string }>();

  authMode: 'login' | 'signup' = 'login';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  doAuth() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password required';
      return;
    }
    if (this.authMode === 'login') {
      this.login.emit({ email: this.email, password: this.password });
    } else {
      this.signup.emit({ email: this.email, password: this.password });
    }
  }
}
