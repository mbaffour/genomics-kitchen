import { parseFASTA } from "./fastaParser.js";
import { canonicalizeForReverseComplement, detectSequenceType, normalizeSequence, simpleHash } from "./sequenceUtils.js";
import { exportFASTA, exportTSV } from "./exporters.js";
import { jaccard } from "./statsUtils.js";
import { generateMethods, generateReport, reproducibilityJSON } from "./reportGenerator.js";

export function compareFastaTexts(inputs, settings = {}) {
  const parsedFiles = inputs.map((input, i) => {
    const parsed = parseFASTA(input.text);
    return { fileId: `file_${i + 1}`, fileName: input.name, displayLabel: input.label || input.name, records: parsed.records, warnings: parsed.warnings };
  });
  const sequenceType = settings.sequenceType === "Auto" || !settings.sequenceType ? detectSequenceType(parsedFiles.flatMap((f) => f.records)) : settings.sequenceType;
  const fileKeyMaps = buildFileKeyMaps(parsedFiles, { ...settings, sequenceType });
  const globalKeys = buildGlobalPresenceMatrix(fileKeyMaps, settings);
  const classified = classifyCoreAccessorySpecific(globalKeys, parsedFiles);
  const pairwise = calculatePairwiseOverlap(parsedFiles, globalKeys);
  const mostSimilar = [...pairwise].sort((a, b) => b.jaccard - a.jaccard)[0];
  const leastSimilar = [...pairwise].sort((a, b) => a.jaccard - b.jaccard)[0];
  const summary = {
    files: parsedFiles.length,
    totalRecords: parsedFiles.reduce((sum, f) => sum + f.records.length, 0),
    totalUniqueKeys: globalKeys.length,
    coreKeys: classified.core.length,
    accessoryKeys: classified.accessory.length,
    fileSpecificKeys: classified.fileSpecific.length,
    largestFile: parsedFiles.reduce((best, f) => f.records.length > (best.records?.length || -1) ? f : best, {}).displayLabel,
    mostSimilarPair: mostSimilar ? `${mostSimilar.fileA} / ${mostSimilar.fileB}` : "",
    leastSimilarPair: leastSimilar ? `${leastSimilar.fileA} / ${leastSimilar.fileB}` : "",
    warnings: parsedFiles.reduce((sum, f) => sum + f.warnings.length, 0),
  };
  const warnings = [
    ...parsedFiles.flatMap((f) => f.warnings.map((w) => `${f.displayLabel}: ${w}`)),
    "Exact multi-file overlap is not proof of homology.",
    "Similar but non-identical sequences require alignment or clustering tools.",
    ...(settings.reverseComplement ? ["Reverse-complement-aware comparison is for nucleotide sequences only."] : []),
    ...(settings.compareBy === "id" ? ["Header formats may affect ID-based comparison across pipelines."] : []),
  ];
  const methods = generateMethods("SeqCompare", settings, summary);
  const matrixRows = globalKeys.map((g) => ({
    key_id: g.globalKeyId,
    representative_id: g.representativeId,
    representative_length: g.representativeLength,
    presence_count: g.presentInFiles.length,
    file_membership_pattern: g.membershipPattern,
    ...Object.fromEntries(parsedFiles.map((f) => [f.displayLabel, g.presentInFiles.includes(f.fileId) ? 1 : 0])),
    ...Object.fromEntries(parsedFiles.map((f) => [`count_in_${f.displayLabel}`, g.countsByFile[f.fileId] || 0])),
  }));
  return {
    parsedFiles,
    sequenceType,
    globalKeys,
    ...classified,
    pairwise,
    summary,
    warnings,
    exports: {
      coreFasta: exportFASTA(classified.core.map(exportRecord)),
      accessoryFasta: exportFASTA(classified.accessory.map(exportRecord)),
      fileSpecificFasta: exportFASTA(classified.fileSpecific.map(exportRecord)),
      presenceTsv: exportTSV(matrixRows, Object.keys(matrixRows[0] || { key_id: "" })),
      pairwiseTsv: exportTSV(pairwise, ["fileA", "fileB", "keysA", "keysB", "sharedKeys", "onlyA", "onlyB", "jaccard", "percentAInB", "percentBInA"]),
      summaryReport: generateReport({ toolName: "SeqCompare", settings, summary, warnings, methods }),
      json: JSON.stringify(reproducibilityJSON({ toolName: "SeqCompare", settings, summary, warnings, globalKeys }), null, 2),
    },
    methods,
  };
}

export function buildFileKeyMaps(parsedFiles, options) {
  return parsedFiles.map((file) => {
    const keyToRecordsMap = new Map();
    file.records.forEach((record) => {
      let key = options.compareBy === "id" ? record.id : options.compareBy === "record" ? `${record.id}|${normalizeSequence(record.sequence, options)}` : normalizeSequence(record.sequence, options);
      if (options.compareBy !== "id" && options.reverseComplement && ["DNA", "RNA"].includes(options.sequenceType)) key = canonicalizeForReverseComplement(key, options.sequenceType).key;
      if (!keyToRecordsMap.has(key)) keyToRecordsMap.set(key, []);
      keyToRecordsMap.get(key).push(record);
    });
    return { ...file, keyToRecordsMap };
  });
}

export function buildGlobalPresenceMatrix(fileKeyMaps) {
  const global = new Map();
  fileKeyMaps.forEach((file) => {
    file.keyToRecordsMap.forEach((records, key) => {
      if (!global.has(key)) {
        const rep = records[0];
        global.set(key, {
          globalKeyId: simpleHash(key),
          key,
          keyHash: simpleHash(key),
          representativeRecord: rep,
          representativeFileId: file.fileId,
          representativeId: rep.id,
          representativeHeader: rep.header,
          representativeSequence: rep.sequence,
          representativeLength: rep.sequence.length,
          presentInFiles: [],
          countsByFile: {},
          idsByFile: {},
          headersByFile: {},
        });
      }
      const item = global.get(key);
      item.presentInFiles.push(file.fileId);
      item.countsByFile[file.fileId] = records.length;
      item.idsByFile[file.fileId] = records.map((r) => r.id);
      item.headersByFile[file.fileId] = records.map((r) => r.header);
    });
  });
  const fileIds = fileKeyMaps.map((f) => f.fileId);
  return [...global.values()].map((g) => ({ ...g, absentFromFiles: fileIds.filter((id) => !g.presentInFiles.includes(id)), membershipPattern: fileIds.map((id) => g.presentInFiles.includes(id) ? "1" : "0").join("") }));
}

export function classifyCoreAccessorySpecific(globalKeys, files) {
  return {
    core: globalKeys.filter((g) => g.presentInFiles.length === files.length),
    accessory: globalKeys.filter((g) => g.presentInFiles.length > 1 && g.presentInFiles.length < files.length),
    fileSpecific: globalKeys.filter((g) => g.presentInFiles.length === 1),
    subsetGroups: Object.values(globalKeys.reduce((acc, g) => {
      acc[g.membershipPattern] ||= { pattern: g.membershipPattern, keys: [] };
      acc[g.membershipPattern].keys.push(g);
      return acc;
    }, {})),
  };
}

export function calculatePairwiseOverlap(files, globalKeys) {
  const byFile = Object.fromEntries(files.map((f) => [f.fileId, new Set(globalKeys.filter((g) => g.presentInFiles.includes(f.fileId)).map((g) => g.keyHash))]));
  const rows = [];
  for (let i = 0; i < files.length; i += 1) {
    for (let j = i + 1; j < files.length; j += 1) {
      const a = files[i], b = files[j], setA = byFile[a.fileId], setB = byFile[b.fileId];
      const sharedKeys = [...setA].filter((k) => setB.has(k)).length;
      rows.push({ fileA: a.displayLabel, fileB: b.displayLabel, keysA: setA.size, keysB: setB.size, sharedKeys, onlyA: setA.size - sharedKeys, onlyB: setB.size - sharedKeys, jaccard: Number(jaccard(setA, setB).toFixed(4)), percentAInB: setA.size ? (sharedKeys / setA.size * 100).toFixed(2) : "0.00", percentBInA: setB.size ? (sharedKeys / setB.size * 100).toFixed(2) : "0.00" });
    }
  }
  return rows;
}

export const getKeysPresentInAllFiles = (globalKeys, files) => globalKeys.filter((g) => g.presentInFiles.length === files.length);
export const getKeysPresentInAtLeastNFiles = (globalKeys, n) => globalKeys.filter((g) => g.presentInFiles.length >= n);
export const getKeysPresentOnlyInFile = (globalKeys, fileId) => globalKeys.filter((g) => g.presentInFiles.length === 1 && g.presentInFiles[0] === fileId);
export const getKeysPresentInSelectedFiles = (globalKeys, fileIds, exactPattern = false) => globalKeys.filter((g) => exactPattern ? g.presentInFiles.length === fileIds.length && fileIds.every((id) => g.presentInFiles.includes(id)) : fileIds.every((id) => g.presentInFiles.includes(id)));
export const calculateJaccard = (a, b) => jaccard(a, b);
export const exportMultiCompareResults = (result) => result.exports;

function exportRecord(g) {
  return { id: g.representativeId, header: `${g.representativeHeader} presence_count=${g.presentInFiles.length} files_present=${g.presentInFiles.join(",")} counts_by_file=${JSON.stringify(g.countsByFile)}`, sequence: g.representativeSequence };
}
