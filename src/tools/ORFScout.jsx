import { useState } from "react";
import KitchenBench from "../components/KitchenBench.jsx";
import IngredientDropzone from "../components/IngredientDropzone.jsx";
import RecipeControls, { Field } from "../components/RecipeControls.jsx";
import ResultPlate from "../components/ResultPlate.jsx";
import WarningPanel from "../components/WarningPanel.jsx";
import ExportPantry from "../components/ExportPantry.jsx";
import MethodRecipeCard from "../components/MethodRecipeCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { RecipeFinderIcon } from "../art/kitchenMotifs.jsx";
import { runORFScout } from "../lib/orfEngine.js";
import { sampleFiles } from "../lib/demoData.js";

export default function ORFScout({ setPage }) {
  const [input, setInput] = useState({ name: "", text: "" });
  const [settings, setSettings] = useState({ geneticCode: "standard", minNt: 90, minAa: 30, startCodons: ["ATG"], stopCodons: ["TAA", "TAG", "TGA"], mode: "start-stop", includePartial: false, strand: "both" });
  const [result, setResult] = useState(null);
  const set = (patch) => setSettings((old) => ({ ...old, ...patch }));
  function run() { setResult(runORFScout(input.text, settings)); }
  return (
    <KitchenBench title="ORFScout" kitchenTitle="Gene Recipe Finder" subtitle="ORF discovery and six-frame translation for nucleotide sequences." icon={<RecipeFinderIcon />}>
      <IngredientDropzone fileName={input.name} text={input.text} onLoad={setInput} onSample={() => setInput(sampleFiles.ORFScout)} onClear={() => { setInput({ name: "", text: "" }); setResult(null); }} />
      <RecipeControls>
        <Field label="Genetic code"><select value={settings.geneticCode} onChange={(e) => set({ geneticCode: e.target.value })}><option value="standard">Standard code</option><option value="bacterial">Bacterial/archaeal/plastid code</option></select></Field>
        <Field label="Minimum ORF length (nt)"><input type="number" value={settings.minNt} onChange={(e) => set({ minNt: e.target.value })} /></Field>
        <Field label="Search mode"><select value={settings.mode} onChange={(e) => set({ mode: e.target.value })}><option value="start-stop">Start-to-stop ORFs</option><option value="stop-stop">Stop-to-stop ORFs</option><option value="translation">Six-frame translation only</option></select></Field>
        <Field label="Strand"><select value={settings.strand} onChange={(e) => set({ strand: e.target.value })}><option value="both">Both</option><option value="forward">Forward</option><option value="reverse">Reverse</option></select></Field>
        <Field label="ATG start"><input type="checkbox" checked={settings.startCodons.includes("ATG")} onChange={(e) => set({ startCodons: toggle(settings.startCodons, "ATG", e.target.checked) })} /></Field>
        <Field label="GTG start"><input type="checkbox" checked={settings.startCodons.includes("GTG")} onChange={(e) => set({ startCodons: toggle(settings.startCodons, "GTG", e.target.checked) })} /></Field>
        <Field label="TTG start"><input type="checkbox" checked={settings.startCodons.includes("TTG")} onChange={(e) => set({ startCodons: toggle(settings.startCodons, "TTG", e.target.checked) })} /></Field>
        <Field label="Include partial ORFs"><input type="checkbox" checked={settings.includePartial} onChange={(e) => set({ includePartial: e.target.checked })} /></Field>
      </RecipeControls>
      <button className="button primary run-button" disabled={!input.text} onClick={run}>Find Recipes</button>
      {result && <><ResultPlate summary={result.summary} /><GenomeTrack orfs={result.orfs} /><DataTable rows={result.orfs.map((o) => ({ orf_id: o.orfId, record_id: o.recordId, strand: o.strand, frame: o.frame, start: o.start, end: o.end, length_nt: o.lengthNt, length_aa: o.lengthAa, start_codon: o.startCodon, stop_codon: o.stopCodon, partial_start: o.partialStart, partial_stop: o.partialStop }))} /><WarningPanel warnings={result.warnings} /><MethodRecipeCard methods={result.methods} settings={settings} /><ExportPantry tool="orfscout" exports={result.exports} /><div className="send-row"><button className="button secondary" onClick={() => setPage("HMMForge")}>Send protein ORF FASTA to HMMForge</button><button className="button secondary" onClick={() => setPage("ReadLens")}>Send nucleotide ORF FASTA to ReadLens</button></div></>}
    </KitchenBench>
  );
}
function toggle(list, item, checked) { return checked ? [...new Set([...list, item])] : list.filter((x) => x !== item); }
function GenomeTrack({ orfs }) {
  const maxEnd = Math.max(1, ...orfs.map((o) => o.end));
  return <section className="panel genome-track"><p>Coordinates are 1-based inclusive.</p>{orfs.slice(0, 80).map((o) => <span key={o.orfId} className={o.strand === "+" ? "orf forward" : "orf reverse"} style={{ left: `${(Math.min(o.start, o.end) / maxEnd) * 100}%`, width: `${(o.lengthNt / maxEnd) * 100}%` }} title={`${o.orfId} ${o.start}-${o.end}`} />)}</section>;
}
