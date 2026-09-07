import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Reusing the same interface from AuthService, expanded for profile
export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  mobile?: number | string;
  department?: string;
  designation?: string;
  Salary?: number;
  joining_date?: number | string;
  status?: string;
  role?: string;
  avatar?: string;
  dob?: string;
  gender?: string;
  address?: string;
  bio?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly mockApiUrl = 'https://6a55c767e49d9eb2cc56067f.mockapi.io/api/v1/employees/users';

  // Subject to notify components (like Navbar) when profile is updated
  private profileUpdatedSubject = new BehaviorSubject<UserProfile | null>(null);
  profileUpdated$ = this.profileUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initProfileFromLocal();
  }

  // Load initial profile from LocalStorage so Navbar can display it immediately
  private initProfileFromLocal(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileUpdatedSubject.next(user as UserProfile);
    }
  }

  /**
   * Fetch the user profile by ID from the MockAPI
   */
  getProfile(userId: string | number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.mockApiUrl}/${userId}`).pipe(
      catchError(_err => throwError(() => new Error('Failed to load profile')))
    );
  }

  /**
   * Update the user profile on the MockAPI
   */
  updateProfile(userId: string | number, data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.mockApiUrl}/${userId}`, data).pipe(
      tap(updatedProfile => {
        // Sync to local storage via AuthService for persistence
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const merged = { ...currentUser, ...updatedProfile };
          // LocalStorage update
          localStorage.setItem('auth_user', JSON.stringify(merged));
        }
        
        // Notify subscribers (Navbar)
        this.profileUpdatedSubject.next(updatedProfile);
      }),
      catchError(_err => throwError(() => new Error('Failed to update profile')))
    );
  }
}
