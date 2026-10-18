import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initialState, signals } from './demo';
import { ProductDemo, type PrototypeSnapshot } from './ProductDemo';
import {
  Cite,
  EvidenceSection,
  AlmatySection,
  ApproachesSection,
  EvidenceToDesign,
  LimitationsSection,
  ReferencesSection,
} from './ResearchSections';
import './research.css';
import { ConnectedStory, MetricCarousel, OrbitStory } from './DesignStories';
import './styles.css';
import './design-stories.css';
import './prototype.css';

const chapters = [
  'home',
  'problem',
  'evidence',
  'almaty',
  'approaches',
  'solution',
  'evidence-to-design',
  'how-it-works',
  'technology',
  'demo',
  'architecture',
  'limitations',
  'future',
  'closing',
  'references',
];
const chapterNames = [
  'HIKE SAFE',
  'The problem',
  'Evidence',
  'Why Almaty?',
  'Current approaches',
  'Our solution',
  'From evidence to design',
  'How it works',
  'Technical logic',
  'Live prototype',
  'System architecture',
  'Limitations',
  'Future development',
  'Conclusion',
  'References',
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
  const state = initialState;
  const [prototype, setPrototype] = useState<PrototypeSnapshot | null>(null);
  const [menu, setMenu] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [chapter, setChapter] = useState(0);
  const signal = signals[state.scenario];
  const scrollToChapter = (index: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, index));
    document.getElementById(chapters[next]!)?.scrollIntoView({
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
            ['Evidence', 'evidence'],
            ['Almaty', 'almaty'],
            ['Solution', 'solution'],
            ['Technology', 'technology'],
            ['Demo', 'demo'],
            ['Sources', 'references'],
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
            <span>DEMO ROUTE</span>
            <span>ALMATY CONTEXT</span>
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
              <i className="tiny-dot" /> 01 / HIKE SAFE · ASSIGNMENT 1
            </span>
            <h1>
              GO FURTHER.
              <br />
              COME BACK
              <br />
              <span>SAFELY.</span>
            </h1>
            <p>
              A hiking safety prototype combining a return plan, GPS movement evidence and offline
              risk monitoring.
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
            <span className="eyebrow">02 / THE PROBLEM</span>
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
                NPS advises planning for a lost or injured companion; mountain rescue guidance warns
                that phone contact may fail. <Cite ids={[1, 2]} />
              </p>
              <div className="quiet-statement">
                <span>↗</span> Design question: how can a plan help when contact is absent?
              </div>
            </div>
            <div className="story-timeline">
              <span className="evidence-label">ILLUSTRATIVE SCENARIO · NOT AN INCIDENT REPORT</span>
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
        </section>

        <EvidenceSection />

        <AlmatySection />

        <ApproachesSection />

        <OrbitStory />

        <EvidenceToDesign />

        <section id="how-it-works" className="section how-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">08 / HOW IT WORKS</span>
              <h2>
                From plan to attention.
                <br />
                <span className="muted">A defined lifecycle.</span>
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
              [
                '04',
                'Escalate',
                'Multiple signals can create one incident; no dispatch in this demo.',
                '◎',
              ],
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

        <section id="technology" className="academic-technical">
          <section className="section risk-section">
            <div className="risk-copy">
              <span className="eyebrow">09 / TECHNICAL LOGIC</span>
              <h2>
                Risk is not
                <br />
                <span className="muted">one number.</span>
              </h2>
              <p className="body-copy">
                A late return means something different from a lost GPS signal. The prototype keeps
                these observations separate. Its thresholds are preliminary design rules, not
                measured predictors. <Cite ids={[3]} />
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
                <span>RISK ENGINE / ACTUAL APP STATE</span>
                <span>◈</span>
              </div>
              <div
                className={`risk-gauge ${signal.risk.toLowerCase()}`}
                style={{ '--score': `${prototype?.risk?.score ?? 0}%` } as React.CSSProperties}
              >
                <div>
                  <small>RISK SCORE</small>
                  <strong>{prototype?.risk?.score ?? '—'}</strong>
                  <span className="status">{prototype?.risk?.level || 'AWAITING HIKE'}</span>
                </div>
              </div>
              <dl className="risk-signals">
                <div>
                  <dt>Hike</dt>
                  <dd>{prototype?.active?.status || 'Awaiting hike'}</dd>
                </div>
                <div>
                  <dt>GPS</dt>
                  <dd>{prototype?.points ? `${prototype.points} demo samples` : 'No samples'}</dd>
                </div>
                <div>
                  <dt>Network</dt>
                  <dd>{prototype?.network || '—'}</dd>
                </div>
                <div>
                  <dt>Incident</dt>
                  <dd>{prototype?.alert?.lifecycle || 'Not created'}</dd>
                </div>
              </dl>
              <a href="#demo" className="text-button">
                CONTROL THE SIGNALS IN THE DEMO ↗
              </a>
              <p className="small-note">
                Calculated by the existing prototype. A prototype, not a validated safety model.
              </p>
            </div>
          </section>
          <section className="section offline-section">
            <div>
              <span className="eyebrow">LOCAL STORAGE / DELIVERY STATE</span>
              <h2>
                Connectivity is
                <br />
                <span className="muted">not guaranteed.</span>
              </h2>
              <p className="body-copy">
                A weak connection should not erase the journey.
                <br />
                The existing mobile repository stores available GPS samples
                <br />
                locally, with a queue for later synchronization. This follows a documented offline
                architecture pattern. <Cite ids={[7, 8]} />
              </p>
              <div className="network-switch">
                <span className={prototype?.network === 'ONLINE' ? 'online' : ''}>
                  <i /> {prototype?.network || 'AWAITING APP'}
                </span>
                <strong>{prototype?.queueCount ?? '—'}</strong>
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
                  <i>{n === '03' && prototype?.demoOffline ? '◷' : '↓'}</i>
                </div>
              ))}
              <p>
                No network ≠ no GPS.
                <br />
                No GPS means no new position samples.
              </p>
            </div>
          </section>
          <div className="technical-notes">
            <div>
              <h3>Unknown is not stationary.</h3>
              <p>
                Fresh, reliable samples can support low-movement evidence. Missing or stale samples
                produce unknown movement. That is a project rule motivated by GPS uncertainty.{' '}
                <Cite ids={[3]} />
              </p>
            </div>
            <div>
              <h3>A queue is not a rescue.</h3>
              <p>
                Storing an event offline preserves information. It does not contact anyone. An alert
                remains undelivered until communication and the receiving service succeed.
              </p>
            </div>
          </div>
          <details className="technical-extras">
            <summary>OPTIONAL VISUAL EXPLANATION · illustrative UI, not research evidence</summary>
            <MetricCarousel state={state} />
            <ConnectedStory />
          </details>
        </section>

        <section id="demo" className="section demo-section">
          <ProductDemo onSnapshot={setPrototype} />
        </section>

        <section id="architecture" className="section architecture-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">11 / SYSTEM ARCHITECTURE</span>
              <h2>
                Local first.
                <br />
                <span className="muted">Connected when possible.</span>
              </h2>
            </div>
            <p>
              Existing code, with a demo boundary.
              <br />
              The browser runs the real app locally;
              <br />
              backend delivery is disabled.
            </p>
          </div>
          <div className="architecture-flow">
            {[
              [
                '01',
                'MOBILE APP',
                'Expo / React Native',
                ['Existing screens + risk rules', 'SQLite local storage [8]', 'Offline sync queue'],
              ],
              [
                '02',
                'BACKEND · NOT CONNECTED IN DEMO',
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

        <LimitationsSection />

        <section id="future" className="section future-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">13 / FUTURE DEVELOPMENT</span>
              <h2>
                Validate before expanding.
                <br />
                <span className="muted">Measure what matters.</span>
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
                'Functional tests of the existing app: hike creation, GPS uncertainty, risk transitions and completion.',
              ],
              [
                '02',
                'NEXT',
                'Real-world testing',
                'Measure battery drain, GPS gaps and background continuity on real devices; record conditions and failures.',
              ],
              [
                '03',
                'PLANNED',
                'Safety integrations',
                'Evaluate false alerts and missed events with labelled scenarios; revise thresholds before any field claims.',
              ],
              [
                '04',
                'POSSIBLE',
                'More context',
                'Consider verified contact and rescue workflows only after agreements, privacy review and validation.',
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
            <span className="eyebrow">14 / CONCLUSION</span>
            <h2>
              EVERY HIKE
              <br />
              DESERVES
              <br />
              <span>A WAY HOME.</span>
            </h2>
            <p>
              The contribution is a traceable combination of plan, time and movement evidence.
              <br />
              The next step is to test whether it provides useful attention without excessive false
              alarms.
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

        <ReferencesSection />
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
