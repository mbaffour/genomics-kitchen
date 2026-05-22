# Using SeqCompare to compare multiple FASTA files

SeqCompare compares two or more FASTA files by exact sequence, parsed ID, or full record.

Core sequences are present in all files. Accessory sequences are present in at least two but not all files. File-specific sequences are present in exactly one file. Shared-by-subset groups are exact file membership patterns. The presence/absence matrix has one row per unique comparison key. Pairwise overlap reports shared keys and Jaccard similarity.

## Steps

1. Upload at least three FASTA files.
2. Choose sequence type and comparison key.
3. Set normalization options.
4. Run Chop and Compare Batches.
5. Review core, accessory, file-specific, subset, pairwise, and matrix outputs.
6. Export FASTA and TSV files.

Exact overlap is not proof of homology. Similar non-identical sequences require alignment, clustering, or homology tools.
