# VCP Base Breakout: NSE swing/position strategy

Files (Pine Script v6, daily standard candles):

| File | Type | Purpose |
|---|---|---|
| `VCP_Breakout_Strategy.pine` | strategy | Backtest, plus a live status table to confirm a stock |
| `Sector_Rotation.pine` | indicator | Ranks 16 NSE sector indices by relative strength vs NIFTY |
| Chartink scans (below) | — | Find candidates across the whole NSE universe (free) |

Sizing: ₹1,00,000 per trade, one position at a time (the same as FBB). Costs: 0.12% per side plus 2 ticks of slippage.

This is a research tool. A backtest is not proof of an edge and does not reproduce real fills.

---

## The rules

| Step | Rule (default; every number is an input) |
|---|---|
| **Long base** | The highest high of the last ≤ 250 sessions (the **pivot**) was set **at least 30 sessions ago**. The base is no deeper than **35%** from that high. |
| **VCP (contractions)** | The base is split into three windows: **first** (from the base high up to the middle window, at least 10 sessions), **middle** (13 sessions) and **final** (the last 7 sessions). Each window's high-to-low depth must be **smaller than the previous one**, and the final contraction must be **≤ 10%**. |
| **Volume dry-up** | Average volume in the final window is **≤ the 50-day average**. |
| **Breakout from MAs** | On a **completed daily close**: the close is above the pivot **and** above the 20, 50 and 200 EMAs, with volume **≥ 1.5×** the previous 50-day average. |
| **Sector rotation** | The stock's sector index is outperforming the NIFTY: its RS line (sector ÷ NIFTY) is above its 50-day EMA **and** higher than 20 sessions ago. The sector is picked automatically from TradingView's classification, or you set it yourself. |
| **Entry** | The next session, as a limit buy at the **max entry price**. It fills at the open if the open is at or below max entry. If the stock gaps above it, the trade is **SKIPPED**. |
| **Stop** | Under the final contraction low, or under the breakout-day low if that is lower, minus 0.10%. If that is more than **6%** below the breakout close, the breakout is rejected (grey ✕). The stop is never tightened. |
| **Exit** | Either the stop is hit, or there is a **daily close below the 50 EMA**, in which case the position is sold at the next open. You can switch the trailing EMA to 20 or 10. |

**Chart markers:**
- **BREAKOUT** (orange, below the bar): signal day. Hover it for the base, contraction, volume, stop and sector details.
- **BOUGHT** (green, below the bar): entry fill.
- **SKIPPED** (grey, above the bar): the stock gapped above max entry.
- **CLOSED SL / TRAIL** (teal or red, above the bar): exit, with the gross %.
- **Green shading**: position open.
- **Pink line**: the current pivot (base high). **Red line**: the stop.

**Status table (top right).** It shows today's base length and depth, the contraction depths (first > middle > final), volume dry-up, VCP PASS/FAIL, distance to the pivot, the MA check and the sector RS quadrant. When everything passes except the breakout itself, it shows **"COILING: alert at pivot"**. That is your watchlist signal.

**How "VCP" is measured.** A true VCP has 2–4 hand-drawn contractions. The script uses three fixed windows as a mechanical stand-in. It catches tightening bases reasonably well, but it will sometimes pass a base you wouldn't draw as a VCP, and miss one you would. Always look at the chart before trading.

---

## Daily routine (free TradingView plan)

**1. Check where money is rotating (2 minutes)**
- Add `Sector_Rotation.pine` to any 1D chart (Pine Editor → New indicator → paste → Save → Add to chart).
- The table ranks sectors by their 1-month RS change.
- **Improving** (aqua) = money starting to rotate in. **Leading** (green) = already strong.
- Focus on stocks from the top 3–5 sectors that are Leading or Improving.

**2. Find breakouts across all NSE stocks (Chartink, after about 4 pm IST)**

Run the **breakout scan** below. Each hit is a stock that broke out today.

**3. Confirm each hit on TradingView**
- Open the stock (1D, candles) with the strategy added.
- There must be a **BREAKOUT** label on today's candle. The table must show the sector as **Leading** or **Improving**.
- Look at the chart: does it actually look like a base with tightening swings?
- Note the **stop** and the **max entry** from the label's tooltip.

**4. Next morning**
- Buy at the open **only if the open is at or below max entry**. Place the stop-loss immediately.
- You hold one position at a time. If several confirm on the same day, use a tie-break rule fixed in advance, e.g. strongest sector first, then smallest risk %.

**5. While holding**
- Each evening, check whether the stock closed below the 50 EMA. If it did, sell at the next open.

**Watchlist (optional).** Run the **coiling scan** weekly, and add the hits to a TradingView watchlist. On the free plan you can set a price alert at each stock's pivot. Act only when a daily *close* confirms the breakout.

---

## Chartink scans

These are approximate versions of the strategy rules, using fixed windows because Chartink can't measure a base of varying length. The TradingView strategy is the final check.

I couldn't test the scan text here. If Chartink rejects a pasted clause, build it with the visual builder using the same lines.

### Breakout scan (run after the close)

```
( {cash} (
  latest close > 1 day ago max( 250 , latest high )
  and 1 day ago max( 30 , latest high ) <= 31 days ago max( 220 , latest high )
  and 1 day ago min( 30 , latest low ) >= 0.65 * 1 day ago max( 250 , latest high )
  and 1 day ago max( 7 , latest high ) - 1 day ago min( 7 , latest low ) <= 0.10 * 1 day ago max( 7 , latest high )
  and ( 8 days ago max( 13 , latest high ) - 8 days ago min( 13 , latest low ) ) * 1 day ago max( 7 , latest high ) > ( 1 day ago max( 7 , latest high ) - 1 day ago min( 7 , latest low ) ) * 8 days ago max( 13 , latest high )
  and ( 21 days ago max( 30 , latest high ) - 21 days ago min( 30 , latest low ) ) * 8 days ago max( 13 , latest high ) > ( 8 days ago max( 13 , latest high ) - 8 days ago min( 13 , latest low ) ) * 21 days ago max( 30 , latest high )
  and 1 day ago sma( latest volume , 7 ) <= 1 day ago sma( latest volume , 50 )
  and latest volume >= 1.5 * 1 day ago sma( latest volume , 50 )
  and latest close > latest ema( latest close , 20 )
  and latest close > latest ema( latest close , 50 )
  and latest close > latest ema( latest close , 200 )
  and 0.94 * latest close <= 1 day ago min( 7 , latest low )
  and 0.94 * latest close <= latest low
  and latest close * 1 day ago sma( latest volume , 50 ) > 50000000
) )
```

| Line(s) | Meaning |
|---|---|
| close > 250-day high | Breakout above the pivot |
| 30-day high ≤ the high from 31–250 days ago | The pivot is at least 30 sessions old (long base) |
| 30-day low ≥ 65% of the pivot | Base depth ≤ 35% (checked over the last 30 sessions only) |
| 7-day range ≤ 10% | Tight final contraction |
| the two cross-multiplied lines | First depth > middle depth > final depth. They are written without division. |
| 7-day avg volume ≤ 50-day avg | Volume dry-up |
| volume ≥ 1.5 × 50-day avg | Breakout volume |
| close > EMA 20 / 50 / 200 | Breakout from the moving averages |
| 0.94 × close ≤ lows | Stop within 6% |
| close × avg volume > ₹5 cr | Liquidity floor. **Not** a strategy rule. Adjust or remove it. |

### Breakout scan, pivot-based stop (wider net)

The strict scan measures the 6% stop from the breakout-day **close**. Strong breakout candles often close 7–10% above the final contraction low, so the strict scan drops the best moves. This version requires the final 7-day contraction low to be within 6% of the **pivot** (the base high) instead. That is the usual VCP way of sizing the stop. It also drops the "7-day range ≤ 10%" line, because the pivot test is tighter. If you then buy at the next open, check that the stop is still within your limit from your actual price.

```
( {cash} (
  latest close > 1 day ago max( 250 , latest high )
  and 1 day ago max( 30 , latest high ) <= 31 days ago max( 220 , latest high )
  and 1 day ago min( 30 , latest low ) >= 0.65 * 1 day ago max( 250 , latest high )
  and ( 8 days ago max( 13 , latest high ) - 8 days ago min( 13 , latest low ) ) * 1 day ago max( 7 , latest high ) > ( 1 day ago max( 7 , latest high ) - 1 day ago min( 7 , latest low ) ) * 8 days ago max( 13 , latest high )
  and ( 21 days ago max( 30 , latest high ) - 21 days ago min( 30 , latest low ) ) * 8 days ago max( 13 , latest high ) > ( 8 days ago max( 13 , latest high ) - 8 days ago min( 13 , latest low ) ) * 21 days ago max( 30 , latest high )
  and 1 day ago sma( latest volume , 7 ) <= 1 day ago sma( latest volume , 50 )
  and latest volume >= 1.5 * 1 day ago sma( latest volume , 50 )
  and latest close > latest ema( latest close , 20 )
  and latest close > latest ema( latest close , 50 )
  and latest close > latest ema( latest close , 200 )
  and 0.94 * 1 day ago max( 250 , latest high ) <= 1 day ago min( 7 , latest low )
  and latest close * 1 day ago sma( latest volume , 50 ) > 50000000
) )
```

### Coiling scan (watchlist: VCP formed, not yet broken out)

```
( {cash} (
  latest close >= 0.95 * latest max( 250 , latest high )
  and latest max( 30 , latest high ) <= 30 days ago max( 220 , latest high )
  and latest min( 30 , latest low ) >= 0.65 * latest max( 250 , latest high )
  and latest max( 7 , latest high ) - latest min( 7 , latest low ) <= 0.10 * latest max( 7 , latest high )
  and ( 7 days ago max( 13 , latest high ) - 7 days ago min( 13 , latest low ) ) * latest max( 7 , latest high ) > ( latest max( 7 , latest high ) - latest min( 7 , latest low ) ) * 7 days ago max( 13 , latest high )
  and ( 20 days ago max( 30 , latest high ) - 20 days ago min( 30 , latest low ) ) * 7 days ago max( 13 , latest high ) > ( 7 days ago max( 13 , latest high ) - 7 days ago min( 13 , latest low ) ) * 20 days ago max( 30 , latest high )
  and latest sma( latest volume , 7 ) <= latest sma( latest volume , 50 )
  and latest close * latest sma( latest volume , 50 ) > 50000000
) )
```

**Sector filter in Chartink.** Chartink can't check sector rotation. Cross-check each hit's sector against the Sector Rotation table, or check the strategy's status table on the stock's chart.

---

## Backtesting it

1. Paste `VCP_Breakout_Strategy.pine` as a **new strategy**. It must be a separate script from FBB. Use a 1D candle chart.
2. Set the window to 2012–2020 (development). Keep 2021 onwards untouched for out-of-sample.
3. **Expect few trades per stock**, perhaps 1–4 a year at most. Real bases are rare. Judge the strategy on **pooled** results across 30–60 stocks, not single charts.
4. Trades are long, so look at the **average trade %**, **average winner ÷ average loser** (trend strategies win less than 50% of the time, but should have winners several times larger than losers), **profit factor**, and **max drawdown in ₹**.
5. Compare the trailing EMA settings (50 / 20 / 10) on development data only. Then freeze.
6. To check the sector filter's value, run with **"Require sector money rotation" on and off**. If results don't improve with it on, the filter isn't adding edge.

---

## Limitations and things to check

- **Sector mapping is approximate.** AUTO maps TradingView's sector names to NSE indices, e.g. "Consumer Durables" → Nifty Auto. That's wrong for some stocks: Consumer Durables also includes white goods. Check the table's "Sector RS" row and set *Sector index* yourself when it's wrong.
- **Sector symbols.** If an index symbol doesn't exist on TradingView, the script shows "n/a" instead of failing. By default the filter is then ignored. Set *If sector data is unavailable* to **Block trades** to be strict.
- **Sector index history.** Some indices start later than 2012. Before their data begins, the filter is ignored (or blocks trades, per the setting above).
- **The VCP proxy uses fixed windows** (7 / 13 / rest of base). It's a simplification, as described under "How VCP is measured" above.
- **Entry is the next open**, after a confirmed close. You give up some of the breakout-day move in exchange for not buying intraday fake-outs. Gap-ups beyond max entry are skipped.
- **Stop hits:** daily candles can't show what happened intraday. Gaps through the stop fill at the open, and lower-circuit days may not fill at all in reality.
- **Survivorship bias** applies when testing today's stock lists.
- **Not compiled in this environment.** Paste it into TradingView and send any errors, with their line numbers.
