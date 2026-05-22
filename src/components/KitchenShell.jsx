import ThemeToggle from "./ThemeToggle.jsx";
import LiveKitchenArt from "./LiveKitchenArt.jsx";
import WorkflowPanel from "./WorkflowPanel.jsx";

const nav = ["Home", "SeqSieve", "ReadLens", "SeqCompare", "ORFScout", "HMMForge", "Taste Tests", "About"];

export default function KitchenShell({ page, setPage, theme, setTheme, children }) {
  return (
    <div className="app-shell">
      <LiveKitchenArt />
      <header className="topbar">
        <button className="brand" onClick={() => setPage("Home")}><span className="brand-mark">GK</span><span>Genomics Kitchen</span></button>
        <nav aria-label="Main navigation">
          {nav.map((item) => <button key={item} className={page === item ? "active" : ""} onClick={() => setPage(item)}>{item}</button>)}
        </nav>
        <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
      </header>
      <main>{children}</main>
      <WorkflowPanel setPage={setPage} />
    </div>
  );
}
