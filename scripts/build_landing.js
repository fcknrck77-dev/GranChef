/* eslint-disable no-console */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

function run(cmd, args, env, useShell) {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    env,
    cwd: process.cwd(),
    shell: !!useShell,
  });
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
  if (res.status !== 0) process.exit(res.status || 1);
}

function main() {
  const env = { ...process.env, NEXT_PUBLIC_DEPLOY_TARGET: 'landing' };
  const nextCli = path.join('node_modules', 'next', 'dist', 'bin', 'next');

  // Next.js static export fails if app route handlers exist under src/app/api.
  // For the FTP landing build we temporarily move them out, then restore.
  const apiSrc = path.join('src', 'app', 'api');
  // Keep the stash outside `src/` so Next/TS won't try to typecheck route handlers during export.
  const stashDir = path.join('.landing_stash');
  const apiStash = path.join(stashDir, 'app_api');

  const hasApi = fs.existsSync(apiSrc);

  const moveDir = (from, to) => {
    try {
      fs.renameSync(from, to);
      return;
    } catch (e) {
      // Windows can throw EPERM if something temporarily holds a handle; fall back to copy+delete.
      console.warn(`WARN: rename failed (${e.code || 'unknown'}), falling back to copy/delete: ${from} -> ${to}`);
      fs.cpSync(from, to, { recursive: true });
      fs.rmSync(from, { recursive: true, force: true });
    }
  };

  try {
    if (hasApi) {
      fs.mkdirSync(stashDir, { recursive: true });
      if (fs.existsSync(apiStash)) fs.rmSync(apiStash, { recursive: true, force: true });
      moveDir(apiSrc, apiStash);
    }

    run(process.execPath, [nextCli, 'build'], env, false);
    run(process.execPath, [path.join('scripts', 'copy_landing_out.js')], env, false);
  } finally {
    if (hasApi && fs.existsSync(apiStash) && !fs.existsSync(apiSrc)) {
      moveDir(apiStash, apiSrc);
    }
  }
}

main();
