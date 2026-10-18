# Coverage Terminal

Static front end for the Capital Goods, Consumer Durables and EMS coverage universe.
No build step: open `index.html` in a browser (or serve the folder with `python3 -m http.server`).

## What's in it
- **Sector dropdowns** (top bar): each sector lists its coverage companies. "Open … value chain" shows the sector page.
- **Value chains**: each sector page draws its value chains (Capital Goods: Power T&D, Industrial plant, Infra EPC) as stages of products, with ticker callouts. Click a product to see the companies that make it; click a company chip to highlight every product it plays in.
- **Company deep dive** (live: Voltamp Transformers): about, end-market mix, product rating spectrum, financials with forward estimates (CMP is editable and re-prices P/E and EV/EBITDA), and the sentiment tracker.
- **Sentiment tracker**: a 0–100 score built from weighted factor readings (AI-capex trade regime, basket vs Nifty, order inflow, input costs, valuation, flows). It explains the score in words, shows the AI-trade transmission chain (e.g. anti-AI trade hot → global AI-power names sell off → India transformer basket de-rates), and has presets plus sliders for scenarios.

## Adding the next company
All content lives in `js/data.js`:
1. In `SECTORS[sector].coverage`, set `live: true` on the company. Its value-chain products are listed under `chains`.
2. Add an entry under `COMPANIES` with the same id (copy the `voltamp` block as a template).
3. Set `sentimentModel` to an existing model in `SENTIMENT_MODELS`, or add a new model (e.g. cables, RAC/cooling, EMS) with its own factors.

All numbers currently in `data.js` are **sample figures** for the interface build. Replace them with house-model numbers and a real price series before using the page.
