# FBB daily scan: whole NSE universe (Chartink, free)

TradingView's Pine Screener needs a paid plan. On the free plan, run this
end-of-day scan on chartink.com across all NSE cash stocks. Then confirm each
hit on a TradingView chart with `FBB_Scanner.pine` or the strategy.

## Scan clause (paste into Chartink → Screener → "Scan clause" / copy-paste mode)

```
( {cash} (
  latest close > latest ema( latest close , 50 )
  and latest ema( latest close , 50 ) > latest ema( latest close , 200 )
  and 1 day ago ema( latest close , 50 ) > 21 days ago ema( latest close , 50 )
  and latest close > latest open
  and latest close - latest open >= 0.5 * ( latest high - latest low )
  and latest high - latest close <= 0.25 * ( latest high - latest low )
  and latest volume >= 1.2 * 1 day ago sma( latest volume , 20 )
  and latest low >= 0.974 * latest high
  and (
    ( latest low <= 1.015 * latest ema( latest close , 20 )
      and latest low >= 0.985 * latest ema( latest close , 20 )
      and latest close >= latest ema( latest close , 20 ) )
    or
    ( latest low <= 1.015 * latest ema( latest close , 50 )
      and latest low >= 0.985 * latest ema( latest close , 50 )
      and latest close >= latest ema( latest close , 50 ) )
  )
  and latest close * 1 day ago sma( latest volume , 20 ) > 50000000
) )
```

If Chartink rejects the pasted text, add the same conditions one at a time
with its visual scan builder.

## What each line maps to (FBB v1.1 defaults)

| Scan line | Strategy rule |
|---|---|
| close > EMA50, EMA50 > EMA200 | Trend + 50 > 200 filter |
| EMA50 yesterday > EMA50 21 days ago | "Established uptrend": the EMA is rising |
| close > open, body ≥ 50%, close in top 25% | Reversal candle |
| volume ≥ 1.2 × previous 20-day average | Volume rule |
| low within ±1.5% of EMA20 or EMA50, close at or above it | Pullback, "20 or 50 EMA" mode |
| low ≥ 0.974 × high | Candle range ≤ about 2.6%, so risk ≤ 2.8% after the 0.10% buffers. This is the R-multiple 3–7% band at 2.5:1. Use 0.981 for Fixed 5%, or 0.988 for Fixed 3%. |
| close × avg volume > ₹5 cr | Liquidity floor. **Not** a strategy rule; it's for execution realism. Change it or remove it. |

**Not replicated in the scan:**
- The "70% of the last 20 closes above EMA50" check.
- The swing-low support mode.
- Expiry state. The scan shows *new* READY candles only.

The TradingView confirmation step covers these.

## Daily routine (after the NSE close)

1. Run the scan after about 4 pm IST. Each hit is a **new READY** candidate.
2. Open each hit on TradingView (1D, candles) with `FBB_Scanner.pine` on the chart.
   - **Status = 1** at the top-left of the chart confirms READY.
   - Hover the READY label to see the trigger, max entry, stop and target.
   - Status 9 means rejected. Status 0 means a rule the scan doesn't check failed.
3. Keep a READY list. Each setup stays live for **3 sessions**. Remove it if:
   - the low breaks the stop, or
   - it opens above max entry, or
   - 3 sessions pass without a trigger.
4. You hold one trade at a time. If several trigger on the same day, apply a tie-break fixed in advance, e.g. lowest risk % first.
