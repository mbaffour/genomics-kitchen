import { useState } from "react";
import DataTable from "./DataTable.jsx";
import { runValidationTests } from "../lib/validationTests.js";

export default function TasteTestsPage() {
  const [tests, setTests] = useState([]);
  const passed = tests.filter((t) => t.pass).length;
  return (
    <section className="bench">
      <header className="bench-header">
        <div className="brand-mark">TT</div>
        <div><p className="tool-name">Validation</p><h1>Validation Tests</h1><p>Run browser-side parser, sequence utility, tool-engine, and export checks. Failures are shown, not hidden.</p></div>
      </header>
      <button className="button primary" onClick={() => setTests(runValidationTests())}>Run validation tests</button>
      {tests.length > 0 && <p className="privacy-badge">{passed} of {tests.length} tests passing</p>}
      <DataTable rows={tests} columns={["name", "expected", "observed", "pass", "notes"]} />
    </section>
  );
}
