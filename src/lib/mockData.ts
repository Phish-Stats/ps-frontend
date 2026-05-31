import type { Concert, Song, ChasingListSong, ShowsPerYear, StatsOverview } from '../types';

export const mockStats: StatsOverview = {
  shows_attended: 47,
  unique_songs: 183,
  years_following: 9,
  states_visited: 14,
  longest_drought_days: 847,
  favorite_venue: 'MSG',
};

export const mockShowsPerYear: ShowsPerYear[] = [
  { year: 2018, count: 3 },
  { year: 2019, count: 6 },
  { year: 2020, count: 0 },
  { year: 2021, count: 4 },
  { year: 2022, count: 8 },
  { year: 2023, count: 12 },
  { year: 2024, count: 14 },
];

export const mockRecentConcerts: Concert[] = [
  { id: 1, date: '2024-12-31', venue: 'Madison Square Garden', city: 'New York', state: 'New York', state_abbr: 'NY', lat: 40.7505, lng: -73.9934, setlist_url: '#' },
  { id: 2, date: '2024-12-30', venue: 'Madison Square Garden', city: 'New York', state: 'New York', state_abbr: 'NY', lat: 40.7505, lng: -73.9934, setlist_url: '#' },
  { id: 3, date: '2024-08-03', venue: 'Red Rocks Amphitheatre', city: 'Morrison', state: 'Colorado', state_abbr: 'CO', lat: 39.6654, lng: -105.2057, setlist_url: '#' },
  { id: 4, date: '2024-07-27', venue: 'Ruoff Music Center', city: 'Noblesville', state: 'Indiana', state_abbr: 'IN', lat: 40.0442, lng: -86.0274, setlist_url: '#' },
  { id: 5, date: '2024-07-19', venue: 'Saratoga Performing Arts Center', city: 'Saratoga Springs', state: 'New York', state_abbr: 'NY', lat: 43.0756, lng: -73.7838, setlist_url: '#' },
];

export const mockAllConcerts: Concert[] = [
  ...mockRecentConcerts,
  { id: 6, date: '2023-08-04', venue: 'Alpine Valley Music Theatre', city: 'East Troy', state: 'Wisconsin', state_abbr: 'WI', lat: 42.6916, lng: -88.4060 },
  { id: 7, date: '2023-07-29', venue: 'Xfinity Center', city: 'Mansfield', state: 'Massachusetts', state_abbr: 'MA', lat: 42.0334, lng: -71.2395 },
  { id: 8, date: '2023-07-21', venue: 'Merriweather Post Pavilion', city: 'Columbia', state: 'Maryland', state_abbr: 'MD', lat: 39.2118, lng: -76.8619 },
  { id: 9, date: '2022-12-31', venue: 'Madison Square Garden', city: 'New York', state: 'New York', state_abbr: 'NY', lat: 40.7505, lng: -73.9934 },
  { id: 10, date: '2022-08-06', venue: 'Dicks Sporting Goods Park', city: 'Commerce City', state: 'Colorado', state_abbr: 'CO', lat: 39.8061, lng: -104.8922 },
  { id: 11, date: '2022-07-31', venue: 'Bethel Woods Center for the Arts', city: 'Bethel', state: 'New York', state_abbr: 'NY', lat: 41.6840, lng: -74.8899 },
  { id: 12, date: '2021-08-14', venue: 'Shoreline Amphitheatre', city: 'Mountain View', state: 'California', state_abbr: 'CA', lat: 37.4267, lng: -122.0806 },
  { id: 13, date: '2019-07-20', venue: 'Fenway Park', city: 'Boston', state: 'Massachusetts', state_abbr: 'MA', lat: 42.3467, lng: -71.0972 },
  { id: 14, date: '2019-01-01', venue: 'Madison Square Garden', city: 'New York', state: 'New York', state_abbr: 'NY', lat: 40.7505, lng: -73.9934 },
  { id: 15, date: '2018-09-01', venue: 'Northerly Island', city: 'Chicago', state: 'Illinois', state_abbr: 'IL', lat: 41.8490, lng: -87.6083 },
];

export const mockSongs: Song[] = [
  { id: 1, title: 'Tweezer', times_played: 672, album: { id: 1, title: 'Rift', release_year: 1993 } },
  { id: 2, title: 'You Enjoy Myself', times_played: 608, album: { id: 2, title: 'Junta', release_year: 1989 } },
  { id: 3, title: 'Reba', times_played: 548, album: { id: 3, title: 'Lawn Boy', release_year: 1990 } },
  { id: 4, title: 'Bathtub Gin', times_played: 512, album: { id: 4, title: 'Lawn Boy', release_year: 1990 } },
  { id: 5, title: 'Harry Hood', times_played: 487, album: { id: 5, title: 'A Picture of Nectar', release_year: 1992 } },
  { id: 6, title: 'Mike\'s Song', times_played: 531, album: { id: 6, title: 'Lawn Boy', release_year: 1990 } },
  { id: 7, title: 'Weekapaug Groove', times_played: 449, album: { id: 7, title: 'Lawn Boy', release_year: 1990 } },
  { id: 8, title: 'Stash', times_played: 421, album: { id: 8, title: 'A Picture of Nectar', release_year: 1992 } },
  { id: 9, title: 'Down with Disease', times_played: 398, album: { id: 9, title: 'Hoist', release_year: 1994 } },
  { id: 10, title: 'Divided Sky', times_played: 392, album: { id: 10, title: 'Junta', release_year: 1989 } },
  { id: 11, title: 'Run Like an Antelope', times_played: 387, album: { id: 11, title: 'Lawn Boy', release_year: 1990 } },
  { id: 12, title: 'Fluffhead', times_played: 264, album: { id: 12, title: 'Junta', release_year: 1989 } },
  { id: 13, title: 'Slave to the Traffic Light', times_played: 321, album: { id: 13, title: 'Junta', release_year: 1989 } },
  { id: 14, title: 'David Bowie', times_played: 407, album: { id: 14, title: 'Junta', release_year: 1989 } },
  { id: 15, title: 'Maze', times_played: 344, album: { id: 15, title: 'Rift', release_year: 1993 } },
  { id: 16, title: 'Sample in a Jar', times_played: 201, album: { id: 16, title: 'Hoist', release_year: 1994 } },
  { id: 17, title: 'Timber (Jerry)', times_played: 118, album: { id: 17, title: 'Billy Breathes', release_year: 1996 } },
  { id: 18, title: 'Ghost', times_played: 268, album: { id: 18, title: 'The Story of the Ghost', release_year: 1998 } },
  { id: 19, title: 'Piper', times_played: 203, album: { id: 19, title: 'The Story of the Ghost', release_year: 1998 } },
  { id: 20, title: 'Sand', times_played: 178, album: { id: 20, title: 'Farmhouse', release_year: 2000 } },
];

export const mockChasingList: ChasingListSong[] = [
  {
    id: 1,
    chasing_list_id: 1,
    position: 1,
    added_at: '2024-01-15',
    song: { id: 12, title: 'Fluffhead', times_played: 264, album: { id: 12, title: 'Junta', release_year: 1989 } },
  },
  {
    id: 2,
    chasing_list_id: 1,
    position: 2,
    added_at: '2024-02-03',
    song: { id: 10, title: 'Divided Sky', times_played: 392, album: { id: 10, title: 'Junta', release_year: 1989 } },
  },
  {
    id: 3,
    chasing_list_id: 1,
    position: 3,
    added_at: '2024-03-20',
    song: { id: 13, title: 'Slave to the Traffic Light', times_played: 321, album: { id: 13, title: 'Junta', release_year: 1989 } },
  },
  {
    id: 4,
    chasing_list_id: 1,
    position: 4,
    added_at: '2024-04-08',
    song: { id: 17, title: 'Timber (Jerry)', times_played: 118, album: { id: 17, title: 'Billy Breathes', release_year: 1996 } },
  },
  {
    id: 5,
    chasing_list_id: 1,
    position: 5,
    added_at: '2024-05-14',
    song: { id: 11, title: 'Run Like an Antelope', times_played: 387, album: { id: 11, title: 'Lawn Boy', release_year: 1990 } },
  },
];
