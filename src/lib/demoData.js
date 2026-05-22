export const demoData = {
  proteinDuplicates: `>kinase_A example protein\nMTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQV\n>kinase_A_duplicate exact duplicate\nMTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQV\n>kinase_B related but not identical\nMTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQA\n`,
  readsFastq: `@read1\nACGTACGTNN\n+\nIIIIIII!!!\n@read2\nACGTACGTNN\n+\nIIIIIII!!!\n@read3\nGGGGCCCCAA\n+\nHHHHHHHHHH\n`,
  compareA: `>core1\nATGAAATAG\n>core2\nATGCCCTAA\n>A_only\nATGTTTTAA\n`,
  compareB: `>core1_renamed\nATGAAATAG\n>core2\nATGCCCTAA\n>B_only\nATGGGGTAA\n`,
  compareC: `>core1\nATGAAATAG\n>core2\nATGCCCTAA\n>C_only\nATGAACTGA\n`,
  phageGenome: `>small_phage_like_genome synthetic\nAAAATGGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTGCTTAAACCCATGAAAGGGTAGTTT\n`,
  messyProteinFamily: `>alpha_good member good\nMKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQANN\n>alpha_duplicate exact duplicate\nMKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQANN\n>alpha_short short member\nMKTAYI\n>alpha_x_rich x rich member\nMKXXXXXXQRQISFVKSHFSRQLEERLGLIEVQANN\n>alpha_internal_stop internal stop member\nMKTAYIAK*RQISFVKSHFSRQLEERLGLIEVQANN\n`,
};

export const sampleFiles = {
  SeqSieve: { name: "simple_duplicates.fasta", text: demoData.proteinDuplicates },
  ReadLens: { name: "reads.fastq", text: demoData.readsFastq },
  SeqCompare: [
    { name: "compare_batch_A.fasta", text: demoData.compareA },
    { name: "compare_batch_B.fasta", text: demoData.compareB },
    { name: "compare_batch_C.fasta", text: demoData.compareC },
  ],
  ORFScout: { name: "small_phage_like_genome.fasta", text: demoData.phageGenome },
  HMMForge: { name: "messy_protein_family.faa", text: demoData.messyProteinFamily },
};
