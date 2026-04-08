# Houdy's Design System — Figma Blueprint

> Reference document for building the Figma design system. Every value maps 1:1 to the codebase.

---

## Part 1: Foundation Tokens

### Colors

| Token Name | Hex | Usage |
|---|---|---|
| `bg/primary` | `#FBF4E8` | Page background, cards, nav |
| `bg/card` | `#F5EDD8` | Card surfaces, subtle fills |
| `fg/primary` | `#1C1410` | Headings, body text, icons |
| `fg/muted` | `#7A6555` | Secondary text, captions |
| `fg/hint` | `#B0A898` | Hint text, breadcrumb labels |
| `fg/placeholder` | `#C4C0B8` | Input placeholders |
| `fg/subtle` | `#D1C9BF` | Subtle underlines, dividers |
| `fg/card` | `#4A3728` | Card body text |
| `fg/dark-hover` | `#2E2018` | Dark text hover state |
| `border/default` | `#E2D5C3` | Borders, dividers, rules |
| `border/neutral` | `#E8E0D5` | Lighter borders, pricing cards |
| `accent/green` | `#27BE5D` | Primary CTA, progress, ring |
| `accent/green-hover` | `#297A46` | CTA hover state |
| `accent/green-tint` | `#F0FBF4` | Selected card fill |
| `black` | `#000000` | Overlays |
| `white` | `#FFFFFF` | Inverted text, badges |

### Typography

| Style Name | Font | Weight | Size | Line Height | Use |
|---|---|---|---|---|---|
| Display | Alegreya | 800 | 48px (`text-5xl`) | 1.2 | Hero headlines |
| H1 | Alegreya | 700 | 36px (`text-4xl`) | 1.25 | Page titles |
| H2 | Alegreya | 700 | 30px (`text-3xl`) | 1.3 | Section titles |
| H3 | Alegreya | 700 | 24px (`text-2xl`) | 1.35 | Card headings |
| H4 | Alegreya | 700 | 20px (`text-xl`) | 1.4 | Nav logo, subheads |
| Body | Inter | 400 | 14px (base) | 20px | Default body copy |
| Body Large | Inter | 400 | 16px (`text-base`) | 1.5 | Survey questions |
| Body Small | Inter | 400 | 12px (`text-xs`) | 1.5 | Labels, captions |
| Label | Inter | 700 | 12px, uppercase | 1.5 | Section headings, tags |
| Button | Inter | 600 | 14-16px | 1.4 | CTAs, actions |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius/sm` | 4px (`rounded`) | Tags, small chips |
| `radius/md` | 8px (`rounded-lg`) | Input fields, small cards |
| `radius/lg` | 12px (`rounded-xl`) | Cards, modals |
| `radius/xl` | 16px (`rounded-2xl`) | Feature cards, panels |
| `radius/2xl` | 24px (`rounded-3xl`) | Hero containers |
| `radius/full` | 9999px (`rounded-full`) | Buttons, avatars, pills |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow/sm` | Tailwind `shadow-sm` | Subtle card lift |
| `shadow/md` | Tailwind `shadow-md` | Hover states |
| `shadow/lg` | Tailwind `shadow-lg` | Active cards, modals |
| `shadow/glow-green` | `0 0 6px rgba(39,190,93,0.7)` | Progress dot, CTA glow |
| `shadow/glow-ring` | `#27BE5D/20` | Idle button pulse |

### Spacing Scale

| Token | Value | Primary Usage |
|---|---|---|
| `space/1` | 4px | Tight gaps |
| `space/2` | 8px | Icon gaps, small padding |
| `space/3` | 12px | Card inner padding, gaps |
| `space/4` | 16px | Standard padding |
| `space/5` | 20px | Section padding (mobile) |
| `space/6` | 24px | Section padding (desktop) |
| `space/7` | 28px | Large gaps |
| `space/8` | 32px | Page margin |
| `space/10` | 40px | Major section spacing |

---

## Part 2: Motion & Interaction Tokens

### Spring Presets

| Name | Stiffness | Damping | Use |
|---|---|---|---|
| `spring/default` | 380 | 26 | Buttons, selections, snappy UI |
| `spring/soft` | 220 | 22 | Cards, tooltips, gentle reveals |

### Easing Curves

| Name | Value | Use |
|---|---|---|
| `ease/default` | `[0.32, 0.72, 0, 1]` | Step transitions, fade-ups |
| `ease/page` | `[0.22, 1, 0.36, 1]` | Page transitions |

### Animation Durations

| Token | Value | Use |
|---|---|---|
| `duration/quick` | 0.2s | Opacity toggles, hover states |
| `duration/short` | 0.25s | Small transitions |
| `duration/default` | 0.32s | Step slide + blur transitions |
| `duration/medium` | 0.42s | Fade-up reveals |
| `duration/slow` | 0.6s | Page transitions |

### Micro-Interactions

| Interaction | Animation | Details |
|---|---|---|
| CTA idle glow | Scale pulse 1 -> 1.18 -> 1 | Ring opacity 0.35 -> 0 -> 0.35, loops |
| Choice card hover | Scale 1.02, shadow lift | `spring/default` |
| Choice card tap | Scale 0.97 | `spring/default` |
| Emoji bounce | Scale 1 -> 1.3 -> 1 | On choice select |
| Logo select | Border green + checkmark | Deselect on re-click |
| Fun fact tooltip | Fade-in below grid | `spring/soft`, 0.3s |
| YouTube logo peek | Translate X 0 -> 4px | On hover/tap of "YouTube" text |
| Progress dot | Travelling glow along bar | Green shadow, loops |
| Step transition | Slide Y +/-52px + blur 6px | Direction-aware, 0.32s |
| Stagger children | 0.05s delay, 0.09s stagger | Lists, choice grids |
| Textarea char count | Fade in after typing | 0.4s opacity |
| Breadcrumb hints | Text swap at 60%/80% | Progressive feedback |
| Page border frame | Fixed inset green border | Desktop only |

---

## Part 3: Component Library

### Landing Page Components

| # | Component | Variants | Priority |
|---|---|---|---|
| 1 | Navbar | Default, Scrolled (blur bg), Mobile menu | High |
| 2 | Hero Section | With CTA, With video embed | High |
| 3 | Feature Card | Icon+text, Image+text | High |
| 4 | Pricing Card | Free, Pro, Enterprise; Selected state | High |
| 5 | CTA Button | Primary (green), Secondary (outline), Disabled, Loading | High |
| 6 | Footer | Links, copyright, sitemap link | Medium |
| 7 | Section Header | H2 + subtitle | Medium |
| 8 | Testimonial Card | Avatar, quote, name | Low |
| 9 | WinXP Easter Egg | Window, Start Menu (retro) | Low |

### Survey / Form Components

| # | Component | Variants | Priority |
|---|---|---|---|
| 10 | Survey Shell | Nav + progress bar + content area + border frame | High |
| 11 | Progress Bar | With travelling dot, percentage fill | High |
| 12 | Video Placeholder | 9:16 dark gradient, pulsing play button, "Coming soon" | High |
| 13 | Choice Card | Default, Hover, Selected (green border + emoji bounce) | High |
| 14 | Logo Select Grid | 4x1 grid, borderless logos, tooltip on select | High |
| 15 | Fun Fact Tooltip | Below-grid card with label + text | Medium |
| 16 | Long Text Input | Textarea with animated char count, placeholder | High |
| 17 | Choice + Text | Choices -> textarea with breadcrumb hints | High |
| 18 | Rich Question Text | Inline YouTube logo peek interaction | Medium |
| 19 | Summary Screen | Name/email inputs, answers review, submit CTA | High |
| 20 | Thank You Screen | Video placeholder, confirmation message | Medium |
| 21 | Continue Button | Default, Disabled, Idle glow ring | High |

### Dashboard Components (Future)

| # | Component | Variants | Priority |
|---|---|---|---|
| 22 | Sidebar Nav | Collapsed, Expanded | High |
| 23 | Dashboard Card | Stat, Chart, List | High |
| 24 | Data Table | Sortable, filterable, paginated | High |
| 25 | Response Viewer | Individual survey response detail | Medium |
| 26 | Chart Widget | Bar, Pie, Line (for survey analytics) | Medium |
| 27 | User Avatar | Image, Initials fallback | Medium |
| 28 | Notification Toast | Success, Error, Info | Medium |
| 29 | Modal / Dialog | Confirm, Form, Alert | Medium |
| 30 | Empty State | Illustration + CTA | Low |
| 31 | Settings Panel | Form sections, toggles | Low |

---

## Part 4: Step-by-Step Build Plan

### Phase 1 — Foundations (1-2 hours)

| Step | Task | Details |
|---|---|---|
| 1.1 | Create Figma file | Name: "Houdy's Design System v1" |
| 1.2 | Set up color styles | Create all 16 colors as Figma local styles with proper naming (`bg/primary`, `fg/muted`, etc.) |
| 1.3 | Set up typography styles | Create all 10 text styles. Import Inter + Alegreya from Google Fonts |
| 1.4 | Define effect styles | Create shadow styles (`shadow/sm`, `shadow/md`, `shadow/lg`, `shadow/glow-green`) |
| 1.5 | Create spacing guide | Layout frame showing the spacing scale with labeled examples |
| 1.6 | Create radius guide | Visual frame showing each border radius on sample rectangles |

### Phase 2 — Atomic Components (2-3 hours)

| Step | Task | Details |
|---|---|---|
| 2.1 | CTA Button | Auto-layout with variants: Primary, Secondary, Disabled, Loading. Use component properties for label text |
| 2.2 | Input Fields | Text input + Textarea. States: Default, Focus (green ring), Filled, Error |
| 2.3 | Choice Card | Auto-layout with emoji, label, description. States: Default, Hover, Selected |
| 2.4 | Logo Card | Borderless image container with selected state (green border + checkmark) |
| 2.5 | Tooltip | Auto-layout with arrow. Variant: Fun fact (with "Fun fact" label) |
| 2.6 | Progress Bar | Fixed width bar with green fill + dot indicator |
| 2.7 | Navigation Bar | Logo + links + CTA. Responsive variant for mobile |

### Phase 3 — Composite Components (2-3 hours)

| Step | Task | Details |
|---|---|---|
| 3.1 | Survey Shell | Frame with nav, progress bar, content slot, border frame |
| 3.2 | Video Placeholder | 9:16 dark gradient card with play icon and labels |
| 3.3 | Logo Select Grid | 4x1 auto-layout using Logo Card instances + tooltip below |
| 3.4 | Choice + Text Step | Choice cards grid + conditional textarea with breadcrumb text |
| 3.5 | Summary Screen | Name/email inputs + answer badges + submit button |
| 3.6 | Pricing Card | Tier name, price, features list, CTA. Highlighted variant |

### Phase 4 — Page Compositions (1-2 hours)

| Step | Task | Details |
|---|---|---|
| 4.1 | Landing Page (Desktop) | Assemble hero, features, pricing, footer using components |
| 4.2 | Landing Page (Mobile) | 375px responsive variant |
| 4.3 | ICP Survey Flow | All 8 screens as separate frames using survey components |
| 4.4 | Sitemap Page | Simple link-list layout |

### Phase 5 — Motion & Interaction Specs (1 hour)

| Step | Task | Details |
|---|---|---|
| 5.1 | Prototype connections | Link survey screens with smart animate transitions |
| 5.2 | Interaction spec sheet | Create a reference frame documenting every micro-interaction with: trigger, animation type, duration, easing, spring values |
| 5.3 | Hover state prototypes | Wire up hover variants for buttons, cards, YouTube text |

### Phase 6 — Dashboard Wireframes (Future session)

| Step | Task | Details |
|---|---|---|
| 6.1 | Dashboard layout | Sidebar + main content area wireframe |
| 6.2 | Dashboard components | Build cards, tables, charts as components |
| 6.3 | Dashboard pages | Compose overview, responses, settings screens |

---

## Figma File Structure

```
Houdy's Design System v1
  Cover (thumbnail + version)
  Foundations
    Colors
    Typography
    Spacing & Layout
    Border Radius
    Shadows
    Motion Specs
  Components
    Atoms (Button, Input, Tooltip, Avatar, Badge)
    Molecules (Choice Card, Logo Card, Nav Bar, Progress Bar)
    Organisms (Survey Shell, Pricing Card, Video Placeholder)
  Pages — Landing
    Desktop (1440px)
    Mobile (375px)
  Pages — Survey
    Screen 0-7 + Summary + Thank You
    Mobile variants
  Pages — Dashboard (wireframes)
  Pages — Sitemap
```
