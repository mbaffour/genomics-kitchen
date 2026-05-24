import { useState } from "react";
import KitchenBench from "../components/KitchenBench.jsx";
import MultiIngredientDropzone from "../components/MultiIngredientDropzone.jsx";
import RecipeControls, { Field } from "../components/RecipeControls.jsx";
import ResultPlate from "../components/ResultPlate.jsx";
import WarningPanel from "../components/WarningPanel.jsx";
import ExportPantry from "../components/ExportPantry.jsx";
import MethodRecipeCard from "../components/MethodRecipeCard.jsx";
import DataTable from "../components/DataTable.jsx";
import SequencePreview from "../components/SequencePreview.jsx";
import { CuttingBoardIcon } from "../art/kitchenMotifs.jsx";
import { compareFastaTexts } from "../lib/compareEngine.js";
import { sampleFiles } from "../lib/demoData.js";

export default function SeqCompare({ setPage }) {
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState({ sequenceType: "Auto", compareBy: "sequence", caseSensitive: false, removeWhitespace: true, removeGaps: false, reverseComplement: false, minPresence: "all", representativeSource: "first", includeDuplicateCounts: true, treatDuplicatesAsPresence: true });
  const [result, setResult] = useState(null);
  const set = (patch) => setSettings((old) => ({ ...old, ...patch }));
  function run() { setResult(compareFastaTexts(files, settings)); }
  return (
    <KitchenBench title="SeqCompare" kitchenTitle="Multi-FASTA Comparison" subtitle="Compare multiple FASTA sequence batches by exact sequence, ID, or full record." icon={<CuttingBoardIcon />}>
      <MultiIngredientDropzone files={files} onLoad={(newFiles) => setFiles((old) => [...old, ...newFiles])} onRemove={(i) => setFiles((old) => old.filter((_, idx) => idx !== i))} onRename={(i, label) => setFiles((old) => old.map((f, idx) => idx === i ? { ...f, label } : f))} onSample={() => setFiles(sampleFiles.SeqCompare)} onClear={() => { setFiles([]); setResult(null); }} />
      <RecipeControls>
        <Field label="Sequence type"><select value={settings.sequenceType} onChange={(e) => set({ sequenceType: e.target.value })}><option>Auto</option><option>DNA</option><option>RNA</option><option>Protein</option></select></Field>
        <Field label="Compare by"><select value={settings.compareBy} onChange={(e) => set({ compareBy: e.target.value })}><option value="sequence">Exact sequence content</option><option value="id">Parsed ID</option><option value="record">Full record</option></select></Field>
        <Field label="Minimum file presence"><select value={settings.minPresence} onChange={(e) => set({ minPresence: e.target.value })}><option value="all">Shared by all files</option><option value="n">Present in at least N files</option><option value="selected">Present in selected files</option></select></Field>
        <Field label="Representative source"><select value={settings.representativeSource} onChange={(e) => set({ representativeSource: e.target.value })}><option value="first">First file where sequence appears</option><option value="longest_header">File with longest header</option><option value="priority">User-selected file priority</option></select></Field>
        <Field label="Case-sensitive"><input type="checkbox" checked={settings.caseSensitive} onChange={(e) => set({ caseSensitive: e.target.checked })} /></Field>
        <Field label="Remove whitespace"><input type="checkbox" checked={settings.removeWhitespace} onChange={(e) => set({ removeWhitespace: e.target.checked })} /></Field>
        <Field label="Remove gaps"><input type="checkbox" checked={settings.removeGaps} onChange={(e) => set({ removeGaps: e.target.checked })} /></Field>
        <Field label="Reverse-complement aware"><input type="checkbox" checked={settings.reverseComplement} onChange={(e) => set({ reverseComplement: e.target.checked })} /></Field>
      </RecipeControls>
      <button className="button primary run-button" disabled={files.length < 2} onClick={run}>Compare sequence sets</button>
      {result && <><ResultPlate summary={result.summary} /><section className="panel chart-grid"><MiniStat label="Core" value={result.core.length} /><MiniStat label="Accessory" value={result.accessory.length} /><MiniStat label="File-specific" value={result.fileSpecific.length} /></section><DataTable rows={result.pairwise} /><DataTable rows={result.globalKeys.map((g) => ({ key_id: g.globalKeyId, representative_id: g.representativeId, length: g.representativeLength, presence_count: g.presentInFiles.length, pattern: g.membershipPattern }))} /><SequencePreview text={result.exports.coreFasta} /><WarningPanel warnings={result.warnings} /><MethodRecipeCard methods={result.methods} settings={settings} /><ExportPantry tool="seqcompare" exports={result.exports} /><div className="send-row"><button className="button secondary" onClick={() => setPage("ReadLens")}>Send core FASTA to ReadLens</button><button className="button secondary" onClick={() => setPage("SeqSieve")}>Send accessory FASTA to SeqSieve</button><button className="button secondary" onClick={() => setPage("HMMForge")}>Send selected subset to HMMForge</button></div></>}
    </KitchenBench>
  );
}
function MiniStat({ label, value }) { return <div className="stat big"><span>{label}</span><strong>{value}</strong></div>; }
