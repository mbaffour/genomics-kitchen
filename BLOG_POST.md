# Introducing Genomics Kitchen: a browser-based toolkit for preparing sequence data

**Author:** Michael Baffour Awuah

Sequence analysis often starts with messy raw files: duplicate records, unclear quality, inconsistent headers, scattered FASTA batches, and protein families that need cleanup before alignment. Genomics Kitchen is built for that first practical step, where raw sequence ingredients become clean, labeled, analysis-ready outputs.

Genomics Kitchen is a browser-based suite for preparing FASTA and FASTQ data locally. Files stay in your browser and are not uploaded to a server. There is no backend, tracking, analytics, or hidden network call.

Why a kitchen? Raw sequence ingredients come in; clean, labeled, analysis-ready outputs come out. The metaphor makes the workflow easier to remember, but the scientific caveats stay visible.

## The Stations

- **SeqSieve, Sequence Sifter:** exact deduplication with counts, mappings, duplicate groups, and reports.
- **ReadLens, Quality Tasting Station:** length, composition, FASTQ quality, duplicate estimates, and warnings.
- **SeqCompare, Comparison Cutting Board:** core, accessory, file-specific, shared-by-subset, presence/absence, and pairwise overlap across multiple FASTA files.
- **ORFScout, Gene Recipe Finder:** ORF discovery and six-frame translation for nucleotide sequences.
- **HMMForge, Protein Prep Bench:** protein-family cleanup, safe IDs, and command recipes for MAFFT/HMMER workflows.

## Tutorial 1: Deduplicate a protein FASTA with SeqSieve

1. Open SeqSieve.
2. Upload a protein FASTA.
3. Choose Protein.
4. Compare by sequence content.
5. Keep the first representative.
6. Run Sift Sequences.
7. Download the deduplicated FASTA, mapping TSV, counts TSV, and report.

## Tutorial 2: Inspect reads with ReadLens

1. Upload FASTQ.
2. Run Taste Quality.
3. Review read length, quality, duplicate rate, GC content, and N content.
4. Export the QC report.

## Tutorial 3: Compare multiple FASTA files with SeqCompare

1. Upload three FASTA files.
2. Compare by sequence content.
3. Review core, accessory, and file-specific sequence sets.
4. Export the presence/absence matrix and core FASTA.

## Tutorial 4: Find ORFs with ORFScout

1. Upload nucleotide FASTA.
2. Select genetic code and start codons.
3. Choose minimum ORF length.
4. Run Find Recipes.
5. Export ORF protein FASTA and the ORF table.

## Tutorial 5: Prepare a protein family with HMMForge

1. Upload protein FASTA.
2. Deduplicate exact sequences.
3. Set length and ambiguity filters.
4. Review flagged and removed sequences.
5. Export cleaned FASTA and the HMMER command recipe.

## Suggested Workflows

- Protein family to HMM: ReadLens -> SeqSieve -> HMMForge.
- Phage genome exploration: ORFScout -> HMMForge.
- Multi-file sequence comparison: SeqSieve -> SeqCompare.
- QC before downstream analysis: ReadLens -> SeqSieve.

## Screenshots

![Genomics Kitchen home](../screenshots/home.png)
![SeqSieve](../screenshots/seqsieve.png)
![ReadLens](../screenshots/readlens.png)
![SeqCompare](../screenshots/seqcompare.png)
![ORFScout](../screenshots/orfscout.png)
![HMMForge](../screenshots/hmmforge.png)

## Scientific Caveats

Exact deduplication is not clustering. ORF prediction is not gene annotation. HMMForge does not run HMMER in the browser. FASTQ deduplication can affect abundance interpretation.

## Bugs and Features

Open an issue at <https://github.com/mbaffour890/genomics-kitchen/issues>. Include the tool, browser/OS, file format, expected behavior, observed behavior, screenshots if possible, and a small non-sensitive example file if safe.

## Short Website Version

Genomics Kitchen is a browser-based toolkit for preparing sequence data locally. Deduplicate FASTA/FASTQ files, inspect quality, compare multiple FASTA batches, find ORFs, and prepare protein families for HMM workflows without uploading sequence data to a server.

Researchers, students, and developers are invited to test it, report scientific edge cases, and contribute.
