export default function RecipeControls({ children }) {
  return <section className="panel controls"><p className="panel-kicker">Analysis Settings</p><div className="control-grid">{children}</div></section>;
}

export function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
