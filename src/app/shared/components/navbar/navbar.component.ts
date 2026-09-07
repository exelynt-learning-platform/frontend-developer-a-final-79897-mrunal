import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: { name: string; role: string; initials: string; avatar?: string } = {
    name: 'Admin User',
    role: 'HR Administrator',
    initials: 'AU'
  };

  showUserDropdown = false;
  private profileSub!: Subscription;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen for live profile updates
    this.profileSub = this.profileService.profileUpdated$.subscribe(user => {
      if (user) {
        const nameParts = (user.name || 'Admin User').split(' ');
        const initials = nameParts.length >= 2
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : (user.name || 'AU').substring(0, 2).toUpperCase();
        
        this.currentUser = {
          name: user.name || 'Admin User',
          role: user.role || 'HR Administrator',
          initials,
          avatar: user.avatar
        };
      }
    });
  }

  ngOnDestroy(): void {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  toggleDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeDropdown(): void {
    this.showUserDropdown = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
