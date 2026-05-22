import { readFileAsText, formatFileSize } from "../lib/fileUtils.js";

export default function MultiIngredientDropzone({ files, onLoad, onRemove, onSample, onRename, onClear }) {
  async function handleFiles(event) {
    const selected = [...(event.target.files || [])];
    const loaded = await Promise.all(selected.map(async (file) => ({ name: file.name, label: file.name.replace(/\.[^.]+$/, ""), text: await readFileAsText(file), size: file.size })));
    onLoad(loaded);
  }
  return (
    <section className="panel dropzone">
      <p className="panel-kicker">Ingredient Rack</p>
      <h2>Upload two or more FASTA files</h2>
      <label className="file-button">Choose FASTA files<input type="file" multiple accept=".fasta,.fa,.faa,.fna,.fas,.txt" onChange={handleFiles} /></label>
      <div className="drop-actions">
        <button className="button secondary" onClick={onSample}>Load Sample Ingredients</button>
        <button className="button ghost" onClick={onClear}>Clear rack</button>
      </div>
      <div className="jar-grid">
        {files.map((file, i) => (
          <div className="ingredient-jar" key={file.name + i}>
            <strong>{file.name}</strong>
            <span>{formatFileSize(file.size || file.text.length)}</span>
            <input value={file.label || file.name} aria-label={`Rename ${file.name}`} onChange={(e) => onRename(i, e.target.value)} />
            <button className="button ghost" onClick={() => onRemove(i)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}
