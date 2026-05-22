import { parseFASTA } from "./fastaParser.js";
import { parseFASTQ } from "./fastqParser.js";
import { reverseComplement, translateDNA, findORFs } from "./sequenceUtils.js";
import { runDedupe } from "./dedupeEngine.js";
import { runQC } from "./qcEngine.js";
import { compareFastaTexts } from "./compareEngine.js";
import { runHMMForge } from "./hmmPrepEngine.js";
import { exportTSV } from "./exporters.js";
import { demoData } from "./demoData.js";

export function runValidationTests() {
  const tests = [];
  add(tests, "FASTA parser multiline", "2 records", parseFASTA(">a\nAC\nGT\n>b\nTT").records.length, 2);
  add(tests, "FASTQ parser mean Q", "Q40", Math.round(parseFASTQ("@r\nAC\n+\nII").records[0].meanQuality), 40);
  add(tests, "Reverse complement", "Nucleotide ambiguity preserved", reverseComplement("ATGCRY", "DNA"), "RYGCAT");
  add(tests, "Translation", "ATG TAA -> M*", translateDNA("ATGTAA"), "M*");
  add(tests, "ORF coordinate", "Find one ORF", findORFs("CCCATGAAATAA", { minNt: 9 }).length, 1);
  const sift = runDedupe(demoData.proteinDuplicates, { format: "FASTA", sequenceType: "Protein", dedupeMode: "sequence" });
  add(tests, "SeqSieve dedupe", "3 input -> 2 unique", sift.summary.uniqueRepresentatives, 2);
  const qc = runQC(demoData.readsFastq, { format: "FASTQ" });
  add(tests, "ReadLens QC", "3 reads", qc.summary.records, 3);
  const comp = compareFastaTexts([{ name: "A", text: demoData.compareA }, { name: "B", text: demoData.compareB }, { name: "C", text: demoData.compareC }], { compareBy: "sequence" });
  add(tests, "SeqCompare core", "2 core keys", comp.core.length, 2);
  const hmm = runHMMForge(demoData.messyProteinFamily, { dedupe: true, minLength: 10, removeBelowMin: true });
  add(tests, "HMMForge filtering", "short sequence removed", hmm.removed.length >= 1, true);
  add(tests, "Export TSV", "Header plus row", exportTSV([{ a: 1 }], ["a"]).split("\n").length, 2);
  return tests;
}

function add(tests, name, expected, observed, expectedValue) {
  tests.push({ name, expected, observed: String(observed), pass: observed === expectedValue, notes: observed === expectedValue ? "OK" : `Expected ${expectedValue}` });
}
