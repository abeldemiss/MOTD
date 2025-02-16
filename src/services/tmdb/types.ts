export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  original_language: string;
  credits?: Credits;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface WatchProviders {
  results: {
    [countryCode: string]: {
      link: string;
      rent?: Provider[];
      buy?: Provider[];
      flatrate?: Provider[];
    };
  };
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface DiscoverParams {
  page?: number;
  with_genres?: string;
  primary_release_year?: string;
  sort_by?: string;
} 