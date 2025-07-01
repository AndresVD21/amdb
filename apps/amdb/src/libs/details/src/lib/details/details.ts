import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from 'lucide-angular';
import { JikanService } from '@amdb/data-access';
import { Footer } from '@amdb/components';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'lib-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Footer],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  route = inject(ActivatedRoute);
  jikanService = inject(JikanService);
  router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  animeId = '';
  anime?: Anime;
  animeType = '';

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

  isLoading = true;

  get formattedGenres(): string {
    return this.anime?.genres?.map((genre) => genre.name).join(', ') || '';
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
    this.router.navigate(['/']);
  }

  playTrailer(): void {
    if (this.anime?.trailer?.url) {
      window.open(this.anime.trailer.url, '_blank');
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.animeId = params['id'];
      this.animeType = params['type'];

      this.jikanService
        .getDetailsById(+this.animeId, this.animeType)
        .subscribe((anime) => {
          this.anime = anime.data;
          this.isLoading = false;
        });
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

  addToList(): void {
    // Here you would implement the logic to add the anime to user's list
    console.log('Adding anime to list:', this.anime?.title);
    // You could show a modal to select the list type (watching, completed, plan to watch, etc.)
  }
}
