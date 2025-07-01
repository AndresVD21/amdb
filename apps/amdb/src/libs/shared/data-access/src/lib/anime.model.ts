export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface TimeProps {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface TimePeriod {
  from: string;
  to: string | null;
  prop: {
    from: TimeProps;
    to: TimeProps;
  };
  string: string;
}

export interface AnimeBroadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface AnimeTrailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: TrailerImages;
}

export interface TrailerImages {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface Creator {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
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
  title_english?: string;
  title_japanese?: string;
  title_synonyms!: string[];
  type!: string;
  source?: string;
  episodes?: number;
  status!: string;
  airing?: boolean;
  aired?: TimePeriod;
  duration?: string;
  rating?: string;
  score!: number;
  scored_by!: number;
  rank!: number;
  popularity!: number;
  members!: number;
  favorites!: number;
  synopsis!: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast?: AnimeBroadcast;
  producers?: Creator[];
  licensors?: Creator[];
  studios?: Creator[];
  genres!: Genre[];
  explicit_genres!: Genre[];
  themes!: Genre[];
  demographics!: Genre[];

  // Manga specific fields
  chapters?: number | null;
  volumes?: number | null;
  publishing?: boolean;
  published?: TimePeriod;
  authors?: Creator[];
  serializations?: Creator[];

  // Anime specific fields
  trailer?: AnimeTrailer;

  constructor(data: Partial<Anime> = {}) {
    Object.assign(this, data);
  }
}
