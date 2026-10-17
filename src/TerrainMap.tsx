import { useId } from 'react';
import type { DemoState } from './demo';
import { signals } from './demo';

export function TerrainMap({ state, compact = false }: { state: DemoState; compact?: boolean }) {
  const id = useId().replaceAll(':', '');
  const signal = signals[state.scenario];
  const danger = signal.risk === 'SOS' || signal.risk === 'CRITICAL';
  const color = danger ? '#e7684d' : signal.risk === 'WARNING' ? '#e5ad55' : '#9ad06d';
  const moving = state.active && state.scenario === 'normal';
  return (
    <div className={`terrain ${compact ? 'compact' : ''}`}>
      <svg
        viewBox="0 0 700 470"
        role="img"
        aria-label={`Simulated mountain route. ${state.active || state.completed ? signal.detail : 'No active hike.'}`}
      >
        <defs>
          <radialGradient id={`terrain-${id}`}>
            <stop stopColor="#30392b" />
            <stop offset="1" stopColor="#111912" />
          </radialGradient>
          <pattern id={`grid-${id}`} width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke="#ffffff" strokeOpacity=".035" />
          </pattern>
          <path
            id={`route-${id}`}
            d="M115 381 170 350 195 310 247 325 272 260 320 240 345 204 393 222 430 166 485 145 505 99 570 68"
          />
        </defs>
        <rect width="700" height="470" fill={`url(#terrain-${id})`} />
        <rect width="700" height="470" fill={`url(#grid-${id})`} />
        <g fill="none" stroke="#85937a" strokeOpacity=".2" strokeWidth=".8">
          {Array.from({ length: 17 }, (_, i) => (
            <path
              key={i}
              d={`M${-160 + i * 22} 490 C${20 + i * 19} ${330 - i * 4},${-80 + i * 23} ${250 - i * 13},${165 + i * 20} ${200 - i * 14} S${465 + i * 8} ${320 - i * 15},${750 + i * 9} ${30 - i * 13}`}
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse
              key={i}
              cx="528"
              cy="95"
              rx={32 + i * 20}
              ry={22 + i * 12}
              transform="rotate(-28 528 95)"
            />
          ))}
        </g>
        <g fontFamily="monospace" fontSize="10" fill="#73806e">
          <text x="48" y="240" transform="rotate(-31 48 240)">
            ILE-ALATAU
          </text>
          <text x="460" y="392">
            2,400 m
          </text>
          <text x="615" y="179">
            3,000 m
          </text>
        </g>
        <use
          href={`#route-${id}`}
          fill="none"
          stroke="#6c7865"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <path
          d="M115 381 170 350 195 310 247 325 272 260 320 240 345 204"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g fill="#1a2419" stroke={color} strokeWidth="2">
          <circle cx="115" cy="381" r="6" />
          <circle cx="195" cy="310" r="4" />
          <circle cx="272" cy="260" r="4" />
          <circle cx="570" cy="68" r="6" />
        </g>
        <g fill="#c2ccbb" fontSize="11" fontFamily="monospace">
          <text x="97" y="411">
            MEDEU · START
          </text>
          <text x="450" y="45">
            FURMANOVKA · 3,053 m
          </text>
        </g>
        {!signal.gps ? (
          <g>
            <circle
              cx="345"
              cy="204"
              r="12"
              fill="none"
              stroke="#a9b2a4"
              strokeWidth="2"
              strokeDasharray="3 4"
            />
            <text x="364" y="199" fill="#bbc2b5" fontSize="10">
              LAST KNOWN
            </text>
          </g>
        ) : (
          <g className={moving ? 'moving-marker' : ''} style={{ color }}>
            <circle cx="345" cy="204" r="30" fill={color} opacity=".07" />
            <circle
              cx="345"
              cy="204"
              r="17"
              fill="none"
              stroke={color}
              opacity=".4"
              className={state.active ? 'map-pulse' : ''}
            />
            <circle cx="345" cy="204" r="6" fill={color} stroke="#eff5e8" strokeWidth="2" />
          </g>
        )}
        {danger && <circle cx="345" cy="204" r="64" fill="#e7684d" opacity=".07" />}
      </svg>
      <div className="map-top">
        <span className="map-label">{compact ? 'LIVE ROUTE' : '43.1572° N / 77.0803° E'}</span>
        <span className="compass">N ↑</span>
      </div>
      <div className="map-bottom">
        <span className="map-label">
          {!signal.gps
            ? 'GPS SIGNAL UNKNOWN'
            : state.completed
              ? 'ROUTE COMPLETED'
              : 'ILLUSTRATIVE TERRAIN'}
        </span>
        <span className="map-scale">└────┘ 500 m</span>
      </div>
    </div>
  );
}
