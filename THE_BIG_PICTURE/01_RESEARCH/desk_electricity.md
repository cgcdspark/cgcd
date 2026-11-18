# DESK: THE ELECTRICITY BOTTLENECK
THE BIG PICTURE — "The Hidden Winners of the AI Boom" | Research as of 2026-11-18 | Not investment advice

## Verification status (read first)
- WebFetch could not reach source pages in this session (iea.org and lbl.gov failed DNS under the session's network allowlist). Every figure below was checked through web-search snippets that quote the primary source, and cross-checked across two or more results where possible. Nothing was read in full from a fetched page.
- So no claim is marked `verified=yes`. `partial` means a primary-source snippet matches and is corroborated. `no` means secondary or single-source. Anything marked **UNVERIFIED** should not be narrated as fact.
- Before lock, fetch these primary PDFs and confirm the numbers: the IEA executive summaries, LBNL Queued Up 2026, the PJM BRA releases, the GE Vernova Q3 2026 8-K, the Siemens Energy Q4 FY26 release, the Quanta Q3 2026 8-K and Prysmian Q3 2026.
- Types: reported = company or official actuals. guidance = company outlook. industry_estimate = IEA, LBNL, WoodMac or IMM estimates of current or past values. analyst_forecast = projections.

---

## A. Demand: how much power AI needs
- **Global 2024:** about **415 TWh**, roughly **1.5%** of world electricity. The US was **45%** of the global total. *(industry_estimate)* [E01][E03]
- **IEA 2030 Base Case, 2025 edition:** about **945 TWh**, just under 3% of global electricity. Data centres account for **nearly half of US electricity demand growth** to 2030. *(analyst_forecast)* [E02][E03]
- **IEA update of April 2026, "Key Questions on Energy and AI":** **485 TWh in 2025** (up **17%**), heading to **950 TWh in 2030** (~3% of global demand). Consumption by AI-focused data centres grew about 50% in 2025 and is expected to triple by 2030. *(industry_estimate / analyst_forecast)* [E04]
  - Conflict: one IEA-hosted slide deck says growth was "almost 20%". Use the 17% figure from the executive summary.
- **IEA on the risk:** grid constraints could delay **~20% of planned data centre capacity** by 2030. *(analyst_forecast)* [E05]
- **US figures from LBNL (Dec 2024, DOE-commissioned):** **176 TWh = 4.4%** of US electricity in 2023, up from 58 TWh in 2014. The 2028 projection is **325–580 TWh = 6.7–12%**. *(industry_estimate / analyst_forecast)* [E06][E07]
  - A secondary source cites a 2025 LBNL update with a 649 TWh US reference case for 2030. That is UNVERIFIED, so don't use it.

## B. The grid queue
- **LBNL Queued Up 2026 (data to end-2025):** **~2,061 GW** of generation and storage in active queues (1,312 GW generation, ~749 GW storage). That is down ~10% from ~2,300 GW at end-2024, and the peak was ~2,600 GW at end-2023. *(reported)* [E08]
  - For scale: total installed US generating capacity is roughly 1,300 GW. This figure is UNVERIFIED in this desk and needs an EIA check before narration.
- The **median project built in 2025 took 61 months** from interconnection request to commercial operation. Comparable figures are 36 months in 2015 and 22 months in 2008. *(reported)* [E09]
- Only **13%** of capacity requested in 2000–2020 had been built by end-2025; 75% was withdrawn. *(reported)* [E10]
- **PJM capacity prices** (Base Residual Auction, RTO-wide, $/MW-day UCAP). All are *reported* figures [E11–E14]:

  | Delivery year | Price | Note |
  |---|---|---|
  | 2025/26 | **$269.92** | Zonal: BGE $466.35, Dominion $444.26 |
  | 2026/27 | **$329.17** | At the FERC-approved cap |
  | 2027/28 | **$333.44** | Record. Would have been $529.80 without the cap. 6,623 MW short of the reliability requirement. 5,100 of the 5,250 MW load-forecast increase is attributed to data centres. Total cost $16.4bn |
  | 2028/29 | **$325** | At the ceiling. Short of the reliability standard again |

  - The 2024/25 price (~$28.92) is UNVERIFIED here, but it is widely cited. It makes roughly a 9x jump to 2025/26, so verify it before use.
  - PJM quote: Stu Bresler said *"This auction leaves no doubt that data centers' demand for electricity continues to far outstrip new supply."* This comes from a search snippet of the Dec 2025 release and is partial.
- **ERCOT (Texas):** about **474 GW** of large-load requests as of July 2026, ~90% of them data centres. That is up from ~410 GW in March 2026. Large load actually energized in 2026 is only about **5.9 GW**. ERCOT says requests are not a forecast. *(reported)* [E15]

## C. Transformers: the long-lead item
- **Lead times (Wood Mackenzie, Q2 2025 survey):** power transformers average **128 weeks** and generator step-up units **144 weeks**. Large units range from 80 to 210 weeks. The Hitachi Energy CEO told S&P Global in Jan 2026 that waits run up to **40 months**. *(industry_estimate)* [E16]
- **Prices:** up **77% since 2019** for power transformers and 45% for GSUs. Another WoodMac framing gives **60–80% since Jan 2020**. Pick one and state its base year. *(industry_estimate)* [E17]
- **Imports:** about **80% of US power-transformer supply** in 2025 and ~50% of distribution transformers. WoodMac estimates a **30% supply deficit** for power transformers in 2025. *(industry_estimate)* [E18]
  - A DOE-cited alternative says US makers supply less than 20% of demand. That measures something slightly different, but the two are consistent.
- **Weight:** the largest units weigh **~400 short tons**. DOE-linked sources give 150–400 tons for units of 100 MVA or more. *(industry_estimate)* [E19]
- **NREL (2024):** distribution-transformer lead times are **up to 2 years, 4x the pre-2022 level**. *(industry_estimate)* [E20]

## D. Equipment makers: who is getting paid
**GE Vernova** [E21–E25]
- **FY2025 (reported):** revenue **$38.1bn** (+9%), orders **$59.3bn** (+34% organic), backlog **~$150bn**, free cash flow $3.7bn.
  - Conflict: a Reuters brief gives revenue of $37.8bn. Use the company figure.
- **Q3 2026 (reported, 8-K, 28 Oct 2026):** orders **$29.3bn** (+96% organic), revenue **$12.64bn** (+27% reported, +18% organic), total backlog **$197bn**. The company guides to more than $200bn in Q4.
- **Gas:** backlog plus slot reservations reached **122 GW**, made up of **64 GW** firm equipment backlog and **58 GW** slot reservations. The company guides to at least 130 GW by end-2026.
  - Caveat for narration: slot reservations are paid options, not firm orders.
- **Electrification Q3 2026 (10-Q):** revenue **$3.86bn** (vs $2.57bn), segment EBITDA margin **19.1%** (vs 15.1%). Prolec GE is now consolidated, so organic revenue growth was +16%. Electrification equipment backlog is $42.2bn.
  - "Data-centre orders over $6bn year to date" comes from a call summary and is UNVERIFIED.

**Siemens Energy** (fiscal year ends 30 Sept) [E26–E28]
- **FY2025 (reported):** backlog **€138bn**, orders €58.9bn, revenue €39.1bn, profit before special items €2.36bn. Grid Technologies Q4 FY25 margin was 14.6% and its backlog €42bn.
- **FY2026 (reported 11 Nov 2026):** record backlog **€164bn**.
  - From secondary coverage: revenue ~€44.2bn, orders ~€68.1bn, profit before special items ~€5.5bn (12.4% margin), dividend proposed at €2.30.
  - **Grid Technologies:** backlog **€52bn**, comparable revenue growth **+26.2%**.
  - The **FY26 Grid Technologies margin is UNVERIFIED**. Guidance was 18–20%. One outlet's figures (€2.66bn profit on €14.1bn revenue) imply ~19%, but another snippet is contradictory.
  - FY27 outlook *(guidance)*: comparable revenue growth 14–16%, margin 14–16%.

**Hitachi Energy** [E29–E30]
- Backlog is **above $50bn** per the CEO (Toyo Keizai). The Q1 FY2025 figure was $47.6bn after Hitachi corrected a typo that showed $4.76bn. This is secondary sourcing, verified = no.
- **$528m Mississippi transformer plant** announced Sept 2026, with production from 2029. Also a **$457m** expansion of the South Boston, VA large power transformer plant, and $1.5bn of its global investment programme earmarked for transformers. *(reported)*

**Cables**
- **Prysmian** [E31–E32]: FY2025 adjusted EBITDA **€2,398m** (a record), net income €1,270m, transmission backlog **over €17bn** including EGL4.
  - Q3 2026: Transmission adjusted EBITDA **€213m at a 20.0% margin**.
  - 2026 guidance raised to **€3,075–3,125m** adjusted EBITDA *(guidance)*. The company says it will beat its 2028 targets two years early.
- **Nexans** [E33]: FY2025 standard sales €6.1bn, adjusted EBITDA €728m (11.9%). PWR-Transmission made €203m (12.3%) and has an adjusted backlog of **~€7.7bn**.
  - Conflict: the backlog was €7.9bn at 30 Sep 2025, and the reason for the drop is unexplained.

**Quanta Services** [E34]
- Record backlog of **$63.7bn** at 30 Sep 2026, of which **$51.9bn** is in the Electric segment. Q3 revenue was $12.01bn vs $7.63bn. *(reported)*
- 2026 revenue guidance is $41.3–41.6bn *(guidance)*.

**Schneider / Eaton:** deliberately left out to avoid overlapping with the data-centre desk.

## E. Generation deals for AI
- **Microsoft–Constellation, Crane (formerly Three Mile Island Unit 1):** a **20-year PPA** announced 20 Sep 2024 for **~835 MW**. The restart target moved from 2028 to 2027 (June 2025). Restart capex is about $1.6bn and the price was not disclosed. The current restart date is unconfirmed: a Nov 2026 secondary source suggests NRC approvals around May 2027. [E35]
- **Amazon–Talen, Susquehanna:** **1,920 MW through 2042**, announced June 2025. It is front-of-meter, restructured after the colocation pushback. The often-cited "$18bn" value was **not found**: UNVERIFIED, do not use. [E36]
- **Meta–Constellation, Clinton:** a **20-year virtual PPA** for ~1,121 MW, starting June 2027 and announced 3 June 2025. Some sources give 1,092 MW. The price was not disclosed; Jefferies estimates ~$70/MWh *(analyst_forecast)*. [E37]
- **Google–Kairos:** Oct 2024, the **first corporate SMR deal**, for **500 MW by 2035**. A 50 MW Hermes 2 PPA through TVA followed in Aug 2025, targeting 2030. [E38]
- **Gas turbines:**
  - GE Vernova: 122 GW of backlog plus slots [E24].
  - Mitsubishi Power says new large-frame orders deliver **around 2031** and that 2028–29 slots are "almost full" (Oct 2026). [E39]
  - "Siemens Energy: more than 60% of US gas turbine orders linked to AI data centres" is UNVERIFIED (secondary).

## F. Copper
Estimates spread widely, so always label them as *analyst_forecast* [E40]:
- **Macquarie:** 330–420 kt of added demand from data centres in 2030.
- **Wood Mackenzie:** ~700 kt cumulative into data centres to 2030.
- **Trafigura:** AI could add ~1 Mt/yr by 2030.
- **Sprott:** ~1.1 Mt/yr (~3% of global demand).

Grid and transmission copper is a far larger pool than copper inside the building. Raw-material context from WoodMac: GOES steel prices roughly doubled and copper rose ~50% since Jan 2020 (partial).

## G. Who loses
- **Ratepayers in PJM:** the Independent Market Monitor attributes **$23.1bn** of capacity-market revenue increases across the 2025/26 to 2027/28 auctions to data-centre load. The 2026/27 auction alone accounts for $7.27bn, an 82.1% increase.
  - A later IMM figure is **$29.4bn over four auctions = 46.2%** of capacity charges (secondary). *(industry_estimate)* [E41]
  - Capacity is only one line on a bill. No verified residential bill-percentage figure was found.
- **Stranded-asset risk:** Grid Strategies (via RMI) estimates utility forecasts may overstate data-centre load by **25 GW by 2030**. Maryland's Office of People's Counsel warned PJM of "huge amounts of stranded costs".
  - In response, utilities are writing large-load tariffs. Dominion reportedly uses 14-year contracts, an 85% minimum-demand charge for wires and $1.5m/MW collateral (secondary, unverified). [E43][E44]
- **Speculative queues:** ERCOT has 474 GW requested against ~5.9 GW energized [E15]. Texas regulators require $50k/MW of security before a load enters study (secondary).
- **Local opposition:** Data Center Watch tracked ~$130bn of projects blocked or delayed in Q1 2026 and ~$68bn in Q2 2026. Its May 2025 report counted $64bn over two years. These are *industry_estimate*: a private tracker that mixes "blocked" with "delayed". [E42]
- **Delays and reliability:** PJM fell short of its reliability requirement in both the 2027/28 and 2028/29 auctions [E13][E14]. IEA: ~20% of planned data-centre capacity is at risk of delay [E05].

## H. Hooks (verifiable)
1. A large power transformer can weigh **about 400 tons**, and the wait for one is **over two years** (128 weeks on average; up to 40 months per Hitachi Energy's CEO). [E16][E19]
2. The median US power project built in 2025 spent **five years (61 months)** in the grid queue. It was 22 months in 2008. [E09]
3. Texas has **~474 GW** of large-load requests on file, but only ~5.9 GW of large load was actually energized in 2026. [E15]
4. PJM's capacity price went from **$269.92 to a record $333.44/MW-day**. Without a negotiated cap it would have been **$529.80**. [E11][E13]
5. GE Vernova's backlog is **$197bn**, more than five years of its 2025 revenue ($38.1bn). [E21][E23]
   - The ratio is our arithmetic: 197 / 38.1 = 5.2.

---

## Best lines for narration
- "In 2024, data centres used about 415 terawatt-hours, around one and a half percent of the world's electricity. The IEA expects that to roughly double by 2030." [E01][E04]
- "In the United States, the IEA says data centres account for nearly half of all electricity demand growth to the end of the decade." [E03]
- "The chips arrive in months. The grid connection takes years. The median American power project built in 2025 waited 61 months for its connection." [E09]
- "A large power transformer can weigh around 400 tons, and the average wait for one is more than two years. Roughly four in five are imported." [E16][E18][E19]
- "On America's largest grid, the price of guaranteed capacity hit a record $333 a megawatt-day. That was the cap. The market price would have been $530." [E13]
- "GE Vernova's order book now stands at $197 billion. Siemens Energy's is €164 billion. They are not selling chips. They are selling the hardware chips depend on." [E23][E27]
- "Big Tech isn't only buying electricity. It's reviving reactors: Microsoft signed a 20-year deal to bring Three Mile Island's Unit 1 back online." [E35]
- "Someone pays. PJM's own market monitor attributes more than $23 billion in added capacity costs over three auctions to data centre demand." [E41]

## Conflicts / do-not-use list
- IEA 2025 growth: 17% (executive summary) vs "almost 20%" (slide deck). Use 17%.
- IEA 2030: 945 TWh (2025 edition) vs 950 TWh (2026 edition). Use 950 TWh and cite the 2026 update.
- Transformer prices: +77% since 2019 vs 60–80% since 2020. Use one and state its base year.
- Imports at ~80% (WoodMac, power transformers) vs "US makers supply <20%" (DOE-cited). These are consistent but measure slightly different things.
- GE Vernova FY25 revenue: $38.1bn (company) vs $37.8bn (Reuters brief).
- Siemens Energy Grid Technologies FY26 margin: unconfirmed.
- Nexans transmission backlog: €7.7bn (YE25) vs €7.9bn (Sep 25).
- Do not use: "$18bn Amazon–Talen deal value"; "ERCOT 427 GW = 39% of US queue" (a correction was issued); "Siemens Energy 60% of US gas turbine orders AI-linked".
