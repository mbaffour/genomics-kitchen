# Introducing Genomics Kitchen: browser-based sequence prep with a sharper edge

**Author:** Michael Baffour Awuah

Genomics Kitchen is a browser-based toolkit for preparing FASTA and FASTQ data locally. It is designed for the messy first mile of sequence analysis: duplicate records, uncertain read quality, scattered FASTA batches, candidate ORFs, and protein families that need cleanup before alignment or profile-HMM work.

Files stay in the browser. There is no backend, no upload, no analytics, and no tracking.

## Tools

- **SeqSieve:** exact deduplication with counts, mappings, and reports.
- **ReadLens:** sequence QC for length, composition, FASTQ quality, duplicates, and warnings.
- **SeqCompare:** multi-FASTA comparison for core, accessory, file-specific, subset, and pairwise overlap outputs.
- **ORFScout:** candidate ORF discovery and six-frame translation.
- **HMMForge:** protein-family cleanup and MAFFT/HMMER command recipes.

## Try it and send feedback

- [Open Genomics Kitchen](https://mbaffour.github.io/genomics-kitchen/)
- [Report a bug](https://github.com/mbaffour/genomics-kitchen/issues/new?template=bug_report.yml)
- [Suggest an improvement](https://github.com/mbaffour/genomics-kitchen/issues/new?template=feature_request.yml)
- [Scientific validation note](https://github.com/mbaffour/genomics-kitchen/issues/new?template=scientific_validation.yml)

## Screenshots

![Genomics Kitchen home](../screenshots/home.png)
![SeqSieve](../screenshots/seqsieve.png)
![ReadLens](../screenshots/readlens.png)
![SeqCompare](../screenshots/seqcompare.png)
![ORFScout](../screenshots/orfscout.png)
![HMMForge](../screenshots/hmmforge.png)

## Caveats

Exact deduplication is not clustering. Exact overlap is not proof of homology. ORF prediction is not gene annotation. HMMForge prepares files and command recipes; it does not run MAFFT or HMMER in the browser.
