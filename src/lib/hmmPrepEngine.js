import { parseFASTA } from "./fastaParser.js";
import { detectLowComplexityRegions, estimateIsoelectricPointSimple, estimateMolecularWeight, normalizeSequence, simpleHash, validateAlphabet } from "./sequenceUtils.js";
import { exportFASTA, exportTSV } from "./exporters.js";
import { median, percentile } from "./statsUtils.js";
import { generateMethods, generateReport, reproducibilityJSON } from "./reportGenerator.js";

export function runHMMForge(text, settings = {}) {
  const parsed = parseFASTA(text);
  const exactMap = new Map();
  parsed.records.forEach((record) => {
    if (settings.trimTerminalStop && record.sequence.endsWith("*")) record.sequence = record.sequence.slice(0, -1);
    const key = normalizeSequence(record.sequence, { caseSensitive: false, removeWhitespace: true });
    if (!exactMap.has(key)) exactMap.set(key, []);
    exactMap.get(key).push(record);
  });
  const representatives = settings.dedupe === false ? parsed.records : [...exactMap.values()].map((records) => records[0]);
  const lengths = representatives.map((r) => r.sequence.length);
  const med = median(lengths);
  const q1 = percentile(lengths, 0.25);
  const q3 = percentile(lengths, 0.75);
  const iqr = q3 - q1;
  const minLen = Number(settings.minLength || 0);
  const maxLen = Number(settings.maxLength || 1000000);
  const maxX = Number(settings.maxX || 20);
  const maxGaps = Number(settings.maxGaps || 50);
  const classifications = representatives.map((record, i) => classify(record, i, { minLen, maxLen, maxX, maxGaps, med, iqr, settings }));
  const kept = classifications.filter((c) => c.decision === "keep");
  const flagged = classifications.filter((c) => c.decision === "flag");
  const removed = classifications.filter((c) => c.decision === "remove");
  const duplicateRows = [...exactMap.values()].filter((records) => records.length > 1).flatMap((records, i) => records.map((r) => ({ group_id: `dup_${i + 1}`, original_id: r.id, representative_id: records[0].id, count: records.length })));
  const mappingRows = classifications.map((c) => ({ original_index: c.originalIndex, original_id: c.originalId, safe_id: c.safeId, original_header: c.originalHeader, decision: c.decision, reasons: c.reasons.join("; ") }));
  const commands = [
    "mafft --auto cleaned_proteins.faa > aligned_proteins.faa",
    "# Optional after inspecting alignment:",
    "trimal -in aligned_proteins.faa -out aligned_proteins.trimmed.faa -automated1",
    "hmmbuild protein_family.hmm aligned_proteins.faa",
    "hmmpress protein_family.hmm",
    "hmmsearch --tblout hits.tbl protein_family.hmm target_database.faa",
    "# Optional consensus/profile inspection:",
    "hmmemit -c protein_family.hmm > protein_family_consensus.faa",
  ].join("\n");
  const lengthRange = lengths.length ? `${Math.min(...lengths)}-${Math.max(...lengths)}` : "0-0";
  const summary = { inputProteins: parsed.records.length, keptProteins: kept.length, flaggedProteins: flagged.length, removedProteins: removed.length, duplicateGroups: duplicateRows.length ? new Set(duplicateRows.map((r) => r.group_id)).size : 0, medianLength: med, lengthRange };
  const warnings = [
    ...parsed.warnings,
    "HMMForge prepares files; it does not replace biological judgment.",
    "Exact deduplication is not clustering.",
    "Alignment quality should be inspected before hmmbuild.",
    "HMM quality depends on input sequence quality and diversity.",
  ];
  const methods = generateMethods("HMMForge", settings, summary);
  return {
    parsed,
    classifications,
    kept,
    flagged,
    removed,
    duplicateRows,
    mappingRows,
    summary,
    warnings,
    commands,
    exports: {
      cleanedFasta: exportFASTA(kept.map((c) => ({ header: `${c.safeId} original=${c.originalId}`, sequence: c.sequence }))),
      removedFasta: exportFASTA(removed.map((c) => ({ header: `${c.safeId} original=${c.originalId} reasons=${c.reasons.join(",")}`, sequence: c.sequence }))),
      flaggedFasta: exportFASTA(flagged.map((c) => ({ header: `${c.safeId} original=${c.originalId} reasons=${c.reasons.join(",")}`, sequence: c.sequence }))),
      mappingTsv: exportTSV(mappingRows, ["original_index", "original_id", "safe_id", "original_header", "decision", "reasons"]),
      duplicateTsv: exportTSV(duplicateRows, ["group_id", "original_id", "representative_id", "count"]),
      qcTsv: exportTSV(classifications, ["originalIndex", "originalId", "safeId", "length", "percentX", "percentGaps", "hasInternalStop", "hasTerminalStop", "lengthOutlierStatus", "decision"]),
      commands,
      report: generateReport({ toolName: "HMMForge", settings, summary, warnings, methods }),
      json: JSON.stringify(reproducibilityJSON({ toolName: "HMMForge", settings, summary, warnings, classifications }), null, 2),
    },
    methods,
  };
}

function classify(record, i, context) {
  const seq = record.sequence.toUpperCase();
  const percentX = seq.length ? ((seq.match(/X/g) || []).length / seq.length) * 100 : 0;
  const percentGaps = seq.length ? ((seq.match(/[-.]/g) || []).length / seq.length) * 100 : 0;
  const stops = [...seq.matchAll(/\*/g)].map((m) => m.index + 1);
  const hasTerminalStop = seq.endsWith("*");
  const hasInternalStop = stops.some((pos) => pos < seq.length);
  const safeId = `seq_${String(i + 1).padStart(4, "0")}_${simpleHash(record.id).slice(-4)}`;
  const reasons = [];
  const alphabet = validateAlphabet(seq, "Protein");
  if (!alphabet.valid) reasons.push(`invalid characters: ${alphabet.invalidCharacters.join("")}`);
  if (seq.length < context.minLen) reasons.push("below minimum length");
  if (seq.length > context.maxLen) reasons.push("above maximum length");
  if (percentX > context.maxX) reasons.push("high X content");
  if (percentGaps > context.maxGaps) reasons.push("high gap content");
  if (hasInternalStop) reasons.push("internal stop codon");
  const lower = context.med - 1.5 * context.iqr;
  const upper = context.med + 1.5 * context.iqr;
  const lengthOutlierStatus = seq.length < lower || seq.length > upper ? "iqr_outlier" : "typical";
  if (lengthOutlierStatus !== "typical") reasons.push("length outlier");
  let decision = reasons.length ? "flag" : "keep";
  if ((seq.length < context.minLen && context.settings.removeBelowMin) || (seq.length > context.maxLen && context.settings.removeAboveMax) || hasInternalStop) decision = "remove";
  return { originalIndex: record.index, originalId: record.id, safeId, originalHeader: record.header, length: seq.length, percentX: Number(percentX.toFixed(2)), percentGaps: Number(percentGaps.toFixed(2)), hasInternalStop, hasTerminalStop, duplicateOf: "", lengthOutlierStatus, decision, reasons, sequence: seq, molecularWeight: estimateMolecularWeight(seq), approximatePI: estimateIsoelectricPointSimple(seq), lowComplexityRegions: detectLowComplexityRegions(seq).length };
}
