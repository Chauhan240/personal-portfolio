import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { platforms } from './data'
import { Platform } from './Platform'
import { visuals } from './mockups'
import './platforms.css'

gsap.registerPlugin(ScrollTrigger)

const SEG = 15 // timeline units per platform
const REVEAL = 1.6 // circle wipe length
const PLAY = 8.5 // length of each product demo

/**
 * One pinned stage holds all four platforms. Scrolling wipes the next one in with an expanding circle,
 * tilts its diagram up out of 3D, then plays the diagram. No dead scroll between platforms.
 * Below 900px or with reduced motion the panels are plain stacked sections.
 */
export function Platforms() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current!
    const panels = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.pf'))
    const dots = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.pfs-dot'))
    const fill = el.querySelector('.pfs-fill')
    const mm = gsap.matchMedia()

    mm.add(
      {
        desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<string, boolean>
        const stageOf = (p: HTMLElement) => p.querySelector('.pf-visual')!
        const buildFor = (p: HTMLElement, st: ScrollTrigger.Vars) => visuals[platforms[panels.indexOf(p)].id].build(stageOf(p), st)

        if (reduce) {
          panels.forEach((p) => buildFor(p, {}).progress(1))
          return
        }

        if (!desktop) {
          panels.forEach((p) => {
            gsap.from(p.querySelectorAll('.pf-copy > *'), {
              y: 28,
              opacity: 0,
              stagger: 0.08,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: p, start: 'top 70%', toggleActions: 'play none none reverse' },
            })
            buildFor(p, { trigger: stageOf(p), start: 'top 80%', end: 'bottom 35%', scrub: 0.6 })
          })
          return
        }

        const master = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: `+=${panels.length * 150}%`, pin: true, scrub: 0.5, anticipatePin: 1 },
        })

        const cleanups: (() => void)[] = []
        panels.forEach((p, i) => {
          const s = i * SEG
          const copy = p.querySelectorAll('.pf-copy > *')
          const vis = stageOf(p)
          const ghost = p.querySelector('.pf-ghost')
          const stat = p.querySelector('.pf-stat')
          const statV = p.querySelector('.pf-stat-v')
          const counter = p.querySelector('.pf-count')
          const enterAt = i === 0 ? 0 : s
          const dots_ = dots
          const info = platforms[i].stat

          const tilt = vis.querySelector('.win-tilt')
          if (tilt) {
            gsap.set(tilt, { transformPerspective: 1200 })
            const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.6 })
            const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.6 })
            const move = (e: PointerEvent) => {
              const r = vis.getBoundingClientRect()
              ry(((e.clientX - r.left) / r.width - 0.5) * 8)
              rx(-((e.clientY - r.top) / r.height - 0.5) * 6)
            }
            const leave = () => { ry(0); rx(0) }
            vis.addEventListener('pointermove', move as EventListener)
            vis.addEventListener('pointerleave', leave)
            cleanups.push(() => { vis.removeEventListener('pointermove', move as EventListener); vis.removeEventListener('pointerleave', leave) })
          }

          if (i > 0) {
            master.fromTo(p, { clipPath: 'circle(0% at 50% 64%)' }, { clipPath: 'circle(150% at 50% 64%)', duration: REVEAL, ease: 'power2.inOut' }, s)
          }

          // 1. Impact number: counts up large, then the camera zooms through it.
          master.fromTo(stat, { opacity: 0, scale: 0.88, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' }, enterAt + 0.6)
          master.from(stat!.querySelectorAll('.pf-stat-k, p'), { opacity: 0, y: 20, stagger: 0.15, duration: 0.8 }, enterAt + 0.9)
          if (counter && info.to !== undefined) {
            const o = { n: 0 }
            master.to(o, { n: info.to, duration: 2, ease: 'power2.out', onUpdate: () => { counter.textContent = `${info.pre ?? ''}${o.n.toFixed(info.dec ?? 0)}` } }, enterAt + 0.9)
          }
          if (statV) master.fromTo(statV.querySelector('em'), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, enterAt + 1.2)
          master.to(stat, { scale: 2.2, opacity: 0, filter: 'blur(14px)', duration: 1.3, ease: 'power2.in' }, enterAt + 3.4)

          // 2. Each product enters its own way, so no two platforms feel alike.
          const ENTER: gsap.TweenVars[] = [
            { y: 260, rotationX: 42, scale: 0.7 },
            { x: 340, rotationY: -38, scale: 0.8, y: 60 },
            { scale: 0.86, y: 80, clipPath: 'inset(48% 48% 48% 48% round 40px)' },
            { x: -340, rotationY: 38, scale: 0.8, y: 60 },
            { y: -220, rotationX: -40, scale: 0.8 },
          ]
          const from = { ...ENTER[i % ENTER.length], opacity: 0, transformPerspective: 1400, transformOrigin: '50% 50%' }
          const to: gsap.TweenVars = { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out' }
          if (from.clipPath) to.clipPath = 'inset(-30% -10% -30% -10% round 0px)'
          master.fromTo(vis, from, to, enterAt + 3.6)
          master.from(copy, { y: 40, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out' }, enterAt + 4.2)
          if (ghost) master.fromTo(ghost, { xPercent: 30, scale: 0.8 }, { xPercent: -8, scale: 1, duration: SEG, ease: 'none' }, enterAt)

          // 3. The demo plays.
          master.add(buildFor(p, {}).duration(PLAY), enterAt + 5.2)

          master.to(dots_[i], { opacity: 1, scale: 1.5, duration: 0.5 }, enterAt + 0.4)
          if (i > 0) master.to(dots_[i - 1], { opacity: 0.3, scale: 1, duration: 0.5 }, s + 0.4)

          // 4. Exit as the next circle opens over this panel.
          if (i < panels.length - 1) {
            const exitAt = s + SEG
            master.to(copy, { y: -50, opacity: 0, stagger: 0.04, duration: 0.9, ease: 'power2.in' }, exitAt)
            master.to(vis, { scale: 1.15, y: -60, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'power2.in' }, exitAt)
          }
        })

        const total = (panels.length - 1) * SEG + 5.2 + PLAY
        if (fill) master.fromTo(fill, { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%', duration: total }, 0)
        master.to({}, { duration: 1.2 }, total)
        return () => cleanups.forEach((f) => f())
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className="pfs" id="platforms-stage">
      {platforms.map((p, i) => (
        <Platform key={p.id} p={p} index={i} />
      ))}
      <div className="pfs-rail" aria-hidden="true">
        <span className="pfs-line"><span className="pfs-fill" /></span>
        {platforms.map((p, i) => (
          <span key={p.id} className="pfs-dot" style={{ opacity: i === 0 ? 1 : 0.3 }}>{String(i + 1).padStart(2, '0')}</span>
        ))}
      </div>
    </div>
  )
}
