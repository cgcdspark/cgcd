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
  "index.umd.js": path.join(nm, "docx/build/index.umd.js"),
  "exceljs.min.js": path.join(nm, "exceljs/dist/exceljs.min.js"),
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
  const office = r.ext === "docx" || r.ext === "xlsx" ? ["--office"] : [];
  const info = JSON.parse(execFileSync("python3", [path.join(here, "validate.py"), file, ...office], { encoding: "utf8" }));
  info.file = file;
  return info;
}

async function conversion(label, inputs, target, expect) {
  const r = await run([].concat(inputs), target);
  if (r.error || r.sniffError) { check(label, false, r.error || r.sniffError); return; }
  const info = inspect(r, label);
  const problems = [...(expect(info, r) || []), ...(info.office_opens === false ? ["LibreOffice could not open it"] : [])];
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
await conversion("CSV → PDF (table)", "data.csv", "pdf", (i) => want(/79\s+Item 79\s+276\.5/.test(i.text) && /id\s+name\s+amount/.test(i.text), "rows missing"));
await conversion("Windows-1252 text → PDF", "latin1.txt", "pdf", (i) => want(/Café crème brûlée/.test(i.text), `text: ${i.text?.trim()}`));
await conversion("DOCX (LibreOffice) → TXT", "report.docx", "txt", (i) => want(/Revenue grew/.test(i.text), "text missing"));
await conversion("DOCX → HTML", "report.docx", "html", (i) => want(/<!doctype html>/i.test(i.text) && /Revenue grew/.test(i.text), "html missing content"));
await conversion("PNG with .jpg name detected as PNG → JPEG", "png-named.jpg", "jpg", (i, r) => [...want(r.fmt === "png", `sniffed ${r.fmt}`), ...want(i.format === "JPEG", `format ${i.format}`)]);

console.log("Word and Excel (Word/Excel outputs also opened by LibreOffice)");
const docText = (i) => [...i.paragraphs.map((p) => p.text), ...i.tables.flat(2)].join("\n");
await conversion("Word → PDF (headings, lists, table, image)", "plan.docx", "pdf", (i, r) => {
  const imgs = execFileSync("pdfimages", ["-list", i.file], { encoding: "utf8" }).split("\n").filter((l) => /^\s*\d+\s+\d+\s+image\b/.test(l)).length;
  return [
    ...want(/Launch Plan/.test(i.text) && /bold words and italic words/.test(i.text), "body text missing"),
    ...want(/•\s+Finish prototype/.test(i.text), "bullet missing"),
    ...want(/1\.\s+Draft listing/.test(i.text) && /2\.\s+Submit to store/.test(i.text), "numbering missing"),
    ...want(/Region\s+Owner\s+Budget/.test(i.text) && /South\s+Ben\s+950/.test(i.text), "table missing"),
    ...want(imgs === 1, `expected 1 image, found ${imgs}`),
    ...want(/replaced/.test(r.warn || ""), "Hindi replacement not reported"),
  ];
});
await conversion("Word (LibreOffice) → PDF", "report.docx", "pdf", (i) => want(/Revenue grew/.test(i.text), "text missing"));
await conversion("Excel → CSV (2 visible sheets → ZIP, hidden skipped)", "sales.xlsx", "csv", (i) => {
  const sales = i.entries?.find((e) => /Sales/.test(e.name))?.text || "";
  return [
    ...want(i.entries?.length === 2 && !i.entries.some((e) => /Secret/.test(e.name)), `entries ${i.entries?.map((e) => e.name)}`),
    ...want(/North,120,9\.5,1140,2026-03-15/.test(sales), "formula result or date wrong: " + sales.split("\n")[1]),
    ...want(/Total,245,,3020,/.test(sales), "totals wrong: " + sales.split("\n")[4]),
  ];
});
await conversion("Excel (single sheet) → CSV", "wide.xlsx", "csv", (i) => want(i.format === "TEXT" && i.text.split("\n").filter(Boolean).length === 301, "row count"));
await conversion("Excel → PDF (sheets as tables)", "sales.xlsx", "pdf", (i) => want(/Sales/.test(i.text) && /South\s+80\s+12\.25\s+980/.test(i.text) && /Staff/.test(i.text) && !/do not export/.test(i.text), "content wrong"));
await conversion("Excel wide sheet → PDF (landscape, header repeats)", "wide.xlsx", "pdf", (i) => {
  const size = execFileSync("pdfinfo", [i.file], { encoding: "utf8" }).match(/Page size:\s+([\d.]+) x ([\d.]+)/);
  const headers = (i.text.match(/Column 1\s+Column 2/g) || []).length;
  return [...want(+size[1] > +size[2], "not landscape"), ...want(i.pages > 1 && headers === i.pages, `header on ${headers} of ${i.pages} pages`), ...want(/r299c10/.test(i.text), "last cell missing")];
});
await conversion("Excel → Word (tables)", "sales.xlsx", "docx", (i) => want(i.tables.length === 2 && i.tables[0][2].join() === "South,80,12.25,980,2026-03-16", JSON.stringify(i.tables[0]?.[2])));
await conversion("Excel → HTML", "sales.xlsx", "html", (i) => want(/<table>/.test(i.text) && /<td class="n">1140<\/td>/.test(i.text), "table missing"));
await conversion("CSV → Excel (types, quotes, leading zeros)", "tricky.csv", "xlsx", (i) => {
  const rows = i.sheets && Object.values(i.sheets)[0];
  return [
    ...want(rows?.[1]?.[0] === "007", `leading zeros lost: ${rows?.[1]?.[0]}`),
    ...want(rows?.[2]?.[0] === 42, `number not numeric: ${JSON.stringify(rows?.[2]?.[0])}`),
    ...want(rows?.[1]?.[1] === "Smith, J" && rows?.[1]?.[2] === "line one\nline two" && rows?.[2]?.[2] === 'say "hi"', "quoting wrong"),
  ];
});
await conversion("CSV → Word", "data.csv", "docx", (i) => want(i.tables[0]?.length === 81 && i.tables[0][80].join() === "79,Item 79,276.5", "table wrong"));
await conversion("Text → Word (keeps Hindi)", "notes.txt", "docx", (i) => want(/नमस्ते/.test(docText(i)) && /Row 149/.test(docText(i)), "text missing"));
await conversion("PDF → Word (text)", "report.pdf", "docx", (i) => want(/Quarterly Report/.test(docText(i)) && /Revenue grew/.test(docText(i)), docText(i).slice(0, 120)));
await conversion("PNG → Word (picture)", "alpha.png", "docx", (i) => want(i.images === 1, `images ${i.images}`));
await conversion("Rotated JPEG → Word (upright)", "rotated.jpg", "docx", (i) => want(i.images === 1, `images ${i.images}`));

console.log("Invalid inputs are rejected with a clear reason");
for (const [label, file, target, pattern] of [
  ["Empty file", "empty.txt", "pdf", /empty/i],
  ["Random binary", "random.bin", "pdf", /supported/i],
  ["Text pretending to be PNG", "not-really.png", "jpg", /isn.t a valid PNG/i],
  ["Truncated PNG", "truncated.png", "jpg", /decoded|damaged/i],
  ["Broken PDF", "broken.pdf", "png", /could not be read|damaged/i],
  ["Password-protected PDF", "locked.pdf", "txt", /password/i],
  ["Scanned PDF without text → TXT", "scanned.pdf", "txt", /no selectable text/i],
  ["Scanned PDF → Word", "scanned.pdf", "docx", /no selectable text/i],
  ["Old .xls", "old.xls", "csv", /older .doc, .xls/i],
  ["Password-protected .docx", "protected.docx", "pdf", /password protected/i],
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
check(`Radial menu shows PNG targets: ${bubbleLabels.join(", ")}`, bubbleLabels.join() === "JPEG,WebP,PDF,Word");
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
check(`Shift-drag opens radial mid-drag with ${dropResult.labels.join(",")}`, dropResult.radialOpen && dropResult.labels.join() === "pdf,docx");
await page.waitForFunction(() => [...document.querySelectorAll(".job-name")].some((e) => e.textContent === "dragged.txt") && !document.querySelector(".job .spinner"), null, { timeout: 10000 });
check("Dropping on the PDF bubble converts immediately", await page.evaluate(() => [...document.querySelectorAll(".job")].some((j) => j.textContent.includes("dragged.txt") && j.querySelector(".state.ok"))));
await page.screenshot({ path: path.join(outDir, "ui-queue.png") });

// Sample Excel file → radial shows Excel targets → PDF
for (const [sample, expected, pick] of [["xlsx", "pdf,docx,csv,html", "pdf"], ["docx", "pdf,txt,html", "pdf"]]) {
  const before = (await page.$$(".job .state.ok")).length;
  await page.click(`[data-sample="${sample}"]`);
  await page.waitForSelector(".radial.open .bubble");
  const got = await page.$$eval(".radial .bubble", (els) => els.map((e) => e.dataset.fmt).join());
  await page.waitForTimeout(400);
  if (sample === "xlsx") await page.screenshot({ path: path.join(outDir, "ui-radial-excel.png") });
  await page.click(`.radial .bubble[data-fmt="${pick}"]`);
  await page.waitForFunction((n) => document.querySelectorAll(".job .state.ok").length > n, before, { timeout: 15000 });
  check(`${sample} sample offers ${got} and converts to ${pick}`, got === expected);
}

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
