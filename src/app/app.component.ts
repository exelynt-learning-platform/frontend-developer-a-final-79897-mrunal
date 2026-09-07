import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employee-management-system';
  
  constructor(_themeService: ThemeService) {}

  ngOnInit(): void {
    // ThemeService constructor automatically initializes the theme on load.
  }
}
