// npx shim: handles `npx -y pagefind <args>` by running the locally
// installed pagefind package. Only pagefind is supported by design.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2).filter((a) => a !== '-y' && a !== '--yes');
if (args[0] !== 'pagefind') {
  console.error(`npx shim: only "pagefind" is supported, got: ${args[0]}`);
  process.exit(1);
}
args.shift();

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bin = join(root, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs');
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('close', (code) => process.exit(code ?? 1));
