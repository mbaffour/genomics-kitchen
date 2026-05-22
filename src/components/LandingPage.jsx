import ToolCard from "./ToolCard.jsx";

const tools = [
  ["SeqSieve", "Sequence Sifter", "Exact deduplication with counts and mapping tables."],
  ["ReadLens", "Quality Tasting Station", "Inspect sequence quality, length, composition, and warnings."],
  ["SeqCompare", "Comparison Cutting Board", "Compare multiple FASTA batches and find core, shared, and unique sequences."],
  ["ORFScout", "Gene Recipe Finder", "Find ORFs and translate nucleotide sequences in six frames."],
  ["HMMForge", "Protein Prep Bench", "Prepare protein families for alignment and HMMER workflows."],
];

export default function LandingPage({ setPage }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-copy">
          <h1>Genomics Kitchen</h1>
          <p className="tagline">Cook clean sequence data.</p>
          <p>Prepare FASTA and FASTQ files with browser-based tools for deduplication, quality inspection, multi-file sequence comparison, ORF discovery, and HMM-ready protein family cleanup.</p>
          <p className="privacy-badge">Local-only processing. No sequence data are uploaded.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => setPage("SeqSieve")}>Enter the Kitchen</button>
            <button className="button secondary" onClick={() => setPage("ReadLens")}>Try Sample Ingredients</button>
            <button className="button ghost" onClick={() => setPage("Taste Tests")}>Run Taste Tests</button>
          </div>
        </div>
        <div className="hero-board" aria-hidden="true">
          <div className="glass-jar">FASTA</div><div className="glass-jar">FASTQ</div><div className="glass-jar">TSV</div>
          <div className="sequence-ribbon">ATG CGT TAA</div>
          <div className="recipe-slip">exact keys + counts + reports</div>
        </div>
      </section>
      <section className="tool-grid">
        {tools.map(([tool, kitchenTitle, description]) => <ToolCard key={tool} tool={tool} kitchenTitle={kitchenTitle} description={description} onOpen={() => setPage(tool)} />)}
      </section>
      <section className="workflow-recipes">
        <h2>Workflow recipe cards</h2>
        {["ReadLens → SeqSieve → HMMForge", "ORFScout → HMMForge", "SeqSieve → SeqCompare", "ReadLens → SeqSieve"].map((flow) => <article key={flow}>{flow}</article>)}
      </section>
    </div>
  );
}
