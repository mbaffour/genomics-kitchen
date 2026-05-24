import { CuttingBoardIcon, ProteinPrepBenchIcon, QualityTastingIcon, RecipeFinderIcon, SequenceSifterIcon } from "../art/kitchenMotifs.jsx";

const icons = { SeqSieve: SequenceSifterIcon, ReadLens: QualityTastingIcon, SeqCompare: CuttingBoardIcon, ORFScout: RecipeFinderIcon, HMMForge: ProteinPrepBenchIcon };
const toolImages = {
  SeqSieve: "seqsieve.png",
  ReadLens: "readlens.png",
  SeqCompare: "seqcompare.png",
  ORFScout: "orfscout.png",
  HMMForge: "hmmforge.png",
};

export default function ToolCard({ tool, title, description, onOpen }) {
  const Icon = icons[tool] || SequenceSifterIcon;
  const image = `${import.meta.env.BASE_URL}graphics/tools/${toolImages[tool]}`;
  return (
    <article className="tool-card">
      <div className="tool-media">
        <img src={image} alt="" loading="lazy" />
        <span className="tool-icon-badge"><Icon /></span>
      </div>
      <div>
        <p className="tool-name">{tool}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button className="button secondary" onClick={onOpen}>Open Tool</button>
    </article>
  );
}
