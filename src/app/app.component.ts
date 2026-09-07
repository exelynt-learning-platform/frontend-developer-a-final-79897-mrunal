import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  // Track if current screen is handset / mobile
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, '(max-width: 900px)'])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  onToggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  onSideNavNavigate(): void {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset && this.drawer) {
        this.drawer.close();
      }
    });
  }
}
