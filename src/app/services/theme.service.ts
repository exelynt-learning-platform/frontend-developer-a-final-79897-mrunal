import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  
  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to light if no theme is saved
    const isDark = savedTheme === 'dark';
    
    this.isDarkModeSubject.next(isDark);
    this.applyThemeClass(isDark);
  }

  get isDarkMode$(): Observable<boolean> {
    return this.isDarkModeSubject.asObservable();
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  toggleTheme(): void {
    const newState = !this.isDarkModeSubject.value;
    
    this.isDarkModeSubject.next(newState);
    this.applyThemeClass(newState);
    
    localStorage.setItem('theme', newState ? 'dark' : 'light');
  }

  setTheme(isDark: boolean): void {
    if (this.isDarkModeSubject.value !== isDark) {
      this.isDarkModeSubject.next(isDark);
      this.applyThemeClass(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  private applyThemeClass(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
      // Also set data-theme attribute to leverage existing variables in variables.css
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}
