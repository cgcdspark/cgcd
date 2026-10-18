/* Coverage terminal: sector universe maps + company deep dives.
   Views are rendered from window.SECTORS / COMPANIES / SENTIMENT_MODELS (data.js). */
(function () {
  "use strict";

  const SECTORS = window.SECTORS;
  const COMPANIES = window.COMPANIES;
  const MODELS = window.SENTIMENT_MODELS;
  const SVGNS = "http://www.w3.org/2000/svg";

  const app = document.getElementById("app");
  const nav = document.getElementById("sector-nav");

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, d = 0) => n == null || !isFinite(n) ? "—" : n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (n, d = 1) => n == null || !isFinite(n) ? "—" : (n * 100).toFixed(d) + "%";
  const rad = (deg) => (deg * Math.PI) / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function findCompany(id) {
    for (const s of Object.values(SECTORS)) {
      for (const seg of s.segments) {
        const c = seg.companies.find((x) => x.id === id);
        if (c) return { sector: s, segment: seg, company: c };
      }
    }
    return null;
  }

  function niceStep(max, ticks) {
    const raw = max / ticks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / mag;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  }

  // ---------- routing ----------
  function go(token) {
    if (location.hash.slice(1) === token) render();
    else location.hash = token;
  }
  function render() {
    closeMenus();
    const token = location.hash.slice(1) || "capgoods";
    if (SECTORS[token]) renderSector(SECTORS[token]);
    else if (findCompany(token)) renderCompany(token);
    else renderSector(SECTORS.capgoods);
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", render);

  // ---------- command bar dropdowns ----------
  function buildNav() {
    nav.innerHTML = Object.values(SECTORS).map((s) => `
      <div class="dd" data-sector="${s.id}">
        <button class="dd-btn" id="dd-${s.id}" aria-haspopup="true" aria-expanded="false">
          ${s.segments.some((g) => g.companies.some((c) => c.live)) ? '<span class="dot" aria-hidden="true"></span>' : ""}
          ${esc(s.name)}
          <svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
        </button>
        <div class="dd-menu" role="menu" hidden>
          <button class="dd-open" data-go="${s.id}">Open ${esc(s.name)} universe <span aria-hidden="true">→</span></button>
          ${s.segments.map((seg) => `
            <div class="dd-seg">
              <div class="dd-seg-name">${esc(seg.name)}</div>
              ${seg.companies.map((c) => `
                <button class="dd-co ${c.live ? "live" : ""}" data-go="${c.id}" role="menuitem">
                  <span class="nm">${esc(c.name)}</span><span class="tk">${esc(c.ticker)}</span>
                </button>`).join("")}
            </div>`).join("")}
        </div>
      </div>`).join("");

    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".dd-btn");
      if (btn) {
        const menu = btn.nextElementSibling;
        const open = menu.hidden;
        closeMenus();
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
        return;
      }
      const target = e.target.closest("[data-go]");
      if (target) go(target.dataset.go);
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) closeMenus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenus(); });
  }
  function closeMenus() {
    nav.querySelectorAll(".dd-menu").forEach((m) => (m.hidden = true));
    nav.querySelectorAll(".dd-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
  function markCurrent(sectorId) {
    nav.querySelectorAll(".dd-btn").forEach((b) => b.classList.toggle("is-current", b.id === "dd-" + sectorId));
  }

  // ======================================================================
  // Sector view: radial universe map
  // ======================================================================
  function renderSector(s) {
    markCurrent(s.id);
    const all = s.segments.flatMap((g) => g.companies);
    const live = all.filter((c) => c.live).length;

    app.innerHTML = `
      <section class="sector-hero fade-in">
        <div>
          <div class="eyebrow">Sector universe · ${esc(s.short)}</div>
          <h1>${esc(s.name)}</h1>
          <p>${esc(s.tagline)}. Select a node to open the company deep dive.</p>
        </div>
        <div class="stat-row">
          <div class="stat"><div class="eyebrow">Segments</div><div class="v">${s.segments.length}</div></div>
          <div class="stat"><div class="eyebrow">Companies</div><div class="v">${all.length}</div></div>
          <div class="stat"><div class="eyebrow">Deep dives live</div><div class="v live">${live}</div></div>
        </div>
      </section>

      <section class="panel fade-in">
        <div class="panel-head">
          <div><div class="eyebrow">Product / company map</div><h2>${esc(s.name)} universe</h2></div>
          <div class="legend"><span class="l-live">Deep dive live</span><span class="l-q">In build queue</span></div>
        </div>
        <div class="map-wrap" id="map"></div>
      </section>

      <section class="seg-grid fade-in">
        ${s.segments.map((seg) => `
          <div class="seg-card">
            <h3>${esc(seg.name)}</h3>
            <ul>${seg.companies.map((c) => `
              <li><button data-go="${c.id}">
                <span>${esc(c.name)} <span class="tk">${esc(c.ticker)}</span></span>
                <span class="pill ${c.live ? "live" : "queued"}">${c.live ? "Live" : "Queued"}</span>
              </button></li>`).join("")}
            </ul>
          </div>`).join("")}
      </section>`;

    app.querySelectorAll(".seg-card [data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
    drawMap(document.getElementById("map"), s);
  }

  function drawMap(host, s) {
    const W = 1200, H = 820, cx = W / 2, cy = H / 2;
    const R1 = 205, R2 = 125;
    const n = s.segments.length;
    let out = "";

    out += `<defs>
      <radialGradient id="coreGlow"><stop offset="0" stop-color="#3fd2ff" stop-opacity=".55"/><stop offset="1" stop-color="#3fd2ff" stop-opacity="0"/></radialGradient>
    </defs>`;
    out += `<circle cx="${cx}" cy="${cy}" r="${R1}" class="orbit spin"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="${R1 + R2 + 70}" class="orbit"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="90" fill="url(#coreGlow)" class="pulse"/>`;

    const segParts = [];
    s.segments.forEach((seg, i) => {
      const a = -90 + (i * 360) / n;
      const sx = cx + R1 * Math.cos(rad(a));
      const sy = cy + R1 * Math.sin(rad(a));
      out += `<line class="link" x1="${cx}" y1="${cy}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke-dasharray="3 4"/>`;

      const k = seg.companies.length;
      const spread = k > 1 ? Math.min(150, 26 * (k - 1)) : 0;
      seg.companies.forEach((c, j) => {
        const ca = a - spread / 2 + (k > 1 ? (j * spread) / (k - 1) : 0);
        const x = sx + R2 * Math.cos(rad(ca));
        const y = sy + R2 * Math.sin(rad(ca));
        const flip = Math.cos(rad(ca)) < 0;
        const rot = flip ? ca + 180 : ca;
        out += `<line class="link" x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
        out += `<g class="co-node ${c.live ? "live" : ""}" data-go="${c.id}" tabindex="0" role="link" aria-label="${esc(c.name)}">
          <title>${esc(c.name)} (${esc(c.ticker)})${c.live ? " · deep dive live" : " · queued"}</title>
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${c.live ? 8 : 6}"/>
          <text x="${x.toFixed(1)}" y="${y.toFixed(1)}" dy="0.35em"
            transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}) translate(${flip ? -14 : 14} 0)"
            text-anchor="${flip ? "end" : "start"}" font-family="IBM Plex Mono, monospace">${esc(c.live ? c.name : c.ticker)}</text>
        </g>`;
      });

      const label = seg.name;
      const w = label.length * 7 + 26;
      segParts.push(`<g class="seg-node">
        <circle class="halo" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="16"/>
        <rect x="${(sx - w / 2).toFixed(1)}" y="${(sy - 13).toFixed(1)}" width="${w}" height="26" rx="13" fill="#0d1526" stroke="rgba(63,210,255,.55)"/>
        <text x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" dy="0.36em" text-anchor="middle">${esc(label)}</text>
      </g>`);
    });
    out += segParts.join("");

    out += `<circle cx="${cx}" cy="${cy}" r="58" fill="#0a1120" stroke="#3fd2ff" stroke-opacity=".6"/>
      <circle cx="${cx}" cy="${cy}" r="66" fill="none" stroke="#3fd2ff" stroke-opacity=".2" stroke-dasharray="1 5"/>
      <text class="core-label" x="${cx}" y="${cy - 2}" text-anchor="middle">${esc(s.short)}</text>
      <text class="core-sub" x="${cx}" y="${cy + 18}" text-anchor="middle">${s.segments.flatMap((g) => g.companies).length} NODES</text>`;

    host.innerHTML = `<svg class="map-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(s.name)} universe map">${out}</svg>`;
    host.querySelectorAll(".co-node").forEach((g) => {
      g.addEventListener("click", () => go(g.dataset.go));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(g.dataset.go); } });
    });
  }

  // ======================================================================
  // Company view
  // ======================================================================
  function renderCompany(id) {
    const loc = findCompany(id);
    markCurrent(loc.sector.id);
    const data = COMPANIES[id];
    const crumbs = `<nav class="crumbs" aria-label="Breadcrumb">
      <button data-go="${loc.sector.id}">${esc(loc.sector.name)}</button><span>/</span>
      <span>${esc(loc.segment.name)}</span><span>/</span><span style="color:var(--fg)">${esc(loc.company.ticker)}</span></nav>`;

    if (!loc.company.live || !data) {
      app.innerHTML = `${crumbs}
        <section class="panel queued-box fade-in">
          <div class="eyebrow">${esc(loc.company.ticker)} · in build queue</div>
          <h2>${esc(loc.company.name)}</h2>
          <p>This deep dive has not been built yet. Add the company to COMPANIES in data.js and set it live in SECTORS to switch this page on.</p>
          <button class="btn" data-go="${loc.sector.id}">Back to ${esc(loc.sector.name)} map</button>
        </section>`;
      app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
      return;
    }

    const model = MODELS[data.sentimentModel];
    app.innerHTML = `${crumbs}
      <div class="sample-banner"><b>SAMPLE DATA</b> Financials, price, estimates and sentiment readings are placeholders for the interface build. Replace them with house-model numbers in data.js.</div>

      <section class="co-hero fade-in">
        <div>
          <div class="eyebrow">${esc(data.exchange)}: ${esc(data.ticker)} · ${esc(loc.segment.name)}</div>
          <h1>${esc(data.name)}</h1>
          <div class="meta"><span class="tag">HQ ${esc(data.hq)}</span><span class="tag">Est. ${data.founded}</span><span class="tag">Rating ${esc(data.rating)}</span><span class="tag">TP ${data.targetPrice ? "₹" + fmt(data.targetPrice) : "—"}</span></div>
        </div>
        <div class="quote" id="quote"></div>
      </section>

      <div class="grid-2">
        <section class="panel about fade-in">
          <div class="panel-head"><div><div class="eyebrow">Company</div><h2>About</h2></div></div>
          ${data.about.map((p) => `<p>${esc(p)}</p>`).join("")}
          <div class="facts">${data.facts.map((f) => `<div class="fact"><div class="k">${esc(f.k)}</div><div class="v">${esc(f.v)}</div></div>`).join("")}</div>
        </section>
        <section class="panel fade-in">
          <div class="panel-head"><div><div class="eyebrow">Demand</div><h2>End-market mix</h2></div><span class="note">% of revenue, indicative</span></div>
          <div class="mix">${data.endMarkets.map((m) => `
            <div class="mix-row"><span>${esc(m.name)}</span><span class="mono" style="text-align:right">${m.share}%</span>
            <div class="mix-track"><div class="mix-fill" style="width:${m.share * 2.2}%"></div></div></div>`).join("")}
          </div>
          <div class="panel-head" style="margin:18px 0 8px"><div><div class="eyebrow">Monitor</div><h2>What to watch</h2></div></div>
          <ul class="watch">${data.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
        </section>
      </div>

      <section class="panel fade-in">
        <div class="panel-head"><div><div class="eyebrow">Product portfolio</div><h2>Rating spectrum</h2></div><span class="note">MVA on log scale · bubble = share of revenue</span></div>
        <div class="prod-wrap" id="products"></div>
      </section>

      <section class="panel fade-in">
        <div class="panel-head"><div><div class="eyebrow">Key financials · ₹ crore</div><h2>Earnings trajectory</h2></div><span class="note">FY ending March · shaded columns are estimates</span></div>
        <div class="fin-wrap" id="finchart"></div>
        <div class="fin-legend">
          <span><span class="sw" style="background:var(--cyan)"></span>Revenue (actual)</span>
          <span><span class="sw" style="background:var(--amber-dim);border:1px dashed var(--amber)"></span>Revenue (estimate)</span>
          <span><span class="sw" style="background:var(--violet);height:3px;vertical-align:3px"></span>EBITDA margin (right axis)</span>
        </div>
        <div class="fin-wrap" style="margin-top:16px"><table class="fin" id="fintable"></table></div>
      </section>

      <section class="panel fade-in" id="sentiment"></section>`;

    app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));

    const state = { cmp: data.cmp };
    const refreshValuation = () => { renderQuote(data, state); renderFinTable(data, state); };
    renderQuote(data, state, refreshValuation);
    drawProducts(document.getElementById("products"), data.products);
    drawFinChart(document.getElementById("finchart"), data.financials);
    renderFinTable(data, state);
    renderSentiment(document.getElementById("sentiment"), data, model);
  }

  // ---------- quote strip with editable CMP ----------
  function renderQuote(data, state, onChange) {
    const host = document.getElementById("quote");
    const mcap = state.cmp * data.sharesCr;
    const nextE = data.financials.find((f) => f.e);
    const pe = nextE ? mcap / nextE.pat : null;
    if (!host.dataset.built) {
      host.innerHTML = `
        <div class="stat"><label class="eyebrow" for="cmp-input">CMP ₹ (${esc(data.asOf)})</label><div><input id="cmp-input" class="cmp-input mono" type="number" min="1" step="1" value="${state.cmp}"></div></div>
        <div class="stat"><div class="eyebrow">Mkt cap ₹ cr</div><div class="v mono" id="q-mcap"></div></div>
        <div class="stat"><div class="eyebrow">P/E ${nextE ? esc(nextE.fy) : ""}</div><div class="v mono" id="q-pe"></div></div>
        <div class="stat"><div class="eyebrow">Net cash ₹ cr</div><div class="v mono">${fmt(data.netCash)}</div></div>`;
      host.dataset.built = "1";
      host.querySelector("#cmp-input").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        if (v > 0) { state.cmp = v; onChange && onChange(); }
      });
    }
    host.querySelector("#q-mcap").textContent = fmt(mcap);
    host.querySelector("#q-pe").textContent = pe ? pe.toFixed(1) + "x" : "—";
  }

  // ---------- product rating spectrum ----------
  function drawProducts(host, products) {
    const W = 860, rowH = 50, top = 34, H = top + products.length * rowH + 10;
    const x0 = 270, x1 = 760;
    const lmin = Math.log10(0.1), lmax = Math.log10(200);
    const X = (mva) => x0 + ((Math.log10(mva) - lmin) / (lmax - lmin)) * (x1 - x0);
    const ticks = [0.1, 0.5, 1, 2.5, 10, 50, 160];
    let out = `<defs><linearGradient id="spec" gradientUnits="userSpaceOnUse" x1="${x0}" x2="${x1}" y1="0" y2="0"><stop offset="0" stop-color="#9a8cff"/><stop offset="1" stop-color="#3fd2ff"/></linearGradient></defs>`;
    ticks.forEach((t) => {
      out += `<line x1="${X(t)}" x2="${X(t)}" y1="${top - 8}" y2="${H - 8}" stroke="#1c2a44"/>
        <text x="${X(t)}" y="${top - 14}" text-anchor="middle" fill="#8494b0" font-size="11" font-family="IBM Plex Mono, monospace">${t} MVA</text>`;
    });
    products.forEach((p, i) => {
      const y = top + i * rowH + rowH / 2;
      const r = 6 + Math.sqrt(p.share) * 2.2;
      out += `<text x="0" y="${y - 4}" fill="#dfe8f6" font-size="13" font-weight="500">${esc(p.name)}</text>
        <text x="0" y="${y + 13}" fill="#56657f" font-size="11">${esc(p.kv)} · ${esc(p.note)}</text>
        <line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="#16223a" stroke-width="10" stroke-linecap="round"/>
        <line x1="${X(p.mvaMin)}" x2="${X(p.mvaMax)}" y1="${y}" y2="${y}" stroke="url(#spec)" stroke-width="10" stroke-linecap="round"/>
        <text x="${X(p.mvaMax) + 10}" y="${y + 4}" fill="#8494b0" font-size="11" font-family="IBM Plex Mono, monospace">${p.mvaMax} MVA</text>
        <circle cx="${W - 40}" cy="${y}" r="${r}" fill="rgba(63,210,255,.14)" stroke="#3fd2ff"/>
        <text x="${W - 40}" y="${y + 4}" text-anchor="middle" fill="#fff" font-size="11" font-family="IBM Plex Mono, monospace">${p.share}%</text>`;
    });
    host.innerHTML = `<svg class="prod-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Product rating spectrum">${out}</svg>`;
  }

  // ---------- financial chart ----------
  function drawFinChart(host, fin) {
    const W = 760, H = 300, L = 56, R = 56, T = 20, B = 36;
    const iw = W - L - R, ih = H - T - B;
    const maxRev = Math.max(...fin.map((f) => f.revenue));
    const step = niceStep(maxRev, 4);
    const top = Math.ceil(maxRev / step) * step;
    const mMax = 0.25;
    const bw = (iw / fin.length) * 0.5;
    const xc = (i) => L + (iw / fin.length) * (i + 0.5);
    const yR = (v) => T + ih - (v / top) * ih;
    const yM = (m) => T + ih - (m / mMax) * ih;

    let out = `<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="rgba(255,180,73,.08)"/><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,180,73,.35)" stroke-width="2"/></pattern>
      <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fd2ff"/><stop offset="1" stop-color="#3fd2ff" stop-opacity=".35"/></linearGradient></defs>`;
    for (let v = 0; v <= top; v += step) {
      out += `<line x1="${L}" x2="${W - R}" y1="${yR(v)}" y2="${yR(v)}" stroke="#1c2a44"/>
        <text x="${L - 8}" y="${yR(v) + 4}" text-anchor="end" fill="#8494b0" font-size="11" font-family="IBM Plex Mono, monospace">${fmt(v)}</text>`;
    }
    for (let m = 0; m <= mMax + 1e-9; m += 0.05) {
      out += `<text x="${W - R + 8}" y="${yM(m) + 4}" fill="#9a8cff" font-size="11" font-family="IBM Plex Mono, monospace">${Math.round(m * 100)}%</text>`;
    }
    const firstE = fin.findIndex((f) => f.e);
    if (firstE > 0) {
      const xs = L + (iw / fin.length) * firstE;
      out += `<rect x="${xs}" y="${T}" width="${W - R - xs}" height="${ih}" fill="rgba(255,180,73,.04)"/>
        <line x1="${xs}" x2="${xs}" y1="${T}" y2="${T + ih}" stroke="#ffb449" stroke-dasharray="3 4" stroke-opacity=".6"/>
        <text x="${xs + 6}" y="${T + 12}" fill="#ffb449" font-size="10.5" font-family="IBM Plex Mono, monospace" letter-spacing="1.5">ESTIMATES</text>`;
    }
    fin.forEach((f, i) => {
      const x = xc(i) - bw / 2, y = yR(f.revenue);
      out += f.e
        ? `<rect x="${x}" y="${y}" width="${bw}" height="${T + ih - y}" fill="url(#hatch)" stroke="#ffb449" stroke-dasharray="4 3" rx="3"/>`
        : `<rect x="${x}" y="${y}" width="${bw}" height="${T + ih - y}" fill="url(#barG)" rx="3"/>`;
      out += `<text x="${xc(i)}" y="${y - 6}" text-anchor="middle" fill="${f.e ? "#ffb449" : "#dfe8f6"}" font-size="11" font-family="IBM Plex Mono, monospace">${fmt(f.revenue)}</text>
        <text x="${xc(i)}" y="${H - 12}" text-anchor="middle" fill="${f.e ? "#ffb449" : "#8494b0"}" font-size="11.5" font-family="IBM Plex Mono, monospace">${f.fy}</text>`;
    });
    const pts = fin.map((f, i) => [xc(i), yM(f.ebitda / f.revenue)]);
    out += `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#9a8cff" stroke-width="2.2"/>`;
    pts.forEach((p, i) => {
      const f = fin[i];
      out += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#060a12" stroke="#9a8cff" stroke-width="2"/>`;
      if (i === pts.length - 1) out += `<text x="${p[0] + 10}" y="${p[1] + 18}" fill="#9a8cff" font-size="11" font-family="IBM Plex Mono, monospace">${pct(f.ebitda / f.revenue)}</text>`;
    });
    host.innerHTML = `<svg class="fin-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Revenue and EBITDA margin">${out}</svg>`;
  }

  function renderFinTable(data, state) {
    const fin = data.financials;
    const mcap = state.cmp * data.sharesCr;
    const rows = [
      ["Revenue", (f) => fmt(f.revenue)],
      ["YoY growth", (f, p) => p ? pct(f.revenue / p.revenue - 1) : "—"],
      ["EBITDA", (f) => fmt(f.ebitda)],
      ["EBITDA margin", (f) => pct(f.ebitda / f.revenue)],
      ["PAT", (f) => fmt(f.pat)],
      ["EPS (₹)", (f) => fmt(f.pat / data.sharesCr, 1)],
      ["EPS growth", (f, p) => p ? pct(f.pat / p.pat - 1) : "—"],
      ["ROE", (f, p) => pct(f.pat / (p ? (f.networth + p.networth) / 2 : f.networth))],
      ["P/E at CMP (x)", (f) => (mcap / f.pat).toFixed(1)],
      ["EV/EBITDA at CMP (x)", (f) => ((mcap - data.netCash) / f.ebitda).toFixed(1)]
    ];
    document.getElementById("fintable").innerHTML = `
      <thead><tr><th>₹ crore</th>${fin.map((f) => `<th class="${f.e ? "est" : ""}">${f.fy}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(([name, fn]) => `<tr><td>${name}</td>${fin.map((f, i) => `<td class="${f.e ? "est" : ""}">${fn(f, fin[i - 1])}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }

  // ======================================================================
  // Sentiment tracker
  // ======================================================================
  const ZONES = [
    { max: 30, label: "Risk-off", color: "#ff5f7e" },
    { max: 45, label: "Cautious", color: "#ff9a6b" },
    { max: 60, label: "Neutral", color: "#8494b0" },
    { max: 75, label: "Constructive", color: "#3ee0a1" },
    { max: 100, label: "Euphoric", color: "#ffd166" }
  ];
  const zoneOf = (s) => ZONES.find((z) => s <= z.max) || ZONES[ZONES.length - 1];

  function score(model, vals) {
    const wsum = model.factors.reduce((a, f) => a + f.weight, 0);
    const contribs = model.factors.map((f) => ({ f, v: vals[f.id], c: (0.5 * f.weight * vals[f.id]) / wsum }));
    const total = clamp(50 + contribs.reduce((a, x) => a + x.c, 0), 0, 100);
    return { total, contribs, wsum };
  }

  function renderSentiment(host, data, model) {
    const vals = { ...model.presets.base.values };
    let preset = "base";
    const s = model.series;
    const lastB = s.basket[s.basket.length - 1], lastN = s.nifty[s.nifty.length - 1];

    host.innerHTML = `
      <div class="panel-head">
        <div><div class="eyebrow">Market sentiment tracker · ${esc(model.name)}</div><h2>Sentiment score & drivers</h2></div>
        <span class="note">Readings are sample inputs. Set them to your current view.</span>
      </div>
      <div class="senti">
        <div class="gauge-box">
          <div id="gauge"></div>
          <div class="score-label" id="score-label"></div>
          <p class="score-sum" id="score-sum"></p>
          <div class="presets" id="presets">${Object.entries(model.presets).map(([k, p]) => `<button class="preset" data-p="${k}">${esc(p.label)}</button>`).join("")}</div>
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:8px">Why the score is where it is</div>
          <ul class="reasons" id="reasons"></ul>
          <div class="eyebrow" style="margin:16px 0 4px">AI-trade transmission</div>
          <div class="chain" id="chain"></div>
        </div>
      </div>

      <div class="grid-2" style="margin-top:22px">
        <div>
          <div class="panel-head" style="margin-bottom:4px"><div><div class="eyebrow">Scenario lab</div><h2 style="font-size:16px">Factor readings</h2></div><span class="note">contribution in score points</span></div>
          <div id="factors"></div>
        </div>
        <div style="min-width:0">
          <div class="panel-head" style="margin-bottom:4px"><div><div class="eyebrow">Basket vs Nifty · rebased 100</div><h2 style="font-size:16px">Relative performance</h2></div>
            <span class="note mono">Basket ${lastB} · Nifty ${lastN} · rel ${((lastB / lastN - 1) * 100).toFixed(1)}%</span></div>
          <div class="idx-wrap" id="idx"></div>
          <ol class="watch" style="margin-top:10px" id="events"></ol>
          <p class="note" style="margin-top:8px">Illustrative series. Basket: ${model.basket.map(esc).join(", ")}.</p>
        </div>
      </div>`;

    const fhost = host.querySelector("#factors");
    fhost.innerHTML = model.factors.map((f) => `
      <div class="factor">
        <label class="fname" for="f-${f.id}">${esc(f.name)}<small>w ${Math.round(f.weight * 100)}%</small></label>
        <span class="contrib" id="c-${f.id}"></span>
        <input type="range" id="f-${f.id}" min="-100" max="100" step="5" value="${vals[f.id]}" aria-describedby="e-${f.id}">
        <div class="ends" id="e-${f.id}"><span>◂ ${esc(f.left)}</span><span>${esc(f.right)} ▸</span></div>
        <div class="contrib-bar"><span id="b-${f.id}"></span></div>
      </div>`).join("");

    model.factors.forEach((f) => {
      host.querySelector("#f-" + f.id).addEventListener("input", (e) => {
        vals[f.id] = +e.target.value;
        preset = null;
        update();
      });
    });
    host.querySelector("#presets").addEventListener("click", (e) => {
      const b = e.target.closest("[data-p]");
      if (!b) return;
      preset = b.dataset.p;
      Object.assign(vals, model.presets[preset].values);
      model.factors.forEach((f) => (host.querySelector("#f-" + f.id).value = vals[f.id]));
      update();
    });

    drawIndex(host.querySelector("#idx"), model);
    host.querySelector("#events").innerHTML = model.events.map((ev, i) =>
      `<li><span class="mono" style="color:${ev.type === "anti" ? "var(--neg)" : "var(--warn)"}">${i + 1} · ${esc(ev.month)}</span> ${esc(ev.label)}</li>`).join("");

    function update() {
      const r = score(model, vals);
      const z = zoneOf(r.total);
      drawGauge(host.querySelector("#gauge"), r.total);
      const lab = host.querySelector("#score-label");
      lab.textContent = z.label;
      lab.style.color = z.color;

      const sorted = [...r.contribs].sort((a, b) => Math.abs(b.c) - Math.abs(a.c));
      const drag = [...r.contribs].sort((a, b) => a.c - b.c)[0];
      const lift = [...r.contribs].sort((a, b) => b.c - a.c)[0];
      host.querySelector("#score-sum").textContent =
        `Biggest drag: ${drag.c < 0 ? drag.f.name : "none"}. Biggest support: ${lift.c > 0 ? lift.f.name : "none"}.` +
        (z.label === "Euphoric" ? " Crowding risk: sentiment this strong often precedes sharp pullbacks." : "");

      const maxC = 0.5 * 100 * Math.max(...model.factors.map((f) => f.weight)) / r.wsum;
      r.contribs.forEach(({ f, c }) => {
        const el = host.querySelector("#c-" + f.id);
        el.textContent = (c >= 0 ? "+" : "−") + Math.abs(c).toFixed(1);
        el.className = "contrib " + (c > 0.05 ? "pos" : c < -0.05 ? "neg" : "");
        const bar = host.querySelector("#b-" + f.id);
        const w = (Math.abs(c) / maxC) * 50;
        bar.style.width = w + "%";
        bar.style.left = c >= 0 ? "50%" : 50 - w + "%";
        bar.style.background = c >= 0 ? "var(--pos)" : "var(--neg)";
      });

      host.querySelector("#reasons").innerHTML = sorted.slice(0, 4).map(({ f, v, c }) => {
        const tone = v <= -20 ? "bear" : v >= 20 ? "bull" : "neutral";
        const col = tone === "bear" ? "var(--neg)" : tone === "bull" ? "var(--pos)" : "var(--faint)";
        return `<li class="reason"><span class="stripe" style="background:${col}"></span><div>
          <span class="why" style="color:${col}">${tone === "bear" ? "Drag" : tone === "bull" ? "Support" : "Neutral"} · ${(c >= 0 ? "+" : "−") + Math.abs(c).toFixed(1)} pts</span>
          <h4>${esc(f.name)}</h4><p>${esc(f[tone])}</p></div></li>`;
      }).join("");

      const ai = vals.ai;
      const chain = ai <= -20
        ? ["Hyperscaler capex doubts", "Global AI-power names sell off", "India transformer basket de-rates", `${data.ticker} under pressure`]
        : ai >= 20
          ? ["Hyperscaler capex upgrades", "Global AI-power names re-rate", "India transformer basket bid", `${data.ticker} supported`]
          : ["AI trade range-bound", "Global read-through muted", "Domestic orders & earnings drive", `${data.ticker} trades on fundamentals`];
      const cc = ai <= -20 ? "var(--neg)" : ai >= 20 ? "var(--pos)" : "var(--muted)";
      host.querySelector("#chain").innerHTML = chain.map((t, i) =>
        `<span class="node" style="${i === chain.length - 1 ? `border-color:${cc};color:${cc}` : ""}">${esc(t)}</span>${i < chain.length - 1 ? '<span class="arrow">→</span>' : ""}`).join("");

      host.querySelectorAll(".preset").forEach((b) => b.classList.toggle("on", b.dataset.p === preset));
    }
    update();
  }

  function drawGauge(host, value) {
    const W = 340, H = 240, cx = 170, cy = 160, r = 130;
    const pt = (v, rr) => {
      const a = rad(180 + v * 1.8);
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    };
    let out = "";
    let from = 0;
    ZONES.forEach((z) => {
      const [x1, y1] = pt(from + 0.6, r), [x2, y2] = pt(z.max - 0.6, r);
      out += `<path d="M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}" fill="none" stroke="${z.color}" stroke-opacity=".85" stroke-width="14"/>`;
      from = z.max;
    });
    for (let t = 0; t <= 100; t += 10) {
      const [a1, b1] = pt(t, r - 14), [a2, b2] = pt(t, r - (t % 50 === 0 ? 26 : 20));
      out += `<line x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}" stroke="#56657f" stroke-width="1.2"/>`;
    }
    [0, 50, 100].forEach((t) => {
      const [x, y] = pt(t, r - 38);
      out += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="#8494b0" font-size="11" font-family="IBM Plex Mono, monospace">${t}</text>`;
    });
    const [nx, ny] = pt(value, r - 8);
    out += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="#fff" stroke-width="2.4" stroke-linecap="round" style="filter:drop-shadow(0 0 6px #3fd2ff)"/>
      <circle cx="${cx}" cy="${cy}" r="7" fill="#060a12" stroke="#3fd2ff" stroke-width="2"/>
      <text x="${cx}" y="${cy + 50}" text-anchor="middle" fill="#fff" font-size="40" font-weight="600" font-family="Chakra Petch, sans-serif">${Math.round(value)}</text>
      <text x="${cx}" y="${cy + 68}" text-anchor="middle" fill="#8494b0" font-size="10" letter-spacing="2" font-family="IBM Plex Mono, monospace">OF 100</text>`;
    host.innerHTML = `<svg class="gauge-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sentiment score ${Math.round(value)} of 100">${out}</svg>`;
  }

  function drawIndex(host, model) {
    const s = model.series;
    const W = 680, H = 260, L = 40, R = 16, T = 16, B = 30;
    const iw = W - L - R, ih = H - T - B;
    const all = s.basket.concat(s.nifty);
    const lo = Math.floor(Math.min(...all) / 10) * 10, hi = Math.ceil(Math.max(...all) / 10) * 10;
    const X = (i) => L + (i / (s.months.length - 1)) * iw;
    const Y = (v) => T + ih - ((v - lo) / (hi - lo)) * ih;
    let out = `<defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fd2ff" stop-opacity=".28"/><stop offset="1" stop-color="#3fd2ff" stop-opacity="0"/></linearGradient></defs>`;
    for (let v = lo; v <= hi; v += 10) {
      out += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#1c2a44"/>
        <text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" fill="#8494b0" font-size="10.5" font-family="IBM Plex Mono, monospace">${v}</text>`;
    }
    s.months.forEach((m, i) => {
      if (i % 3 === 0) out += `<text x="${X(i)}" y="${H - 10}" text-anchor="middle" fill="#8494b0" font-size="10.5" font-family="IBM Plex Mono, monospace">${m}</text>`;
    });
    model.events.forEach((ev, k) => {
      const i = s.months.indexOf(ev.month);
      if (i < 0) return;
      const col = ev.type === "anti" ? "#ff5f7e" : "#ffd166";
      out += `<line x1="${X(i)}" x2="${X(i)}" y1="${T}" y2="${T + ih}" stroke="${col}" stroke-dasharray="2 4" stroke-opacity=".7"/>
        <circle cx="${X(i)}" cy="${T + 8 + (k % 2) * 20}" r="8" fill="#060a12" stroke="${col}"/>
        <text x="${X(i)}" y="${T + 12 + (k % 2) * 20}" text-anchor="middle" fill="${col}" font-size="10" font-family="IBM Plex Mono, monospace">${k + 1}</text>`;
    });
    const line = (arr) => arr.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    out += `<polygon points="${X(0)},${T + ih} ${line(s.basket)} ${X(s.basket.length - 1)},${T + ih}" fill="url(#areaG)"/>
      <polyline points="${line(s.nifty)}" fill="none" stroke="#8494b0" stroke-width="1.6" stroke-dasharray="5 4"/>
      <polyline points="${line(s.basket)}" fill="none" stroke="#3fd2ff" stroke-width="2.2"/>`;
    const li = s.basket.length - 1;
    out += `<circle cx="${X(li)}" cy="${Y(s.basket[li])}" r="4" fill="#3fd2ff"/>
      <circle cx="${X(li)}" cy="${Y(s.nifty[li])}" r="3" fill="#8494b0"/>
      <text x="${W - R - 6}" y="${T + ih - 22}" text-anchor="end" fill="#3fd2ff" font-size="11" font-family="IBM Plex Mono, monospace">— Transformer basket</text>
      <text x="${W - R - 6}" y="${T + ih - 8}" text-anchor="end" fill="#8494b0" font-size="11" font-family="IBM Plex Mono, monospace">- - Nifty 50</text>`;
    host.innerHTML = `<svg class="idx-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Transformer basket versus Nifty">${out}</svg>`;
  }

  // ---------- boot ----------
  buildNav();
  render();
})();
