// Build wrapper: prepends ./scripts to PATH so Starlight's `npx -y pagefind`
// invocation resolves to the local npx shim (this machine has no usable npx).
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, delimiter } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const isWin = process.platform === 'win32';
const env = {
  ...process.env,
  PATH: join(root, 'scripts') + delimiter + (process.env.PATH ?? ''),
};
const astroBin = join(root, 'node_modules', '.bin', isWin ? 'astro.CMD' : 'astro');
const child = spawn(astroBin, ['build'], { stdio: 'inherit', env, shell: isWin });
child.on('close', (code) => process.exit(code ?? 1));
