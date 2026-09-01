@echo off
rem Local npx shim for environments without npx (broken Nodist npm).
rem Starlight runs `npx -y pagefind ... --site <dir>`; forward to local pagefind.
node "%~dp0npx-shim.mjs" %*
