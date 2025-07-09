import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Anime } from '@amdb/data-access';
import {
  LucideAngularModule,
  Play,
  BookOpen,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Heart,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
  Award,
  Globe,
  Building2,
  Tv,
  Plus,
  Check,
  X,
  ChevronDown,
  PlayCircle,
  CheckCircle,
  Pause,
  XCircle,
} from 'lucide-angular';
import { JikanService } from '@amdb/data-access';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FavoritesService } from '@amdb/data-access';

interface StatusOption {
  value: string;
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'lib-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private jikanService = inject(JikanService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private favoritesService = inject(FavoritesService);
  private location = inject(Location);

  animeId = '';
  anime?: Anime;
  animeType: 'anime' | 'manga' = 'anime';

  arrowLeftIcon = ArrowLeft;
  starIcon = Star;
  calendarIcon = Calendar;
  clockIcon = Clock;
  usersIcon = Users;
  heartIcon = Heart;
  playIcon = Play;
  share2Icon = Share2;
  bookmarkIcon = Bookmark;
  eyeIcon = Eye;
  trendingUpIcon = TrendingUp;
  awardIcon = Award;
  globeIcon = Globe;
  building2Icon = Building2;
  tvIcon = Tv;
  bookOpenIcon = BookOpen;
  plusIcon = Plus;
  checkIcon = Check;
  xIcon = X;
  playCircleIcon = PlayCircle;
  checkCircleIcon = CheckCircle;
  pauseIcon = Pause;
  xCircleIcon = XCircle;
  chevronDownIcon = ChevronDown;

  isLoading = true;
  isFavorite = false;
  showStatusDropdown = false;
  statusOptions: StatusOption[] = [];
  currentStatus: StatusOption | null | undefined = null;

  // Status options for anime
  public animeStatusOptions = [
    { value: 'watching', label: 'Watching', color: 'bg-blue-600', icon: 'play' },
    { value: 'completed', label: 'Completed', color: 'bg-green-600', icon: 'check-circle' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-600', icon: 'pause' },
    { value: 'dropped', label: 'Dropped', color: 'bg-red-600', icon: 'x-circle' },
    { value: 'plan-to-watch', label: 'Plan to Watch', color: 'bg-gray-600', icon: 'clock' }
  ];

  // Status options for manga
  public mangaStatusOptions = [
    { value: 'reading', label: 'Reading', color: 'bg-blue-600', icon: 'book-open' },
    { value: 'completed', label: 'Completed', color: 'bg-green-600', icon: 'check-circle' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-600', icon: 'pause' },
    { value: 'dropped', label: 'Dropped', color: 'bg-red-600', icon: 'x-circle' },
    { value: 'plan-to-read', label: 'Plan to Read', color: 'bg-gray-600', icon: 'clock' }
  ];

  get formattedGenres(): string {
    return this.anime?.genres?.map((genre) => genre.name).join(', ') || '';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.animeId = params['id'];
      this.animeType = params['type'];
      this.statusOptions = this.getStatusOptions(this.animeType);

      this.getDetails();
    });
  }

  getStatusOptions(type: 'anime' | 'manga'): StatusOption[] {
    return type === 'anime' ? this.animeStatusOptions : this.mangaStatusOptions;
  }

  getTrailerEmbedUrl(): SafeResourceUrl | null {
    if (this.anime?.trailer?.embed_url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        this.anime.trailer.embed_url
      );
    }
    return null;
  }

  goBack(): void {
    this.location.back();
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getDetails(): void {
    this.jikanService
      .getDetailsById(+this.animeId, this.animeType)
      .subscribe((anime) => {
        this.anime = anime.data;
        this.isLoading = false;
        this.currentStatus = this.statusOptions.find((option) => option.value === this.anime?.status);
        this.checkFavorite();
      });
  }

  // Type guards
  isAnime(): boolean {
    return this.animeType === 'anime';
  }

  isManga(): boolean {
    return this.animeType === 'manga';
  }

  getEpisodesOrChapters(): string {
    if (!this.anime) return 'TBA';

    if (this.isAnime()) {
      return this.anime.episodes?.toString() || 'TBA';
    } else {
      return this.anime.chapters?.toString() || 'TBA';
    }
  }

  getVolumes(): string {
    if (!this.anime || this.isAnime()) return '';
    return this.anime.volumes?.toString() || 'TBA';
  }

  getDuration(): string {
    if (!this.anime || this.isManga()) return '';
    return this.anime.duration || '';
  }

  getBroadcast(): string {
    if (!this.anime || this.isManga()) return '';
    return this.anime.broadcast?.string || '';
  }

  getRating(): string {
    if (!this.anime) return '';

    if (this.isAnime()) {
      return this.anime.rating || '';
    }
    return '';
  }

  getSource(): string {
    if (!this.anime || this.isManga()) return '';
    return this.anime.source || '';
  }

  getSeason(): string {
    if (!this.anime || this.isManga()) return '';
    return this.anime.season ? `${this.anime.season.charAt(0).toUpperCase() + this.anime.season.slice(1)} ${this.anime.year}` : '';
  }

  getDateString(): string {
    if (!this.anime) return '';

    if (this.isAnime()) {
      return this.anime.aired?.string || '';
    } else {
      return this.anime.published?.string || '';
    }
  }

  addToFavorites(): void {
    this.favoritesService.addToFavorites(this.anime!.mal_id, this.animeType).subscribe(() => {
      this.isFavorite = true;
    });
  }

  removeFromFavorites(): void {
    this.favoritesService.removeFromFavorites(this.anime!.mal_id).subscribe(() => {
      this.isFavorite = false;
    });
  }

  checkFavorite(): void {
    this.favoritesService.checkFavorite(this.anime!.mal_id).subscribe((res) => {
      this.isFavorite = res.isFavorite;
      this.currentStatus = this.statusOptions.find((option) => option.value === res.status);
    });
  }

  toggleFavorite(): void {
    if (!this.anime) return;

    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.anime.mal_id).subscribe(() => {
        this.isFavorite = false;
        this.currentStatus = undefined;
      });
    } else {
      this.favoritesService
        .addToFavorites(
          this.anime.mal_id,
          this.animeType,
          'plan-to-watch',
          this.anime.images.jpg.image_url,
          this.anime.title
        )
        .subscribe(() => {
          this.isFavorite = true;
          this.currentStatus = this.statusOptions.find(
            (option) => option.value === 'plan-to-watch'
          );
        });
    }
  }

  getListButtonText(): string {
    if (this.isFavorite) {
      return 'Remove from Favorite';
    }
    return 'Add to Favorite';
  }

  getListButtonIcon() {
    if (this.isFavorite) {
      return this.checkIcon;
    }
    return this.plusIcon;
  }

  getListButtonClass(): string {
    if (this.isFavorite) {
      return 'w-full py-3 px-4 bg-green-600 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-left space-x-2 transform hover:scale-105 group';
    }
    return 'w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105';
  }

  toggleStatusDropdown(): void {
    if (this.isFavorite) {
      this.showStatusDropdown = !this.showStatusDropdown;
    }
  }

  updateStatus(status: string): void {
    if (!this.anime || !this.isFavorite) return;

    this.currentStatus = this.statusOptions.find((option) => option.value === status);
    this.showStatusDropdown = false;

    this.favoritesService.updateStatus(this.anime.mal_id, status).subscribe({
      next: (response) => {
        console.log('Status updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        // Revert the UI state if the API call fails
        this.currentStatus = this.statusOptions.find((option) => option.value === this.currentStatus?.value);
      }
    });
  }

  getStatusIcon(iconName: string) {
    switch (iconName) {
      case 'play': return this.playCircleIcon;
      case 'book-open': return this.bookOpenIcon;
      case 'check-circle': return this.checkCircleIcon;
      case 'pause': return this.pauseIcon;
      case 'x-circle': return this.xCircleIcon;
      case 'clock': return this.clockIcon;
      default: return this.plusIcon;
    }
  }
}
