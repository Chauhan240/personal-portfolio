import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Headline } from '../../components/motion/Headline'
import './teams.css'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { n: '01', t: 'Listen', d: 'Start with the decision, not the dataset. I sit with the business to find the question that actually matters.' },
  { n: '02', t: 'Align', d: 'Turn competing asks into one plan that product, engineering, data and governance can all commit to.' },
  { n: '03', t: 'Build', d: 'Lead the team through delivery: engineers, analysts and consultants working from the same blueprint.' },
  { n: '04', t: 'Land', d: 'Ship it, drive adoption, and track the impact the business cares about. Then tell the story: I edit the videos and build the decks that carry it to leadership.' },
]

const TEAMS = ['Engineering', 'Data team', 'Analysts', 'Consultants', 'Governance']
const TEAM_Y = [24, 104, 184, 264, 344]
const MODULES = ['Data layer', 'AI and agents', 'App and UX', 'Governance']

/** A person glyph built from blocks: head and shoulders. */
function User({ x, y, s = 1, cls = '' }: { x: number; y: number; s?: number; cls?: string }) {
  return (
    <g className={`ud ${cls}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-9" r="7" />
      <path d="M-13 12 C -13 -1, -7 -2, 0 -2 S 13 -1, 13 12 Z" />
    </g>
  )
}

function Diagram() {
  return (
    <svg viewBox="0 0 880 560" className="bd" role="img" aria-label="Block diagram: stakeholders define the decision, five teams align, build a platform, and it lands with global users, with a feedback loop back to the decision">
      {/* connectors */}
      <path className="cn c1" pathLength={1} d="M190 215 H235" />
      <path className="cn c2" pathLength={1} d="M365 214 H410 M410 54 V374" />
      {TEAM_Y.map((y, i) => <path key={i} className="cn c2" pathLength={1} d={`M410 ${y + 30} H440`} />)}
      {TEAM_Y.map((y, i) => <path key={i} className="cn c3" pathLength={1} d={`M610 ${y + 30} H650`} />)}
      <path className="cn c3" pathLength={1} d="M650 54 V374 M650 195 H690" />
      <path className="cn c4" pathLength={1} d="M775 320 V380" />
      <path className="cn loop" pathLength={1} d="M690 450 H300 V244" />
      <text className="tx xs loopt" x="500" y="442">learn and adjust</text>

      <path className="cn c5" pathLength={1} d="M105 380 V270" />

      {/* 01 stakeholders */}
      <g className="b s">
        <rect x="20" y="160" width="170" height="110" rx="16" />
        <User x={105} y={212} s={1.6} />
        <text className="tx mid" x="105" y="256">Business stakeholders</text>
      </g>
      <g className="bubble">
        <rect x="30" y="92" width="150" height="40" rx="20" />
        <path d="M70 132 L 80 146 L 92 132" />
        <text className="tx xs mid" x="105" y="116">What decision matters?</text>
      </g>

      {/* 02 one plan */}
      <g className="b d">
        <rect x="235" y="184" width="130" height="60" rx="14" />
        <text className="tx mid" x="300" y="219">One shared plan</text>
      </g>

      {/* teams */}
      {TEAMS.map((t, i) => (
        <g key={t} className="b t">
          <rect x="440" y={TEAM_Y[i]} width="170" height="60" rx="14" />
          <User x={470} y={TEAM_Y[i] + 34} s={0.8} />
          <text className="tx" x="492" y={TEAM_Y[i] + 35}>{t}</text>
          <g className="chk"><circle cx="590" cy={TEAM_Y[i] + 30} r="9" /><path d={`M585 ${TEAM_Y[i] + 30} l4 4 l7 -8`} /></g>
        </g>
      ))}

      {/* packets of work */}
      {TEAM_Y.map((y, i) => <rect key={i} className="pk" x="606" y={y + 26} width="8" height="8" rx="2" />)}

      {/* 03 platform */}
      <g className="b p">
        <rect x="690" y="70" width="170" height="250" rx="16" />
        <text className="tx xs" x="708" y="92">THE PLATFORM</text>
        {MODULES.map((m, i) => (
          <g key={m} className="mod">
            <rect x="706" y={104 + i * 54} width="138" height="44" rx="10" />
            <text className="tx" x="722" y={131 + i * 54}>{m}</text>
          </g>
        ))}
      </g>

      {/* 04 story for leadership */}
      <g className="b v">
        <rect x="20" y="380" width="170" height="124" rx="16" />
        <User x={58} y={428} s={0.9} />
        <g className="play"><circle cx="124" cy="418" r="15" /><path d="M119 410 L132 418 L119 426 Z" /></g>
        <rect className="slide" x="108" y="440" width="34" height="22" rx="4" />
        <path className="slide-l" d="M114 448 H136 M114 454 H128" />
        <text className="tx mid" x="105" y="482">Videos and decks</text>
        <text className="tx xs mid" x="105" y="496">FOR LEADERSHIP</text>
      </g>

      {/* 04 users */}
      <g className="b u">
        <rect x="690" y="380" width="170" height="140" rx="16" />
        <text className="tx xs" x="708" y="402">GLOBAL USERS</text>
        {[0, 1, 2].flatMap((c) => [0, 1].map((r) => <User key={`${c}${r}`} x={730 + c * 44} y={448 + r * 40} s={0.9} cls="gu" />))}
      </g>
    </svg>
  )
}

export function Teams() {
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const el = root.current!
    const svg = el.querySelector('.bd')!
    const q = (s: string) => gsap.utils.toArray<SVGElement>(svg.querySelectorAll(s))
    const mm = gsap.matchMedia()
    mm.add(
      {
        desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<string, boolean>
        if (reduce) {
          setPhase(3)
          return
        }
        const onUpdate = (self: ScrollTrigger) => setPhase(Math.min(3, Math.floor(self.progress * 4)))
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: desktop
            ? { trigger: el, start: 'top top', end: '+=330%', pin: true, scrub: 0.7, anticipatePin: 1, onUpdate }
            : { trigger: el.querySelector('.tw-frame'), start: 'top 75%', end: 'bottom 35%', scrub: 0.7, onUpdate },
        })
        const draw = (sel: string, at: number, each = 0.1, dur = 0.5) =>
          tl.fromTo(q(sel), { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: each, duration: dur, ease: 'none' }, at)

        // 01 Listen
        tl.from(q('.b.s'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.4 }, 0)
        tl.to(q('.b.s rect'), { stroke: '#17191c', strokeWidth: 2, duration: 0.3 }, 0.3)
        tl.from(q('.bubble'), { opacity: 0, y: 12, duration: 0.4 }, 0.4)
        draw('.c1', 0.6, 0, 0.35)
        tl.from(q('.b.d'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.35 }, 0.85)
        // 02 Align
        draw('.c2', 1.0, 0.04, 0.4)
        tl.from(q('.b.t'), { opacity: 0, x: 24, stagger: 0.1, duration: 0.4 }, 1.2)
        tl.from(q('.chk'), { opacity: 0, scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.3, ease: 'back.out(3)' }, 1.55)
        tl.to(q('.chk circle'), { fill: '#17191c', stroke: '#17191c', stagger: 0.1, duration: 0.2 }, 1.7)
        tl.to(q('.chk path'), { stroke: '#fff', stagger: 0.1, duration: 0.2 }, 1.7)
        // 03 Build
        tl.from(q('.b.p'), { opacity: 0, x: 30, duration: 0.4 }, 2.0)
        draw('.c3', 2.0, 0.04, 0.4)
        tl.fromTo(q('.pk'), { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.08 }, 2.3)
        TEAM_Y.forEach((_, i) => {
          const t = 2.35 + i * 0.08
          tl.to(q('.pk')[i], { attr: { x: 646 }, duration: 0.2, ease: 'none' }, t)
          tl.to(q('.pk')[i], { attr: { y: 191 }, duration: 0.3, ease: 'none' }, t + 0.2)
          tl.to(q('.pk')[i], { attr: { x: 706 }, opacity: 0, duration: 0.2, ease: 'none' }, t + 0.5)
        })
        tl.from(q('.mod'), { opacity: 0, x: 14, stagger: 0.12, duration: 0.3 }, 2.6)
        tl.to(q('.mod rect'), { fill: '#fafafb', stroke: '#17191c', stagger: 0.12, duration: 0.3 }, 2.8)
        // 04 Land
        draw('.c4', 3.0, 0, 0.3)
        tl.from(q('.b.u'), { opacity: 0, y: 20, duration: 0.4 }, 3.15)
        tl.from(q('.gu'), { opacity: 0, scale: 0, transformOrigin: '50% 50%', stagger: 0.07, duration: 0.3, ease: 'back.out(3)' }, 3.35)
        tl.to(q('.gu'), { fill: '#17191c', stagger: 0.07, duration: 0.2 }, 3.5)
        draw('.c5', 3.3, 0, 0.35)
        tl.from(q('.b.v'), { opacity: 0, y: 16, duration: 0.4 }, 3.45)
        tl.from(q('.play'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 3.7)
        tl.to(q('.play circle'), { fill: '#5d2a1a', duration: 0.2 }, 3.85)
        draw('.loop', 3.5, 0, 0.5)
        tl.from(q('.loopt'), { opacity: 0, duration: 0.3 }, 3.85)
        tl.to({}, { duration: 0.15 }, 3.9)

        gsap.from(el.querySelectorAll('.tw-intro > :not(h2)'), {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 70%' },
        })
      },
    )
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="tw" id="teams" aria-labelledby="tw-h">
      <div className="tw-inner">
        <div className="tw-copy">
          <div className="tw-intro">
            <p className="tw-kicker">How I work</p>
            <Headline id="tw-h" parts={['Teams, stakeholders,', { em: 'decisions.' }]} />
            <p className="tw-lede">A platform only matters if people trust it and use it. This is how I get from a business question to an outcome.</p>
          </div>
          <ol className="tw-phases">
            {PHASES.map((ph, i) => (
              <li key={ph.n} className={i === phase ? 'on' : i < phase ? 'past' : ''}>
                <span>{ph.n}</span>
                <div>
                  <h3>{ph.t}</h3>
                  <p>{ph.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="tw-frame">
          <figcaption>
            <span>FIG. 1</span> Decision block diagram
            <b>{PHASES[phase].n} {PHASES[phase].t}</b>
          </figcaption>
          <div className="tw-canvas"><Diagram /></div>
          <div className="tw-impact" aria-hidden={phase < 3}>
            <span className={phase >= 3 ? 'on' : ''}>Adopted by global users</span>
            <span className={phase >= 3 ? 'on' : ''}>Days to under a minute</span>
            <span className={phase >= 3 ? 'on' : ''}>Teams aligned on one plan</span>
            <span className={phase >= 3 ? 'on' : ''}>Videos and decks for leadership</span>
          </div>
          <i className="tw-tick t1" /><i className="tw-tick t2" /><i className="tw-tick t3" /><i className="tw-tick t4" />
        </figure>
      </div>
    </section>
  )
}
