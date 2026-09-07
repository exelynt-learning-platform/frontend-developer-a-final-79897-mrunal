import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  isDarkMode = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes to keep toggle in sync
    this.subscriptions.add(this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}