import { downloadTextFile, timestampedFilename, exportCSV } from "../lib/exporters.js";

// Tabular view of quantitative results. `limit` caps the on-screen preview, but
// CSV export always contains the full row set so numeric panels are
// spreadsheet-ready for downstream analysis / figures.
export default function DataTable({ rows = [], columns, limit = 150, caption, csvName = "table" }) {
  const cols = columns || Object.keys(rows[0] || {});
  if (!rows.length) return null;
  function exportCsv() {
    downloadTextFile(timestampedFilename(`genomics-kitchen_${csvName}`, "csv"), exportCSV(rows, cols), "text/csv");
  }
  return (
    <div className="table-block">
      <div className="table-block-head">
        {caption && <span className="table-caption">{caption}</span>}
        <button type="button" className="button ghost table-csv" onClick={exportCsv}>Download CSV ({rows.length.toLocaleString()} rows)</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{rows.slice(0, limit).map((row, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(row[c] ?? "")}</td>)}</tr>)}</tbody>
        </table>
        {rows.length > limit && <p className="table-note">Previewing {limit} of {rows.length.toLocaleString()} rows. Downloaded CSV and exports contain full data.</p>}
      </div>
    </div>
  );
}
