export const readFileAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsText(file);
});

export function detectFormatFromExtension(name = "") {
  const lower = name.toLowerCase();
  if (/\.(fastq|fq)(\.gz)?$/.test(lower)) return "FASTQ";
  if (/\.(fasta|fa|faa|fna|ffn|fas)(\.gz)?$/.test(lower)) return "FASTA";
  return "Auto";
}

export function formatFileSize(bytes = 0) {
  if (bytes > 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function safePreviewText(text = "", limit = 1200) {
  return String(text).slice(0, limit) + (String(text).length > limit ? "\n..." : "");
}

export function largeFileWarnings(file) {
  if (!file) return [];
  if (file.size > 250 * 1024 * 1024) return ["Strong warning: this file is above 250 MB and may strain browser memory."];
  if (file.size > 50 * 1024 * 1024) return ["Large file warning: this file is above 50 MB. Exports are still local, but processing may take time."];
  return [];
}
