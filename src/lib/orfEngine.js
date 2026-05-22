import { parseFASTA } from "./fastaParser.js";
import { findORFs, sixFrameTranslation, validateAlphabet } from "./sequenceUtils.js";
import { exportFASTA, exportTSV } from "./exporters.js";
import { mean } from "./statsUtils.js";
import { generateMethods, generateReport, reproducibilityJSON } from "./reportGenerator.js";

export function runORFScout(text, settings = {}) {
  const parsed = parseFASTA(text);
  const allOrfs = [];
  const translations = [];
  parsed.records.forEach((record) => {
    const valid = validateAlphabet(record.sequence, "DNA");
    if (!valid.valid) record.warnings.push(`Invalid nucleotide characters: ${valid.invalidCharacters.join("")}`);
    const orfs = findORFs(record.sequence, {
      minNt: Number(settings.minNt || 90),
      startCodons: settings.startCodons || ["ATG"],
      stopCodons: settings.stopCodons || ["TAA", "TAG", "TGA"],
      mode: settings.mode || "start-stop",
      strand: settings.strand || "both",
      includePartial: settings.includePartial,
      geneticCode: settings.geneticCode || "standard",
    }).map((orf, i) => ({ ...orf, recordId: record.id, orfId: `${record.id}_orf_${i + 1}` }));
    allOrfs.push(...orfs);
    sixFrameTranslation(record.sequence, settings.geneticCode).forEach((frame) => translations.push({ id: `${record.id}_frame_${frame.frame}`, header: `${record.id} strand=${frame.strand} frame=${frame.frame}`, sequence: frame.protein }));
  });
  const summary = {
    inputSequences: parsed.records.length,
    totalLength: parsed.records.reduce((sum, r) => sum + r.sequence.length, 0),
    orfsFound: allOrfs.length,
    longestOrf: Math.max(0, ...allOrfs.map((o) => o.lengthNt)),
    meanOrfLength: mean(allOrfs.map((o) => o.lengthNt)),
    forwardOrfs: allOrfs.filter((o) => o.strand === "+").length,
    reverseOrfs: allOrfs.filter((o) => o.strand === "-").length,
  };
  const warnings = [
    ...parsed.warnings,
    ...parsed.records.flatMap((r) => r.warnings.map((w) => `${r.id}: ${w}`)),
    "ORF prediction is not gene annotation.",
    "Short ORFs can occur by chance.",
    "Functional annotation requires homology, domains, synteny, expression, or experimental evidence.",
  ];
  const tableRows = allOrfs.map((o) => ({ orf_id: o.orfId, record_id: o.recordId, strand: o.strand, frame: o.frame, start: o.start, end: o.end, length_nt: o.lengthNt, length_aa: o.lengthAa, start_codon: o.startCodon, stop_codon: o.stopCodon, partial_start: o.partialStart, partial_stop: o.partialStop }));
  const methods = generateMethods("ORFScout", settings, summary);
  return {
    parsed,
    orfs: allOrfs,
    translations,
    summary,
    warnings,
    exports: {
      nucleotideFasta: exportFASTA(allOrfs.map((o) => ({ header: `${o.orfId} record=${o.recordId} strand=${o.strand} start=${o.start} end=${o.end}`, sequence: o.nucleotideSequence }))),
      proteinFasta: exportFASTA(allOrfs.map((o) => ({ header: `${o.orfId} record=${o.recordId} strand=${o.strand} start=${o.start} end=${o.end}`, sequence: o.proteinSequence }))),
      translationFasta: exportFASTA(translations),
      tableTsv: exportTSV(tableRows, ["orf_id", "record_id", "strand", "frame", "start", "end", "length_nt", "length_aa", "start_codon", "stop_codon", "partial_start", "partial_stop"]),
      report: generateReport({ toolName: "ORFScout", settings, summary, warnings, methods }),
      json: JSON.stringify(reproducibilityJSON({ toolName: "ORFScout", settings, summary, warnings, orfs: tableRows }), null, 2),
    },
    methods,
  };
}
