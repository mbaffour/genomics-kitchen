import ToolCard from "./ToolCard.jsx";

const tools = [
  ["SeqSieve", "Exact Deduplication", "Collapse exact FASTA/FASTQ duplicates while preserving counts, mappings, and representative records."],
  ["ReadLens", "Sequence Quality Control", "Inspect length, composition, FASTQ quality, duplicate signals, and parser warnings."],
  ["SeqCompare", "Multi-FASTA Comparison", "Compare sequence sets across files and export core, accessory, and file-specific results."],
  ["ORFScout", "ORF Discovery", "Find candidate ORFs and translate nucleotide sequences across reading frames."],
  ["HMMForge", "Protein Family Preparation", "Clean protein families and prepare alignment/HMMER-ready FASTA and command recipes."],
];

export default function LandingPage({ setPage }) {
  const heroImage = `${import.meta.env.BASE_URL}graphics/molecular-kitchen-hero.png`;
  return (
    <div className="landing">
      <section className="hero" style={{ "--hero-image": `url("${heroImage}")` }}>
        <div className="hero-copy">
          <h1>Genomics Kitchen</h1>
          <p className="tagline">Prepare clean sequence data.</p>
          <p>Prepare FASTA and FASTQ files with browser-based tools for deduplication, quality inspection, multi-file sequence comparison, ORF discovery, and HMM-ready protein family cleanup.</p>
          <p className="privacy-badge">Local-only processing. No sequence data are uploaded.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => setPage("SeqSieve")}>Start with SeqSieve</button>
            <button className="button secondary" onClick={() => setPage("ReadLens")}>Try sample data</button>
            <button className="button ghost" onClick={() => setPage("Validation")}>Run validation tests</button>
          </div>
          <div className="hero-actions support-actions">
            <a className="button ghost" href="https://github.com/mbaffour/genomics-kitchen/issues/new?template=bug_report.yml" target="_blank" rel="noreferrer">Report a bug</a>
            <a className="button ghost" href="https://github.com/mbaffour/genomics-kitchen/issues/new?template=feature_request.yml" target="_blank" rel="noreferrer">Suggest an improvement</a>
          </div>
        </div>
        <figure className="hero-photo">
          <img src={heroImage} alt="Realistic molecular kitchen bench with glassware, protein models, and DNA-like vapor." />
        </figure>
      </section>
      <section className="tool-grid">
        {tools.map(([tool, title, description]) => <ToolCard key={tool} tool={tool} title={title} description={description} onOpen={() => setPage(tool)} />)}
      </section>
      <section className="workflow-recipes">
        <h2>Suggested workflows</h2>
        {["ReadLens → SeqSieve → HMMForge", "ORFScout → HMMForge", "SeqSieve → SeqCompare", "ReadLens → SeqSieve"].map((flow) => <article key={flow}>{flow}</article>)}
      </section>
    </div>
  );
}
