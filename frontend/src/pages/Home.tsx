import { Hero } from '../sections/platforms/Hero'
import { Statement } from '../sections/platforms/Statement'
import { Platforms } from '../sections/platforms/Platforms'
import { Zoom } from '../sections/platforms/Zoom'
import { Engine } from '../sections/engine/Engine'
import { Teams } from '../sections/teams/Teams'
import { Headline } from '../components/motion/Headline'
import { AskWidget } from '../sections/ask/AskWidget'
import { SectionNav } from '../components/layout/SectionNav'
import { Anything } from '../sections/platforms/Anything'
import { Clients } from '../sections/Clients'
import { Certifications } from '../sections/Certifications'

export function Home() {
  return (
    <>
      <Hero />
      <Zoom><Statement /></Zoom>
      <Engine />
      <div className="sec-head" id="platforms">
        <p className="sec-kicker">Chapter 02 · The products</p>
        <Headline parts={['Five products.', { em: 'Built end to end.' }]} />
        <p>Each one started as a business problem and ended as something people use every day.</p>
      </div>
      <Platforms />
      <Teams />
      <Zoom><Anything /></Zoom>
      <Clients />
      <Zoom><Certifications /></Zoom>
      <SectionNav />
      <AskWidget />
    </>
  )
}
