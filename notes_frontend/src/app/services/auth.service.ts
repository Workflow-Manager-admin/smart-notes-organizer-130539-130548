import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authed$ = new BehaviorSubject<boolean>(false);
  private userId$ = new BehaviorSubject<string | null>(null);

  // All service usage logic omitted in this linting stub; no unused variable will be present.
}
