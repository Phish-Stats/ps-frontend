import { Link } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
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
      <p className="text-primary font-medium">{payload[0].value} shows</p>
    </div>
  );
}

// ── US Map ──────────────────────────────────────────────────────
const MAP_PINS = [
  { label: 'NY',  coordinates: [-74.006, 40.713] as [number, number] },
  { label: 'MA',  coordinates: [-71.057, 42.361] as [number, number] },
  { label: 'CO',  coordinates: [-104.99, 39.739] as [number, number] },
  { label: 'IL',  coordinates: [-87.629, 41.878] as [number, number] },
  { label: 'WI',  coordinates: [-89.401, 43.073] as [number, number] },
  { label: 'MD',  coordinates: [-76.612, 39.29]  as [number, number] },
  { label: 'CA',  coordinates: [-118.24, 34.052] as [number, number] },
  { label: 'IN',  coordinates: [-86.158, 39.768] as [number, number] },
];

function USMapCard() {
  return (
    <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden p-6 h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Shows Map</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">14 states visited</p>
        </div>
        <Compass className="w-5 h-5 text-slate-400" />
      </div>

      <div className="w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/50">
        <ComposableMap
          projection="geoAlbersUsa"
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: { rsmKey: string; [k: string]: unknown }[] }) =>
              geographies.map((geo: { rsmKey: string; [k: string]: unknown }) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  style={{
                    default: { color: '#94a3b8', outline: 'none' },
                    hover:   { color: '#94a3b8', outline: 'none' },
                    pressed: { color: '#94a3b8', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {MAP_PINS.map(({ label, coordinates }) => (
            <Marker key={label} coordinates={coordinates}>
              <circle r={5} fill="#f97316" stroke="#fff" strokeWidth={1.5} />
            </Marker>
          ))}
        </ComposableMap>
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
          gradient="bg-primary"
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
          gradient="bg-primary"
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
              <Link to="/chasing" className="text-xs text-primary hover:text-primary-600 font-medium flex items-center gap-1">
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
                <Bar
                  dataKey="count"
                  fill="#F97316"
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
              <Link to="/shows" className="text-xs text-primary hover:text-primary-600 font-medium flex items-center gap-1">
                All shows <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <ul className="space-y-1">
              {mockRecentConcerts.map((show) => (
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
                    <a
                      href={show.setlist_url}
                      className="shrink-0 text-xs text-primary hover:text-primary-600 font-medium flex items-center gap-0.5"
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
      <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-amber-500/10 dark:from-primary-900/20 dark:via-pink-900/20 dark:to-amber-900/20 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-5">
        <div className="flex flex-wrap gap-6 justify-around">
          <FunStat
            icon={<Clock className="w-4 h-4 text-primary-400" />}
            label="Longest drought"
            value="847 days"
          />
          <FunStat
            icon={<Building2 className="w-4 h-4 text-primary-400" />}
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
