export function wrapSequence(sequence, width = 80) {
  if (!width || width === "none") return sequence;
  const size = Number(width);
  return String(sequence || "").match(new RegExp(`.{1,${size}}`, "g"))?.join("\n") || "";
}

export function exportFASTA(records, options = {}) {
  return records.map((record) => `>${record.header || record.id}\n${wrapSequence(record.sequence || record.representativeSequence || record.proteinSequence || "", options.wrap || 80)}`).join("\n");
}

export function exportFASTQ(records) {
  return records.map((r) => `@${r.header || r.id}\n${r.sequence}\n${r.plusLine || "+"}\n${r.quality || ""}`).join("\n");
}

export function exportTSV(rows, columns) {
  const escape = (v) => String(v ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
  return [columns.join("\t"), ...rows.map((row) => columns.map((col) => escape(row[col])).join("\t"))].join("\n");
}

export function exportCSV(rows, columns) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [columns.map(esc).join(","), ...rows.map((row) => columns.map((col) => esc(row[col])).join(","))].join("\n");
}

export const exportJSON = (object) => JSON.stringify(object, null, 2);
export const exportTextReport = (text) => String(text || "");

export function sanitizeFilename(filename = "genomics-kitchen") {
  return filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-|-$/g, "");
}

export function timestampedFilename(base, extension) {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
  return `${sanitizeFilename(base)}_${stamp}.${extension.replace(/^\./, "")}`;
}

export function downloadTextFile(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
