# Genomics Kitchen Design System

Genomics Kitchen is a molecular kitchen where raw sequence ingredients are cleaned, inspected, sifted, compared, translated, and prepared for downstream analysis.

## Brand

**Essence:** Scientific rigor served with playful clarity.

**Personality:** Warm, smart, precise, curious, trustworthy, slightly whimsical, premium scientific tool, not childish.

## Goals

1. Make bioinformatics feel approachable.
2. Make complex sequence workflows intuitive.
3. Preserve scientific seriousness.
4. Use playful kitchen metaphors without weakening accuracy.
5. Make every output reproducible and publication-aware.
6. Use motion and live art to guide the user, not distract them.

## Visual Language

- Dark molecular kitchen countertop and clean lab-bench light mode.
- Glass ingredient jars, cutting boards, recipe cards, sifters, measuring cups, progress oven, and export pantry.
- Subtle DNA steam, protein spices, phage-shaped utensils, and molecular cutting-board grids.

Avoid cartoonish children’s-game styling, generic blue dashboards, stock kitchen clipart, excessive gradients, low-contrast neon, fake AI hype, and scientific overclaiming.

## Tokens

Dark theme:

```css
--gk-bg: #090D14;
--gk-bg-2: #111827;
--gk-countertop: #161B26;
--gk-surface: #1D2433;
--gk-surface-raised: #263143;
--gk-border: #344054;
--gk-text: #F3F7FB;
--gk-text-muted: #AAB6C5;
--gk-mint: #38D9A9;
--gk-citrus: #F9D65C;
--gk-berry: #A78BFA;
--gk-heat: #FB7185;
--gk-sky: #67E8F9;
```

Light theme uses `#FFFDF7`, `#F7F4EA`, `#FFFFFF`, `#D8DEE8`, `#172033`, and `#5F6B7A`.

## Typography

UI font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.

Monospace: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace.

## Component Metaphors

- Upload area: Ingredient Drop
- Multiple-file upload: Ingredient Rack
- Settings: Recipe Controls
- Run button: Start Cooking
- Progress: Cooking Progress
- Results: Tasting Notes
- Warnings: Kitchen Safety Notes
- Exports: Pack to Pantry
- Methods paragraph: Recipe Card
- Validation tests: Taste Tests
- Demo data: Sample Ingredients

## Accessibility

Use semantic HTML, labels for controls, keyboard navigability, high contrast, reduced-motion support, scrollable tables, and warnings that do not rely on color alone. Animation must never block reading.
