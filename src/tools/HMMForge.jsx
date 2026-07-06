import { useState } from "react";
import KitchenBench from "../components/KitchenBench.jsx";
import IngredientDropzone from "../components/IngredientDropzone.jsx";
import RecipeControls, { Field } from "../components/RecipeControls.jsx";
import ResultPlate from "../components/ResultPlate.jsx";
import WarningPanel from "../components/WarningPanel.jsx";
import ExportPantry from "../components/ExportPantry.jsx";
import MethodRecipeCard from "../components/MethodRecipeCard.jsx";
import DataTable from "../components/DataTable.jsx";
import SequencePreview from "../components/SequencePreview.jsx";
import { ProteinPrepBenchIcon } from "../art/kitchenMotifs.jsx";
import { runHMMForge } from "../lib/hmmPrepEngine.js";
import { sampleFiles } from "../lib/demoData.js";

export default function HMMForge({ setPage }) {
  const [input, setInput] = useState({ name: "", text: "" });
  const [settings, setSettings] = useState({ dedupe: true, minLength: 10, maxLength: 2000, removeBelowMin: false, removeAboveMax: false, maxX: 20, maxGaps: 50, trimTerminalStop: true });
  const [result, setResult] = useState(null);
  const set = (patch) => setSettings((old) => ({ ...old, ...patch }));
  function run() { setResult(runHMMForge(input.text, settings)); }
  return (
    <KitchenBench title="HMMForge" kitchenTitle="Protein Family Preparation" subtitle="Prepare protein families for alignment and profile HMM workflows." icon={<ProteinPrepBenchIcon />}>
      <IngredientDropzone fileName={input.name} text={input.text} onLoad={setInput} onSample={() => setInput(sampleFiles.HMMForge)} onClear={() => { setInput({ name: "", text: "" }); setResult(null); }} />
      <RecipeControls>
        <Field label="Exact protein deduplication"><input type="checkbox" checked={settings.dedupe} onChange={(e) => set({ dedupe: e.target.checked })} /></Field>
        <Field label="Minimum amino acid length"><input type="number" value={settings.minLength} onChange={(e) => set({ minLength: e.target.value })} /></Field>
        <Field label="Maximum amino acid length"><input type="number" value={settings.maxLength} onChange={(e) => set({ maxLength: e.target.value })} /></Field>
        <Field label="Remove below minimum"><input type="checkbox" checked={settings.removeBelowMin} onChange={(e) => set({ removeBelowMin: e.target.checked })} /></Field>
        <Field label="Remove above maximum"><input type="checkbox" checked={settings.removeAboveMax} onChange={(e) => set({ removeAboveMax: e.target.checked })} /></Field>
        <Field label="Maximum percent X"><input type="number" value={settings.maxX} onChange={(e) => set({ maxX: e.target.value })} /></Field>
        <Field label="Maximum percent gaps"><input type="number" value={settings.maxGaps} onChange={(e) => set({ maxGaps: e.target.value })} /></Field>
        <Field label="Trim terminal stop"><input type="checkbox" checked={settings.trimTerminalStop} onChange={(e) => set({ trimTerminalStop: e.target.checked })} /></Field>
      </RecipeControls>
      <button className="button primary run-button" disabled={!input.text} onClick={run}>Prepare protein family</button>
      {result && <><ResultPlate summary={result.summary} /><DataTable rows={result.classifications} columns={["originalIndex", "originalId", "safeId", "length", "percentX", "percentGaps", "hasInternalStop", "lengthOutlierStatus", "decision", "reasons"]} caption="Per-protein classification (length in aa, X %, gap %, keep/remove decision)" csvName="hmmforge_classifications" /><SequencePreview text={result.commands} /><WarningPanel warnings={result.warnings} /><MethodRecipeCard methods={result.methods} settings={settings} /><ExportPantry tool="hmmforge" exports={result.exports} /><div className="send-row"><button className="button secondary" onClick={() => setPage("ReadLens")}>Send cleaned protein FASTA to ReadLens</button><button className="button secondary" onClick={() => setPage("SeqSieve")}>Send cleaned protein FASTA to SeqSieve</button></div></>}
    </KitchenBench>
  );
}
