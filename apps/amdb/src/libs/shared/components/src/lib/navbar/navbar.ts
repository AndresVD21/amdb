import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '@amdb/auth';
import { Router, RouterModule } from '@angular/router';
import { LogOut, User, Settings, Bell, Search, Star } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-navbar',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  logOutIcon = LogOut;
  userIcon = User;
  settingsIcon = Settings;
  bellIcon = Bell;
  searchIcon = Search;
  starIcon = Star;

  showUserMenu = false;

  name = this.auth.getName();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.auth.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
