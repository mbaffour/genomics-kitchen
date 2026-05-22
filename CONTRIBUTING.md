# Contributing

Thanks for helping improve Genomics Kitchen.

## Bugs

Open a GitHub issue with the affected tool, browser/OS, input format, expected behavior, observed behavior, screenshots if useful, and a small non-sensitive example file if safe.

## Features

Describe the scientific workflow, why the feature matters, and alternatives you considered.

## Code

Use React, Vite, JavaScript, HTML, and CSS. Keep biological logic in vanilla ES modules under `src/lib`. Do not add a backend or upload sequence data.

## Tests

Add or update Taste Tests in `src/lib/validationTests.js` when changing parser behavior, sequence logic, exports, or scientific definitions.

## Scientific Validation

Do not overclaim. Exact deduplication is not clustering, ORF prediction is not gene annotation, and HMMForge does not run HMMER in the browser.

## Privacy

No tracking, analytics, hidden network calls, eval, unsafe HTML injection, or user sequence upload.
