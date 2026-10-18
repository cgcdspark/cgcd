/* ==========================================================================
   Coverage universe data.
   Everything the interface renders comes from this file. To add a company:
     1. Set its `live: true` in SECTORS.
     2. Add an entry under COMPANIES keyed by the same id.
     3. Point `sentimentModel` at an existing model in SENTIMENT_MODELS or add one.
   All financials, prices and sentiment readings below are SAMPLE figures used
   to build the interface. Replace them with house-model numbers before use.
   ========================================================================== */

window.SECTORS = {
  capgoods: {
    id: "capgoods",
    name: "Capital Goods",
    short: "CAP GOODS",
    tagline: "Power T&D, electrification, EPC and industrial equipment",
    segments: [
      { id: "tnd", name: "Transformers & T&D Equipment", companies: [
        { id: "voltamp", name: "Voltamp Transformers", ticker: "VOLTAMP", live: true },
        { id: "taril", name: "Transformers & Rectifiers", ticker: "TARIL" },
        { id: "powerindia", name: "Hitachi Energy India", ticker: "POWERINDIA" },
        { id: "gvtd", name: "GE Vernova T&D India", ticker: "GVT&D" },
        { id: "enrin", name: "Siemens Energy India", ticker: "ENRIN" },
        { id: "shilchar", name: "Shilchar Technologies", ticker: "SHILCHAR" },
        { id: "indotech", name: "Indo Tech Transformers", ticker: "INDOTECH" }
      ]},
      { id: "heavy", name: "Heavy Electricals & Automation", companies: [
        { id: "siemens", name: "Siemens", ticker: "SIEMENS" },
        { id: "abb", name: "ABB India", ticker: "ABB" },
        { id: "cgpower", name: "CG Power", ticker: "CGPOWER" },
        { id: "bhel", name: "BHEL", ticker: "BHEL" }
      ]},
      { id: "cables", name: "Cables & Wires", companies: [
        { id: "kei", name: "KEI Industries", ticker: "KEI" },
        { id: "polycab", name: "Polycab India", ticker: "POLYCAB" }
      ]},
      { id: "epc", name: "EPC & Infrastructure", companies: [
        { id: "lt", name: "Larsen & Toubro", ticker: "LT" },
        { id: "kec", name: "KEC International", ticker: "KEC" },
        { id: "kpil", name: "Kalpataru Projects", ticker: "KPIL" }
      ]},
      { id: "process", name: "Energy & Process Equipment", companies: [
        { id: "thermax", name: "Thermax", ticker: "THERMAX" },
        { id: "triturbine", name: "Triveni Turbine", ticker: "TRITURBINE" },
        { id: "cummins", name: "Cummins India", ticker: "CUMMINSIND" }
      ]},
      { id: "defence", name: "Defence", companies: [
        { id: "bel", name: "Bharat Electronics", ticker: "BEL" },
        { id: "hal", name: "Hindustan Aeronautics", ticker: "HAL" }
      ]}
    ]
  },

  durables: {
    id: "durables",
    name: "Consumer Durables",
    short: "DURABLES",
    tagline: "Electricals, cooling, wires and kitchen appliances",
    segments: [
      { id: "fmeg", name: "Electricals & FMEG", companies: [
        { id: "havells", name: "Havells India", ticker: "HAVELLS" },
        { id: "crompton", name: "Crompton Greaves CE", ticker: "CROMPTON" },
        { id: "bajajelec", name: "Bajaj Electricals", ticker: "BAJAJELEC" },
        { id: "vguard", name: "V-Guard Industries", ticker: "VGUARD" },
        { id: "orientelec", name: "Orient Electric", ticker: "ORIENTELEC" }
      ]},
      { id: "cooling", name: "Cooling & HVAC", companies: [
        { id: "voltas", name: "Voltas", ticker: "VOLTAS" },
        { id: "bluestar", name: "Blue Star", ticker: "BLUESTARCO" },
        { id: "whirlpool", name: "Whirlpool of India", ticker: "WHIRLPOOL" },
        { id: "jchac", name: "Johnson Controls-Hitachi", ticker: "JCHAC" }
      ]},
      { id: "wires", name: "Wires & Cables (B2C)", companies: [
        { id: "rrkabel", name: "RR Kabel", ticker: "RRKABEL" },
        { id: "fincables", name: "Finolex Cables", ticker: "FINCABLES" }
      ]},
      { id: "kitchen", name: "Kitchen & Home", companies: [
        { id: "ttk", name: "TTK Prestige", ticker: "TTKPRESTIG" },
        { id: "hawkins", name: "Hawkins Cookers", ticker: "HAWKINCOOK" },
        { id: "stovekraft", name: "Stove Kraft", ticker: "STOVEKRAFT" }
      ]}
    ]
  },

  ems: {
    id: "ems",
    name: "EMS",
    short: "EMS",
    tagline: "Electronics manufacturing services, ODM and components",
    segments: [
      { id: "scale", name: "Scale EMS & ODM", companies: [
        { id: "dixon", name: "Dixon Technologies", ticker: "DIXON" },
        { id: "kaynes", name: "Kaynes Technology", ticker: "KAYNES" },
        { id: "syrma", name: "Syrma SGS", ticker: "SYRMA" },
        { id: "avalon", name: "Avalon Technologies", ticker: "AVALON" },
        { id: "cyientdlm", name: "Cyient DLM", ticker: "CYIENTDLM" }
      ]},
      { id: "durodm", name: "Durables ODM", companies: [
        { id: "amber", name: "Amber Enterprises", ticker: "AMBER" },
        { id: "pgel", name: "PG Electroplast", ticker: "PGEL" },
        { id: "epack", name: "EPACK Durable", ticker: "EPACK" }
      ]},
      { id: "hirel", name: "Defence & Hi-Rel Electronics", companies: [
        { id: "datapatterns", name: "Data Patterns", ticker: "DATAPATTNS" },
        { id: "centum", name: "Centum Electronics", ticker: "CENTUM" },
        { id: "apollo", name: "Apollo Micro Systems", ticker: "APOLLO" }
      ]}
    ]
  }
};

/* --------------------------------------------------------------------------
   Sentiment models. Each factor reading runs from -100 to +100, where +100 is
   the most supportive reading for the stock and -100 the most damaging.
   Composite score (0-100) = 50 + 0.5 * weighted average of readings.
   `bear` / `bull` / `neutral` texts become the "why" behind the score.
   -------------------------------------------------------------------------- */
window.SENTIMENT_MODELS = {
  transformers: {
    name: "India Transformer Basket",
    basket: ["VOLTAMP", "TARIL", "POWERINDIA", "GVT&D", "ENRIN", "SHILCHAR", "INDOTECH"],
    factors: [
      {
        id: "ai", name: "AI-capex trade regime", weight: 0.25,
        left: "Anti-AI trade hot", right: "AI trade hot",
        bear: "The anti-AI trade is hot. Doubts over hyperscaler capex returns are hitting the global 'AI power' complex (GE Vernova, Siemens Energy, Hitachi, Vertiv). Indian transformer stocks are held as a read-through on data-centre power demand, so they sell off with that complex even when domestic order books are unchanged.",
        bull: "The AI trade is hot. Hyperscaler capex upgrades are lifting global power-equipment names, and Indian transformer stocks re-rate on data-centre and grid-tightness narratives. Watch for valuations running ahead of order inflow.",
        neutral: "The AI-capex trade is range-bound, so stock moves are being driven by domestic order flow and earnings rather than global AI positioning."
      },
      {
        id: "momentum", name: "Basket vs Nifty (3M relative)", weight: 0.20,
        left: "Lagging Nifty", right: "Leading Nifty",
        bear: "The transformer basket is lagging the Nifty over three months. Weak relative strength tends to keep momentum funds and fast money away from the group.",
        bull: "The transformer basket is outperforming the Nifty over three months. Relative strength is attracting momentum and thematic flows.",
        neutral: "The transformer basket is moving broadly in line with the Nifty."
      },
      {
        id: "orders", name: "Domestic T&D & industrial order inflow", weight: 0.20,
        left: "Inflow slowing", right: "Inflow accelerating",
        bear: "Order inflow is slowing. Tender deferrals or a pause in private capex would weaken the visibility that supports current multiples.",
        bull: "Order inflow is strong. Transmission tenders, renewable pooling substations and private industrial capex keep books full and power-transformer lead times stretched.",
        neutral: "Order inflow is steady. Book-to-bill is holding but not accelerating."
      },
      {
        id: "inputs", name: "Input costs (CRGO steel, copper)", weight: 0.10,
        left: "Costs rising", right: "Costs easing",
        bear: "CRGO and copper prices are rising. Fixed-price orders booked earlier face margin pressure until pricing resets.",
        bull: "CRGO and copper prices are easing, which supports gross margins on the existing order book.",
        neutral: "Input costs are stable and margins track pricing on new orders."
      },
      {
        id: "valuation", name: "Valuation vs 5-yr band", weight: 0.15,
        left: "Rich (top of band)", right: "Cheap (bottom of band)",
        bear: "Valuations sit near the top of the 5-year band. Little room for disappointment; any earnings miss or order slowdown gets punished.",
        bull: "Valuations sit near the bottom of the 5-year band, which offers a margin of safety and room to re-rate.",
        neutral: "Valuations sit mid-band, so earnings delivery drives the stock."
      },
      {
        id: "flows", name: "Institutional flows & positioning", weight: 0.10,
        left: "Crowded / selling", right: "Under-owned / buying",
        bear: "Positioning is crowded and institutions are trimming. Crowded longs unwind fast when the theme turns.",
        bull: "The group is under-owned and institutions are adding, which leaves room for incremental buying.",
        neutral: "Institutional positioning is neutral."
      }
    ],
    presets: {
      base: { label: "Sample base case", values: { ai: -35, momentum: -20, orders: 60, inputs: -10, valuation: -30, flows: 5 } },
      antiAI: { label: "Anti-AI trade hot", values: { ai: -90, momentum: -70, orders: 55, inputs: -10, valuation: -20, flows: -60 } },
      aiBoom: { label: "AI capex boom", values: { ai: 90, momentum: 75, orders: 70, inputs: 0, valuation: -70, flows: 40 } }
    },
    // Illustrative monthly series (rebased to 100). Replace with a price feed.
    series: {
      months: ["Oct-24","Nov-24","Dec-24","Jan-25","Feb-25","Mar-25","Apr-25","May-25","Jun-25","Jul-25","Aug-25","Sep-25","Oct-25","Nov-25","Dec-25","Jan-26","Feb-26","Mar-26","Apr-26","May-26","Jun-26","Jul-26","Aug-26","Sep-26","Oct-26"],
      basket: [100, 97, 99, 82, 70, 66, 72, 84, 90, 94, 89, 92, 96, 101, 98, 93, 88, 91, 97, 104, 108, 103, 97, 95, 99],
      nifty:  [100, 98, 97, 95, 92, 93, 96, 100, 102, 101, 99, 101, 103, 104, 105, 104, 102, 103, 105, 107, 108, 107, 106, 107, 108]
    },
    events: [
      { month: "Jan-25", type: "anti", label: "DeepSeek shock: global AI-power selloff" },
      { month: "Mar-25", type: "macro", label: "FII-led market correction bottoms" },
      { month: "Apr-25", type: "macro", label: "US tariff shock" }
    ]
  }
};

/* --------------------------------------------------------------------------
   Company deep dives. Amounts in INR crore unless stated.
   -------------------------------------------------------------------------- */
window.COMPANIES = {
  voltamp: {
    name: "Voltamp Transformers Ltd",
    ticker: "VOLTAMP",
    exchange: "NSE",
    sector: "capgoods",
    segment: "tnd",
    sentimentModel: "transformers",
    hq: "Vadodara, Gujarat",
    founded: 1967,
    sharesCr: 1.012,           // shares outstanding, crore
    cmp: 8500,                 // sample price, editable in the UI
    asOf: "Sample",
    rating: "—",
    targetPrice: null,
    about: [
      "Voltamp is one of India's larger independent transformer makers, with manufacturing at Makarpura and Simli near Vadodara. It builds oil-filled power and distribution transformers and dry-type (cast resin and VPI) units, plus unitised substations.",
      "The business leans towards private industrial, EPC and renewable customers rather than state utilities, which keeps receivables tight. The balance sheet is debt-free with a large treasury book, so other income is a meaningful part of PAT."
    ],
    facts: [
      { k: "Plants", v: "Makarpura & Simli, Vadodara" },
      { k: "Top rating", v: "160 MVA / 220 kV" },
      { k: "Balance sheet", v: "Net cash" },
      { k: "Customer tilt", v: "Private industrial & EPC" }
    ],
    // MVA ranges are indicative: verify against the latest annual report.
    products: [
      { name: "Oil-filled power transformers", kv: "up to 220 kV", mvaMin: 10, mvaMax: 160, share: 45, note: "Substations, RE pooling, heavy industry" },
      { name: "Oil-filled distribution transformers", kv: "up to 33 kV", mvaMin: 0.1, mvaMax: 10, share: 25, note: "Industrial plants, commercial, infra" },
      { name: "Dry-type cast resin transformers", kv: "up to 33 kV", mvaMin: 0.1, mvaMax: 12.5, share: 18, note: "Data centres, metros, hospitals, buildings" },
      { name: "Dry-type VPI transformers", kv: "up to 11 kV", mvaMin: 0.1, mvaMax: 5, share: 5, note: "Indoor and fire-sensitive installs" },
      { name: "Unitised / compact substations", kv: "up to 33 kV", mvaMin: 0.1, mvaMax: 2.5, share: 7, note: "Solar parks, campuses, townships" }
    ],
    endMarkets: [
      { name: "Industrial & private capex", share: 40 },
      { name: "Renewables (solar / wind)", share: 22 },
      { name: "Data centres & commercial", share: 15 },
      { name: "Infra, metro & railways", share: 13 },
      { name: "Utilities & others", share: 10 }
    ],
    // FY ending March. `e: true` marks forward estimates.
    financials: [
      { fy: "FY23", e: false, revenue: 1386, ebitda: 213, pat: 206, networth: 1250 },
      { fy: "FY24", e: false, revenue: 1616, ebitda: 318, pat: 275, networth: 1500 },
      { fy: "FY25", e: false, revenue: 1934, ebitda: 372, pat: 330, networth: 1800 },
      { fy: "FY26E", e: true, revenue: 2230, ebitda: 420, pat: 365, networth: 2100 },
      { fy: "FY27E", e: true, revenue: 2600, ebitda: 495, pat: 425, networth: 2450 },
      { fy: "FY28E", e: true, revenue: 2990, ebitda: 570, pat: 490, networth: 2850 }
    ],
    netCash: 800,
    watch: [
      "Quarterly order inflow and book-to-bill",
      "Power transformer pricing and lead times",
      "CRGO availability and import duties",
      "Capacity additions and commissioning timelines",
      "Treasury income share of PAT"
    ]
  }
};
