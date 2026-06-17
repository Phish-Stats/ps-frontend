import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Music2, TrendingUp } from 'lucide-react';
import { mockSongs, mockChasingList } from '../lib/mockData';
import USMap from '../components/USMap';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const THIS_YEAR = new Date().getFullYear();
const topSongs = [...mockSongs].sort((a, b) => b.times_played - a.times_played).slice(0, 8);

export default function Landing() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const { data: tourConcerts = [] } = useQuery({
    queryKey: ['concerts', THIS_YEAR],
    queryFn: () => api.getConcerts(THIS_YEAR),
  });
  const tourStates = new Set(tourConcerts.map(c => c.state_abbr).filter(s => s !== ''));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Track every show.<br className="sm:hidden" /> Chase every song.
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Your personal Phish stats — shows attended, setlists, chasing lists, and more.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Map + Recent Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <USMap
            concerts={tourConcerts}
            visitedStates={tourStates}
            title={`${THIS_YEAR} Tour`}
            subtitle={`${tourConcerts.length} shows · ${tourStates.size} states`}
          />
        </div>
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6 h-full">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Shows</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest Phish concerts</p>
            </div>
            <ul className="space-y-1">
              {[...tourConcerts]
                .filter(c => c.date <= new Date().toISOString().slice(0, 10))
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)
                .map(show => (
                <li key={show.id} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="shrink-0 w-10 text-center">
                    <p className="text-xs font-semibold text-primary uppercase">
                      {new Date(show.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {new Date(show.date + 'T12:00:00').getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{show.venue}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{show.city}, {show.state_abbr}</p>
                  </div>
                  {show.setlist_url && (
                    <a href={show.setlist_url} className="shrink-0 text-xs text-primary hover:text-primary-600 font-medium flex items-center gap-0.5">
                      Setlist <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Songs Year + Top Chased */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Songs */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Top Songs</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Most played all-time</p>
            </div>
          </div>
          <ol className="space-y-2">
            {topSongs.map((song, idx) => (
              <li key={song.id} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs font-bold text-slate-400 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{song.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{song.album?.title}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary tabular-nums">
                  {song.times_played.toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Top Chased Songs */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Most Chased</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Songs fans are hunting for</p>
            </div>
          </div>
          <ol className="space-y-3">
            {mockChasingList.map((item, idx) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs font-bold text-slate-400 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.song.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.song.album?.title} · {item.song.times_played} plays</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link
              to="/login?mode=register"
              className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1"
            >
              Create your own chasing list <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
