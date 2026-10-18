/* Coverage terminal: sector value chains (single-line diagrams) + company datasheets.
   Views are rendered from window.SECTORS / COMPANIES / SENTIMENT_MODELS (data.js)
   and the equipment drawings in window.ART (art.js). */
(function () {
  "use strict";

  const SECTORS = window.SECTORS;
  const COMPANIES = window.COMPANIES;
  const MODELS = window.SENTIMENT_MODELS;
  const ART = window.ART || {};

  const app = document.getElementById("app");
  const nav = document.getElementById("sector-nav");

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, d = 0) => n == null || !isFinite(n) ? "—" : n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (n, d = 1) => n == null || !isFinite(n) ? "—" : (n * 100).toFixed(d) + "%";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sign = (c) => (c >= 0 ? "+" : "−") + Math.abs(c).toFixed(1);

  // 24px line icons: fallback drawing for products without a line-art plate.
  const ICONS = {
    turbine: '<path d="M3 8h3l2-3h8l2 3h3v8h-3l-2 3H8l-2-3H3z"/><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5V7M14.2 13.2l2 1.2M9.8 13.2l-2 1.2"/>',
    boiler: '<rect x="6" y="6" width="12" height="15" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 10h6M9 16c1-1.4 2-1.4 3 0s2 1.4 3 0"/>',
    genset: '<rect x="3" y="7" width="18" height="11" rx="1.5"/><path d="M7 18v2.5M17 18v2.5M6.5 11h4M14 9.5l-1.8 3h3.6l-1.8 3"/>',
    tower: '<path d="M12 2L7 22M12 2l5 20M6 7h12M9.6 11h4.8M8.5 15.5h7M8.5 15.5l6-4.5M15.5 15.5l-6-4.5M7 22h10"/>',
    substation: '<path d="M3 21h18M5 21V11h4v10M15 21V11h4v10M9 14h6M7 11V7M17 11V7M5 7h4M15 7h4M12 14V4"/>',
    transformer: '<rect x="5" y="8" width="14" height="13" rx="1.5"/><path d="M8.5 8V4.5M12 8V3M15.5 8V4.5M8 12v5.5M11 12v5.5M14 12v5.5M17 12v5.5"/>',
    switchgear: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 9h14M5 15h14M8.5 6h3M8.5 12h3M8.5 18h3"/><circle cx="15.5" cy="12" r="1"/>',
    cable: '<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/><circle cx="3" cy="17" r="1.6"/><circle cx="21" cy="17" r="1.6"/>',
    motor: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 12h5M7 7v10M10.5 7v10M5.5 17v3M13.5 17v3"/>',
    robot: '<path d="M4 21h8M8 21v-4.5l4-6 5 2M17 12.5l2.5-4"/><circle cx="12" cy="10.5" r="1.6"/><circle cx="8" cy="16.5" r="1.6"/><path d="M19.5 8.5l1.8-1M19.5 8.5l1 1.8"/>',
    server: '<rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="10" width="16" height="6" rx="1.5"/><path d="M8 6h.01M8 13h.01M12 16v3M7 21h10M15 6h2M15 13h2"/>',
    train: '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 10h12M9 13.5h.01M15 13.5h.01M9 17l-2 4M15 17l2 4"/>',
    mill: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><path d="M12 3.5v3.5M12 17v3.5M3.5 12H7M17 12h3.5"/><circle cx="10.5" cy="13.5" r="1"/><circle cx="13.5" cy="11" r="1"/>',
    crystal: '<path d="M12 3l6 5-6 13L6 8z"/><path d="M6 8h12M12 3l-2 5 2 13 2-13z"/>',
    wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4L18 6"/>',
    ceramic: '<path d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9z"/><path d="M12 12V21M12 12l7.5-4.5M12 12L4.5 7.5"/>',
    polymer: '<path d="M3 15c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><circle cx="6" cy="8" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="8" r="1.6"/><path d="M7.5 7.5l3-1M13.5 6.5l3 1"/>',
    compressor: '<rect x="3" y="10" width="13" height="8" rx="4"/><path d="M16 14h3V8h2M7 10V7h5v3M6 18v2.5M13 18v2.5"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3 0-3-1-5.5.5-8z"/>',
    drop: '<path d="M12 3c3 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-6.5 6-11z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
    engine: '<path d="M4 9h3l2-2h5v2h3l2 2v6h-2l-2 2H9l-2-2H4z"/><path d="M2 12h2M20 13h2M10 7V4.5h3"/>',
    building: '<path d="M4 21V5l8-3v19M12 9h8v12M3 21h18M7 7h2M7 11h2M7 15h2M15 13h2M15 17h2"/>',
    pipe: '<path d="M2 8h7v8H2M9 12h6M15 6h7v12h-7z"/>',
    solar: '<path d="M4 15l2-8h12l2 8z M5 11h14M10 7l-1 8M14 7l1 8M12 15v4M8 21h8"/>',
    switch: '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="9" y="7" width="6" height="10" rx="1"/><path d="M9 12h6"/>',
    fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2C11 6 12.5 3 15 3.8s.2 5-3 6.4M13.7 13c3.5 2.4 4.5 5.6 2.3 6.8S12.5 17 12 13.8M10.4 12.6c-4 1.8-7.2.8-7-1.6s4.6-2.8 7-.6"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    ac: '<rect x="2" y="5" width="20" height="8" rx="2"/><path d="M5 10h14M7 16v3M12 16v4M17 16v3"/>',
    snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 6l2.5-1.5M9.5 19.5L12 18l2.5 1.5"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    pot: '<path d="M5 10h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M2.5 10h19M12 10V7M9 7h6"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>',
    pcb: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4v4h4M7 16h3M14 16h3v-3"/><circle cx="7" cy="8" r="1"/><circle cx="17" cy="13" r="1"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    car: '<path d="M3 16v-3l2.2-5h13.6l2.2 5v3z"/><path d="M3 16v2.5h3V16M18 16v2.5h3V16M7 12.5h.01M17 12.5h.01"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
  };
  // Equipment drawing for a product: line art if we have it, else the scaled icon.
  const pic = (name) => `<svg class="art" viewBox="0 0 120 90" aria-hidden="true">${
    ART[name] || `<g class="ico" transform="translate(30 15) scale(2.5)">${ICONS[name] || ICONS.gear}</g>`}</svg>`;

  function findCompany(id) {
    for (const s of Object.values(SECTORS)) {
      const c = s.coverage.find((x) => x.id === id);
      if (c) return { sector: s, company: c };
    }
    return null;
  }
  // Every value-chain product a company appears in, within its sector.
  function footprint(sector, coId) {
    const out = [];
    sector.chains.forEach((ch) => ch.stages.forEach((st, i) => st.nodes.forEach((n, j) => {
      const hit = n.cos.find((c) => c.id === coId);
      if (hit) out.push({ chain: ch, stage: st, node: n, note: hit.note, code: `${i + 1}.${j + 1}` });
    })));
    return out;
  }
  function niceStep(max, ticks) {
    const raw = max / ticks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / mag;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  }
  const bindGo = (root) => root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));

  // ---------- routing ----------
  let current = { sector: null, company: null };
  function go(token) {
    if (location.hash.slice(1) === token) render();
    else location.hash = token;
  }
  function render() {
    const token = location.hash.slice(1) || "capgoods";
    if (SECTORS[token]) renderSector(SECTORS[token]);
    else if (findCompany(token)) renderCompany(token);
    else renderSector(SECTORS.capgoods);
    syncNav();
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", render);

  // ---------- sector rail (one dropdown per sector) ----------
  function buildNav() {
    nav.innerHTML = Object.values(SECTORS).map((s) => `
      <div class="sec" data-sec="${s.id}">
        <button class="sec-btn" aria-expanded="false" aria-controls="menu-${s.id}">
          <span class="nm">${esc(s.name)}</span>
          <span class="ct">${s.coverage.length}<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>
        </button>
        <div class="sec-menu" id="menu-${s.id}" hidden>
          <button class="sec-open" data-go="${s.id}">Value chain <span aria-hidden="true">→</span></button>
          ${s.coverage.map((c) => `
            <button class="sec-co" data-go="${c.id}" data-co="${c.id}">
              <span>${c.live ? '<span class="live-dot" title="Deep dive live"></span>' : ""}${esc(c.name)}</span><span class="tk">${esc(c.ticker)}</span>
            </button>`).join("")}
        </div>
      </div>`).join("");
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".sec-btn");
      if (btn) {
        const menu = btn.nextElementSibling;
        menu.hidden = !menu.hidden;
        btn.setAttribute("aria-expanded", String(!menu.hidden));
        return;
      }
      const t = e.target.closest("[data-go]");
      if (t) go(t.dataset.go);
    });
  }
  function syncNav() {
    nav.querySelectorAll(".sec").forEach((el) => {
      const on = el.dataset.sec === current.sector;
      el.classList.toggle("is-current", on);
      if (on) {
        el.querySelector(".sec-menu").hidden = false;
        el.querySelector(".sec-btn").setAttribute("aria-expanded", "true");
      }
      el.querySelectorAll(".sec-co").forEach((b) => b.classList.toggle("on", b.dataset.co === current.company));
    });
  }

  // ======================================================================
  // Sector page: value chain as a single-line diagram
  // ======================================================================
  function renderSector(s) {
    current = { sector: s.id, company: null };
    const live = s.coverage.filter((c) => c.live).length;
    const products = s.chains.reduce((a, ch) => a + ch.stages.reduce((b, st) => b + st.nodes.length, 0), 0);
    const byId = Object.fromEntries(s.coverage.map((c) => [c.id, c]));

    // Open on the first product that features a live company.
    let chainIdx = 0, nodeId = null, coSel = null;
    outer: for (let i = 0; i < s.chains.length; i++) {
      for (const st of s.chains[i].stages) for (const n of st.nodes) {
        if (n.cos.some((c) => byId[c.id] && byId[c.id].live)) { chainIdx = i; nodeId = n.id; break outer; }
      }
    }
    if (!nodeId) nodeId = s.chains[0].stages[0].nodes[0].id;

    app.innerHTML = `
      ${s.draft ? `<div class="hazard"><span class="stripe"></span><p><b>Draft universe.</b> This company list is a placeholder. Send the coverage list and it will be mapped like Capital Goods.</p></div>` : ""}
      <section class="title-block fade-in">
        <div>
          <div class="crumb">Sector · ${s.chains.length} value chain${s.chains.length > 1 ? "s" : ""}</div>
          <h1>${esc(s.name)}</h1>
          <p class="lede">${esc(s.tagline)}. Click any piece of equipment to see who makes it, or tag a company to trace where it plays.</p>
        </div>
        <div class="strip">
          <div><div class="label">Companies</div><div class="v">${s.coverage.length}</div></div>
          <div><div class="label">Products</div><div class="v">${products}</div></div>
          <div><div class="label">Deep dives</div><div class="v sig">${live}</div></div>
        </div>
      </section>

      <section class="sheet fade-in">
        <div class="sheet-head"><h2>Trace a company</h2><span class="label">■ = deep dive live</span></div>
        <div class="sheet-body"><div class="tagrow">${s.coverage.map((c) => `
          <button class="co-tag" data-co="${c.id}" aria-pressed="false">${c.live ? '<span class="live-dot" style="margin-right:0"></span>' : ""}${esc(c.name)}<span class="tk">${esc(c.ticker)}</span></button>`).join("")}
        </div></div>
      </section>

      <section class="sheet fade-in">
        <div class="sheet-head">
          <h2 id="chain-h"></h2>
          ${s.chains.length > 1 ? `<div class="tabs" role="tablist">${s.chains.map((ch, i) => `<button class="tab" role="tab" data-ch="${i}" aria-selected="false">${esc(ch.name)}</button>`).join("")}</div>` : ""}
        </div>
        <div class="sheet-body">
          <div class="sld-layout">
            <div class="sld-scroll"><div class="sld" id="sld"></div></div>
            <aside class="spec" id="spec" aria-live="polite"></aside>
          </div>
        </div>
      </section>`;

    const sld = document.getElementById("sld");
    const spec = document.getElementById("spec");

    const nodeById = (id) => {
      for (const ch of s.chains) for (const [i, st] of ch.stages.entries()) for (const [j, n] of st.nodes.entries()) if (n.id === id) return { ch, st, n, code: `${i + 1}.${j + 1}` };
      return null;
    };
    const inChain = (ch, pred) => ch.stages.some((st) => st.nodes.some(pred));

    function drawChain() {
      const ch = s.chains[chainIdx];
      document.getElementById("chain-h").textContent = ch.title;
      app.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.ch === chainIdx)));
      sld.classList.toggle("seq", !!ch.sequence);
      sld.innerHTML = ch.stages.map((st, i) => `
        <div class="stage">
          <div class="stage-head"><span class="code">${ch.sequence ? "STG " + (i + 1) : "ZONE"}</span><span class="nm">${esc(st.name)}</span></div>
          <div class="bus"></div>
          <div class="feeders">${st.nodes.map((n, j) => {
            const has = coSel && n.cos.some((c) => c.id === coSel);
            return `<button class="plate ${coSel ? (has ? "hit" : "dim") : ""}" data-node="${n.id}" aria-pressed="${n.id === nodeId && !coSel}">
              <span class="eq">EQ ${i + 1}.${j + 1}</span>
              <span class="pic">${pic(n.icon)}</span>
              <span class="cap"><span class="nm">${esc(n.name)}</span>
                <span class="tickers">${n.cos.map((c) => {
                  const co = byId[c.id];
                  return `<span class="tkr ${c.id === coSel ? "sel" : co && co.live ? "live" : ""}">${esc(co ? co.ticker : c.id)}</span>`;
                }).join("")}</span></span>
            </button>`;
          }).join("")}</div>
        </div>`).join("");
      sld.querySelectorAll(".plate").forEach((b) => b.addEventListener("click", () => {
        nodeId = b.dataset.node;
        setCompany(null);
        if (window.matchMedia("(max-width: 1180px)").matches) spec.scrollIntoView({ behavior: "smooth", block: "start" });
      }));
    }

    function drawSpec() {
      if (coSel) {
        const co = byId[coSel];
        const fp = footprint(s, coSel);
        spec.innerHTML = `
          <div class="spec-band"><span>Company trace</span><b>${esc(co.ticker)}</b></div>
          <div class="spec-body">
            <h3>${esc(co.name)}</h3>
            <div class="label">${fp.length} products across ${new Set(fp.map((f) => f.chain.id)).size} chain(s)</div>
            <ul class="fp-list">${fp.map((f) => `
              <li><span class="mini">${pic(f.node.icon)}</span><span><b>${esc(f.node.name)}</b><small>${esc(f.chain.name)} · EQ ${f.code}</small><small>${esc(f.note)}</small></span></li>`).join("")}
            </ul>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn" data-go="${co.id}">${co.live ? "Open deep dive" : "Open profile"} →</button>
              <button class="btn ghost" id="clear-co">Clear</button>
            </div>
          </div>`;
        bindGo(spec);
        spec.querySelector("#clear-co").addEventListener("click", () => setCompany(null));
        return;
      }
      const hit = nodeById(nodeId);
      if (!hit) { spec.innerHTML = ""; return; }
      const { st, n, code } = hit;
      spec.innerHTML = `
        <div class="spec-band"><span>Spec sheet · ${esc(st.name)}</span><b>EQ ${code}</b></div>
        <div class="pic">${pic(n.icon)}</div>
        <div class="spec-body">
          <h3>${esc(n.name)}</h3>
          <p class="desc">${esc(n.desc)}</p>
          <div>
            <div class="label" style="margin-bottom:6px">Made by · ${n.cos.length} covered</div>
            <ul class="rows">${n.cos.map((c) => {
              const co = byId[c.id];
              if (!co) return "";
              return `<li><button class="row-btn" data-go="${co.id}">
                <span class="nm">${esc(co.name)}<span class="tk">${esc(co.ticker)}</span></span>
                <span class="go">${co.live ? '<span class="badge live">Live</span>' : "Profile"} →</span>
                <span class="nt">${esc(c.note)}</span>
              </button></li>`;
            }).join("")}</ul>
          </div>
        </div>`;
      bindGo(spec);
    }

    function setCompany(id) {
      coSel = id;
      app.querySelectorAll(".co-tag").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.co === id)));
      const has = (n) => n.cos.some((c) => c.id === id);
      if (id && !inChain(s.chains[chainIdx], has)) {
        const i = s.chains.findIndex((ch) => inChain(ch, has));
        if (i >= 0) chainIdx = i;
      }
      drawChain();
      drawSpec();
    }

    app.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
      chainIdx = +t.dataset.ch;
      if (!inChain(s.chains[chainIdx], (n) => n.id === nodeId)) nodeId = s.chains[chainIdx].stages[0].nodes[0].id;
      drawChain();
      drawSpec();
    }));
    app.querySelectorAll(".co-tag").forEach((b) => b.addEventListener("click", () => setCompany(coSel === b.dataset.co ? null : b.dataset.co)));

    drawChain();
    drawSpec();
  }

  // ======================================================================
  // Company page: equipment datasheet
  // ======================================================================
  function renderCompany(id) {
    const loc = findCompany(id);
    const s = loc.sector;
    current = { sector: s.id, company: id };
    const data = COMPANIES[id];
    const fp = footprint(s, id);
    const crumb = `<div class="crumb"><button data-go="${s.id}">${esc(s.name)}</button><span>/</span><span>NSE: ${esc(loc.company.ticker)}</span></div>`;
    const fpHtml = `
      <section class="sheet fade-in">
        <div class="sheet-head"><h2>Value-chain footprint</h2><button class="btn ghost" data-go="${s.id}">${esc(s.name)} chain →</button></div>
        <div class="sheet-body"><div class="plates-row">${fp.map((f) => `
          <div class="plate"><span class="eq">EQ ${f.code}</span><span class="pic">${pic(f.node.icon)}</span>
            <span class="cap"><span class="nm">${esc(f.node.name)}</span><span class="sub">${esc(f.chain.name)} · ${esc(f.stage.name)}</span><span class="sub">${esc(f.note)}</span></span></div>`).join("")}
        </div></div>
      </section>`;

    if (!loc.company.live || !data) {
      app.innerHTML = `
        <section class="title-block fade-in"><div>${crumb}<h1>${esc(loc.company.name)}</h1>
          <p class="lede">Deep dive in the build queue. The value-chain footprint below comes from the sector map.</p></div>
          <div class="strip"><div><div class="label">Products</div><div class="v">${fp.length}</div></div><div><div class="label">Status</div><div class="v">QUEUED</div></div></div>
        </section>
        ${fpHtml}
        <section class="sheet empty fade-in">
          <div class="label">Next step</div>
          <p>Profile, financials with estimates and the sentiment tracker appear here once the company is added to COMPANIES in data.js and marked live.</p>
          <button class="btn" data-go="${s.id}">Back to ${esc(s.name)}</button>
        </section>`;
      bindGo(app);
      return;
    }

    const model = MODELS[data.sentimentModel];
    app.innerHTML = `
      <div class="hazard"><span class="stripe"></span><p><b>Sample data.</b> Financials, price, estimates and sentiment readings are placeholders for the interface build. Replace them with house-model numbers in data.js.</p></div>

      <section class="title-block fade-in">
        <div>${crumb}<h1>${esc(data.name)}</h1>
          <p class="lede">${esc(data.hq)} · Est. ${data.founded} · Rating ${esc(data.rating)} · TP ${data.targetPrice ? "₹" + fmt(data.targetPrice) : "—"}</p></div>
        <div class="strip" id="quote"></div>
      </section>

      <div class="grid-2">
        <section class="sheet about fade-in">
          <div class="sheet-head"><h2>About</h2></div>
          <div class="sheet-body">
            ${data.about.map((p) => `<p>${esc(p)}</p>`).join("")}
            <div class="facts">${data.facts.map((f) => `<div class="fact"><div class="label">${esc(f.k)}</div><div class="v">${esc(f.v)}</div></div>`).join("")}</div>
          </div>
        </section>
        <section class="sheet fade-in">
          <div class="sheet-head"><h2>End-market mix</h2><span class="label">% of revenue, indicative</span></div>
          <div class="sheet-body">
            <div class="mix">${data.endMarkets.map((m) => `
              <div class="mix-row"><span>${esc(m.name)}</span><span class="mono" style="text-align:right">${m.share}%</span>
              <div class="mix-track"><div class="mix-fill" style="width:${m.share * 2.2}%"></div></div></div>`).join("")}
            </div>
            <div class="label" style="margin:20px 0 8px">What to watch</div>
            <ul class="watch">${data.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
          </div>
        </section>
      </div>

      ${fpHtml}

      <section class="sheet fade-in">
        <div class="sheet-head"><h2>Rating spectrum</h2><span class="label">MVA, log scale · circle = share of revenue</span></div>
        <div class="sheet-body svg-wrap" id="products"></div>
      </section>

      <section class="sheet fade-in">
        <div class="sheet-head"><h2>Key financials</h2><span class="label">₹ crore · FY ending March</span></div>
        <div class="sheet-body">
          <div class="svg-wrap" id="finchart"></div>
          <div class="legend">
            <span><span class="sw" style="background:var(--ink)"></span>Revenue, actual</span>
            <span><span class="sw" style="background:repeating-linear-gradient(-45deg,var(--signal) 0 3px,var(--ink) 3px 4.5px)"></span>Revenue, estimate</span>
            <span><span class="sw" style="background:var(--neg);height:3px;border:0;vertical-align:3px"></span>EBITDA margin (right axis)</span>
          </div>
          <div class="svg-wrap" style="margin-top:18px"><table class="fin" id="fintable"></table></div>
        </div>
      </section>

      <section class="sheet fade-in" id="sentiment"></section>`;

    bindGo(app);
    const state = { cmp: data.cmp };
    const refresh = () => { renderQuote(data, state); renderFinTable(data, state); };
    renderQuote(data, state, refresh);
    drawProducts(document.getElementById("products"), data.products);
    drawFinChart(document.getElementById("finchart"), data.financials);
    renderFinTable(data, state);
    renderSentiment(document.getElementById("sentiment"), data, model);
  }

  function renderQuote(data, state, onChange) {
    const host = document.getElementById("quote");
    const mcap = state.cmp * data.sharesCr;
    const nextE = data.financials.find((f) => f.e);
    if (!host.dataset.built) {
      host.innerHTML = `
        <div><label class="label" for="cmp-input">CMP ₹ · ${esc(data.asOf)}</label><div><input id="cmp-input" class="cmp-input" type="number" min="1" step="1" value="${state.cmp}"></div></div>
        <div><div class="label">Mkt cap ₹ cr</div><div class="v" id="q-mcap"></div></div>
        <div><div class="label">P/E ${nextE ? esc(nextE.fy) : ""}</div><div class="v sig" id="q-pe"></div></div>
        <div><div class="label">Net cash ₹ cr</div><div class="v">${fmt(data.netCash)}</div></div>`;
      host.dataset.built = "1";
      host.querySelector("#cmp-input").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        if (v > 0) { state.cmp = v; onChange && onChange(); }
      });
    }
    host.querySelector("#q-mcap").textContent = fmt(mcap);
    host.querySelector("#q-pe").textContent = nextE ? (mcap / nextE.pat).toFixed(1) + "x" : "—";
  }

  // ---------- product rating spectrum ----------
  function drawProducts(host, products) {
    const W = 860, rowH = 52, top = 34, H = top + products.length * rowH + 6;
    const x0 = 320, x1 = 750;
    const lmin = Math.log10(0.1), lmax = Math.log10(200);
    const X = (mva) => x0 + ((Math.log10(mva) - lmin) / (lmax - lmin)) * (x1 - x0);
    let out = "";
    [0.1, 0.5, 1, 2.5, 10, 50, 160].forEach((t) => {
      out += `<line class="grid" x1="${X(t)}" x2="${X(t)}" y1="${top - 8}" y2="${H - 6}"/><text x="${X(t)}" y="${top - 14}" text-anchor="middle">${t}</text>`;
    });
    out += `<line class="axis" x1="${x0}" x2="${x1}" y1="${top - 8}" y2="${top - 8}"/><text x="${x1 + 10}" y="${top - 14}">MVA</text>`;
    products.forEach((p, i) => {
      const y = top + i * rowH + rowH / 2;
      const r = 6 + Math.sqrt(p.share) * 2.2;
      out += `<text class="t-strong" x="0" y="${y - 4}">${esc(p.name)}</text>
        <text class="t-sub" x="0" y="${y + 13}">${esc(p.kv)} · ${esc(p.note)}</text>
        <rect class="track" x="${x0}" y="${y - 6}" width="${x1 - x0}" height="12"/>
        <rect class="range" x="${X(p.mvaMin)}" y="${y - 6}" width="${X(p.mvaMax) - X(p.mvaMin)}" height="12"/>
        <text class="t-ink" x="${x1 + 10}" y="${y + 4}">${p.mvaMax}</text>
        <circle class="bubble" cx="${W - 36}" cy="${y}" r="${r}"/>
        <text class="t-ink" x="${W - 36}" y="${y + 4}" text-anchor="middle">${p.share}%</text>`;
    });
    host.innerHTML = `<svg class="chart" style="min-width:640px" viewBox="0 0 ${W} ${H}" role="img" aria-label="Product rating spectrum">${out}</svg>`;
  }

  // ---------- financial chart ----------
  function drawFinChart(host, fin) {
    const W = 760, H = 300, L = 56, R = 56, T = 20, B = 36;
    const iw = W - L - R, ih = H - T - B;
    const maxRev = Math.max(...fin.map((f) => f.revenue));
    const step = niceStep(maxRev, 4);
    const top = Math.ceil(maxRev / step) * step;
    const mMax = 0.25;
    const bw = (iw / fin.length) * 0.52;
    const xc = (i) => L + (iw / fin.length) * (i + 0.5);
    const yR = (v) => T + ih - (v / top) * ih;
    const yM = (m) => T + ih - (m / mMax) * ih;
    let out = `<defs><pattern id="hatchE" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="hatch-bg" width="7" height="7"/><line class="hatch-ln" x1="0" y1="0" x2="0" y2="7"/></pattern></defs>`;
    for (let v = 0; v <= top; v += step) out += `<line class="grid" x1="${L}" x2="${W - R}" y1="${yR(v)}" y2="${yR(v)}"/><text x="${L - 8}" y="${yR(v) + 4}" text-anchor="end">${fmt(v)}</text>`;
    for (let m = 0; m <= mMax + 1e-9; m += 0.05) out += `<text x="${W - R + 8}" y="${yM(m) + 4}">${Math.round(m * 100)}%</text>`;
    out += `<line class="axis" x1="${L}" x2="${W - R}" y1="${T + ih}" y2="${T + ih}"/>`;
    const firstE = fin.findIndex((f) => f.e);
    if (firstE > 0) {
      const xs = L + (iw / fin.length) * firstE;
      out += `<line class="est-line" x1="${xs}" x2="${xs}" y1="${T}" y2="${T + ih}"/><text class="t-ink" x="${xs + 6}" y="${T + 10}" letter-spacing="1">ESTIMATES →</text>`;
    }
    fin.forEach((f, i) => {
      const x = xc(i) - bw / 2, y = yR(f.revenue);
      out += `<rect class="${f.e ? "bar-e" : "bar-a"}" x="${x}" y="${y}" width="${bw}" height="${T + ih - y}"/>
        <text class="t-ink" x="${xc(i)}" y="${y - 6}" text-anchor="middle">${fmt(f.revenue)}</text>
        <text class="t-ink" x="${xc(i)}" y="${H - 12}" text-anchor="middle">${f.fy}</text>`;
    });
    const pts = fin.map((f, i) => [xc(i), yM(f.ebitda / f.revenue)]);
    out += `<polyline class="line-m" points="${pts.map((p) => p.join(",")).join(" ")}"/>`;
    pts.forEach((p, i) => {
      out += `<circle class="dot-m" cx="${p[0]}" cy="${p[1]}" r="4"/>`;
      if (i === pts.length - 1) out += `<text class="t-neg" x="${p[0] + 10}" y="${p[1] + 18}">${pct(fin[i].ebitda / fin[i].revenue)}</text>`;
    });
    host.innerHTML = `<svg class="chart" style="min-width:560px" viewBox="0 0 ${W} ${H}" role="img" aria-label="Revenue and EBITDA margin">${out}</svg>`;
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
    { max: 30, label: "Risk-off", color: "var(--neg)" },
    { max: 45, label: "Cautious", color: "#e9825f" },
    { max: 60, label: "Neutral", color: "var(--hair)" },
    { max: 75, label: "Constructive", color: "var(--pos)" },
    { max: 100, label: "Euphoric", color: "var(--signal)" }
  ];
  const zoneOf = (v) => ZONES.find((z) => v <= z.max) || ZONES[ZONES.length - 1];

  function score(model, vals) {
    const wsum = model.factors.reduce((a, f) => a + f.weight, 0);
    const contribs = model.factors.map((f) => ({ f, v: vals[f.id], c: (0.5 * f.weight * vals[f.id]) / wsum }));
    return { total: clamp(50 + contribs.reduce((a, x) => a + x.c, 0), 0, 100), contribs, wsum };
  }

  function renderSentiment(host, data, model) {
    const vals = { ...model.presets.base.values };
    let preset = "base";
    const s = model.series;
    const lastB = s.basket[s.basket.length - 1], lastN = s.nifty[s.nifty.length - 1];

    host.innerHTML = `
      <div class="sheet-head"><h2>Market sentiment · ${esc(model.name)}</h2><span class="label">Sample readings · set to your view</span></div>
      <div class="sheet-body">
        <div class="senti">
          <div>
            <div class="meter-score"><span class="num" id="score-num"></span><span class="of">/ 100</span></div>
            <div class="svg-wrap" id="meter"></div>
            <span class="zone-label" id="zone"></span>
            <p class="score-sum" id="score-sum"></p>
            <div class="presets" id="presets">${Object.entries(model.presets).map(([k, p]) => `<button class="preset" data-p="${k}">${esc(p.label)}</button>`).join("")}</div>
          </div>
          <div>
            <div class="label" style="margin-bottom:10px">Why the score is where it is</div>
            <ul class="reasons" id="reasons"></ul>
            <div class="label" style="margin:20px 0 2px">AI-trade transmission</div>
            <div class="transmission" id="transmission"></div>
          </div>
        </div>
        <div class="grid-2" style="margin-top:28px">
          <div>
            <div class="label" style="margin-bottom:4px">Scenario lab · factor readings (contribution in score points)</div>
            <div id="factors"></div>
          </div>
          <div style="min-width:0">
            <div class="label" style="margin-bottom:8px">Basket vs Nifty · rebased 100 · rel ${((lastB / lastN - 1) * 100).toFixed(1)}%</div>
            <div class="svg-wrap" id="idx"></div>
            <div class="legend"><span><span class="sw" style="background:var(--ink);height:3px;border:0;vertical-align:3px"></span>Transformer basket</span><span><span class="sw" style="border:0;border-top:2px dashed var(--steel);height:0;vertical-align:3px"></span>Nifty 50</span></div>
            <ol class="events" id="events"></ol>
            <p class="note" style="margin-top:8px">Illustrative series. Basket: ${model.basket.map(esc).join(", ")}.</p>
          </div>
        </div>
      </div>`;

    host.querySelector("#factors").innerHTML = model.factors.map((f) => `
      <div class="factor">
        <label class="fname" for="f-${f.id}">${esc(f.name)}<small>w ${Math.round(f.weight * 100)}%</small></label>
        <span class="contrib" id="c-${f.id}"></span>
        <input type="range" id="f-${f.id}" min="-100" max="100" step="5" value="${vals[f.id]}">
        <div class="ends"><span>◂ ${esc(f.left)}</span><span>${esc(f.right)} ▸</span></div>
        <div class="cbar"><span id="b-${f.id}"></span></div>
      </div>`).join("");

    model.factors.forEach((f) => host.querySelector("#f-" + f.id).addEventListener("input", (e) => {
      vals[f.id] = +e.target.value;
      preset = null;
      update();
    }));
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
      `<li><b class="mono" style="color:${ev.type === "anti" ? "var(--neg)" : "var(--warn)"}">[${i + 1}] ${esc(ev.month)}</b> ${esc(ev.label)}</li>`).join("");

    function update() {
      const r = score(model, vals);
      const z = zoneOf(r.total);
      host.querySelector("#score-num").textContent = Math.round(r.total);
      drawMeter(host.querySelector("#meter"), r.total);
      const zl = host.querySelector("#zone");
      zl.textContent = z.label;
      zl.style.background = z.color;

      const drag = [...r.contribs].sort((a, b) => a.c - b.c)[0];
      const lift = [...r.contribs].sort((a, b) => b.c - a.c)[0];
      host.querySelector("#score-sum").textContent =
        `Biggest drag: ${drag.c < 0 ? drag.f.name : "none"}. Biggest support: ${lift.c > 0 ? lift.f.name : "none"}.` +
        (z.label === "Euphoric" ? " Crowding risk: sentiment this strong often precedes sharp pullbacks." : "");

      const maxC = (0.5 * 100 * Math.max(...model.factors.map((f) => f.weight))) / r.wsum;
      r.contribs.forEach(({ f, c }) => {
        const el = host.querySelector("#c-" + f.id);
        el.textContent = sign(c);
        el.className = "contrib " + (c > 0.05 ? "pos" : c < -0.05 ? "neg" : "");
        const bar = host.querySelector("#b-" + f.id);
        const w = (Math.abs(c) / maxC) * 50;
        bar.style.width = w + "%";
        bar.style.left = c >= 0 ? "50%" : 50 - w + "%";
        bar.style.background = c >= 0 ? "var(--pos)" : "var(--neg)";
      });

      const sorted = [...r.contribs].sort((a, b) => Math.abs(b.c) - Math.abs(a.c));
      host.querySelector("#reasons").innerHTML = sorted.slice(0, 4).map(({ f, v, c }) => {
        const tone = v <= -20 ? "bear" : v >= 20 ? "bull" : "neutral";
        const col = tone === "bear" ? "var(--neg)" : tone === "bull" ? "var(--pos)" : "var(--hair)";
        const tcol = tone === "neutral" ? "var(--steel)" : col;
        return `<li class="reason"><span style="background:${col}"></span><div>
          <span class="why" style="color:${tcol}">${tone === "bear" ? "Drag" : tone === "bull" ? "Support" : "Neutral"} · ${sign(c)} pts</span>
          <h4>${esc(f.name)}</h4><p>${esc(f[tone])}</p></div></li>`;
      }).join("");

      const ai = vals.ai;
      const steps = ai <= -20
        ? ["Hyperscaler capex doubts", "Global AI-power names sell off", "India transformer basket de-rates", `${data.ticker} under pressure`]
        : ai >= 20
          ? ["Hyperscaler capex upgrades", "Global AI-power names re-rate", "India transformer basket bid", `${data.ticker} supported`]
          : ["AI trade range-bound", "Global read-through muted", "Domestic orders & earnings drive", `${data.ticker} trades on fundamentals`];
      const end = ai <= -20 ? "background:var(--neg);color:var(--paper)" : ai >= 20 ? "background:var(--pos);color:var(--paper)" : "background:var(--concrete)";
      host.querySelector("#transmission").innerHTML = steps.map((t, i) =>
        `<span class="n" style="${i === steps.length - 1 ? end : ""}">${esc(t)}</span>${i < steps.length - 1 ? '<span class="a" aria-hidden="true"></span>' : ""}`).join("");

      host.querySelectorAll(".preset").forEach((b) => b.classList.toggle("on", b.dataset.p === preset));
    }
    update();
  }

  // Linear zone meter with a pointer.
  function drawMeter(host, value) {
    const W = 360, H = 64, L = 6, R = 6, y = 22, h = 16;
    const X = (v) => L + (v / 100) * (W - L - R);
    let out = "", from = 0;
    ZONES.forEach((z) => {
      out += `<rect x="${X(from)}" y="${y}" width="${X(z.max) - X(from)}" height="${h}" style="fill:${z.color};stroke:var(--ink);stroke-width:1.2"/>`;
      from = z.max;
    });
    for (let t = 0; t <= 100; t += 10) out += `<line x1="${X(t)}" x2="${X(t)}" y1="${y + h}" y2="${y + h + (t % 50 ? 4 : 8)}" style="stroke:var(--ink)"/>`;
    [0, 50, 100].forEach((t) => (out += `<text x="${X(t)}" y="${H - 2}" text-anchor="${t === 0 ? "start" : t === 100 ? "end" : "middle"}">${t}</text>`));
    const px = X(value);
    out += `<path d="M${px - 8},4 L${px + 8},4 L${px},${y - 2} Z" style="fill:var(--ink)"/><line x1="${px}" x2="${px}" y1="${y}" y2="${y + h}" style="stroke:var(--ink);stroke-width:3"/>`;
    host.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sentiment score ${Math.round(value)} of 100">${out}</svg>`;
  }

  function drawIndex(host, model) {
    const s = model.series;
    const W = 680, H = 260, L = 40, R = 16, T = 16, B = 30;
    const iw = W - L - R, ih = H - T - B;
    const all = s.basket.concat(s.nifty);
    const lo = Math.floor(Math.min(...all) / 10) * 10, hi = Math.ceil(Math.max(...all) / 10) * 10;
    const X = (i) => L + (i / (s.months.length - 1)) * iw;
    const Y = (v) => T + ih - ((v - lo) / (hi - lo)) * ih;
    let out = "";
    for (let v = lo; v <= hi; v += 10) out += `<line class="grid" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`;
    out += `<line class="axis" x1="${L}" x2="${W - R}" y1="${T + ih}" y2="${T + ih}"/>`;
    s.months.forEach((m, i) => { if (i % 3 === 0) out += `<text x="${X(i)}" y="${H - 10}" text-anchor="middle">${m}</text>`; });
    const line = (arr) => arr.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    const li = s.basket.length - 1;
    out += `<polygon class="a-basket" points="${X(0)},${T + ih} ${line(s.basket)} ${X(li)},${T + ih}"/>
      <polyline class="l-nifty" points="${line(s.nifty)}"/>
      <polyline class="l-basket" points="${line(s.basket)}"/>
      <circle class="dot-end" cx="${X(li)}" cy="${Y(s.basket[li])}" r="4"/>`;
    model.events.forEach((ev, k) => {
      const i = s.months.indexOf(ev.month);
      if (i < 0) return;
      const cls = ev.type === "anti" ? "anti" : "macro";
      const by = T + (k % 2) * 20;
      out += `<line class="ev-${cls}" x1="${X(i)}" x2="${X(i)}" y1="${T}" y2="${T + ih}"/>
        <rect class="ev-box" x="${X(i) - 8}" y="${by}" width="16" height="16"/>
        <text class="${cls === "anti" ? "t-neg" : "t-warn"}" x="${X(i)}" y="${by + 12}" text-anchor="middle">${k + 1}</text>`;
    });
    host.innerHTML = `<svg class="chart" style="min-width:480px" viewBox="0 0 ${W} ${H}" role="img" aria-label="Transformer basket versus Nifty">${out}</svg>`;
  }

  // ---------- boot ----------
  buildNav();
  render();
})();
