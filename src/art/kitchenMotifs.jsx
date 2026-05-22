function IconShell({ children, className = "" }) {
  return <svg className={`station-icon ${className}`} viewBox="0 0 96 96" aria-hidden="true">{children}</svg>;
}

export function SequenceSifterIcon() {
  return <IconShell><path d="M20 34h56l-8 34H28z" /><path d="M28 42h40M31 52h34M34 62h28" /><text x="24" y="26">A</text><text x="45" y="20">T</text><text x="63" y="29">G</text></IconShell>;
}
export function QualityTastingIcon() {
  return <IconShell><circle cx="42" cy="42" r="20" /><path d="M57 57l18 18" /><path d="M26 66c13 9 30 9 43 0" /><text x="37" y="48">Q</text></IconShell>;
}
export function CuttingBoardIcon() {
  return <IconShell><rect x="18" y="22" width="60" height="52" rx="8" /><path d="M30 36h36M30 48h20M52 48h14M30 60h12M48 60h18" /><circle cx="66" cy="32" r="4" /></IconShell>;
}
export function RecipeFinderIcon() {
  return <IconShell><path d="M16 50c18-24 44 24 64 0" /><path d="M16 62c18-24 44 24 64 0" /><rect x="28" y="20" width="24" height="22" rx="3" /><path d="M32 28h16M32 34h10" /><path d="M62 34v26" /><path d="M62 34h16l-5 8 5 8H62" /></IconShell>;
}
export function ProteinPrepBenchIcon() {
  return <IconShell><path d="M18 68h60" /><path d="M28 60c8-28 32 28 40 0" /><path d="M28 44c8-28 32 28 40 0" /><rect x="18" y="20" width="26" height="18" rx="3" /><text x="23" y="33">HMM</text></IconShell>;
}
