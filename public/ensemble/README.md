# Ensemble

A small storefront landing page. Everyday apparel and bags, sold in short runs.

## Run

Any static server. The page also works opened straight from disk.

    python3 -m http.server 8000

## Design tokens

| Token | Value |
|---|---|
| `--color-red` | `#ff0001` |
| `--color-cream` | `#ede4dd` |
| `--color-black` | `#000` |
| footer muted grey | `#5A5A5A` |
| `--ease` | `cubic-bezier(.83,0,.17,1)` |
| `--ease-out-strong` | `cubic-bezier(.22,1,.36,1)` |
| `--aspect-large` | `9/12` |
| `--aspect-small` | `242/240` |

The layout runs on an 8 column mobile / 16 column desktop grid. Each editorial
cell sets its own `col-start`/`col-end` span and aspect ratio. The header uses
`mix-blend-difference` so it inverts against whatever scrolls beneath it.

`link-hover` wipes an underline in from the left:

    transform: scaleX(0) -> scaleX(1)
    transform-origin: 0
    transition: transform .5s var(--ease)

## Behaviour

- **Lenis** smooth scroll (v1.1.13, vendored)
- **Preloader** with 6 images cycling, a 0 to 100 counter, the wordmark letters
  rising, then a panel wipe
- **Custom cursor**, a red dot that eases behind the pointer and swells into a
  "View" pill over cards
- **Themes**, three dots switch `data-theme` on `<html>` between dark, cream and
  red while a marker slides between them
- **Menu** opens with a clip-path polygon wipe
- **Scroll reveals** via IntersectionObserver at threshold .15, `-10%` rootMargin
- **Parallax** on card imagery, translated against scroll

## Notes

The wordmark is live text rather than outlined paths, so the letters can be
animated individually and the name can be changed without redrawing artwork.

Type is Neue Haas Grotesk Text Pro where licensed, falling back to Helvetica
Neue and Arial. Swap the `@font-face` in `styles.css` if you have the licence.
