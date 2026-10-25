import type { PlatformInfo } from './data'
import { visuals } from './mockups'
import './platforms.css'
import './mock.css'

export function Platform({ p, index }: { p: PlatformInfo; index: number }) {
  const { Visual } = visuals[p.id]

  return (
    <section className={`pf pf-${p.id}`} aria-labelledby={`pf-${p.id}`}>
      <div className="pf-stat" aria-hidden="true">
        <span className="pf-stat-k">{String(index + 1).padStart(2, '0')} · {p.title}</span>
        <div className={`pf-stat-v ${p.stat.to === undefined ? 'txt' : ''}`}>
          {p.stat.to !== undefined && <span className="pf-count">{p.stat.pre}0</span>}
          <em>{p.stat.post}</em>
        </div>
        <p>{p.stat.label}</p>
      </div>
      <div className="pf-ghost" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="pf-inner">
        <div className="pf-copy">
          <p className="pf-kicker">
            <span>{String(index + 1).padStart(2, '0')}</span> {p.tag}
          </p>
          <h3 id={`pf-${p.id}`} className="pf-title">{p.title}</h3>
          <p className="pf-summary">{p.summary}</p>
          <dl className="pf-metrics">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.value}</dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>
          <ul className="pf-stack" aria-label="Tech stack">
            {p.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div className="pf-visual">
          <Visual />
        </div>
      </div>
    </section>
  )
}
