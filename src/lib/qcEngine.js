import { parseFASTA } from "./fastaParser.js";
import { parseFASTQ } from "./fastqParser.js";
import { calculateGC, calculateLengthStats, calculateNContent, detectSequenceType, normalizeSequence, simpleHash, validateAlphabet } from "./sequenceUtils.js";
import { exportTSV } from "./exporters.js";
import { histogram, mean } from "./statsUtils.js";
import { generateMethods, generateReport, reproducibilityJSON } from "./reportGenerator.js";

export function runQC(text, settings = {}) {
  const format = settings.format === "FASTQ" || (settings.format === "Auto" && /^@/.test(text.trim())) ? "FASTQ" : "FASTA";
  const parsed = format === "FASTQ" ? parseFASTQ(text) : parseFASTA(text);
  const sequenceType = settings.sequenceType === "Auto" || !settings.sequenceType ? detectSequenceType(parsed.records) : settings.sequenceType;
  const lengths = parsed.records.map((r) => r.sequence.length);
  const lengthStats = calculateLengthStats(lengths);
  const duplicates = duplicateRows(parsed.records, settings);
  const duplicateIds = duplicateIdRows(parsed.records);
  const invalidRows = parsed.records.map((r) => {
    const v = validateAlphabet(r.sequence, sequenceType);
    return { id: r.id, invalid_count: v.invalidCount, invalid_characters: v.invalidCharacters.join("") };
  }).filter((r) => r.invalid_count);
  const recordMetrics = parsed.records.map((r) => ({
    index: r.index,
    id: r.id,
    length: r.sequence.length,
    gc_percent: ["DNA", "RNA"].includes(sequenceType) ? calculateGC(r.sequence).toFixed(2) : "",
    n_percent: ["DNA", "RNA"].includes(sequenceType) ? calculateNContent(r.sequence).toFixed(2) : "",
    mean_quality: r.meanQuality?.toFixed(2) || "",
    warnings: r.warnings.join("; "),
  }));
  const fastqQualities = format === "FASTQ" ? parsed.records.map((r) => r.meanQuality) : [];
  const warnings = [
    ...parsed.warnings,
    "QC flags guide review; they are not automatic pass/fail judgments.",
    ...(format === "FASTQ" ? ["FASTQ quality is interpreted as Phred+33.", "Duplicate reads are not automatically bad."] : []),
    ...(sequenceType === "Protein" ? ["Protein files should not show GC/N as biological metrics."] : []),
  ];
  const summary = {
    records: parsed.records.length,
    totalLetters: lengths.reduce((a, b) => a + b, 0),
    ...lengthStats,
    sequenceType,
    format,
    gcPercent: ["DNA", "RNA"].includes(sequenceType) ? mean(parsed.records.map((r) => calculateGC(r.sequence))) : null,
    nPercent: ["DNA", "RNA"].includes(sequenceType) ? mean(parsed.records.map((r) => calculateNContent(r.sequence))) : null,
    duplicateIds: duplicateIds.length,
    exactDuplicateSequences: duplicates.length,
    overallMeanQuality: fastqQualities.length ? mean(fastqQualities) : null,
    lowQualityReads: fastqQualities.filter((q) => q < Number(settings.lowQualityThreshold || 20)).length,
    warnings: warnings.length,
  };
  const methods = generateMethods("ReadLens", settings, summary);
  return {
    parsed,
    format,
    sequenceType,
    summary,
    warnings,
    recordMetrics,
    duplicates,
    duplicateIds,
    invalidRows,
    charts: {
      lengthHistogram: histogram(lengths, 12),
      gcHistogram: histogram(parsed.records.map((r) => calculateGC(r.sequence)), 12),
      qualityHistogram: histogram(fastqQualities, 12),
    },
    exports: {
      metricsTsv: exportTSV(recordMetrics, ["index", "id", "length", "gc_percent", "n_percent", "mean_quality", "warnings"]),
      duplicateTsv: exportTSV(duplicates, ["key_hash", "count", "ids"]),
      warningsTsv: exportTSV(warnings.map((warning, i) => ({ index: i + 1, warning })), ["index", "warning"]),
      report: generateReport({ toolName: "ReadLens", settings, summary, warnings, methods }),
      json: JSON.stringify(reproducibilityJSON({ toolName: "ReadLens", settings, summary, warnings, recordMetrics }), null, 2),
    },
    methods,
  };
}

function duplicateRows(records, settings) {
  const map = new Map();
  records.forEach((r) => {
    const key = normalizeSequence(r.sequence, settings);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r.id);
  });
  return [...map.entries()].filter(([, ids]) => ids.length > 1).map(([key, ids]) => ({ key_hash: simpleHash(key), count: ids.length, ids: ids.join(", ") }));
}

function duplicateIdRows(records) {
  const map = new Map();
  records.forEach((r) => map.set(r.id, (map.get(r.id) || 0) + 1));
  return [...map.entries()].filter(([, count]) => count > 1).map(([id, count]) => ({ id, count }));
}
