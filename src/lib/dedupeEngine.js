import { parseFASTA } from "./fastaParser.js";
import { parseFASTQ } from "./fastqParser.js";
import { canonicalizeForReverseComplement, detectSequenceType, normalizeSequence, simpleHash } from "./sequenceUtils.js";
import { exportFASTA, exportFASTQ, exportTSV } from "./exporters.js";
import { generateMethods, generateReport, reproducibilityJSON } from "./reportGenerator.js";

export function runDedupe(text, settings = {}) {
  const format = settings.format === "FASTQ" || (settings.format === "Auto" && /^@/.test(text.trim())) ? "FASTQ" : "FASTA";
  const parsed = format === "FASTQ" ? parseFASTQ(text) : parseFASTA(text);
  const sequenceType = settings.sequenceType === "Auto" || !settings.sequenceType ? detectSequenceType(parsed.records) : settings.sequenceType;
  const mode = settings.dedupeMode || "sequence";
  const groups = new Map();
  parsed.records.forEach((record) => {
    const normalized = normalizeSequence(record.sequence, settings);
    let key = normalized;
    let orientation = "forward";
    if (mode === "id") key = record.id;
    if (mode === "record") key = `${record.id}|${normalized}`;
    if (mode === "sequence" && settings.reverseComplement && ["DNA", "RNA"].includes(sequenceType)) {
      const canonical = canonicalizeForReverseComplement(normalized, sequenceType);
      key = canonical.key;
      orientation = canonical.orientation;
    }
    if (!groups.has(key)) groups.set(key, { key, keyHash: simpleHash(key), records: [] });
    groups.get(key).records.push({ record, orientation });
  });

  const duplicateGroups = [...groups.values()].map((group, index) => {
    const representative = chooseRepresentative(group.records.map((r) => r.record), settings);
    const representativeId = settings.representativeRule === "rename" ? `${settings.renamePrefix || "rep_"}${index + 1}` : representative.id;
    return {
      groupId: `group_${index + 1}`,
      key: group.key,
      keyHash: group.keyHash,
      representativeRecord: representative,
      representativeId,
      representativeHeader: settings.representativeRule === "rename" ? `${representativeId} ${representative.header}` : representative.header,
      representativeSequence: representative.sequence,
      representativeQuality: representative.quality,
      count: group.records.length,
      normalizedLength: group.key.length,
      members: group.records.map(({ record, orientation }) => ({
        originalIndex: record.index,
        originalId: record.id,
        originalHeader: record.header,
        sequenceLength: record.sequence.length,
        matchOrientation: orientation,
        isRepresentative: record.index === representative.index,
        meanQuality: record.meanQuality ?? "",
      })),
    };
  });
  const representatives = duplicateGroups.map((g) => ({ ...g.representativeRecord, id: g.representativeId, header: g.representativeHeader }));
  const mappingRows = duplicateGroups.flatMap((group) => group.members.map((member) => ({
    original_index: member.originalIndex,
    original_id: member.originalId,
    original_header: member.originalHeader,
    representative_id: group.representativeId,
    representative_header: group.representativeHeader,
    group_id: group.groupId,
    sequence_length: member.sequenceLength,
    match_orientation: member.matchOrientation,
    is_representative: member.isRepresentative,
    dedupe_key_hash: group.keyHash,
    count_for_representative: group.count,
    mean_quality: member.meanQuality,
  })));
  const countRows = duplicateGroups.map((g) => ({ representative_id: g.representativeId, representative_header: g.representativeHeader, count: g.count, group_id: g.groupId, dedupe_key_hash: g.keyHash }));
  const summary = {
    inputRecords: parsed.records.length,
    uniqueRepresentatives: duplicateGroups.length,
    duplicateRecordsCollapsed: parsed.records.length - duplicateGroups.length,
    percentRedundancy: parsed.records.length ? ((parsed.records.length - duplicateGroups.length) / parsed.records.length) * 100 : 0,
    largestDuplicateGroup: Math.max(0, ...duplicateGroups.map((g) => g.count)),
    sequenceType,
    format,
    warnings: parsed.warnings.length,
  };
  const warnings = [
    ...parsed.warnings,
    "Sifting removes exact duplicates, not related but non-identical sequences.",
    ...(format === "FASTQ" ? ["For FASTQ, deduplication can change apparent read abundance. Keep count tables."] : []),
    ...(settings.reverseComplement ? ["Reverse-complement-aware sifting is only appropriate for nucleotide sequences."] : []),
  ];
  const methods = generateMethods("SeqSieve", settings, summary);
  return {
    format,
    sequenceType,
    records: parsed.records,
    duplicateGroups,
    representatives,
    mappingRows,
    countRows,
    summary,
    warnings,
    exports: {
      fasta: exportFASTA(representatives, { wrap: settings.wrap || 80 }),
      fastq: format === "FASTQ" ? exportFASTQ(representatives) : "",
      mappingTsv: exportTSV(mappingRows, Object.keys(mappingRows[0] || { original_index: "" })),
      groupsTsv: exportTSV(duplicateGroups.map((g) => ({ group_id: g.groupId, representative_id: g.representativeId, count: g.count, key_hash: g.keyHash })), ["group_id", "representative_id", "count", "key_hash"]),
      countsTsv: exportTSV(countRows, ["representative_id", "representative_header", "count", "group_id", "dedupe_key_hash"]),
      report: generateReport({ toolName: "SeqSieve", settings, summary, warnings, methods }),
      json: JSON.stringify(reproducibilityJSON({ toolName: "SeqSieve", settings, summary, warnings, duplicateGroups }), null, 2),
    },
    methods,
  };
}

function chooseRepresentative(records, settings) {
  const rule = settings.representativeRule || "first";
  if (rule === "longest_sequence") return [...records].sort((a, b) => b.sequence.length - a.sequence.length)[0];
  if (rule === "longest_header") return [...records].sort((a, b) => b.header.length - a.header.length)[0];
  if (rule === "highest_mean_quality") return [...records].sort((a, b) => (b.meanQuality || 0) - (a.meanQuality || 0))[0];
  return records[0];
}
