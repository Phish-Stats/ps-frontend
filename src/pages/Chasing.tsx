import { useState } from 'react';
import { Star, GripVertical, X, Plus, Search, TrendingUp } from 'lucide-react';
import { mockChasingList, mockSongs } from '../lib/mockData';
import type { ChasingListSong } from '../types';

export default function Chasing() {
  const [list, setList] = useState<ChasingListSong[]>(mockChasingList);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const remove = (id: number) => {
    setList(prev => prev.filter(item => item.id !== id).map((item, i) => ({ ...item, position: i + 1 })));
  };

  const addSong = (songId: number) => {
    const song = mockSongs.find(s => s.id === songId);
    if (!song || list.some(item => item.song.id === songId)) return;
    const newItem: ChasingListSong = {
      id: Date.now(),
      chasing_list_id: 1,
      song,
      position: list.length + 1,
      added_at: new Date().toISOString(),
    };
    setList(prev => [...prev, newItem]);
    setShowSearch(false);
    setQuery('');
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const reordered = [...list];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    setList(reordered.map((item, i) => ({ ...item, position: i + 1 })));
    setDragIdx(null);
    setOverIdx(null);
  };

  const searchResults = mockSongs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) &&
    !list.some(item => item.song.id === s.id)
  ).slice(0, 6);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Chasing List</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Songs you're hunting to hear live</p>
        </div>
        <button
          onClick={() => setShowSearch(s => !s)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add song
        </button>
      </div>

      {/* Search box */}
      {showSearch && (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search songs..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          {query.length > 0 && (
            <ul className="space-y-1">
              {searchResults.length === 0 ? (
                <li className="text-sm text-slate-500 dark:text-slate-400 text-center py-3">No songs found</li>
              ) : (
                searchResults.map(song => (
                  <li key={song.id}>
                    <button
                      onClick={() => addSong(song.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Star className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{song.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{song.album?.title} · {song.times_played} plays</p>
                      </div>
                      <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {/* Chasing List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Star className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Your chasing list is empty</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add songs you want to hear live</p>
          </div>
        ) : (
          <ol>
            {list.map((item, idx) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                className={`flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-all cursor-grab active:cursor-grabbing ${
                  overIdx === idx && dragIdx !== idx ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Drag handle */}
                <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />

                {/* Position */}
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-blue-500">{idx + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.song.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.song.album?.title ?? 'Unknown'}
                  </p>
                </div>

                {/* Play count */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.song.times_played.toLocaleString()} plays</span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => remove(item.id)}
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Remove from list"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Hint */}
      {list.length > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Drag rows to reorder your list
        </p>
      )}
    </div>
  );
}
