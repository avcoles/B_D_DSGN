/**
 * Design principles (part one of the design audit: the reasoned read).
 *
 * Written under the authoring rules in the Design-Audit skill. Every principle
 * has to clear two bars:
 *
 *   It travels.   Could this rule be used to judge a different landing page?
 *                 If it only describes this one, it's an observation, not a
 *                 principle.
 *   It's earned.  Something on the page in the iframe has to prove it. The
 *                 source of each proof is noted below so it can be checked.
 *
 * House style for this section: no em or en dashes, no jargon, no inflated
 * significance. The rationale exists to make the thinking legible to someone
 * who has never opened a design tool.
 */

export const designPrinciples = {
  principles: [
    {
      principle: 'Start from paper, not from white',
      rationale:
        'The background is a warm off-white rather than pure white, so a white card has something to sit on. Start from pure white and every panel you add needs a heavy border just to become visible.',
      // Earned by: --paper #FAF8F5 against --card #FFFFFF
    },
    {
      principle: 'Spend one colour, and spend it where you want the eye',
      rationale:
        'A single burnt orange does all the highlighting on the page and nothing else competes with it. When one colour is the only colour, nobody has to hunt for what matters.',
      // Earned by: --accent #C2500F on buttons, nav underlines, feature numerals
    },
    {
      principle: 'Let hairlines do the work of boxes',
      rationale:
        'Sections are divided by a one pixel line instead of a filled panel. The line separates just as clearly and leaves the page feeling open rather than chopped into compartments.',
      // Earned by: --rule rgba(26,23,19,0.12), used for every division on the page
    },
    {
      principle: 'Give every typeface a single job',
      rationale:
        'A serif for headings, a plain sans for reading, a monospace for small labels. Three faces are enough that you know what kind of text you are looking at before you read it, and a fourth would leave you guessing.',
      // Earned by: Instrument Serif, Inter, JetBrains Mono, each with one role
    },
    {
      principle: 'Move fast on response, slow on arrival',
      rationale:
        'A hover answers in about a sixth of a second. Something arriving on screen takes closer to half. Quick when you asked for it, calmer when the page is settling on its own.',
      // Earned by: 160ms on buttons, 240ms on transitions, 640ms on scroll reveals
    },
    {
      principle: 'Rank the actions so the ranking needs no reading',
      rationale:
        'Filled button, outlined button, plain underlined text. Someone skimming should be able to point at the main path without reading a single label.',
      // Earned by: .btn-primary, .btn-ghost, and the underlined nav text action
    },
    {
      principle: 'Stop the text before the screen does',
      rationale:
        'Paragraphs stop at about 1080 pixels no matter how wide the monitor gets. Long lines make readers lose their place on the way back to the left margin.',
      // Earned by: .wrap max 1080px, .sec-head 52ch, hero paragraph 46ch
    },
  ],
}
