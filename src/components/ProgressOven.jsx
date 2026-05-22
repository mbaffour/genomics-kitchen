export default function ProgressOven({ stages = [], active = false }) {
  return (
    <section className="panel progress-oven" aria-live="polite">
      <p className="panel-kicker">Cooking Progress</p>
      <div className={active ? "oven active" : "oven"}><span /></div>
      <ol>{stages.map((stage, i) => <li key={stage} className={active || i === stages.length - 1 ? "done" : ""}>{stage}</li>)}</ol>
    </section>
  );
}
