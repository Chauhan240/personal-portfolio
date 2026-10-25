import { useEffect, useRef } from 'react'
import { clients, logoFiles } from '../data/clients'
import './clients.css'

// Brand colours. Marks without a shipped SVG render as a coloured wordmark in the same hue.
const BRAND: Record<string, string> = {
  'coca-cola': '#E41E2B', amazon: '#FF9900', indorama: '#00549F', capgemini: '#0070AD', unilever: '#1F36C7',
  takeda: '#EE1C25', 'john-lewis': '#2B2B2B', dell: '#007DB8', honeywell: '#E4002B', deloitte: '#26890D', barclays: '#00AEEF', 'ntt-data': '#0072BC', natixis: '#7B2D8E',
}
const RATIO: Record<string, number> = { 'coca-cola': 4, amazon: 1.7, dell: 1, unilever: 1, barclays: 1.2 }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const outBack = (t: number) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) }
const seg = (p: number, a: number, b: number, f = ease) => f(clamp((p - a) / (b - a)))

/**
 * Trusted by: a sticky stage where the scroll deals thirteen cards out of one deck, face down, onto a grid
 * and flips them face up. A small rAF loop eases toward the scroll position so it feels weighted.
 */
export function Clients() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current, gridEl = grid.current, fitEl = fit.current, stageEl = stage.current
    if (!rootEl || !gridEl || !fitEl || !stageEl) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = [...gridEl.children] as HTMLElement[]
    const words = [...rootEl.querySelectorAll<HTMLElement>('.cl-word')]
    const N = cards.length
    if (reduce) rootEl.classList.add('is-static')

    let offs: { x: number; y: number }[] = []
    let target = reduce ? 1 : 0
    let cur = target
    let running = false
    let settled: boolean | null = null
    let raf = 0

    const measure = () => {
      const gw = gridEl.offsetWidth, gh = gridEl.offsetHeight
      offs = cards.map((c) => ({ x: gw / 2 - (c.offsetLeft + c.offsetWidth / 2), y: gh / 2 - (c.offsetTop + c.offsetHeight / 2) }))
      const s = Math.min(1, (stageEl.clientWidth - 32) / gw, (stageEl.clientHeight - 16) / gh)
      fitEl.style.transform = `translate(-50%, -50%) scale(${s})`
    }
    const readScroll = () => {
      if (reduce) return
      const r = rootEl.getBoundingClientRect()
      target = clamp(-r.top / (r.height - innerHeight))
    }
    const apply = (p: number) => {
      words.forEach((w, j) => {
        const t = seg(p, j * 0.035, 0.14 + j * 0.035)
        w.style.opacity = String(t)
        w.style.transform = `translateY(${(1 - t) * 40}px) rotateX(${(1 - t) * -50}deg)`
        w.style.filter = t > 0.99 ? 'none' : `blur(${(1 - t) * 12}px)`
      })
      const intro = seg(p, 0.04, 0.26)
      cards.forEach((c, i) => {
        const o = offs[i]
        if (!o) return
        const start = 0.24 + i * 0.042
        const d = seg(p, start, start + 0.26)
        const flip = seg(p, start + 0.08, start + 0.3, outBack)
        const k = 1 - d
        const arc = Math.sin(d * Math.PI)
        const x = o.x * k
        const y = o.y * k + (1 - intro) * 320 * k - arc * 40
        const z = (N - i) * 6 * k + arc * 240
        const rx = 62 * k
        const rz = (-14 + (((i * 7) % 5) - 2) * 3) * k
        const ry = 180 * (1 - flip)
        c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
        c.style.setProperty('--o', String(d > 0 ? 1 : intro.toFixed(3)))
        c.style.zIndex = String(d > 0 && d < 1 ? 50 : N - i)
      })
      rootEl.style.setProperty('--foot', seg(p, 0.86, 0.98).toFixed(3))
      const isSettled = p > 0.9
      if (isSettled !== settled) {
        settled = isSettled
        rootEl.classList.toggle('is-settled', isSettled)
        rootEl.style.setProperty('--spot', isSettled ? '1' : '0')
      }
    }
    const frame = () => {
      cur += (target - cur) * 0.1
      if (Math.abs(target - cur) < 0.0004) cur = target
      apply(cur)
      if (running) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame) }
      else if (!e.isIntersecting) running = false
    })
    io.observe(rootEl)

    const offsCleanup = cards.map((c) => {
      const tilt = c.querySelector<HTMLElement>('.cl-tilt')
      const move = (e: PointerEvent) => {
        if (!settled || e.pointerType !== 'mouse' || !tilt) return
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
        tilt.style.transform = `translateZ(30px) rotateX(${((0.5 - py) * 16).toFixed(2)}deg) rotateY(${((px - 0.5) * 18).toFixed(2)}deg)`
        c.style.setProperty('--gx', `${px * 100}%`); c.style.setProperty('--gy', `${py * 100}%`)
      }
      const leave = () => { if (tilt) tilt.style.transform = '' }
      c.addEventListener('pointermove', move)
      c.addEventListener('pointerleave', leave)
      return () => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave) }
    })
    const spot = (e: PointerEvent) => {
      const r = rootEl.querySelector('.cl-sticky')!.getBoundingClientRect()
      rootEl.style.setProperty('--mx', `${e.clientX - r.left}px`); rootEl.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    const onResize = () => { measure(); readScroll(); apply(cur) }
    rootEl.addEventListener('pointermove', spot)
    addEventListener('scroll', readScroll, { passive: true })
    addEventListener('resize', onResize)
    measure(); readScroll(); apply(cur)
    // Fonts and the preceding pinned sections shift layout after mount.
    const late = setTimeout(onResize, 600)

    return () => {
      clearTimeout(late)
      cancelAnimationFrame(raf)
      io.disconnect()
      offsCleanup.forEach((f) => f())
      rootEl.removeEventListener('pointermove', spot)
      removeEventListener('scroll', readScroll)
      removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="clients" ref={root} className="cl" aria-labelledby="cl-title">
      <div className="cl-sticky">
        <header className="cl-head">
          <p className="cl-eyebrow">Clients and employers</p>
          <h2 className="cl-title" id="cl-title">
            <span className="cl-word">Trusted</span> <span className="cl-word">by</span>{' '}
            <span className="cl-word cl-hot">teams</span> <span className="cl-word cl-hot">that</span> <span className="cl-word cl-hot">ship.</span>
          </h2>
        </header>
        <div className="cl-stage" ref={stage}>
          <div className="cl-fit" ref={fit}>
            <div className="cl-grid" ref={grid} role="list">
              {clients.map((c, i) => {
                const col = BRAND[c.slug] ?? '#2B2B2B'
                const file = logoFiles.has(c.slug)
                const mask = `url(/logos/${c.slug}.svg)`
                const size = c.slug === 'coca-cola' ? '100% auto' : 'contain'
                const idx = String(i + 1).padStart(2, '0')
                return (
                  <div className="cl-card" role="listitem" key={c.slug} style={{ ['--a' as string]: col, ['--i' as string]: i }}>
                    <div className="cl-float">
                      <div className="cl-tilt">
                        <div className="cl-face cl-front">
                          <span className="cl-idx">{idx}</span>
                          <div className="cl-logo">
                            {file ? (
                              <i role="img" aria-label={c.name} style={{ width: 40 * (RATIO[c.slug] ?? 1.5), maskImage: mask, WebkitMaskImage: mask, maskSize: size, WebkitMaskSize: size }} />
                            ) : (
                              <span role="img" aria-label={c.name}>{c.name}</span>
                            )}
                          </div>
                          <p className="cl-desc">{c.context}</p>
                          <span className="cl-glare" />
                        </div>
                        <div className="cl-face cl-back" aria-hidden="true"><span>{idx}</span></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <p className="cl-foot"><b>{clients.length} organisations</b> across data, ML and cloud engineering</p>
      </div>
    </section>
  )
}
