import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Music2,
  Map,
  Calendar,
  Compass,
  GripVertical,
  ArrowRight,
  Flame,
  Building2,
  Clock,
} from 'lucide-react';
import {
  mockStats,
  mockShowsPerYear,
  mockRecentConcerts,
  mockChasingList,
} from '../lib/mockData';

// ── Hero Stat Chip ──────────────────────────────────────────────
interface StatChipProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: string;
}

function StatChip({ icon, value, label, gradient }: StatChipProps) {
  return (
    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm dark:border dark:border-slate-700/60 overflow-hidden`}>
      <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${gradient}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold leading-none tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
      <p className="text-blue-500 font-medium">{payload[0].value} shows</p>
    </div>
  );
}

// ── US Map Placeholder ──────────────────────────────────────────
function USMapCard() {
  // Concert pin positions roughly mapped to US coordinates
  const pins = [
    { x: '79%', y: '28%', label: 'NY' },   // New York
    { x: '62%', y: '20%', label: 'WI' },   // Wisconsin
    { x: '76%', y: '22%', label: 'MA' },   // Boston
    { x: '42%', y: '38%', label: 'CO' },   // Colorado
    { x: '60%', y: '44%', label: 'IN' },   // Indiana
    { x: '62%', y: '34%', label: 'IL' },   // Chicago
    { x: '74%', y: '34%', label: 'MD' },   // Maryland
    { x: '17%', y: '52%', label: 'CA' },   // California
  ];

  return (
    <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden p-6 h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Shows Map</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">14 states visited</p>
        </div>
        <Compass className="w-5 h-5 text-slate-400" />
      </div>

      {/* SVG Map Background */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/50">
        <svg
          viewBox="0 0 960 600"
          className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Simplified US outline */}
          <path d="M 80 120 L 180 80 L 260 70 L 320 60 L 420 55 L 520 50 L 640 55 L 720 65 L 790 85 L 840 95 L 880 110 L 890 160 L 880 200 L 860 260 L 830 300 L 820 340 L 800 380 L 760 420 L 720 440 L 680 450 L 620 455 L 560 450 L 500 440 L 420 445 L 360 460 L 280 470 L 220 460 L 180 450 L 120 430 L 80 400 L 65 360 L 60 300 L 65 240 L 70 180 Z" />
          {/* Grid dots pattern */}
          {Array.from({ length: 12 }, (_, row) =>
            Array.from({ length: 20 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={48 + col * 46}
                cy={60 + row * 44}
                r="1.5"
                fill="currentColor"
              />
            ))
          )}
        </svg>

        {/* Concert pins */}
        {pins.map((pin) => (
          <div
            key={pin.label}
            className="absolute flex flex-col items-center"
            style={{ left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-800 shadow-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const stats = mockStats;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your Phish journey at a glance</p>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatChip
          icon={<Music2 className="w-4 h-4 text-white" />}
          value={stats.shows_attended}
          label="Shows Attended"
          gradient="bg-blue-500"
        />
        <StatChip
          icon={<ListMusicIcon />}
          value={stats.unique_songs}
          label="Unique Songs"
          gradient="bg-purple-500"
        />
        <StatChip
          icon={<Calendar className="w-4 h-4 text-white" />}
          value={stats.years_following}
          label="Years Following"
          gradient="bg-emerald-500"
        />
        <StatChip
          icon={<Map className="w-4 h-4 text-white" />}
          value={stats.states_visited}
          label="States Visited"
          gradient="bg-orange-500"
        />
      </div>

      {/* Map + Chasing List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map — 7 cols */}
        <div className="lg:col-span-7">
          <USMapCard />
        </div>

        {/* Chasing List — 5 cols */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Chasing List</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Songs you're hunting for</p>
              </div>
              <Link to="/chasing" className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <ol className="space-y-2">
              {mockChasingList.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group transition-colors">
                  <span className="w-5 shrink-0 text-sm font-bold text-slate-400 dark:text-slate-600 text-center">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.song.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.song.album?.title} · {item.song.times_played} plays</p>
                  </div>
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Shows Per Year Chart + Recent Shows Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart — 7 cols */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Shows Per Year</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">2018 – 2024</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockShowsPerYear} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Shows — 5 cols */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Shows</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last 5 concerts</p>
              </div>
              <Link to="/shows" className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                All shows <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <ul className="space-y-1">
              {mockRecentConcerts.map((show) => (
                <li key={show.id} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="shrink-0 w-10 text-center">
                    <p className="text-xs font-semibold text-blue-500 uppercase">
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
                    <a
                      href={show.setlist_url}
                      className="shrink-0 text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-0.5"
                    >
                      Setlist <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fun Stats Strip */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-emerald-900/20 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5">
        <div className="flex flex-wrap gap-6 justify-around">
          <FunStat
            icon={<Clock className="w-4 h-4 text-orange-400" />}
            label="Longest drought"
            value="847 days"
          />
          <FunStat
            icon={<Building2 className="w-4 h-4 text-blue-400" />}
            label="Favorite venue"
            value="MSG"
          />
          <FunStat
            icon={<Flame className="w-4 h-4 text-red-400" />}
            label="Hottest year"
            value="2024"
          />
          <FunStat
            icon={<Music2 className="w-4 h-4 text-purple-400" />}
            label="Most seen song"
            value="Tweezer"
          />
          <FunStat
            icon={<Map className="w-4 h-4 text-emerald-400" />}
            label="Farthest show"
            value="Morrison, CO"
          />
        </div>
      </div>
    </div>
  );
}

function FunStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}:</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

function ListMusicIcon() {
  return (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
    </svg>
  );
}
