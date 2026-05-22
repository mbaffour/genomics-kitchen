import { downloadTextFile, timestampedFilename } from "../lib/exporters.js";
import IngredientJar from "./IngredientJar.jsx";

export default function ExportPantry({ tool, exports = {} }) {
  const entries = Object.entries(exports).filter(([, value]) => value);
  if (!entries.length) return null;
  return (
    <section className="panel export-pantry">
      <p className="panel-kicker">Pack to Pantry</p>
      <div className="jar-grid">
        {entries.map(([key, value]) => {
          const ext = key.toLowerCase().includes("json") ? "json" : key.toLowerCase().includes("tsv") ? "tsv" : key.toLowerCase().includes("commands") ? "sh" : key.toLowerCase().includes("fastq") ? "fastq" : key.toLowerCase().includes("fasta") ? "fasta" : "txt";
          return <IngredientJar key={key} label={key} onClick={() => downloadTextFile(timestampedFilename(`genomics-kitchen_${tool}_${key}`, ext), value)} />;
        })}
      </div>
    </section>
  );
}
