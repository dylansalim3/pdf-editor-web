import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit {
  sidebarCollapsed = false;
  breadcrumbs: {label: string, url: string}[] = [];
  isFullBleedPage = false;
  
  darkMode = false;
  showPreferences = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.generateBreadcrumbs();
      this.checkFullBleed();
    });
  }

  ngOnInit() {
    this.generateBreadcrumbs();
    this.checkFullBleed();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark');
    }
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }

  private generateBreadcrumbs() {
    const url = this.router.url;
    this.breadcrumbs = [{label: 'Home', url: '/'}];
    
    if (url !== '/') {
      const parts = url.split('/').filter(p => p);
      let currentUrl = '';
      
      parts.forEach((part, index) => {
        currentUrl += `/${part}`;
        let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        
        if (part === 'tools' || part === 'convert') {
          label = part.charAt(0).toUpperCase() + part.slice(1);
        }
        
        this.breadcrumbs.push({
          label: label,
          url: currentUrl
        });
      });
    } else {
      this.breadcrumbs.push({label: 'Dashboard', url: '/'});
    }
  }

  private checkFullBleed() {
    this.isFullBleedPage = this.router.url.includes('/stitch');
  }
}
