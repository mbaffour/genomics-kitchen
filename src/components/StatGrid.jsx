export default function StatGrid({ stats }) {
  return <div className="stat-grid">{Object.entries(stats || {}).map(([k, v]) => <div className="stat" key={k}><span>{k}</span><strong>{String(v)}</strong></div>)}</div>;
}
