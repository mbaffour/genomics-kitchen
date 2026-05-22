export default function DataTable({ rows = [], columns, limit = 150 }) {
  const cols = columns || Object.keys(rows[0] || {});
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.slice(0, limit).map((row, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(row[c] ?? "")}</td>)}</tr>)}</tbody>
      </table>
      {rows.length > limit && <p className="table-note">Previewing {limit} of {rows.length.toLocaleString()} rows. Exports contain full data.</p>}
    </div>
  );
}
