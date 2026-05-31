export interface User {
  id: number;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Album {
  id: number;
  title: string;
  release_year: number;
  cover_url?: string;
}

export interface Song {
  id: number;
  title: string;
  album?: Album;
  times_played: number;
  debut_date?: string;
  last_played?: string;
}

export interface Concert {
  id: number;
  date: string;
  venue: string;
  city: string;
  state: string;
  state_abbr: string;
  lat?: number;
  lng?: number;
  notes?: string;
  setlist_url?: string;
}

export interface ChasingList {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  songs: ChasingListSong[];
}

export interface ChasingListSong {
  id: number;
  chasing_list_id: number;
  song: Song;
  position: number;
  added_at: string;
}

export interface HealthResponse {
  status: string;
  version?: string;
}

export interface StatsOverview {
  shows_attended: number;
  unique_songs: number;
  years_following: number;
  states_visited: number;
  longest_drought_days: number;
  favorite_venue: string;
}

export interface ShowsPerYear {
  year: number;
  count: number;
}
