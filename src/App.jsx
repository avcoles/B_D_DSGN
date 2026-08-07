import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import DesignPrinciples from './components/DesignPrinciples.jsx'
import DesignSystem from './components/DesignSystem.jsx'
import TechStack from './components/TechStack.jsx'
import { template } from './data/template.js'

export default function App() {
  return (
    <main id="top" className="min-h-screen px-3 py-4 md:px-6 md:py-7">
      {/* White sheet on a platinum canvas. The two greys are close enough to
          stay quiet and far enough apart to frame the page — no shadow needed
          to separate them, which keeps the chrome flat as the brand requires. */}
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 rounded-edge border border-iron bg-white p-4 md:p-6">
        <Nav title={`${template.title} — ${template.subtitle}`} />
        <Hero t={template} />
        {/* Part one reads the page, part two measures it. Order matters: the
            principles have to land before the token tables that prove them. */}
        <DesignPrinciples />
        <DesignSystem />
        <TechStack />
      </div>
    </main>
  )
}
