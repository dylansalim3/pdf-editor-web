Iteration 001 — Seed change log and UI-testing plan

Summary
- Created documentation files to track incremental changes and to outline the next small unit of work: spawn an agent responsible for UI testing.

What I added
- docs/superpowers/plan-ui-testing.md — a short plan describing the UI-testing agent's responsibilities and acceptance criteria.

Next steps
1. Spawn the UI-testing agent (use the project's agent infrastructure or a CI job) to implement end-to-end tests described in the plan.
2. If the agent reports failures, capture failures as test scenarios in test/scenarios and add tickets or TODOs for fixes.
3. Create a feature branch and open a PR with these changes; update the PR main comment each iteration.

Notes
- This iteration intentionally only adds documentation (no code changes) to make the next steps explicit and reproducible.
