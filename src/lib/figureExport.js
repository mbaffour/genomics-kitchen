// Figure export helpers for publication-ready output.
//
// Given a reference to a rendered inline <svg> element, these functions produce
// either a vector SVG file (preferred for print/paper) or a high-resolution
// raster PNG at >= 2x device pixel ratio (for slides/manuscripts that require
// bitmaps). Colors are resolved from CSS variables at export time so the file
// is self-contained and does not depend on the page stylesheet.
import { downloadTextFile, timestampedFilename } from "./exporters.js";

// Serialize an <svg> node to a standalone SVG document string. CSS custom
// properties (var(--...)) do not resolve inside a detached/exported SVG, so we
// snapshot the computed fill/stroke/color of every element into inline
// attributes before serializing.
export function svgToString(svg) {
  const clone = svg.cloneNode(true);
  inlineComputedStyles(svg, clone);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const source = new XMLSerializer().serializeToString(clone);
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${source}`;
}

// Walk the live tree and the clone in lockstep, copying resolved paint values.
function inlineComputedStyles(liveNode, cloneNode) {
  if (liveNode.nodeType === 1) {
    const computed = window.getComputedStyle(liveNode);
    ["fill", "stroke", "stroke-width", "color", "font-family", "font-size", "font-weight", "opacity"].forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value && value !== "none" && !value.startsWith("var(")) cloneNode.setAttribute(prop, value);
    });
  }
  const liveChildren = liveNode.childNodes;
  const cloneChildren = cloneNode.childNodes;
  for (let i = 0; i < liveChildren.length; i += 1) {
    if (cloneChildren[i]) inlineComputedStyles(liveChildren[i], cloneChildren[i]);
  }
}

export function downloadSVG(svg, baseName) {
  downloadTextFile(timestampedFilename(baseName, "svg"), svgToString(svg), "image/svg+xml");
}

// Rasterize the SVG to PNG at `scale` x its CSS pixel size. Defaults to at least
// 2x the device pixel ratio so figures remain crisp in print and on hi-DPI
// displays. Returns a Promise because image decoding is asynchronous.
export function downloadPNG(svg, baseName, scale) {
  const dpr = typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1;
  const factor = scale || Math.max(2, dpr);
  const viewBox = svg.viewBox && svg.viewBox.baseVal;
  const width = (viewBox && viewBox.width) || svg.clientWidth || 700;
  const height = (viewBox && viewBox.height) || svg.clientHeight || 400;
  const svgString = svgToString(svg);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * factor);
      canvas.height = Math.round(height * factor);
      const ctx = canvas.getContext("2d");
      // Fill an opaque background so the PNG is not transparent when embedded.
      const bg = window.getComputedStyle(document.body).getPropertyValue("--gk-bg") || "#ffffff";
      ctx.fillStyle = bg.trim() || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) { reject(new Error("PNG encoding failed")); return; }
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = timestampedFilename(baseName, "png");
        a.click();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, "image/png");
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG rasterization failed")); };
    image.src = url;
  });
}
