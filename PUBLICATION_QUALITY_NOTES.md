# Publication-Quality Review — Genomics Kitchen

Review branch: `claude/publication-quality`

This review targets the components that produce **figures or quantitative
output** and raises them toward a publication-ready standard: colorblind-safe
palettes, axis titles with units, legible fonts, and vector/high-DPI figure
export plus per-table CSV export. All changes are conservative, additive, and
JSX/JS syntax-validated with esbuild. Nothing was run in a browser during this
review — see **Unverified / needs runtime check** below.

## What changed

### 1. Colorblind-safe palette (new `src/lib/palette.js`)
- Added the **Okabe–Ito** qualitative palette (safe for the common forms of
  color-vision deficiency) and a single **viridis mid-tone** fill for
  single-series distributions.
- Rationale: the previous histogram used a `coral → sky` vertical gradient
  (`src/styles/global.css` `.bars span`), which encodes a false second dimension
  via hue and is not colorblind-safe. A single, consistent fill is preferred
  when bar height already encodes magnitude.

### 2. Publication-quality histogram (new `src/components/PubHistogram.jsx`)
- Replaces the CSS `<div class="bars">` blocks in **ReadLens** with an inline
  **SVG** chart that has:
  - Colorblind-safe single fill (viridis mid-tone).
  - **Axis titles with units** and numeric tick labels on both axes.
  - Legible font sizes driven by CSS (`.pf-*` classes in `global.css`).
  - Native `<title>` tooltips per bar (bin range + count).
- **Figure export**: `SVG` (vector) and `PNG (2x)` buttons, plus `CSV` of the
  exact binned values behind the plot.

### 3. Figure export helper (new `src/lib/figureExport.js`)
- `downloadSVG()` serializes the live SVG to a standalone file, inlining
  computed paint values so CSS `var(--...)` colors resolve in the exported file.
- `downloadPNG()` rasterizes to PNG at **≥ 2× device pixel ratio** (crisp for
  print/slides) on an opaque background.

### 4. ReadLens QC figures relabeled with units (`src/tools/ReadLens.jsx`)
- The three histograms now carry explicit, unit-bearing titles/axes:
  - **Sequence length distribution** — x: `Sequence length (bp)` (or `aa` for
    protein), y: `Sequence count`.
  - **GC content distribution** — x: `GC content (%)` — shown only for DNA/RNA.
  - **Mean read quality distribution** — x:
    `Mean Phred quality score (Phred+33)` — shown only for FASTQ.
- GC and quality figures are now gated to the sequence type / format for which
  they are biologically meaningful (protein no longer shows a GC figure; FASTA
  no longer shows an empty quality figure).

### 5. ORFScout genome track: colorblind-safe strands + labels (`src/tools/ORFScout.jsx`, `global.css`)
- Forward/reverse strand colors changed from `coral`/`berry` to Okabe–Ito
  **blue (`#0072B2`) / vermillion (`#D55E00`)**.
- Added a **strand legend** and an explicit axis note
  (`Position along sequence (bp), 1-based inclusive`).

### 6. Per-table CSV export for every quantitative panel (`src/components/DataTable.jsx`)
- `DataTable` now renders a **Download CSV** button (full row set, not just the
  on-screen preview) plus an optional descriptive caption.
- Wired captions + CSV filenames into all quantitative tables:
  - **ReadLens** — per-sequence QC metrics, duplicate groups.
  - **ORFScout** — predicted ORFs.
  - **SeqCompare** — pairwise comparison, global sequence keys.
  - **HMMForge** — per-protein classifications.
  - **SeqSieve** — duplicate groups, mapping table, counts.
- This complements the existing TSV/JSON exports in `ExportPantry` (which were
  already present) by giving each visible table a one-click, spreadsheet-ready
  CSV with the same numbers shown on screen.

## Files touched
- Added: `src/lib/palette.js`, `src/lib/figureExport.js`,
  `src/components/PubHistogram.jsx`
- Modified: `src/components/DataTable.jsx`, `src/tools/ReadLens.jsx`,
  `src/tools/ORFScout.jsx`, `src/tools/SeqCompare.jsx`,
  `src/tools/HMMForge.jsx`, `src/tools/SeqSieve.jsx`, `src/styles/global.css`

## Unverified / needs runtime check
No `npm install`, build, or browser run was performed in this environment.
All JSX/JS files were syntax-validated with esbuild's transform API, but the
following should be confirmed in a running dev server before merge:
- SVG figures render with correct layout at the current `.chart-grid` column
  width, and axis titles are not clipped.
- `downloadSVG` / `downloadPNG` produce correct files across browsers. The
  computed-style inlining and the `--gk-bg` background fill are the main
  runtime-dependent paths; PNG generation is async (returns a Promise).
- Exported SVG colors resolve correctly in light vs dark theme (colors are
  snapshotted at export time from computed styles).
- The `DataTable` CSV button and per-figure CSV produce well-formed files.

## Prioritized recommendations (future work)

### High value, still figure/output-focused
1. **Base-position quality plot for FASTQ.** The single most impactful QC figure
   (à la FastQC) is a per-cycle box/line plot of quality across read position.
   ReadLens currently summarizes only per-read *mean* quality. This needs the
   per-position quality arrays to be retained in `qcEngine.js`.
2. **Consistent figure export across tools.** ORFScout's genome track and
   SeqCompare's core/accessory panel are still CSS/HTML, not SVG, so they cannot
   be exported as vector figures. Migrating them to the same `PubHistogram`-style
   SVG approach would make every visual paper-ready.
3. **Report the bin width / method on each figure caption** (e.g. `n = …,
   bin width = …`) so a figure is self-describing when lifted into a manuscript.

### Correctness / performance (carried over from the earlier audit — noted, not fixed here)
4. **Parsing runs on the main thread.** Large FASTA/FASTQ files will block the
   UI. Move parsing/QC into a Web Worker so the page stays responsive; this does
   not change output but is important for real-world file sizes.
5. **32-bit dedup hash.** `simpleHash` (used for duplicate `key_hash`) is a
   32-bit hash and is collision-prone on large inputs. Dedup grouping itself is
   done on the full normalized sequence string (so grouping is correct), but the
   *reported* `key_hash` column can collide. Consider a 64-bit or cryptographic
   hash if the hash is ever used as an identity key downstream.

_These items are recommendations only and were intentionally left unchanged to
keep this review low-risk and focused on publication-quality output._
