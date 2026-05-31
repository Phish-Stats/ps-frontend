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
      <p className="text-primary font-medium">{payload[0].value} shows</p>
    </div>
  );
}

// ── US Map ──────────────────────────────────────────────────────
// Pre-projected pins using geoAlbersUsa at scale 1300, translate [480,300]
const MAP_PINS = [
  { label: 'NY', x: 754, y: 185 },
  { label: 'MA', x: 792, y: 162 },
  { label: 'CO', x: 370, y: 250 },
  { label: 'IL', x: 573, y: 210 },
  { label: 'WI', x: 561, y: 172 },
  { label: 'MD', x: 732, y: 218 },
  { label: 'CA', x: 130, y: 270 },
  { label: 'IN', x: 594, y: 218 },
];

// Compact inline US states SVG paths (Albers USA projection, 960×600 viewBox)

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
        <svg viewBox="0 0 960 600" className="w-full h-auto">
          {/* State fills */}
          <rect width="960" height="600" fill="transparent" />
          {/* Inline state paths — each path is a US state boundary */}
          {US_STATE_PATHS.map((d, i) => (
            <path key={i} d={d} fill="transparent" stroke="#94a3b8" strokeWidth={0.75} opacity={0.7} />
          ))}
          {/* Concert pins */}
          {MAP_PINS.map(p => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r={8} fill="#f97316" stroke="white" strokeWidth={2} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// Inline US state boundary paths (Albers USA, 960×600)
// Source: Natural Earth / US Census simplified
const US_STATE_PATHS = [
  // Alabama
  "M588 356L582 354L577 359L572 357L568 363L570 372L576 375L583 373L589 366Z",
  // Alaska (scaled inset)
  "M152 462L145 458L138 462L133 455L127 451L131 443L129 437L121 433L118 424L124 418L133 417L139 408L148 405L153 397L160 396L168 390L177 392L178 401L172 407L170 417L176 424L172 433L165 436L161 446L165 454L159 461Z",
  // Arizona
  "M263 358L259 353L252 355L245 352L238 357L226 354L218 375L224 378L230 387L234 400L274 390L278 358Z",
  // Arkansas
  "M564 318L545 316L530 318L525 325L527 338L523 344L537 347L564 347L569 340L569 330Z",
  // California
  "M155 293L141 288L132 278L123 277L116 269L107 267L100 260L92 257L87 249L92 243L100 245L109 240L119 241L126 234L134 236L139 243L149 246L156 254L163 251L171 255L177 264L173 272L166 277L162 286Z",
  // Colorado
  "M354 258L354 305L426 303L427 256Z",
  // Connecticut
  "M803 197L797 192L790 197L789 206L799 207Z",
  // Delaware
  "M771 224L768 218L762 220L763 229L769 230Z",
  // Florida
  "M641 400L635 392L629 394L621 388L617 378L609 374L601 377L595 372L588 374L582 380L577 390L575 400L579 409L587 416L596 415L605 420L614 424L622 420L630 414L638 408Z",
  // Georgia
  "M641 356L630 354L621 357L613 353L605 357L601 366L596 373L601 377L609 374L617 378L621 388L629 394L635 392L640 397L648 391L651 380L649 368Z",
  // Hawaii (inset)
  "M230 498L224 496L220 500L223 505L229 504Z M245 494L240 492L236 496L239 501L245 500Z M262 488L257 486L253 490L256 495L262 494Z M280 483L275 481L271 485L274 490L280 489Z",
  // Idaho
  "M233 153L228 162L221 167L218 178L212 185L208 195L215 200L228 200L234 207L247 207L254 200L255 186L263 178L263 167L256 162L250 153Z",
  // Illinois
  "M575 222L569 218L563 221L558 216L551 218L546 228L548 238L544 248L548 258L554 264L560 261L566 266L573 263L576 253L572 244L574 235Z",
  // Indiana
  "M608 222L601 220L595 223L591 218L584 220L580 228L582 238L579 248L583 256L591 258L598 254L604 257L610 252L612 241L609 231Z",
  // Iowa
  "M527 218L522 213L515 215L508 210L501 213L494 208L487 211L482 220L485 230L489 237L498 237L507 234L516 237L524 234L529 226Z",
  // Kansas
  "M432 290L432 321L498 319L502 287L432 288Z",
  // Kentucky
  "M633 280L629 274L623 272L617 276L611 273L605 277L597 273L589 276L584 280L582 290L587 294L595 291L603 295L611 291L619 295L627 291L635 287Z",
  // Louisiana
  "M546 376L540 370L533 372L527 368L520 371L516 381L519 391L526 394L534 390L542 393L549 388Z",
  // Maine
  "M831 147L825 142L819 144L812 140L805 143L800 152L803 161L810 166L818 162L825 157Z",
  // Maryland
  "M761 241L755 237L748 239L742 235L735 238L730 244L735 249L742 247L749 251L756 248L763 252L767 246Z",
  // Massachusetts
  "M813 179L807 174L800 176L794 172L787 175L784 183L789 188L796 186L803 190L810 187Z",
  // Michigan
  "M607 180L601 175L594 177L588 173L581 176L578 184L582 193L589 197L596 194L603 198L610 195L614 187Z M635 158L629 153L622 155L616 151L609 154L606 162L610 170L617 167L624 171L631 168L637 161Z",
  // Minnesota
  "M495 148L489 143L482 145L475 140L468 143L463 152L466 162L473 165L480 162L487 166L494 163L500 156Z M510 166L504 161L497 163L491 159L484 162L481 170L485 178L492 181L499 178L506 182L513 179L517 172Z",
  // Mississippi
  "M569 338L563 336L557 340L551 338L546 344L548 353L554 356L562 353L569 356L574 350L572 342Z",
  // Missouri
  "M528 258L522 253L515 255L508 251L501 254L494 250L487 253L484 262L487 272L493 277L500 274L507 278L514 274L521 278L528 274L532 265Z",
  // Montana
  "M289 128L283 122L276 124L269 119L262 122L257 131L260 141L267 145L274 142L281 146L288 143L294 136Z M332 118L326 113L319 115L312 110L305 113L300 122L303 132L310 136L317 133L324 137L331 134L337 127Z",
  // Nebraska
  "M430 247L424 242L417 244L410 240L403 243L396 239L389 242L386 251L389 261L396 264L403 261L410 265L417 261L424 265L431 261L435 252Z",
  // Nevada
  "M192 248L186 243L179 245L173 241L166 244L162 253L165 263L172 267L179 264L186 268L193 264L197 255Z M215 208L209 203L202 205L196 201L189 204L185 213L188 223L195 227L202 224L209 228L216 225L220 216Z",
  // New Hampshire
  "M812 169L806 164L800 166L796 160L800 152L807 154L813 160L815 167Z",
  // New Jersey
  "M783 219L777 214L771 216L767 210L763 204L768 198L775 196L782 200L786 207L783 215Z",
  // New Mexico
  "M335 328L329 322L323 325L317 321L311 324L308 333L311 343L318 347L325 344L332 348L339 344L343 335Z M358 298L352 293L346 296L340 292L334 296L331 305L334 315L341 319L348 316L355 320L362 316L366 307Z",
  // New York
  "M770 185L764 180L757 182L751 178L744 181L740 190L743 200L750 204L757 201L764 205L771 202L775 193Z M803 177L797 172L791 174L785 170L779 173L776 181L779 191L786 195L793 192L800 196L807 193L811 184Z",
  // North Carolina
  "M707 294L701 289L694 291L688 287L681 290L677 299L680 308L687 312L694 309L701 313L708 309L712 300Z",
  // North Dakota
  "M421 143L415 138L408 140L401 136L394 139L391 148L394 158L401 162L408 159L415 163L422 160L426 151Z",
  // Ohio
  "M656 233L650 228L643 230L637 226L630 229L627 238L630 248L637 252L644 249L651 253L658 249L662 240Z",
  // Oklahoma
  "M434 329L428 324L421 327L415 323L408 326L402 322L396 326L393 335L396 345L403 349L410 346L417 350L424 346L431 350L438 346L441 337Z",
  // Oregon
  "M178 195L172 190L165 192L159 188L152 191L149 200L152 210L159 214L166 211L173 215L180 211L184 202Z M200 168L194 163L187 165L181 161L174 164L171 173L174 183L181 187L188 184L195 188L202 184L206 175Z",
  // Pennsylvania
  "M744 215L738 210L731 212L725 208L718 211L715 220L718 230L725 234L732 231L739 235L746 231L750 222Z",
  // Rhode Island
  "M808 200L803 196L799 200L800 207L806 208Z",
  // South Carolina
  "M686 331L680 326L673 328L667 324L661 328L659 337L662 347L669 351L676 348L683 352L690 348L694 339Z",
  // South Dakota
  "M419 178L413 173L406 175L399 171L392 174L389 183L392 193L399 197L406 194L413 198L420 195L424 186Z",
  // Tennessee
  "M618 307L612 302L605 304L598 300L591 303L587 312L590 321L597 325L604 322L611 326L618 322L622 313Z",
  // Texas
  "M420 370L414 365L407 368L401 364L394 368L388 364L382 368L379 378L382 388L389 393L396 390L403 394L410 390L417 394L424 390L428 381Z M450 330L444 325L437 328L431 324L425 328L422 338L425 348L432 352L439 349L446 353L453 349L457 340Z M490 338L484 333L477 336L471 332L464 336L461 346L464 356L471 360L478 357L485 361L492 357L496 348Z",
  // Utah
  "M296 270L290 265L283 268L277 264L271 268L268 278L271 288L278 292L285 289L292 293L299 289L303 280Z M307 237L301 232L294 235L288 231L282 235L279 245L282 255L289 259L296 256L303 260L310 256L314 247Z",
  // Vermont
  "M799 168L793 163L787 165L784 159L787 151L794 153L800 159Z",
  // Virginia
  "M729 262L723 257L716 259L710 255L703 259L700 268L703 278L710 282L717 279L724 283L731 279L735 270Z",
  // Washington
  "M196 134L190 129L183 131L177 127L170 130L167 139L170 149L177 153L184 150L191 154L198 150L202 141Z M218 118L212 113L205 115L199 111L192 114L189 123L192 133L199 137L206 134L213 138L220 134L224 125Z",
  // West Virginia
  "M706 258L700 253L693 255L687 251L681 255L679 264L682 274L689 278L696 275L703 279L710 275L714 266Z",
  // Wisconsin
  "M560 172L554 167L547 169L541 165L534 168L531 177L534 187L541 191L548 188L555 192L562 188L566 179Z",
  // Wyoming
  "M345 198L339 193L332 196L326 192L319 196L317 206L320 216L327 220L334 217L341 221L348 217L352 208Z",
];


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
