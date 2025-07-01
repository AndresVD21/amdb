import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Heart, Search, Star, TrendingUp, Users, BookOpen, Play, Grid, List } from 'lucide-angular';
import { AuthService } from '@amdb/auth';
import { Router } from '@angular/router';
import { JikanService, Anime } from '@amdb/data-access';
import { Card } from './card/card';
import { Footer } from '@amdb/components';

@Component({
  selector: 'lib-landing',
  imports: [CommonModule, LucideAngularModule, Card, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  showUserMenu = false;
  viewMode: 'grid' | 'list' = 'grid';
  activeTab: 'anime' | 'manga' = 'anime';

  private auth = inject(AuthService);
  private router = inject(Router);
  private jikan = inject(JikanService);

  // Lucide icons
  heartIcon = Heart;
  searchIcon = Search;
  starIcon = Star;
  trendingUpIcon = TrendingUp;
  usersIcon = Users;
  bookOpenIcon = BookOpen;
  playIcon = Play;
  gridIcon = Grid;
  listIcon = List;

  topAnime: Anime[] = [];
  topManga: Anime[] = [];

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  setActiveTab(tab: 'anime' | 'manga'): void {
    this.activeTab = tab;
  }

  logout(): void {

    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.showUserMenu = false;
    });
  }

  ngOnInit(): void {
    this.initTopContent();
  }

  initTopContent(): void {
    this.jikan.getTopAnime().subscribe((res) => {
      this.topAnime = res.data;
    });
    this.jikan.getTopManga().subscribe((res) => {
      this.topManga = res.data;
    });
  }

  getActiveContent(): Anime[] {
    return this.activeTab === 'anime' ? this.topAnime : this.topManga;
  }
}
