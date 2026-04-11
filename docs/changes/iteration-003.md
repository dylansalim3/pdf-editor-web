# Iteration 003 — Add minimal e2e spec for upload -> preview smoke check

Summary
-------

This iteration adds a minimal Protractor e2e spec that navigates to the upload route and verifies the presence of an upload input. The goal is to create a very small, verifiable end-to-end test to bootstrap automated UI-testing and allow the next agent run to execute it and observe failures (if any).

What I changed
--------------

- Added `e2e/src/upload-preview.e2e-spec.ts` — a lightweight Protractor spec that opens `/upload` and asserts an upload input is present on the page.
- Added this markdown documenting the iteration and next steps.

Why this is small and verifiable
-------------------------------

The new test does not attempt to upload files or depend on fixtures, which reduces flakiness and platform-specific path requirements. It is intended as a smoke test to verify the e2e harness runs and the upload UI exists. A follow-up iteration will add a full upload->preview flow, fixtures, and robust waits for PDF rendering.

Next steps
----------

1. Run `npm run e2e` to execute the new spec (Angular CLI + Protractor must be able to start the dev server).
2. If the test passes, create a feature branch and open a PR. If it fails, capture logs and update the UI-testing plan with failure modes.
3. Add `e2e/fixtures/sample-3page.pdf` and a second spec that performs an actual file upload and preview verification.

Notes
-----

Protractor is present in this repository and wired via `angular.json`. Protractor is deprecated but for a minimal incremental iteration it provides a low-friction way to run an initial smoke test; plan a migration to Playwright/Cypress later for durability.
