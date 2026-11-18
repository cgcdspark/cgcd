# DESK: THE DATA CENTRE ECONOMY
THE BIG PICTURE — "The Hidden Winners of the AI Boom" | Research date: 2026-11-18 | Not investment advice.

Claim IDs [D##] match `desk_datacentres.csv`.

## Verification status (read first)
- **Every page fetch was blocked** by this session's network allowlist (investors.vertiv.com, cbre.com, sec.gov, nvidianews.nvidia.com and datacenterfrontier.com all refused). All figures come from **web-search index extracts**. Where those extracts pointed to primary-source URLs (company releases, SEC 8-Ks, CBRE/JLL pages), the claim is marked `verified=partial`. Single-source secondary claims are marked `no`. **No claim is `yes`.** Before lock, someone should open the primary URLs in the CSV and check them.
- **Major context change (not this desk's beat, but it affects attribution):** several outlets (SF Standard, The Next Web, Fox Business, 12 Nov 2026) report that **Jensen Huang resigned as Nvidia CEO on 11–12 Nov 2026**. CFO Colette Kress is interim CEO, and the resignation followed a board investigation. That makes him "then-CEO Jensen Huang" in narration. The fact itself is UNVERIFIED from a fetched page, so the main desk needs to confirm it.
- Types used: reported / guidance / industry_estimate / analyst_forecast.

---

## A. What an AI data centre costs (ACT2)
| Layer | Figure | Type | Ref |
|---|---|---|---|
| All-in 1 GW "AI factory" (land, power, shell, chips, network, cooling) | **~$50–60bn per GW** (= $50–60m per MW) | industry_estimate (Huang, then-CEO) | [D01] |
| Nvidia's own revenue opportunity per GW | ~$18bn Hopper → ~$25bn Grace Blackwell → **~$40bn Vera Rubin** | industry_estimate (company statement, Q2 FY27 call, 26 Aug 2026) | [D02] |
| Shell & core build cost (JLL) | **$11.3m/MW 2026F** (was $10.7m in 2025, $7.7m in 2020) | industry_estimate | [D03] |
| AI technical fit-out (tenant) | up to **$25m/MW** extra | industry_estimate | [D04] |
| Global DC capex need to 2030 (McKinsey) | **$6.7tn**, of which $5.2tn is AI (range $3.7–7.9tn) | analyst_forecast | [D05] |
| Split of AI capex (McKinsey) | **~60% chips/hardware ($3.1tn)**, ~25% power/cooling/electrical "energizers" ($1.3tn), ~15% land/shell builders ($0.8tn) | analyst_forecast | [D06] |

**Reconciliation for narration:** the JLL shell (~$11m/MW) is roughly a fifth of Huang's $50–60m/MW all-in figure. Most of the money goes into the chips, and Nvidia's ~$40bn/GW Rubin opportunity would be about two-thirds of a $60bn gigawatt. This is my own arithmetic, done only to frame the numbers, so say "roughly".
- Caveats: Huang's venue is UNVERIFIED. It is commonly placed at a Sep 2025 CNBC/Dreamforce interview and repeated at G20 and GTC events; some reports tie it to the Aug 2025 earnings call. One outlier report says "up to $100bn/GW", so don't use it. His claim that a GW "rents for ~$50bn/yr" is contested (it is utilisation-dependent), so leave it out.

## B. Power density (ACT2)
- **Nvidia GB200 NVL72: ~120 kW per rack** (Nvidia rating). Supermicro and HPE spec **130–132 kW**, HPE suggests provisioning toward a ~192 kW peak, and SemiAnalysis estimates 123.6 kW. Liquid cooling is mandatory. [D07]
- Nvidia says data centres "once operated at ~20 kW per rack", so NVL72 is **~6x** that. [D08] The common enterprise rule of thumb of 5–15 kW is UNVERIFIED, so use Nvidia's 20 kW framing.

## C. Power and cooling suppliers — "picks and shovels" (ACT4)
**Vertiv** (thermal, power, liquid cooling)
- FY2025 (year to 31 Dec 2025): net sales **~$10.23bn, +26% organic**. Year-end **backlog $15.0bn (+109%)**, Q4 book-to-bill ~2.9x, Q4 organic orders +252%. [D09]
- Q3 2026: net sales **$4.31bn, +61% (+55% organic)**, **organic orders more than doubled (>100%)**, Americas +75%, adj. operating margin 25.2%. [D10]
- FY2026 guidance raised to **$14.45–14.85bn** (organic +37–39%). The initial Feb 2026 guide was $13.25–13.75bn. [D11]
- **Vertiv no longer reports quarterly orders or backlog** (only annually in the 10-K). Any "Q3 2026 backlog" figure in circulation is unreliable. [D12]
- CEO Giordano Albertazzi, as quoted in secondary coverage: "We are in the middle of the largest infrastructure buildout, and it's accelerating." The wording is UNVERIFIED against the transcript.

**Schneider Electric**
- FY2025 revenue **€40.15bn, +8.9% organic**. Data centres & networks are **~30% of end-market exposure, on an orders basis**. This is NOT a revenue share. [D13]
- Q3 2026 revenue ~**€11.46bn, +16.9% organic**, with "triple-digit" data-centre demand growth. FY2026 organic guide raised to 12–14%. [D14]

**Eaton**
- Q3 2026: data-centre revenue **+~65% y/y**. Electrical-sector data-centre orders **more than doubled** on a rolling 12-month basis. Electrical Americas backlog +33% to ~$16bn, and rolling organic orders +39%. [D15]

**Liquid cooling adoption** — the numbers vary a lot by definition: ~19% of facilities (an Uptime survey via an aggregator) against 35% of *new* deployments (a vendor report). Use these only qualitatively. [D16]

## D. Networking and optics (ACT4)
- **Nvidia** Q3 FY2027 (to 25 Oct 2026, reported 17 Nov 2026): revenue **$115.8bn (+103%)**, data centre **$107.6bn (+110%)**, Q4 guide ~$130bn (a 14-week quarter). [D17]
- Nvidia networking: the last *confirmed* standalone figure is **$8.2bn, +162% y/y, Q3 FY2026**. [D18] Q2 FY27 networking was +18% q/q and Spectrum-X was 2.6x y/y. A Q3 FY27 networking figure of ">$21bn" appears in one summary but is **UNVERIFIED**, so don't use it.
- **Arista** Q3 2026 revenue **$3.66bn (+58.5%)**, with a Q4 guide of $3.9–4.0bn. [D19]
- **Broadcom** Q3 FY2026 (to 2 Aug 2026) AI semiconductor revenue **$16.7bn (+221%)**, with a Q4 AI guide of $21.7bn. [D20]
- **Corning** Optical Communications Q3 2026 **~$2.38bn (+44%)**, and the Enterprise (data-centre fibre) segment +84%. Total revenue is reported inconsistently across sources, so don't cite it. [D21]
- **Coherent** Q1 FY2027 revenue ~$2.37bn (+~50%), with data centre & comms +79% and 82% of revenue. This rests on a single source. [D22]

## E. Ownership and capital (ACT6)
**Hyperscalers**
- The big four guide to **~$720–740bn of combined 2026 capex** (as of late-Oct 2026 Q3 calls): Amazon ~$220bn, Alphabet $195–205bn, Microsoft ~$170bn (trimmed), Meta $135–145bn. Definitions differ. [D23]
- Their Q3 2026 capex was **~$201.9bn, +108% y/y**. [D24] Secondary sources say three of the four had negative free cash flow in the quarter (UNVERIFIED).

**Colocation**
- **Equinix** Q3 2026 revenue ~$2.57bn (+11%), with record annualised gross bookings of $533m and a FY26 guide of ~$10.33–10.37bn. [D29]
- **Digital Realty** Q3 2026 revenue ~$1.9bn (+21%). It has a **record $2.5bn signed-not-commenced backlog** (100% share; $1.8bn at DLR share) and record bookings of $855m in annualised rent. [D30]

**Neocloud: CoreWeave** (Q3 2026, reported 10 Nov 2026)
- Revenue **$3.66bn (+168%)** and a net loss of **$709m**. [D25]
- **Backlog ~$132.5bn**, up from ~$104bn three months earlier. [D26]
- **Debt ~$47bn**, Q3 net interest expense **$846m**, Q4 interest guide $1.05–1.15bn, 2026 capex guide $37–39bn. [D27]
- Active power >1.7 GW, contracted >4.6 GW. [D28]
- Framing: backlog is ~36x quarterly revenue, and quarterly interest is ~23% of quarterly revenue. This is my own arithmetic from [D25] and [D27].

**Megaprojects and circular money**
- **Stargate**: an *announced plan* of $500bn and 10 GW. ~7 GW was "planned" by Sep 2025. Epoch AI estimated Abilene at ~0.6 GW operating in Apr 2026. There is no official tally of dollars actually deployed. [D31]
- **Nvidia–OpenAI**: a letter of intent for *up to* $100bn tied to ≥10 GW. Mar 2026 reports suggest it was scaled back (UNVERIFIED). [D32] AMD–OpenAI warrants on ~10% of AMD and the ~$300bn Oracle–OpenAI contract (press-reported) are background only and are UNVERIFIED.
- **Off-balance-sheet debt**: Meta's Hyperion has ~$27bn of debt in a JV that is 80% owned by Blue Owl, backed by a Meta residual value guarantee. [D33]
- **Depreciation debate**: Michael Burry estimates ~$176bn of understated depreciation over 2026–28 (analyst_forecast, contested). The known facts are that Microsoft (2022) and Alphabet (2023) extended server lives from 4 to 6 years, Meta uses 5.5 years, and Amazon cut a subset of its servers from 6 to 5 years in 2025. [D34]

## F. Vacancy and demand (ACT6)
- **CBRE H1 2026, NA primary markets**: vacancy at a **record low 1.4%** (from 1.6%) [D35]. A **record 7,481 MW is under construction, 80.4% preleased**, against a primary inventory of 10,903 MW (+33.7%) [D36]. Northern Virginia vacancy is ~0.24% [D37]. Pricing for ≥10 MW deals is +9.7% in H1 (search extract, UNVERIFIED).
- **JLL Midyear 2026, all of North America**: vacancy **~1% for a third straight year**, a **record 25 GW of net absorption in H1**, and **~66 GW under construction, ~95% pre-committed**. Frontier markets hold 77% of the pipeline, and grid waits in primary markets exceed 4 years. [D38]
- **CONFLICT**: CBRE's 7.5 GW and JLL's 66 GW measure different scopes (primary markets vs all of NA, including frontier mega-campuses). Never present them side by side as one series.

## G. Water and local opposition (ACT6)
- LBNL: US data centres consumed ~**17.4bn gallons** of water directly in 2023, possibly rising to **38–73bn by 2028**. Indirect use via power generation was ~211bn gallons. [D39]
- Data Center Watch: **at least 75 projects worth ~$130bn were blocked or delayed** by local opposition in Q1 2026, and 45 projects worth ~$68bn in Q2. These are gross values of disruptions, not cancellations. [D40]

## H. Striking hooks (all verifiable once the primary pages are checked)
1. One AI rack now draws ~120 kW, about six times what data centres were built for. [D07][D08]
2. North America is building at a record pace, yet CBRE's primary-market vacancy is at a record low of 1.4%. 80% of what's under construction is already let. [D35][D36]
3. CoreWeave has $132.5bn of contracted backlog, ~$47bn of debt, and pays ~$846m of interest a quarter. [D26][D27]
4. Vertiv's orders more than doubled, and it has stopped publishing its quarterly backlog. [D10][D12]
5. In one quarter, local opposition blocked or delayed ~$130bn of US data centre projects. [D40]

## Best lines for narration
- "Build a one-gigawatt AI data centre and Nvidia's then-chief executive put the bill at fifty to sixty billion dollars. The concrete is the cheap part. JLL puts the shell at about eleven million dollars a megawatt, a fraction of the total." [D01][D03]
- "McKinsey reckons about sixty cents of every AI data-centre dollar goes to chips, and a quarter to the power and cooling that keeps them alive." [D06]
- "A single rack of Nvidia's GB200 draws about 120 kilowatts, around six times what a data centre rack used to handle. Air can't cool that. Water has to." [D07][D08]
- "Vertiv sells the plumbing of AI: cooling and power gear. In its latest quarter, sales rose 61 percent and orders more than doubled." [D10]
- "CoreWeave has a hundred and thirty-two billion dollars of contracts, almost forty-seven billion of debt, and an interest bill of around eight hundred and fifty million dollars a quarter." [D26][D27]
- "In America's main data-centre markets, just 1.4 percent of space is empty, a record low, even with 7.5 gigawatts under construction." [D35][D36]
- "In the first three months of 2026, local opposition blocked or delayed about a hundred and thirty billion dollars of US data-centre projects." [D40]

## Conflicts and cautions
- Huang's "$50–60bn/GW": the venue is unconfirmed, a $100bn outlier exists, and he is now *former* CEO (reported).
- Vertiv has no quarterly backlog after FY2025. Ignore circulating "$9.5bn backlog / 1.4x" figures, which appear to be 2025 data.
- Nvidia Q3 FY27 networking (">$21bn") is unverified.
- Schneider's "30%" is an orders/end-market share, not a revenue share.
- CBRE and JLL use different scopes: 1.4% vs ~1% vacancy, 7.5 GW vs 66 GW under construction.
- Corning's total Q3 revenue differs across sources ($4.86bn vs $5.08bn).
- Hyperscaler capex totals are aggregations of differing definitions. Say "roughly $700bn+".
- Stargate's $500bn is an announced plan, not spend.
