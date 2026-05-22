export default function WarningPanel({ warnings = [] }) {
  if (!warnings.length) return null;
  return <section className="warning-panel"><h3>Kitchen Safety Notes</h3><ul>{warnings.slice(0, 12).map((w, i) => <li key={i}>{w}</li>)}</ul></section>;
}
