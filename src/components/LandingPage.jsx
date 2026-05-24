import ToolCard from "./ToolCard.jsx";

const tools = [
  ["SeqSieve", "Sequence Sifter", "Exact deduplication with counts and mapping tables.", "0% center"],
  ["ReadLens", "Quality Tasting Station", "Inspect sequence quality, length, composition, and warnings.", "25% center"],
  ["SeqCompare", "Comparison Cutting Board", "Compare multiple FASTA batches and find core, shared, and unique sequences.", "50% center"],
  ["ORFScout", "Gene Recipe Finder", "Find ORFs and translate nucleotide sequences in six frames.", "75% center"],
  ["HMMForge", "Protein Prep Bench", "Prepare protein families for alignment and HMMER workflows.", "100% center"],
];

export default function LandingPage({ setPage }) {
  const heroImage = `${import.meta.env.BASE_URL}graphics/molecular-kitchen-hero.png`;
  return (
    <div className="landing">
      <section className="hero" style={{ "--hero-image": `url("${heroImage}")` }}>
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
        <figure className="hero-photo">
          <img src={heroImage} alt="Realistic molecular kitchen bench with glassware, protein models, and DNA-like vapor." />
        </figure>
      </section>
      <section className="tool-grid">
        {tools.map(([tool, kitchenTitle, description, imagePosition]) => <ToolCard key={tool} tool={tool} kitchenTitle={kitchenTitle} description={description} imagePosition={imagePosition} onOpen={() => setPage(tool)} />)}
      </section>
      <section className="workflow-recipes">
        <h2>Workflow recipe cards</h2>
        {["ReadLens → SeqSieve → HMMForge", "ORFScout → HMMForge", "SeqSieve → SeqCompare", "ReadLens → SeqSieve"].map((flow) => <article key={flow}>{flow}</article>)}
      </section>
    </div>
  );
}
