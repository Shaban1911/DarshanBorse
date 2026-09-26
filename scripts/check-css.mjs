/**
 * Guards the built stylesheet for phones that never updated.
 *
 * The sources write every modern value after a value older engines understand
 * (vh before svh, hidden before clip, a hex colour before color-mix). A build
 * step can quietly drop those fallbacks: Lightning CSS did, and the site then
 * broke on iOS 15. This runs after every build and fails it if a fallback is
 * missing, or if a custom property carries a modern unit outside a feature
 * query (a variable cannot be fallen back by repetition: the declarations that
 * use it become invalid instead).
 *
 * Run:  node scripts/check-css.mjs   (also part of `npm run build`)
 */
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../dist/client/assets/", import.meta.url);
const file = readdirSync(dir).find((f) => /^styles-.*\.css$/.test(f));
if (!file) {
  console.error("check-css: no built stylesheet in dist/client/assets");
  process.exit(1);
}
const css = readFileSync(new URL(file, dir), "utf8");

const MODERN = [/svh/, /color-mix\(/, /:\s*clip/];
const isModern = (decl) => MODERN.some((rx) => rx.test(decl));
const property = (decl) => decl.slice(0, decl.indexOf(":")).trim();

// spans of @supports blocks, so guarded declarations are recognised
const guarded = [];
for (const m of css.matchAll(/@supports[^{]*\{/g)) {
  let depth = 1;
  let i = m.index + m[0].length;
  for (; i < css.length && depth > 0; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") depth--;
  }
  guarded.push([m.index, i]);
}
const inSupports = (at) => guarded.some(([a, b]) => at >= a && at < b);

const problems = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = m[1].trim();
  if (selector.startsWith("@")) continue;
  const decls = m[2]
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
  decls.forEach((decl, i) => {
    if (!isModern(decl)) return;
    const prop = property(decl);
    if (prop.startsWith("--")) {
      if (!inSupports(m.index))
        problems.push(`${selector} { ${decl} }  (custom property outside @supports)`);
      return;
    }
    const hasFallback = decls.slice(0, i).some((d) => property(d) === prop && !isModern(d));
    if (!hasFallback && !inSupports(m.index))
      problems.push(`${selector} { ${decl} }  (no fallback before it)`);
  });
}

if (problems.length) {
  console.error(`check-css: ${problems.length} declaration(s) would fail on older engines:`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`check-css: ${file} keeps every fallback`);
