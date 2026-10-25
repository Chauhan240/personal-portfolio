import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../../data/profile'
import { GrainPortrait } from './GrainPortrait'
import './platforms.css'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-kicker', { opacity: 0, y: 12, duration: 0.8 })
        .from('.hero-line > span', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.1)
        .from('.hero-sub', { opacity: 0, y: 18, duration: 0.9 }, 0.8)
        .from('.hero-cta .btn', { opacity: 0, y: 14, stagger: 0.1, duration: 0.7 }, 1)
        .from('.hero-proof li', { opacity: 0, y: 16, stagger: 0.1, duration: 0.7 }, 1.1)
        .from('.hero-cue', { opacity: 0, duration: 0.8 }, 1.4)
        .from('.hero-photo .gp', { opacity: 0, y: 40, scale: 0.97, duration: 1.2 }, 0.3)
    }, el)
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero-photo', { scale: 1.2, yPercent: -6, transformOrigin: '50% 100%', ease: 'none' }, 0)
        .to('.hero-copy', { scale: 0.88, opacity: 0, y: -70, transformOrigin: '0% 50%', ease: 'none' }, 0)
    }, el)
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="hero" aria-label="Introduction">
      <div className="hero-inner">
       <div className="hero-copy">
        <p className="hero-kicker">{profile.name} · Data &amp; AI Platform Lead · Enterprise Analytics</p>
        <h1>
          <span className="hero-line"><span>Months of <b className="c1">manual work.</b></span></span>
          <span className="hero-line"><span>Done in <em>hours.</em></span></span>
        </h1>
        <p className="hero-sub">
          I <strong>engineer data and AI platforms</strong> that unify sales, finance, supply chain and operations into real-time dashboards, anomaly alerts and team-specific AI agents. Then I <strong>align the stakeholders</strong> who run the business on them.
        </p>
        <div className="hero-cta">
          <a className="btn blue" href="#platforms">See the impact <span aria-hidden="true">↓</span></a>
          <a className="btn ghost" href="https://www.linkedin.com/in/manish-c-5b8310292/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          <a className="btn ghost" href="#ask">Ask me anything <span aria-hidden="true">▸</span></a>
        </div>
        <ul className="hero-proof" aria-label="Impact at a glance">
          <li><b>Months → hours</b><span>manual reporting effort eliminated</span></li>
          <li><b>~2B rows/day</b><span>engineered into one source of truth</span></li>
          <li><b>$0.5M / yr</b><span>cloud and workflow cost optimised</span></li>
          <li><b>6 teams</b><span>running on purpose-built AI agents</span></li>
        </ul>
        <ul className="hero-domains" aria-label="Domains">
          <li className="hd-label">Domains</li>
          {['BFSI', 'Petrochemical', 'FMCG', 'Supply chain', 'Technology', 'Strategy'].map((d) => <li key={d}>{d}</li>)}
        </ul>
       </div>
        <div className="hero-photo">
          <GrainPortrait />
        </div>
      </div>
      <div className="hero-cue" aria-hidden="true">Scroll</div>
    </section>
  )
}
