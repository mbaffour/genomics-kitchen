import { useState } from "react";

export default function MethodRecipeCard({ methods, settings }) {
  const [copied, setCopied] = useState(false);
  if (!methods) return null;
  return (
    <section className="method-card">
      <div>
        <p className="panel-kicker">Recipe Card</p>
        <h3>Methods-ready paragraph</h3>
      </div>
      <p>{methods}</p>
      {settings && <pre>{JSON.stringify(settings, null, 2)}</pre>}
      <button className="button secondary" onClick={() => navigator.clipboard?.writeText(methods).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); })}>{copied ? "Copied" : "Copy Methods"}</button>
    </section>
  );
}
