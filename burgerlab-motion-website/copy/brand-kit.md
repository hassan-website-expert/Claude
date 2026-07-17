# BurgerLab — Brand Kit

Source of truth for all BurgerLab design and media decisions. Read this before editing the site or generating any media.

## Core identity

- **Name:** BurgerLab
- **Flagship burger:** The Lab Burger
- **Positioning:** A dark luxury burger brand built around cinematic presentation, premium ingredients, and experimental flavor combinations.
- **Tone:** confident, bold, premium, visual, modern, direct.
- **Avoid:** childish fast-food styling, cheap red/yellow chain-restaurant design, generic diner visuals, overly playful cartoon UI.

## Brand personality

BurgerLab is a premium burger studio: part restaurant, part product launch, part cinematic food campaign.

The brand communicates:

- premium ingredients
- fire-grilled craft
- bold flavor
- dark cinematic atmosphere
- modern ordering experience
- refined fast-food energy

## Visual direction

Dark mobile-app-inspired reference translated into a premium desktop landing page:

- dark graphite background
- floating burger cards
- subtle circular background shapes
- warm amber accent elements
- elevated product panels
- rounded UI containers
- clean typographic hierarchy
- minimal glass treatment only where useful
- high contrast food imagery

Dominant style is **premium dark food-commerce UI**, not glassmorphism. Subtle translucent panels are allowed; heavy glass is not.

## Color palette (CSS brand tokens)

```css
:root {
  --bg: #10100F;          /* Deep Charcoal */
  --bg-2: #181816;        /* Smoked Graphite */
  --surface: #20201D;     /* Card Black */
  --surface-2: #2A2924;   /* Warm Graphite */
  --surface-soft: rgba(32, 32, 29, 0.76);
  --text: #F8F4EA;        /* Warm Cream */
  --muted: #A9A193;       /* Toasted Gray */
  --accent: #F5B31A;      /* BurgerLab Amber */
  --accent-2: #FF6A2A;    /* Flame Orange */
  --green: #4CD36F;       /* Fresh Herb Green */
  --line: #35332D;        /* Carbon Border */
  --danger: #F04438;      /* Small like/favorite accents only */
}
```

Color rules:

- Amber (`--accent`) is the primary accent: CTAs, active states, small dots, rating stars, section tags, progress indicators.
- Flame Orange (`--accent-2`) is secondary: heat, grill, hover details.
- Fresh Herb Green appears only in tiny food-related accents.
- The design stays mostly dark.
- No large flat yellow backgrounds, no neon gradients, no glossy casino-style UI.

## Typography (Google Fonts)

- **Headings:** Space Grotesk
- **Body:** Inter
- **Labels / prices / counters:** JetBrains Mono (or Space Mono)

```css
:root {
  --font: "Inter", system-ui, sans-serif;
  --font-head: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

Heading font applies to: nav logo, hero title, section titles, impact lines, burger card names, spec values, CTA title, footer brand, preloader words.

Mono font applies to: prices, cooking time, spice level, ratings, ingredient chips, scroll progress indicators, technical labels.

## Product lineup

| Burger | Character | Role |
|---|---|---|
| The Lab Burger | Flagship — the star of the background film | Hero + scroll video |
| Classic Stack | Balanced classic cheeseburger | Catalog |
| Smoky Bacon Lab | Bacon, smoked sauce, double cheese | Catalog |
| Spicy Lab | Jalapeño, spicy sauce, charred patty | Catalog |
| Truffle Melt | Mushroom/truffle-style burger, melted cheese | Catalog |

## Hard constraints (apply to all media and UI)

- No real restaurant logos or real food brand names anywhere.
- No website text baked into images or video — all copy lives in HTML/CSS.
- No people or hands in generated media.
- Burger design must stay visually consistent across hero image, exploded reference, and video.
