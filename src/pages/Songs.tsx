import { useState } from 'react';
import { Search, Music, TrendingUp } from 'lucide-react';
import { mockSongs } from '../lib/mockData';

export default function Songs() {
  const [query, setQuery] = useState('');

  const filtered = mockSongs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.album?.title.toLowerCase().includes(query.toLowerCase())
  );

  const maxPlays = Math.max(...mockSongs.map(s => s.times_played));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Songs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} song{filtered.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search songs or albums..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
          />
        </div>
      </div>

      {/* Songs Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No songs match "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(song => {
            const pct = (song.times_played / maxPlays) * 100;
            return (
              <div
                key={song.id}
                className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-4 hover:shadow-md dark:hover:border-slate-600 transition-all group"
              >
                {/* Album art placeholder */}
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center mb-3 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-colors">
                  <Music className="w-8 h-8 text-blue-400 dark:text-blue-500" />
                </div>

                <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{song.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{song.album?.title ?? 'Unknown Album'}</p>

                {/* Play count bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Plays
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{song.times_played.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
