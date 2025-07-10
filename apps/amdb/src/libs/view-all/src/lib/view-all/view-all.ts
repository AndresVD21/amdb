import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LucideAngularModule,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  X,
} from 'lucide-angular';
import { Anime, FilterGenre, JikanService } from '@amdb/data-access';
import { Card } from '@amdb/components';
import { Subject, takeUntil } from 'rxjs';

interface PaginationInfo {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

interface FilterOptions {
  genres: number[];
  status: string;
  rating: string;
  year: string;
  score: string;
  sort: string;
  order: 'asc' | 'desc';
}

@Component({
  selector: 'lib-view-all',
  imports: [CommonModule, LucideAngularModule, Card],
  templateUrl: './view-all.html',
  styleUrl: './view-all.scss',
})
export class ViewAll implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private jikanService = inject(JikanService);

  private destroy$ = new Subject<void>();

  isLoading = true;
  contentType: 'anime' | 'manga' = 'anime';

  contentItems: Anime[] = [];

  // Pagination
  pagination: PaginationInfo = {
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1,
    items: {
      count: 0,
      total: 0,
      per_page: 25,
    },
  };

  // Genres
  genres: FilterGenre[] = [];
  selectedGenres: number[] = [];

  filters: FilterOptions = {
    genres: [],
    status: '',
    rating: '',
    year: '',
    score: '',
    sort: 'popularity',
    order: 'asc',
  };

  // Icons
  arrowLeftIcon = ArrowLeft;
  searchIcon = Search;
  starIcon = Star;
  calendarIcon = Calendar;
  trendingUpIcon = TrendingUp;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  chevronsLeftIcon = ChevronsLeft;
  chevronsRightIcon = ChevronsRight;
  slidersHorizontalIcon = SlidersHorizontal;
  xIcon = X;

  showFilters = false;

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.contentType = params['type'];
      this.isLoading = true;
      this.getGenres();
      this.getActiveContent();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Content interaction methods
  navigateToDetails(item: Anime): void {
    this.router.navigate(['/details', this.contentType, item.mal_id]);
  }

  // Filter methods
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getGenres() {
    this.jikanService.getGenres(this.contentType)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.genres = res.data;
    });
  }

  toggleGenre(genreId: number): void {
    const index = this.selectedGenres.indexOf(genreId);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genreId);
    }
    this.filters.genres = this.selectedGenres;
    this.applyFilters();
  }

  isGenreSelected(genreId: number): boolean {
    return this.selectedGenres.includes(genreId);
  }

  clearGenres(): void {
    this.selectedGenres = [];
    this.filters.genres = [];
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedGenres = [];
    this.filters = {
      genres: [],
      status: '',
      rating: '',
      year: '',
      score: '',
      sort: 'popularity',
      order: 'asc'
    };
    this.applyFilters();
  }

  private applyFilters(): void {
    // Reset to first page when applying filters
    this.pagination.current_page = 1;
    this.getActiveContent();
  }

  // Utility methods
  getSelectedGenreNames(): string[] {
    return this.genres
      .filter((genre) => this.selectedGenres.includes(genre.mal_id))
      .map((genre) => genre.name);
  }

  getGenreMalId(genreName: string): number {
    const genre = this.genres.find((g) => g.name === genreName);
    return genre ? genre.mal_id : 0;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedGenres.length > 0) count++;
    if (this.filters.status) count++;
    if (this.filters.rating) count++;
    if (this.filters.year) count++;
    if (this.filters.score) count++;
    return count;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getActiveContent() {
    this.isLoading = true;
    return this.jikanService.getContentByGenre(this.contentType, this.filters.genres, this.pagination.current_page)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      this.isLoading = false;
      this.contentItems = res.data;
      this.pagination = res.pagination;
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.last_visible_page) {
      this.pagination.current_page = page;
      this.getActiveContent();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.pagination.last_visible_page);
  }

  goToPreviousPage(): void {
    if (this.pagination.current_page > 1) {
      this.goToPage(this.pagination.current_page - 1);
    }
  }

  goToNextPage(): void {
    if (this.pagination.has_next_page) {
      this.goToPage(this.pagination.current_page + 1);
    }
  }

  getVisiblePageNumbers(): number[] {
    const current = this.pagination.current_page;
    const total = this.pagination.last_visible_page;
    const delta = 2; // Number of pages to show on each side of current page

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    // Adjust if we're near the beginning or end
    if (current <= delta + 1) {
      end = Math.min(total, 2 * delta + 1);
    }
    if (current >= total - delta) {
      start = Math.max(1, total - 2 * delta);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  calcTopMaxPage() {
    return Math.min(this.pagination.current_page * this.pagination.items.per_page, this.pagination.items.total);
  }
}
