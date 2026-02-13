# Human Review Plan -- Portfolio Site Remodel

## Site Map & Section Breakdown

```
Home (Single Page, Scroll-Driven)
├── Hero Section
│   ├── 3D animated background (R3F particle field)
│   ├── Kinetic typography: "Conor Douglas"
│   ├── Subtitle: "Full Stack Engineer"
│   ├── Scroll CTA indicator
│   └── Social links (LinkedIn, GitHub)
├── About Section
│   ├── Profile image with hover animation
│   ├── Bio paragraph
│   └── Key skills/stats counters
├── Experience Section
│   ├── Timeline layout
│   ├── Company cards with expand/modal detail
│   └── Role descriptions
├── Projects Section
│   ├── Device-frame showcase (MacBook/iPhone mockups)
│   ├── Project cards with tech stack tags
│   ├── Links to GitHub repos / live sites
│   └── Modal or detail expand for descriptions
├── Education Section
│   ├── Card-based layout
│   ├── Institution + dates + achievements
│   └── Subtle reveal animations
├── Contact Section
│   ├── Glass-morphism card
│   ├── Email, LinkedIn, GitHub links
│   └── Optional contact form
└── Navigation
    ├── Desktop: Fixed side/top nav with scroll progress
    ├── Mobile: Hamburger with full-screen overlay
    └── Smooth scroll to sections
```

## Information Architecture

- **Content source**: TypeScript data modules (`src/data/`) replacing JSON file
- **Routing**: Single page with hash-based section navigation
- **State**: Zustand store for theme (dark/light) and UI state (nav open, active section)
- **Scroll context**: GSAP ScrollTrigger tracks active section for nav highlighting

## Design System Specification

### Colors (Dark Theme -- Primary)
| Token | Hex | Usage |
|-------|-----|-------|
| Background | #0a0a0a | Page base |
| Surface | #111111 | Cards, sections |
| Elevated | #1a1a1a | Hover, active states |
| Text Primary | #fafafa | Headings |
| Text Secondary | #a1a1a1 | Body |
| Text Muted | #666666 | Captions, meta |
| Accent | #6366f1 | Links, CTAs (Indigo) |
| Accent Hover | #818cf8 | Hover state |
| Border | #262626 | Dividers |

### Colors (Light Theme -- Secondary)
| Token | Hex | Usage |
|-------|-----|-------|
| Background | #fafafa | Page base |
| Surface | #ffffff | Cards |
| Text Primary | #0a0a0a | Headings |
| Text Secondary | #525252 | Body |
| Accent | #4f46e5 | Links, CTAs |

### Typography
- **Display/H1**: Satoshi (variable weight, 700-900)
- **H2-H3**: Satoshi (600)
- **Body**: Inter (400)
- **Code/Mono**: JetBrains Mono
- **Scale**: 12, 14, 16, 18, 24, 32, 48, 72, 96, 120px

### Spacing
Base unit: 8px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### Components
- Glass cards (backdrop-blur, semi-transparent backgrounds)
- Device mockup frames (CSS-only MacBook + iPhone)
- Magnetic hover buttons
- Animated scroll indicators
- Timeline with connecting line
- Tag chips for technologies

## Decision Points Requiring Human Approval

1. **Color palette**: Should the accent color be indigo (#6366f1) or a different brand color?
2. **Profile photo**: Keep existing `properPic.png` or provide a new one?
3. **Background image**: Keep `background_landscape.jpg` or replace with 3D scene only?
4. **Content updates**: Are the project descriptions and experience details still current?
5. **Contact method**: Simple links or include a working contact form (requires backend/email service)?
6. **Domain**: What custom domain will be used for Vercel deployment?
7. **Font choice**: Satoshi + Inter, or different fonts preferred?
8. **3D Hero**: Particle field, gradient mesh, or geometric wireframe?
