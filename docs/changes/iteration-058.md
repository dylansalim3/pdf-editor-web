# iteration-058

Summary
-------

Seed artifact that instructs a UI-testing agent (spawned with superpowers) to run the automated e2e agent in non-dry mode, capture full stdout/stderr and richer spawnSync diagnostics, and create a feature branch + PR attaching the produced log for triage.

Goal
----

Have an automated agent run the real e2e preparation and e2e steps (not dry-run) on a networked host, capture every byte of output, and push the resulting artifact into a feature branch and PR so humans can triage any failures (npm ci / webdriver-manager / protractor / chromedriver mismatches).

Agent Run Plan (what to run)
---------------------------

1. Ensure the repo is at the latest working tree (the orchestrator will commit changes into a feature branch) and the agent can create branches/PRs using gh.
2. Run the automated e2e agent in non-dry mode and force the output file to this iteration artifact:

   npm run e2e:run-agent -- --out docs/changes/iteration-058.md

   Notes:
   - The agent script supports flags; the important ones to consider here are:
     * --use-legacy-peer-deps (or USE_LEGACY_PEER_DEPS=1) — if `npm ci` fails with ERESOLVE, the agent will retry once with this flag. Recommend enabling it if CI hosts commonly hit peer-dep conflicts.
     * --no-verify-install / NO_VERIFY_INSTALL=1 — opt-out only if network cost or policies block dry-run verification; prefer leaving verification enabled for better diagnostics.
   - If the environment is Windows the agent will automatically use npm.cmd / npx.cmd shims.

3. Capture full stdout/stderr and the richer spawnSync diagnostics the agent emits (Signal, Error stack, Raw output) — the agent already writes these fields into the generated log file when present.

4. On completion, ensure the agent wrote docs/changes/iteration-058.md (the agent already performs a post-write stat and fails if the file is missing or empty).

Post-run Steps (branch + PR)
---------------------------

If the agent produced the artifact successfully, it should create a feature branch and PR as follows (these are intended to be run by the agent using gh and the orchestrator's git context):

1. Create a feature branch based on the current HEAD (or orchestrator-provided commit):

   git checkout -b feat/automated-e2e/iteration-058

2. Stage the generated artifact and any other changed files (the orchestrator will normally handle commits but include these commands so a spawned agent can operate if given permission):

   git add docs/changes/iteration-058.md
   git commit -m "docs: automated e2e agent run log (iteration-058)"

3. Push the branch and open a pull request attaching the log in the PR body (or reference the file path):

   git push -u origin feat/automated-e2e/iteration-058
   gh pr create --title "chore: automated e2e run log (iteration-058)" --body "Automated e2e run logs written to docs/changes/iteration-058.md. Please triage failures and follow suggested remediation steps in the log."

Acceptance criteria
-------------------

- docs/changes/iteration-058.md exists in the repo and is non-empty.
- The artifact includes: preflight results, verify-install output, npm ci stdout/stderr (and any --legacy-peer-deps retry), e2e:prep (chromedriver update) output, e2e output (protractor), and any richer spawnSync diagnostics (Error, Signal, Raw output) when present.
- A feature branch + PR is created that references or attaches the generated artifact so humans can triage failures.

Next steps if this run fails
---------------------------

- If `npm ci` fails with ERESOLVE despite the one-time retry, record the exact npm error and consider running `npm ci --legacy-peer-deps` permanently for this run or triage dependency versions.
- If webdriver-manager/chromedriver mismatch is observed, capture chromedriver download logs and consider re-running scripts/update-chromedriver.js with --major or CHROME_MAJOR override to align versions.
- If Chrome is not present on the host, record that the environment is headless/without Chrome and re-run the agent on a host with Chrome installed or supply CHROME_MAJOR to the agent and use --no-update dry-run to validate commands.

Notes for the orchestrator / agent operator
-----------------------------------------

- The agent should run on a networked machine with Chrome installed (or pre-installed node_modules and chromedriver) to exercise real flows. If network is restricted, consider pre-installing devDependencies and Chrome or use an image with those preinstalled.
- The agent should prefer `npm ci` to ensure deterministic installs; `--use-legacy-peer-deps` is an acceptable one-time fallback for CI if ERESOLVE occurs but should be logged clearly when used.
- The automate-e2e.js script already performs post-write verification; if that check fails, the agent should surface that as an error in the PR description.

Generated-By: automate-e2e.js plan (iteration-058 seed)
