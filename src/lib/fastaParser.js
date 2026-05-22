export function parseFASTA(text = "") {
  const warnings = [];
  const records = [];
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  let current = null;
  const seenIds = new Map();

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    if (!line.trim()) return;
    if (line.startsWith(">")) {
      if (current) finish(current, lineNo - 1);
      const header = line.slice(1).trim();
      const [id = `record_${records.length + 1}`, ...rest] = header.split(/\s+/);
      current = { index: records.length + 1, id, header, description: rest.join(" "), sequenceLines: [], startLine: lineNo, warnings: [] };
      if (seenIds.has(id)) current.warnings.push(`Duplicate ID also seen at record ${seenIds.get(id)}`);
      else seenIds.set(id, current.index);
      return;
    }
    if (!current) {
      warnings.push(`Ignored text before first FASTA header at line ${lineNo}.`);
      return;
    }
    current.sequenceLines.push(line.trim());
  });
  if (current) finish(current, lines.length);
  if (!records.length) warnings.push("No FASTA records were detected.");

  function finish(record, endLine) {
    const sequence = record.sequenceLines.join("");
    const finalRecord = {
      index: record.index,
      id: record.id,
      header: record.header,
      description: record.description,
      sequence,
      rawSequenceLength: sequence.length,
      startLine: record.startLine,
      endLine,
      warnings: [...record.warnings],
    };
    if (!sequence.length) finalRecord.warnings.push("Empty sequence.");
    records.push(finalRecord);
  }
  return { records, warnings: warnings.concat(records.flatMap((r) => r.warnings.map((w) => `${r.id}: ${w}`))) };
}
