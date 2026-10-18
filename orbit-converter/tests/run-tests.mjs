// End-to-end tests: runs the real page in Chromium, converts fixture files,
// then checks every output with independent tools (Pillow, poppler) via validate.py.
// Usage: node tests/run-tests.mjs   (after: npm install && python3 tests/make_fixtures.py)
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const fixtures = path.join(here, "fixtures");
const outDir = path.join(here, "out");
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

if (!existsSync(fixtures)) execFileSync("python3", [path.join(here, "make_fixtures.py"), fixtures], { stdio: "inherit" });
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Serve the page; CDN libraries are answered from node_modules so tests run offline.
const nm = path.join(here, "node_modules");
const VENDOR = {
  "pdf.min.js": path.join(nm, "pdfjs-dist/build/pdf.min.js"),
  "pdf.worker.min.js": path.join(nm, "pdfjs-dist/build/pdf.worker.min.js"),
  "pdf-lib.min.js": path.join(nm, "pdf-lib/dist/pdf-lib.min.js"),
  "jszip.min.js": path.join(nm, "jszip/dist/jszip.min.js"),
  "mammoth.browser.min.js": path.join(nm, "mammoth/mammoth.browser.min.js"),
};
const page_html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${readFileSync(path.join(root, "index.html"), "utf8")}</body></html>`;
const server = createServer((req, res) => { res.setHeader("content-type", "text/html; charset=utf-8"); res.end(page_html); });
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 820 }, acceptDownloads: true });
await ctx.route(/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//, (route) => {
  const file = VENDOR[route.request().url().split("/").pop()];
  return file ? route.fulfill({ path: file, contentType: "application/javascript" }) : route.abort();
});
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));
await page.goto(url);
await page.waitForFunction(() => window.Orbit && window.pdfjsLib && window.PDFLib && window.JSZip && window.mammoth);

let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail = "") {
  if (cond) { pass++; results.push(`  ✓ ${name}`); }
  else { fail++; results.push(`  ✗ ${name}${detail ? "  — " + detail : ""}`); }
}

// Runs sniff → convert → verify in the page for one or more fixtures.
async function run(names, target) {
  const files = names.map((n) => ({ name: n, b64: readFileSync(path.join(fixtures, n)).toString("base64") }));
  return page.evaluate(async ({ files, target }) => {
    const toFile = (f) => new File([Uint8Array.from(atob(f.b64), (c) => c.charCodeAt(0))], f.name);
    const sources = [];
    for (const f of files) {
      const file = toFile(f);
      const s = await Orbit.sniff(file);
      if (!s.fmt) return { sniffError: s.reason };
      sources.push({ file, ...s });
    }
    try {
      const t0 = performance.now();
      const r = await Orbit.convert(sources, target, () => {});
      const ok = await Orbit.verify(r);
      const buf = new Uint8Array(await r.blob.arrayBuffer());
      let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return { ext: r.ext, verified: ok, warn: r.warn || null, b64: btoa(bin), ms: Math.round(performance.now() - t0), fmt: sources[0].fmt };
    } catch (e) { return { error: e.message }; }
  }, { files, target });
}

function inspect(r, label) {
  const file = path.join(outDir, `${label}.${r.ext}`);
  writeFileSync(file, Buffer.from(r.b64, "base64"));
  return JSON.parse(execFileSync("python3", [path.join(here, "validate.py"), file], { encoding: "utf8" }));
}

async function conversion(label, inputs, target, expect) {
  const r = await run([].concat(inputs), target);
  if (r.error || r.sniffError) { check(label, false, r.error || r.sniffError); return; }
  const info = inspect(r, label);
  const problems = expect(info, r) || [];
  check(`${label}  (${r.ms} ms)`, r.verified && problems.length === 0, [!r.verified && "app verification failed", ...problems].filter(Boolean).join("; "));
}
const want = (cond, msg) => (cond ? [] : [msg]);

console.log("\nConversions (outputs checked with Pillow / poppler)");
await conversion("PNG → JPEG", "alpha.png", "jpg", (i) => [...want(i.format === "JPEG", `format ${i.format}`), ...want(i.width === 640 && i.height === 400, "size changed")]);
await conversion("PNG → WebP", "alpha.png", "webp", (i) => want(i.format === "WEBP", `format ${i.format}`));
await conversion("PNG → PDF", "alpha.png", "pdf", (i) => want(i.format === "PDF" && i.pages === 1, JSON.stringify(i).slice(0, 80)));
await conversion("JPEG → PNG", "photo.jpg", "png", (i) => [...want(i.format === "PNG", `format ${i.format}`), ...want(i.width === 640, "size changed")]);
await conversion("JPEG → PDF", "photo.jpg", "pdf", (i) => want(i.pages === 1, `pages ${i.pages}`));
await conversion("JPEG (EXIF rotated) → PNG keeps orientation", "rotated.jpg", "png", (i) => want(i.width === 200 && i.height === 300, `got ${i.width}×${i.height}`));
await conversion("JPEG (EXIF rotated) → PDF keeps orientation", "rotated.jpg", "pdf", (i) => {
  const size = execFileSync("pdfinfo", [path.join(outDir, "JPEG (EXIF rotated) → PDF keeps orientation.pdf")], { encoding: "utf8" }).match(/Page size:\s+([\d.]+) x ([\d.]+)/);
  return want(size && +size[1] < +size[2], `page ${size && size[1]}×${size && size[2]} should be portrait`);
});
await conversion("WebP → PNG", "pic.webp", "png", (i) => want(i.format === "PNG", `format ${i.format}`));
await conversion("GIF → JPEG", "anim.gif", "jpg", (i) => want(i.format === "JPEG", `format ${i.format}`));
await conversion("BMP → PNG", "bitmap.bmp", "png", (i) => want(i.format === "PNG", `format ${i.format}`));
await conversion("3 images → one PDF", ["alpha.png", "photo.jpg", "pic.webp"], "pdf-merge", (i) => want(i.pages === 3, `pages ${i.pages}`));
await conversion("PDF (LibreOffice) → PNG", "report.pdf", "png", (i) => want(i.format === "PNG" || i.format === "ZIP", `format ${i.format}`));
await conversion("PDF 3 pages → JPEG zip", "blank3.pdf", "jpg", (i) => [...want(i.format === "ZIP", `format ${i.format}`), ...want(i.entries?.length === 3 && i.entries.every((e) => e.format === "JPEG"), JSON.stringify(i.entries?.map((e) => e.format)))]);
await conversion("PDF → TXT", "report.pdf", "txt", (i) => [...want(i.format === "TEXT", `format ${i.format}`), ...want(/Quarterly Report/.test(i.text) && /Revenue grew/.test(i.text), "expected text missing")]);
await conversion("TXT → PDF (wrapping, unicode fallback)", "notes.txt", "pdf", (i, r) => [
  ...want(i.pages >= 3, `pages ${i.pages}`),
  ...want(/café, naïve, €100/.test(i.text), "Latin accents/€ lost"),
  ...want(/Row 149/.test(i.text), "last line missing"),
  ...want(r.warn && /replaced/.test(r.warn), "no warning about replaced characters"),
]);
await conversion("CSV → PDF (monospace)", "data.csv", "pdf", (i) => want(/79,Item 79,276.5/.test(i.text), "rows missing"));
await conversion("Windows-1252 text → PDF", "latin1.txt", "pdf", (i) => want(/Café crème brûlée/.test(i.text), `text: ${i.text?.trim()}`));
await conversion("DOCX (LibreOffice) → TXT", "report.docx", "txt", (i) => want(/Revenue grew/.test(i.text), "text missing"));
await conversion("DOCX → HTML", "report.docx", "html", (i) => want(/<!doctype html>/i.test(i.text) && /Revenue grew/.test(i.text), "html missing content"));
await conversion("PNG with .jpg name detected as PNG → JPEG", "png-named.jpg", "jpg", (i, r) => [...want(r.fmt === "png", `sniffed ${r.fmt}`), ...want(i.format === "JPEG", `format ${i.format}`)]);

console.log("Invalid inputs are rejected with a clear reason");
for (const [label, file, target, pattern] of [
  ["Empty file", "empty.txt", "pdf", /empty/i],
  ["Random binary", "random.bin", "pdf", /supported/i],
  ["Text pretending to be PNG", "not-really.png", "jpg", /isn.t a valid PNG/i],
  ["Truncated PNG", "truncated.png", "jpg", /decoded|damaged/i],
  ["Broken PDF", "broken.pdf", "png", /could not be read|damaged/i],
  ["Password-protected PDF", "locked.pdf", "txt", /password/i],
  ["Scanned PDF without text → TXT", "scanned.pdf", "txt", /no selectable text/i],
]) {
  const r = await run([file], target);
  const msg = r.sniffError || r.error || "";
  check(`${label}: “${msg}”`, !r.b64 && pattern.test(msg), r.b64 ? "produced output instead of failing" : "");
}

console.log("Interface");
// Picker → radial → keyboard selection → verified job in queue
await page.setInputFiles("#picker", path.join(fixtures, "alpha.png"));
await page.waitForSelector(".radial.open .bubble");
const bubbleLabels = await page.$$eval(".radial .bubble .b-label", (els) => els.map((e) => e.textContent));
check(`Radial menu shows PNG targets: ${bubbleLabels.join(", ")}`, bubbleLabels.join() === "JPEG,WebP,PDF");
const focused = await page.evaluate(() => document.activeElement?.dataset.fmt);
check("First format is keyboard-focused", focused === "jpg", `focused ${focused}`);
await page.waitForTimeout(450);
await page.screenshot({ path: path.join(outDir, "ui-radial.png") });
await page.keyboard.press("ArrowRight");
await page.keyboard.press("Enter");
await page.waitForSelector(".job .state.ok", { timeout: 10000 });
check("Enter on WebP converts and verifies", (await page.textContent(".job .fmt-tag")) === "WebP");
check("Radial closes after choosing", await page.$eval("#radial", (e) => e.hidden || !e.classList.contains("open")));

// Escape cancels
await page.setInputFiles("#picker", path.join(fixtures, "report.pdf"));
await page.waitForSelector(".radial.open .bubble");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
check("Escape closes the radial without converting", (await page.$$(".job")).length === 1);

// Number key + multiple files
await page.setInputFiles("#picker", [path.join(fixtures, "photo.jpg"), path.join(fixtures, "alpha.png"), path.join(fixtures, "random.bin")]);
await page.waitForSelector(".radial.open .bubble");
const multi = await page.$$eval(".radial .bubble", (els) => els.map((e) => e.dataset.fmt + ":" + e.querySelector(".b-sub").textContent));
check(`Mixed batch offers union + merge: ${multi.join(", ")}`, multi.some((m) => m.startsWith("pdf-merge")) && multi.some((m) => m === "png:1 of 2"));
await page.keyboard.press(String(multi.findIndex((m) => m.startsWith("pdf:")) + 1));
await page.waitForFunction(() => document.querySelectorAll(".job").length >= 4 && !document.querySelector(".job .spinner"));
await page.waitForTimeout(400);
const states = await page.$$eval(".job", (els) => els.map((e) => e.querySelector(".state").className));
check("Batch: unsupported file listed as failed, others verified", states.filter((s) => s.includes("err")).length === 1 && states.filter((s) => s.includes("ok")).length === 3, states.join(" | "));
check("Save all enabled for ≥2 results", !(await page.$eval("#saveAllBtn", (b) => b.disabled)));

// Save produces a real download outside the claude.ai viewer
const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-save]")]);
const dlPath = path.join(outDir, "downloaded-" + dl.suggestedFilename());
await dl.saveAs(dlPath);
check(`Save downloads “${dl.suggestedFilename()}”`, JSON.parse(execFileSync("python3", [path.join(here, "validate.py"), dlPath], { encoding: "utf8" })).format === "WEBP");

// Simulated drag and drop: plain drop opens radial; Shift-drag shows radial mid-drag and dropping on a bubble converts
const dropResult = await page.evaluate(async () => {
  const bytes = Uint8Array.from(atob(await (await fetch("data:text/plain;base64," + btoa("Drag test line"))).text().then(btoa)), (c) => c.charCodeAt(0));
  const file = new File([bytes], "dragged.txt", { type: "text/plain" });
  const dt = new DataTransfer(); dt.items.add(file);
  const fire = (type, target, opts = {}) => target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt, clientX: 400, clientY: 300, ...opts }));
  const stage = document.getElementById("stage");
  fire("dragenter", stage);
  fire("dragover", stage, { shiftKey: true });
  await new Promise((r) => setTimeout(r, 400));
  const radialOpen = document.querySelector(".radial.open") !== null;
  const labels = [...document.querySelectorAll(".radial .bubble")].map((b) => b.dataset.fmt);
  const bubble = document.querySelector('.radial .bubble[data-fmt="pdf"]');
  if (bubble) { fire("dragenter", bubble); fire("drop", bubble); }
  return { radialOpen, labels };
});
check(`Shift-drag opens radial mid-drag with ${dropResult.labels.join(",")}`, dropResult.radialOpen && dropResult.labels.join() === "pdf");
await page.waitForFunction(() => [...document.querySelectorAll(".job-name")].some((e) => e.textContent === "dragged.txt") && !document.querySelector(".job .spinner"), null, { timeout: 10000 });
check("Dropping on the PDF bubble converts immediately", await page.evaluate(() => [...document.querySelectorAll(".job")].some((j) => j.textContent.includes("dragged.txt") && j.querySelector(".state.ok"))));
await page.screenshot({ path: path.join(outDir, "ui-queue.png") });

// Phone width
await page.setViewportSize({ width: 390, height: 844 });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
check("No horizontal scroll at 390 px", !overflow);
await page.screenshot({ path: path.join(outDir, "ui-phone.png"), fullPage: true });

check("No uncaught page errors", consoleErrors.length === 0, consoleErrors.join(" | "));

await browser.close();
server.close();
console.log(results.join("\n"));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
