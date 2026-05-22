export default function ThemeToggle({ theme, onToggle }) {
  return <button className="icon-button" onClick={onToggle} aria-label="Toggle theme" title="Toggle theme">{theme === "dark" ? "☀" : "☾"}</button>;
}
