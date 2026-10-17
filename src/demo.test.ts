import { describe, expect, it } from 'vitest';
import { defaultPlan, demoReducer, initialState, signals, type Scenario } from './demo';

describe('presentation simulation safety invariants', () => {
  const start = () => demoReducer(initialState, { type: 'start', plan: defaultPlan });
  it('never treats missing coordinates as stationary', () => {
    const warning = demoReducer(start(), { type: 'scenario', scenario: 'stationary' });
    const unknown = demoReducer(warning, { type: 'scenario', scenario: 'gps-lost' });
    expect(signals[unknown.scenario].gps).toBe(false);
    expect(signals[unknown.scenario].motion).toContain('Unknown');
    expect(unknown.events.at(-2)?.name).toBe('gps.signal_unknown');
    expect(unknown.incident).toBeNull();
  });
  it('updates one incident through repeated critical and SOS conditions', () => {
    let state = start();
    for (const scenario of ['overdue', 'critical', 'sos', 'critical', 'sos'] as Scenario[])
      state = demoReducer(state, { type: 'scenario', scenario });
    expect(state.incident).toEqual({ id: 'INC-1042', status: 'SOS' });
    expect(state.events.filter((e) => e.name === 'incident.created_simulation')).toHaveLength(1);
  });
  it('locks a resolved hike against every further scenario', () => {
    let state = demoReducer(start(), { type: 'scenario', scenario: 'sos' });
    state = demoReducer(state, { type: 'scenario', scenario: 'returned' });
    expect(state.active).toBe(false);
    expect(state.incident?.status).toBe('RESOLVED');
    for (const scenario of [
      'normal',
      'stationary',
      'gps-lost',
      'overdue',
      'critical',
      'sos',
    ] as Scenario[])
      expect(demoReducer(state, { type: 'scenario', scenario })).toBe(state);
  });
  it('queues check-ins offline and drains them when online', () => {
    let state = demoReducer(start(), { type: 'scenario', scenario: 'gps-lost' });
    state = demoReducer(state, { type: 'check-in' });
    expect(state.queued).toBe(1);
    expect(state.events.at(-1)?.name).toBe('check_in.queued_locally');
    state = demoReducer(state, { type: 'scenario', scenario: 'overdue' });
    expect(state.queued).toBe(0);
    expect(state.events.at(-1)?.name).toBe('sync.completed_1_events');
  });
  it('records available GPS samples locally during a network outage', () => {
    const state = demoReducer(start(), { type: 'scenario', scenario: 'critical' });
    expect(state.queued).toBe(4);
    expect(signals[state.scenario].gps).toBe(true);
    expect(signals[state.scenario].network).toBe(false);
  });
  it('requires tracking consent and preserves an active hike', () => {
    expect(
      demoReducer(initialState, { type: 'start', plan: { ...defaultPlan, tracking: false } }),
    ).toBe(initialState);
    const active = start();
    expect(
      demoReducer(active, { type: 'start', plan: { ...defaultPlan, name: 'Another hike' } }),
    ).toBe(active);
  });
  it('reset clears incidents, history, queue and hike', () => {
    const state = demoReducer(start(), { type: 'scenario', scenario: 'critical' });
    expect(demoReducer(state, { type: 'reset' })).toEqual(initialState);
  });
});
