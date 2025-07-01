import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Anime } from './anime.model';

@Injectable({
  providedIn: 'root'
})
export class JikanService {

  private readonly API_URL = 'https://api.jikan.moe/v4';

  private http = inject(HttpClient);

  getTopAnime() {
    return this.http.get<{ data: Anime[] }>(`${this.API_URL}/top/anime`, {
      params: {
        // type: 'tv',
        filter: 'bypopularity',
        limit: 8,
        sfw: true
      }
    });
  }

  getTopManga() {
    return this.http.get<{ data: Anime[] }>(`${this.API_URL}/top/manga`, {
      params: {
        type: 'manga',
        filter: 'bypopularity',
        limit: 8
      }
    });
  }

  getDetailsById(id: number, type: string) {
    return this.http.get<{ data: Anime }>(`${this.API_URL}/${type}/${id}`);
  }

}
