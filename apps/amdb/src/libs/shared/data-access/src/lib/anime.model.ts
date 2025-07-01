export interface AnimeImages {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeAired {
  from: string;
  to: string | null;
  prop: {
    from: {
      day: number;
      month: number;
      year: number;
    };
    to: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
  };
  string: string;
}

export interface AnimeBroadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface AnimeProducer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export class Anime {
  mal_id!: number;
  url!: string;
  images!: AnimeImages;
  approved!: boolean;
  titles!: AnimeTitle[];
  title!: string;
  title_english!: string | null;
  title_japanese!: string;
  title_synonyms!: string[];
  type!: string;
  source!: string;
  episodes!: number | null;
  status!: string;
  airing!: boolean;
  aired!: AnimeAired;
  duration!: string;
  rating!: string;
  score!: number;
  scored_by!: number;
  rank!: number;
  popularity!: number;
  members!: number;
  favorites!: number;
  synopsis!: string;
  background!: string;
  season!: string;
  year!: number;
  broadcast!: AnimeBroadcast;
  producers!: AnimeProducer[];
  licensors!: AnimeProducer[];
  studios!: AnimeProducer[];
  genres!: AnimeGenre[];
  explicit_genres!: AnimeGenre[];
  themes!: AnimeGenre[];
  demographics!: AnimeGenre[];

  constructor(data: Partial<Anime> = {}) {
    Object.assign(this, data);
  }
}
