#!/usr/bin/env node
const { spawnSync } = require('child_process');

function tryCommands(cmds) {
  for (const c of cmds) {
    try {
      const parts = Array.isArray(c) ? c : c.split(' ');
      const res = spawnSync(parts[0], parts.slice(1), { encoding: 'utf8' });
      if (res.status === 0 && res.stdout) return res.stdout.trim();
    } catch (err) {
      // ignore and try next
    }
  }
  return null;
}

function parseChromeVersion(output) {
  if (!output) return null;
  const m = output.match(/(\d+)(?:\.\d+)?(?:\.\d+)?(?:\.\d+)?/);
  return m ? m[1] : null;
}

console.log('update-chromedriver: detecting installed Chrome/Chromium version...');

// Try common commands that print chrome version
const candidates = [
  'google-chrome --version',
  'google-chrome-stable --version',
  'chromium --version',
  'chromium-browser --version',
  'chrome --version',
  'msedge --version',
  // Windows fallback: try PowerShell query to get Chrome file properties (only works if chrome in default path)
];

let out = tryCommands(candidates);

// On Windows, try using REG to find chrome.exe path then query its FileVersion via PowerShell
if (!out && process.platform === 'win32') {
  try {
    const reg = spawnSync('reg', ['query', 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe'], { encoding: 'utf8' });
    if (reg.status === 0 && reg.stdout) {
      const match = reg.stdout.match(/\n\s*\S+\\chrome.exe/);
      const path = match ? match[0].trim() : null;
      if (path) {
        const ps = spawnSync('powershell', ['-NoProfile', '-Command', `([System.Diagnostics.FileVersionInfo]::GetVersionInfo('${path}')).FileVersion`], { encoding: 'utf8' });
        if (ps.status === 0 && ps.stdout) out = ps.stdout.trim();
      }
    }
  } catch (e) {}
}

const major = parseChromeVersion(out);
if (!major) {
  console.error('Could not detect Chrome/Chromium version automatically.');
  console.error('Please ensure Chrome is installed and available in PATH, or run: npx webdriver-manager update --versions.chrome=<MAJOR>');
  process.exitCode = 2;
  process.exit();
}

console.log('Detected Chrome major version:', major);
console.log('Running webdriver-manager update to fetch matching chromedriver...');

// Run npx webdriver-manager update --versions.chrome=<major>
const updater = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['webdriver-manager', 'update', `--versions.chrome=${major}`], { stdio: 'inherit' });

if (updater.status !== 0) {
  console.error('webdriver-manager update failed. Ensure protractor/webdriver-manager is installed (npm i -D protractor) and try again.');
  process.exitCode = updater.status || 1;
  process.exit();
}

console.log('webdriver-manager update completed successfully.');
process.exitCode = 0;
