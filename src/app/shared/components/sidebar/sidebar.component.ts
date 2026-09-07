import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() navigate = new EventEmitter<void>();
  homeExpanded = false;  
  employeeExpanded = false;
  private routerSub!: Subscription;

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.checkActiveRoute(this.router.url);

    // Listen to route changes to keep parent expanded
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkActiveRoute(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private checkActiveRoute(url: string): void {
    if (url.includes('/employee-management')) {
      this.employeeExpanded = true;
    }
  }
 toggleHomeMenu(): void {
  if (!this.isCollapsed) {
    this.homeExpanded = !this.homeExpanded;
  }
}
  toggleEmployeeMenu(): void {
    if (this.isCollapsed) {
      // If collapsed, clicking it navigates to the default child route (employees)
      this.router.navigate(['/employee-management/employees']);
      return;
    }
    
    this.employeeExpanded = !this.employeeExpanded;
  }

  onLinkClick(): void {
    this.navigate.emit();
  }
}
