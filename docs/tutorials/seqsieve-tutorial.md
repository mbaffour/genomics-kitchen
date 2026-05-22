# Using SeqSieve to deduplicate FASTA/FASTQ files

SeqSieve performs exact deduplication by sequence content, parsed ID, or full record. Use it when repeated exact records need to be collapsed while preserving counts and mappings. Do not use it when you need approximate clustering by percent identity or coverage.

## Steps

1. Open SeqSieve.
2. Upload FASTA or FASTQ.
3. Choose format and sequence type, or leave Auto.
4. Select deduplication mode.
5. Choose case, whitespace, gap, reverse-complement, and representative settings.
6. Run Sift Sequences.
7. Export deduplicated sequence files, mapping TSV, duplicate groups, counts, report, and JSON.

## Outputs

Mapping rows preserve original IDs, headers, representative IDs, group IDs, sequence lengths, orientation, quality where available, and counts.

## Methods Sentence

Exact duplicate sequences were collapsed using SeqSieve in Genomics Kitchen v0.1.0, preserving original identifiers, representative mappings, counts, settings, and warnings.

## Common Mistakes

Do not describe exact deduplication as clustering. FASTQ deduplication can change abundance interpretation.
