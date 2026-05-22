import { CuttingBoardIcon, ProteinPrepBenchIcon, QualityTastingIcon, RecipeFinderIcon, SequenceSifterIcon } from "../art/kitchenMotifs.jsx";

const icons = { SeqSieve: SequenceSifterIcon, ReadLens: QualityTastingIcon, SeqCompare: CuttingBoardIcon, ORFScout: RecipeFinderIcon, HMMForge: ProteinPrepBenchIcon };

export default function ToolCard({ tool, kitchenTitle, description, onOpen }) {
  const Icon = icons[tool] || SequenceSifterIcon;
  return (
    <article className="tool-card">
      <Icon />
      <div>
        <p className="tool-name">{tool}</p>
        <h3>{kitchenTitle}</h3>
        <p>{description}</p>
      </div>
      <button className="button secondary" onClick={onOpen}>Open Station</button>
    </article>
  );
}
