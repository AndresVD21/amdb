import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteItem, StatusOption } from '@amdb/data-access';
import { Router } from '@angular/router';
import { List, PlayCircle, BookOpen, CheckCircle, Pause, Clock, XCircle } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { FavoritesService } from '@amdb/data-access';

@Component({
  selector: 'lib-list-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './list-item.html',
  styleUrls: ['./list-item.scss'],
})
export class ListItem {
  @Input() item!: FavoriteItem;
  @Input() statusOption: StatusOption | null = null;
  @Output() removeFromListEvent = new EventEmitter<FavoriteItem>();

  private favoritesService = inject(FavoritesService);
  private router = inject(Router);

  playCircleIcon = PlayCircle;
  bookOpenIcon = BookOpen;
  checkCircleIcon = CheckCircle;
  pauseIcon = Pause;
  clockIcon = Clock;
  xCircleIcon = XCircle;
  listIcon = List;

  navigateToItem(item: FavoriteItem): void {
    this.router.navigate(['/details', item.type, item.mal_id]);
  }

  removeFromList(event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking remove
    this.favoritesService.removeFromFavorites(this.item.mal_id).subscribe(() => {
      this.removeFromListEvent.emit(this.item);
    });
  }

  getStatusIcon(icon: any): any {
    switch (icon) {
      case 'playCircle':
        return this.playCircleIcon;
      case 'checkCircle':
        return this.checkCircleIcon;
      case 'pause':
        return this.pauseIcon;
      case 'clock':
        return this.clockIcon;
      case 'list':
        return this.listIcon;
      default:
        return this.listIcon;
    }
  }
}
