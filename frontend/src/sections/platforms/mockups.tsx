import gsap from 'gsap'
import type { ReactNode } from 'react'
import type { PlatformInfo } from './data'

/**
 * Product mockups: each platform is shown as a believable app window that plays a scripted demo,
 * driven by scroll. All figures inside the windows are illustrative sample data.
 */
export type Build = (root: Element, st: ScrollTrigger.Vars) => gsap.core.Timeline

const q = (root: Element, s: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(s))
const one = (root: Element, s: string) => root.querySelector(s) as HTMLElement
const mk = (st: ScrollTrigger.Vars) => gsap.timeline({ scrollTrigger: st, defaults: { ease: 'power2.out' } })

/** Centre of an element as a percentage of the window, from untransformed layout offsets. */
function at(win: HTMLElement, el: HTMLElement, dx = 0.5, dy = 0.5) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== win) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { left: `${((x + el.offsetWidth * dx) / win.offsetWidth) * 100}%`, top: `${((y + el.offsetHeight * dy) / win.offsetHeight) * 100}%` }
}

function type(tl: gsap.core.Timeline, el: Element, text: string, start: number, dur: number) {
  const o = { n: 0 }
  tl.to(o, { n: text.length, duration: dur, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)) } }, start)
}

function count(tl: gsap.core.Timeline, el: Element, to: number, fmt: (n: number) => string, start: number, dur: number) {
  const o = { n: 0 }
  tl.to(o, { n: to, duration: dur, ease: 'power1.out', onUpdate: () => { el.textContent = fmt(o.n) } }, start)
}

function click(tl: gsap.core.Timeline, win: HTMLElement, cur: HTMLElement, target: HTMLElement, t: number, dx = 0.5, dy = 0.5) {
  const p = at(win, target, dx, dy)
  tl.to(cur, { left: p.left, top: p.top, duration: 0.7, ease: 'power3.inOut' }, t)
  tl.to(cur, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, t + 0.7)
  tl.fromTo(target, { filter: 'brightness(1)' }, { filter: 'brightness(0.94)', duration: 0.1, yoyo: true, repeat: 1 }, t + 0.7)
}

interface Sat { k: string; v: string; d: string }

function Cursor() {
  return <svg viewBox="0 0 20 24" aria-hidden="true"><path d="M2 2 L2 18 L6.5 14 L9.5 21 L12.5 19.6 L9.6 12.8 L15.5 12.4 Z" /></svg>
}

/** A product artifact floating on the page: one main card, two satellite stat cards and two live-user bubbles. */
function Win({ title, sats, children }: { title: string; sats: [Sat, Sat]; children: ReactNode }) {
  return (
    <div className="win-wrap">
      <div className="win-tilt">
        <div className="win">
          <div className="win-bar">
            <span className="win-url">{title}</span>
            <span className="win-note">Illustrative data</span>
          </div>
          <div className="win-body">{children}</div>
          <svg className="cur" viewBox="0 0 20 24" aria-hidden="true"><path d="M2 2 L2 18 L6.5 14 L9.5 21 L12.5 19.6 L9.6 12.8 L15.5 12.4 Z" /></svg>
        </div>
        {sats.map((s, i) => (
          <div key={i} className={`sat sat${i + 1}`}>
            <div className="sat-in">
              <span>{s.k}</span>
              <b>{s.v}</b>
              <em>{s.d}</em>
              <svg viewBox="0 0 60 20" preserveAspectRatio="none"><path className="spk" pathLength={1} d="M2 16 C 12 14, 16 6, 26 9 S 44 12, 58 3" /></svg>
            </div>
          </div>
        ))}
        <div className="av a1"><div className="av-in"><i>BU</i><Cursor /></div></div>
        <div className="av a2"><div className="av-in"><i>EN</i><Cursor /></div></div>
      </div>
    </div>
  )
}

/** Satellite cards and live-user bubbles drift into the scene around the main artifact. */
function floaters(tl: gsap.core.Timeline, root: Element, t1: number, t2: number) {
  const sats = q(root, '.sat')
  tl.from(q(root, '.av'), { opacity: 0, scale: 0.5, transformOrigin: '0% 0%', stagger: 0.25, duration: 0.6, ease: 'back.out(2)' }, t1 - 0.4)
  sats.forEach((s, i) => {
    const t = i === 0 ? t1 : t2
    tl.from(s, { opacity: 0, y: 36, scale: 0.94, duration: 0.8 }, t)
    tl.fromTo(s.querySelector('.spk'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, t + 0.3)
  })
}

/* ============ 1. Insight engine ============ */
const QUESTION = 'Why did sparkling dip in the Northeast, and what should we do next?'
const NEXT = 'Northeast buy-rate fell as competitor promo depth rose. Shift promo mix to multipacks in the Northeast first.'
const REGIONS: [string, string, boolean][] = [['Northeast', '-8.4%', true], ['Southeast', '+2.1%', false], ['Midwest', '-1.2%', false], ['West', '+3.6%', false], ['Southwest', '+0.9%', false]]
const BARS = [58, 62, 66, 64, 52, 44]
const MAP: { x: number; y: number; ne: boolean }[] = []
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 16; x++) {
    const nx = (x - 7.5) / 8
    const ny = (y - 4) / 4.6
    if (nx * nx + ny * ny * 1.15 < 1 && !(y > 6 && x < 4)) MAP.push({ x, y, ne: x >= 11 && y <= 3 })
  }
}

function InsightMock() {
  return (
    <Win title="Insight assistant" sats={[{ k: "Time to answer", v: "42s", d: "was days" }, { k: "Sources joined", v: "5", d: "sales, panel, market" }]}>
      <div className="m-side"><b /><i /><i /><i /><i /></div>
      <div className="m-main">
        <div className="m-ask">
          <span className="m-q" />
          <span className="m-caret" />
          <b className="m-go">Ask</b>
        </div>
        <div className="m-trace">
          {['Plan', 'Query 5 sources', 'Verify', 'Compose'].map((s) => <span key={s} className="m-node">{s}</span>)}
          <em className="m-retry">retry: fixed grain join</em>
          <span className="m-meta">answered in <b className="m-time">0s</b></span>
        </div>
        <div className="m-grid3">
          <div className="m-card">
            <h4>Volume change by region</h4>
            {REGIONS.map(([r, v, hot]) => (
              <div key={r} className={`m-trow ${hot ? 'hot' : ''}`}><span>{r}</span><b>{v}</b></div>
            ))}
          </div>
          <div className="m-card">
            <h4>Monthly volume vs competitor promo</h4>
            <svg viewBox="0 0 100 56" preserveAspectRatio="none">
              {BARS.map((h, i) => <rect key={i} className="m-bar" x={6 + i * 15} y={52 - h * 0.8} width="9" height={h * 0.8} rx="1.5" />)}
              <path className="m-line" pathLength={1} d="M10 40 C 24 36, 34 30, 46 28 S 70 18, 96 8" fill="none" />
            </svg>
          </div>
          <div className="m-card">
            <h4>Where it happened</h4>
            <svg viewBox="0 0 32 18">
              {MAP.map((d, i) => <circle key={i} className={`m-dot ${d.ne ? 'ne' : ''}`} cx={1 + d.x * 2} cy={1 + d.y * 2} r="0.65" />)}
            </svg>
          </div>
        </div>
        <div className="m-card m-insight">
          <h4>What next</h4>
          <p className="m-next" />
        </div>
      </div>
    </Win>
  )
}

const buildInsight: Build = (root, st) => {
  const win = one(root, '.win')
  const cur = one(win, '.cur')
  const tl = mk(st)
  tl.from(win.querySelectorAll('.m-side > *'), { opacity: 0, x: -8, stagger: 0.08, duration: 0.4 }, 0)
  tl.from(one(win, '.m-ask'), { opacity: 0, y: 12, duration: 0.5 }, 0.1)
  tl.fromTo(cur, { opacity: 0, left: '88%', top: '92%' }, { opacity: 1, duration: 0.3 }, 0.2)
  type(tl, one(win, '.m-q'), QUESTION, 0.4, 1.8)
  tl.to(one(win, '.m-caret'), { opacity: 0, duration: 0.1 }, 2.3)
  click(tl, win, cur, one(win, '.m-go'), 1.9)
  tl.to(one(win, '.m-go'), { backgroundColor: '#17191c', duration: 0.2 }, 2.6)
  tl.from(one(win, '.m-trace'), { opacity: 0, y: 8, duration: 0.4 }, 2.6)
  q(win, '.m-node').forEach((n, i) => {
    tl.to(n, { backgroundColor: '#17191c', color: '#ffffff', borderColor: '#17191c', duration: 0.25 }, 2.8 + i * 0.6)
  })
  tl.fromTo(one(win, '.m-retry'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 4.0)
  tl.to(q(win, '.m-node')[2], { backgroundColor: '#fbe1d1', borderColor: '#fbe1d1', color: '#5d2a1a', duration: 0.2, yoyo: true, repeat: 1 }, 4.0)
  count(tl, one(win, '.m-time'), 42, (n) => `${Math.round(n)}s`, 2.8, 2.6)
  tl.from(q(win, '.m-card'), { opacity: 0, y: 18, stagger: 0.15, duration: 0.5 }, 5.0)
  tl.from(q(win, '.m-trow'), { opacity: 0, x: -10, stagger: 0.1, duration: 0.35 }, 5.3)
  tl.from(q(win, '.m-bar'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.07, duration: 0.5 }, 5.4)
  tl.fromTo(one(win, '.m-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 5.8)
  tl.from(q(win, '.m-dot'), { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.008, from: 'center' }, duration: 0.3 }, 5.4)
  tl.to(q(win, '.m-dot.ne'), { fill: '#5d2a1a', duration: 0.4, stagger: 0.03 }, 6.4)
  click(tl, win, cur, one(win, '.m-dot.ne'), 6.3)
  type(tl, one(win, '.m-next'), NEXT, 6.9, 1.6)
  tl.to(cur, { opacity: 0, duration: 0.3 }, 8.4)
  floaters(tl, root, 2.4, 5.6)
  return tl
}

/* ============ 2. Control tower ============ */
const BOTTLERS = ['Bottler A', 'Bottler B', 'Bottler C', 'Bottler D', 'Bottler E', 'Bottler F']
const PACKS = ['FBO', 'CBO', 'NPL']
const COVER = [[9.4, 7.1, 12.0], [1.9, 6.3, 8.8], [8.2, 3.2, 9.1], [10.5, 8.0, 2.4], [6.7, 9.9, 4.1], [7.8, 5.2, 10.2]]
const tone = (v: number) => (v < 3.5 ? '#f0bfa2' : v < 6 ? '#fbe1d1' : '#f2f2f3')
const ALERTS: [string, string, string, number, number][] = [
  ['Stock-out risk', 'Bottler B · FBO · 1.9 days cover', 'hot', 1, 0],
  ['Low cover', 'Bottler C · CBO · 3.2 days cover', 'hot', 2, 1],
  ['Launch watch', 'Bottler D · new product · 2.4 days', 'warm', 3, 2],
]
const METERS: [string, number][] = [['WAI', 0.74], ['NAI', 0.52], ['Days cover', 0.31]]

function TowerMock() {
  return (
    <Win title="Control tower" sats={[{ k: "Open alerts", v: "3", d: "need action today" }, { k: "Next best action", v: "Line 3", d: "recommended" }]}>
      <div className="m-main full">
        <div className="m-head">
          <b>Supply Chain Control Tower</b>
          <span className="m-chip">Daily refresh · 06:00</span>
        </div>
        <div className="m-cols">
          <div className="m-card m-heat">
            <h4>Days cover · bottler × pack</h4>
            <div className="heat">
              <span />
              {PACKS.map((p) => <em key={p}>{p}</em>)}
              {BOTTLERS.map((b, r) => (
                <div key={b} className="heat-row">
                  <span>{b}</span>
                  {COVER[r].map((v, c) => <i key={c} className="cell" data-c={tone(v)} data-r={r} data-k={c}>{v.toFixed(1)}</i>)}
                </div>
              ))}
            </div>
          </div>
          <div className="m-col">
            <div className="m-card m-fc">
              <h4>SKU forecast</h4>
              <svg viewBox="0 0 100 48" preserveAspectRatio="none">
                <path className="m-band" d="M58 28 C 70 22, 84 14, 98 8 L 98 26 C 84 30, 70 34, 58 28 Z" />
                <path className="m-line ink" pathLength={1} d="M2 38 C 14 34, 22 36, 32 28 S 48 24, 58 28" fill="none" />
                <path className="m-line blue" pathLength={1} d="M58 28 C 70 22, 84 14, 98 8" fill="none" />
              </svg>
            </div>
            <div className="m-alerts">
              {ALERTS.map(([t, d, k]) => (
                <div key={t} className={`m-alert ${k}`}><b>{t}</b><span>{d}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="m-card m-reco">
          <div>
            <h4>Recommended</h4>
            <p>Prioritise the 330ml CBO SKU on Line 3 to close the demand and production gap.</p>
          </div>
          <div className="m-meters">
            {METERS.map(([n, v]) => (
              <div key={n}><span>{n}</span><i><b style={{ width: `${v * 100}%` }} /></i></div>
            ))}
          </div>
        </div>
      </div>
    </Win>
  )
}

const buildTower: Build = (root, st) => {
  const win = one(root, '.win')
  const cur = one(win, '.cur')
  const cells = q(win, '.cell')
  const tl = mk(st)
  tl.from(one(win, '.m-head'), { opacity: 0, y: -10, duration: 0.4 }, 0)
  tl.from(q(win, '.m-card'), { opacity: 0, y: 16, stagger: 0.12, duration: 0.5 }, 0.2)
  tl.from(cells, { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.03, from: 'random' }, duration: 0.3 }, 0.6)
  cells.forEach((c, i) => tl.fromTo(c, { backgroundColor: '#e9e9eb' }, { backgroundColor: c.dataset.c, duration: 0.3 }, 1.4 + i * 0.03))
  tl.fromTo(one(win, '.m-line.ink'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'none' }, 1.6)
  tl.from(one(win, '.m-band'), { opacity: 0, duration: 0.6 }, 2.8)
  tl.fromTo(one(win, '.m-line.blue'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 2.8)
  tl.fromTo(cur, { opacity: 0, left: '90%', top: '90%' }, { opacity: 1, duration: 0.3 }, 3.2)
  const alerts = q(win, '.m-alert')
  alerts.forEach((a, i) => {
    const [, , , r, c] = ALERTS[i]
    const cell = cells[r * 3 + c]
    tl.from(a, { opacity: 0, x: 30, duration: 0.5 }, 3.4 + i * 0.7)
    tl.fromTo(cell, { boxShadow: '0 0 0 0 rgba(23, 25, 28, 0)' }, { boxShadow: '0 0 0 3px rgba(23, 25, 28, 1)', duration: 0.25, yoyo: true, repeat: 1 }, 3.5 + i * 0.7)
  })
  click(tl, win, cur, alerts[0], 5.5)
  tl.to(cells[3], { boxShadow: '0 0 0 3px #17191c', duration: 0.3 }, 6.2)
  tl.from(one(win, '.m-reco p'), { opacity: 0, y: 8, duration: 0.5 }, 6.2)
  tl.from(q(win, '.m-meters b'), { width: 0, stagger: 0.15, duration: 0.8 }, 6.5)
  tl.to(cur, { opacity: 0, duration: 0.3 }, 7.8)
  floaters(tl, root, 1.6, 4.4)
  return tl
}

/* ============ 3. Autonomous financial analyst ============ */
const FIELDS: [string, string, string][] = [['Revenue', '4,812', '99%'], ['Net income', '612', '97%'], ['Total assets', '9,340', '98%'], ['Net debt', '1,205', '94%'], ['Cash', '842', '96%']]
const REPORT: [string, string, boolean][] = [['Revenue', '4,812', false], ['EBITDA', '1,010', true], ['EBITDA margin', '21.0%', true], ['Net debt / EBITDA', '1.2x', true], ['Cash', '842', false]]

function AnalystMock() {
  return (
    <Win title="Financial analyst" sats={[{ k: "Auto-captured", v: "80%", d: "analysts finish the rest" }, { k: "Turnaround", v: "Hours", d: "was months" }]}>
      <div className="m-main full">
        <div className="m-head">
          <b>Autonomous Financial Analyst</b>
          <span className="m-prog"><i /></span>
          <span className="m-chip"><b className="m-docs">0</b> / 3 documents</span>
        </div>
        <div className="m-cols3">
          <div className="m-card m-src">
            <div className="m-tabs"><span className="on">PDF</span><span>XBRL</span><span>API</span></div>
            <div className="m-page">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <i key={i} className={`ln ${[1, 3, 5].includes(i) ? 'hl' : ''}`} style={{ width: `${60 + ((i * 17) % 38)}%` }} />)}
              <u className="scan" />
            </div>
          </div>
          <div className="m-card">
            <h4>Extracted</h4>
            {FIELDS.map(([k, v, c]) => (
              <div key={k} className="m-frow"><span>{k}</span><b>{v}</b><em>{c}</em></div>
            ))}
          </div>
          <div className="m-card">
            <h4>Standard report</h4>
            {REPORT.map(([k, v, calc]) => (
              <div key={k} className={`m-rrow ${calc ? 'calc' : ''}`}><span>{k}{calc && <sup>ƒ</sup>}</span><b>{v}</b></div>
            ))}
          </div>
        </div>
        <div className="m-foot">
          <div className="m-ringbox">
            <svg viewBox="0 0 36 36"><circle className="rbg" cx="18" cy="18" r="15" /><circle className="rfg" pathLength={1} cx="18" cy="18" r="15" /></svg>
            <b>80%</b>
          </div>
          <div className="m-bars">
            <div><span>Manual</span><i><b className="bar-old" /></i><em>months</em></div>
            <div><span>Autonomous</span><i><b className="bar-new" /></i><em>hours</em></div>
          </div>
        </div>
      </div>
    </Win>
  )
}

const buildAnalyst: Build = (root, st) => {
  const win = one(root, '.win')
  const tl = mk(st)
  tl.from(one(win, '.m-head'), { opacity: 0, y: -10, duration: 0.4 }, 0)
  tl.from(q(win, '.m-card'), { opacity: 0, y: 18, stagger: 0.15, duration: 0.5 }, 0.2)
  tl.from(q(win, '.ln'), { scaleX: 0, transformOrigin: '0% 50%', stagger: 0.05, duration: 0.3 }, 0.6)
  tl.fromTo(one(win, '.m-prog i'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 6, ease: 'none' }, 1)
  count(tl, one(win, '.m-docs'), 3, (n) => `${Math.floor(n)}`, 1.2, 5.5)
  tl.fromTo(one(win, '.scan'), { top: '0%', opacity: 1 }, { top: '96%', duration: 4.2, ease: 'none' }, 1)
  tl.to(one(win, '.scan'), { opacity: 0, duration: 0.2 }, 5.3)
  const hl = q(win, '.ln.hl')
  const frows = q(win, '.m-frow')
  frows.forEach((r, i) => {
    const t = 1.4 + i * 0.7
    tl.from(r, { opacity: 0, x: -10, duration: 0.4 }, t)
    tl.from(r.querySelector('em'), { scale: 0, duration: 0.3, ease: 'back.out(3)' }, t + 0.25)
    if (hl[i % 3]) tl.fromTo(hl[i % 3], { backgroundColor: '#e9e9eb' }, { backgroundColor: '#fbe1d1', duration: 0.3 }, t)
  })
  const rrows = q(win, '.m-rrow')
  rrows.forEach((r, i) => {
    const t = 3.4 + i * 0.6
    tl.from(r, { opacity: 0, x: 10, duration: 0.4 }, t)
    tl.fromTo(r, { backgroundColor: 'rgba(242, 242, 243, 0.9)' }, { backgroundColor: 'rgba(242, 242, 243, 0)', duration: 0.8 }, t + 0.2)
  })
  tl.from(one(win, '.m-foot'), { opacity: 0, y: 12, duration: 0.5 }, 6.2)
  tl.fromTo(one(win, '.rfg'), { strokeDashoffset: 1 }, { strokeDashoffset: 0.2, duration: 1, ease: 'power2.out' }, 6.4)
  tl.from(one(win, '.bar-old'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8 }, 6.4)
  tl.from(one(win, '.bar-new'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.5 }, 7.3)
  floaters(tl, root, 1.4, 4.6)
  return tl
}

/* ============ 4. Unified platform ============ */
const TABS = ['Q&A', 'Calculate', 'Scrum', 'RAG', 'Admin']
const BOARD: [string, string[]][] = [['Backlog', ['Define scope', 'Data access']], ['Doing', ['Build plugin API']], ['Done', ['Prompt controls', 'SSO']]]

function UnifiedMock() {
  return (
    <Win title="Unified workspace" sats={[{ k: "Team led", v: "7", d: "consultants, engineers, analysts" }, { k: "Cloud", v: "GCP", d: "migrated from AWS" }]}>
      <div className="m-main full">
        <div className="m-head">
          <b>Unified AI Platform</b>
          <span className="m-env"><span className="aws">AWS</span><span className="gcp">GCP</span></span>
        </div>
        <div className="m-tabs big">
          {TABS.map((t) => <span key={t} className="m-tab">{t}</span>)}
        </div>
        <div className="m-stage">
          <div className="m-pane p0">
            <p className="bub user">Summarise this quarter's variance for my team.</p>
            <p className="bub ai">Variance is driven by two lines. Controlled prompt applied, answer grounded in the team workbook.</p>
          </div>
          <div className="m-pane p1">
            <div className="m-calc"><span>Utilisation</span><b>86%</b></div>
            <div className="m-calc"><span>Forecast hours</span><b>1,240</b></div>
            <div className="m-calc"><span>Variance</span><b>-3.4%</b></div>
          </div>
          <div className="m-pane p2">
            {BOARD.map(([c, cards]) => (
              <div key={c} className="m-colm"><h4>{c}</h4>{cards.map((x) => <div key={x} className="m-kard">{x}</div>)}</div>
            ))}
          </div>
          <div className="m-pane p3">
            <p className="bub ai">Grounded answer with citations <sup>1</sup> <sup>2</sup></p>
            {['Confluence · onboarding guide', 'JIRA · project notes', 'Bitbucket · README'].map((s, i) => <div key={s} className="m-cite"><b>{i + 1}</b>{s}</div>)}
          </div>
          <div className="m-pane p4">
            <div className="m-meters wide">
              {[['Team A tokens', 0.72], ['Team B tokens', 0.45], ['Team C tokens', 0.58]].map(([n, v]) => (
                <div key={n as string}><span>{n}</span><i><b style={{ width: `${(v as number) * 100}%` }} /></i></div>
              ))}
            </div>
            <div className="m-fb"><span>Feedback helpful</span><b>92%</b></div>
          </div>
        </div>
        <div className="m-ship">
          <span>AWS</span><i /><span>Docker</span><i /><span>GCP</span>
          <u className="dot" />
        </div>
      </div>
    </Win>
  )
}

const buildUnified: Build = (root, st) => {
  const win = one(root, '.win')
  const cur = one(win, '.cur')
  const tabs = q(win, '.m-tab')
  const panes = q(win, '.m-pane')
  const tl = mk(st)
  tl.from(one(win, '.m-head'), { opacity: 0, y: -10, duration: 0.4 }, 0)
  tl.from(tabs, { opacity: 0, y: 8, stagger: 0.08, duration: 0.3 }, 0.2)
  tl.from(one(win, '.m-ship'), { opacity: 0, duration: 0.5 }, 0.4)
  tl.fromTo(cur, { opacity: 0, left: '92%', top: '92%' }, { opacity: 1, duration: 0.3 }, 0.4)
  panes.forEach((p, i) => {
    const t = 0.8 + i * 1.6
    if (i > 0) tl.to(panes[i - 1], { opacity: 0, y: -8, duration: 0.25 }, t + 0.6)
    click(tl, win, cur, tabs[i], t, 0.5, 0.5)
    tl.to(tabs[i], { backgroundColor: '#17191c', color: '#ffffff', borderColor: '#17191c', duration: 0.2 }, t + 0.7)
    if (i > 0) tl.to(tabs[i - 1], { backgroundColor: 'rgba(246,243,241,0)', color: '#17191c', borderColor: '#ececec', duration: 0.2 }, t + 0.7)
    tl.fromTo(p, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, t + 0.85)
    tl.from(Array.from(p.children), { opacity: 0, y: 12, stagger: 0.12, duration: 0.35 }, t + 1.0)
  })
  tl.from(q(win, '.p4 .m-meters b'), { width: 0, stagger: 0.12, duration: 0.7 }, 7.0)
  // Cloud cutover: the shipping dot runs AWS > Docker > GCP and the badge flips.
  tl.fromTo(one(win, '.dot'), { left: '4%' }, { left: '92%', duration: 1.6, ease: 'power1.inOut' }, 7.4)
  tl.to(one(win, '.aws'), { opacity: 0, y: -6, duration: 0.3 }, 8.6)
  tl.fromTo(one(win, '.gcp'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, 8.7)
  tl.to(cur, { opacity: 0, duration: 0.3 }, 8.6)
  floaters(tl, root, 1.8, 6.4)
  return tl
}


/* ============ 5. OKR system ============ */
const KRS = ['Adoption', 'Cycle time', 'Quality', 'Reach']
const PEERS: [string, number][] = [['AF', 0.82], ['JB', 0.64], ['You', 0.71]]
const DOCS_UP = ['Q3 plan.pdf', 'Workday export.csv', 'Survey results.xlsx']
const OKR_Q = 'Where am I behind this quarter?'
const OKR_A = 'Your Quality KR is 9 points behind plan. Last quarter you closed a similar gap by pairing with Engineering, as noted in your project memory.'

function OkrMock() {
  return (
    <Win title="OKR system" sats={[{ k: 'Alignment', v: '100%', d: 'every KR traced to the company' }, { k: 'Access', v: 'RBAC', d: 'role-based visibility' }]}>
      <div className="m-main full">
        <div className="m-head">
          <b>OKR System</b>
          <span className="m-chip">Q3 · Company view</span>
          <span className="o-int"><i>Workday</i><i>Qualtrics</i><i>RBAC</i></span>
        </div>
        <div className="o-grid">
          <div className="m-card o-tree">
            <h4>Alignment</h4>
            <svg className="o-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {['M50 22 V32 H25 V43', 'M50 22 V32 H75 V43', 'M25 55 V66 H12 V79', 'M25 55 V66 H38 V79', 'M75 55 V66 H62 V79', 'M75 55 V66 H88 V79'].map((d) => <path key={d} pathLength={1} d={d} />)}
            </svg>
            <div className="o-node o-co" style={{ left: '50%', top: '16%' }}><b>Company objective</b><span className="o-pct">0%</span><i><u /></i></div>
            <div className="o-node o-team" style={{ left: '25%', top: '49%' }}><b>Team objective</b><i><u /></i></div>
            <div className="o-node o-team" style={{ left: '75%', top: '49%' }}><b>Team objective</b><i><u /></i></div>
            {KRS.map((k, i) => (
              <div key={k} className={`o-node o-kr ${i === 2 ? 'me' : ''}`} style={{ left: `${[12, 38, 62, 88][i]}%`, top: '84%' }}><b>{k}</b><i><u /></i></div>
            ))}
          </div>
          <div className="o-mid">
            <div className="m-card o-you">
              <h4>Your contribution</h4>
              <div className="o-ringbox">
                <svg viewBox="0 0 36 36"><circle className="rbg" cx="18" cy="18" r="15" /><circle className="rfg o-rfg" pathLength={1} cx="18" cy="18" r="15" /></svg>
                <b>71%</b>
              </div>
              <p>Aligned to 2 company objectives</p>
            </div>
            <div className="m-card o-peers">
              <h4>Peers</h4>
              {PEERS.map(([n, v]) => (
                <div key={n} className={`o-peer ${n === 'You' ? 'you' : ''}`}><em>{n}</em><i><b style={{ width: `${v * 100}%` }} /></i></div>
              ))}
            </div>
          </div>
          <div className="m-card o-ai">
            <h4>Assistant</h4>
            <div className="o-docs">{DOCS_UP.map((d) => <span key={d}>{d}</span>)}</div>
            <p className="bub user o-q" />
            <p className="bub ai o-a" />
            <div className="o-mem"><u /> Memory on. Knows your project.</div>
          </div>
        </div>
      </div>
    </Win>
  )
}

const buildOkr: Build = (root, st) => {
  const win = one(root, '.win')
  const tl = mk(st)
  tl.from(one(win, '.m-head'), { opacity: 0, y: -10, duration: 0.4 }, 0)
  tl.from(q(win, '.o-int i'), { opacity: 0, y: 6, stagger: 0.12, duration: 0.3 }, 0.3)
  tl.from(q(win, '.m-card'), { opacity: 0, y: 18, stagger: 0.12, duration: 0.5 }, 0.2)
  tl.from(one(win, '.o-co'), { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(2)' }, 0.6)
  tl.fromTo(q(win, '.o-lines path').slice(0, 2), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 1.0)
  tl.from(q(win, '.o-team'), { opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.4, ease: 'back.out(2)' }, 1.4)
  tl.fromTo(q(win, '.o-lines path').slice(2), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.06, duration: 0.5, ease: 'none' }, 1.9)
  tl.from(q(win, '.o-kr'), { opacity: 0, y: 12, stagger: 0.1, duration: 0.4 }, 2.3)
  tl.from(q(win, '.o-node i u'), { scaleX: 0, transformOrigin: '0% 50%', stagger: 0.08, duration: 0.8 }, 2.8)
  count(tl, one(win, '.o-pct'), 68, (n) => `${Math.round(n)}%`, 2.8, 1.4)
  tl.to(one(win, '.o-kr.me'), { boxShadow: '0 0 0 2px #5d2a1a', duration: 0.3 }, 4.0)
  tl.fromTo(one(win, '.o-rfg'), { strokeDashoffset: 1 }, { strokeDashoffset: 0.29, duration: 1, ease: 'power2.out' }, 4.1)
  tl.from(one(win, '.o-you p'), { opacity: 0, duration: 0.4 }, 4.6)
  tl.from(q(win, '.o-peer'), { opacity: 0, x: -10, stagger: 0.12, duration: 0.4 }, 4.8)
  tl.from(q(win, '.o-peer i b'), { width: 0, stagger: 0.12, duration: 0.7 }, 5.0)
  tl.from(q(win, '.o-docs span'), { opacity: 0, y: -14, stagger: 0.18, duration: 0.4 }, 5.4)
  type(tl, one(win, '.o-q'), OKR_Q, 6.1, 1.2)
  type(tl, one(win, '.o-a'), OKR_A, 7.4, 2.2)
  tl.fromTo(one(win, '.o-mem u'), { scale: 1 }, { scale: 1.8, opacity: 0.4, duration: 0.5, yoyo: true, repeat: 3 }, 7.6)
  floaters(tl, root, 1.8, 5.0)
  return tl
}

export const visuals: Record<PlatformInfo['id'], { Visual: () => React.JSX.Element; build: Build }> = {
  insight: { Visual: InsightMock, build: buildInsight },
  tower: { Visual: TowerMock, build: buildTower },
  analyst: { Visual: AnalystMock, build: buildAnalyst },
  unified: { Visual: UnifiedMock, build: buildUnified },
  okr: { Visual: OkrMock, build: buildOkr },
}
