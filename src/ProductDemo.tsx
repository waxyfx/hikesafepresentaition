import { useEffect, useRef, useState, type Dispatch } from 'react';
import {
  clockAt,
  defaultPlan,
  scenarios,
  signals,
  type Action,
  type DemoState,
  type Plan,
} from './demo';
import { TerrainMap } from './TerrainMap';

export function Status({ state }: { state: DemoState }) {
  const signal = signals[state.scenario];
  return (
    <span className={`status ${signal.risk.toLowerCase()}`}>
      <i />
      {state.active || state.completed ? signal.risk : 'READY TO EXPLORE'}
    </span>
  );
}
export function ScenarioControls({
  state,
  dispatch,
}: {
  state: DemoState;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div className="scenario-buttons">
      {scenarios.map((s) => (
        <button
          key={s.id}
          aria-pressed={state.scenario === s.id && (state.active || state.completed)}
          disabled={!state.active}
          className={`${state.scenario === s.id && (state.active || state.completed) ? 'selected' : ''} ${s.id === 'sos' ? 'danger-text' : ''}`}
          onClick={() => dispatch({ type: 'scenario', scenario: s.id })}
        >
          <span className="scenario-dot" />
          {s.short}
          <span>↗</span>
        </button>
      ))}
    </div>
  );
}
function Phone({ state, dispatch }: { state: DemoState; dispatch: Dispatch<Action> }) {
  const [screen, setScreen] = useState<'home' | 'create' | 'map' | 'hikes' | 'profile'>('home');
  const [plan, setPlan] = useState<Plan>(defaultPlan);
  const [confirmation, setConfirmation] = useState<'sos' | 'end' | null>(null);
  const [notice, setNotice] = useState('');
  const signal = signals[state.scenario];
  const fields: { key: keyof Omit<Plan, 'tracking'>; label: string; type?: string }[] = [
    { key: 'name', label: 'Hike name' },
    { key: 'route', label: 'Route' },
    { key: 'start', label: 'Starting point' },
    { key: 'destination', label: 'Destination' },
    { key: 'departure', label: 'Departure', type: 'time' },
    { key: 'expectedReturn', label: 'Expected return', type: 'time' },
    { key: 'contact', label: 'Emergency contact (fictional)' },
  ];
  return (
    <div className="phone">
      <div className="phone-camera" />
      <div className="phone-statusbar">
        <span>9:41</span>
        <span>▥ ▰</span>
      </div>
      <div className="phone-scroll">
        <div className="phone-brand">
          △ HIKE SAFE <span>DEMO</span>
        </div>
        {screen === 'create' ? (
          <form
            className="create-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (plan.expectedReturn <= plan.departure) {
                setNotice('Return must be after departure for this same-day demo.');
                return;
              }
              dispatch({ type: 'start', plan });
              setScreen('home');
              setNotice('');
            }}
          >
            <button type="button" className="text-button" onClick={() => setScreen('home')}>
              ← Back
            </button>
            <h3>Your next adventure.</h3>
            <p>Give your hike a return plan.</p>
            {fields.map(({ key, label, type }) => (
              <label key={key}>
                {label}
                <input
                  required
                  maxLength={64}
                  type={type || 'text'}
                  value={plan[key]}
                  onChange={(e) => setPlan({ ...plan, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="toggle-label">
              Allow simulated location tracking
              <input
                type="checkbox"
                checked={plan.tracking}
                onChange={(e) => setPlan({ ...plan, tracking: e.target.checked })}
              />
            </label>
            {!plan.tracking && (
              <p className="form-message">Enable tracking to start this GPS demonstration.</p>
            )}
            {notice && (
              <p role="alert" className="form-message">
                {notice}
              </p>
            )}
            <button className="button primary full" disabled={!plan.tracking}>
              START HIKE ↗
            </button>
          </form>
        ) : screen === 'profile' ? (
          <div className="phone-page">
            <div className="avatar">A</div>
            <h3>Aruzhan</h3>
            <p>Fictional demo hiker · Almaty</p>
            <div className="phone-card">
              <small>EMERGENCY CONTACT</small>
              <strong>{state.plan.contact}</strong>
              <p>Simulation only. No messages are sent.</p>
            </div>
            <div className="phone-card">
              <small>PRIVACY BY DESIGN</small>
              <p>
                Planned concept: track only during an active hike. This browser demo uses no device
                location.
              </p>
            </div>
          </div>
        ) : screen === 'hikes' ? (
          <div className="phone-page">
            <h3>Your trails.</h3>
            <p>Fictional hike history</p>
            {state.completed && (
              <div className="history-row">
                <span>✓</span>
                <div>
                  <strong>{state.plan.name}</strong>
                  <small>Completed just now · safe return</small>
                </div>
              </div>
            )}
            {[
              ['Kok-Zhailau', '4h 32m'],
              ['Furmanovka Peak', '6h 14m'],
            ].map(([name, time]) => (
              <div className="history-row" key={name}>
                <span>↗</span>
                <div>
                  <strong>{name}</strong>
                  <small>Completed · {time}</small>
                </div>
              </div>
            ))}
          </div>
        ) : screen === 'map' ? (
          <div className="phone-page">
            <h3>Your route.</h3>
            <p>
              {state.plan.start} → {state.plan.destination}
            </p>
            <TerrainMap state={state} compact />
            <Status state={state} />
            <p>{state.active ? signal.detail : 'Start a hike to explore the live simulation.'}</p>
          </div>
        ) : state.active ? (
          <div className="active-screen">
            <div className="phone-title">
              <div>
                <small>ACTIVE HIKE · HS-1042</small>
                <h3>{state.plan.name}</h3>
              </div>
              <span className="tiny-dot" />
            </div>
            {signal.risk === 'SOS' && (
              <div className="sos-banner">
                <strong>SOS ACTIVE</strong>
                <small>SIMULATION — no dispatch</small>
              </div>
            )}
            <TerrainMap state={state} compact />
            <div className="phone-stats">
              <div>
                <strong>02:14:36</strong>
                <small>elapsed · demo</small>
              </div>
              <div>
                <strong>
                  7.4 <em>km</em>
                </strong>
                <small>distance</small>
              </div>
              <div>
                <strong>
                  2,820 <em>m</em>
                </strong>
                <small>altitude</small>
              </div>
            </div>
            <div className={`phone-risk ${signal.risk.toLowerCase()}`}>
              <div>
                <Status state={state} />
                <strong>
                  {signal.score}
                  <small> / 100</small>
                </strong>
              </div>
              <p>{signal.detail}</p>
            </div>
            <div className="phone-meta">
              <span>
                Expected return <b>{state.plan.expectedReturn}</b>
              </span>
              <span>
                Simulation time <b>{clockAt(state.plan.expectedReturn, signal.offset)}</b>
              </span>
              <span>
                Network <b>{signal.network ? 'Online' : 'Offline'}</b>
              </span>
            </div>
            <div className="phone-actions">
              <button
                onClick={() => {
                  dispatch({ type: 'check-in' });
                  setNotice(
                    signal.network
                      ? 'Check-in recorded.'
                      : 'Check-in saved locally. Waiting for network.',
                  );
                }}
              >
                ✓ CHECK IN
              </button>
              <button onClick={() => setConfirmation('end')}>END HIKE</button>
            </div>
            <button className="sos-button" onClick={() => setConfirmation('sos')}>
              ◎ SOS <span>Hold your plan. Get attention.</span>
            </button>
            {notice && (
              <p className="phone-notice" role="status">
                {notice} · {state.checkIns} total
              </p>
            )}
          </div>
        ) : state.completed ? (
          <div className="phone-page completed-screen">
            <div className="complete-icon">✓</div>
            <small>BACK WHERE YOU BELONG</small>
            <h3>Home, safely.</h3>
            <p>
              {state.plan.name} is complete.
              <br />
              Tracking stopped. {state.incident ? 'Incident resolved.' : 'No incident created.'}
            </p>
            <div className="phone-card">
              <small>FINAL STATUS</small>
              <Status state={state} />
            </div>
            <button
              className="button primary full"
              onClick={() => {
                setPlan(defaultPlan);
                setScreen('create');
              }}
            >
              PLAN ANOTHER HIKE ↗
            </button>
          </div>
        ) : (
          <div className="phone-home">
            <p>Good morning, Aruzhan</p>
            <h3>
              The mountains
              <br />
              are calling.
            </h3>
            <TerrainMap state={state} compact />
            <div className="home-ready">
              <span className="tiny-dot" /> NO ACTIVE HIKE
            </div>
            <button className="button primary full" onClick={() => setScreen('create')}>
              START A HIKE <span>↗</span>
            </button>
            <div className="recent-heading">
              <h4>Recent hikes</h4>
              <button className="text-button" onClick={() => setScreen('hikes')}>
                View all ↗
              </button>
            </div>
            {[
              ['Kok-Zhailau', '4h 32m'],
              ['Furmanovka Peak', '6h 14m'],
            ].map(([name, time]) => (
              <div className="history-row" key={name}>
                <span>↗</span>
                <div>
                  <strong>{name}</strong>
                  <small>Completed · {time}</small>
                </div>
                <b>✓</b>
              </div>
            ))}
          </div>
        )}
      </div>
      <nav className="phone-nav" aria-label="Prototype navigation">
        {(
          [
            { id: 'home', icon: '⌂', label: 'Home' },
            { id: 'map', icon: '⌖', label: 'Map' },
            { id: 'hikes', icon: '≋', label: 'Hikes' },
            { id: 'profile', icon: '○', label: 'Profile' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            aria-current={screen === tab.id ? 'page' : undefined}
            onClick={() => {
              setScreen(tab.id);
              setNotice('');
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="phone-home-bar" />
      {confirmation && (
        <div
          className="phone-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div>
            <span className={confirmation === 'sos' ? 'danger-text' : 'safe-text'}>
              {confirmation === 'sos' ? '◎' : '✓'}
            </span>
            <h3 id="confirm-title">
              {confirmation === 'sos' ? 'Activate demo SOS?' : 'Returned safely?'}
            </h3>
            <p>
              {confirmation === 'sos'
                ? 'SIMULATION — no real emergency service is contacted. This updates the demo incident.'
                : 'This closes your hike and resolves any active incident.'}
            </p>
            <button
              autoFocus
              className={`button full ${confirmation === 'sos' ? 'danger' : 'primary'}`}
              onClick={() => {
                dispatch({
                  type: 'scenario',
                  scenario: confirmation === 'sos' ? 'sos' : 'returned',
                });
                setConfirmation(null);
                setNotice('');
              }}
            >
              CONFIRM {confirmation === 'sos' ? 'SIMULATED SOS' : 'SAFE RETURN'}
            </button>
            <button className="text-button" onClick={() => setConfirmation(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function IncidentDashboard({ state }: { state: DemoState }) {
  const signal = signals[state.scenario];
  return (
    <div className="incident-dashboard">
      <div className="panel-topline">
        <span>MONITORING CONSOLE</span>
        <span className="simulation-badge">SIMULATION</span>
      </div>
      <div className="incident-title">
        <h3>
          {state.incident
            ? state.incident.status === 'RESOLVED'
              ? 'Incident resolved.'
              : 'One hike. One incident.'
            : 'Watching the signals.'}
        </h3>
        <span className={`status ${state.incident?.status.toLowerCase() || 'safe'}`}>
          <i />
          {state.incident?.status || 'NO INCIDENT'}
        </span>
      </div>
      <dl className="incident-grid">
        <div>
          <dt>Hiker</dt>
          <dd>Aruzhan · demo user</dd>
        </div>
        <div>
          <dt>Hike</dt>
          <dd>{state.plan.name}</dd>
        </div>
        <div>
          <dt>Incident ID</dt>
          <dd>{state.incident?.id || '—'}</dd>
        </div>
        <div>
          <dt>Risk signal</dt>
          <dd>{state.active || state.completed ? `${signal.score} / 100` : 'Awaiting hike'}</dd>
        </div>
        <div>
          <dt>Last confirmed GPS</dt>
          <dd>
            {!signal.gps
              ? '28 min ago · location unknown'
              : state.active
                ? '43.1572, 77.0803'
                : '—'}
          </dd>
        </div>
        <div>
          <dt>Expected return</dt>
          <dd>{state.plan.expectedReturn}</dd>
        </div>
      </dl>
      <div className="event-heading">
        <small>EVENT STREAM</small>
        <span>{state.events.length.toString().padStart(2, '0')} EVENTS</span>
      </div>
      <div className="event-stream" aria-live="polite">
        {state.events.length ? (
          state.events.map((e, i) => (
            <div key={`${i}-${e.name}`}>
              <time>{e.time}</time>
              <span className={/incident|sos/.test(e.name) ? 'event-incident' : ''}>{e.name}</span>
            </div>
          ))
        ) : (
          <p>
            Start a hike in the phone to begin.
            <br />
            Events will appear here as you run scenarios.
          </p>
        )}
      </div>
      <p className="console-footnote">Local browser simulation. No real emergency dispatch.</p>
    </div>
  );
}

export function ProductDemo({ state, dispatch }: { state: DemoState; dispatch: Dispatch<Action> }) {
  const [expanded, setExpanded] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = stageRef.current;
    const first = element?.querySelector<HTMLButtonElement>('button');
    first?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setExpanded(false);
        expandButton.current?.focus();
      }
      if (e.key === 'Tab') {
        const items = Array.from(
          element?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [tabindex="0"]') ||
            [],
        );
        const a = items[0],
          z = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z?.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a?.focus();
        }
      }
    };
    window.addEventListener('keydown', key, true);
    return () => {
      document.body.style.overflow = prior;
      window.removeEventListener('keydown', key, true);
    };
  }, [expanded]);
  return (
    <>
      <div className="section-heading demo-heading">
        <div>
          <span className="eyebrow">07 / THE PRODUCT, IN YOUR HANDS</span>
          <h2>
            Less explaining.
            <br />
            <span className="muted">More exploring.</span>
          </h2>
        </div>
        <div>
          <p>
            A real, clickable prototype.
            <br />
            Plan a hike. Change the conditions.
            <br />
            Watch the whole system respond.
          </p>
          <button ref={expandButton} className="text-button" onClick={() => setExpanded(true)}>
            ENTER FULL DEMO <span>↗</span>
          </button>
        </div>
      </div>
      <div
        className={`demo-stage ${expanded ? 'expanded' : ''}`}
        ref={stageRef}
        role={expanded ? 'dialog' : undefined}
        aria-modal={expanded || undefined}
        aria-label={expanded ? 'HIKE SAFE full demo' : undefined}
      >
        {expanded && (
          <button
            className="close-demo"
            onClick={() => {
              setExpanded(false);
              expandButton.current?.focus();
            }}
          >
            ✕ CLOSE DEMO <small>ESC</small>
          </button>
        )}
        <div className="demo-controls">
          <div className="panel-topline">
            <span>DEMO SCENARIO</span>
            <span>01—07</span>
          </div>
          <h3>Change the conditions.</h3>
          <p>
            {state.active
              ? 'Select a scenario. The phone, map and console stay in sync.'
              : state.completed
                ? 'Hike closed. Reset or plan another hike to demonstrate again.'
                : 'First, tap START A HIKE on the phone and confirm your plan.'}
          </p>
          <ScenarioControls state={state} dispatch={dispatch} />
          <button
            className="reset-button"
            onClick={() => {
              dispatch({ type: 'reset' });
              setResetKey((v) => v + 1);
            }}
          >
            ↻ RESET DEMO
          </button>
          <div className="simulation-note">
            <span>◈</span>
            <p>
              <b>SIMULATION</b>
              <br />
              No real emergency service is contacted.
            </p>
          </div>
        </div>
        <Phone key={resetKey} state={state} dispatch={dispatch} />
        <IncidentDashboard state={state} />
      </div>
    </>
  );
}
