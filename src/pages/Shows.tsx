import { useState } from 'react';
import { ArrowRight, Filter, CalendarDays } from 'lucide-react';
import { mockAllConcerts } from '../lib/mockData';
import type { Concert } from '../types';

const years = [...new Set(mockAllConcerts.map(c => new Date(c.date).getFullYear()))].sort((a, b) => b - a);

function ShowRow({ show }: { show: Concert }) {
  const date = new Date(show.date + 'T12:00:00');
  return (
    <div className="flex items-center gap-4 py-3.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors group">
      {/* Date column */}
      <div className="shrink-0 w-14 text-center">
        <p className="text-xs font-semibold text-blue-500 uppercase">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </p>
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{date.getDate()}</p>
        <p className="text-xs text-slate-400">{date.getFullYear()}</p>
      </div>

      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 shrink-0" />

      {/* Show info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{show.venue}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{show.city}, {show.state_abbr}</p>
      </div>

      {/* Badge */}
      <div className="shrink-0 hidden sm:flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {show.state_abbr}
        </span>
      </div>

      {show.setlist_url && (
        <a
          href={show.setlist_url}
          className="shrink-0 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Setlist <ArrowRight className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

export default function Shows() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const filtered = selectedYear === 'all'
    ? mockAllConcerts
    : mockAllConcerts.filter(c => new Date(c.date).getFullYear() === selectedYear);

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Shows</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} concert{filtered.length !== 1 ? 's' : ''} {selectedYear !== 'all' ? `in ${selectedYear}` : 'total'}
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedYear === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedYear === y
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shows List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No shows in {selectedYear}</p>
          </div>
        ) : (
          <div className="p-2">
            {sorted.map(show => (
              <ShowRow key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
