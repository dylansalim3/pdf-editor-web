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

// Also try common install paths on Windows if detection via commands/registry failed
if (!out && process.platform === 'win32') {
  const possiblePaths = [
    process.env['PROGRAMFILES'] && `${process.env['PROGRAMFILES']}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env['LOCALAPPDATA'] && `${process.env['LOCALAPPDATA']}\\Google\\Chrome\\Application\\chrome.exe`,
  ].filter(Boolean);

  for (const p of possiblePaths) {
    try {
      const ps = spawnSync('powershell', ['-NoProfile', '-Command', `if (Test-Path '${p}') { ([System.Diagnostics.FileVersionInfo]::GetVersionInfo('${p}')).FileVersion }`], { encoding: 'utf8' });
      if (ps.status === 0 && ps.stdout) {
        out = ps.stdout.trim();
        break;
      }
    } catch (e) {
      // ignore and try next
    }
  }
}

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

// Allow overriding detected major via env var or --major CLI arg
function parseArgs() {
  const args = process.argv.slice(2);
  const res = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--major' && args[i+1]) { res.major = args[i+1]; i++; }
    if (a.startsWith('--major=')) { res.major = a.split('=')[1]; }
    if (a === '--no-update') { res.noUpdate = true; }
  }
  return res;
}

const argv = parseArgs();
let major = argv.major || process.env.CHROME_MAJOR || parseChromeVersion(out);
if (major) major = String(major);
if (!major) {
  console.error('Could not detect Chrome/Chromium version automatically.');
  console.error('You can override detection by setting the CHROME_MAJOR environment variable or passing --major <MAJOR>');
  console.error('Example: CHROME_MAJOR=146 node scripts/update-chromedriver.js');
  console.error('Or: node scripts/update-chromedriver.js --major 146');
  console.error('If you only want to see the updater command, use --no-update to print the command without executing it.');
  process.exitCode = 2;
  process.exit();
}

console.log('Detected Chrome major version:', major);
const updateCmd = `${process.platform === 'win32' ? 'npx.cmd' : 'npx'} webdriver-manager update --versions.chrome=${major}`;
if (argv.noUpdate) {
  console.log('No-update flag provided; the following command would be executed:');
  console.log(updateCmd);
  process.exitCode = 0;
  process.exit();
}

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
