export const mean = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
export const min = (values) => values.length ? Math.min(...values) : 0;
export const max = (values) => values.length ? Math.max(...values) : 0;

export function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function histogram(values, binCount = 12) {
  if (!values.length) return [];
  const low = min(values);
  const high = max(values);
  const width = high === low ? 1 : (high - low) / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    start: low + i * width,
    end: i === binCount - 1 ? high : low + (i + 1) * width,
    count: 0,
  }));
  values.forEach((value) => {
    const idx = Math.min(binCount - 1, Math.floor((value - low) / width));
    bins[idx].count += 1;
  });
  return bins;
}

export function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const union = new Set([...setA, ...setB]);
  let shared = 0;
  setA.forEach((value) => {
    if (setB.has(value)) shared += 1;
  });
  return union.size ? shared / union.size : 0;
}

export function pairwise(items, callback) {
  const rows = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) rows.push(callback(items[i], items[j], i, j));
  }
  return rows;
}
