import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authed$ = new BehaviorSubject<boolean>(false);
  private userId$ = new BehaviorSubject<string | null>(null);

  constructor(private supabase: SupabaseService) {
    // Initial session check and auth state set
    this.supabase.getSession().then((session) => {
      if (session && session.user) {
        this.authed$.next(true);
        this.userId$.next(session.user.id);
      }
    });
  }

  // PUBLIC_INTERFACE
  login(email: string, password: string): Promise<any> {
    return this.supabase.signIn(email, password).then(res => {
      if (!res.error && res.data.user) {
        this.authed$.next(true);
        this.userId$.next(res.data.user.id);
      }
      return res;
    });
  }

  // PUBLIC_INTERFACE
  signup(email: string, password: string): Promise<any> {
    return this.supabase.signUp(email, password);
  }

  // PUBLIC_INTERFACE
  logout(): Promise<any> {
    return this.supabase.signOut().then(res => {
      this.authed$.next(false);
      this.userId$.next(null);
      return res;
    });
  }

  // PUBLIC_INTERFACE
  isAuthenticated(): Observable<boolean> {
    return this.authed$.asObservable();
  }

  // PUBLIC_INTERFACE
  getUserId(): Observable<string | null> {
    return this.userId$.asObservable();
  }
}
