export type Scenario =
  'normal' | 'stationary' | 'gps-lost' | 'overdue' | 'critical' | 'sos' | 'returned';
export type Risk = 'SAFE' | 'MONITORING' | 'WARNING' | 'CRITICAL' | 'SOS' | 'RESOLVED';
export type Plan = {
  name: string;
  route: string;
  start: string;
  destination: string;
  departure: string;
  expectedReturn: string;
  contact: string;
  tracking: boolean;
};
export const defaultPlan: Plan = {
  name: 'Furmanovka Peak',
  route: 'Medeu → Furmanovka',
  start: 'Medeu',
  destination: 'Furmanovka Peak',
  departure: '08:12',
  expectedReturn: '16:00',
  contact: 'Demo contact',
  tracking: true,
};
export const scenarios: { id: Scenario; label: string; short: string }[] = [
  { id: 'normal', label: 'Normal route', short: 'NORMAL' },
  { id: 'stationary', label: 'Stationary 2h+', short: 'STATIONARY 2H+' },
  { id: 'gps-lost', label: 'GPS lost', short: 'GPS LOST' },
  { id: 'overdue', label: 'Overdue', short: 'OVERDUE' },
  { id: 'critical', label: 'Critical', short: 'CRITICAL' },
  { id: 'sos', label: 'SOS', short: 'SOS' },
  { id: 'returned', label: 'Returned safe', short: 'RETURNED SAFE' },
];
export const signals: Record<
  Scenario,
  {
    risk: Risk;
    score: number;
    motion: string;
    offset: number;
    network: boolean;
    gps: boolean;
    detail: string;
  }
> = {
  normal: {
    risk: 'SAFE',
    score: 18,
    motion: 'Movement confirmed',
    offset: -213,
    network: true,
    gps: true,
    detail: 'On route. Within the planned return window.',
  },
  stationary: {
    risk: 'WARNING',
    score: 64,
    motion: '2h 08m confirmed',
    offset: -8,
    network: true,
    gps: true,
    detail: 'Repeated GPS samples confirm little movement for over two hours.',
  },
  'gps-lost': {
    risk: 'MONITORING',
    score: 32,
    motion: 'Unknown — no fresh samples',
    offset: -1,
    network: false,
    gps: false,
    detail: 'GPS SIGNAL UNKNOWN. Last confirmed 28 min ago. No inactivity inferred.',
  },
  overdue: {
    risk: 'CRITICAL',
    score: 82,
    motion: 'Movement confirmed',
    offset: 42,
    network: true,
    gps: true,
    detail: '42 min overdue. No return confirmation. Demo escalation threshold reached.',
  },
  critical: {
    risk: 'CRITICAL',
    score: 87,
    motion: '2h 13m confirmed',
    offset: 63,
    network: false,
    gps: true,
    detail: 'Overdue and confirmed stationary. One active incident retained.',
  },
  sos: {
    risk: 'SOS',
    score: 100,
    motion: 'Manual SOS activated',
    offset: 64,
    network: true,
    gps: true,
    detail: 'Simulated SOS attached to this hike’s incident. No emergency service contacted.',
  },
  returned: {
    risk: 'RESOLVED',
    score: 0,
    motion: 'Hike completed',
    offset: 80,
    network: true,
    gps: true,
    detail: 'Safe return confirmed. Tracking stopped. Incident resolved.',
  },
};
export type DemoState = {
  active: boolean;
  completed: boolean;
  scenario: Scenario;
  plan: Plan;
  incident: null | { id: string; status: 'CRITICAL' | 'SOS' | 'RESOLVED' };
  events: { time: string; name: string }[];
  checkIns: number;
  queued: number;
};
export const initialState: DemoState = {
  active: false,
  completed: false,
  scenario: 'normal',
  plan: defaultPlan,
  incident: null,
  events: [],
  checkIns: 0,
  queued: 0,
};
export type Action =
  | { type: 'start'; plan: Plan }
  | { type: 'scenario'; scenario: Scenario }
  | { type: 'check-in' }
  | { type: 'reset' };
export function clockAt(time: string, offset: number) {
  const [h, m] = time.split(':').map(Number);
  const total = ((h ?? 16) * 60 + (m ?? 0) + offset + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
export function demoReducer(state: DemoState, action: Action): DemoState {
  if (action.type === 'reset') return initialState;
  if (action.type === 'start') {
    if (state.active || !action.plan.tracking) return state;
    return {
      ...initialState,
      active: true,
      plan: { ...action.plan },
      events: [
        { time: action.plan.departure, name: 'hike.started' },
        { time: action.plan.departure, name: 'gps.location' },
      ],
    };
  }
  if (!state.active) return state;
  const time = clockAt(state.plan.expectedReturn, signals[state.scenario].offset);
  if (action.type === 'check-in')
    return {
      ...state,
      checkIns: state.checkIns + 1,
      queued: signals[state.scenario].network ? 0 : state.queued + 1,
      events: [
        ...state.events,
        {
          time,
          name: signals[state.scenario].network ? 'hiker.check_in' : 'check_in.queued_locally',
        },
      ].slice(-12),
    };
  const scenario = action.scenario;
  if (scenario === state.scenario && scenario !== 'returned') return state;
  const next = signals[scenario];
  const nextTime = clockAt(state.plan.expectedReturn, next.offset);
  const events = [...state.events];
  const add = (name: string) => events.push({ time: nextTime, name });
  let incident = state.incident;
  let queued = state.queued;
  if (scenario === 'gps-lost') {
    add('gps.signal_unknown');
    add('network.offline');
  } else if (scenario === 'stationary') {
    add('gps.stationary_confirmed');
    add('risk.warning');
  } else if (scenario === 'normal') add('gps.movement_confirmed');
  else if (scenario === 'overdue') {
    add('hike.overdue');
    add('risk.critical');
  } else if (scenario === 'critical') {
    add('gps.stationary_confirmed');
    add('risk.critical');
  } else if (scenario === 'sos') add('sos.activated_simulation');
  if ((next.risk === 'CRITICAL' || next.risk === 'SOS') && incident?.status !== 'RESOLVED') {
    if (!incident) {
      incident = { id: 'INC-1042', status: next.risk };
      add('incident.created_simulation');
    } else if (next.risk === 'SOS' && incident.status !== 'SOS') {
      incident = { ...incident, status: 'SOS' };
      add('incident.updated_sos');
    }
  }
  if (scenario === 'returned') {
    add('hike.returned_safe');
    if (incident) {
      incident = { ...incident, status: 'RESOLVED' };
      add('incident.resolved');
    }
  }
  if (!next.network && next.gps) {
    queued += 4;
    add('gps.samples_queued_locally');
  }
  if (next.network && queued > 0) {
    add(`sync.completed_${queued}_events`);
    queued = 0;
  }
  return {
    ...state,
    scenario,
    active: scenario !== 'returned',
    completed: scenario === 'returned',
    incident,
    events: events.slice(-12),
    queued,
  };
}
