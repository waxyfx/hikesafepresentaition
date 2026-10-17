import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { DemoState } from './demo';
import { signals } from './demo';

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

const hikers = [
  'Aruzhan',
  'Daniyar',
  'Aisha',
  'Timur',
  'Mira',
  'Arman',
  'Dana',
  'Nursultan',
  'Alina',
  'Sanzhar',
  'Amina',
  'Ilyas',
  'Sofia',
  'Azamat',
  'Kamila',
  'Dias',
];
const manifesto =
  'A hike is more than a route on a map. It is someone’s adventure. Someone’s promise to come home. HIKE SAFE brings a plan, verified movement and time together — so silence can become a signal worth noticing.';

export function OrbitStory() {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const el = section.current,
      stage = scene.current;
    if (!el || !stage) return;
    let frame = 0,
      visible = true,
      angle = 0,
      last = 0;
    const render = (now: number) => {
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      const scatter = Math.max(0, Math.min(1, (progress - 0.12) / 0.55));
      setPhase(progress > 0.24 ? 1 : 0);
      if (last && !reduced) angle += ((now - last) * Math.PI) / 30000;
      last = now;
      const width = stage.clientWidth,
        height = stage.clientHeight;
      const rx = Math.min(width * 0.41, 530),
        ry = Math.min(height * 0.35, 265);
      stage.style.setProperty('--story-progress', String(scatter));
      tiles.current.forEach((tile, i) => {
        if (!tile) return;
        const theta = (i * Math.PI) / 8 + angle;
        const x = Math.cos(theta) * rx,
          y = Math.sin(theta) * ry;
        const sx = Math.cos(i * 2.399) * width * (0.3 + (i % 3) * 0.08),
          sy = Math.sin(i * 2.399) * height * 0.45;
        tile.style.transform = `translate(${x + (sx - x) * scatter}px,${y + (sy - y) * scatter}px) scale(${1 - scatter * (0.25 + (i % 3) * 0.1)})`;
        tile.style.opacity = String(1 - scatter * 0.6);
      });
      const revealed = reduced ? 1 : Math.max(0, Math.min(1, (progress - 0.28) / 0.64));
      wordRefs.current.forEach((word, i) => {
        if (word) word.style.color = i / wordRefs.current.length < revealed ? '#f5f5f5' : '#4a4f48';
      });
      if (visible && !reduced) frame = requestAnimationFrame(render);
    };
    const update = () => {
      if (!frame || reduced) render(performance.now());
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible) render(performance.now());
    });
    observer.observe(el);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [reduced]);
  return (
    <section className="orbit-story" id="solution" ref={section}>
      <div className={`orbit-scene ${phase ? 'manifesto-phase' : ''}`} ref={scene}>
        <div className="orbit-story-label">
          <span>02 / PEOPLE, NOT JUST POSITIONS</span>
          <span>16 FICTIONAL TRAIL COMPANIONS</span>
        </div>
        <div className="hiker-orbit" aria-hidden="true">
          {hikers.map((name, i) => (
            <div
              className="hiker-position"
              key={name}
              ref={(el) => {
                tiles.current[i] = el;
              }}
            >
              <div
                className="hiker-tile"
                style={
                  {
                    '--avatar-x': `${((i % 4) * 100) / 3}%`,
                    '--avatar-y': `${(Math.floor(i / 4) * 100) / 3}%`,
                  } as CSSProperties
                }
              >
                <span className="hiker-tooltip">{name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="orbit-story-intro" aria-hidden={reduced ? false : !!phase}>
          <span className="eyebrow">FOR THE PEOPLE BEHIND THE PIN.</span>
          <h2>
            Every adventure.
            <br />
            Someone’s <span>way home.</span>
          </h2>
          <a className="button light-pill" href="#demo" tabIndex={phase && !reduced ? -1 : 0}>
            START YOUR RETURN PLAN ↗
          </a>
          <div className="orbit-tags">
            Built around <span>⌖ a route</span>
            <span>◷ a return time</span>
            <span>♡ a person</span>
          </div>
        </div>
        <div className="manifesto-copy" aria-hidden={reduced ? false : !phase}>
          <p aria-label={manifesto}>
            {manifesto.split(' ').map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                aria-hidden="true"
              >
                {word}{' '}
              </span>
            ))}
          </p>
          <small>WATCH THE HIKE. UNDERSTAND THE SIGNALS.</small>
        </div>
        <div className="orbit-scene-footer">
          <span>YOUR HIKE SHOULD HAVE A RETURN PLAN.</span>
          <span>
            {phase ? '02 / THE REASON' : '01 / THE PEOPLE'} <b>↓</b>
          </span>
        </div>
      </div>
    </section>
  );
}

const base = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
const media = [
  [
    'hf_20261008_140431_c77a9976-42a7-4959-90d2-2a9676b3ccf1.png',
    'hf_20261008_140656_3a462bc1-83f9-44fd-a8c3-a4522c29b9bc.mp4',
  ],
  [
    'hf_20261008_140436_7dd9cac5-2e1a-4dfb-8b1b-48d84c425ecd.png',
    'hf_20261008_140701_8240477a-2071-4619-90cc-008e95e644ee.mp4',
  ],
  [
    'hf_20261008_140443_125f93bf-08dc-4e3d-b3da-be0f68f6bffb.png',
    'hf_20261008_140632_900f2862-5461-4592-ba6f-e40660186607.mp4',
  ],
  [
    'hf_20261008_140447_85124f3d-35bd-4097-9359-6e39a824f6ac.png',
    'hf_20261008_140639_ade27fd2-965b-4278-81cb-9bc195dced1e.mp4',
  ],
];
const glows = [
  [237, 190, 241],
  [70, 190, 240],
  [38, 196, 238],
  [150, 170, 250],
];
const names = ['Risk signals', 'Confirmed movement', 'Location certainty', 'One incident'];
export function MetricCarousel({ state }: { state: DemoState }) {
  const section = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]),
    videos = useRef<(HTMLVideoElement | null)[]>([]);
  const motion = useRef({
    pos: 0,
    target: 0,
    frame: 0,
    timer: 0,
    width: 320,
    xSide: 450,
    visible: false,
    drag: false,
    startX: 0,
    startY: 0,
    startPos: 0,
    startTime: 0,
    pointer: false,
  });
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const render = useCallback(() => {
    const s = motion.current;
    const colorIndex = ((s.pos % 4) + 4) % 4,
      lo = Math.floor(colorIndex),
      blend = colorIndex - lo;
    section.current?.style.setProperty(
      '--glow',
      (glows[lo] ?? glows[0]!)
        .map((c, i) => Math.round(c + ((glows[(lo + 1) % 4]?.[i] ?? c) - c) * blend))
        .join(','),
    );
    cards.current.forEach((card, i) => {
      if (!card) return;
      const p = ((((i - s.pos + 2) % 4) + 4) % 4) - 2,
        a = Math.abs(p),
        sign = p < 0 ? -1 : 1;
      let x, z, r, opacity;
      if (a <= 1) {
        x = sign * s.xSide * a;
        z = -0.325 * s.width * a;
        r = sign * 125 * (1 - Math.pow(1 - a, 1.6));
        opacity = 1;
      } else {
        const t = a - 1;
        x = sign * s.xSide * (1 + t * 1.6);
        z = -0.325 * s.width;
        r = sign * (125 + 55 * t);
        opacity = Math.max(0, 1 - t * 1.6);
      }
      card.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${r}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(10 - Math.round(a * 4));
      card.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      card.setAttribute('aria-hidden', String(a > 0.5));
    });
  }, []);
  const goRef = useRef<(target: number, duration?: number) => void>(() => {});
  const schedule = useCallback(() => {
    const s = motion.current;
    clearTimeout(s.timer);
    if (!reduced && !paused && s.visible && !document.hidden)
      s.timer = window.setTimeout(() => goRef.current(Math.round(s.pos) + 1), 2300);
  }, [reduced, paused]);
  const go = useCallback(
    (target: number, duration = 950) => {
      const s = motion.current;
      clearTimeout(s.timer);
      cancelAnimationFrame(s.frame);
      const start = s.pos,
        time = performance.now();
      s.target = target;
      const tick = (now: number) => {
        const t = reduced ? 1 : Math.min(1, (now - time) / duration),
          ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        s.pos = start + (target - start) * ease;
        render();
        if (t < 1) s.frame = requestAnimationFrame(tick);
        else {
          s.frame = 0;
          setActive(((target % 4) + 4) % 4);
          schedule();
        }
      };
      s.frame = requestAnimationFrame(tick);
    },
    [reduced, render, schedule],
  );
  useEffect(() => {
    goRef.current = go;
  }, [go]);
  const step = (direction: number) =>
    go(Math.round(motion.current.frame ? motion.current.target : motion.current.pos) + direction);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const s = motion.current;
    const measure = () => {
      s.width = cards.current[0]?.offsetWidth || 320;
      s.xSide = Math.max(
        s.width * 1.05,
        Math.min((stage.current?.clientWidth || 800) / 2, s.width * 2.2),
      );
      render();
    };
    const updatePlayback = () =>
      videos.current.forEach((v) => {
        if (!v) return;
        if (s.visible && !document.hidden && !reduced && !paused) void v.play().catch(() => {});
        else v.pause();
      });
    const observer = new IntersectionObserver(
      ([entry]) => {
        s.visible = !!entry?.isIntersecting;
        updatePlayback();
        if (s.visible) schedule();
        else {
          clearTimeout(s.timer);
          cancelAnimationFrame(s.frame);
          s.frame = 0;
          s.pos = Math.round(s.pos);
          s.target = s.pos;
          setActive(((s.pos % 4) + 4) % 4);
          render();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    const visibility = () => {
      updatePlayback();
      schedule();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('resize', measure);
    measure();
    void document.fonts.ready.then(measure);
    schedule();
    updatePlayback();
    return () => {
      observer.disconnect();
      clearTimeout(s.timer);
      cancelAnimationFrame(s.frame);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('resize', measure);
    };
  }, [paused, reduced, render, schedule]);
  const signal = signals[state.scenario];
  return (
    <section
      id="signal-cards"
      ref={section}
      className="metric-carousel"
      aria-roledescription="carousel"
      aria-label="Four hiking safety signals"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          e.stopPropagation();
          step(e.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      onPointerDown={(e) => {
        if (
          (e.pointerType === 'mouse' && e.button !== 0) ||
          (e.target as HTMLElement).closest('button,a')
        )
          return;
        const s = motion.current;
        clearTimeout(s.timer);
        cancelAnimationFrame(s.frame);
        s.frame = 0;
        s.pointer = true;
        s.drag = false;
        s.startX = e.clientX;
        s.startY = e.clientY;
        s.startPos = s.pos;
        s.startTime = performance.now();
      }}
      onPointerMove={(e) => {
        const s = motion.current;
        if (!s.pointer) return;
        const dx = e.clientX - s.startX,
          dy = e.clientY - s.startY;
        if (!s.drag && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          s.pointer = false;
          schedule();
          return;
        }
        if (Math.abs(dx) > 6) {
          s.drag = true;
          e.currentTarget.classList.add('is-dragging');
          e.currentTarget.setPointerCapture(e.pointerId);
          s.pos = s.startPos - dx / (s.xSide * 0.9);
          render();
        }
      }}
      onPointerUp={(e) => {
        const s = motion.current;
        if (!s.pointer) return;
        s.pointer = false;
        e.currentTarget.classList.remove('is-dragging');
        if (s.drag) {
          const velocity = (s.pos - s.startPos) / Math.max(1, performance.now() - s.startTime);
          let target = Math.round(s.pos + velocity * 220);
          if (target === Math.round(s.startPos) && Math.abs(s.pos - s.startPos) > 0.18)
            target += Math.sign(s.pos - s.startPos);
          go(target, 650);
        } else {
          const rect = e.currentTarget.getBoundingClientRect(),
            x = (e.clientX - rect.left) / rect.width;
          if (x < 0.3) step(-1);
          else if (x > 0.7) step(1);
          else schedule();
        }
      }}
      onPointerCancel={(e) => {
        const s = motion.current;
        s.pointer = false;
        s.drag = false;
        e.currentTarget.classList.remove('is-dragging');
        go(Math.round(s.pos), 650);
      }}
    >
      <div className="metric-glow metric-glow-top" />
      <div className="metric-glow metric-glow-bottom" />
      <div className="metric-heading">
        <span>THE SIGNALS, IN FOCUS.</span>
        <h2>
          Small details.
          <br />A bigger picture.
        </h2>
        <p>Illustrative values. One shared demo state.</p>
      </div>
      <div className="metric-stage" ref={stage}>
        {media.map(([poster, video], i) => (
          <article
            key={i}
            className={`metric-card metric-c${i + 1}`}
            ref={(el) => {
              cards.current[i] = el;
            }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of 4: ${names[i]}`}
          >
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              className="metric-video"
              muted
              loop
              playsInline
              preload="none"
              poster={base + poster}
              src={base + video}
              aria-hidden="true"
            />
            <h3 className="metric-card-title">
              {[
                ['A clearer view of', 'the risk signals'],
                ['Verified samples.', 'Meaningful movement.'],
                ['A lost signal is not', 'a stationary hiker.'],
                ['One hike.', 'One active incident.'],
              ][i]?.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            {i === 0 && (
              <svg className="metric-dial" viewBox="0 0 200 200" aria-hidden="true">
                <circle
                  cx="100"
                  cy="100"
                  r="93"
                  fill="none"
                  stroke="#f0f5be38"
                  strokeWidth="9"
                  strokeDasharray="1.1 2.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="93"
                  fill="none"
                  stroke="#f6f8bec7"
                  strokeWidth="9"
                  strokeDasharray="1.1 2.7"
                  strokeDashoffset="35"
                  pathLength="100"
                />
                <circle cx="100" cy="100" r="84" fill="none" stroke="#f0f5be29" />
              </svg>
            )}
            {i === 1 && (
              <svg
                className="metric-ruler"
                viewBox="0 0 256 20"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {Array.from({ length: 64 }, (_, n) => {
                  const random = Math.sin(n * 12.9898) * 43758.5453;
                  const h = n === 32 ? 20 : 5 + (random - Math.floor(random)) * 10;
                  return (
                    <rect
                      key={n}
                      x={n * 4}
                      y={(20 - h) / 2}
                      width="1"
                      height={h}
                      fill={n === 32 ? '#ff4b3a' : '#ffced780'}
                    />
                  );
                })}
              </svg>
            )}
            {i === 2 && (
              <>
                <div className="metric-slider" />
                <div className="metric-scale">
                  <span>UNKNOWN</span>
                  <span>CONFIRMED</span>
                </div>
              </>
            )}
            {i === 3 && (
              <>
                <span className="metric-beta">Simulation</span>
                <span className="metric-ghost ghost-up">0</span>
                <span className="metric-ghost ghost-down">2</span>
                <i className="metric-cross-h" />
                <i className="metric-cross-v" />
                <span className="metric-chip chip-a">GPS</span>
                <span className="metric-chip chip-b">ETA</span>
              </>
            )}
            <div className="metric-center">
              <span className="metric-number">
                {i === 0 ? (
                  <>
                    {state.active || state.completed ? signal.score : 18}
                    <sup>/100</sup>
                  </>
                ) : i === 1 ? (
                  <>
                    2<sup>h+</sup>
                  </>
                ) : i === 2 ? (
                  <>
                    {signal.gps ? 'GPS' : '?'}
                    {signal.gps && <sup>✓</sup>}
                  </>
                ) : (
                  <>
                    {state.incident && state.incident.status !== 'RESOLVED' ? '1' : '0'}
                    <sup>active</sup>
                  </>
                )}
              </span>
            </div>
            <p className="metric-card-foot">
              {
                [
                  state.active || state.completed
                    ? `${signal.risk} · live demo`
                    : 'Start a hike to change the score',
                  'Inactivity requires real GPS samples',
                  signal.gps ? 'GPS available · simulated' : 'Unknown does not mean inactive',
                  state.incident?.status || 'No duplicate escalations',
                ][i]
              }
            </p>
          </article>
        ))}
      </div>
      <div className="metric-lens lens-left" />
      <div className="metric-lens lens-right" />
      <div className="metric-controls">
        <button aria-label="Previous signal card" onClick={() => step(-1)}>
          ←
        </button>
        <span aria-live={paused || reduced ? 'polite' : 'off'}>
          {String(active + 1).padStart(2, '0')} / 04 <b>{names[active]}</b>
        </span>
        <button aria-label="Next signal card" onClick={() => step(1)}>
          →
        </button>
        <button
          className="carousel-pause"
          aria-label={paused ? 'Play carousel' : 'Pause carousel'}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? '▶' : 'Ⅱ'}
        </button>
      </div>
      <small className="drag-hint">DRAG TO EXPLORE · OR USE ARROW KEYS</small>
    </section>
  );
}

const channels = [
  {
    name: 'Check-in',
    icon: '↗',
    title: 'A small message. A meaningful signal.',
    body: 'A check-in records that the hiker is okay. In the prototype, the event appears in the same monitoring timeline as location and risk signals.',
  },
  {
    name: 'Offline',
    icon: '◷',
    title: 'No connection. Still remembered.',
    body: 'When a network is unavailable, the simulated check-in waits in the local queue. It can synchronize later. Nothing is sent while offline.',
  },
  {
    name: 'Safe return',
    icon: '✓',
    title: 'The best update is “I’m back.”',
    body: 'A safe return closes the hike and resolves the active incident. The journey has an ending, and the system knows it.',
  },
];
export function ConnectedStory() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const selection = useRef<number | null>(null);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect(),
          p = Math.max(0, Math.min(0.999, -rect.top / Math.max(1, rect.height - innerHeight)));
        if (selection.current !== null) return;
        if (!reduced) setActive(Math.floor(p * 3));
      });
    };
    const resumeScroll = () => {
      selection.current = null;
    };
    const resumeKeys = (event: KeyboardEvent) => {
      if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) resumeScroll();
    };
    window.addEventListener('wheel', resumeScroll, { passive: true });
    window.addEventListener('touchmove', resumeScroll, { passive: true });
    window.addEventListener('keydown', resumeKeys);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('wheel', resumeScroll);
      window.removeEventListener('touchmove', resumeScroll);
      window.removeEventListener('keydown', resumeKeys);
    };
  }, [reduced]);
  return (
    <section className="connected-story" id="stay-connected" ref={section}>
      <div className="connected-sticky">
        <div className="connected-copy">
          <span className="eyebrow">A LITTLE REASSURANCE GOES A LONG WAY.</span>
          <h2>
            Stay in the loop.
            <br />
            <span className="muted">Even off the grid.</span>
          </h2>
          <div className="channel-tabs" role="tablist" aria-label="Check-in story">
            {channels.map((c, i) => (
              <button
                role="tab"
                aria-selected={active === i}
                aria-controls="channel-preview"
                id={`channel-tab-${i}`}
                key={c.name}
                onClick={() => {
                  selection.current = scrollY;
                  setActive(i);
                }}
              >
                <span>{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
          <div className="channel-description" key={active}>
            <h3>{channels[active]?.title}</h3>
            <p>{channels[active]?.body}</p>
          </div>
          <a className="button subtle-pill" href="#demo">
            TRY A CHECK-IN ↗
          </a>
          <small className="concept-caption">ILLUSTRATIVE UI · NO MESSAGES ARE SENT</small>
        </div>
        <div
          className="chat-phone"
          role="tabpanel"
          id="channel-preview"
          aria-labelledby={`channel-tab-${active}`}
        >
          <div className="chat-island" />
          <div className="chat-status">
            9:41 <span>▥ ▰</span>
          </div>
          <div className="chat-screen" key={active}>
            <div className="chat-person">
              <span className="chat-back">‹</span>
              <div className="chat-avatar" />
              <strong>My hike</strong>
              <small>HIKE SAFE · SIMULATION</small>
            </div>
            <div className="chat-day">TODAY · FURMANOVKA PEAK</div>
            {active === 0 ? (
              <>
                <div className="chat-bubble incoming">
                  A quick check-in?
                  <br />
                  Your return plan is set for 16:00.
                </div>
                <div className="chat-bubble outgoing">
                  I’m okay. Taking a break
                  <br />
                  before heading back. <small>CHECK-IN</small>
                </div>
                <span className="chat-delivery">Recorded in demo timeline ✓</span>
                <div className="chat-system">
                  <span>✓</span>
                  <div>
                    <b>Check-in recorded</b>
                    <small>hiker.check_in · 13:42</small>
                  </div>
                </div>
              </>
            ) : active === 1 ? (
              <>
                <div className="chat-offline">◷ NETWORK UNAVAILABLE</div>
                <div className="chat-bubble outgoing pending">
                  I’m okay. Taking a break
                  <br />
                  before heading back.
                </div>
                <span className="chat-delivery">Saved on this device · waiting to sync</span>
                <div className="queue-illustration">
                  <span>01</span>
                  <p>CHECK-IN IN THE QUEUE</p>
                  <div>
                    DEVICE <i>··········</i> SERVER
                  </div>
                </div>
                <p className="chat-explainer">
                  Your event is kept locally.
                  <br />A connection is needed to synchronize.
                </p>
              </>
            ) : (
              <>
                <div className="chat-bubble outgoing">
                  Back safely.
                  <br />
                  What a day on the trail. ✓
                </div>
                <span className="chat-delivery">Safe return confirmed</span>
                <div className="chat-complete">
                  <span>✓</span>
                  <h3>Home, safely.</h3>
                  <p>
                    Hike completed
                    <br />
                    Tracking stopped
                    <br />
                    Incident resolved
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="chat-input">
            <span>SIMULATED CHECK-IN FLOW</span>
            <i>↑</i>
          </div>
          <div className="phone-home-bar" />
        </div>
        <div className="story-progress" aria-hidden="true">
          {channels.map((_, i) => (
            <i key={i} className={active === i ? 'active' : ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
