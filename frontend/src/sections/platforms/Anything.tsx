import './platforms.css'

const ROWS: [string, string][] = [
  ['AI engineering insight platforms', 'Natural language to decisions'],
  ['Financial automation workflows', 'Documents to finished reports'],
  ['End-to-end ETL pipelines', 'Raw feeds to governed data'],
  ['Multi-model, multi-agent, multi-harness apps', 'Self-correcting, production grade'],
]

const SKILLS = ['ETL and ELT pipelines', 'Master data modelling', 'AI engineering', 'Data science', 'Time series forecasting', 'Machine learning']

export function Anything() {
  return (
    <section className="anything" aria-labelledby="anything-h">
      <div className="anything-inner">
        <h2 id="anything-h">If it can be specified, it can be <em>built.</em></h2>
        <ul>
          {ROWS.map(([a, b]) => (
            <li key={a}>
              {a}
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <ul className="any-skills" aria-label="Core craft">
          {SKILLS.map((k) => <li key={k}>{k}</li>)}
        </ul>
      </div>
    </section>
  )
}
