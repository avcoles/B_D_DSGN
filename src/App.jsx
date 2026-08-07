import { useCallback, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import DesignPrinciples from './components/DesignPrinciples.jsx'
import DesignSystem from './components/DesignSystem.jsx'
import TechStack from './components/TechStack.jsx'
import { projects } from './data/projects/index.js'

export default function App() {
  const [index, setIndex] = useState(0)
  const project = projects[index]

  // Every page is a full read from the top, so a page change returns you there
  // rather than dropping you halfway down a document you have not seen.
  const goTo = useCallback((next) => {
    setIndex(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <main id="top" className="min-h-screen px-3 py-4 md:px-6 md:py-7">
      {/* White sheet on a platinum canvas. The two greys are close enough to
          stay quiet and far enough apart to frame the page — no shadow needed
          to separate them, which keeps the chrome flat as the brand requires. */}
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 rounded-edge border border-iron bg-white p-4 md:p-6">
        <Nav
          title={`${project.title} — ${project.subtitle}`}
          index={index}
          total={projects.length}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />

        {/* Keyed on the project id so switching pages remounts the content.
            That reloads the iframe onto the new site and lets the scroll
            reveals run again, instead of the next page arriving pre-revealed. */}
        <div key={project.id} className="grid gap-4">
          <Hero t={project} />
          {/* Part one reads the page, part two measures it. Order matters: the
              principles have to land before the token tables that prove them. */}
          <DesignPrinciples principles={project.principles} />
          <DesignSystem system={project.system} tokens={project.specTokens} />
          <TechStack items={project.techStack} />
        </div>
      </div>
    </main>
  )
}
