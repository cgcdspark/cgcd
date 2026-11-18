# EP02 NVIDIA AFTER JENSEN: Scandal Desk File

Prepared by the investigations desk on 2026-11-18. This is a live story with legal risk.

## How this was verified (read first)

- **Primary documents I read in full** (fetched with curl from www.sec.gov):
  - the 8-K for the CEO transition (accession 0001045810-26-000082, Item 5.02) and its Ex. 99.1 press release;
  - the 8-K for Q3 FY27 earnings (accession 0001045810-26-000088, filed 17 Nov), with its press release and CFO commentary;
  - the EDGAR filing index for NVDA.
- **Everything else was blocked to direct fetch from this machine.** That includes nvidianews, GlobeNewswire, CNBC, CBS, ABC, Fortune, Wikipedia, chinaselectcommittee.house.gov and foreignaffairs.house.gov. For these sources I relied on several independent search-result extracts.
- **Quotes:** any quote marked *(search-extract)* was seen in a search result that quotes the named outlet, not on the original page. Before any quote goes on screen as a lower-third or full-screen graphic, someone must check it against the original page (URLs are given).
- **Confidence scale:**
  - H: a primary document, or 3 or more consistent independent outlets.
  - M: 2 outlets, or a single strong outlet.
  - L: a single outlet, aggregator or Wikipedia, or sources that conflict.

---

## 1. TIMELINE

Abbreviations for the Type column:
- **PD**: primary document
- **OR**: on-record statement
- **AN**: anonymous-source reporting
- **CM**: commentary
- **RP**: reported (secondary, sourcing mixed)

### Background before October 2026: the "investigated by the USA earlier in the year" check

| Date | Event | Who / source | Exact quote (if available) | URL | Type | Conf. |
|---|---|---|---|---|---|---|
| 2024 (month not given) | Commerce Dept (BIS) opens an export-control probe of **Megaspeed** (a Singapore company) after detecting "suspicious activity" while monitoring for chip diversion. | Joint Commerce–DOJ statement (16 or 17 Nov 2026), as reported | "suspicious activity" (search-extract) | https://www.cnbc.com/2026/11/17/megaspeed-investigation-nvidia-jensen-huang.html | OR (gov't statement, as reported) | M-H |
| May 2025 | Commerce investigators ask Nvidia for records of "direct or indirect sales to Megaspeed". | Joint statement, as reported | "direct or indirect sales to Megaspeed" (search-extract) | https://www.tomshardware.com/tech-industry/data-centers/us-government-confirms-criminal-investigation-into-singapore-company-at-the-heart-of-jensen-huang-scandal-megaspeed-identified-over-suspicious-activity-company-placed-on-no-sell-list-by-nvidia | OR (as reported) | M |
| June 2025 | Nvidia puts Megaspeed on its internal "no sell" list. Outlets differ on whether this was June 2025 or "a month after" the May request. | Joint statement, as reported | "no sell" | same as above | OR (as reported) | M |
| June 2025 (24 June per Singapore MHA) | BIS and Singapore police carry out an "on-site, in-person, end-use check" at Megaspeed. Then-CEO Alice Huang is interviewed. Singapore impounds her passport. DOJ later takes the lead on a **criminal** investigation of Megaspeed (handover date not given). | Joint statement; Singapore MHA (12 Nov 2026) | "on-site, in-person, end-use check" (search-extract) | https://www.cnn.com/2026/11/17/tech/doj-investigation-alice-huang ; https://www.mha.gov.sg/media-room/newsroom/singapore-investigations-into-alice-huang-huang-le-and-megaspeed-international-pte-ltd/ | OR | M-H |
| Aug 2025 | Nvidia General Counsel Tim Teter emails BIS agents on the Megaspeed case, saying BIS head Jeffrey Kessler had given permission to reach out. NYT reports some agents saw this as improper. Commerce says Kessler did not direct agents. Nvidia says the contacts were to provide information and seek guidance. | NYT (Swanson and Barrett, 9 Nov 2026) | (no verbatim email text seen) | https://www.inquirer.com/news/nation-world/nvidia-investigation-commerce-justice-ai-chinese-spy-megaspeed-jensen-huang-trump-jeff-kessler-lutnick-20261109.html | AN plus OR denials | M |
| 30 Aug 2025 | Megaspeed later says Alice Huang "officially left Megaspeed effective August 30, 2025". | Megaspeed statement (15 Nov 2026) | "Ms. Alice Huang officially left Megaspeed effective August 30, 2025 and currently has no role with the Company" (search-extract, via NPR) | https://www.cnbc.com/2026/11/15/megaspeed-alice-huang-probe-nvidia-scandal.html | OR | M-H |
| 9 Oct 2025 | NYT publishes its original Megaspeed chip-diversion investigation. The date is cited in Sen. Cotton's letter footnote; I did not see the article itself. | NYT | n/a | (cited in) https://www.cotton.senate.gov/imo/media/doc/101325lutnickletter.pdf | RP | M |
| 13 Oct 2025 | Sen. Tom Cotton writes to Commerce Sec. Lutnick asking him to investigate Megaspeed, which he calls a spin-off of the Chinese state-linked firm 7Road. | Cotton letter (primary, not fetched) | n/a | https://www.cotton.senate.gov/imo/media/doc/101325lutnickletter.pdf | PD (not opened) | M |
| "Last year" (2025) | NYT reports that US intelligence had concluded/assessed, "last year", that Alice Huang was a Chinese intelligence asset, and that Trump was briefed "about a year ago". Both claims rest on anonymous sources. | NYT 29 Oct 2026, as summarised | n/a | https://www.cnbc.com/2026/10/29/nvidia-jensen-huang-chinese-intelligence-asset.html | AN | M |
| 26 Feb 2026 | Singapore police return Alice Huang's passport. She leaves Singapore the same day. MHA later says she gave police information she knew to be inaccurate "to downplay her role", issues a warning, and bars her from re-entry. Police found "insufficient evidence" that she committed the offences under investigation. | Singapore MHA statement, 12 Nov 2026 | "insufficient evidence" (search-extract) | https://www.mha.gov.sg/media-room/newsroom/singapore-investigations-into-alice-huang-huang-le-and-megaspeed-international-pte-ltd/ ; https://mothership.sg/2026/11/mha-alice-huang-megaspeed/ | OR (gov't) | H |
| "Last spring" (2026) | Secretary of State Rubio reportedly oversaw a classified memo on Alice Huang, shared with senior officials before Trump's China trip (12–15 May 2026). | NYT and CNN, anonymous | n/a | https://www.newsweek.com/trump-jensen-huang-spy-claim-nvidia-25m-ballroom-donation-12696326 | AN | M |
| 12 May 2026 | CNN's source says Rubio briefed Trump aboard Air Force One on the Huang relationship. Trump says he was not aware ("I haven't heard that"). The White House disputed the NYT version. | CNN (1 source); ABC | "I haven't heard that" (Trump, search-extract) | https://www.cnn.com/2026/11/09/politics/trump-jensen-huang-spy | AN vs OR denial | L-M |
| 13 May 2026 | Short-seller Culper Research publishes "NVIDIA (NVDA): The China Problem". It calls the Huang–Alice Huang ties "uncomfortably close" and alleges China diversion. It makes **no** allegation of an affair or espionage. Culper held a short position. | Culper (an interested party) | "uncomfortably close" (search-extract) | https://www.cbsnews.com/news/nvidia-short-seller-culper-jensen-huang/ | CM (short seller) | M |
| 6 Oct 2026 | NVDA record close of $239.24. | Market data | n/a | https://stockinvest.us/stock-news/nvidia-down-434-at-16619-on-thursday-2026-11-12 | RP (market data) | M-H |

**Verdict on the producer's lead "investigated by the USA earlier in the year": REFUTED as worded, PARTIAL in substance.**
- No credible report says the US government investigated **Jensen Huang or Nvidia** earlier in 2026.
- What is documented:
  - US authorities (Commerce, then DOJ) had been investigating **Megaspeed**, the woman's former company, **since 2024**.
  - US officials interviewed **her** (not Jensen) in **June 2025**.
  - US intelligence reportedly held concerns about her from 2025, with a memo in spring 2026 (anonymous sourcing).
  - Singapore held her passport until **Feb 2026**.
- Safe phrasing: "US investigators had been looking at the company she ran since 2024."

### The scandal: 29 Oct 2026 to 18 Nov 2026

| Date | Event | Who / source | Exact quote (if available) | URL | Type | Conf. |
|---|---|---|---|---|---|---|
| Thu 29 Oct | **NYT first report.** Citing US officials, it says the US had concluded that a Megaspeed executive close to Huang was a Chinese intelligence asset (suspected MSS recruit). | NYT (anonymous officials) | n/a | https://www.cnbc.com/2026/10/29/nvidia-jensen-huang-chinese-intelligence-asset.html | AN | H that it was reported |
| Thu 29 Oct | **Nvidia responds**: diversion allegations "thoroughly investigated and debunked last year". It says regional cloud customers get "ordinary business information", "not sensitive Nvidia trade secrets and zero information relevant to national security". Spokesperson John Rizzo says Huang's interactions with Megaspeed officials were "not unusual or unexpected". | Nvidia (on record) | see Quotes section | https://www.cnbc.com/2026/10/29/nvidia-jensen-huang-chinese-intelligence-asset.html ; https://thehill.com/policy/technology/6181938-nvidia-huang-china-intelligence-report/ | OR | M-H |
| Thu 29 Oct | Huang tells Bloomberg that Nvidia's dealings with Megaspeed were "completely normal and not unusual". | Bloomberg via Wikipedia/AFP | "completely normal and not unusual" (search-extract) | https://www.bloomberg.com/news/articles/2026-11-09/alice-huang-suspected-china-spy-spent-years-in-nvidia-s-orbit | OR (as reported) | L-M |
| Fri 30 Oct | **WSJ** reports, citing unnamed people, that Singapore and Taiwan had separately examined her China ties and suspected Chinese intelligence had recruited her. ABC frames it as US, Singapore and Taiwan intelligence having "reason to believe" she might be a spy. | WSJ (anonymous) | n/a | https://abcnews.com/Business/timeline-stunning-fall-powerful-nvidia-ceo-jensen-huang/story?id=138041659 | AN | M |
| Fri 30 Oct | Singapore Police (SPF) reply to WSJ: "Investigations into Megaspeed are ongoing. We are unable to comment further at this juncture." SPF later publishes a clarification. | SPF | as quoted (search-extract) | https://www.police.gov.sg/media-hub/news/2026/10/20261030_clarification_statement_on_wall_street_journals_article | OR (gov't) | M-H |
| Fri 30 Oct | NVDA closes $204.64, **-4.22%**, on heavy volume (168M shares). | Market data | n/a | https://stockanalysis.com/stocks/nvda/history/ | RP | M-H |
| Fri 30 Oct (disputed; most outlets say 9 Nov) | China MFA (Guo Jiakun) calls the report "groundless speculation" and an attempt to "smear" China. | MFA | see Quotes | https://www.euronews.com/2026/10/30/china-rejects-report-of-spy-plot-targeting-nvidias-jensen-huang | OR | M |
| Sat 31 Oct | **Trump** at Mar-a-Lago: "He's a great, brilliant person, and we want to protect our brilliant people". He says he "didn't know about the specific thing" and that Washington is looking at it "very closely". | Trump (on record) | see Quotes | https://www.yahoo.com/news/politics/articles/trump-labels-jensen-huang-very-013822190.html | OR | M |
| Sat 31 Oct | **Singapore MHA** denies the WSJ claims: "neither the Singapore Government nor its officials said this. And there were no such investigations conducted in respect of Alice Huang." On 12 Nov MHA then details its Megaspeed investigation, in which she was interviewed and her passport impounded. MHA's line is that she was investigated in her Megaspeed role, **not for espionage**. Critics call this a reversal. | MHA | see Quotes | https://www.mha.gov.sg/media-room/newsroom/clarification-statement-on-wall-street-journals-article/ | OR (gov't) | M-H |
| Wed 4 Nov (public Thu 5 Nov) | Chairs Mast (Foreign Affairs), Moolenaar (China Select) and Crawford (Intelligence) write to Huang. They request a closed-door briefing on **18 Nov** and a reply by 11 Nov. The letter calls her a "publicly reported Chinese intelligence asset". | House committees (primary letter, not fetched) | see Quotes | https://foreignaffairs.house.gov/news/press-releases/chairmen-mast-moolenaar-and-crawford-request-jensen-huang-brief-congress-on-link-to-chinese-intelligence-asset ; https://chinaselectcommittee.house.gov/media/letters/nvidia-letter-mr-jensen-huang-ceo | PD / OR | M-H |
| Thu 5 Nov | NVDA **-9.3%** in a broad AI-chip and market sell-off (S&P 500 -4.4%), **not** attributed to the scandal. | Motley Fool / market data | n/a | https://www.fool.com/investing/2026/11/10/why-nvidia-stock-just-fell-again/ | RP | M |
| Thu 5 Nov | Bessent reportedly confronts Lutnick in the White House Situation Room over why Megaspeed was not on the Entity List. Lutnick reportedly says "I don't know." Reported by Axios (11 Nov) and the NYT. | Axios / NYT (anonymous) | n/a | https://www.axios.com/2026/11/11/bessent-lutnick-megaspeed-nvidia-china-chips | AN | M |
| **Sun 8 Nov** | **Huang email to staff, "A Message to Our Company"**, posted on the Nvidia newsroom: "I was unfaithful to my wife." | Huang (on record) | see Quotes | https://nvidianews.nvidia.com/news/a-message-to-our-company ; https://www.axios.com/2026/11/08/nvidia-ceo-jensen-huang-affair-email-to-company | OR | H |
| **Sun 8 Nov** | **Board statement**: an independent investigation "in light of recent reporting" that Huang was "the target of a foreign intelligence effort". A committee of independent directors with outside counsel will run it. The board has "no reason to believe" national security or Nvidia secrets were compromised. Nvidia says Huang "is committed to continuing to lead NVIDIA as CEO without interruption". | Nvidia board | see Quotes | https://investor.nvidia.com/news/press-release-details/2026/Statement-from-NVIDIA-Board-of-Directors/default.aspx ; https://www.globenewswire.com/news-release/2026/11/08/3398017/0/en/statement-from-nvidia-board-of-directors.html | OR (press release) | H for existence, M for exact wording |
| Mon 9 Nov | **Trump** says he phoned Huang: "I had no idea that she was a spy" (relaying Huang) and "I really believe him". Also: "I know the FBI is looking into it in terms of something else, and I think that he'll be in good shape." The FBI declined comment. | Trump, White House | see Quotes | https://www.cnbc.com/2026/11/09/trump-jensen-huang-nvidia-chinese-spy.html ; https://www.nbcnews.com/business/corporations/trump-fbi-probe-nvidia-jensen-huang-spy-rcna608439 | OR | H |
| Mon 9 Nov | China MFA (Guo Jiakun) at the regular briefing: claim is "completely groundless" and "pure slander" / "nothing but a smear against China". | MFA | see Quotes | https://www.globaltimes.cn/page/202611/1373945.shtml | OR | M-H |
| Mon 9 Nov | **NYT**: a Commerce chip inquiry into Megaspeed "was halted after Nvidia intervention". The case moved to DOJ. | NYT (Swanson, Barrett; anonymous plus documents) | headline | https://tech.slashdot.org/story/26/11/09/1758238/commerce-dept-chip-inquiry-was-halted-after-nvidia-intervention | AN | M |
| Mon 9 Nov | **Shareholder class action** *Kistenmacher v. NVIDIA Corp.* filed in N.D. Cal. (San Jose). Class period 9 Oct 2025 to 8 Nov 2026; Rule 10b-5. | Court filing (not seen) | n/a | https://www.pbs.org/newshour/world/nvidia-and-huang-face-lawsuit-alleging-investors-were-misled-about-spy-affair | PD (via reports) | M-H |
| Mon 9 Nov | NVDA closes $178.67, **-4.27%** (intraday low as much as -8.8%). About $190–192B of market value lost that day. | CNBC / CNN / market data | n/a | https://www.cnn.com/2026/11/09/investing/nvidia-stock-huang-investigation | RP | H |
| Tue 10 Nov | *The Information* reports that Megaspeed and its Malaysian subsidiary moved at least **$7.5B** of Nvidia chips to Chinese firms over about two years. Reuters could not verify this. NVDA **-5.47%** to $168.89. | The Information (anonymous) | n/a | https://www.cnbc.com/2026/11/10/nvidia-nvda-jensen-huang-affair-chinese-spy.html | AN | M |
| ~10–11 Nov | Taiwan Interior Minister Liu Shyh-fang says her Taiwan entry permit has been revoked and that she is abroad. | Taiwan gov't | n/a | https://www.taipeitimes.com/News/taiwan/archives/2026/11/11/2003867565 | OR (gov't) | M |
| Wed 11 Nov | **NYT**: Huang had a separate relationship with a senior Nvidia executive who reported to him. Sourced to five people who worked at the company. Neither Nvidia nor the executive commented. | NYT (anonymous) | n/a | https://techcrunch.com/2026/11/11/jensen-huang-accused-of-having-another-affair-with-a-nvidia-exec/ | AN | M (reported, not confirmed) |
| Wed 11 Nov (evening) | **WSJ**: the board is preparing to oust Huang. | WSJ (anonymous) | n/a | https://abcnews.com/US/nvidia-board-reportedly-preparing-oust-ceo-jensen-huang/story?id=138062059 | AN | M-H |
| **Wed 11 Nov** | **Board accepts Huang's resignation**, effective immediately. Kress becomes interim CEO and Jones becomes Chair (date per the 8-K). | 8-K Item 5.02 | see Quotes | https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvda-20261111.htm | PD | **H (read)** |
| **Thu 12 Nov** | **8-K filed and press release issued**: "NVIDIA Announces CEO Transition". Jones is "first-ever Chair". The release gives no reason for the resignation. | Nvidia | see Quotes | https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm | PD | **H (read)** |
| Thu 12 Nov | NVDA closes $166.19, **-4.34%** (range about $148.80–167.14). Market cap about $4.0T. | Market data | n/a | https://stockinvest.us/stock-news/nvidia-down-434-at-16619-on-thursday-2026-11-12 | RP | M-H |
| Thu 12 Nov | **AG Todd Blanche**: "There's no conclusions reached by the Department of Justice or by me or by (FBI) Director (Kash) Patel around who she is or is not." He confirms investigators "are looking at it". | Blanche (on record) | see Quotes | https://www.theepochtimes.com/us/blanche-says-doj-has-not-confirmed-if-ex-nvidia-ceos-affair-partner-was-a-spy-6124473 ; https://www.rawstory.com/nvidia-2678383524/ | OR | M-H |
| Thu 12 Nov | **House chairs' second letter** (some outlets date it 11 Nov). It asks for a transcribed interview in place of the 18 Nov briefing and warns of a subpoena, with a deadline of 8 p.m. on 13 Nov. Parallel letters go to GC Tim Teter and to Commerce Under Secretary Kessler. | House committees | see Quotes | https://www.cbsnews.com/news/house-republicans-nvidia-jensen-huang-testimony/ | PD / OR | M-H |
| Thu 12 Nov | **Singapore MHA** details its Megaspeed probe: she was interviewed on 24 June 2025, her passport was impounded and then returned on 26 Feb 2026, and she is barred from re-entry. There was "insufficient evidence" of offences. SPF's probe of Megaspeed and six others is ongoing. | MHA | n/a | https://mothership.sg/2026/11/mha-alice-huang-megaspeed/ | OR (gov't) | H |
| Thu 12 Nov | **Bloomberg**, citing people familiar: she is living in **Beijing** and security officials know where she is. China MFA (Mao Ning) denies knowing her whereabouts. | Bloomberg (anonymous); MFA | n/a | https://www.yahoo.com/news/us/articles/alice-huang-alleged-spy-centre-123206896.html ; https://www.breitbart.com/tech/2026/11/13/china-insists-it-has-no-role-in-jensen-huang-affair-scolds-u-s-for-fabricating-spy-reports/ | AN / OR | M |
| Thu 12 Nov | **CNN**: US intelligence is not sure she spied, though that "doesn't mean she wasn't a risk". Officials disagree on the strength of the evidence. | CNN (anonymous) | n/a | https://www.cnn.com/2026/11/12/politics/alice-huang-us-intel-jensen-huang-nvidia | AN | M |
| Thu 12 Nov | Sen. Wyden and Rep. Neal write to Lutnick, citing the NYT intervention report. | Congress letter | n/a | https://democrats-waysandmeans.house.gov/sites/evo-subsites/democrats-waysandmeans.house.gov/files/evo-media-document/wyden-neal-nvidia-letter.pdf | PD (not opened) | M |
| Thu 12 Nov | NPR explainer by Frank Langfitt: "What's a honey trap?" | NPR | n/a | https://www.npr.org/2026/11/12/nx-s1-6039266/jensen-huang-china-honey-trap-nvidia-spies-sex-alice-huang | CM / explainer | H |
| 12–13 Nov | **Reuters exclusive**: Huang had an intimate relationship with a **second employee**, which makes her the **third woman reported overall**. The report cites two people familiar. The employee is unnamed and Nvidia declined to comment. | Reuters (anonymous) | "according to two people familiar with the matter" | https://www.bnnbloomberg.ca/business/artificial-intelligence/2026/11/13/reuters-exclusive-former-nvidia-ceo-huang-had-a-relationship-with-a-second-employee-sources-say/ | AN | M |
| Fri 13 Nov | **Malaysia** (trade ministry MITI plus Customs) is investigating whether chips imported for **Speedmatrix**, Megaspeed's Malaysian affiliate, were re-exported. MITI says it "never cleared" either firm and has found no wrongdoing so far. | MITI | n/a | https://www.malaymail.com/news/malaysia/2026/11/13/miti-says-it-never-cleared-megaspeed-speedmatrix-as-malaysia-probes-possible-chip-re-exports/243065 | OR (gov't) | H |
| Fri 13 Nov | **Bessent on CNBC**: Treasury, War, State and USTR had favoured putting Megaspeed on the Entity List, but "Commerce has the pen". NVDA closes $162.85 (-2.01%), its 6th straight weekly loss, with about $1.6T off the peak. | Bessent; CNBC | "Commerce has the pen" | https://www.cnbc.com/video/2026/11/13/treasury-secretary-bessent-on-if-any-nvidia-chips-went-to-china-through-megaspeed.html ; https://www.cnbc.com/2026/11/13/nvidia-stock-jensen-affair-ai.html | OR | M-H |
| Sun 15 Nov | **Bessent on Fox, *Sunday Morning Futures***: calls for a "dramatic shakeup" and an outside CEO. Says that if Nvidia were a bank, "a lot of the executives would be removed". Asks whether it made "seemingly illicit sales to goose their revenues and their earnings". | Bessent | see Quotes | https://www.cnbc.com/2026/11/15/bessent-nvidia-ceo-lutnick-megaspeed.html | OR | M |
| Sun 15 Nov | **Megaspeed statement**: she left on 30 Aug 2025; the company has hired outside counsel for an internal investigation; it "conducts legitimate and lawful business". | Megaspeed | see Quotes | https://www.cnbc.com/2026/11/15/megaspeed-alice-huang-probe-nvidia-scandal.html | OR | H |
| Mon 16 Nov | **Trump**: "I don't know that she is a spy" and "nobody's proven that she's a spy". Says the affair did not threaten national security and that he is open to Huang returning. | Trump | see Quotes | https://techcrunch.com/2026/11/16/trump-says-ex-nvidia-ceo-jensen-huangs-affair-with-an-alleged-chinese-spy-did-not-threaten-national-security/ ; https://www.cnbc.com/2026/11/16/trump-lutnick-nvidia-national-security-jensen-huant.html | OR | H |
| Mon 16 Nov | CNBC (one source): the board is not considering bringing Huang back. NVDA closes $156.14 (-4.12%). | CNBC (anonymous) | n/a | https://www.cnbc.com/2026/11/16/nvidia-ceo-jensen-huang.html | AN | M |
| 16 or 17 Nov (outlets differ) | **Joint Commerce–DOJ statement** on Megaspeed. It confirms the 2024 start and that DOJ leads a **criminal** investigation. It notes 17 defendants have been charged across six chip investigations generally (none named as Megaspeed). | Commerce + DOJ | see Quotes | https://www.washingtontimes.com/news/2026/nov/17/megaspeed-probe-began-2024-commerce-justice-departments-say/ | OR (gov't, text not seen) | M-H |
| Tue 17 Nov | **WSJ**: the SEC has opened a civil investigation, including into whether Nvidia's disclosures misled investors. Not confirmed by the SEC or Nvidia. | WSJ (anonymous) | n/a | https://finance.yahoo.com/markets/stocks/articles/sec-reportedly-investigating-nvidia-amid-214807179.html | AN | M |
| Tue 17 Nov | **House chairs**: Huang has agreed to a voluntary, closed-door, transcribed interview on **1 Dec**. GC Tim Teter follows on **2 Dec**. | House committees joint statement | see Quotes | https://www.axios.com/2026/11/17/nvidia-jensen-huang-congress-testify-dates ; https://www.cnbc.com/2026/11/17/nvidia-jensen-huang-house-committee.html | OR | H |
| Tue 17 Nov | **Huang on X**, his first statement since resigning: he would be "honored" to return if the board decides it serves shareholders, employees, the company and America. He says he "created problems for the Board that I deeply regret". | Huang | see Quotes | https://www.cnn.com/2026/11/17/business/jensen-huang-nvidia-ceo-statement | OR | H |
| Tue 17 Nov | **Q3 FY27 results**: revenue $115.8B (+103% y/y). Board chair Jones on the call says Huang "voluntarily resigned" after disclosing "personal behavior inconsistent with the company's code of conduct, standards and cultural norms". He adds: "The Nvidia board unanimously accepted his resignation and does not intend to reinstate Jensen as CEO." Nvidia's earnings release refers to "the ongoing investigation by an independent committee of NVIDIA's board of directors" and to "government and regulatory inquiries". | Nvidia filing; Jones on call | see Quotes | https://www.sec.gov/Archives/edgar/data/1045810/000104581026000088/q3fy27pr.htm ; https://www.npr.org/2026/11/17/nx-s1-6044213/jensen-huang-nvidia-congress | PD + OR | H |
| Tue 17 Nov | NVDA closes $155.46 (-0.44%) before results, then rises about 1–4% after hours (reports differ). | Market data | n/a | https://www.fool.com/coverage/stock-market-today/2026/11/17/stock-market-today-nov-17-nvidia-slides-ahead-of-earnings-but-soars-in-after-hours-trading/ | RP | M |
| Wed 18 Nov (today) | The date originally requested for the House briefing. It was superseded by the 1 Dec interview. No 18 Nov close was available when this file was written. | n/a | n/a | n/a | n/a | n/a |

---

## 2. VERBATIM QUOTES

Status codes:
- **[PD-read]**: I read it myself in the primary document.
- **[SE]**: seen only in search extracts that quote the outlet named. Check against the original before broadcast.

### 8-K, Item 5.02 (filed 12 Nov 2026) [PD-read]
> "On November 11, 2026, the Board of Directors, or the Board, of NVIDIA Corporation accepted the resignation of Jen-Hsun Huang, as NVIDIA's President, Chief Executive Officer and member of the Board, effective immediately. Following Mr. Huang's resignation, the Board appointed NVIDIA's Executive Vice President and Chief Financial Officer Colette M. Kress, age 59, to serve as interim Chief Executive Officer, while the Board conducts a search for a new Chief Executive Officer."

> "On November 11, 2026, the Board appointed Harvey C. Jones, age 73, as Chair of the Board. Mr. Jones has served on the Board since 1993."

- The 8-K gives **no reason** for the resignation and does not mention the investigation.
- It is signed by Colette M. Kress as Interim CEO, EVP and CFO, dated 12 Nov 2026.

### Ex. 99.1 press release, "NVIDIA Announces CEO Transition" (12 Nov 2026) [PD-read]
> "NVIDIA (NASDAQ: NVDA) Board of Directors announced today that Jensen Huang has resigned as President, Chief Executive Officer, and a member of the Board, effective immediately."

> Harvey Jones: "The Board has full confidence in Colette and the leadership team, and we expect the company's operations, customer commitments and product roadmap to continue without interruption."

> Colette Kress: "I am committed to building on the extraordinary foundation Jensen created over the last 33 years."

> "The Board and the company thank Jensen for his immeasurable contributions to the company and the industry."

### Q3 FY27 earnings release, 17 Nov 2026 (Ex. 99.1 to 8-K 0001045810-26-000088) [PD-read]
> Forward-looking statements cover "expectations with respect to the ongoing investigation by an independent committee of NVIDIA's board of directors and related matters; expectations with respect to litigation, government and regulatory inquiries and other actions or proceedings".

> Risk factor: "the scope, timing and outcome of investigations, litigation and government and regulatory actions and proceedings".

> Kress: "Our momentum is real."

> "NVIDIA is not assuming any Data Center compute revenue from China in its outlook."

> CFO commentary: "Shipments of Data Center Hopper products to China during the quarter were $2.4 billion."

### Huang email to staff, "A Message to Our Company", 8 Nov 2026 [SE]
> "I owe my family and all of you an apology. I was unfaithful to my wife."

> "My actions hurt her and our children."

> "There is no excuse for what I did."

> "I am deeply sorry."

> "NVIDIA's Board of Directors has initiated an independent investigation. I support the investigation and will cooperate fully."

- Source: https://nvidianews.nvidia.com/news/a-message-to-our-company, also reproduced by Axios.
- The email does **not** name the woman. Exact sentence order is unverified.

### Nvidia Board statement, 8 Nov 2026 [SE]
> "in light of recent reporting that founder and CEO Jensen Huang has been the target of a foreign intelligence effort"

This is the producer's lead wording. The search extract shows "reporting that he was a target of a foreign intelligence effort" and the CBC headline uses the phrase; the exact sentence needs checking.

> "While the Board has no reason to believe that either national security or NVIDIA secrets were compromised, the Board's inquiry will examine all available information."

Paraphrase, not verbatim: a committee of independent directors, assisted by outside independent counsel, will oversee the investigation. Huang "fully supports the review and has committed to cooperating with it."

Company line to CNBC: "Jensen is committed to continuing to lead NVIDIA as CEO without interruption."

### Nvidia denials that information was shared (29 Oct 2026) [SE]
> "Meetings with customers are part of a CEO's job; Jensen talks with thousands of customer executives every year."

> Regional cloud customers receive "ordinary business information", "not sensitive Nvidia trade secrets and zero information relevant to national security."

> Diversion allegations were "thoroughly investigated and debunked last year."

> Spokesperson John Rizzo: Huang's interactions with Megaspeed officials are "not unusual or unexpected."

- The phrase "no sensitive information was shared" is a **media paraphrase**, not Nvidia's words.
- After 8 Nov, the board's wording narrowed to "no reason to believe".

### Trump [SE]
- **31 Oct**:
  > "He's a great, brilliant person, and we want to protect our brilliant people."

  > "I've always found Jensen Huang to be very aboveboard."

  He said he "didn't know about the specific thing". The US is looking "very closely".
- **9 Nov**, relaying the call with Huang:
  > "I had no idea that she was a spy"

  > "I really believe him."

  > "I know the FBI is looking into it in terms of something else, and I think that he'll be in good shape."

  The "in terms of something else" qualifier matters: do **not** shorten it to "the FBI is investigating Huang".

  > "It didn't have much effect on me." (on the briefing question)

- **16 Nov**:
  > "I don't know that she is a spy."

  > "nobody's proven that she's a spy."

  He also said the affair "probably shouldn't have" happened. On whether it has been determined: "I don't know if that's been determined yet."

### AG Todd Blanche, 12 Nov [SE]
> "There's no conclusions reached by the Department of Justice or by me or by (FBI) Director (Kash) Patel around who she is or is not."

> "Well, your first question assumes something that I have never said, and that I don't know to be true."

> "I have not, nobody said that, I certainly haven't said that. All I said … is that of course DOJ's investigators are looking at it."

### China Ministry of Foreign Affairs [SE]
- **Guo Jiakun, 9 Nov** (some sources say 30 Oct):
  > "The claim regarding a so-called Chinese spy is completely groundless and pure slander." (ABC)

  > "completely groundless and is nothing but a smear against China" (Global Times)

  CNN version: "purely groundless speculation and an attempt to smear and malign China".

  NPR version: "nothing but smears against China."

  The wordings vary by translation. Use **one** and attribute it to the outlet.
- **Mao Ning, 12 Nov** (paraphrase): the US should stop fabricating "Chinese spy" narratives as a pretext for technology restrictions. She denied knowledge of the woman's whereabouts.

### House committees (Mast, Foreign Affairs; Moolenaar, China Select; Crawford, Intelligence) [SE]
- **4 Nov letter**: calls her a "publicly reported Chinese intelligence asset". It requested an in-person closed-door briefing on 18 Nov. Paraphrase: recent reports raise "significant national security concerns" about China's access to sensitive US technology.
- **12 Nov release and letter**:
  > "As reports continue to come to light regarding Jensen Huang, NVIDIA, and MegaSpeed, there are clear national security concerns that need to be addressed immediately."

  > "failure to cooperate with this request will result in the House Foreign Affairs Committee issuing a subpoena to compel your testimony in a format of the committee's choosing."

  The deadline was 8 p.m. on 13 Nov. Subjects listed: AI chip smuggling, adversary military use of Nvidia products, and "recent public reports regarding Nvidia's interference in U.S. export control policies and investigations, including those involving MegaSpeed."
- **17 Nov joint statement**:
  > "We look forward to hearing from Jensen Huang and Tim Teter on their roles in a potential breach of our national security."

  The interviews are voluntary, closed-door and transcribed: **Huang on 1 Dec 2026, Teter on 2 Dec 2026.**

### Board chair Harvey Jones, earnings call, 17 Nov [SE]
> Huang "voluntarily resigned" after disclosing "personal behavior inconsistent with the company's code of conduct, standards and cultural norms."

> "The Nvidia board unanimously accepted his resignation and does not intend to reinstate Jensen as CEO."

He declined to discuss "the circumstances of Jensen's resignation and the ongoing investigation."

### Huang on X, 17 Nov [SE]
> "Since my departure, I've seen an outpouring of calls from Nvidia's employees, investors, business partners, and customers for me to return as CEO."

He also said he would "be honored" to return if the board decides it serves shareholders, employees, the company and America, and that he "created problems for the Board that I deeply regret". The Forbes piece carries the full text.

### Bessent [SE; Fox has no official transcript]
- 13 Nov, CNBC:
  > "Commerce has the pen."

  > "a lot of leakage in the system."
- 15 Nov, Fox *Sunday Morning Futures*:
  > "dramatic shakeup"

  > "seemingly illicit sales to goose their revenues and their earnings" (posed as a question)

  If Nvidia were a bank, "a lot of the executives would be removed".

  On whether she is a spy: Fortune paraphrases him as saying it "doesn't matter".

### Singapore government [SE]
- MHA, 31 Oct:
  > "We would like to make clear that neither the Singapore Government nor its officials said this. And there were no such investigations conducted in respect of Alice Huang."
- SPF reply to WSJ, 30 Oct:
  > "Investigations into Megaspeed are ongoing. We are unable to comment further at this juncture."

### Megaspeed, 15 Nov [SE]
> "Ms. Alice Huang officially left Megaspeed effective August 30, 2025 and currently has no role with the Company."

> It "conducts legitimate and lawful business" and has "retained external legal counsel to conduct a thorough internal investigation".

### Commerce–DOJ joint statement [SE]
> "Following this enforcement action, the Department of Justice took the lead role in the criminal investigation of Megaspeed."

> Commerce began investigating in 2024 after "suspicious activity" was detected.

---

## 3. STATUS OF THE WOMAN

**do-not-name-in-script:** Alice Huang (Chinese name 黄乐 / Huang Le, per the Singapore MHA statement title). She is no relation to Jensen Huang. She is reported to be a Chinese national and Hong Kong resident, and a former TV reporter and finance executive. Also do not name the Nvidia executive in the NYT 11 Nov report (named by NYT and others) or the Reuters employee (unnamed).

| Question | Answer | Source / confidence |
|---|---|---|
| Questioned? | **Yes, but in 2025 and in a chip-export context, not on espionage.** Singapore police interviewed her on 24 June 2025 in the Megaspeed probe. US BIS agents interviewed her in the same June 2025 on-site end-use check. MHA says she was **not investigated for espionage**. No report says she has been questioned since the scandal broke on 29 Oct 2026. | MHA 12 Nov; Commerce–DOJ statement; CNN 17 Nov. H |
| Detained? | **No report of detention.** Singapore impounded her **passport** (June 2025 to 26 Feb 2026) to secure her attendance. That is not detention. | MHA. H |
| Charged? | **No.** No charges in any country. Singapore found "insufficient evidence" that she committed the offences under investigation, and issued a warning for giving inaccurate information. DOJ and FBI say they have reached no conclusion on whether she is a spy. | MHA; Blanche 12 Nov. H |
| Statement? | **None found.** She has not publicly commented, and no lawyer statement has been found. | Multiple. M-H |
| Located? | **Reportedly in Beijing** (Bloomberg, 12 Nov, anonymous). Not officially confirmed. China's MFA says it does not know her whereabouts. She left Singapore on 26 Feb 2026 (MHA). One unconfirmed source says she went to Shanghai. Taiwan revoked her entry permit. Singapore barred her re-entry. | Bloomberg; MHA; Taipei Times. M |
| Megaspeed role | Megaspeed says she left on 30 Aug 2025. She was earlier described as CEO / chair / "key controller" (MHA) and as managing director until 2023 (Fortune extract). Short-seller Culper cites an employee saying she was still "our boss" (unverified, interested party). | M |

**What Megaspeed is and why it matters**
- Megaspeed International Pte Ltd is a Singapore data-centre and cloud company. Reporting says it began as an offshoot of the Chinese gaming firm 7Road (Sen. Cotton calls 7Road state-linked). Its Malaysian affiliate is Speedmatrix Sdn Bhd.
- It became one of Nvidia's largest Southeast Asian customers. Reported purchases:
  - about $4.6B and 136,000 GPUs per Malaysian and Indonesian customs data;
  - nearly $5B over three years;
  - $2.9B of servers within about a year (Culper).
- Reported diversion figures:
  - at least $7.5B moved to China (The Information, unverified);
  - "nearly $12B" (WSJ, as summarised).
- Why it matters:
  1. US export controls bar top Nvidia chips from China, and Megaspeed has been under US investigation since 2024 for possible diversion. It is now a **DOJ criminal probe**.
  2. Nvidia blocked sales to it in June 2025, but the NYT reports that shipments to its Malaysian affiliate continued for about eight months after that. Nvidia says Commerce allowed repair parts.
  3. The NYT reports that Nvidia's GC contacted BIS agents about the case, and the inquiry was then halted or transferred.
  4. Commerce never put it on the Entity List despite pressure from other agencies. This fed the Bessent–Lutnick clash.
  5. The shareholder suit and the reported SEC inquiry centre on disclosure of these ties.
- **Megaspeed denies all wrongdoing.**

---

## 4. MARKET REACTION

NVDA daily closes, from stockanalysis.com / Yahoo history via search extracts. **Verify against an exchange source before putting them on screen.**

| Date | Close | Day % | Note |
|---|---|---|---|
| 6 Oct | $239.24 | n/a | Record close |
| 28 Oct | $215.38 | -1.17% | Last close before the NYT report |
| 29 Oct | $213.66 | -0.80% | NYT report day |
| 30 Oct | $204.64 | -4.22% | WSJ follow-up; heavy volume |
| 4 Nov | $200.13 | n/a | n/a |
| 5 Nov | about $181.5 | -9.3% | **Market-wide AI and chip sell-off** (S&P -4.4%), not scandal-specific |
| 6 Nov | $186.64 | n/a | n/a |
| 9 Nov | $178.67 | -4.27% | First session after the affair admission; about $190–192B wiped |
| 10 Nov | $168.89 | -5.47% | The Information $7.5B report; briefly under $4T intraday |
| 11 Nov | $173.73 | about +2.9% | n/a |
| 12 Nov | $166.19 | -4.34% | Resignation; market cap about $4.0T |
| 13 Nov | $162.85 | -2.01% | 6th straight weekly loss; about $1.6T off the peak (CNBC) |
| 16 Nov | $156.14 | -4.12% | About -35% from the record |
| 17 Nov | $155.46 | -0.44% | Results after the close; +1% to +4% after hours (reports differ); market cap about $3.8T |

**Desk arithmetic** (my calculation, not a quoted figure): from 28 Oct ($215.38) to 17 Nov ($155.46) is **-27.8%**. AFP says "around 28 percent since the scandal began". **Caveats:**
- The stock was already about 10% off its October peak before the story broke.
- The 5 Nov drop (-9.3%) was a broad market sell-off.
- So the whole decline must **not** be attributed to the scandal.

The various "$ wiped" figures ($450B per Reuters; $1.5T or $1.6T from the October peak; $190B on 9 Nov) all use different baselines. Always state the baseline.

**Analyst and investor commentary** (label it as commentary):
- Dan Ives (Wedbush / Yorkville Ives, outlets differ) said before the resignation that Huang had about an 85% chance of staying. He later said an ouster could cut 25–30% of value (Moneywise, 24/7 Wall St).
- Analysts did not press on China or Singapore on the 17 Nov call (Fortune).
- Commentary says the market is pricing both Nvidia without its founder and a permanent China closure.
- A petition to reinstate Huang reportedly has 158,000 to more than 190,000 signatures, with Elon Musk among them (AFP; Mac Observer). The figures vary.

---

## 5. LAWSUITS AND INVESTIGATIONS

| # | Body | Target | What | Status (18 Nov) | Source type | Conf. |
|---|---|---|---|---|---|---|
| 1 | Nvidia board: independent committee with outside counsel | Huang / foreign-intelligence targeting | Internal investigation opened 8 Nov | **Ongoing**. Confirmed in the 17 Nov earnings release (primary). | PD / OR | H |
| 2 | N.D. Cal., *Kistenmacher v. NVIDIA Corp.* (case no. 5:26-cv-13488 is unverified) | Nvidia, Huang | Proposed securities class action, 10b-5. Class period 9 Oct 2025 to 8 Nov 2026. | Filed 9 Nov. No class certified and no response reported. | PD via reports | M-H |
| 3 | DOJ (criminal) | **Megaspeed** | Possible export-control violations | Ongoing and confirmed by the joint statement. **No charges.** | OR | H |
| 4 | Commerce / BIS | Megaspeed | Export-control probe since 2024. Not on the Entity List. | Ongoing. DOJ has the lead on the criminal side. | OR | H |
| 5 | FBI / DOJ | Alice Huang (counter-intelligence question) | Whether she is a spy | "No conclusions" (Blanche, 12 Nov). FBI declined comment. | OR | H |
| 6 | SEC (civil) | Nvidia disclosures | Whether investors were misled | **Reported only** (WSJ, 17 Nov). Not confirmed. | AN | M |
| 7 | House Foreign Affairs, Intelligence and China Select Committees | Huang, Teter; letter also to Commerce's Kessler | Megaspeed, smuggling, alleged interference | Voluntary transcribed interviews **1 Dec (Huang)** and **2 Dec (Teter)**. A subpoena was threatened but not issued. | OR | H |
| 8 | Singapore Police / MHA | Megaspeed plus 6 individuals | Possible false declarations (Supermicro server purchases) | Ongoing. She was not charged, was warned, and is barred from re-entry. | OR | H |
| 9 | Malaysia MITI + Customs | Speedmatrix (Megaspeed affiliate) | Possible re-export of AI chips | Opened about 13 Nov. No wrongdoing found yet. | OR | H |
| 10 | Taiwan | Alice Huang | Entry permit revoked | Done (about 10–11 Nov) | OR | M |
| 11 | Commerce investigating **Nvidia** itself (producer's lead) | n/a | n/a | **Not confirmed.** Commerce is confirmed investigating **Megaspeed**, and Commerce's own conduct is under scrutiny. | n/a | L |
| 12 | Congressional letters: Cotton (13 Oct 2025); Wyden and Neal (12 Nov); Warren; Meeks and others | Commerce / Lutnick | Oversight | Letters sent | PD | M |

---

## 6. CONTRADICTIONS AND OPEN QUESTIONS

**Contradictions with the producer's leads**
1. **"Investigated by the USA earlier in the year"**: not supported for Jensen Huang or Nvidia. The probe was of **Megaspeed**, since 2024. She was interviewed in June 2025.
2. **"Reuters: relationship with a second employee"**: correct, but this is the **third** woman reported overall, after Alice Huang and the executive in the NYT 11 Nov report. The Reuters story is dated 12–13 Nov depending on the outlet.
3. **"Three House committees summoned Huang"**: overstated. The letters were *requests*, with a subpoena threatened. Huang **agreed voluntarily** to a closed-door transcribed interview on 1 Dec. It is not a subpoena or a public hearing.
4. **"Bessent accused Nvidia of knowingly selling chips to China"**: not supported verbatim. He *asked* whether Nvidia used "seemingly illicit sales to goose their revenues". He blamed Commerce for not listing Megaspeed, and stopped short of confirming specific shipments.
5. **"Trump said FBI is looking into it"**: true, but the full quote is "in terms of something else". This is not confirmation that the FBI is investigating Huang.
6. **"Commerce reportedly investigating"**: Commerce is investigating **Megaspeed**, which is confirmed. I found no report that it is investigating Nvidia itself.
7. **"Nvidia denied sensitive information was shared"**: the 29 Oct wording was "zero information relevant to national security". The 8 Nov board wording is weaker: "no reason to believe … compromised".
8. **8-K date vs announcement**: the board accepted the resignation on **11 Nov**, but it was announced and filed on **12 Nov**. The chair says "voluntarily resigned", while the WSJ reported the board was preparing to oust him. Both can be true, but say "resigned".
9. **WSJ (30 Oct) vs Singapore**: MHA denied that its officials made the WSJ's claims and said there were "no such investigations" of her (31 Oct). It then detailed a 2025 police interview and passport impoundment (12 Nov), framed as a Megaspeed probe and "not for espionage". Taiwan's view of the WSJ claim has not been found.
10. **When Trump was briefed**: the NYT says "about a year ago", CNN's source says May 2026 on Air Force One, and Trump denies knowing. Unresolved.
11. **China MFA "groundless" date**: Wikipedia says 30 Oct; most outlets say 9 Nov. Translations differ.
12. **Joint Commerce–DOJ statement date**: 16 or 17 Nov.
13. **NPR's line** "a woman the U.S. says is a Chinese spy" is **stronger than the official record**. DOJ says it has no conclusion, and Trump doubts it.

**Unknowns (do not fill these gaps in narration)**
- Whether she is or was an intelligence officer or asset. There is no official finding.
- Whether any Nvidia information was passed. No evidence has been made public.
- What the board's investigation has found, and its scope and timetable.
- The terms of Huang's departure: severance, equity, any agreement. Not in the 8-K. Watch for an 8-K/A or the 10-Q.
- Whether the SEC inquiry exists (WSJ only) and its scope.
- Whether any Megaspeed-related charges are coming.
- The actual volume of Nvidia chips diverted. Figures range from $4.6B in imports to $7.5B or $12B allegedly diverted, all unverified.
- Whether the 1 Dec interview goes ahead, and what follows it.
- Why Commerce never listed Megaspeed, and the full facts of Nvidia's contact with BIS.
- The exact wording of the board statement and Huang's email against the originals.

---

## SAFE TO SAY IN NARRATION

All of the following are attributed and hedged.
1. "On November 12, Nvidia announced that Jensen Huang had resigned as president, CEO and director, effective immediately. Its SEC filing says the board accepted the resignation the day before."
2. "CFO Colette Kress became interim CEO, and longtime director Harvey Jones became the board's first-ever chair."
3. "Four days earlier, in an email to staff, Huang admitted, in his words, 'I was unfaithful to my wife.'"
4. "The same day, Nvidia's board opened an independent investigation after reports that Huang had been the target of a foreign intelligence effort. The board said it had 'no reason to believe' national security or company secrets were compromised."
5. "The New York Times, citing US officials, reported that American intelligence suspected a businesswoman close to Huang of working for Chinese intelligence."
6. "No government has publicly concluded that she is a spy. The Attorney General said the Justice Department had reached 'no conclusions'. President Trump said: 'nobody's proven that she's a spy.'"
7. "China's foreign ministry called the claim 'completely groundless'."
8. "She has not been charged anywhere and has not commented publicly. Bloomberg reports she is living in Beijing."
9. "US authorities have been investigating the Singapore company she used to help run, Megaspeed, since 2024, over whether Nvidia chips were diverted to China. It is now a Justice Department criminal investigation. Megaspeed denies wrongdoing."
10. "Nvidia says it stopped selling to Megaspeed in mid-2025."
11. "A shareholder has filed a proposed class action alleging investors were misled. Those are allegations, not findings."
12. "The Wall Street Journal reports the SEC has opened a civil inquiry."
13. "Huang has agreed to a closed-door interview with three House committees on December 1."
14. "Huang says he would be 'honored' to return. The board says it does 'not intend to reinstate' him."
15. "Nvidia shares fell roughly 28% between the first report and earnings day, a slide that also included a broad market sell-off."
16. "Reports, which Nvidia has not confirmed, say Huang also had relationships with two Nvidia employees."

## DO NOT SAY
- That she "is" or "was" a Chinese spy, agent, asset, or "the spy". Always use "suspected" or "alleged", with attribution to the outlet and the anonymous officials.
- Her name, or the names of either Nvidia employee (see the do-not-name field).
- "Honey trap" as a statement of fact. Only say it as a question or concept, citing NPR's explainer.
- That Huang shared secrets, compromised national security, or knew of any intelligence link.
- That Huang was "fired" or "ousted" as fact. Say he "resigned" (8-K), and if needed that the WSJ reported the board was preparing to remove him.
- "The FBI is investigating Jensen Huang." Trump said "in terms of something else".
- "The US investigated Huang earlier this year." The investigation was of Megaspeed, since 2024.
- "Congress subpoenaed Huang" or "Huang will testify publicly." It is a voluntary closed-door interview.
- "Bessent accused Nvidia of knowingly selling chips to China." He asked a question.
- "Nvidia smuggled" or "Nvidia illegally sold" chips. Nvidia has not been charged.
- That the SEC is "suing" Nvidia, or any confirmed SEC action. The inquiry is WSJ-reported only.
- That Nvidia "lost $X trillion because of the scandal" without stating the baseline and noting the market-wide selloff.
- That Singapore "investigated her for espionage." MHA says it did not.
- That she "fled". She left Singapore after her passport was lawfully returned.
- That the Commerce inquiry was halted *because* of Nvidia, as fact. Attribute it to the NYT and include Commerce's and Nvidia's responses.
- Any detail of Huang's family life beyond his own words.
