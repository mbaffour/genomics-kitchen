# Genomics Kitchen

[![Deploy Genomics Kitchen to GitHub Pages](https://github.com/mbaffour890/genomics-kitchen/actions/workflows/deploy.yml/badge.svg)](https://github.com/mbaffour890/genomics-kitchen/actions/workflows/deploy.yml)

**Cook clean sequence data.**

Genomics Kitchen is a browser-based molecular kitchen for preparing FASTA and FASTQ files with local-only tools for deduplication, quality inspection, multi-file sequence comparison, ORF discovery, and HMM-ready protein family cleanup.

Live demo: <https://mbaffour890.github.io/genomics-kitchen/>

## Screenshots

Screenshots live in `docs/screenshots/`.

![Genomics Kitchen home](docs/screenshots/home.png)
![SeqSieve](docs/screenshots/seqsieve.png)
![ReadLens](docs/screenshots/readlens.png)
![SeqCompare](docs/screenshots/seqcompare.png)
![ORFScout](docs/screenshots/orfscout.png)
![HMMForge](docs/screenshots/hmmforge.png)

## Privacy

Genomics Kitchen processes files locally in your browser. Sequence data are not uploaded to a server. The app has no backend, no tracking, no analytics, and no hidden network calls.

## Tools

- **SeqSieve, Sequence Sifter:** exact FASTA/FASTQ deduplication with counts, mapping tables, duplicate groups, and reports.
- **ReadLens, Quality Tasting Station:** sequence length, composition, FASTQ quality, duplicate estimates, and parser warnings.
- **SeqCompare, Comparison Cutting Board:** multi-file FASTA comparison for core, accessory, file-specific, shared-by-subset, presence/absence, and pairwise overlap outputs.
- **ORFScout, Gene Recipe Finder:** six-frame translation and ORF discovery with 1-based inclusive coordinates.
- **HMMForge, Protein Prep Bench:** protein family cleanup, safe IDs, filtering reports, and MAFFT/HMMER command recipes.

## Supported Formats

FASTA, multi-FASTA, FASTQ four-line records, protein FASTA, nucleotide FASTA, TSV, JSON, text reports, and shell command recipes.

## Scientific Notes

SeqSieve performs exact deduplication. It is not a replacement for CD-HIT, MMseqs2, VSEARCH, or other approximate similarity-clustering tools when the goal is to group non-identical sequences by percent identity or coverage.

SeqCompare compares exact keys across files. Shared exact sequence identity is not the same as evolutionary homology. Core sequences are present in every uploaded file. Accessory sequences are present in at least two but not all files. File-specific sequences are present in exactly one file. Shared-by-subset groups are defined by exact file membership patterns. The presence/absence matrix has one row per unique comparison key. Pairwise overlap reports shared counts and Jaccard similarity.

ORFScout predicts candidate ORFs, not gene annotations. Functional annotation requires homology, domains, synteny, expression, or experimental evidence.

HMMForge prepares protein FASTA files and command recipes for external alignment and HMMER workflows. It does not run MAFFT or HMMER in the browser.

FASTQ deduplication can alter apparent abundance. Keep mapping and count tables.

## Outputs

Each station produces methods-ready text, summary TXT, reproducibility JSON, TSV tables, and relevant FASTA/FASTQ outputs. Filenames follow `genomics-kitchen_TOOL_INPUT_YYYYMMDD_HHMM.ext`.

## Example Workflows

- Protein family to HMM: ReadLens -> SeqSieve -> HMMForge -> MAFFT/HMMER.
- Phage genome exploration: ORFScout -> HMMForge.
- Multi-file sequence comparison: SeqSieve -> SeqCompare.
- QC before downstream analysis: ReadLens -> SeqSieve.

## Tutorials

See `docs/tutorials/` for station-specific tutorials and workflow guides.

## Methods Language

Example: “Multiple FASTA sequence sets were compared using SeqCompare within Genomics Kitchen v0.1.0. Sequences were compared by exact normalized sequence identity. Core sequences were defined as comparison keys present in all uploaded files, accessory sequences as keys present in at least two but not all files, and file-specific sequences as keys present in only one file. Original identifiers, file membership patterns, and per-file counts were preserved in exported tables.”

## Browser Limitations

Large files are limited by browser memory. Genomics Kitchen warns above 50 MB and strongly warns above 250 MB. Large tables are previewed in the UI and exported in full.

## Taste Tests

Open the Taste Tests page to run parser, reverse-complement, translation, ORF coordinate, deduplication, QC, comparison, HMMForge, and export checks.

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages Deployment

Push to `main`. In repository Settings -> Pages, select GitHub Actions as the source if needed. The workflow in `.github/workflows/deploy.yml` builds the Vite app with `base: "/genomics-kitchen/"` and deploys `dist`.

Deployment URL: <https://mbaffour890.github.io/genomics-kitchen/>

## Report Bugs and Request Features

Open an issue at <https://github.com/mbaffour890/genomics-kitchen/issues>. Include the tool, browser/OS, input format, expected behavior, observed behavior, screenshots if possible, and a small non-sensitive example file if safe.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT License.

## Citation

See `CITATION.cff`.
