import { useEffect, useRef } from 'react'
import './engine.css'

type Chip = [string, string]
interface Layer { n: string; title: string; icon: string; sum: string; chips: Chip[] }
interface Frame { div: HTMLElement; g: SVGGElement }

const LAYERS: Layer[] = [
  {
    n: '01', title: 'Cloud and delivery', icon: 'cloud',
    sum: 'Where everything runs: managed AI services, containers and CI/CD across Azure, AWS and GCP, with MLOps and AIOps gates before release.',
    chips: [['Azure AI Foundry', 'cloud'], ['AI Search', 'search'], ['Azure OpenAI', 'brain'], ['AWS SageMaker', 'book'], ['Bedrock', 'box'], ['Glue and EMR', 'filter'],
      ['GCP Vertex AI', 'cpu'], ['Cloud Run', 'play'], ['Docker and Kubernetes', 'helm'], ['GitHub Actions', 'git'], ['ArgoCD', 'loop'], ['MLflow', 'flask']],
  },
  {
    n: '02', title: 'Data and ontology', icon: 'db',
    sum: 'Many sources, modelled once. An ontology gives every business term one meaning across governed tables, documents and systems.',
    chips: [['Ontology', 'nodes'], ['Multi-source', 'layers'], ['Databricks and Delta Lake', 'layers'], ['PySpark', 'spark'], ['Snowflake', 'snow'], ['Synapse', 'db'], ['Redshift', 'db'],
      ['Star and snowflake models', 'star'], ['Data Vault', 'vault'], ['ETL and ELT pipelines', 'filter'], ['Master data modelling', 'book'], ['Data quality engineering', 'shieldcheck']],
  },
  {
    n: '03', title: 'Harness and loops', icon: 'shieldcheck',
    sum: 'Tools, memory, evals and guardrails wrap every run. A failed check loops back and retries before anything reaches a user.',
    chips: [['Harness', 'shield'], ['Self-correct loop', 'loop'], ['Golden-set evals', 'check'], ['LLM as judge', 'scale'], ['Guardrails and fallbacks', 'shield'], ['Responsible AI', 'eye'],
      ['Drift monitoring', 'pulse'], ['RBAC and SSO', 'lock'], ['Token budgets', 'coins']],
  },
  {
    n: '04', title: 'Agents and models', icon: 'brain',
    sum: 'The intelligence: routing, multi-agent orchestration, retrieval, fine-tuning and classic machine learning, each used where it fits.',
    chips: [['Routing', 'link'], ['Multi-agent orchestration', 'nodes'], ['LangChain', 'link'], ['Tool calling and MCP', 'tool'], ['Hybrid and multi-hop RAG', 'layers'], ['Text-to-SQL', 'db'],
      ['Prompt engineering', 'message'], ['RLHF', 'user'], ['LoRA and QLoRA', 'sliders'], ['PyTorch and TensorFlow', 'cpu'], 
      ['AI engineering', 'cpu'], ['Data science', 'flask'], ['Machine learning', 'spark'], ['Time series forecasting', 'trend'], ['A/B testing', 'flask']],
  },
  {
    n: '05', title: 'Apps and BI', icon: 'chart',
    sum: 'The surfaces people actually open: Power BI reports, dashboards, web apps and APIs I build front to back.',
    chips: [['Power BI', 'chart'], ['Tableau', 'chart'], ['Plotly Dash', 'trend'], ['Grafana', 'gauge'], ['React and TypeScript', 'atom'], ['FastAPI and Node', 'zap'], ['REST APIs', 'api']],
  },
  {
    n: '06', title: 'Decisions and storytelling', icon: 'target',
    sum: 'Turning outputs into decisions that leadership acts on: framing, KPIs, demo videos and decks.',
    chips: [['Problem framing', 'target'], ['KPI definition', 'gauge'], ['Root-cause analysis', 'search'], ['Executive storytelling', 'message'],
      ['Stakeholder management', 'users'], ['SaaS demo videos', 'video'], ['Leadership decks', 'slides']],
  },
]

const shield = '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'
const ICONS: Record<string, string> = {
  cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  book: '<path d="M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3z"/><path d="M5 18a3 3 0 0 1 3-3h11"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  filter: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  helm: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21M5.6 5.6l4.6 4.6M13.8 13.8l4.6 4.6M18.4 5.6l-4.6 4.6M10.2 13.8l-4.6 4.6"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 3-3 4-9.5 5.5"/>',
  loop: '<path d="M20 11a8 8 0 0 0-14-5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2M20 20v-4h-4"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 14h9"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  spark: '<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  vault: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v1.5M12 14.5V16M8 12h1.5M14.5 12H16"/>',
  shield,
  shieldcheck: shield + '<path d="m9 12 2 2 4-4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="m5 7-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  tool: '<path d="M14.5 5.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3z"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.5 5"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  nodes: '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m6.5 6.5 3.3 3.3M17.5 6.5l-3.3 3.3M6.5 17.5l3.3-3.3M17.5 17.5l-3.3-3.3"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  cluster: '<circle cx="7" cy="8" r="2"/><circle cx="11" cy="5" r="1.5"/><circle cx="16" cy="15" r="2"/><circle cx="19.5" cy="18.5" r="1.5"/><circle cx="14" cy="19.5" r="1.5"/><circle cx="5" cy="16" r="2"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 14 4-5"/>',
  atom: '<circle cx="12" cy="12" r="1.4"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  api: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/><circle cx="12" cy="12" r="1.3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8M7 12l3-3 2 2 4-4"/>',
}
const ic = (n: string) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.box}</svg>`

const NS = 'http://www.w3.org/2000/svg'
const STEPS = LAYERS.length

export function Engine() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const spineRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current, svg = svgRef.current
    const spine = spineRef.current, detail = detailRef.current, dotsEl = dotsRef.current
    if (!root || !canvas || !svg || !spine || !detail || !dotsEl) return

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) root.classList.add('reduce')
    root.style.height = `calc(${STEPS} * ${innerWidth < 700 ? 58 : 85}vh + 100vh)`

    const el = (tag: string, cls?: string, html?: string) => {
      const e = document.createElement(tag)
      if (cls) e.className = cls
      if (html != null) e.innerHTML = html
      return e
    }
    const sel = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
      const e = document.createElementNS(NS, tag)
      for (const k in attrs) e.setAttribute(k, String(attrs[k]))
      return e
    }
    const q = (s: string) => detail.querySelector(s) as HTMLElement

    let dead = false
    let CW = 0, CH = 0, mode: 'd' | 'm' = 'd', step = -1
    let cur: Frame | null = null
    let nodes: HTMLElement[] = []
    let ys: number[] = []
    let sFill: HTMLElement | null = null
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => { const t = window.setTimeout(fn, ms); timers.push(t); return t }

    function jump(i: number) {
      const top = root!.getBoundingClientRect().top + scrollY
      scrollTo({ top: top + ((i + 0.5) / STEPS) * (root!.offsetHeight - innerHeight), behavior: reduce ? 'auto' : 'smooth' })
    }

    const dotBtns = Array.from({ length: STEPS }, (_, i) => {
      const b = el('button') as HTMLButtonElement
      b.type = 'button'
      b.setAttribute('aria-label', `Layer ${LAYERS[i].n}: ${LAYERS[i].title}`)
      b.addEventListener('click', () => jump(i))
      dotsEl.appendChild(b)
      return b
    })

    function geom() {
      CW = canvas!.clientWidth
      CH = canvas!.clientHeight
      mode = CW < 700 ? 'm' : 'd'
      svg!.setAttribute('viewBox', `0 0 ${CW} ${CH}`)
      svg!.setAttribute('width', String(CW))
      svg!.setAttribute('height', String(CH))
    }

    function buildSpine() {
      spine!.innerHTML = ''
      nodes = []
      ys = []
      if (mode === 'm') return
      const top = 40, bot = CH - 40, x = 6
      ys = LAYERS.map((_, i) => bot - (i * (bot - top)) / (LAYERS.length - 1))
      const line = el('div', 'st-sline')
      Object.assign(line.style, { left: `${x - 1}px`, top: `${top}px`, height: `${bot - top}px` })
      sFill = el('i')
      line.appendChild(sFill)
      spine!.appendChild(line)
      LAYERS.forEach((L, i) => {
        const b = el('button', 'st-node', `<small>${L.n}</small>`) as HTMLButtonElement
        b.type = 'button'
        b.setAttribute('aria-label', `Layer ${L.n}: ${L.title}`)
        Object.assign(b.style, { left: `${x}px`, top: `${ys[i]}px` })
        b.addEventListener('click', () => jump(i))
        spine!.appendChild(b)
        nodes.push(b)
      })
    }
    function updateSpine() {
      if (mode === 'm' || !sFill) return
      nodes.forEach((n, i) => { n.classList.toggle('done', i < step); n.classList.toggle('on', i === step) })
      const bot = ys[0], to = ys[step]
      sFill.style.height = `${Math.max(0, bot - to)}px`
    }

    function newFrame(): Frame {
      if (cur) {
        const old = cur
        old.div.classList.add('out')
        old.g.classList.add('out')
        later(() => { old.div.remove(); old.g.remove() }, 350)
      }
      cur = { div: el('div', 'st-frame'), g: document.createElementNS(NS, 'g') }
      canvas!.appendChild(cur.div)
      svg!.appendChild(cur.g)
      return cur
    }
    const reveal = (f: Frame) => requestAnimationFrame(() => requestAnimationFrame(() => { f.div.classList.add('in'); f.g.classList.add('in') }))

    function path(f: Frame, d: string, cls: string, dl: number) {
      const p = sel('path', { d, class: cls, pathLength: 1 })
      p.style.setProperty('--dl', `${dl}s`)
      f.g.appendChild(p)
      return p
    }
    function packet(f: Frame, d: string, delay: number, dur: number, bronze: boolean) {
      if (reduce) return null
      const begin = `${(svg!.getCurrentTime() + delay).toFixed(2)}s`
      const c = sel('circle', { r: bronze ? 3 : 2.2, class: `st-pkt${bronze ? ' b' : ''}`, visibility: 'hidden' })
      c.appendChild(sel('set', { attributeName: 'visibility', to: 'visible', begin }))
      c.appendChild(sel('animateMotion', { path: d, dur: `${dur}s`, begin, repeatCount: 'indefinite', calcMode: 'spline', keyTimes: '0;1', keySplines: '.4 0 .2 1' }))
      f.g.appendChild(c)
      return c
    }
    const curve = (sx: number, sy: number, ex: number, ey: number, vertical = false) => {
      if (vertical) { const c = (ey - sy) * 0.55; return `M${sx} ${sy} C${sx} ${sy + c} ${ex} ${ey - c} ${ex} ${ey}` }
      const c = (ex - sx) * 0.55
      return `M${sx} ${sy} C${sx + c} ${sy} ${ex - c} ${ey} ${ex} ${ey}`
    }

    function renderLayer(i: number) {
      const L = LAYERS[i], f = newFrame()
      const hub = el('div', 'st-hub', `<span class="ic">${ic(L.icon)}</span><span><small>Layer ${L.n}</small><b>${L.title}</b></span>`)
      f.div.appendChild(hub)
      const chips = L.chips.map(([name, icon], k) => {
        const c = el('div', 'st-chip', `<span class="ic">${ic(icon)}</span>${name}`)
        c.style.setProperty('--dl', `${0.35 + k * 0.045}s`)
        return c
      })

      if (mode === 'd') {
        chips.forEach((c) => f.div.appendChild(c))
        const hubW = hub.offsetWidth
        const spineR = nodes.length ? Math.max(...nodes.map((n) => n.offsetLeft + n.offsetWidth)) : 0
        const n = chips.length, two = n > 7, m1 = two ? Math.ceil(n / 2) : n
        const cols = two ? [chips.slice(0, m1), chips.slice(m1)] : [chips]
        const wIn = Math.max(...cols[0].map((c) => c.offsetWidth))
        const wOut = two ? Math.max(...cols[1].map((c) => c.offsetWidth)) : 0
        const bulge = 18, gapA = 36, gapB = 20
        const need = hubW + gapA + bulge + wIn + (two ? gapB + wOut : 0)
        const hx = Math.max(spineR + 28 + hubW / 2, Math.min(CW * 0.3, CW - need + hubW / 2 - 8)), hy = CH / 2
        hub.style.left = `${hx}px`
        hub.style.top = `${hy}px`
        const hubR = hx + hubW / 2, xs = [hubR + gapA, hubR + gapA + bulge + wIn + gapB]
        const sp = Math.min(54, (CH - 40) / Math.max(m1, 1))
        let k = 0
        cols.forEach((col, ci) => {
          const m = col.length, span = sp * (m - 1), off = ci === 1 ? (sp / 2) * (m < m1 ? 1 : 0) : 0
          col.forEach((c, j) => {
            const y = hy - span / 2 + j * sp + off
            const u = span ? (y - hy) / (span / 2 + sp) : 0
            const x = xs[ci] + bulge * (1 - u * u)
            Object.assign(c.style, { left: `${x}px`, top: `${y}px` })
            const d = curve(hubR - 8, hy, x, y)
            path(f, d, 'st-path', 0.2 + k * 0.045)
            packet(f, d, 1.2 + Math.random() * 2, 2.2 + Math.random(), false)
            c.style.setProperty('--dl', `${0.35 + k * 0.045}s`)
            k++
          })
        })
        const nd = nodes[i], sx = nd.offsetLeft + nd.offsetWidth + 10
        const sd = curve(sx, ys[i], hx - hubW / 2, hy)
        path(f, sd, 'st-path bronze', 0)
        packet(f, sd, 0.9, 1.8, true)
      } else {
        const hubH = hub.offsetHeight, hy = hubH / 2 + 4, hx = CW / 2
        hub.style.left = `${hx}px`
        hub.style.top = `${hy}px`
        const wrap = el('div', 'st-wrap')
        wrap.style.top = `${hubH + 56}px`
        chips.forEach((c) => wrap.appendChild(c))
        f.div.appendChild(wrap)
        chips.forEach((c, k) => {
          const x = wrap.offsetLeft + c.offsetLeft + c.offsetWidth / 2, y = wrap.offsetTop + c.offsetTop
          const d = curve(hx, hy + hubH / 2 - 4, x, y, true)
          path(f, d, 'st-path', 0.2 + k * 0.04)
          if (c.offsetTop === 0) packet(f, d, 1 + Math.random() * 2, 1.8, false)
        })
      }
      reveal(f)
    }

    function updateDetail() {
      const L = LAYERS[step]
      const fill = () => {
        q('.st-kicker').textContent = `Layer ${L.n} · ${L.chips.length} skills`
        q('h3').textContent = L.title
        q('.sum').textContent = L.sum
        q('.st-now').textContent = ''
        detail!.classList.remove('swap')
      }
      if (reduce) { fill(); return }
      detail!.classList.add('swap')
      later(fill, 180)
    }

    function go(s: number, force = false) {
      if (dead || (s === step && !force)) return
      step = s
      root!.classList.toggle('is-last', s === STEPS - 1)
      if (!force) updateDetail()
      dotBtns.forEach((b, i) => { b.classList.toggle('on', i === step); b.classList.toggle('done', i < step) })
      updateSpine()
      renderLayer(s)
    }
    function onScroll() {
      const r = root!.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))
      go(Math.min(STEPS - 1, Math.floor(p * STEPS)))
    }

    let rT: number | undefined
    const relayout = () => {
      clearTimeout(rT)
      rT = window.setTimeout(() => { geom(); buildSpine(); if (step >= 0) go(step, true) }, 120)
    }
    const ro = new ResizeObserver(() => {
      if (Math.abs(canvas.clientWidth - CW) > 8 || Math.abs(canvas.clientHeight - CH) > 8) relayout()
    })
    ro.observe(canvas)
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', relayout)

    const start = () => { if (dead) return; geom(); buildSpine(); onScroll() }
    // The fonts and the pinned sections above shift layout; start after both settle.
    if (document.fonts) document.fonts.ready.then(start)
    else start()

    return () => {
      dead = true
      clearTimeout(rT)
      timers.forEach(clearTimeout)
      ro.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', relayout)
      dotsEl.innerHTML = ''
      spine.innerHTML = ''
      canvas.querySelectorAll('.st-frame').forEach((n) => n.remove())
      svg.innerHTML = ''
    }
  }, [])

  return (
    <section className="st" id="method" ref={rootRef} aria-labelledby="st-title">
      <div className="st-sticky">
        <div className="st-copy">
          <p className="st-eyebrow">Chapter 01 · How it works</p>
          <h2 className="st-title" id="st-title">One stack, <span className="st-hot">built bottom up.</span></h2>
          <p className="st-lede">Every product on this page runs on the same six layers. Here is each one, and what I bring to it.</p>
          <div className="st-detail" aria-live="polite" ref={detailRef}>
            <p className="st-kicker" />
            <h3 />
            <p className="sum" />
            <p className="st-now" />
          </div>
          <nav className="st-dots" aria-label="Jump to layer" ref={dotsRef} />
          <a className="st-cta" href="#platforms">See the five products <span aria-hidden="true">↓</span></a>
        </div>
        <div className="st-canvas" ref={canvasRef}>
          <svg className="st-svg" aria-hidden="true" ref={svgRef} />
          <div className="st-spine" ref={spineRef} />
        </div>
      </div>
    </section>
  )
}
