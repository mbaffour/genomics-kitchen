import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function WorkflowPanel({ setPage }) {
  const { workspace, clearWorkspace } = useWorkspace();
  return (
    <aside className="workflow-panel" aria-label="Analysis workflow">
      <p className="panel-kicker">Workflow</p>
      <strong>{workspace.currentFileName || "No active input"}</strong>
      <span>{workspace.currentSequenceType}</span>
      <div className="workflow-actions">
        {["ReadLens", "SeqSieve", "SeqCompare", "ORFScout", "HMMForge"].map((tool) => <button key={tool} onClick={() => setPage(tool)}>{tool}</button>)}
      </div>
      <button className="button ghost" onClick={clearWorkspace}>Clear workflow</button>
    </aside>
  );
}
