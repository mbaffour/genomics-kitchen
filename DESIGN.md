# Genomics Kitchen Design System

Genomics Kitchen is a browser-based sequence preparation suite that uses a light culinary visual metaphor without letting the metaphor dominate the scientific workflow.

## Brand

**Essence:** Scientific rigor served with playful clarity.

**Personality:** Warm, smart, precise, curious, trustworthy, slightly whimsical, premium scientific tool, not childish.

## Goals

1. Make bioinformatics feel approachable.
2. Make complex sequence workflows intuitive.
3. Preserve scientific seriousness.
4. Use playful culinary details sparingly without weakening accuracy or professionalism.
5. Make every output reproducible and publication-aware.
6. Use motion and live art to guide the user, not distract them.

## Visual Language

- Dark molecular bench and clean lab-bench light mode.
- Modern, colorful, professional accents rather than a single green theme.
- Realistic generated photography for hero and tool cards: glass, steel, wood, bead-like sequence models, protein ribbon models, and grounded shadows.
- Familiar lab/workbench objects, subtle cutting-board geometry, clean labels, and export cards as supporting details only.
- Tool imagery must be specific to the biology task: deduplication, quality inspection, multi-file comparison, ORF discovery, or protein-family preparation.

Avoid cartoonish children's-game styling, generic blue dashboards, stock kitchen clipart, excessive gradients, low-contrast neon, fake AI hype, synthetic AI-art clutter, and scientific overclaiming.

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
--gk-sky: #38BDF8;
--gk-coral: #FF8A65;
--gk-citrus: #FACC15;
--gk-berry: #C084FC;
--gk-plum: #818CF8;
--gk-mint: #2DD4BF;
--gk-heat: #FB7185;
```

Palette rule: use the accents as a colorful tool system, not a single green brand wash. Coral is the main action color, sky is the privacy/information color, citrus is the warmth/highlight color, berry/plum provide tool variety, and mint is a supporting biological freshness accent.

Light theme uses `#FFFDF7`, `#F7F4EA`, `#FFFFFF`, `#CBD5E1`, `#172033`, and `#5F6B7A`.

## Typography

UI font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.

Monospace: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace.

## Component Voice

- Upload area: Input File
- Multiple-file upload: Input Files
- Settings: Analysis Settings
- Run button: direct scientific action, such as Deduplicate sequences or Find ORFs
- Progress: Processing Progress
- Results: Results Summary
- Warnings: Scientific Notes & Warnings
- Exports: Export Results
- Methods paragraph: Methods & Reproducibility
- Validation tests: Validation
- Demo data: Sample data

## Accessibility

Use semantic HTML, labels for controls, keyboard navigability, high contrast, reduced-motion support, scrollable tables, and warnings that do not rely on color alone. Animation must never block reading.
