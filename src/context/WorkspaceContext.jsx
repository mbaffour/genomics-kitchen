import React, { createContext, useContext, useMemo, useState } from "react";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState({
    currentFileName: "",
    currentSequenceType: "Auto",
    lastFASTAOutput: "",
    lastFASTQOutput: "",
    lastProteinOutput: "",
    lastReport: "",
    recentOutputs: [],
  });
  const updateWorkspace = (patch) => setWorkspace((old) => ({ ...old, ...patch, recentOutputs: patch.recentOutputs || old.recentOutputs }));
  const addOutput = (output) => setWorkspace((old) => ({ ...old, recentOutputs: [output, ...old.recentOutputs].slice(0, 8) }));
  const clearWorkspace = () => setWorkspace({ currentFileName: "", currentSequenceType: "Auto", lastFASTAOutput: "", lastFASTQOutput: "", lastProteinOutput: "", lastReport: "", recentOutputs: [] });
  const value = useMemo(() => ({ workspace, updateWorkspace, addOutput, clearWorkspace }), [workspace]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export const useWorkspace = () => useContext(WorkspaceContext);
