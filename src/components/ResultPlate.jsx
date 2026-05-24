export default function ResultPlate({ title = "Results Summary", summary = {} }) {
  return (
    <section className="panel result-plate">
      <p className="panel-kicker">{title}</p>
      <div className="stat-grid">
        {Object.entries(summary).map(([key, value]) => <div className="stat" key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><strong>{formatValue(value)}</strong></div>)}
      </div>
    </section>
  );
}
function formatValue(value) {
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  return String(value ?? "");
}
