export default function IngredientJar({ label, onClick }) {
  return <button className="ingredient-jar export-jar" onClick={onClick}><span className="jar-lid" /><strong>{label}</strong><small>Download</small></button>;
}
