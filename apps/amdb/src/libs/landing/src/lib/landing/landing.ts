import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, Search, Star, TrendingUp, Users, BookOpen, Play, Filter, Grid, List, LogOut, User, Settings, Bell } from 'lucide-angular';
import { AuthService } from '@amdb/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-landing',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  showUserMenu = false;
  viewMode: 'grid' | 'list' = 'grid';

  private auth = inject(AuthService);
  private router = inject(Router);

  // Lucide icons
  heartIcon = Heart;
  searchIcon = Search;
  starIcon = Star;
  trendingUpIcon = TrendingUp;
  usersIcon = Users;
  bookOpenIcon = BookOpen;
  playIcon = Play;
  filterIcon = Filter;
  gridIcon = Grid;
  listIcon = List;
  logOutIcon = LogOut;
  userIcon = User;
  settingsIcon = Settings;
  bellIcon = Bell;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  logout(): void {

    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.showUserMenu = false;
    });
  }
}
