# Iteration 004

Summary
-------

Ran a smoke e2e attempt, fixed an OpenSSL build error for Node 24 by updating the e2e npm script, executed the Protractor e2e run, and observed a ChromeDriver/Chrome version mismatch; documented results and next steps.

What I changed
---------------

- Updated package.json: modified the `e2e` npm script to set `NODE_OPTIONS=--openssl-legacy-provider` before running `ng e2e`. This addresses the OpenSSL incompatibility seen with Node 24 when building the Angular bundles.

What I ran
----------

- `npm run e2e` — ran a smoke e2e using the existing Protractor harness. Build compiled successfully but Protractor failed to create a browser session due to ChromeDriver/Chrome mismatch.

Results / Observations
----------------------

- OpenSSL error (ERR_OSSL_EVP_UNSUPPORTED) occurred during initial build with Node v24; setting `NODE_OPTIONS=--openssl-legacy-provider` resolved the build step.
- Angular app compiled and dev server started successfully (localhost:4200) during the e2e run.
- Protractor failed to launch the browser: the chromedriver binary bundled/downloaded by webdriver-manager was for Chrome 114, while the system Chrome is v146. Error: "This version of ChromeDriver only supports Chrome version 114".
- Protractor is deprecated; while it can be used for quick smoke tests, long-term stability would benefit from migrating to Playwright or Cypress.

Next smallest steps (next iteration)
-----------------------------------

1. Make the e2e run reproducible by aligning ChromeDriver with the installed Chrome:
   - Option A (preferred short-term): Update the test script to run `node_modules\.bin\webdriver-manager update --versions.chrome=<major>` before `ng e2e`, where `<major>` matches the installed Chrome major version (146). This forces webdriver-manager to download a compatible chromedriver.
   - Option B: Add logic to detect installed Chrome version and pass it to webdriver-manager (more robust but slightly larger scope).
2. Add an automated check in the e2e script to fail fast with a clear error when chromedriver and Chrome mismatch, instead of a Protractor stacktrace.
3. Consider migrating e2e tests to Playwright/Cypress in a follow-up iteration to avoid Protractor deprecation and get faster, more stable headless runs.

Acceptance Criteria for next iteration
------------------------------------

- `npm run e2e` completes test execution (or fails with a clear, actionable error) when the environment has matching ChromeDriver/Chrome versions.
- The new script change is documented in docs/changes/iteration-005.md and includes the exact commands used.

Notes
-----

- I intentionally kept the change minimal and non-invasive (only modified the npm script to set NODE_OPTIONS) so the run could proceed to the next observable failure (chromedriver mismatch). This provides a clear, verifiable next task.
