import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
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
  X,
} from 'lucide-react';
import type { Concert } from '../types';
import {
  mockStats,
  mockShowsPerYear,
  mockRecentConcerts,
  mockChasingList,
  mockAllConcerts,
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
const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const W = 960, H = 600;
const MIN_ZOOM = 1, MAX_ZOOM = 8;

type XForm = { x: number; y: number; k: number };
const DEFAULT_XFORM: XForm = { x: 0, y: 0, k: 1 };

function clampXForm({ x, y, k }: XForm): XForm {
  const maxX = 0, minX = W * (1 - k);
  const maxY = 0, minY = H * (1 - k);
  return {
    k,
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
}

interface StateFeature { path: string; name: string; }
interface ConcertGroup {
  x: number; y: number;
  venue: string; city: string; state: string;
  concerts: Concert[];
}

function USMapCard({ visitedStates }: { visitedStates: Set<string> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ mx: number; my: number; tx: number; ty: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const [states, setStates] = useState<StateFeature[]>([]);
  const [groups, setGroups] = useState<ConcertGroup[]>([]);
  const [xform, setXform]   = useState<XForm>(DEFAULT_XFORM);
  const [isDragging, setIsDragging] = useState(false);
  const [activeGroup, setActiveGroup] = useState<ConcertGroup | null>(null);

  // Load TopoJSON and project + group concerts by venue
  useEffect(() => {
    const proj = geoAlbersUsa().scale(1300).translate([W / 2, H / 2]);
    const path = geoPath().projection(proj);

    fetch(GEO_URL)
      .then(r => r.json())
      .then((topo: Topology) => {
        const fc = feature(topo, topo.objects.states as GeometryCollection);
        if ('features' in fc) {
          setStates(fc.features.map(f => ({
            path: path(f) ?? '',
            name: (f.properties as { name: string }).name,
          })));
        }
        // Group concerts by venue
        const venueMap: Record<string, ConcertGroup> = {};
        for (const c of mockAllConcerts) {
          if (c.lng == null || c.lat == null) continue;
          const p = proj([c.lng, c.lat]);
          if (!p) continue;
          if (!venueMap[c.venue]) {
            venueMap[c.venue] = { x: p[0], y: p[1], venue: c.venue, city: c.city, state: c.state, concerts: [] };
          }
          venueMap[c.venue].concerts.push(c);
        }
        const grouped = Object.values(venueMap);
        for (const g of grouped) {
          g.concerts.sort((a: Concert, b: Concert) => b.date.localeCompare(a.date));
        }
        setGroups(grouped);
      });
  }, []);

  // Wheel zoom — must be non-passive to call preventDefault
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const sx = W / rect.width;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top)  * sx;
    setXform(prev => {
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.k * factor));
      return clampXForm({
        k,
        x: mx - (mx - prev.x) * (k / prev.k),
        y: my - (my - prev.y) * (k / prev.k),
      });
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Pointer drag — track whether moved enough to count as drag
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasDraggedRef.current = false;
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = W / rect.width;
    dragRef.current = {
      mx: e.clientX * sx,
      my: e.clientY * sx,
      tx: xform.x,
      ty: xform.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = W / rect.width;
    const dx = e.clientX * sx - dragRef.current.mx;
    const dy = e.clientY * sx - dragRef.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
    setXform(prev => clampXForm({
      k: prev.k,
      x: dragRef.current!.tx + dx,
      y: dragRef.current!.ty + dy,
    }));
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const resetZoom = () => setXform(DEFAULT_XFORM);

  // Click on map background closes popup (if not a drag)
  const onSvgClick = () => {
    if (!hasDraggedRef.current) setActiveGroup(null);
  };

  const handlePinClick = (e: React.MouseEvent, group: ConcertGroup) => {
    e.stopPropagation();
    if (hasDraggedRef.current) return;
    setActiveGroup(prev => prev?.venue === group.venue ? null : group);
  };

  // Convert SVG coords → % of the map wrapper (accounts for current transform)
  const popupPos = activeGroup ? {
    left: `${((activeGroup.x * xform.k + xform.x) / W) * 100}%`,
    top:  `${((activeGroup.y * xform.k + xform.y) / H) * 100}%`,
  } : null;

  return (
    <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden p-6 h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Shows Map</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{visitedStates.size} states visited</p>
        </div>
        <div className="flex items-center gap-2">
          {xform.k > 1 && (
            <button
              onClick={resetZoom}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Reset
            </button>
          )}
          <Compass className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Wrapper is relative so popup can be positioned over the SVG */}
      <div className="relative w-full select-none">
        <div className="w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/50">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className={`w-full h-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClick={onSvgClick}
          >
            <g transform={`translate(${xform.x},${xform.y}) scale(${xform.k})`}>
              {states.length === 0 ? (
                <text x={W / 2} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize={14}>Loading…</text>
              ) : (
                <>
                  {states.map(({ path: d, name }, i) => (
                    <path
                      key={i}
                      d={d}
                      fill={visitedStates.has(name) ? 'rgba(249,115,22,0.18)' : 'transparent'}
                      stroke={visitedStates.has(name) ? 'rgba(249,115,22,0.5)' : '#94a3b8'}
                      strokeWidth={visitedStates.has(name) ? 1 : 0.6}
                    />
                  ))}
                  {groups.map((g, i) => (
                    <circle
                      key={i}
                      cx={g.x} cy={g.y}
                      r={7.5 / xform.k}
                      fill={activeGroup?.venue === g.venue ? '#ea580c' : '#f97316'}
                      stroke="white"
                      strokeWidth={1.5 / xform.k}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handlePinClick(e, g)}
                    />
                  ))}
                </>
              )}
            </g>
          </svg>
        </div>

        {/* Popup — floats above the map using SVG-coord → % conversion */}
        {activeGroup && popupPos && (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              left: popupPos.left,
              top: popupPos.top,
              transform: 'translate(-50%, calc(-100% - 14px))',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 min-w-[200px] max-w-[260px]">
              {/* Downward arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                style={{
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '7px solid',
                  borderTopColor: 'rgb(226 232 240)', // slate-200 border
                }}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                style={{
                  marginTop: '-1px',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid',
                  // Tailwind can't inline dynamic dark: classes — use CSS vars or a data attr trick
                  borderTopColor: 'var(--popup-bg, white)',
                }}
              />

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">{activeGroup.venue}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeGroup.city}, {activeGroup.state}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGroup(null); }}
                  className="shrink-0 mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <ul className="space-y-1.5 border-t border-slate-100 dark:border-slate-700 pt-2">
                {activeGroup.concerts.map(c => (
                  <li key={c.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      {new Date(c.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {c.setlist_url ? (
                      <a href={c.setlist_url} className="text-xs text-primary hover:text-primary-600 font-medium shrink-0 flex items-center gap-0.5">
                        Setlist <ArrowRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">No setlist</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const stats = mockStats;
  const visitedStates = new Set(mockAllConcerts.map(c => c.state));

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
          <USMapCard visitedStates={visitedStates} />
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
