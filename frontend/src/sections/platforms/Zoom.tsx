import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Section transition: zooms in from a rounded card as it arrives and eases back out as it leaves. */
export function Zoom({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const phone = window.innerWidth < 700
      gsap.fromTo(
        outer.current,
        phone ? { scale: 0.97, borderRadius: 24, y: 10 } : { scale: 0.86, borderRadius: 64, y: 80 },
        { scale: 1, borderRadius: 0, y: 0, ease: 'none', scrollTrigger: { trigger: outer.current, start: 'top bottom', end: 'top 25%', scrub: true } },
      )
      gsap.to(inner.current, {
        scale: phone ? 0.97 : 0.92,
        opacity: phone ? 0.7 : 0.4,
        transformOrigin: '50% 100%',
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: outer.current, start: 'bottom 75%', end: 'bottom top', scrub: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={outer} style={{ overflow: 'hidden', willChange: 'transform' }}>
      <div ref={inner}>{children}</div>
    </div>
  )
}
