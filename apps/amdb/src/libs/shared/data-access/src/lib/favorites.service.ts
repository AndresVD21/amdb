import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface FavoriteStatus {
  isFavorite: boolean;
  status: string | null;
  imageUrl: string | null;
}

export interface FavoriteItem {
  mal_id: number;
  type: string;
  status: string;
  image_url: string;
  title: string;
}

export interface StatusOption {
  value: string;
  label: string;
  color: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private API = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  // Status options for anime
  public animeStatusOptions: StatusOption[] = [
    { value: 'watching', label: 'Watching', color: 'bg-blue-600', icon: 'play' },
    { value: 'completed', label: 'Completed', color: 'bg-green-600', icon: 'check-circle' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-600', icon: 'pause' },
    { value: 'dropped', label: 'Dropped', color: 'bg-red-600', icon: 'x-circle' },
    { value: 'plan-to-watch', label: 'Plan to Watch', color: 'bg-gray-600', icon: 'clock' }
  ];

  // Status options for manga
  public mangaStatusOptions: StatusOption[] = [
    { value: 'reading', label: 'Reading', color: 'bg-blue-600', icon: 'book-open' },
    { value: 'completed', label: 'Completed', color: 'bg-green-600', icon: 'check-circle' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-yellow-600', icon: 'pause' },
    { value: 'dropped', label: 'Dropped', color: 'bg-red-600', icon: 'x-circle' },
    { value: 'plan-to-read', label: 'Plan to Read', color: 'bg-gray-600', icon: 'clock' }
  ];

  getFavorites() {
    return this.http.get<FavoriteItem[]>(`${this.API}/favorites`, {
      withCredentials: true
    });
  }

  addToFavorites(malId: number, type: string, status?: string, imageUrl?: string, title?: string) {
    return this.http.post<FavoriteItem>(`${this.API}/favorites`, { malId, type, status, image_url: imageUrl, title }, {
      withCredentials: true
    });
  }

  removeFromFavorites(malId: number) {
    return this.http.delete<{malId: number}>(`${this.API}/favorites/${malId}`, {
      withCredentials: true
    });
  }

  checkFavorite(malId: number) {
    return this.http.get<FavoriteStatus>(`${this.API}/favorites/${malId}/check`, {
      withCredentials: true
    });
  }

  updateStatus(malId: number, status: string) {
    return this.http.patch<FavoriteItem>(`${this.API}/favorites/${malId}/status`, { status }, {
      withCredentials: true
    });
  }
}
