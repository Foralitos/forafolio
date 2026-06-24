# Forafolio — design system conventions

A personal-portfolio component set: a retro **16-bit / pixel-art** aesthetic over
a dark, glassmorphic base with a violet accent. Components are plain React
exports on `window.Forafolio` (loaded from the root `_ds_bundle.js`).

## Setup & wrapping

- **No provider or theme context is required.** Import a component and render it —
  e.g. `window.Forafolio.PrimaryButton`. There is no `ThemeProvider`/`Context` to
  wrap in.
- **Animation is built in** via framer-motion; nothing to configure.
- Some components respond to the page, not props: `ScrollDownIndicator` is
  `position: fixed` to the viewport bottom and hides past 100px of scroll;
  `NPCDialogBox` starts its typewriter sequence once scrolled into view. Give them
  room (a tall container / real page) to behave naturally.
- `Hero`, `About`, `Contact`, `Navbar`, `Footer`, `Projects` are **full-page
  landing sections**, not small reusable parts. They render full-bleed, read the
  time-of-day theme internally, and reference brand images by path. Compose pages
  *from* the primitives (`PrimaryButton`, `SecondaryButton`, `NPCDialogBox`); treat
  the sections as references for layout, not drop-in widgets.

## Styling idiom — Tailwind utilities

This system styles with **Tailwind utility classes** (no CSS-in-JS, no class maps).
Match the brand with these real, shipped classes:

| Purpose | Classes |
|---|---|
| Brand accent (CTA) | `bg-violet-500` · `hover:bg-violet-600` · `hover:text-violet-400` · `hover:border-violet-500` |
| Dark surfaces | `bg-gray-950` · `bg-gray-900/95` |
| Glassmorphism | `bg-white/10` · `backdrop-blur-md` · `border-white/20` |
| Pill control | `rounded-full` |

**Fonts** (font-family utilities, all shipped):

| Class | Family | Use |
|---|---|---|
| `font-neuebit` | PP Neue Bit | headings / display |
| `font-mondwest` | PP Mondwest | body / prose |
| `font-pixel` | Press Start 2P | retro / NPC dialog text |

Default sans is the system `Inter` stack. Prefer these utilities for your own
layout glue so generated UI stays on-brand.

## Where the truth lives

- **Styling**: `styles.css` and its `@import` closure (`_ds_bundle.css` for
  component styles, plus the compiled Tailwind sheet and `@font-face` rules).
  Read it before styling.
- **Per component**: `components/<group>/<Name>/<Name>.d.ts` (props contract) and
  `<Name>.prompt.md` (usage). Groups: `general` (buttons), `landing`, `common`.

## Idiomatic snippet

```tsx
const { PrimaryButton, SecondaryButton } = window.Forafolio;

<section className="bg-gray-950 px-6 py-24">
  <h2 className="font-neuebit text-4xl text-white mb-3">Selected work</h2>
  <p className="font-mondwest text-gray-400 mb-8">A few things I’ve built.</p>
  <div className="flex gap-4">
    <PrimaryButton to="/projects">View projects</PrimaryButton>
    <SecondaryButton to="/about">Learn more</SecondaryButton>
  </div>
</section>
```
