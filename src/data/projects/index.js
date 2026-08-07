import { auralis } from './auralis.js'
import { ensemble } from './ensemble.js'
import { boutique } from './boutique.js'
import { commercialStudio } from './commercialStudio.js'

/**
 * Every showcased page, in the order they appear.
 *
 * The Previous/Next buttons walk this array, so reordering here reorders the
 * pages. To add one: copy a file in this folder, edit it, and add it below.
 *
 * A project with `hidden: true` stays in the codebase but drops out of the
 * pager, which is how a page gets shelved without deleting anything.
 */
export const projects = [auralis, ensemble, boutique, commercialStudio].filter(
  (project) => !project.hidden,
)
