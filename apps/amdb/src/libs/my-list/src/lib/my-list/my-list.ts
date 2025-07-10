import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FavoritesService } from '@amdb/data-access';
import { FavoriteItem, StatusOption } from '@amdb/data-access';
import { List, ArrowLeft, PlayCircle, CheckCircle, Pause, XCircle, Clock, BookOpen, Star, Calendar, TrendingUp } from 'lucide-angular';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ListItem } from './list-item/list-item';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'lib-my-list',
  imports: [CommonModule, LucideAngularModule, ListItem],
  templateUrl: './my-list.html',
  styleUrl: './my-list.scss',
})
export class MyList implements OnInit, OnDestroy {
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private location = inject(Location);

  private destroy$ = new Subject<void>();

  favorites: FavoriteItem[] = [];
  statusOptions: StatusOption[] = [];
  filteredList: FavoriteItem[] = [];

  // Lucide icons
  listIcon = List;
  arrowLeftIcon = ArrowLeft;
  playCircleIcon = PlayCircle;
  checkCircleIcon = CheckCircle;
  pauseIcon = Pause;
  clockIcon = Clock;
  bookOpenIcon = BookOpen;
  starIcon = Star;
  calendarIcon = Calendar;
  trendingUpIcon = TrendingUp;
  xCircleIcon = XCircle;

  activeFilter: 'all' | 'anime' | 'manga' = 'all';

  ngOnInit() {
    this.loadStatusOptions();
    this.getFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFavorites(): void {
    this.favoritesService.getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
      this.favorites = favorites;
      this.filteredList = this.getFilteredList();
    });
  }

  goBack(): void {
    this.location.back();
  }

  private loadStatusOptions(): void {
    this.statusOptions = [
      ...this.favoritesService.animeStatusOptions,
      ...this.favoritesService.mangaStatusOptions.filter(option =>
        !this.favoritesService.animeStatusOptions.some(animeOption =>
          animeOption.value === option.value
        )
      )
    ];
  }

  // Filter and sort methods
  setActiveFilter(filter: 'all' | 'anime' | 'manga'): void {
    this.activeFilter = filter;
    this.filteredList = this.getFilteredList();
  }

  getFilteredList(): FavoriteItem[] {
    let filtered = this.favorites;

    // Apply filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === this.activeFilter);
    }

    // Apply sort
    return filtered;
  }



  // Status-based grouping
  getListByStatus(status: FavoriteItem['status']): FavoriteItem[] {
    return this.filteredList.filter(item => item.status === status);
  }

  getUnorganizedItems(): FavoriteItem[] {
    const knownStatuses = this.statusOptions.map(option => option.value);
    const filtered = this.getFilteredList();
    return filtered.filter(item => !knownStatuses.includes(item.status));
  }

  hasItemsInStatus(status: FavoriteItem['status']): boolean {
    return this.getListByStatus(status).length > 0;
  }

  getStatusIcon(iconName: string) {
    switch (iconName) {
      case 'play': return this.playCircleIcon;
      case 'book-open': return this.bookOpenIcon;
      case 'check-circle': return this.checkCircleIcon;
      case 'pause': return this.pauseIcon;
      case 'x-circle': return this.xCircleIcon;
      case 'clock': return this.clockIcon;
      default: return this.listIcon;
    }
  }

  getFilterButtonClass(filter: 'all' | 'anime' | 'manga'): string {
    const baseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    if (this.activeFilter === filter) {
      return `${baseClass} bg-gray-300 text-gray-900`;
    }
    return `${baseClass} bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white`;
  }

  getListStats() {
    const list = this.favorites;
    return {
      total: list.length,
      anime: list.filter(item => item.type === 'anime').length,
      manga: list.filter(item => item.type === 'manga').length,
      watching: list.filter(item => item.status === 'watching').length,
      reading: list.filter(item => item.status === 'reading').length,
      completed: list.filter(item => item.status === 'completed').length,
      planToWatch: list.filter(item => item.status === 'plan-to-watch').length,
      planToRead: list.filter(item => item.status === 'plan-to-read').length,
      onHold: list.filter(item => item.status === 'on-hold').length,
      dropped: list.filter(item => item.status === 'dropped').length
    };
  }

  removeFromList(item: FavoriteItem): void {
    this.getFavorites();
  }

  navigateToItem(item: FavoriteItem): void {
    this.router.navigate(['/details', item.type, item.mal_id]);
  }
}
