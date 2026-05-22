# Using ReadLens to inspect FASTA/FASTQ quality

ReadLens reports length, composition, duplicate estimates, parser warnings, invalid characters, and FASTQ Phred+33 quality metrics.

For FASTA, review record count, total letters, min/mean/median/max length, N50 for nucleotide files, GC/N content, invalid characters, duplicate IDs, and exact duplicate sequences.

For FASTQ, review read length, mean quality, low-quality reads, GC/N content, duplicate reads, and quality mismatch warnings.

Duplicate reads are not automatically bad. Protein files should not use GC/N as biological metrics.

Export QC summary TXT, metrics JSON, record metrics TSV, duplicate sequence TSV, and warnings TSV.
