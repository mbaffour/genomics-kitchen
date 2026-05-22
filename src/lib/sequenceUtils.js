import { mean, median, percentile } from "./statsUtils.js";

export const DNA_ALPHABET = /^[ACGTRYSWKMBDHVN\-.]*$/i;
export const RNA_ALPHABET = /^[ACGURYSWKMBDHVN\-.]*$/i;
export const PROTEIN_ALPHABET = /^[ABCDEFGHIKLMNPQRSTVWXYZ*\-.]*$/i;

const DNA_COMP = {
  A: "T", T: "A", U: "A", C: "G", G: "C", R: "Y", Y: "R", S: "S", W: "W",
  K: "M", M: "K", B: "V", V: "B", D: "H", H: "D", N: "N", "-": "-", ".": ".",
};
const RNA_COMP = { ...DNA_COMP, A: "U", T: "A" };

export function normalizeSequence(sequence = "", options = {}) {
  let value = String(sequence);
  if (options.removeWhitespace ?? true) value = value.replace(/\s+/g, "");
  if (options.removeGaps) value = value.replace(/[-.]/g, "");
  if (!options.caseSensitive) value = value.toUpperCase();
  return value;
}

export function detectSequenceType(records = []) {
  const joined = records.map((r) => r.sequence || "").join("").replace(/[-.\s]/g, "").slice(0, 50000).toUpperCase();
  if (!joined) return "unknown";
  const dnaLike = (joined.match(/[ACGTRYSWKMBDHVN]/g) || []).length / joined.length;
  const rnaLike = (joined.match(/[ACGURYSWKMBDHVN]/g) || []).length / joined.length;
  const proteinOnly = /[EFILPQXZ*]/.test(joined);
  if (!proteinOnly && rnaLike > 0.95 && joined.includes("U") && !joined.includes("T")) return "RNA";
  if (!proteinOnly && dnaLike > 0.95) return "DNA";
  return "Protein";
}

export function validateAlphabet(sequence, sequenceType = "DNA") {
  const value = String(sequence || "");
  const re = sequenceType === "RNA" ? RNA_ALPHABET : sequenceType === "Protein" ? PROTEIN_ALPHABET : DNA_ALPHABET;
  const invalid = [...value.replace(/\s/g, "")].filter((ch) => !re.test(ch));
  return { valid: invalid.length === 0, invalidCount: invalid.length, invalidCharacters: [...new Set(invalid)] };
}

export function reverseComplement(sequence, sequenceType = "DNA") {
  if (sequenceType === "Protein") return sequence;
  const comp = sequenceType === "RNA" ? RNA_COMP : DNA_COMP;
  return [...String(sequence).toUpperCase()].reverse().map((ch) => comp[ch] || "N").join("");
}

export function canonicalizeForReverseComplement(sequence, sequenceType = "DNA") {
  if (sequenceType === "Protein") return { key: sequence, orientation: "forward" };
  const rc = reverseComplement(sequence, sequenceType);
  return rc < sequence ? { key: rc, orientation: "reverse_complement" } : { key: sequence, orientation: "forward" };
}

export function calculateGC(sequence) {
  const s = String(sequence || "").toUpperCase().replace(/[^ACGTU]/g, "");
  if (!s.length) return 0;
  return ((s.match(/[GC]/g) || []).length / s.length) * 100;
}

export function calculateNContent(sequence) {
  const s = String(sequence || "").toUpperCase().replace(/[-.\s]/g, "");
  return s.length ? ((s.match(/N/g) || []).length / s.length) * 100 : 0;
}

export function calculateLengthStats(lengths) {
  return { min: lengths.length ? Math.min(...lengths) : 0, max: lengths.length ? Math.max(...lengths) : 0, mean: mean(lengths), median: median(lengths), n50: calculateN50(lengths) };
}

export function calculateN50(lengths) {
  const sorted = [...lengths].sort((a, b) => b - a);
  const half = sorted.reduce((a, b) => a + b, 0) / 2;
  let run = 0;
  for (const len of sorted) {
    run += len;
    if (run >= half) return len;
  }
  return 0;
}

const STANDARD = {
  TTT: "F", TTC: "F", TTA: "L", TTG: "L", TCT: "S", TCC: "S", TCA: "S", TCG: "S",
  TAT: "Y", TAC: "Y", TAA: "*", TAG: "*", TGT: "C", TGC: "C", TGA: "*", TGG: "W",
  CTT: "L", CTC: "L", CTA: "L", CTG: "L", CCT: "P", CCC: "P", CCA: "P", CCG: "P",
  CAT: "H", CAC: "H", CAA: "Q", CAG: "Q", CGT: "R", CGC: "R", CGA: "R", CGG: "R",
  ATT: "I", ATC: "I", ATA: "I", ATG: "M", ACT: "T", ACC: "T", ACA: "T", ACG: "T",
  AAT: "N", AAC: "N", AAA: "K", AAG: "K", AGT: "S", AGC: "S", AGA: "R", AGG: "R",
  GTT: "V", GTC: "V", GTA: "V", GTG: "V", GCT: "A", GCC: "A", GCA: "A", GCG: "A",
  GAT: "D", GAC: "D", GAA: "E", GAG: "E", GGT: "G", GGC: "G", GGA: "G", GGG: "G",
};
const BACTERIAL = { ...STANDARD, TGA: "*", ATA: "I" };

export function translateDNA(sequence, frame = 0, geneticCode = "standard") {
  const table = geneticCode === "bacterial" ? BACTERIAL : STANDARD;
  const dna = String(sequence || "").toUpperCase().replace(/U/g, "T").replace(/[^A-Z]/g, "");
  let protein = "";
  for (let i = frame; i + 2 < dna.length; i += 3) protein += table[dna.slice(i, i + 3)] || "X";
  return protein;
}

export function sixFrameTranslation(sequence, geneticCode = "standard") {
  const dna = String(sequence || "").toUpperCase().replace(/U/g, "T");
  const rc = reverseComplement(dna, "DNA");
  return [0, 1, 2].map((f) => ({ strand: "+", frame: f + 1, protein: translateDNA(dna, f, geneticCode) }))
    .concat([0, 1, 2].map((f) => ({ strand: "-", frame: -(f + 1), protein: translateDNA(rc, f, geneticCode) })));
}

export function findORFs(sequence, options = {}) {
  const dna = String(sequence || "").toUpperCase().replace(/U/g, "T").replace(/[^ACGTRYSWKMBDHVN]/g, "");
  const startCodons = options.startCodons || ["ATG"];
  const stopCodons = options.stopCodons || ["TAA", "TAG", "TGA"];
  const minNt = Number(options.minNt || 90);
  const mode = options.mode || "start-stop";
  const strands = options.strand === "forward" ? ["+"] : options.strand === "reverse" ? ["-"] : ["+", "-"];
  const includePartial = Boolean(options.includePartial);
  const results = [];
  const scan = (seq, strand) => {
    for (let frame = 0; frame < 3; frame += 1) {
      let openStart = mode === "stop-stop" && includePartial ? frame : null;
      for (let i = frame; i + 2 < seq.length; i += 3) {
        const codon = seq.slice(i, i + 3);
        if (mode !== "stop-stop" && openStart === null && startCodons.includes(codon)) openStart = i;
        if (mode === "stop-stop" && openStart === null) openStart = i;
        if (openStart !== null && stopCodons.includes(codon)) {
          const end = i + 3;
          if (end - openStart >= minNt) results.push(makeOrf(seq, strand, frame, openStart, end, dna.length, false, false, startCodons, stopCodons, options.geneticCode));
          openStart = mode === "stop-stop" ? end : null;
        }
      }
      if (includePartial && openStart !== null && seq.length - openStart >= minNt) {
        results.push(makeOrf(seq, strand, frame, openStart, seq.length, dna.length, mode !== "stop-stop", true, startCodons, stopCodons, options.geneticCode));
      }
    }
  };
  if (strands.includes("+")) scan(dna, "+");
  if (strands.includes("-")) scan(reverseComplement(dna, "DNA"), "-");
  return results.map((orf, i) => ({ ...orf, orfId: `orf_${i + 1}` }));
}

function makeOrf(seq, strand, frame, start0, end0, originalLength, partialStart, partialStop, starts, stops, geneticCode) {
  const nt = seq.slice(start0, end0);
  const start = strand === "+" ? start0 + 1 : originalLength - end0 + 1;
  const end = strand === "+" ? end0 : originalLength - start0;
  const first = nt.slice(0, 3);
  const last = nt.slice(-3);
  return {
    strand,
    frame: strand === "+" ? frame + 1 : -(frame + 1),
    start,
    end,
    lengthNt: end0 - start0,
    lengthAa: Math.floor((end0 - start0) / 3),
    startCodon: starts.includes(first) ? first : "",
    stopCodon: stops.includes(last) ? last : "",
    partialStart,
    partialStop,
    nucleotideSequence: nt,
    proteinSequence: translateDNA(nt, 0, geneticCode).replace(/\*$/, ""),
  };
}

export function aminoAcidComposition(sequence) {
  const comp = {};
  [...String(sequence || "").toUpperCase()].forEach((aa) => { comp[aa] = (comp[aa] || 0) + 1; });
  return comp;
}

export function estimateMolecularWeight(protein) {
  const weights = { A: 89.09, R: 174.2, N: 132.12, D: 133.1, C: 121.15, Q: 146.15, E: 147.13, G: 75.07, H: 155.16, I: 131.17, L: 131.17, K: 146.19, M: 149.21, F: 165.19, P: 115.13, S: 105.09, T: 119.12, W: 204.23, Y: 181.19, V: 117.15 };
  const aas = [...String(protein || "").toUpperCase()].filter((aa) => weights[aa]);
  return Math.max(0, aas.reduce((sum, aa) => sum + weights[aa], 18.02) - (aas.length ? (aas.length - 1) * 18.02 : 0));
}

export function estimateIsoelectricPointSimple(protein) {
  const comp = aminoAcidComposition(protein);
  const basic = (comp.K || 0) + (comp.R || 0) + 0.3 * (comp.H || 0);
  const acidic = (comp.D || 0) + (comp.E || 0);
  return Math.max(3, Math.min(11, 7 + (basic - acidic) / Math.max(1, String(protein).length) * 10));
}

export function detectLowComplexityRegions(protein) {
  const s = String(protein || "").toUpperCase();
  const regions = [];
  for (let i = 0; i <= s.length - 12; i += 1) {
    const win = s.slice(i, i + 12);
    const top = Math.max(...Object.values(aminoAcidComposition(win)));
    if (top / 12 >= 0.7) regions.push({ start: i + 1, end: i + 12, residueFraction: top / 12 });
  }
  return regions;
}

export const detectStopCodons = (protein) => [...String(protein || "").matchAll(/\*/g)].map((m) => m.index + 1);

export function simpleHash(string) {
  let hash = 2166136261;
  for (let i = 0; i < String(string).length; i += 1) {
    hash ^= String(string).charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `gk_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
