// Starts the dev server with every draft hidden (no draft bar, no draft notes, no draft pages), so the site
// looks as visitors will see it. Same as `npm run dev` otherwise, with live reload. Astro runs one dev
// server per project, so stop `npm run dev` first.
//
// Usage:  npm run dev:clean            (extra flags pass through: npm run dev:clean -- --port 4322)
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// Run Astro's own CLI with this Node, without a shell, so it works the same on Windows, macOS and Linux.
const require = createRequire(import.meta.url);
const pkgPath = require.resolve('astro/package.json');
const { bin } = require(pkgPath);
const cli = join(dirname(pkgPath), typeof bin === 'string' ? bin : bin.astro);

const child = spawn(process.execPath, [cli, 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, HIDE_DRAFTS: '1' },
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
