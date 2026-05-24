export default function BlogPage() {
  return (
    <article className="bench blog-page">
      <header className="bench-header">
        <div className="brand-mark">GK</div>
        <div>
          <p className="tool-name">Project Blog</p>
          <h1>Building Genomics Kitchen</h1>
          <p>A browser-first toolkit for turning messy FASTA and FASTQ files into reproducible, analysis-ready sequence outputs.</p>
        </div>
        <figure className="bench-photo" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}graphics/molecular-kitchen-hero.png`} alt="" />
        </figure>
      </header>

      <section className="panel blog-card">
        <p className="panel-kicker">Launch Notes</p>
        <h2>Why this exists</h2>
        <p>
          Sequence analysis rarely begins with a perfect file. It begins with duplicate records, mixed headers,
          uncertain read quality, scattered FASTA batches, and protein families that need careful cleanup before
          alignment or profile-HMM work. Genomics Kitchen is designed for that practical first mile.
        </p>
        <p>
          The app runs entirely in the browser. Files are parsed locally, outputs are generated locally, and sequence
          data are not uploaded to a server. That makes it useful for teaching, quick checks, reproducible preprocessing,
          and small-to-medium exploratory workflows where installing a full command-line stack would slow the science down.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="https://github.com/mbaffour/genomics-kitchen/issues/new?template=bug_report.yml" target="_blank" rel="noreferrer">Report a bug</a>
          <a className="button secondary" href="https://github.com/mbaffour/genomics-kitchen/issues/new?template=feature_request.yml" target="_blank" rel="noreferrer">Suggest improvements</a>
          <a className="button ghost" href="https://github.com/mbaffour/genomics-kitchen/issues/new?template=scientific_validation.yml" target="_blank" rel="noreferrer">Scientific validation note</a>
        </div>
      </section>

      <section className="tool-grid blog-tool-grid">
        <BlogTool title="SeqSieve" image="seqsieve.png" text="Exact deduplication with count tables and mappings. It does not cluster similar sequences." />
        <BlogTool title="ReadLens" image="readlens.png" text="Length, composition, duplicate signals, and FASTQ Phred+33 quality checks for quick review." />
        <BlogTool title="SeqCompare" image="seqcompare.png" text="Core, accessory, file-specific, subset, and pairwise overlap reports across multiple FASTA files." />
        <BlogTool title="ORFScout" image="orfscout.png" text="Candidate ORF discovery and six-frame translation. It predicts ORFs, not annotated genes." />
        <BlogTool title="HMMForge" image="hmmforge.png" text="Protein-family cleanup, safe IDs, and external MAFFT/HMMER command recipes." />
      </section>

      <section className="panel blog-card">
        <h2>What would make it better?</h2>
        <p>
          The most useful feedback is concrete: a small non-sensitive test file, the browser/OS, the tool used,
          what you expected, and what happened. Scientific edge cases are especially welcome, because sequence
          preprocessing tools earn trust by being boringly correct in weird corners.
        </p>
      </section>
    </article>
  );
}

function BlogTool({ title, image, text }) {
  return (
    <article className="tool-card">
      <div className="tool-media">
        <img src={`${import.meta.env.BASE_URL}graphics/tools/${image}`} alt="" loading="lazy" />
      </div>
      <div>
        <p className="tool-name">{title}</p>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
