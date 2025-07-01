import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '@amdb/auth';
import { Router, RouterModule } from '@angular/router';
import { LogOut, User, Settings, Bell, Search } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'lib-navbar',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private auth = inject(AuthService);
  private router = inject(Router);

  logOutIcon = LogOut;
  userIcon = User;
  settingsIcon = Settings;
  bellIcon = Bell;
  searchIcon = Search;

  showUserMenu = false;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
