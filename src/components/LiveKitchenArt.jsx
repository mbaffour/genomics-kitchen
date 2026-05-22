export default function LiveKitchenArt() {
  const letters = ["A", "T", "G", "C", "M", "K", "Q", "R"];
  return (
    <div className="live-art" aria-hidden="true">
      <svg viewBox="0 0 900 520" role="img">
        <path className="steam steam-a" d="M100,460 C180,360 90,300 180,210 C250,140 170,90 260,30" />
        <path className="steam steam-b" d="M430,500 C510,390 410,310 520,210 C610,130 520,80 660,18" />
        <path className="steam steam-c" d="M720,480 C650,380 760,300 690,215 C630,142 760,70 700,18" />
        <g className="grid-lines">{Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 80} x2={i * 80} y1="80" y2="500" />)}</g>
        <g className="phage-shape"><circle cx="720" cy="150" r="26" /><path d="M720 176v70M690 210h60M704 244l-36 46M736 244l36 46" /></g>
      </svg>
      {letters.map((letter, i) => <span key={letter + i} className="float-letter" style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 0.7}s` }}>{letter}</span>)}
    </div>
  );
}
