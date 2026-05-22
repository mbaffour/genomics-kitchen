export function parseFASTQ(text = "") {
  const warnings = [];
  const records = [];
  const lines = String(text).replace(/\r\n/g, "\n").split("\n").filter((line, i, arr) => !(i === arr.length - 1 && line === ""));
  for (let i = 0; i < lines.length; i += 4) {
    const startLine = i + 1;
    const headerLine = lines[i] || "";
    const sequence = lines[i + 1] || "";
    const plusLine = lines[i + 2] || "";
    const quality = lines[i + 3] || "";
    const recordWarnings = [];
    if (!headerLine.startsWith("@")) recordWarnings.push(`Expected @ FASTQ header at line ${startLine}.`);
    if (!plusLine.startsWith("+")) recordWarnings.push(`Expected + line at line ${startLine + 2}.`);
    if (sequence.length !== quality.length) recordWarnings.push(`Sequence length (${sequence.length}) does not match quality length (${quality.length}).`);
    if (i + 3 >= lines.length) recordWarnings.push("Incomplete FASTQ record.");
    const header = headerLine.startsWith("@") ? headerLine.slice(1).trim() : headerLine.trim();
    const [id = `read_${records.length + 1}`] = header.split(/\s+/);
    const meanQuality = quality.length ? [...quality].reduce((sum, ch) => sum + ch.charCodeAt(0) - 33, 0) / quality.length : 0;
    records.push({ index: records.length + 1, id, header, sequence, plusLine, quality, meanQuality, startLine, endLine: startLine + 3, warnings: recordWarnings });
    warnings.push(...recordWarnings.map((w) => `${id}: ${w}`));
  }
  if (!records.length) warnings.push("No FASTQ records were detected.");
  return { records, warnings };
}
