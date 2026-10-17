import { useEffect, useRef, useState, type Dispatch } from 'react';
import { scenarios, signals, type Action, type DemoState } from './demo';
import prototypeDocument from '../public/prototype/index.html?raw';

// These controls belong only to the clearly labelled explanatory route diagram.
export function Status({ state }: { state: DemoState }) {
  const signal = signals[state.scenario];
  return <span className={`status ${signal.risk.toLowerCase()}`}><i />{state.active || state.completed ? signal.risk : 'READY TO EXPLORE'}</span>;
}
export function ScenarioControls({ state, dispatch }: { state: DemoState; dispatch: Dispatch<Action> }) {
  return <div className="scenario-buttons">{scenarios.map(s => <button key={s.id}
    aria-pressed={state.scenario === s.id && (state.active || state.completed)} disabled={!state.active}
    className={state.scenario === s.id ? 'selected' : ''}
    onClick={() => dispatch({ type: 'scenario', scenario: s.id })}>
    <span className="scenario-dot" />{s.short}<span>↗</span></button>)}</div>;
}
export type PrototypeSnapshot = {
  ready: boolean; active: null | { id: string; destination: string; status: string; expectedReturnAt: number; currentRiskScore: number; sosActive: boolean };
  risk: null | { score: number; level: string; reasons: string[] };
  alert: null | { id: string; lifecycle: string; state: string };
  network: string; points: number; queueCount: number; historyCount: number; demoOffline: boolean; error: string | null;
};
const realScenarios = [
  ['walking', 'WALKING'], ['rest30', 'REST · 30 MIN'], ['rest60', 'REST · 60 MIN'],
  ['rest120', 'REST · 2 HOURS'], ['late', 'LATE RETURN'], ['deviation', 'OFF ROUTE'],
  ['high', 'HIGH RISK'], ['critical', 'CRITICAL'],
];
export function ProductDemo({ onSnapshot }: { onSnapshot: (snapshot: PrototypeSnapshot | null) => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState<PrototypeSnapshot | null>(null);
  const [generation, setGeneration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow ||
          event.data?.source !== 'hike-safe-prototype' || event.data.type !== 'snapshot') return;
      const next = event.data.snapshot as PrototypeSnapshot;
      setSnapshot(next); onSnapshot(next); setNotice('');
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [onSnapshot]);
  useEffect(() => {
    const changed = () => setExpanded(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  function command(command: string) {
    frame.current?.contentWindow?.postMessage({ source: 'hike-safe-presentation', command }, location.origin);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.current?.requestFullscreen) await stage.current.requestFullscreen();
      else setNotice('Full screen is unavailable here. Use OPEN APP for a dedicated view.');
    } catch { setNotice('Use OPEN APP for a dedicated view in this browser.'); }
  }
  function reset() { setSnapshot(null); onSnapshot(null); setGeneration(v => v + 1); }
  return <>
    <div className="section-heading demo-heading"><div>
      <span className="eyebrow">07 / LIVE PRODUCT DEMO</span>
      <h2>The actual app.<br /><span className="muted">Ready to explore.</span></h2>
    </div><div><p>This is the current HIKE SAFE prototype.</p>
      <p>Create a hike, explore your history, change the conditions, and try the existing SOS flow.</p>
    </div></div>
    <div className="prototype-stage" ref={stage}>
      <div className="prototype-toolbar"><span><i /> EXISTING HIKE SAFE PROTOTYPE</span><div>
        <a href="/prototype/index.html" target="_blank" rel="noreferrer">OPEN APP ↗</a>
        <button onClick={fullscreen}>{expanded ? 'EXIT FULL SCREEN' : 'FULL SCREEN'} ⤢</button>
        <button onClick={reset}>↻ RESET DEMO</button>
      </div></div>
      <div className="prototype-grid">
        <aside className="prototype-controls"><span className="eyebrow">THE DEMO LAB</span><h3>Change the conditions.</h3>
          <p>{snapshot?.active ? 'These controls run the prototype’s existing scenario generator.' : 'Tap Start a hike inside the app and confirm a route to unlock the scenarios.'}</p>
          <div className="scenario-buttons">{realScenarios.map(([id, label]) => <button key={id} disabled={!snapshot?.active} onClick={() => command(id!)}><span className="scenario-dot" />{label}<span>↗</span></button>)}
            <button disabled={!snapshot?.active} onClick={() => command('offline')}>{snapshot?.demoOffline ? 'RESTORE NETWORK' : 'SIMULATE OFFLINE'} <span>↗</span></button>
          </div>
          <p className="small-note">Use SOS and finish the hike inside the app. Reloading or resetting starts a fresh demonstration.</p>
        </aside>
        <div className="prototype-phone"><div className="prototype-device-top"><span />HIKE SAFE / WEB PREVIEW</div>
          <iframe key={generation} ref={frame} srcDoc={prototypeDocument.replace('<head>', `<head><base href="${location.origin}/prototype/">`)} title="Existing HIKE SAFE application prototype" allow="fullscreen; cross-origin-isolated" />
        </div>
        <aside className="prototype-console"><div className="panel-topline"><span>APP STATE</span><span>{snapshot ? 'CONNECTED' : 'LOADING'}</span></div>
          <h3>{snapshot?.active?.destination || 'A new way out.'}</h3>
          <div className="prototype-score"><strong>{snapshot?.risk?.score ?? '—'}</strong><span>/ 100<br />{snapshot?.risk?.level || 'AWAITING HIKE'}</span></div>
          <dl>{[
            ['Hike status', snapshot?.active?.status || (snapshot?.historyCount ? 'COMPLETED' : 'NOT STARTED')],
            ['Network', snapshot?.network || '—'], ['GPS samples', snapshot?.points ?? '—'],
            ['Saved hikes', snapshot?.historyCount ?? '—'], ['Queued updates', snapshot?.queueCount ?? '—'],
            ['Alert', snapshot?.alert?.lifecycle || 'NONE'],
            ['Delivery', snapshot?.alert?.state || '—'],
          ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <div className="prototype-reasons"><small>RISK REASONS</small><p>{snapshot?.risk?.reasons.length ? snapshot.risk.reasons.join(' · ').replaceAll('_', ' ') : 'No risk factors reported.'}</p></div>
          <p className="small-note">Real app UI and risk logic. Local demo data. Browser map is schematic; background GPS and emergency dispatch are not active.</p>
          {(notice || snapshot?.error) && <p role="status">{notice || `App notice: ${snapshot?.error}`}</p>}
        </aside>
      </div>
    </div>
  </>;
}
