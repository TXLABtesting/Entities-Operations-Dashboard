/**
 * Fold the built site into one self-contained HTML document.
 *
 * Useful for preview hosts that serve a single file and allow no outbound
 * requests — handy for review while the real deployment is still pending.
 *
 *   VITE_HASH_ROUTER=true pnpm build --base=./
 *   node scripts/build-standalone.mjs [outFile] [--sub <ref>=<file>]...
 *
 * Everything ships inside the document, so the hero video alone accounts for
 * most of the weight. Where a host caps the document size, point --sub at a
 * shorter or smaller encode, e.g.
 *   --sub assets/web/hero-bg.mp4=/tmp/hero-short.mp4
 *
 * Asset paths survive the build as plain string literals (they are composed
 * from BASE_URL at runtime rather than imported), so each one is swapped for a
 * data URI in place. `asset()` passes an absolute URL straight through, which
 * is what keeps those data URIs intact.
 */
import fs from "node:fs";
import path from "node:path";

const DIST = "dist/public";
const PUBLIC = "client/public";

const args = process.argv.slice(2);
/** Swap individual assets for lighter stand-ins: --sub <ref>=<file>. */
const substitute = new Map();
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--sub") {
    const [ref, ...rest] = (args[++i] ?? "").split("=");
    if (!ref || !rest.length) throw new Error("--sub needs <ref>=<file>");
    substitute.set(ref, rest.join("="));
  } else {
    positional.push(args[i]);
  }
}
const OUT = positional[0] ?? "dist/standalone.html";

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

const ASSET_RE =
  /assets\/(?:web\/|docs\/)?[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|svg|mp4|pdf)/g;

/**
 * The document carries no charset declaration on some hosts, where a UTF-8
 * byte is then decoded as Latin-1 — corrupting every Arabic string and, worse,
 * the Arabic ranges inside regex literals. Emitting pure ASCII sidesteps it.
 */
const asciiOnly = text =>
  text.replace(
    /[-￿]/g,
    c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`
  );

const pick = ext =>
  path.join(
    DIST,
    "assets",
    fs.readdirSync(path.join(DIST, "assets")).find(f => f.endsWith(ext))
  );

let js = fs.readFileSync(pick(".js"), "utf8");
const css = fs.readFileSync(pick(".css"), "utf8");

let bytes = 0;
for (const ref of new Set(js.match(ASSET_RE) ?? [])) {
  const file = substitute.get(ref) ?? path.join(PUBLIC, ref);
  if (!fs.existsSync(file)) {
    console.warn(`  missing ${ref}`);
    continue;
  }
  const raw = fs.readFileSync(file);
  bytes += raw.length;
  const uri = `data:${MIME[path.extname(ref)] ?? "application/octet-stream"};base64,${raw.toString("base64")}`;
  js = js.split(`"${ref}"`).join(`"${uri}"`).split(`'${ref}'`).join(`'${uri}'`);
}

const left = js.match(ASSET_RE);
if (left) throw new Error(`unresolved asset references: ${[...new Set(left)]}`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  `<title>Agentic AI Public Site</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=swap">
<style>${asciiOnly(css)}</style>
<div id="root"></div>
<script type="module">${asciiOnly(js)}</script>
`,
  "utf8"
);

const mb = n => (n / 1024 / 1024).toFixed(2);
console.log(
  `${OUT} — ${mb(bytes)} MB of assets inlined, ${mb(fs.statSync(OUT).size)} MB total`
);
