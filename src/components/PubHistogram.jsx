import { useRef } from "react";
import { VIRIDIS_FILL } from "../lib/palette.js";
import { downloadSVG, downloadPNG } from "../lib/figureExport.js";
import { downloadTextFile, timestampedFilename, exportCSV } from "../lib/exporters.js";

// Publication-quality histogram rendered as an inline SVG.
//
// bins:   array of { start, end, count } (as produced by statsUtils.histogram)
// title:  figure title (shown above the plot)
// xLabel: x-axis title, MUST include units, e.g. "Read length (bp)"
// yLabel: y-axis title, e.g. "Read count"
//
// Design choices for publication readiness:
//  - Single colorblind-safe fill (viridis mid-tone) instead of a rainbow
//    gradient: bar height already encodes magnitude, so hue must not imply a
//    false second variable.
//  - Explicit axis titles with units, numeric tick labels, and legible fonts.
//  - Vector (SVG) and >=2x raster (PNG) export so a figure can go into a paper,
//    plus CSV export of the exact binned values behind the plot.
export default function PubHistogram({ bins = [], title, xLabel, yLabel = "Read count", baseName = "figure" }) {
  const svgRef = useRef(null);
  if (!bins.length) return null;

  // Layout in SVG user units (1 unit == 1 px at 1x).
  const W = 560;
  const H = 320;
  const margin = { top: 16, right: 18, bottom: 62, left: 68 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const maxCount = Math.max(1, ...bins.map((b) => b.count));
  const yTickCount = 4;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round((maxCount / yTickCount) * i));
  const barGap = 2;
  const barW = plotW / bins.length;

  const fmt = (v) => (Math.abs(v) >= 1000 ? v.toFixed(0) : Number(v.toFixed(Math.abs(v) < 10 ? 1 : 0)));

  function exportCsv() {
    const rows = bins.map((b) => ({ bin_start: b.start, bin_end: b.end, count: b.count }));
    downloadTextFile(timestampedFilename(baseName, "csv"), exportCSV(rows, ["bin_start", "bin_end", "count"]), "text/csv");
  }

  return (
    <figure className="pub-figure">
      <svg ref={svgRef} className="pub-histogram" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`${title || "Histogram"}: ${xLabel} versus ${yLabel}`}>
        {title && <text x={margin.left} y={12} className="pf-title">{title}</text>}
        {/* Y gridlines + tick labels */}
        {yTicks.map((t) => {
          const y = margin.top + plotH - (t / maxCount) * plotH;
          return (
            <g key={t}>
              <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} className="pf-grid" />
              <text x={margin.left - 8} y={y + 4} className="pf-tick pf-tick-y">{t}</text>
            </g>
          );
        })}
        {/* Bars */}
        {bins.map((b, i) => {
          const h = (b.count / maxCount) * plotH;
          const x = margin.left + i * barW;
          const y = margin.top + plotH - h;
          return (
            <rect key={i} x={x + barGap / 2} y={y} width={Math.max(1, barW - barGap)} height={h}
              className="pf-bar" fill={VIRIDIS_FILL}>
              <title>{`${fmt(b.start)}–${fmt(b.end)}: ${b.count}`}</title>
            </rect>
          );
        })}
        {/* Axes */}
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} className="pf-axis" />
        <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} className="pf-axis" />
        {/* X tick labels: first, middle, last bin edges */}
        {[0, Math.floor(bins.length / 2), bins.length - 1].map((i) => {
          const b = bins[i];
          const x = margin.left + i * barW + barW / 2;
          return <text key={i} x={x} y={margin.top + plotH + 18} className="pf-tick pf-tick-x">{fmt(b.start)}</text>;
        })}
        {/* Axis titles (with units) */}
        <text x={margin.left + plotW / 2} y={H - 12} className="pf-axis-title">{xLabel}</text>
        <text x={16} y={margin.top + plotH / 2} className="pf-axis-title"
          transform={`rotate(-90 16 ${margin.top + plotH / 2})`}>{yLabel}</text>
      </svg>
      <div className="pf-actions">
        <button type="button" className="button ghost" onClick={() => downloadSVG(svgRef.current, baseName)}>SVG</button>
        <button type="button" className="button ghost" onClick={() => downloadPNG(svgRef.current, baseName)}>PNG (2x)</button>
        <button type="button" className="button ghost" onClick={exportCsv}>CSV</button>
      </div>
    </figure>
  );
}
