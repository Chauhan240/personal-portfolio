import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './headline.css'

gsap.registerPlugin(ScrollTrigger)

type Part = string | { em: string }

/**
 * Kinetic headline: every word rises out of a mask when it scrolls into view.
 * `scrub` ties the reveal to scroll position instead of playing once, and `chars` splits per letter.
 */
export function Headline({
  parts,
  as: Tag = 'h2',
  id,
  className = '',
  scrub = false,
  chars = false,
}: {
  parts: Part[]
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  scrub?: boolean
  chars?: boolean
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current!
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = el.querySelectorAll('.hl-i')
      gsap.fromTo(
        targets,
        { yPercent: 115, rotate: chars ? 0 : 5, opacity: chars ? 0.1 : 1 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          ease: scrub ? 'none' : 'power4.out',
          duration: chars ? 0.6 : 1.1,
          stagger: chars ? 0.03 : 0.07,
          scrollTrigger: scrub
            ? { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true }
            : { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
        },
      )
    })
    return () => mm.revert()
  }, [scrub, chars])

  const words: { w: string; em: boolean }[] = parts.flatMap((p) =>
    (typeof p === 'string' ? p : p.em).split(' ').filter(Boolean).map((w) => ({ w, em: typeof p !== 'string' })),
  )
  const label = parts.map((p) => (typeof p === 'string' ? p : p.em)).join(' ')

  return (
    <Tag ref={ref} id={id} className={`hl ${className}`} aria-label={label}>
      {words.map(({ w, em }, i) => (
        <span key={i} className="hl-w" aria-hidden="true">
          {chars
            ? w.split('').map((c, j) => (
                <span key={j} className="hl-c"><span className={`hl-i ${em ? 'hl-em' : ''}`}>{c}</span></span>
              ))
            : <span className={`hl-i ${em ? 'hl-em' : ''}`}>{w}</span>}
        </span>
      ))}
    </Tag>
  )
}
