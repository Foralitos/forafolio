# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Remix, featuring a dynamic day/night theme based on Mexico City time, smooth scroll navigation, and glassmorphism UI effects.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server (Vite)
npm run build        # Production build
npm start            # Run production server (requires build first)
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
```

### Build Output
- `build/server/` - Server-side bundle
- `build/client/` - Client-side bundle

## Architecture & Key Patterns

### Single-Page Application Structure
This is a **single-page portfolio** with scroll-based navigation, not multi-route application. All sections (Hero, About, Projects, Contact) are rendered on `app/routes/_index.tsx` with smooth scrolling between anchored sections.

### Component Organization
```
app/
├── components/
│   ├── common/        # Shared components (Navbar, Footer)
│   ├── landing/       # Section components (Hero, About, Projects, Contact)
│   └── ui/           # Reusable UI primitives (PrimaryButton, SecondaryButton)
├── hooks/            # Custom React hooks
│   └── useCDMXTime.ts
├── routes/           # Remix routes
│   └── _index.tsx    # Main landing page
└── root.tsx          # App shell with font preloading
```

### CDMX Time Integration
The `useCDMXTime` hook is central to the site's dynamic behavior:
- Provides real-time Mexico City timezone clock
- Returns `isDaytime` boolean (6 AM - 6 PM)
- Updates every second
- Used in Hero for day/night background switching
- Used in Navbar for live clock display

### Navigation Pattern
Navbar implements **scroll-to-anchor** navigation with active section tracking:
- Uses `window.scrollTo()` with smooth behavior
- Tracks active section via scroll position listener
- 80px offset for fixed navbar clearance
- Mobile menu with Framer Motion animations
- Desktop: glassmorphism centered nav with separate clock display

### Styling System
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for all animations and transitions
- **Custom Fonts**: PP Neue Bit (headings), PP Mondwest (body)
- **Glassmorphism**: `bg-white/10 backdrop-blur-md border-white/20`
- **Path Alias**: `~/` maps to `./app/`

### Image Assets
- `/ForaDay.png` and `/ForaNight.png` - Hero background images (preloaded)
- Images use `imageRendering: 'pixelated'` for retro aesthetic
- Fonts in `/public/fonts/` are preloaded in root.tsx

### Remix V3 Features Enabled
The project uses future flags for upcoming Remix v3:
- Single Fetch API
- Lazy route discovery
- Relative splat paths
- Fetcher persistence
- Throw abort reasons

## Key Technical Decisions

### Why Single Route?
Portfolio sections are tightly coupled visual experience with scroll-based storytelling. Multi-route navigation would break the smooth scrolling UX.

### Active Section Tracking
Scroll listener checks `getBoundingClientRect()` against 100px threshold to determine which section is in viewport, updating navbar active state.

### Time-Based Theming
Background switches based on Mexico City time (not user's local time) to reflect the developer's actual day/night cycle.

### Font Preloading Strategy
Custom fonts preloaded in root.tsx Layout to prevent FOUT (Flash of Unstyled Text) during initial render.

## Common Patterns

### Adding New Landing Section
1. Create component in `app/components/landing/`
2. Import and render in `app/routes/_index.tsx`
3. Add section ID for scroll navigation
4. Update `navItems` array in Navbar if needed
5. Update `sections` array in scroll handler

### Creating UI Components
- Place in `app/components/ui/` for reusable primitives
- Use Tailwind utilities, avoid custom CSS
- Export named exports (not default)
- TypeScript all props

### Animation Guidelines
- Use Framer Motion for all animations
- Initial/animate pattern for entrance animations
- AnimatePresence for exit animations
- Consistent duration values (0.5s-0.8s typical)
