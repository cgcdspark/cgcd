/* ==========================================================================
   Coverage universe data.
   Everything the interface renders comes from this file.
   - SECTORS[x].coverage: the companies in coverage (order = dropdown order).
   - SECTORS[x].chains: value chains drawn on the sector page. Each product node
     lists the covered companies that make it, with a one-line note.
   To switch on a company deep dive: set `live: true` in coverage and add an
   entry under COMPANIES keyed by the same id.
   All financials, prices and sentiment readings are SAMPLE figures used to
   build the interface. Product notes should be checked against filings.
   ========================================================================== */

window.SECTORS = {
  capgoods: {
    id: "capgoods",
    name: "Capital Goods",
    tagline: "Electrification, power equipment, industrial consumables and EPC",
    coverage: [
      { id: "abb", name: "ABB India", ticker: "ABB" },
      { id: "siemens", name: "Siemens", ticker: "SIEMENS" },
      { id: "cgpower", name: "CG Power & Industrial Solutions", ticker: "CGPOWER" },
      { id: "cummins", name: "Cummins India", ticker: "CUMMINSIND" },
      { id: "aia", name: "AIA Engineering", ticker: "AIAENG" },
      { id: "grindwell", name: "Grindwell Norton", ticker: "GRINDWELL" },
      { id: "triveni", name: "Triveni Turbine", ticker: "TRITURBINE" },
      { id: "cumi", name: "Carborundum Universal", ticker: "CARBORUNIV" },
      { id: "elgi", name: "Elgi Equipments", ticker: "ELGIEQUIP" },
      { id: "kec", name: "KEC International", ticker: "KEC" },
      { id: "kpil", name: "Kalpataru Projects International", ticker: "KPIL" },
      { id: "voltamp", name: "Voltamp Transformers", ticker: "VOLTAMP", live: true },
      { id: "thermax", name: "Thermax", ticker: "THERMAX" }
    ],
    chains: [
      {
        id: "power", name: "Power T&D", title: "Power: from generation to the plug",
        sequence: true,
        stages: [
          { name: "Generate", nodes: [
            { id: "steam-turbines", name: "Industrial steam turbines", icon: "turbine",
              desc: "Captive and renewable power for sugar, process industries, waste-heat and biomass plants.",
              cos: [{ id: "triveni", note: "Steam turbines up to ~100 MW; domestic, exports and aftermarket" }] },
            { id: "boilers", name: "Boilers & captive power", icon: "boiler",
              desc: "Utility and industrial boilers, captive power EPC and bioenergy plants.",
              cos: [{ id: "thermax", note: "Industrial and utility boilers, captive power and bio-CNG EPC" }] },
            { id: "gensets", name: "Gensets & engines", icon: "genset",
              desc: "Backup and prime power for commercial, industrial and data-centre sites.",
              cos: [{ id: "cummins", note: "Diesel and gas gensets, high-horsepower engines, data-centre backup" }] }
          ]},
          { name: "Transmit", nodes: [
            { id: "lines", name: "Transmission lines & towers", icon: "tower",
              desc: "EHV lines, tower manufacturing and erection for inter-state and green-energy corridors.",
              cos: [{ id: "kec", note: "Global T&D EPC with in-house tower manufacturing" },
                    { id: "kpil", note: "T&D EPC in India and overseas, incl. Linjemontage (Sweden)" }] },
            { id: "substations", name: "EHV substations", icon: "substation",
              desc: "Air- and gas-insulated substations, including RE pooling stations.",
              cos: [{ id: "kec", note: "Substation EPC in India and the Middle East" },
                    { id: "kpil", note: "Substation EPC" }] },
            { id: "power-tx", name: "Power transformers", icon: "transformer",
              desc: "Step-up and step-down transformers for grids, RE parks and heavy industry.",
              cos: [{ id: "voltamp", note: "Up to 160 MVA / 220 kV; industrial and RE customer tilt" },
                    { id: "cgpower", note: "Power transformers and reactors for utilities and industry" }] }
          ]},
          { name: "Distribute", nodes: [
            { id: "dist-tx", name: "Distribution & dry-type transformers", icon: "transformer",
              desc: "Oil-filled and cast-resin units for plants, buildings, metros and data centres.",
              cos: [{ id: "voltamp", note: "Oil-filled and cast-resin dry types up to 33 kV" },
                    { id: "cgpower", note: "Distribution transformers" }] },
            { id: "switchgear", name: "MV / LV switchgear", icon: "switchgear",
              desc: "Breakers, panels and protection that route and protect power downstream.",
              cos: [{ id: "abb", note: "Electrification: MV/LV switchgear, breakers, smart power" },
                    { id: "siemens", note: "Smart Infrastructure: MV/LV switchgear and LV products" },
                    { id: "cgpower", note: "Switchgear and vacuum interrupters" }] },
            { id: "cables", name: "Power cables", icon: "cable",
              desc: "HT and LT cables connecting substations, plants and buildings.",
              cos: [{ id: "kec", note: "Power and telecom cables (KEC Cables)" }] }
          ]},
          { name: "End use", nodes: [
            { id: "motors", name: "Motors & drives", icon: "motor",
              desc: "The largest consumer of industrial power; efficiency upgrades drive replacement demand.",
              cos: [{ id: "abb", note: "Motion: LV/HV motors and drives" },
                    { id: "siemens", note: "Digital Industries: motors and drives" },
                    { id: "cgpower", note: "LT/HT industrial motors" }] },
            { id: "automation", name: "Process & factory automation", icon: "robot",
              desc: "Control systems, PLCs, robotics and plant software.",
              cos: [{ id: "abb", note: "Process automation and robotics" },
                    { id: "siemens", note: "PLCs, factory automation and industrial software" }] },
            { id: "datacentre", name: "Data-centre power", icon: "server",
              desc: "The AI-capex link: transformers, switchgear and backup power inside data centres.",
              cos: [{ id: "voltamp", note: "Cast-resin dry-type transformers" },
                    { id: "abb", note: "LV/MV distribution for data halls" },
                    { id: "siemens", note: "Power distribution and building technologies" },
                    { id: "cummins", note: "Backup gensets" }] },
            { id: "rail", name: "Rail traction & signalling", icon: "train",
              desc: "Locomotives, traction electricals and signalling for Indian Railways and metros.",
              cos: [{ id: "siemens", note: "Mobility: locomotives, signalling, metro systems" },
                    { id: "cgpower", note: "Railway traction electricals and signalling" }] }
          ]}
        ]
      },
      {
        id: "industrial", name: "Industrial plant", title: "Industrial plant: from the mine to the factory floor",
        sequence: true,
        stages: [
          { name: "Mine & grind", nodes: [
            { id: "mill", name: "Mill liners & grinding media", icon: "mill",
              desc: "Wear parts that crush and grind ore, clinker and coal.",
              cos: [{ id: "aia", note: "High-chrome castings for cement, mining and thermal power; mining is the growth leg" }] },
            { id: "minerals", name: "Electrominerals", icon: "crystal",
              desc: "Silicon carbide, fused alumina and zirconia grains that feed abrasives and ceramics.",
              cos: [{ id: "cumi", note: "SiC, alumina and zirconia, incl. VAW (Russia)" },
                    { id: "grindwell", note: "Silicon carbide grains" }] }
          ]},
          { name: "Make", nodes: [
            { id: "abrasives", name: "Bonded & coated abrasives", icon: "wheel",
              desc: "Grinding wheels, belts and discs used in metalworking and fabrication.",
              cos: [{ id: "grindwell", note: "Saint-Gobain's India abrasives arm" },
                    { id: "cumi", note: "Murugappa group; India and overseas abrasives" }] },
            { id: "ceramics", name: "Industrial & technical ceramics", icon: "ceramic",
              desc: "Wear-resistant, refractory and engineered ceramics.",
              cos: [{ id: "cumi", note: "Engineered and wear ceramics, refractories" },
                    { id: "grindwell", note: "Silicon carbide and technical ceramics" }] },
            { id: "plastics", name: "Performance plastics", icon: "polymer",
              desc: "Engineered polymer components for industrial, auto and electronics customers.",
              cos: [{ id: "grindwell", note: "Engineered polymer products" }] }
          ]},
          { name: "Run the plant", nodes: [
            { id: "compressors", name: "Air compressors", icon: "compressor",
              desc: "Compressed air is the fourth utility in most factories.",
              cos: [{ id: "elgi", note: "Screw and oil-free compressors; large US and Europe business" }] },
            { id: "heating", name: "Heating, cooling & boilers", icon: "flame",
              desc: "Process heat, steam and absorption chilling.",
              cos: [{ id: "thermax", note: "Industrial boilers, heaters and absorption chillers" }] },
            { id: "whr", name: "Waste-heat & process power", icon: "turbine",
              desc: "Turning process heat into captive power in steel, cement and sugar.",
              cos: [{ id: "triveni", note: "Turbines for waste-heat, sugar, steel and cement" },
                    { id: "thermax", note: "Waste-heat recovery boilers" }] },
            { id: "water", name: "Water, waste & chemicals", icon: "drop",
              desc: "Water and effluent treatment, resins and specialty chemicals.",
              cos: [{ id: "thermax", note: "Water treatment, ion-exchange resins, chemicals" }] },
            { id: "engines", name: "Industrial engines", icon: "engine",
              desc: "Engines for construction, mining, compressors and rail.",
              cos: [{ id: "cummins", note: "Industrial and off-highway engines; exports" }] }
          ]}
        ]
      },
      {
        id: "infra", name: "Infra EPC", title: "Infrastructure EPC: what the contractors build",
        sequence: false,
        stages: [
          { name: "Transport", nodes: [
            { id: "railepc", name: "Railways & metro", icon: "train",
              desc: "Track, electrification (OHE), signalling and metro systems.",
              cos: [{ id: "kec", note: "Railway electrification, track and civil" },
                    { id: "kpil", note: "Railway track and electrification" },
                    { id: "siemens", note: "Signalling and metro systems" }] }
          ]},
          { name: "Urban & civil", nodes: [
            { id: "buildings", name: "Buildings & factories", icon: "building",
              desc: "Industrial plants, data-centre shells, residential and commercial buildings.",
              cos: [{ id: "kec", note: "Civil: industrial, residential and data-centre buildings" },
                    { id: "kpil", note: "Buildings & factories business" }] },
            { id: "waterepc", name: "Water supply", icon: "drop",
              desc: "Pipelines, treatment plants and distribution networks.",
              cos: [{ id: "kpil", note: "Water pipelines and treatment" }] }
          ]},
          { name: "Energy & resources", nodes: [
            { id: "oilgas", name: "Oil & gas pipelines", icon: "pipe",
              desc: "Cross-country pipelines and terminals.",
              cos: [{ id: "kpil", note: "Oil & gas pipeline EPC" }] },
            { id: "re", name: "Renewables EPC", icon: "solar",
              desc: "Solar and balance-of-plant execution.",
              cos: [{ id: "kec", note: "Solar EPC" }] }
          ]}
        ]
      }
    ]
  },

  durables: {
    id: "durables",
    name: "Consumer Durables",
    tagline: "Electricals, cooling and kitchen appliances",
    draft: true,
    coverage: [
      { id: "havells", name: "Havells India", ticker: "HAVELLS" },
      { id: "crompton", name: "Crompton Greaves CE", ticker: "CROMPTON" },
      { id: "bajajelec", name: "Bajaj Electricals", ticker: "BAJAJELEC" },
      { id: "vguard", name: "V-Guard Industries", ticker: "VGUARD" },
      { id: "orientelec", name: "Orient Electric", ticker: "ORIENTELEC" },
      { id: "voltas", name: "Voltas", ticker: "VOLTAS" },
      { id: "bluestar", name: "Blue Star", ticker: "BLUESTARCO" },
      { id: "whirlpool", name: "Whirlpool of India", ticker: "WHIRLPOOL" },
      { id: "rrkabel", name: "RR Kabel", ticker: "RRKABEL" },
      { id: "fincables", name: "Finolex Cables", ticker: "FINCABLES" },
      { id: "ttk", name: "TTK Prestige", ticker: "TTKPRESTIG" },
      { id: "hawkins", name: "Hawkins Cookers", ticker: "HAWKINCOOK" }
    ],
    chains: [
      {
        id: "home", name: "The home", title: "Inside the home: wiring to kitchen",
        sequence: false,
        stages: [
          { name: "Wiring & protection", nodes: [
            { id: "wires", name: "House wires & cables", icon: "cable", desc: "Building wires and flexible cables.",
              cos: [{ id: "havells", note: "Wires and cables" }, { id: "rrkabel", note: "Wires and cables" }, { id: "fincables", note: "Electrical and communication cables" }] },
            { id: "switchgearb2c", name: "Switches & switchgear", icon: "switch", desc: "Modular switches, MCBs and distribution boards.",
              cos: [{ id: "havells", note: "Switchgear and switches" }, { id: "vguard", note: "Switchgear" }] }
          ]},
          { name: "Fans, lights & water", nodes: [
            { id: "fans", name: "Fans", icon: "fan", desc: "Ceiling, table and BLDC fans.",
              cos: [{ id: "crompton", note: "Fans" }, { id: "havells", note: "Fans" }, { id: "orientelec", note: "Fans" }, { id: "bajajelec", note: "Fans" }, { id: "vguard", note: "Fans" }] },
            { id: "lighting", name: "Lighting", icon: "bulb", desc: "LED lamps, battens and professional lighting.",
              cos: [{ id: "havells", note: "Lighting" }, { id: "crompton", note: "Lighting" }, { id: "bajajelec", note: "Lighting" }, { id: "orientelec", note: "Lighting" }] },
            { id: "waterheaters", name: "Water heaters & pumps", icon: "drop", desc: "Geysers, residential and agri pumps.",
              cos: [{ id: "crompton", note: "Pumps and water heaters" }, { id: "vguard", note: "Water heaters" }, { id: "havells", note: "Water heaters" }] }
          ]},
          { name: "Cooling", nodes: [
            { id: "rac", name: "Room air conditioners", icon: "ac", desc: "Split and window ACs.",
              cos: [{ id: "voltas", note: "Room ACs" }, { id: "bluestar", note: "Room ACs" }, { id: "havells", note: "Lloyd room ACs" }, { id: "whirlpool", note: "Room ACs" }] },
            { id: "commercial", name: "Commercial cooling", icon: "snow", desc: "Central AC, VRF and commercial refrigeration.",
              cos: [{ id: "bluestar", note: "MEP, VRF, commercial refrigeration" }, { id: "voltas", note: "Projects and commercial refrigeration" }] },
            { id: "fridge", name: "Refrigerators & washers", icon: "box", desc: "Large home appliances.",
              cos: [{ id: "whirlpool", note: "Refrigerators and washing machines" }] }
          ]},
          { name: "Kitchen", nodes: [
            { id: "cookware", name: "Cookers & cookware", icon: "pot", desc: "Pressure cookers and cookware.",
              cos: [{ id: "ttk", note: "Prestige cookers and cookware" }, { id: "hawkins", note: "Pressure cookers and cookware" }] },
            { id: "smallapp", name: "Small appliances", icon: "plug", desc: "Mixers, kettles and cooktops.",
              cos: [{ id: "ttk", note: "Kitchen appliances" }, { id: "bajajelec", note: "Small appliances" }] }
          ]}
        ]
      }
    ]
  },

  ems: {
    id: "ems",
    name: "EMS",
    tagline: "Electronics manufacturing services, ODM and components",
    draft: true,
    coverage: [
      { id: "dixon", name: "Dixon Technologies", ticker: "DIXON" },
      { id: "kaynes", name: "Kaynes Technology", ticker: "KAYNES" },
      { id: "syrma", name: "Syrma SGS", ticker: "SYRMA" },
      { id: "avalon", name: "Avalon Technologies", ticker: "AVALON" },
      { id: "cyientdlm", name: "Cyient DLM", ticker: "CYIENTDLM" },
      { id: "amber", name: "Amber Enterprises", ticker: "AMBER" },
      { id: "pgel", name: "PG Electroplast", ticker: "PGEL" },
      { id: "epack", name: "EPACK Durable", ticker: "EPACK" },
      { id: "datapatterns", name: "Data Patterns", ticker: "DATAPATTNS" },
      { id: "centum", name: "Centum Electronics", ticker: "CENTUM" }
    ],
    chains: [
      {
        id: "ems", name: "Electronics", title: "Electronics: from components to finished products",
        sequence: true,
        stages: [
          { name: "Components & semis", nodes: [
            { id: "semis", name: "OSAT & semiconductors", icon: "chip", desc: "Chip assembly, test and packaging.",
              cos: [{ id: "kaynes", note: "OSAT (Kaynes Semicon)" }] },
            { id: "pcb", name: "Bare PCBs & components", icon: "pcb", desc: "Printed circuit boards and passive/electromechanical parts.",
              cos: [{ id: "amber", note: "PCBs (Ascent Circuits) and components" }, { id: "kaynes", note: "Bare PCBs" }, { id: "syrma", note: "Magnetics and RFID" }] }
          ]},
          { name: "Board assembly", nodes: [
            { id: "pcba", name: "PCB assembly (SMT)", icon: "pcb", desc: "Populating boards for OEM customers.",
              cos: [{ id: "kaynes", note: "High-mix PCBA" }, { id: "syrma", note: "PCBA" }, { id: "avalon", note: "PCBA, US and India plants" }, { id: "cyientdlm", note: "PCBA for aerospace, medical, industrial" }, { id: "centum", note: "High-reliability PCBA" }] }
          ]},
          { name: "Box build & ODM", nodes: [
            { id: "mobiles", name: "Mobiles & IT hardware", icon: "phone", desc: "PLI-led smartphone and laptop assembly.",
              cos: [{ id: "dixon", note: "Mobiles, IT hardware" }] },
            { id: "durodm", name: "Consumer durables ODM", icon: "ac", desc: "RACs, washing machines, TVs for brands.",
              cos: [{ id: "amber", note: "RAC ODM and components" }, { id: "pgel", note: "RACs, washing machines, TVs" }, { id: "epack", note: "RAC ODM and small appliances" }, { id: "dixon", note: "TVs, washing machines, lighting" }] },
            { id: "defence", name: "Defence & aerospace systems", icon: "shield", desc: "Radars, avionics and mission electronics.",
              cos: [{ id: "datapatterns", note: "Radars, EW and avionics" }, { id: "centum", note: "Defence and space subsystems" }, { id: "cyientdlm", note: "Aerospace box builds" }] }
          ]},
          { name: "End markets", nodes: [
            { id: "auto", name: "Auto & EV", icon: "car", desc: "Vehicle electronics and EV subsystems.",
              cos: [{ id: "kaynes", note: "Auto and EV electronics" }, { id: "syrma", note: "Auto electronics" }] },
            { id: "industrial", name: "Industrial & medical", icon: "gear", desc: "Industrial controls, medical devices, rail.",
              cos: [{ id: "syrma", note: "Industrial and healthcare" }, { id: "avalon", note: "Industrial, clean energy, mobility" }, { id: "kaynes", note: "Industrial and railways" }] }
          ]}
        ]
      }
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
