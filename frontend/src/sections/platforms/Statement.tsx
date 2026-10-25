import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './platforms.css'

gsap.registerPlugin(ScrollTrigger)

const TEXT =
  'Across companies and clients, I have owned the whole journey: framing the problem with stakeholders, building the platform with a team, and landing the business impact.'

export function Statement() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current!
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el.querySelectorAll('.w'),
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: true } },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="statement" id="about">
      <p aria-label={TEXT}>
        {TEXT.split(' ').map((w, i) => (
          <span key={i} className="w" aria-hidden="true">{w}</span>
        ))}
      </p>
    </section>
  )
}
