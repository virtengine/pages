// Build wrapper: prepends ./scripts to PATH so Starlight's `npx -y pagefind`
// invocation resolves to the local npx shim (this machine has no usable npx).
//
// The Astro CLI is invoked as `node node_modules/astro/astro.js` rather than
// through the .bin shim: spawning a shim on Windows requires `shell: true`,
// which makes cmd.exe split the arguments on the space in this repository's
// path ("DET-IO FOUNDATION") and the build fails before it starts.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, delimiter } from 'node:path';
import { existsSync } from 'node:fs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
await import('./og.mjs');

const env = { ...process.env };
// Windows treats Path/PATH as one key. Avoid passing duplicate spellings or
// an oversized inherited PATH to cmd.exe when Starlight invokes the local shim.
const inheritedPath = process.env.PATH ?? process.env.Path ?? '';
for (const key of Object.keys(env)) if (key.toLowerCase() === 'path') delete env[key];
env.PATH = process.platform === 'win32'
  ? [join(root, 'scripts'), dirname(process.execPath), join(process.env.SystemRoot ?? 'C:\\Windows', 'System32')].join(delimiter)
  : join(root, 'scripts') + delimiter + inheritedPath;

const astroEntry = join(root, 'node_modules', 'astro', 'astro.js');
if (!existsSync(astroEntry)) {
  console.error(`build.mjs: missing ${astroEntry} — run pnpm install first`);
  process.exit(1);
}

const child = spawn(process.execPath, [astroEntry, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});
child.on('error', (error) => { console.error(error); process.exit(1); });
child.on('close', (code) => {
  if (code !== 0) process.exit(code ?? 1);
  if (!existsSync(join(root, 'dist', 'pagefind', 'pagefind.js'))) {
    console.error('build.mjs: Pagefind search index was not generated');
    process.exit(1);
  }
  process.exit(0);
});
