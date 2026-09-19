// Ad-hoc SEO audit: duplicate/missing/overlong titles and meta descriptions.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

for (const site of process.argv.slice(2)) {
  const files = walk(join(site, "dist"));
  const titles = new Map();
  const descs = new Map();
  let noTitle = 0;
  let noDesc = 0;
  let longT = 0;
  let longD = 0;
  let noindexed = 0;

  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const rel = relative(join(site, "dist"), file).split("\\").join("/");
    if (/<meta name="robots" content="noindex/.test(html)) noindexed += 1;
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    if (!title) noTitle += 1;
    else {
      if (title.length > 65) longT += 1;
      titles.set(title, (titles.get(title) || []).concat(rel));
    }
    if (!desc) noDesc += 1;
    else {
      if (desc.length > 165) longD += 1;
      descs.set(desc, (descs.get(desc) || []).concat(rel));
    }
  }

  const dupT = [...titles].filter(([, v]) => v.length > 1);
  const dupD = [...descs].filter(([, v]) => v.length > 1);
  console.log(`== ${site}: pages=${files.length} noindex=${noindexed} noTitle=${noTitle} noDesc=${noDesc} title>65=${longT} desc>165=${longD} dupTitles=${dupT.length} dupDescs=${dupD.length}`);
  for (const [key, value] of dupT.slice(0, 5)) console.log(`   dupTitle "${key.slice(0, 55)}" x${value.length} e.g. ${value[0]}`);
  for (const [key, value] of dupD.slice(0, 5)) console.log(`   dupDesc  "${key.slice(0, 55)}" x${value.length} e.g. ${value[0]}`);
}
