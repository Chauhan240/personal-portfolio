import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import './sectionnav.css'

const SECTIONS: { label: string; sel: string }[] = [
  { label: 'Intro', sel: '.hero' },
  { label: 'The story', sel: '#about' },
  { label: 'How it works', sel: '#method' },
  { label: 'Platforms', sel: '#platforms' },
  { label: 'Teams', sel: '#teams' },
  { label: 'What I build', sel: '.anything' },
  { label: 'Clients', sel: '#clients' },
  { label: 'Certifications', sel: '[aria-label="Certifications"]' },
]

/** Document offset of a section's start. Pinned sections live inside a spacer that holds their place in the flow. */
function startOf(sel: string): number | null {
  const el = document.querySelector(sel)
  if (!el) return null
  const ref = (el.closest('.pin-spacer') as HTMLElement | null) ?? el
  return ref.getBoundingClientRect().top + window.scrollY
}

function scrollToY(y: number) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) lenis.scrollTo(y, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/** Up and down arrows that jump between the page's sections. */
export function SectionNav() {
  const [idx, setIdx] = useState(0)
  const [count, setCount] = useState(SECTIONS.length)

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const y = window.scrollY + 8
      const tops = SECTIONS.map((s) => startOf(s.sel)).filter((t): t is number => t != null)
      setCount(tops.length)
      let cur = 0
      tops.forEach((t, i) => { if (t <= y) cur = i })
      setIdx(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const found = SECTIONS.filter((s) => startOf(s.sel) != null)
  const go = (dir: 1 | -1) => {
    const y = window.scrollY
    const tops = found.map((s) => startOf(s.sel) as number)
    let target: number | undefined
    if (dir === 1) target = tops.find((t) => t > y + 24)
    else target = [...tops].reverse().find((t) => t < y - 24)
    if (target != null) scrollToY(target)
  }

  const next = found[idx + 1]
  const prev = found[idx - 1]
  return (
    <nav className="sn" aria-label="Jump between sections">
      <button type="button" className="sn-b" onClick={() => go(-1)} disabled={idx <= 0} aria-label={prev ? `Previous: ${prev.label}` : 'Previous section'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
        {prev && <span className="sn-t">{prev.label}</span>}
      </button>
      <span className="sn-c" aria-hidden="true">{String(idx + 1).padStart(2, '0')}<i /> {String(count).padStart(2, '0')}</span>
      <button type="button" className="sn-b" onClick={() => go(1)} disabled={idx >= found.length - 1} aria-label={next ? `Next: ${next.label}` : 'Next section'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 10 6 6 6-6" /></svg>
        {next && <span className="sn-t">{next.label}</span>}
      </button>
    </nav>
  )
}
