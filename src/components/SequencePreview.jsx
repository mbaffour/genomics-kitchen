export default function SequencePreview({ text = "" }) {
  return <pre className="sequence-preview">{String(text).slice(0, 6000)}{String(text).length > 6000 ? "\n..." : ""}</pre>;
}
