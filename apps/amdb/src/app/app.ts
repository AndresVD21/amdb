import { Component, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Navbar } from '@amdb/components';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, LucideAngularModule, Navbar, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'amdb';

  private router = inject(Router);

  showNavigation = true;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide navigation on login and signup pages
        this.showNavigation = !this.isAuthPage(event.url);
      });
  }

  private isAuthPage(url: string): boolean {
    return url === '/login' || url === '/signup' || url.startsWith('/login') || url.startsWith('/signup');
  }
}
