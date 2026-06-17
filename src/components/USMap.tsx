import { useCallback, useEffect, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { Compass, ArrowRight, X } from 'lucide-react';
import type { Concert } from '../types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const W = 960, H = 600;
const MIN_ZOOM = 1, MAX_ZOOM = 8;

type XForm = { x: number; y: number; k: number };
const DEFAULT_XFORM: XForm = { x: 0, y: 0, k: 1 };

function clampXForm({ x, y, k }: XForm): XForm {
  const maxX = 0, minX = W * (1 - k);
  const maxY = 0, minY = H * (1 - k);
  return { k, x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) };
}

interface StateFeature { path: string; name: string; }
interface ConcertGroup {
  x: number; y: number;
  venue: string; city: string; state: string;
  concerts: Concert[];
}

interface USMapProps {
  concerts: Concert[];
  visitedStates: Set<string>;
  title?: string;
  subtitle?: string;
}

export default function USMap({ concerts, visitedStates, title = 'Shows Map', subtitle }: USMapProps) {
  const svgRef       = useRef<SVGSVGElement>(null);
  const dragRef      = useRef<{ mx: number; my: number; tx: number; ty: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const [states, setStates]           = useState<StateFeature[]>([]);
  const [groups, setGroups]           = useState<ConcertGroup[]>([]);
  const [xform, setXform]             = useState<XForm>(DEFAULT_XFORM);
  const [isDragging, setIsDragging]   = useState(false);
  const [activeGroup, setActiveGroup] = useState<ConcertGroup | null>(null);

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
        const venueMap: Record<string, ConcertGroup> = {};
        for (const c of concerts) {
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
  }, [concerts]);

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
      return clampXForm({ k, x: mx - (mx - prev.x) * (k / prev.k), y: my - (my - prev.y) * (k / prev.k) });
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasDraggedRef.current = false;
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = W / rect.width;
    dragRef.current = { mx: e.clientX * sx, my: e.clientY * sx, tx: xform.x, ty: xform.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const sx = W / rect.width;
    const dx = e.clientX * sx - dragRef.current.mx;
    const dy = e.clientY * sx - dragRef.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
    setXform(prev => clampXForm({ k: prev.k, x: dragRef.current!.tx + dx, y: dragRef.current!.ty + dy }));
  };

  const onPointerUp = () => { dragRef.current = null; setIsDragging(false); };
  const resetZoom   = () => setXform(DEFAULT_XFORM);
  const onSvgClick  = () => { if (!hasDraggedRef.current) setActiveGroup(null); };

  const handlePinClick = (e: React.MouseEvent, group: ConcertGroup) => {
    e.stopPropagation();
    if (hasDraggedRef.current) return;
    setActiveGroup(prev => prev?.venue === group.venue ? null : group);
  };

  const popupPos = activeGroup ? {
    left: `${((activeGroup.x * xform.k + xform.x) / W) * 100}%`,
    top:  `${((activeGroup.y * xform.k + xform.y) / H) * 100}%`,
  } : null;

  const derivedSubtitle = subtitle ?? `${visitedStates.size} state${visitedStates.size !== 1 ? 's' : ''} visited`;

  return (
    <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:border dark:border-slate-700/60 overflow-hidden p-6 h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{derivedSubtitle}</p>
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
                      key={i} d={d}
                      fill={visitedStates.has(name) ? 'rgba(249,115,22,0.18)' : 'transparent'}
                      stroke={visitedStates.has(name) ? 'rgba(249,115,22,0.5)' : '#94a3b8'}
                      strokeWidth={visitedStates.has(name) ? 1 : 0.6}
                    />
                  ))}
                  {groups.map((g, i) => (
                    <circle
                      key={i} cx={g.x} cy={g.y}
                      r={7.5 / xform.k}
                      fill={activeGroup?.venue === g.venue ? '#ea580c' : '#f97316'}
                      stroke="white" strokeWidth={1.5 / xform.k}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handlePinClick(e, g)}
                    />
                  ))}
                </>
              )}
            </g>
          </svg>
        </div>

        {activeGroup && popupPos && (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{ left: popupPos.left, top: popupPos.top, transform: 'translate(-50%, calc(-100% - 14px))' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 min-w-[200px] max-w-[260px]">
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid', borderTopColor: 'rgb(226 232 240)' }}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                style={{ marginTop: '-1px', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid', borderTopColor: 'var(--popup-bg, white)' }}
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
