import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { demoReducer, defaultPlan, initialState, signals } from './demo';
import { ProductDemo, ScenarioControls, Status } from './ProductDemo';
import { TerrainMap } from './TerrainMap';
import './styles.css';

const chapters = [
  'home',
  'problem',
  'solution',
  'how-it-works',
  'technology',
  'live-map',
  'offline',
  'demo',
  'architecture',
  'almaty',
  'future',
  'closing',
];
const chapterNames = [
  'The way back',
  'The problem',
  'A return plan',
  'How it works',
  'Risk intelligence',
  'On the trail',
  'Beyond the network',
  'Live prototype',
  'Under the surface',
  'Made for Almaty',
  'What comes next',
  'A way home',
];
function Logo() {
  return (
    <a className="logo" href="#home" aria-label="HIKE SAFE home">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path d="M3 29 17 5l16 24H3m9-16 6 9 5-6" />
      </svg>
      <span>
        HIKE <b>SAFE</b>
      </span>
    </a>
  );
}
function App() {
  const [state, dispatch] = useReducer(demoReducer, initialState);
  const [menu, setMenu] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [chapter, setChapter] = useState(0);
  const signal = signals[state.scenario];
  const scrollToChapter = (index: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, index));
    document
      .getElementById(chapters[next]!)
      ?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    setChapter(next);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = chapters.indexOf(entry.target.id);
            if (index >= 0) setChapter(index);
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.18 },
    );
    document.querySelectorAll('main > section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!presentation) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.closest('input,textarea,select,[role="dialog"]') || e.target.isContentEditable)
      )
        return;
      if (e.key === 'Escape') {
        setPresentation(false);
        return;
      }
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        scrollToChapter(chapter + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : -1));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [presentation, chapter]);
  return (
    <div className={presentation ? 'presentation-mode' : ''}>
      <a className="skip-link" href="#demo">
        Skip to interactive prototype
      </a>
      <header className="site-header">
        <Logo />
        <nav className={menu ? 'open' : ''} aria-label="Main navigation">
          {[
            ['Problem', 'problem'],
            ['Solution', 'solution'],
            ['Technology', 'technology'],
            ['Demo', 'demo'],
            ['Future', 'future'],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#demo">
          TRY PROTOTYPE <span>↗</span>
        </a>
        <button
          className="menu-toggle"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? '✕' : '☰'}
        </button>
      </header>
      <main>
        <section id="home" className="hero">
          <div className="hero-image" />
          <div className="hero-shade" />
          <div className="hero-coordinates">
            <span>43°09′25.9″N</span>
            <span>77°04′49.1″E</span>
            <i />
            <span>ILE-ALATAU · KAZAKHSTAN</span>
          </div>
          <svg className="hero-route" viewBox="0 0 600 550" aria-hidden="true">
            <path d="M45 560 170 445 198 350 318 298 337 210 420 180 475 55" />
            <circle cx="337" cy="210" r="5" />
            <circle className="route-ring" cx="337" cy="210" r="17" />
          </svg>
          <div className="hero-content">
            <span className="eyebrow">
              <i className="tiny-dot" /> MOUNTAIN SAFETY PLATFORM
            </span>
            <h1>
              GO FURTHER.
              <br />
              COME BACK
              <br />
              <span>SAFELY.</span>
            </h1>
            <p>
              Adventure takes you off the grid.
              <br />A return plan helps bring you back.
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#solution">
                SEE HOW IT WORKS <span>↗</span>
              </a>
              <a className="button ghost" href="#demo">
                <span className="play-icon">▷</span> OPEN APP DEMO
              </a>
            </div>
          </div>
          <div className="hero-location">
            <span className="crosshair">⌖</span>
            <div>
              <small>THE MOUNTAINS ARE CALLING.</small>
              <strong>Have a way back.</strong>
              <span>ALMATY REGION / CONCEPT ROUTE</span>
            </div>
          </div>
          <div className="hero-footer">
            <div>
              <span>
                <i /> LIVE LOCATION
              </span>
              <span>
                <i /> RISK ANALYSIS
              </span>
              <span>
                <i /> OFFLINE-FIRST
              </span>
              <span>
                <i /> SOS
              </span>
            </div>
            <a href="#problem">
              SCROLL TO EXPLORE <b>↓</b>
            </a>
          </div>
        </section>

        <section id="problem" className="section problem-section">
          <div className="section-heading">
            <span className="eyebrow">01 / THE SILENT PROBLEM</span>
            <span className="section-aside">
              A beautiful trail.
              <br />
              An invisible emergency.
            </span>
          </div>
          <div className="problem-layout">
            <div>
              <h2>
                The problem starts
                <br />
                when nobody knows
                <br />
                <span className="muted">you’re in trouble.</span>
              </h2>
              <p className="body-copy">
                An injury. A wrong turn. A phone with no signal.
                <br />
                In the mountains, the person who needs help
                <br />
                may be the one who cannot ask for it.
              </p>
              <div className="quiet-statement">
                <span>↗</span> Safety needs more than an SOS button.
              </div>
            </div>
            <div className="story-timeline">
              {[
                ['08:20', 'The hike begins.', 'A return plan is set.'],
                ['11:47', 'Last confirmed movement.', 'The trail goes quiet.'],
                ['13:50', 'Same small area.', 'Verified samples. Growing concern.'],
                ['16:05', 'No return confirmation.', 'The expected return has passed.'],
                ['16:20', 'Silence becomes a signal.', 'Illustrative scenario · CRITICAL'],
              ].map(([time, title, description], i) => (
                <div className={i === 4 ? 'timeline-critical' : ''} key={time}>
                  <time>{time}</time>
                  <i />
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="comparison-row">
            <div>
              <small>01 / SOS BUTTON</small>
              <h3>“I need help.”</h3>
              <p>Depends on a hiker being able to act.</p>
            </div>
            <div>
              <small>02 / LOCATION SHARING</small>
              <h3>“I’m here.”</h3>
              <p>A location alone does not explain risk.</p>
            </div>
            <div>
              <small className="safe-text">03 / HIKE SAFE</small>
              <h3>“Something may be wrong.”</h3>
              <p>A plan, verified movement and time, together.</p>
            </div>
          </div>
        </section>

        <section id="solution" className="section solution-section">
          <span className="eyebrow">02 / A RETURN PLAN, WITH INTELLIGENCE</span>
          <h2>
            Watches the hike.
            <br />
            <span className="muted">Not the hiker.</span>
          </h2>
          <p className="body-copy">
            HIKE SAFE brings the signals together to identify
            <br />
            potential danger before silence becomes an emergency.
          </p>
          <div className="signal-orbit">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-center">
              <Logo />
              <span>ONE HIKE. A CLEARER PICTURE.</span>
              <svg viewBox="0 0 240 100" aria-hidden="true">
                <path d="m0 80 40-28 33 9 22-40 28 27 39-35 26 16 52-28" />
              </svg>
            </div>
            {[
              ['ETA', 'Expected return'],
              ['GPS', 'Verified location'],
              ['MOTION', 'Actual movement'],
              ['ROUTE', 'Planned progress'],
              ['CHECK-IN', 'Hiker confirmation'],
              ['SYNC', 'Last connection'],
            ].map(([title, text], i) => (
              <div key={title} className={`signal-node node-${i}`}>
                <span className="tiny-dot" />
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            ))}
          </div>
          <p className="center-caption">Active during the hike. Designed around the journey.</p>
        </section>

        <section id="how-it-works" className="section how-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / FROM FIRST STEP TO SAFE RETURN</span>
              <h2>
                A simple plan.
                <br />
                <span className="muted">A connected journey.</span>
              </h2>
            </div>
            <a href="#demo" className="text-button">
              TAKE IT FOR A WALK ↗
            </a>
          </div>
          <div className="steps">
            {[
              ['01', 'Plan', 'Your route. Your return time. Your emergency contact.', '⌖'],
              ['02', 'Track', 'Location samples recorded during the active hike.', '↗'],
              ['03', 'Analyze', 'Time and verified movement become risk signals.', '≋'],
              ['04', 'Escalate', 'A potential emergency becomes one incident.', '◎'],
              ['05', 'Resolve', 'Confirm a safe return. Close the hike and incident.', '✓'],
            ].map(([n, title, body, icon]) => (
              <article key={n}>
                <div className="step-top">
                  <span>{n}</span>
                  <i>{icon}</i>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="journey-line">
            <span>DEPARTURE</span>
            <i />
            <span>HOME, SAFELY</span>
          </div>
        </section>

        <section id="technology" className="section risk-section">
          <div className="risk-copy">
            <span className="eyebrow">04 / READING THE SIGNALS</span>
            <h2>
              Risk is not
              <br />
              <span className="muted">one number.</span>
            </h2>
            <p className="body-copy">
              A late return means something different from a lost GPS signal. Context is the
              difference between a useful alert and a false alarm.
            </p>
            <div className="logic-rule">
              <small>THE IMPORTANT DISTINCTION</small>
              <h3>
                NO GPS <span>≠</span> NO MOVEMENT
              </h3>
              <div className="wrong-logic">
                × <del>No coordinates → stationary</del>
              </div>
              <div className="correct-logic">✓ No coordinates → location unknown</div>
              <div className="correct-logic">✓ Similar verified coordinates → stationary</div>
            </div>
          </div>
          <div className="risk-instrument">
            <div className="panel-topline">
              <span>RISK ENGINE / LIVE DEMO STATE</span>
              <span>◈</span>
            </div>
            <div
              className={`risk-gauge ${signal.risk.toLowerCase()}`}
              style={{ '--score': `${signal.score}%` } as React.CSSProperties}
            >
              <div>
                <small>RISK SCORE</small>
                <strong>{state.active || state.completed ? signal.score : '—'}</strong>
                <Status state={state} />
              </div>
            </div>
            <dl className="risk-signals">
              <div>
                <dt>Movement</dt>
                <dd>{state.active || state.completed ? signal.motion : 'Awaiting hike'}</dd>
              </div>
              <div>
                <dt>GPS</dt>
                <dd>{signal.gps ? 'Available' : 'SIGNAL UNKNOWN'}</dd>
              </div>
              <div>
                <dt>Network</dt>
                <dd>{signal.network ? 'Online' : 'Offline'}</dd>
              </div>
              <div>
                <dt>Incident</dt>
                <dd>{state.incident?.status || 'Not created'}</dd>
              </div>
            </dl>
            <a href="#demo" className="text-button">
              CONTROL THE SIGNALS IN THE DEMO ↗
            </a>
            <p className="small-note">
              Illustrative thresholds and scores, not a validated safety model.
            </p>
          </div>
        </section>

        <section id="live-map" className="section live-map-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">05 / THE TRAIL TELLS A STORY</span>
              <h2>
                Every point.
                <br />
                <span className="muted">Part of the picture.</span>
              </h2>
            </div>
            <p>
              From Medeu toward Furmanovka Peak.
              <br />
              Explore how the same route looks
              <br />
              under different conditions.
            </p>
          </div>
          <div className="wide-map">
            <TerrainMap state={state} />
            <div className="map-overlay">
              <small>YOUR NEXT SUMMIT</small>
              <h3>{state.plan.destination}</h3>
              <Status state={state} />
              <dl>
                <div>
                  <dt>START</dt>
                  <dd>{state.plan.start}</dd>
                </div>
                <div>
                  <dt>EXPECTED RETURN</dt>
                  <dd>{state.plan.expectedReturn}</dd>
                </div>
              </dl>
              <p>
                {state.active || state.completed
                  ? signal.detail
                  : 'Start a demo hike to activate the scenario controls.'}
              </p>
              {!state.active && !state.completed && (
                <button
                  className="button primary full"
                  onClick={() => dispatch({ type: 'start', plan: defaultPlan })}
                >
                  START DEMO HIKE ↗
                </button>
              )}
            </div>
          </div>
          <ScenarioControls state={state} dispatch={dispatch} />
          <small className="small-note">
            Concept map · illustrative route geometry, not for navigation.
          </small>
        </section>

        <section id="offline" className="section offline-section">
          <div>
            <span className="eyebrow">06 / DESIGNED FOR THE GAPS</span>
            <h2>
              Mountains don’t
              <br />
              guarantee <span className="muted">internet.</span>
            </h2>
            <p className="body-copy">
              A weak connection should not erase the journey.
              <br />
              The planned mobile system stores available GPS samples
              <br />
              locally, then synchronizes when connectivity returns.
            </p>
            <div className="network-switch">
              <span className={signal.network ? 'online' : ''}>
                <i /> {signal.network ? 'ONLINE' : 'NO NETWORK'}
              </span>
              <strong>{state.queued.toString().padStart(2, '0')}</strong>
              <small>EVENTS IN DEMO QUEUE</small>
            </div>
            <a className="text-button" href="#demo">
              SIMULATE A LOST CONNECTION ↗
            </a>
          </div>
          <div className="offline-flow">
            {[
              ['01', 'GPS sample', 'When a position is available'],
              ['02', 'Local database', 'Stored on the device'],
              ['03', 'Sync queue', 'Waiting for a connection'],
              ['04', 'Server', 'Synchronized when online'],
            ].map(([n, title, body]) => (
              <div key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <i>{n === '03' && !signal.network ? '◷' : '↓'}</i>
              </div>
            ))}
            <p>
              No network ≠ no GPS.
              <br />
              No GPS means no new position samples.
            </p>
          </div>
        </section>

        <section id="demo" className="section demo-section">
          <ProductDemo state={state} dispatch={dispatch} />
        </section>

        <section id="architecture" className="section architecture-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">08 / UNDER THE SURFACE</span>
              <h2>
                Local first.
                <br />
                <span className="muted">Connected when possible.</span>
              </h2>
            </div>
            <p>
              Proposed mobile architecture.
              <br />
              This presentation runs entirely
              <br />
              as a local browser simulation.
            </p>
          </div>
          <div className="architecture-flow">
            {[
              [
                '01',
                'MOBILE APP',
                'Expo / React Native',
                ['GPS tracking', 'SQLite storage', 'Offline sync queue'],
              ],
              [
                '02',
                'DATA PLATFORM',
                'Supabase',
                ['Authentication', 'Hikes & GPS samples', 'PostgreSQL incidents'],
              ],
              [
                '03',
                'MONITORING',
                'Risk & escalation',
                ['Signal evaluation', 'One active incident', 'Resolution workflow'],
              ],
            ].map(([num, title, sub, items]) => (
              <article key={String(num)}>
                <span className="arch-number">{num}</span>
                <small>{title}</small>
                <h3>{sub}</h3>
                <div>
                  {(items as string[]).map((item) => (
                    <span key={item}>
                      <i /> {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="engineering-rules">
            {[
              [
                '01',
                'Unknown isn’t inactive.',
                'Never infer stationary behavior from missing GPS.',
              ],
              [
                '02',
                'One hike. One incident.',
                'Repeated signals update the same active incident.',
              ],
              ['03', 'Resolved means resolved.', 'A closed hike cannot repeatedly escalate.'],
            ].map(([n, title, body]) => (
              <div key={n}>
                <small>RULE {n}</small>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="almaty" className="almaty-section">
          <div className="almaty-image" />
          <div className="almaty-content">
            <span className="eyebrow">09 / CLOSE TO HOME</span>
            <h2>
              A city at the
              <br />
              foot of adventure.
            </h2>
            <p>
              Built around a real Almaty problem.
              <br />
              Nearby mountain trails invite exploration.
              <br />
              Terrain and unreliable connectivity can make
              <br />
              an emergency harder to communicate.
            </p>
            <div className="almaty-coordinate">
              <span>43.2389° N</span>
              <i />
              <span>76.8897° E</span>
            </div>
          </div>
          <div className="aruzhan-story">
            <small>AN ILLUSTRATIVE JOURNEY / ARUZHAN</small>
            <h3>
              A hike. A pause.
              <br />A signal worth noticing.
            </h3>
            <div>
              <span>08:12</span>
              <p>Leaves Medeu with a return plan.</p>
            </div>
            <div>
              <span>13:42</span>
              <p>Verified positions remain in a small area.</p>
            </div>
            <div>
              <span>17:03</span>
              <p>Overdue + confirmed inactivity → critical.</p>
            </div>
            <div>
              <span>17:04</span>
              <p>One simulated incident is created.</p>
            </div>
            <blockquote>
              We cannot prevent every accident.
              <br />
              We can work toward making
              <br />
              silence visible sooner.
            </blockquote>
          </div>
        </section>

        <section id="future" className="section future-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">10 / A RESPONSIBLE WAY FORWARD</span>
              <h2>
                A working concept.
                <br />
                <span className="muted">A bigger horizon.</span>
              </h2>
            </div>
            <p>
              A student prototype with a clear direction.
              <br />
              Test carefully. Learn in the field.
              <br />
              Build trust before expanding.
            </p>
          </div>
          <div className="roadmap">
            {[
              [
                '01',
                'NOW',
                'Interactive prototype',
                'Hike plans, risk scenarios, offline queue simulation and incident lifecycle.',
              ],
              [
                '02',
                'NEXT',
                'Real-world testing',
                'Route testing, battery optimization, offline validation and fewer false positives.',
              ],
              [
                '03',
                'PLANNED',
                'Safety integrations',
                'Explore trusted contacts, mapping providers and verified emergency workflows.',
              ],
              [
                '04',
                'POSSIBLE',
                'More context',
                'Terrain, weather, smartwatches and satellite-capable devices.',
              ],
            ].map(([n, label, title, body], i) => (
              <article key={n} className={i === 0 ? 'current' : ''}>
                <div>
                  <span>{n}</span>
                  <small>{label}</small>
                </div>
                <i />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="future-disclaimer">
            Future integrations are possibilities, not existing capabilities or partnerships.
          </p>
        </section>

        <section id="closing" className="closing-section">
          <div className="closing-image" />
          <div className="closing-content">
            <span className="eyebrow">THE SUMMIT IS ONLY HALF THE JOURNEY.</span>
            <h2>
              EVERY HIKE
              <br />
              DESERVES
              <br />
              <span>A WAY HOME.</span>
            </h2>
            <p>
              A hike plan. Location signals. Time.
              <br />A chance to notice when something may be wrong.
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#demo">
                TRY THE PROTOTYPE <span>↗</span>
              </a>
              <a className="text-button" href="#home">
                RESTART PRESENTATION ↑
              </a>
            </div>
          </div>
          <footer>
            <Logo />
            <span>STUDENT PROJECT · INTERACTIVE PROTOTYPE</span>
            <span>ALMATY, KAZAKHSTAN · 2026</span>
          </footer>
        </section>
      </main>
      <div className={`presentation-controls ${presentation ? 'enabled' : ''}`}>
        <button
          onClick={() => {
            setPresentation(!presentation);
            setMenu(false);
          }}
          aria-pressed={presentation}
        >
          <span>▣</span> {presentation ? 'EXIT PRESENTATION' : 'PRESENTATION MODE'}
        </button>
        {presentation && (
          <>
            <button
              aria-label="Previous chapter"
              disabled={chapter === 0}
              onClick={() => scrollToChapter(chapter - 1)}
            >
              ←
            </button>
            <span className="chapter-counter">
              {String(chapter + 1).padStart(2, '0')} / {chapters.length}
            </span>
            <button
              aria-label="Next chapter"
              disabled={chapter === chapters.length - 1}
              onClick={() => scrollToChapter(chapter + 1)}
            >
              →
            </button>
            <small>{chapterNames[chapter]}</small>
          </>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
