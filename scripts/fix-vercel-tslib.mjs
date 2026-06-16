import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const functionsDir = path.join(root, ".vercel", "output", "functions");
const tslibSource = path.join(root, "node_modules", "tslib", "tslib.es6.mjs");

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listMjsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMjsFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
      files.push(entryPath);
    }
  }

  return files;
}

function relativeImport(fromFile, toFile) {
  let importPath = path.relative(path.dirname(fromFile), toFile).replaceAll(path.sep, "/");
  if (!importPath.startsWith(".")) {
    importPath = `./${importPath}`;
  }
  return importPath;
}

if (await pathExists(functionsDir)) {
  const functionEntries = await readdir(functionsDir, { withFileTypes: true });

  for (const entry of functionEntries) {
    if (!entry.isDirectory() || !entry.name.endsWith(".func")) {
      continue;
    }

    const functionDir = path.join(functionsDir, entry.name);
    const libsDir = path.join(functionDir, "_libs");
    const tslibTarget = path.join(libsDir, "tslib.mjs");

    await mkdir(libsDir, { recursive: true });
    await copyFile(tslibSource, tslibTarget);

    for (const filePath of await listMjsFiles(functionDir)) {
      const source = await readFile(filePath, "utf8");
      const importPath = relativeImport(filePath, tslibTarget);
      const updated = source
        .replaceAll('from "tslib"', `from "${importPath}"`)
        .replaceAll("from 'tslib'", `from '${importPath}'`);

      if (updated !== source) {
        await writeFile(filePath, updated);
      }
    }
  }
}
