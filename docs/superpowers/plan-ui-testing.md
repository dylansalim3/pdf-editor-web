Plan: Spawn an agent to implement and run UI testing (seed plan)

Purpose
- Create an autonomous agent (or start an existing test-runner job) to implement robust UI/end-to-end tests for the web frontend.

Scope for first agent run (smallest verifiable unit)
- Implement a single end-to-end test covering the navigation and upload workflow:
  - Visit the app home page
  - Navigate to the upload screen
  - Upload a small sample PDF (use fixtures/test.pdf)
  - Assert that upload progress completes and the preview is displayed

Acceptance criteria
- The agent can run the test locally or in CI and produce a pass/fail report.
- Any failing assertions must be recorded as test output and added to test/scenarios as a new scenario file describing the failure.

Agent responsibilities
- Create or use existing test harness (Playwright/Cypress/others) present in the repo. If none exists, document the recommended harness and a minimal bootstrap script.
- Add the test under test/e2e/ or equivalent directory and ensure it can be run with a single command (e.g., npm run test:e2e).
- Produce machine-readable test results (JUnit/JSON) so the orchestrator/CI can consume them.

Risks & Mitigations
- If the repo does not include a test harness, the agent should not implement a full harness yet; instead it should write a short spec and a minimal bootstrap script and add it to docs/ with instructions — this keeps the iteration small.

Next iteration goals (if first run succeeds)
1. Expand coverage to include annotate and save workflows.
2. Add CI integration to run e2e tests automatically on PRs.
