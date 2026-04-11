# Iteration 5

Summary: Add iteration documentation that describes the next minimal, verifiable work unit (implement an automated chromedriver updater and spawn a UI-testing agent to run the existing Protractor smoke test). This iteration is documentation-only to keep changes minimal and reviewable.

Changes:
- Added this documentation file describing the next small, verifiable work item and concrete tasks for the next iteration.

Context & Motivation:
- Previous iterations discovered a working Protractor e2e harness, but the e2e runs fail due to chromedriver/Chrome mismatches on the host (chromedriver downloaded for Chrome v114 vs system Chrome v146). Iteration 4 added a temporary NODE_OPTIONS tweak to make Angular build under Node v24.
- The smallest reliable fix that will materially advance automated e2e testing is an automated chromedriver update step that aligns webdriver-manager/chromedriver with the installed Chrome major version before running `ng e2e`.

Planned Minimal Implementation (next iteration):
1. Add a tiny script `scripts/update-chromedriver.js` that:
   - Detects the host's installed Chrome major version (support Windows/macOS/Linux heuristics).
   - Runs `npx webdriver-manager update --versions.chrome=<major>` (or prints the command if webdriver-manager is unavailable).
   - Exits with non-zero code on detection failure so the CI/agent can record the problem.
2. Add an npm script `e2e:prep` that runs the script and then `e2e` can be run.
3. Spawn the UI-testing agent (using the orchestrator/superpowers) to execute `npm run e2e:prep && npm run e2e` and capture the full output.
4. If the agent encounters failures (chromedriver mismatch, webdriver-manager not installed, or other platform issues), the agent will append detailed logs and file a follow-up plan item for addressing the specific failure mode.

Acceptance Criteria for next iteration:
- `scripts/update-chromedriver.js` exists and is runnable with `node scripts/update-chromedriver.js`.
- The script prints a detected Chrome major version or a clear, actionable error message.
- The docs/changes/iteration-006.md is created by the agent with captured logs and decisions.

Risks and Notes:
- Detecting Chrome reliably across platforms has edge cases (alternate Chrome derivatives, custom install locations, headless containers). The script should fail loudly and document unsupported environments rather than silently proceeding.
- Protractor is deprecated; if chromedriver alignment proves brittle, consider migrating to Playwright/Cypress in a follow-up iteration.

Next-iteration checklist (for the agent):
- Implement `scripts/update-chromedriver.js` and add `e2e:prep` npm script.
- Run `npm run e2e:prep && npm run e2e` in the agent environment and capture logs.
- Create `docs/changes/iteration-006.md` summarizing results and any new plan items.

(End of file)
