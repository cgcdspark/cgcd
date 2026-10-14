# First Bullish Bounce (FBB): TradingView research strategy

Files (Pine Script v6, daily standard candles, NSE equities):
- `FBB_Strategy.pine`: the backtest strategy.
- `FBB_Scanner.pine`: a companion indicator for TradingView's Pine Screener. It lists stocks with a live READY setup, using the same rules. See the "Scanner" section.

Both files hold the same rule code. When a rule changes, change both.

This is a research tool. Its job is to find out whether the setup has a measurable
historical edge. A Pine backtest does **not** reproduce real execution. Read
section 7 before you trust any number it produces.

---

## How the script works

| Step | Rule (all thresholds are inputs) |
|---|---|
| Trend | Close > 50 EMA. Optional: 50 EMA > 200 EMA (on by default). Optional: "established uptrend", meaning the 50 EMA is rising over the previous 20 sessions **and** at least 70% of the previous 20 closes were above it (evaluated on bars *before* the reversal). Optional ADX ≥ 20 (off by default). |
| Pullback | The candle's low is within ±1.5% of the reference level and the close is at or above it. Reference options: 20 EMA, 50 EMA, 20 **or** 50 EMA (default), the most recent *confirmed* swing low, or EMA **or** swing low. A swing low only counts after `right bars` sessions have passed, so the support level never uses future candles. |
| Reversal candle | Completed daily candle. Close > open, body ≥ 50% of range, close in the top 25% of range, volume ≥ 1.2 × the average of the **previous** 20 sessions. Zero range is rejected. Missing or zero volume is rejected by default, or the volume check can be skipped. |
| READY | At the reversal candle's close the script computes the trigger (high + 0.10%, and always at least 1 tick above the high), the stop (low − 0.10%, or low − k × ATR), the planned target (see "Target modes") and the **max entry price**. It then places a stop-limit buy (stop = trigger, limit = max entry) and a pre-attached exit (stop + target). |
| Reject | If the trigger is already above the max entry, the setup is rejected (grey ✕). The stop is never moved to make a setup pass. |
| TRIGGERED → OPEN | The order can only fill from the **next** session onwards. After the fill, the target is re-based on the **actual** fill price. |
| EXPIRED | Checked at each session close while the setup is READY. **GAP**: the trigger traded but no fill at or below the max entry. **BROKE LOW**: price went below the stop level before triggering. **TIMEOUT**: not filled within 3 sessions. |
| CLOSED | **TP**, **SL**, or **TIME**. TIME means a market close at the *close* of session 10, counting the entry session as session 1. |

**Target modes** (input *Target mode*):

| Mode | Target | Accepted when |
|---|---|---|
| **R-multiple within band** (default, v1.1) | entry + 2.5 × risk, but at least entry + 3% | the target fits inside 3–7%, i.e. risk ≤ 2.8%. Risk under 1.2% gets the 3% floor, which gives better than 2.5:1. |
| **Fixed %** (v1.0 behaviour) | entry × (1 + 3 / 5 / 7%) | risk ≤ target ÷ 2.5 |

Example: a setup with 2.6% risk gets a 6.5% target in R-multiple mode. In Fixed 5% mode the same setup is rejected. Position size is ₹1L in both modes.

**Max entry price.** The stop is fixed, so planned R:R falls as the entry price rises.
The highest acceptable fill is
`min( stop / (1 − maxStop%), stop × RR / (RR − target%) )`.
In R-multiple mode, target% here is the band maximum (7%).
The stop-limit order therefore never fills at a price that breaks either the 2.5 R:R
rule or the 3% stop-distance rule. This is how excessive gap-ups are rejected.

**Important consequence:** with a 2.5 R:R minimum, the largest risk you can take is
`target% / 2.5` (in R-multiple mode, `7% / 2.5 = 2.8%`):

| Target | Max risk (% of entry) |
|---|---|
| 3% | 1.20% |
| 5% | 2.00% |
| 7% | 2.80% |

The 3% stop cap therefore never binds at the default R:R. The binding constraint
is R:R. A strong reversal candle on a small cap often has a range above 2%, so
expect **many rejections and few trades**, especially at 3%. The status table shows
qualifying, rejected and expired counts so you can see this directly.

**Chart markers.**
- READY: orange label below the bar. Hover it for trigger, max entry, stop, target, risk and R:R.
- TRIGGERED: green label below the bar.
- OPEN: green background shading.
- EXPIRED: grey label above the bar, with the reason.
- CLOSED: teal (gain) or red (loss) label above the exit bar. Shows gross %, before costs.
- Rejected candle: small grey ✕.
- Lines: trigger (green), max entry (faint green), stop (red), target (blue), entry (grey).

---

## 1. Pasting it into TradingView

1. Open a chart of an NSE stock, e.g. `NSE:TATAMOTORS`. Set the timeframe to **1D** and the chart type to **Candles**. Heikin-Ashi, Renko and similar chart types stop the script with an error.
2. Open the **Pine Editor** tab at the bottom of the screen. Click the script-name dropdown, then **Create new → Strategy**.
3. Select all of the template (Ctrl/Cmd + A) and delete it. Paste the full contents of `FBB_Strategy.pine`.
4. Click **Save** and name it "FBB v1.0". Then click **Add to chart**.
5. Open the **Strategy Tester / Strategy Report** tab and check that trades appear. If the console shows compile errors, copy them back to Claude Code verbatim.
6. If you later edit the `strategy(...)` line, remove the strategy from the chart and add it again. Otherwise, use **Settings → Properties → Reset settings**. Properties you have saved can override new defaults.

---

## 2. Baseline settings (v1.0, change nothing else for the first run)

**Inputs tab**

| Input | Baseline |
|---|---|
| Start date / end date | Development period (see section 6), e.g. 1 Jan 2012 to 31 Dec 2020 |
| EMAs | 20 / 50 / 200 |
| Require 50 > 200 | On |
| Established uptrend | On, 20 sessions, 70% |
| ADX filter | **Off** |
| Pullback reference | 20 or 50 EMA, tolerance 1.5% |
| Body / close-in-top / volume | 50% / 25% / 1.2 × 20-session average |
| Missing volume | Reject signal |
| Trigger buffer | 0.10% |
| Expiry | 3 sessions |
| Stop buffer | Percent, 0.10% |
| Max stop distance | 3.0% |
| Target mode | **R-multiple within band, 3–7%** (baseline). For comparison: Fixed % at 3, 5 and 7 |
| Min R:R | 2.5 |
| Max holding | 10 sessions |

**Properties tab** (these are already the script defaults)

| Property | Value | Reason |
|---|---|---|
| Initial capital | 10,00,000 | |
| Order size | 1,00,000 (cash) per trade | Fixed size, so trades are comparable and there is no compounding |
| Pyramiding | 0 orders | |
| Commission | **0.12% per side** | Approximates the delivery round trip: STT 0.1% each side, stamp duty 0.015% on buys, exchange/SEBI fees, GST, DP charge. About 0.24% round trip. Adjust it to your broker. |
| Slippage | 2 ticks | Raise this for small caps (see section 5) |
| Verify price for limit orders | 1 tick | The target fills only if price trades through it |
| Recalculate on every tick / after order fills | **Off** | Turning these on can create look-ahead artefacts |
| Fill orders on bar close | **Off** | Prevents same-candle fills |
| Bar Magnifier | Off by default. Turn it on if your plan supports it (see section 7). | |

---

## 3. Comparing the 3%, 5% and 7% targets (and R-multiple mode)

1. Keep **every other setting fixed**. Run four configurations: *Target mode* = R-multiple within band, then Fixed % with *Fixed target* at 3, 5 and 7.
2. Run each target on the **same symbols and the same development date range**. For each one, record the following from Strategy Report → Performance Summary / Trades Analysis:
   - Total trades, win rate %, profit factor, net profit, average trade (₹ and %), max drawdown, average bars in trade.
   - From the status table: qualifying, rejected, triggered, and exits by TP / SL / TIME.
3. Expect the target to change **which setups are allowed**, not just how trades exit. A larger target allows wider stops (max risk 1.2% → 2.0% → 2.8%), so it admits more setups. You are comparing different trade populations.
4. Put the results in a sheet with one row per (symbol or basket, target).
5. A target is only "better" if it is better **across most symbols and both cap buckets**, not on one stock. Also check the TIME-exit share. If most trades exit on TIME, the target is rarely reached within 10 sessions.
6. Choose the target **on the development period only**. Then freeze it before you look at out-of-sample data.

7. R-multiple mode accepts the union of what the three fixed targets accept. Compare its average trade % with Fixed 7%. If it is clearly worse, the extra trades it admits (risk 1.2–2.8% with a matching target) are not adding edge.

---

## Scanner (Pine Screener)

`FBB_Scanner.pine` is an *indicator*, not a strategy, because the Pine Screener only runs indicators. It applies the same trend, pullback, candle, stop, target and R:R rules as the strategy. That includes R-multiple mode, so a stock with 2.6% risk and a 6.5% target shows up as READY.

**Setup**
1. Pine Editor → **Create new → Indicator**. Paste `FBB_Scanner.pine`, then **Save** it as "FBB Scanner".
2. Add it to your **favourites** (star it in Indicators → My scripts). The Pine Screener only lists favourited scripts.
3. Open the Pine Screener: the **Screeners** menu → **Pine**. Availability depends on your TradingView plan and it may be labelled beta. Choose a **watchlist** (e.g. your large / mid / small-cap baskets), select *FBB Scanner*, and set the timeframe to **1D**.
4. If you changed any strategy inputs, set the same values in the screener's indicator settings.
5. Add the filter **Status ≥ 1 and Status ≤ 2** to list READY setups. Sort by *Distance to trigger %* or *Risk %*.
6. Run it **after the NSE close** (from about 4 pm IST). Only completed daily candles create signals.

**Columns**

| Column | Meaning |
|---|---|
| Status | 1 = READY new today, 2 = READY pending, 3 = TRIGGERED today, 4 = in trade (per strategy rules), 5 = closed today, 6 = expired today, 9 = rejected today (risk too wide), 0 = nothing |
| Trigger / Max entry | Buy-stop level and the highest acceptable fill. Skip the trade if it opens above max entry. |
| Stop / Target | Stop below the reversal low. The target is planned from the trigger; recompute it from your actual fill. |
| Risk %, Target %, R:R | For the planned entry at the trigger. For status 9, Risk % shows why the setup was rejected. |
| Distance to trigger % | How far today's close is below the trigger |
| Sessions left | Sessions before the setup expires |

On a chart the scanner also draws READY / TRIGGERED / EXPIRED / REJECTED labels and the levels. It has two alert conditions ("FBB READY", "FBB TRIGGERED") that you can set as TradingView alerts. It places no orders.

**Differences from the strategy (small, by design):**
- Fills are inferred from daily OHLC: triggered if high ≥ trigger and low ≤ max entry.
- In-trade tracking does not check for an exit on the entry day itself.
- The scanner has no backtest window.

**You trade one position at a time.** The screener lists every READY stock, but you can only take one. Decide your tie-break rule *before* the trigger hits (e.g. lowest Risk % first) and use the same rule in the merged trade-list check described in section 5.

---

## 4. Interpreting the metrics

| Metric | What it tells you | Watch out for |
|---|---|---|
| **Net profit** | Total P&L after the modelled commission and slippage | Dominated by a few outliers and by trade count. Never compare it alone. |
| **Profit factor** (gross wins ÷ gross losses) | Edge per unit of loss. Above 1.0 is profitable before unmodelled costs. Treat **1.3 or more over 100+ trades** as interesting. | Unstable with few trades. A PF of 3 on 12 trades means nothing. |
| **Max drawdown** | Worst peak-to-trough equity decline | With fixed ₹1L sizing, measure it against the capital per trade as well as the account. Real drawdowns are usually larger than backtested ones. |
| **Win rate** | % of trades closed in profit | Must be read with R:R. At 2.5:1 the breakeven win rate is about 29% before costs and about 31–33% after costs. TIME exits have a smaller payoff, which raises it further. |
| **Average trade** | Expectancy per trade (₹ and %) | This is the key number. It must be comfortably above round-trip costs plus realistic extra slippage, e.g. **0.4% or more per trade** for small caps. |
| **Number of trades** | Statistical weight | Under about 30 per configuration is anecdotal. Aim for 100+ pooled across symbols before drawing conclusions. |

Also check: the average loss is close to the planned risk (if not, look for gaps through the stop), the largest single winner as a share of net profit, and the stability of results across years.

---

## 5. Comparing large-, mid- and small-cap stocks

TradingView backtests one symbol at a time, so build fixed baskets in advance:

1. **Define the buckets by a rule, fixed in advance.** For example, use the AMFI half-yearly classification: large = ranks 1–100, mid = 101–250, small = 251+. Take each bucket's list **as of the start of the test period** if you can, to reduce survivorship bias. Avoid choosing stocks because they trended well.
2. **Sample 15–25 stocks per bucket**, spread across sectors. For small caps, also require a minimum liquidity, e.g. median daily turnover of ₹5 crore or more over the test period. Exclude T2T/BE-segment and ASM/GSM stocks where you can.
3. **Use identical inputs and properties** for every symbol. Only change **slippage**, by bucket, and decide it beforehand: e.g. large 1–2 ticks, mid 3 ticks, small 5+ ticks, or larger for low-priced stocks where a tick is a big percentage.
4. **For each symbol record:** trades, wins, gross profit, gross loss, net profit, average trade %, max drawdown, and exit-reason counts. Aggregate **per bucket** by summing gross profit and loss to get a bucket profit factor and a pooled average trade. Do not average per-symbol PFs.
5. **Compare buckets on pooled average trade %, pooled PF, trade count and the share of GAP / BROKE LOW expiries.** A bucket "has an edge" only if it holds up in the out-of-sample period too.
6. **One trade at a time across all stocks.** Your account holds one ₹1L position at a time, but TradingView tests each stock on its own, so summed results include trades that overlapped in time. Average trade, profit factor and win rate per trade remain valid. Total trades, net profit and drawdown are overstated. To get the realistic figures:
   1. Export each stock's *List of Trades*.
   2. Merge them in one spreadsheet and sort by entry date.
   3. Keep a trade only if it starts after the previous kept trade's exit.
   4. Break same-day ties with the rule you fixed in advance.
7. Tip: put the symbols in a watchlist and step through them with the strategy loaded. Settings carry over between symbols on the same chart layout.

---

## 6. Validation: development vs. out-of-sample

1. **Split time before looking at results.** For example:
   - Development: 2012-01-01 to 2020-12-31
   - Out-of-sample (OOS): 2021-01-01 to the present

   Make sure each OOS period contains both trending and choppy phases.
2. **Develop only on the development period.** Set the backtest window to it. Choose the target (3/5/7) and, at most, one or two other parameters there. Write the chosen configuration down.
3. **Robustness on development data.** Nudge each key parameter by about ±20%: tolerance 1.0/1.5/2.0, volume 1.0/1.2/1.5, body 40/50/60. A real edge degrades gracefully. If results collapse when a parameter moves one step, the result is overfit.
4. **Freeze, then run the OOS window once**, with the identical configuration on the identical symbol baskets. Do not re-tune after seeing OOS results. If you do, the OOS period becomes development data and you need a new untouched period.
5. **Pass criteria (set them before the OOS run).** For example: pooled OOS PF ≥ 1.2, average trade % above 2 × round-trip cost, at least 50 OOS trades, and no single symbol contributing more than 25% of net profit.
6. **Optional walk-forward.** Repeat steps 2–4 on rolling windows (e.g. develop 2012–2016 → test 2017–2018; develop 2014–2018 → test 2019–2020) and check that the frozen parameters keep working.
7. **Windows gate new setups only.** A trade opened near the end date is allowed to finish, so a few trades spill a few sessions past the boundary. That is intended. Trades are attributed by their setup date.
8. **Warm-up.** The 200 EMA needs about 200 or more sessions of history before the start date. Check that the chart loads history earlier than your start date.

---

## 7. Implementation bugs and limitations to check

### Things to verify on the chart (spot-check 10–20 trades)
- [ ] **No same-candle fill.** Each TRIGGERED label is at least one bar after its READY label.
- [ ] **Entry price.** It equals the trigger, or the open if the stock gapped above the trigger but below the max entry. It never exceeds the max entry.
- [ ] **Stop.** The SL exit equals the stop level, or the open if price gapped below it. The stop never moves.
- [ ] **Target.** In Fixed mode it equals entry × (1 + target%). In R-multiple mode it equals entry + 2.5 × (entry − stop), at least entry × 1.03, and never more than about 7%. On the **entry session itself** the pre-placed planned target (based on the trigger) applies. The re-based target applies from the next session. This only differs on gap fills.
- [ ] **TIME exit.** It happens at the close of session 10, counting the entry day as day 1.
- [ ] **Expiry.** The setup expires at the close of the 3rd session after the signal, and no fill happens after an EXPIRED label.
- [ ] **No overlap.** There is never a new READY while a setup is pending or a position is open. There is also no new READY on a bar where a trade closed or a setup expired. This is a simplification and drops a few setups.
- [ ] **Order size.** Check quantities in *List of Trades*. For very high-priced stocks, ₹1L may buy fewer than 1 share, or a fractional quantity. The fill price also differs slightly from the price used to size the order.
- [ ] **Edge case.** If the max entry equals the trigger exactly, "Verify price for limit orders = 1 tick" can stop a fill and produce a false "GAP" expiry. This is rare. Check by setting that property to 0.
- [ ] **Entry slippage.** Check whether the emulator applied slippage to the stop-limit entry. If entry = trigger exactly, it did not. Raise the commission to compensate.

### Broker emulator limitations
- **Intrabar order is unknown on daily data.** The emulator assumes a path: if the open is nearer the high, open → high → low → close, otherwise open → low → high → close. When the stop and the target both sit inside one daily range, **daily OHLC cannot tell which was hit first**. The result depends on that assumption, not on reality.
- **Same-session entry and exit** are resolved with the same assumed path and can be optimistic or pessimistic.
- **Bar Magnifier** (Premium and above: Properties → "Use bar magnifier", or `use_bar_magnifier = true` in the code) uses lower-timeframe data inside each daily bar to order fills more realistically. It helps most with same-bar stop/target conflicts and entry-day exits. It only works where intraday history exists. Older bars, often many years back, fall back to the OHLC assumption. It is still bar-based, not tick-perfect. Compare results with it on and off. A big difference means your edge depends on intrabar ordering.
- Limit (target) fills have **no slippage**. Stop/market fills get the fixed tick slippage, not a % of price and not liquidity-dependent.
- **Gaps** are filled at the open. This is realistic for gap-downs through the stop, but in practice your fill can be worse.

### Market and data limitations (NSE-specific)
- **Circuit limits.** On upper-circuit days a breakout fill may be impossible (no sellers). On lower-circuit days the stop may not execute for days. The backtest fills anyway. This matters most for small caps with 5%/10%/20% bands.
- **Liquidity.** Thin small caps have wide spreads and impact costs the model ignores. Use larger slippage, or exclude illiquid names.
- **Survivorship bias.** Testing today's index constituents ignores delisted or demoted stocks.
- **Corporate actions.** TradingView adjusts for splits and bonuses. Check whether dividend adjustment is on (chart settings → "Adjust data for dividends") and keep it the same across all tests.
- **Data gaps / missing volume** suppress signals by design. Check that the volume history looks complete.
- **Costs** are approximations. Brokerage, DP charges and GST vary by broker. A flat % understates fixed per-order costs on small positions.
- **Realtime vs. history.** Signals are evaluated only on confirmed daily bars, so they do not repaint. Live orders, partial fills, auction sessions and broker rejections are not modelled. **This script does not place live orders.**
- **Multiple testing.** Every parameter you try inflates the best result. Keep a log of every configuration tested.

### Code review notes (v1.0)
- No `request.security`, no negative offsets, no `lookahead`. Swing lows come from `ta.pivotlow` and are only usable after confirmation. The volume average uses prior sessions only.
- `process_orders_on_close = false` and `calc_on_order_fills = false`, so orders placed at the signal close can only fill from the next session.
- Exits are pre-placed with the entry, so the emulator can fill a stop or target on the entry session.
- Division guards: zero-range candles are rejected. Volume of na or zero is handled by the input. `minRR > target` always holds with the allowed inputs.
- The script has been checked by reading the code but **not compiled in this environment**. Compile it in TradingView and report any errors.
