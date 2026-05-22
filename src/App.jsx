import { useEffect, useState } from "react";
import KitchenShell from "./components/KitchenShell.jsx";
import LandingPage from "./components/LandingPage.jsx";
import TasteTestsPage from "./components/TasteTestsPage.jsx";
import SeqSieve from "./tools/SeqSieve.jsx";
import ReadLens from "./tools/ReadLens.jsx";
import SeqCompare from "./tools/SeqCompare.jsx";
import ORFScout from "./tools/ORFScout.jsx";
import HMMForge from "./tools/HMMForge.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";

export default function App() {
  const [page, setPage] = useState(() => decodeURIComponent(location.hash.replace(/^#/, "")) || "Home");
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    location.hash = encodeURIComponent(page);
  }, [page]);
  const props = { setPage };
  return (
    <WorkspaceProvider>
      <KitchenShell page={page} setPage={setPage} theme={theme} setTheme={setTheme}>
        {page === "Home" && <LandingPage setPage={setPage} />}
        {page === "SeqSieve" && <SeqSieve {...props} />}
        {page === "ReadLens" && <ReadLens {...props} />}
        {page === "SeqCompare" && <SeqCompare {...props} />}
        {page === "ORFScout" && <ORFScout {...props} />}
        {page === "HMMForge" && <HMMForge {...props} />}
        {page === "Taste Tests" && <TasteTestsPage />}
        {page === "About" && <About />}
      </KitchenShell>
    </WorkspaceProvider>
  );
}

function About() {
  return (
    <section className="bench about">
      <header className="bench-header"><div className="brand-mark">GK</div><div><p className="tool-name">About</p><h1>Genomics Kitchen</h1><p>Scientific rigor served with playful clarity.</p></div></header>
      <div className="panel">
        <p>Genomics Kitchen is a browser-only molecular kitchen for preparing raw sequence ingredients into clean, analysis-ready outputs. It has no backend, no server upload, no tracking, no analytics, and no hidden network calls.</p>
        <p>Scientific caveats stay visible: exact deduplication is not clustering, ORF prediction is not gene annotation, FASTQ deduplication can alter apparent abundance, and HMMForge prepares files and command recipes rather than running MAFFT or HMMER in the browser.</p>
      </div>
    </section>
  );
}
