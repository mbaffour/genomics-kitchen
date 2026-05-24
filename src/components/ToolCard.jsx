import { CuttingBoardIcon, ProteinPrepBenchIcon, QualityTastingIcon, RecipeFinderIcon, SequenceSifterIcon } from "../art/kitchenMotifs.jsx";

const icons = { SeqSieve: SequenceSifterIcon, ReadLens: QualityTastingIcon, SeqCompare: CuttingBoardIcon, ORFScout: RecipeFinderIcon, HMMForge: ProteinPrepBenchIcon };

export default function ToolCard({ tool, kitchenTitle, description, onOpen, imagePosition = "center" }) {
  const Icon = icons[tool] || SequenceSifterIcon;
  const stationStrip = `${import.meta.env.BASE_URL}graphics/station-vignettes.png`;
  return (
    <article className="tool-card">
      <div className="tool-media">
        <img src={stationStrip} alt="" style={{ objectPosition: imagePosition }} loading="lazy" />
        <span className="tool-icon-badge"><Icon /></span>
      </div>
      <div>
        <p className="tool-name">{tool}</p>
        <h3>{kitchenTitle}</h3>
        <p>{description}</p>
      </div>
      <button className="button secondary" onClick={onOpen}>Open Station</button>
    </article>
  );
}
