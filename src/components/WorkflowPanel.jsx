import { useWorkspace } from "../context/WorkspaceContext.jsx";

export default function WorkflowPanel({ setPage }) {
  const { workspace, clearWorkspace } = useWorkspace();
  return (
    <aside className="workflow-panel" aria-label="Kitchen workflow">
      <p className="panel-kicker">Kitchen Workflow</p>
      <strong>{workspace.currentFileName || "No active ingredient batch"}</strong>
      <span>{workspace.currentSequenceType}</span>
      <div className="workflow-actions">
        {["ReadLens", "SeqSieve", "SeqCompare", "ORFScout", "HMMForge"].map((tool) => <button key={tool} onClick={() => setPage(tool)}>{tool}</button>)}
      </div>
      <button className="button ghost" onClick={clearWorkspace}>Clear Kitchen</button>
    </aside>
  );
}
