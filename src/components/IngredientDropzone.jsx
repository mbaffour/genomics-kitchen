import { readFileAsText, formatFileSize, largeFileWarnings } from "../lib/fileUtils.js";

export default function IngredientDropzone({ fileName, text, onLoad, sampleLabel = "Load sample data", onSample, onClear }) {
  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await readFileAsText(file);
    onLoad({ name: file.name, text: content, size: file.size, warnings: largeFileWarnings(file) });
  }
  return (
    <section className="panel dropzone">
      <div>
        <p className="panel-kicker">Input File</p>
        <h2>Upload FASTA/FASTQ</h2>
        <p>Files are read locally in your browser. No sequence data are uploaded.</p>
      </div>
      <label className="file-button">
        Choose file
        <input type="file" accept=".fasta,.fa,.faa,.fna,.fastq,.fq,.txt" onChange={handleFile} />
      </label>
      <div className="drop-actions">
        <button className="button secondary" onClick={onSample}>{sampleLabel}</button>
        <button className="button ghost" onClick={onClear}>Clear input</button>
      </div>
      {fileName && <p className="ingredient-note">Loaded: <strong>{fileName}</strong> ({text.length.toLocaleString()} characters{typeof text.size === "number" ? `, ${formatFileSize(text.size)}` : ""})</p>}
    </section>
  );
}
