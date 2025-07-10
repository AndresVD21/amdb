import { Component, inject, OnDestroy } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Navbar } from '@amdb/components';
import { filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Footer } from '@amdb/components';

@Component({
  imports: [RouterModule, LucideAngularModule, Navbar, Footer, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  protected title = 'amdb';

  private router = inject(Router);

  showNavigation = true;

  private destroy$ = new Subject<void>();

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe((event: NavigationEnd) => {
        // Hide navigation on login and signup pages
        this.showNavigation = !this.isAuthPage(event.url);
      });
  }

  private isAuthPage(url: string): boolean {
    return url === '/login' || url === '/signup' || url.startsWith('/login') || url.startsWith('/signup');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
