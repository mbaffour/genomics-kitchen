import { useState } from "react";
import KitchenBench from "../components/KitchenBench.jsx";
import IngredientDropzone from "../components/IngredientDropzone.jsx";
import RecipeControls, { Field } from "../components/RecipeControls.jsx";
import ProgressOven from "../components/ProgressOven.jsx";
import ResultPlate from "../components/ResultPlate.jsx";
import WarningPanel from "../components/WarningPanel.jsx";
import ExportPantry from "../components/ExportPantry.jsx";
import MethodRecipeCard from "../components/MethodRecipeCard.jsx";
import DataTable from "../components/DataTable.jsx";
import SequencePreview from "../components/SequencePreview.jsx";
import HelpDrawer from "../components/HelpDrawer.jsx";
import { SequenceSifterIcon } from "../art/kitchenMotifs.jsx";
import { runDedupe } from "../lib/dedupeEngine.js";
import { sampleFiles } from "../lib/demoData.js";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

const stages = ["Reading input", "Parsing records", "Normalizing sequences", "Grouping exact duplicates", "Selecting representatives", "Preparing exports"];

export default function SeqSieve({ setPage }) {
  const [input, setInput] = useState({ name: "", text: "" });
  const [settings, setSettings] = useState({ format: "Auto", sequenceType: "Auto", dedupeMode: "sequence", caseSensitive: false, removeWhitespace: true, removeGaps: false, reverseComplement: false, representativeRule: "first", renamePrefix: "rep_", wrap: 80 });
  const [result, setResult] = useState(null);
  const { updateWorkspace, addOutput } = useWorkspace();
  const set = (patch) => setSettings((old) => ({ ...old, ...patch }));
  function run() {
    const out = runDedupe(input.text, settings);
    setResult(out);
    updateWorkspace({ currentFileName: input.name, currentSequenceType: out.sequenceType, lastFASTAOutput: out.exports.fasta, lastFASTQOutput: out.exports.fastq, lastProteinOutput: out.sequenceType === "Protein" ? out.exports.fasta : "", lastReport: out.exports.report });
    addOutput({ tool: "SeqSieve", name: "deduplicated FASTA", text: out.exports.fasta });
  }
  return (
    <KitchenBench title="SeqSieve" kitchenTitle="Exact Deduplication" subtitle="Exact FASTA/FASTQ deduplication with counts, mappings, duplicate groups, and reproducibility reports." icon={<SequenceSifterIcon />}>
      <IngredientDropzone fileName={input.name} text={input.text} onLoad={setInput} onSample={() => setInput(sampleFiles.SeqSieve)} onClear={() => { setInput({ name: "", text: "" }); setResult(null); }} />
      <RecipeControls>
        <Field label="Format"><select value={settings.format} onChange={(e) => set({ format: e.target.value })}><option>Auto</option><option>FASTA</option><option>FASTQ</option></select></Field>
        <Field label="Sequence type"><select value={settings.sequenceType} onChange={(e) => set({ sequenceType: e.target.value })}><option>Auto</option><option>DNA</option><option>RNA</option><option>Protein</option></select></Field>
        <Field label="Deduplication mode"><select value={settings.dedupeMode} onChange={(e) => set({ dedupeMode: e.target.value })}><option value="sequence">Sequence content</option><option value="id">Sequence ID</option><option value="record">Full record</option></select></Field>
        <Field label="Representative rule"><select value={settings.representativeRule} onChange={(e) => set({ representativeRule: e.target.value })}><option value="first">First occurrence</option><option value="longest_sequence">Longest sequence</option><option value="longest_header">Longest header</option><option value="highest_mean_quality">Highest mean quality</option><option value="rename">Rename representatives</option></select></Field>
        <Field label="Rename prefix"><input value={settings.renamePrefix} onChange={(e) => set({ renamePrefix: e.target.value })} /></Field>
        <Field label="FASTA wrap"><select value={settings.wrap} onChange={(e) => set({ wrap: e.target.value })}><option value="60">60</option><option value="80">80</option><option value="none">no wrap</option></select></Field>
        <Field label="Case-sensitive"><input type="checkbox" checked={settings.caseSensitive} onChange={(e) => set({ caseSensitive: e.target.checked })} /></Field>
        <Field label="Remove whitespace"><input type="checkbox" checked={settings.removeWhitespace} onChange={(e) => set({ removeWhitespace: e.target.checked })} /></Field>
        <Field label="Remove gaps"><input type="checkbox" checked={settings.removeGaps} onChange={(e) => set({ removeGaps: e.target.checked })} /></Field>
        <Field label="Reverse-complement aware"><input type="checkbox" checked={settings.reverseComplement} onChange={(e) => set({ reverseComplement: e.target.checked })} /></Field>
      </RecipeControls>
      <button className="button primary run-button" disabled={!input.text} onClick={run}>Deduplicate sequences</button>
      <ProgressOven stages={stages} active={Boolean(result)} />
      {result && <><ResultPlate summary={{ ...result.summary, runtime: "browser local" }} /><Tabs sections={{
        "Deduplicated FASTA/FASTQ": <SequencePreview text={result.format === "FASTQ" ? result.exports.fastq : result.exports.fasta} />,
        "Duplicate groups": <DataTable rows={result.duplicateGroups.map((g) => ({ group_id: g.groupId, representative_id: g.representativeId, count: g.count, key_hash: g.keyHash }))} caption="Duplicate sequence groups (member count per group)" csvName="seqsieve_duplicate_groups" />,
        "Mapping table": <DataTable rows={result.mappingRows} caption="Original-to-representative sequence mapping" csvName="seqsieve_mapping" />,
        "Counts": <DataTable rows={result.countRows} caption="Sequence counts before and after deduplication" csvName="seqsieve_counts" />,
        "JSON metadata": <SequencePreview text={result.exports.json} />,
      }} /><WarningPanel warnings={result.warnings} /><MethodRecipeCard methods={result.methods} settings={settings} /><ExportPantry tool="seqsieve" exports={result.exports} /><div className="send-row"><button className="button secondary" onClick={() => setPage("ReadLens")}>Send deduplicated FASTA to ReadLens</button><button className="button secondary" onClick={() => setPage("SeqCompare")}>Send deduplicated FASTA to SeqCompare</button><button className="button secondary" onClick={() => setPage("HMMForge")}>Send deduplicated protein FASTA to HMMForge</button></div></>}
      <HelpDrawer><p>SeqSieve performs exact deduplication. It is not CD-HIT, MMseqs2, VSEARCH, BLAST, or HMMER clustering.</p></HelpDrawer>
    </KitchenBench>
  );
}

function Tabs({ sections }) {
  const [tab, setTab] = useState(Object.keys(sections)[0]);
  return <section className="panel"><div className="tabs">{Object.keys(sections).map((name) => <button key={name} className={tab === name ? "active" : ""} onClick={() => setTab(name)}>{name}</button>)}</div>{sections[tab]}</section>;
}
