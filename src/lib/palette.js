// Colorblind-safe palettes for publication-quality figures.
//
// The Okabe-Ito qualitative palette is designed to be distinguishable for the
// most common forms of color-vision deficiency (protanopia, deuteranopia,
// tritanopia). Reference: Okabe & Ito (2008), "Color Universal Design".
// Use these for categorical data (e.g. forward/reverse strand, per-file series).
export const OKABE_ITO = {
  black: "#000000",
  orange: "#E69F00",
  skyBlue: "#56B4E9",
  bluishGreen: "#009E73",
  yellow: "#F0E442",
  blue: "#0072B2",
  vermillion: "#D55E00",
  reddishPurple: "#CC79A7",
};

// Ordered list for cycling through categorical series (black dropped so series
// stay visible on dark backgrounds; it is available above if needed).
export const OKABE_ITO_SEQUENCE = [
  OKABE_ITO.blue,
  OKABE_ITO.vermillion,
  OKABE_ITO.bluishGreen,
  OKABE_ITO.orange,
  OKABE_ITO.skyBlue,
  OKABE_ITO.reddishPurple,
  OKABE_ITO.yellow,
];

// Perceptually-uniform, colorblind-friendly single-hue fills for histograms and
// bars (approximating the viridis colormap). A single, consistent fill is
// preferred over a rainbow gradient for a single-series distribution because
// the bar height already encodes magnitude; hue should not add a false second
// dimension.
export const VIRIDIS_FILL = "#21908C"; // viridis mid-tone (teal), safe on dark + light
export const VIRIDIS_FILL_MUTED = "#3B7D8A";

// Pick a categorical color by index, cycling through the Okabe-Ito sequence.
export function categoricalColor(index) {
  return OKABE_ITO_SEQUENCE[index % OKABE_ITO_SEQUENCE.length];
}
