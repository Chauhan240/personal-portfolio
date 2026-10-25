import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { qa } from './qa'
import type { QA } from './qa'
import './ask.css'
import './askwidget.css'

const STEPS = ['Understand', 'Retrieve', 'Verify', 'Compose']
const STEP_MS = 380
const GREETING = "Hi, I'm Manish's assistant. Pick a question and I'll give you the short version."

const JOBS = [
  { co: 'The Coca-Cola Company', role: 'Consultant, Digital Insights & Analytics', when: 'Sep 2024 to now', line: 'Building and scaling AI platforms that teams around the world use to decide faster.' },
  { co: 'Deloitte', role: 'Data and AI Engineer', when: 'Mar 2022 to Sep 2024', line: "Owned Deloitte Australia's flagship AI platform end to end, from architecture to its AWS to GCP migration and rollout." },
  { co: 'Capgemini', role: 'Business Analyst, Barclays', when: 'Jun 2020 to Mar 2022', line: 'ML models for financial KPIs and an end-to-end regulatory reporting solution.' },
  { co: 'Dell', role: 'Technical Support Engineer, Honeywell', when: 'Jul 2019 to Feb 2020', line: 'Supported about 6,000 global users across incident, request and change management.' },
]

interface Msg {
  id: number
  role: 'user' | 'ai'
  text: string
  shown: number
  step: number
  done: boolean
  tags: string[]
  timeline?: boolean
  took?: string
}

function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

function Md({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((block, i) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('- '))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>
        }
        return <p key={i}>{inline(block)}</p>
      })}
    </>
  )
}

/**
 * Floating assistant: a launcher that appears once the hero has scrolled away, and a chat panel with
 * prepopulated questions. Any link to #ask opens it.
 */
export function AskWidget() {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: 'ai', text: GREETING, shown: GREETING.length, step: 4, done: true, tags: [] },
  ])
  const [asked, setAsked] = useState<Set<string>>(new Set())
  const scroller = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const timers = useRef<number[]>([])
  const teased = useRef(false)

  const patch = useCallback((id: number, p: Partial<Msg>) => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, ...p } : x))), [])

  const clearTimers = () => {
    timers.current.forEach((t) => {
      window.clearTimeout(t)
      window.clearInterval(t)
    })
    timers.current = []
  }

  const ask = useCallback(
    (entry: QA) => {
      clearTimers()
      const uid = nextId.current++
      const aid = nextId.current++
      const t0 = performance.now()
      setAsked((s) => new Set(s).add(entry.id))
      setMsgs((m) => [
        ...m.map((x) => (x.role === 'ai' && !x.done ? { ...x, shown: x.text.length, step: 4, done: true } : x)),
        { id: uid, role: 'user', text: entry.q, shown: entry.q.length, step: 4, done: true, tags: [] },
        { id: aid, role: 'ai', text: entry.a, shown: 0, step: 0, done: false, tags: entry.tags, timeline: entry.timeline },
      ])
      STEPS.forEach((_, i) => {
        timers.current.push(window.setTimeout(() => patch(aid, { step: i + 1 }), STEP_MS * (i + 1)))
      })
      timers.current.push(
        window.setTimeout(() => {
          let n = 0
          const iv = window.setInterval(() => {
            n += 3
            if (n >= entry.a.length) {
              window.clearInterval(iv)
              patch(aid, { shown: entry.a.length, done: true, took: `${((performance.now() - t0) / 1000).toFixed(1)}s` })
            } else {
              patch(aid, { shown: n })
            }
          }, 16)
          timers.current.push(iv)
        }, STEP_MS * (STEPS.length + 1)),
      )
    },
    [patch],
  )

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, open])

  useEffect(() => () => clearTimers(), [])

  // The launcher appears just after the hero. The first time, a short invitation floats beside it.
  useEffect(() => {
    const check = () => {
      const past = window.scrollY > window.innerHeight * 0.7
      setArmed(past)
      if (past && !teased.current) {
        teased.current = true
        setTeaser(true)
        timers.current.push(window.setTimeout(() => setTeaser(false), 7000))
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  // Any in-page link to #ask (hero button, nav) opens the panel instead of scrolling.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href="#ask"]')
      if (!a) return
      e.preventDefault()
      e.stopPropagation()
      setOpen(true)
      setTeaser(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey)
    if (location.hash === '#ask') setOpen(true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const last = msgs[msgs.length - 1]
  const show = armed || open

  return (
    <div className={`aw${show ? ' on' : ''}${open ? ' open' : ''}`}>
      {teaser && !open && (
        <button type="button" className="aw-teaser" onClick={() => { setOpen(true); setTeaser(false) }}>
          <b>Curious how I built these?</b>
          <span>Ask me. Short answers, no fluff.</span>
        </button>
      )}

      <section className="aw-panel ask-window" role="dialog" aria-label="Ask Manish" aria-hidden={!open} data-lenis-prevent>
        <div className="ask-bar">
          <span className="ask-dot" />
          <span className="ask-title">Ask Manish</span>
          <span style={{ marginLeft: "auto" }} />
          <button type="button" className="aw-x" aria-label="Close chat" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="ask-scroll" ref={scroller} aria-live="polite">
          {msgs.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="msg user"><p>{m.text}</p></div>
            ) : (
              <div key={m.id} className="msg ai">
                <span className="avatar" aria-hidden="true">M</span>
                <div className="body">
                  {m.id !== 0 && (
                    <div className="trace" aria-hidden="true">
                      {STEPS.map((s, i) => (
                        <Fragment key={s}>
                          {i > 0 && <span className={`wire ${m.step > i ? 'on' : ''}`} />}
                          <span className={`node ${m.step > i ? 'on' : ''} ${m.step === i && !m.done ? 'live' : ''}`}>{s}</span>
                        </Fragment>
                      ))}
                      {m.took && <span className="took">{m.took}</span>}
                    </div>
                  )}
                  {(m.step >= 4 || m.id === 0) && (
                    <div className="text">
                      <Md text={m.text.slice(0, m.shown)} />
                      {!m.done && <span className="caret" />}
                    </div>
                  )}
                  {m.done && m.timeline && (
                    <ol className="jobs">
                      {JOBS.map((j) => (
                        <li key={j.co}>
                          <span className="jw">{j.when}</span>
                          <b>{j.co}</b>
                          <em>{j.role}</em>
                          <p>{j.line}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                  {m.done && m.tags.length > 0 && (
                    <div className="sources">{m.tags.map((s) => <b key={s}>{s}</b>)}</div>
                  )}
                  {m.done && m.id === last.id && m.id !== 0 && (
                    <div className="follow">
                      <a className="cta" href="mailto:manishchauhan.work95@gmail.com">Want the full story? Let's talk <span aria-hidden="true">▸</span></a>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="aw-chips" aria-label="Suggested questions">
          {qa.map((x) => (
            <button key={x.id} type="button" className={`chip ${asked.has(x.id) ? 'asked' : ''}`} onClick={() => ask(x)}>
              {x.q}
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="aw-fab" aria-label={open ? 'Close chat' : 'Ask me anything'} aria-expanded={open} onClick={() => { setOpen((o) => !o); setTeaser(false) }}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="aw-ic-chat"><path d="M4 5h16v11H9l-5 4z" /></svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="aw-ic-x"><path d="M6 6l12 12M18 6 6 18" /></svg>
        <span className="aw-fab-l">Ask me anything</span>
      </button>
    </div>
  )
}
