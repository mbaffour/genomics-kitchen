# Introducing Genomics Kitchen: browser-based sequence prep with a sharper edge

**Author:** Michael Baffour Awuah

Bioinformatics does not usually begin with a clean, obedient file. It begins with a FASTA someone renamed three times, a FASTQ with suspicious quality tails, duplicate records that may or may not matter, and a folder of sequence sets that need to be compared before anyone can make a confident next move.

Genomics Kitchen is my browser-based toolkit for that first mile of sequence analysis. It helps prepare FASTA and FASTQ files locally, without uploading sequence data to a server.

The name is playful, but the app is serious about the biology: exact matching is labeled as exact matching, ORF prediction is not oversold as annotation, and HMMForge prepares inputs and command recipes rather than pretending the browser can replace MAFFT or HMMER.

## Try it

- [Open Genomics Kitchen](https://mbaffour.github.io/genomics-kitchen/)
- [Report a bug](https://github.com/mbaffour/genomics-kitchen/issues/new?template=bug_report.yml)
- [Suggest an improvement](https://github.com/mbaffour/genomics-kitchen/issues/new?template=feature_request.yml)
- [Send a scientific validation note](https://github.com/mbaffour/genomics-kitchen/issues/new?template=scientific_validation.yml)

## What it does

**SeqSieve: Exact Deduplication**

Collapse exact FASTA/FASTQ duplicates while preserving representative records, counts, mappings, duplicate groups, and reproducibility metadata.

**ReadLens: Sequence Quality Control**

Inspect sequence length, composition, FASTQ Phred+33 quality, duplicate signals, invalid characters, and parser warnings.

**SeqCompare: Multi-FASTA Comparison**

Compare two or more FASTA files by exact sequence, ID, or full record. Export core, accessory, file-specific, shared-by-subset, pairwise overlap, and presence/absence results.

**ORFScout: ORF Discovery**

Find candidate ORFs and generate six-frame translations. Coordinates are reported as 1-based inclusive positions.

**HMMForge: Protein Family Preparation**

Clean protein FASTA files, create safe alignment IDs, flag outliers, preserve duplicate mappings, and generate MAFFT/HMMER command recipes.

## Why browser-only matters

Sometimes you want a quick, transparent preprocessing step without sending sequence data anywhere. Genomics Kitchen runs locally in the browser: no backend, no upload, no analytics, no tracking, and no hidden network calls.

That makes it useful for small research checks, teaching, reviewer-facing demos, and early workflow planning. It is not a replacement for full command-line pipelines, but it can make the first pass much less painful.

## Suggested workflows

- Protein family cleanup: **ReadLens -> SeqSieve -> HMMForge**
- Phage genome exploration: **ORFScout -> HMMForge**
- Multi-file sequence comparison: **SeqSieve -> SeqCompare**
- QC before downstream analysis: **ReadLens -> SeqSieve**

## Screenshots

![Genomics Kitchen home](../screenshots/home.png)
![SeqSieve](../screenshots/seqsieve.png)
![ReadLens](../screenshots/readlens.png)
![SeqCompare](../screenshots/seqcompare.png)
![ORFScout](../screenshots/orfscout.png)
![HMMForge](../screenshots/hmmforge.png)

## Scientific caveats

SeqSieve performs exact deduplication, not clustering. Similar but non-identical sequences still need tools such as CD-HIT, MMseqs2, VSEARCH, BLAST, or HMMER depending on the question.

SeqCompare reports exact overlap. Shared exact sequence identity is useful, but it is not the same as evolutionary homology.

ORFScout predicts candidate open reading frames. Functional annotation still requires homology, domains, synteny, expression evidence, or experiments.

HMMForge prepares protein FASTA files and command recipes. It does not run MAFFT or HMMER inside the browser.

FASTQ deduplication can change abundance interpretation, so count tables and mappings matter.

## Help improve it

The most valuable feedback is specific. If something breaks, tell me which tool you used, your browser/OS, the input format, what you expected, and what happened. If it is safe, include a tiny non-sensitive example file.

If the scientific behavior seems wrong, open a validation issue with the example and your reasoning. That kind of feedback is exactly how tools like this become trustworthy.

Short version: Genomics Kitchen is a local-first browser app for sequence preprocessing. It is meant to be approachable, but it is not trying to be cute at the expense of scientific clarity.
