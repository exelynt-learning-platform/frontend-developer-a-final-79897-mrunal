import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppwriteService } from './appwrite.service';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authTokenKey = 'auth_token';
  private readonly authUserKey = 'auth_user';

  private readonly mockApiUrl =
    'https://6a55c767e49d9eb2cc56067f.mockapi.io/api/v1/employees/users';

  private isAuthenticatedSubject =
    new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private appwriteService: AppwriteService
  ) {}

  // =====================================================
  // APPWRITE LOGIN
  // =====================================================

 async loginWithAppwrite(
  email: string,
  password: string
): Promise<AuthUser> {

  try {
    await this.appwriteService.account.deleteSession('current');
  } catch (e) {
    console.log('No active session found');
  }

  const session =
    await this.appwriteService.account.createEmailPasswordSession(
      email,
      password
    );

  const user =
    await this.appwriteService.account.get();

  const authUser: AuthUser = {
    id: Number(user.$id.replace(/\D/g, '').slice(0, 6) || 0),
    name: user.name,
    email: user.email,
    role: 'Employee'
  };

  localStorage.setItem(this.authTokenKey, session.$id);
  localStorage.setItem(this.authUserKey, JSON.stringify(authUser));

  this.isAuthenticatedSubject.next(true);

  return authUser;
}

  // =====================================================
  // MOCK API LOGIN
  // =====================================================

  loginWithApi(
    email: string,
    password: string
  ): Observable<AuthUser> {

    return this.http.get<ApiUser[]>(this.mockApiUrl).pipe(

      map((users: ApiUser[]) => {

        const matched = users.find(
          u =>
            u.email?.toLowerCase() ===
              email.toLowerCase() &&
            u.password === password
        );

        if (!matched) {
          throw new Error(
            'Invalid email or password'
          );
        }

        const authUser: AuthUser = {
          id: Number(matched.id),
          name: matched.name,
          email: matched.email,
          role: matched.role || 'Employee'
        };

        const token =
          `mock-token-${matched.id}-${Date.now()}`;

        localStorage.setItem(
          this.authTokenKey,
          token
        );

        localStorage.setItem(
          this.authUserKey,
          JSON.stringify(authUser)
        );

        this.isAuthenticatedSubject.next(true);

        return authUser;
      }),

      catchError((error) => {

        this.clearSession();

        return throwError(
          () =>
            new Error(
              error?.message ||
              'Login failed'
            )
        );
      })
    );
  }

  // =====================================================
  // AUTH HELPERS
  // =====================================================

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(
      this.authTokenKey
    );
  }

  getCurrentUser(): AuthUser | null {

    const user =
      localStorage.getItem(
        this.authUserKey
      );

    return user
      ? JSON.parse(user)
      : null;
  }

  async logout(): Promise<void> {

    try {

      await this.appwriteService.account
        .deleteSession('current');

    } catch (error) {

      console.error(
        'Logout Error:',
        error
      );
    }

    this.clearSession();
  }

  setToken(token: string): void {

    localStorage.setItem(
      this.authTokenKey,
      token
    );

    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {

    return !!localStorage.getItem(
      this.authTokenKey
    );
  }

  private clearSession(): void {

    localStorage.removeItem(
      this.authTokenKey
    );

    localStorage.removeItem(
      this.authUserKey
    );

    this.isAuthenticatedSubject.next(false);
  }
}