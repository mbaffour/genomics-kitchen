import { useState } from "react";
import KitchenBench from "../components/KitchenBench.jsx";
import IngredientDropzone from "../components/IngredientDropzone.jsx";
import RecipeControls, { Field } from "../components/RecipeControls.jsx";
import ResultPlate from "../components/ResultPlate.jsx";
import WarningPanel from "../components/WarningPanel.jsx";
import ExportPantry from "../components/ExportPantry.jsx";
import MethodRecipeCard from "../components/MethodRecipeCard.jsx";
import DataTable from "../components/DataTable.jsx";
import HelpDrawer from "../components/HelpDrawer.jsx";
import { QualityTastingIcon } from "../art/kitchenMotifs.jsx";
import { runQC } from "../lib/qcEngine.js";
import { sampleFiles } from "../lib/demoData.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function ReadLens({ setPage }) {
  const [input, setInput] = useState({ name: "", text: "" });
  const [settings, setSettings] = useState({ format: "Auto", sequenceType: "Auto", lowQualityThreshold: 20, nThreshold: 5, minLength: 0, caseSensitive: false, reverseComplement: false });
  const [result, setResult] = useState(null);
  const { updateWorkspace } = useWorkspace();
  const set = (patch) => setSettings((old) => ({ ...old, ...patch }));
  function run() {
    const out = runQC(input.text, settings);
    setResult(out);
    updateWorkspace({ currentFileName: input.name, currentSequenceType: out.sequenceType, lastReport: out.exports.report });
  }
  return (
    <KitchenBench title="ReadLens" kitchenTitle="Sequence Quality Control" subtitle="FASTA/FASTQ quality inspection for sequence length, composition, duplication, and parser warnings." icon={<QualityTastingIcon />}>
      <IngredientDropzone fileName={input.name} text={input.text} onLoad={setInput} onSample={() => setInput(sampleFiles.ReadLens)} onClear={() => { setInput({ name: "", text: "" }); setResult(null); }} />
      <RecipeControls>
        <Field label="Format"><select value={settings.format} onChange={(e) => set({ format: e.target.value })}><option>Auto</option><option>FASTA</option><option>FASTQ</option></select></Field>
        <Field label="Sequence type"><select value={settings.sequenceType} onChange={(e) => set({ sequenceType: e.target.value })}><option>Auto</option><option>DNA</option><option>RNA</option><option>Protein</option></select></Field>
        <Field label="Low-quality Q threshold"><input type="number" value={settings.lowQualityThreshold} onChange={(e) => set({ lowQualityThreshold: e.target.value })} /></Field>
        <Field label="N-content warning %"><input type="number" value={settings.nThreshold} onChange={(e) => set({ nThreshold: e.target.value })} /></Field>
        <Field label="Minimum length warning"><input type="number" value={settings.minLength} onChange={(e) => set({ minLength: e.target.value })} /></Field>
        <Field label="Case-sensitive duplicate check"><input type="checkbox" checked={settings.caseSensitive} onChange={(e) => set({ caseSensitive: e.target.checked })} /></Field>
        <Field label="Reverse-complement duplicate estimate"><input type="checkbox" checked={settings.reverseComplement} onChange={(e) => set({ reverseComplement: e.target.checked })} /></Field>
      </RecipeControls>
      <button className="button primary run-button" disabled={!input.text} onClick={run}>Inspect quality</button>
      {result && <><ResultPlate summary={result.summary} /><ChartPanel charts={result.charts} /><DataTable rows={result.recordMetrics} /><DataTable rows={result.duplicates} /><WarningPanel warnings={result.warnings} /><MethodRecipeCard methods={result.methods} settings={settings} /><ExportPantry tool="readlens" exports={result.exports} /><button className="button secondary" onClick={() => setPage("SeqSieve")}>Send to SeqSieve</button></>}
      <HelpDrawer><p>Duplicate reads are a signal to interpret, not an automatic failure. Protein inputs skip GC/N as biological metrics.</p></HelpDrawer>
    </KitchenBench>
  );
}

function ChartPanel({ charts }) {
  return <section className="panel chart-grid">{Object.entries(charts).map(([name, bins]) => <div key={name}><h3>{name}</h3><div className="bars">{bins.map((b, i) => <span key={i} style={{ height: `${Math.max(6, b.count * 14)}px` }} title={`${b.start.toFixed(1)}-${b.end.toFixed(1)}: ${b.count}`} />)}</div></div>)}</section>;
}
