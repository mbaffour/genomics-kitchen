export const APP_VERSION = "0.1.0";

export function generateMethods(toolName, settings = {}, summary = {}) {
  const mode = settings.mode || settings.compareBy || settings.dedupeMode || "exact sequence content";
  const caveat = toolName === "HMMForge"
    ? "HMMForge prepared input files and command recipes; external alignment and HMMER tools were not run in the browser."
    : toolName === "ORFScout"
      ? "ORFs were reported as candidate open reading frames, not functional gene annotations."
      : "Exact matching was used where relevant; similar but non-identical sequences require alignment, clustering, or homology tools.";
  return `${toolName} in Genomics Kitchen v${APP_VERSION} was used with ${mode} settings. Original identifiers, headers, counts, warnings, and selected parameters were preserved in exported reports where applicable. ${caveat}`;
}

export function generateReport({ toolName, input = {}, settings = {}, summary = {}, warnings = [], methods = "" }) {
  return [
    "Genomics Kitchen",
    `Tool: ${toolName}`,
    `Version: ${APP_VERSION}`,
    `Date/time: ${new Date().toISOString()}`,
    "",
    "Input metadata",
    JSON.stringify(input, null, 2),
    "",
    "Settings",
    JSON.stringify(settings, null, 2),
    "",
    "Results summary",
    JSON.stringify(summary, null, 2),
    "",
    "Warnings",
    warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "None reported.",
    "",
    "Methods-ready paragraph",
    methods || generateMethods(toolName, settings, summary),
    "",
    "Scientific caveats",
    "- Exact deduplication is not clustering.",
    "- ORF prediction is not gene annotation.",
    "- FASTQ deduplication can alter apparent abundance; keep count tables.",
    "- HMMForge prepares files and command recipes; it does not run HMMER in the browser.",
  ].join("\n");
}

export function reproducibilityJSON(payload) {
  return { app: "Genomics Kitchen", version: APP_VERSION, generatedAt: new Date().toISOString(), ...payload };
}
