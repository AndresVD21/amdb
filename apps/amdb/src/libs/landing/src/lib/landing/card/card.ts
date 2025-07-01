import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Play, BookOpen, Star } from 'lucide-angular';
import { Anime } from '@amdb/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-card',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() activeTab = 'anime';
  @Input() i = 0;
  @Input() item!: Anime;

  router = inject(Router);

  get formattedGenres(): string {
    return this.item.genres?.map(genre => genre.name).join(', ') || '';
  }

  playIcon = Play;
  bookOpenIcon = BookOpen;
  starIcon = Star;

  navigateToAnime() {
    this.router.navigate(['/details', this.activeTab, this.item.mal_id]);
  }
}
