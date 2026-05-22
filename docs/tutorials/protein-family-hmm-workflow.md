# From protein FASTA to HMMER-ready inputs

Workflow: ReadLens -> SeqSieve -> HMMForge -> MAFFT/HMMER commands.

1. Use ReadLens to inspect lengths, composition, duplicates, and warnings.
2. Use SeqSieve to collapse exact duplicates while preserving counts.
3. Use HMMForge to create safe IDs, filter or flag problematic proteins, and export cleaned FASTA.
4. Run the exported MAFFT and HMMER commands outside the browser.

Inspect the alignment before `hmmbuild`; HMM quality depends on sequence quality and family diversity.
