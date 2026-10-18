import type { ReactNode } from 'react';
export const sources = [
  {
    id: 1,
    org: 'U.S. National Park Service',
    title: 'Hike Smart',
    year: '2024',
    url: 'https://www.nps.gov/articles/hiking-safety.htm',
    use: 'Trip plans, return times, lost or injured hikers, and communication limits.',
  },
  {
    id: 2,
    org: 'Mountain Rescue England and Wales',
    title: 'Getting help',
    year: 'n.d.',
    url: 'https://www.mountain.rescue.org.uk/getting-help/',
    use: 'Mountain phone coverage, battery limits, and the information rescuers need. UK guidance; not a Kazakhstan dispatch procedure.',
  },
  {
    id: 3,
    org: 'GPS.gov — U.S. government GPS information',
    title: 'GPS Accuracy',
    year: 'n.d.',
    url: 'https://www.gps.gov/gps-accuracy-0',
    use: 'Signal blockage and receiver/environment effects on positioning accuracy.',
  },
  {
    id: 4,
    org: 'Department of Emergency Situations, Almaty',
    title: 'Памятка туристу: как безопасно отправиться в горы (Mountain safety guidance)',
    year: 'n.d.',
    url: 'https://www.gov.kz/org/emer-almaty/press/news/details/1042441',
    use: 'Local advice to share a route, expected return and periodic check-ins; guidance also addresses no-signal situations.',
  },
  {
    id: 5,
    org: 'Almaty city administration / Tourism Department',
    title:
      'В Алматы разработали информационные материалы для горных маршрутов (Mountain route information)',
    year: 'n.d.',
    url: 'https://www.gov.kz/org/almaty/press/news/details/851583?lang=ru',
    use: 'Local mountain routes, the Small and Big Almaty gorges, and safety materials.',
  },
  {
    id: 6,
    org: 'Department of Emergency Situations, Almaty',
    title:
      'Алматы усиливает меры безопасности туристов в горах в летний сезон (Summer mountain safety measures)',
    year: '2026',
    url: 'https://www.gov.kz/org/emer-almaty/press/news/details/1212915',
    use: 'Official briefing reports 410 search-and-rescue operations and 608 people rescued in 2025. Not a per-hike accident rate.',
  },
  {
    id: 7,
    org: 'Google — Android Developers',
    title: 'Build an offline-first app',
    year: 'n.d. · living documentation',
    url: 'https://developer.android.com/topic/architecture/data-layer/offline-first',
    use: 'Local sources of truth, local writes and queued synchronization.',
  },
  {
    id: 8,
    org: 'Expo',
    title: 'SQLite — SDK 57',
    year: 'n.d. · versioned documentation',
    url: 'https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/',
    use: 'The existing prototype’s SQLite persistence and experimental web support.',
  },
];
export function Cite({ ids }: { ids: number[] }) {
  return (
    <span className="citations">
      {ids.map((id) => (
        <a key={id} href={`#ref-${id}`} aria-label={`Reference ${id}: ${sources[id - 1]?.org}`}>
          [{id}]
        </a>
      ))}
    </span>
  );
}
function Heading({
  n,
  title,
  question,
  children,
}: {
  n: string;
  title: string;
  question: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {n} / {question}
        </span>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}
export function EvidenceSection() {
  return (
    <section id="evidence" className="section research-section">
      <Heading n="03" title="Evidence." question="HOW DO WE KNOW?">
        Official safety guidance establishes the problem. It does not establish that this prototype
        reduces harm.
      </Heading>
      <div className="evidence-grid">
        <article className="evidence-card local-evidence">
          <span className="evidence-label">LOCAL · OFFICIAL BRIEFING</span>
          <strong className="evidence-number">410</strong>
          <h3>Search-and-rescue operations in 2025.</h3>
          <p>
            Almaty’s emergency department reports 608 people rescued in the same briefing.{' '}
            <Cite ids={[6]} />
          </p>
          <p className="small-note">
            Reported operational totals. They are not counts of individual hiking accidents, a
            per-hike risk estimate, or evidence of HIKE SAFE effectiveness.
          </p>
        </article>
        <article className="evidence-card">
          <span className="evidence-label">SAFETY GUIDANCE</span>
          <h3>A plan provides context.</h3>
          <p>
            NPS advises leaving a route and planned return with someone who stays behind; this
            information can help search teams. <Cite ids={[1]} />
          </p>
          <p className="design-inference">
            Design implication → capture the plan before departure.
          </p>
        </article>
        <article className="evidence-card">
          <span className="evidence-label">RESCUE ORGANIZATION</span>
          <h3>A phone is not a guarantee.</h3>
          <p>
            Mountain Rescue England and Wales warns that coverage and battery power can be
            unreliable in the mountains. <Cite ids={[2]} />
          </p>
          <p className="design-inference">
            Design implication → preserve local data and show delivery state.
          </p>
        </article>
        <article className="evidence-card">
          <span className="evidence-label">TECHNICAL EVIDENCE</span>
          <h3>A missing fix is uncertainty.</h3>
          <p>
            GPS.gov identifies signal blockage and receiver/environment conditions as accuracy
            factors. <Cite ids={[3]} />
          </p>
          <p className="design-inference">
            Our inference → missing samples cannot establish that someone stopped.
          </p>
        </article>
      </div>
      <p className="research-boundary">
        <b>Evidence boundary.</b> Local operational data are available, but this review did not
        establish route-level incident rates, measured coverage maps, or an effect on rescue
        outcomes. Broader guidance informs the design; local field validation remains necessary.
      </p>
    </section>
  );
}
export function AlmatySection() {
  return (
    <section id="almaty" className="section research-section local-section">
      <Heading n="04" title="Why Almaty?" question="WHY THIS PLACE?">
        A local mountain-safety problem, grounded in local guidance.
      </Heading>
      <div className="local-context">
        <div>
          <span className="evidence-label">VERIFIED LOCAL CONTEXT</span>
          <h3>City life meets mountain routes.</h3>
          <p>
            The city publishes route and safety materials for the Small and Big Almaty gorges. These
            establish a local hiking context, without assuming every route has the same hazards.{' '}
            <Cite ids={[5]} />
          </p>
          <p>
            Almaty emergency guidance asks hikers to share their route, expected return and check-in
            arrangements. It also explicitly considers the absence of phone service.{' '}
            <Cite ids={[4]} />
          </p>
          <span className="route-demo-label">
            MEDEU · KOK-ZHAILAU · FURMANOVKA — DEMO ROUTE EXAMPLES, NOT VERIFIED NAVIGATION
          </span>
        </div>
        <ol className="local-chain">
          <li>
            Almaty’s mountain access <Cite ids={[5]} />
          </li>
          <li>
            Terrain and preparation matter <Cite ids={[4, 6]} />
          </li>
          <li>
            Communication may be unavailable <Cite ids={[2, 4]} />
          </li>
          <li>
            Information may reach others later{' '}
            <small>Project inference; no local delay estimate claimed.</small>
          </li>
          <li>
            Test monitoring around a return plan{' '}
            <small>Design hypothesis, not a proven rescue intervention.</small>
          </li>
        </ol>
      </div>
      <p className="small-note">
        Mountain photograph: atmospheric imagery, not a documented photograph of these demo routes.
      </p>
    </section>
  );
}
export function ApproachesSection() {
  return (
    <section id="approaches" className="section research-section">
      <Heading n="05" title="Current approaches." question="WHAT IS THE GAP?">
        A comparison of functions, not a market-wide claim about every existing product.
      </Heading>
      <div className="comparison-row">
        <div>
          <small>MANUAL SOS</small>
          <h3>“I need help.”</h3>
          <p>
            A manual trigger depends on someone being able to activate it. Sending a phone-based
            request also depends on communication availability. <Cite ids={[2]} />
          </p>
        </div>
        <div>
          <small>BASIC LOCATION SHARING</small>
          <h3>“Here is a position.”</h3>
          <p>
            A coordinate alone does not include an agreed return time or explain whether a pause is
            expected.
          </p>
          <p className="small-note">
            Functional observation. Some products offer additional safety features.
          </p>
        </div>
        <div>
          <small className="safe-text">HIKE SAFE · PROPOSED COMBINATION</small>
          <h3>“Does this need attention?”</h3>
          <p>
            Plan + return time + movement evidence + GPS state + offline status + a single incident
            lifecycle.
          </p>
          <p className="small-note">
            The combination is our design contribution. No global novelty claim.
          </p>
        </div>
      </div>
    </section>
  );
}
export function EvidenceToDesign() {
  const rows = [
    {
      finding: (
        <>
          A trip plan can give search teams useful context. <Cite ids={[1, 4]} />
        </>
      ),
      decision: 'Record context before something goes wrong.',
      feature: 'Route, expected return and trusted-contact details.',
    },
    {
      finding: (
        <>
          Mountain phone connectivity can be unreliable. <Cite ids={[2, 4]} />
        </>
      ),
      decision: 'Keep local operation separate from delivery.',
      feature: 'SQLite storage + sync queue + explicit offline status.',
    },
    {
      finding: (
        <>
          Positioning can be degraded by blocked signals. <Cite ids={[3]} />
        </>
      ),
      decision: 'Treat absent observations as unknown.',
      feature: 'GPS SIGNAL UNKNOWN; no inactivity inferred from missing fixes.',
    },
    {
      finding: (
        <>
          Rescuers ask for location and incident details. <Cite ids={[2]} />
        </>
      ),
      decision: 'Keep observations and incident state together.',
      feature: 'One incident record per hike; manual SOS retained.',
    },
    {
      finding: (
        <>
          Offline architecture can read locally and queue later writes. <Cite ids={[7]} />
        </>
      ),
      decision: 'Record first; synchronize when available.',
      feature: 'Local repository and retry queue. A queued alert is not delivered.',
    },
  ];
  return (
    <section id="evidence-to-design" className="section research-section">
      <Heading n="07" title="From evidence to design." question="WHY THESE FEATURES?">
        Evidence informs the decision. It does not validate the risk thresholds.
      </Heading>
      <div className="design-table" role="table" aria-label="Research to design mapping">
        <div className="design-table-head" role="row">
          <span role="columnheader">RESEARCH FINDING</span>
          <span role="columnheader">DESIGN DECISION</span>
          <span role="columnheader">HIKE SAFE FEATURE</span>
        </div>
        {rows.map((row, i) => (
          <div role="row" key={i}>
            <p role="cell">{row.finding}</p>
            <p role="cell">{row.decision}</p>
            <p role="cell">{row.feature}</p>
          </div>
        ))}
      </div>
      <p className="research-boundary">
        <b>Design hypothesis:</b> combining time and movement evidence may surface a hike that needs
        attention when manual contact is absent. This is not a validated accident detector;
        sensitivity and false alarms have not been measured.
      </p>
    </section>
  );
}
export function LimitationsSection() {
  return (
    <section id="limitations" className="section research-section limitations-section">
      <Heading n="12" title="Current limitations." question="WHAT DOES IT NOT DO?">
        Demonstrating logic is different from demonstrating real-world safety.
      </Heading>
      <div className="limitations-grid">
        {[
          [
            'Prototype only',
            'No production emergency-response service and no official emergency-service integration. SOS here does not contact 112 or another dispatcher.',
          ],
          [
            'No guaranteed signal',
            'GPS can be unavailable. There is no satellite communication or guarantee of alert delivery.',
          ],
          [
            'Device behavior unvalidated',
            'Background tracking and battery consumption need controlled, real-device field testing.',
          ],
          [
            'Preliminary risk rules',
            'Thresholds are project assumptions. False positives, missed incidents and alert fatigue need evaluation.',
          ],
          [
            'Browser demo boundary',
            'The real Expo UI and logic run with simulated GPS, a schematic map and a disposable local database. Backend delivery is disabled.',
          ],
          [
            'Human responsibility remains',
            'The prototype complements preparation; it does not replace route planning, equipment, companions or responsible hiking.',
          ],
        ].map(([title, body]) => (
          <article key={title}>
            <span>↗</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ReferencesSection() {
  return (
    <section id="references" className="section research-section references-section">
      <Heading n="15" title="References." question="TRACE THE EVIDENCE">
        Sources reviewed 18 October 2026. “n.d.” means no publication date was verified.
        Translations and design inferences are identified in context.
      </Heading>
      <ol className="reference-list">
        {sources.map((source) => (
          <li id={`ref-${source.id}`} key={source.id}>
            <span>[{source.id}]</span>
            <div>
              <h3>{source.title}</h3>
              <p>
                {source.org} · {source.year}
              </p>
              <p className="reference-use">Used for: {source.use}</p>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.url} ↗
              </a>
            </div>
          </li>
        ))}
      </ol>
      <p className="research-boundary">
        This is a focused review of official guidance and technical documentation, not a systematic
        review or an evaluation of rescue effectiveness. Illustrative timelines, demo GPS points and
        prototype scores are not research statistics.
      </p>
      <a className="button ghost" href="#home">
        BACK TO THE BEGINNING ↑
      </a>
    </section>
  );
}
