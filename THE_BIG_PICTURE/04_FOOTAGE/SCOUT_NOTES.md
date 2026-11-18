# Footage & Audio Scout Notes

THE HIDDEN WINNERS OF THE AI BOOM. Scouted 2026-11-18 with `pipeline/footage_scout.py` using the queries in `pipeline/footage_queries.json`.

Outputs:
- `04_FOOTAGE/footage_catalogue.csv`: 427 candidates, all `licence_ok=yes`. 286 are video and 141 are high-res Commons photos (the secondary list).
- `06_AUDIO/audio_catalogue.csv`: 22 music tracks and 52 SFX, all `licence_ok=yes`.

## Licence findings

### Mixkit video: two licences, checked per item
Each item page carries a `data-license` attribute, either `videoFree` or `videoRestricted`. The script reads that attribute.

The page's JSON-LD is not reliable for this. Every item links to `license/#videoFree`, even when its `copyrightNotice` says "Mixkit Restricted License".

Only `videoFree` items were kept. In the first scout run, 556 of the 906 Mixkit clips (61%) were Restricted and were excluded. That includes almost all data-centre, server and pylon clips.

**Stock Video Free License** (from mixkit.co/license/modal/videoFree/):
> "Videos under the Free license can be used in YouTube videos, Social Media video posts, Online marketing ads, Educational purposes, Music videos, Commercial projects, Filmmaking. Items under the Mixkit Stock Video Free License can be used in your commercial and non-commercial projects, for free. You're permitted to download, copy, modify, distribute, publicly perform and broadcast the Items. Your rights are non-exclusive, worldwide, sub-licensable and ongoing. Attribution is not required, however, we would appreciate it if you credit Mixkit where reasonably possible. There are some important limits to these rights, described in our User Terms."

**Stock Video Restricted License** (from mixkit.co/license/modal/videoRestricted/). This is not usable for us:
> "Allowed: Personal Projects, Educational Purposes, Personal social media posts. Not Allowed: Commercial Projects, Advertising, Company Social Media posts, YouTube videos. Items under the Mixkit Stock Video Restricted License can be used in personal projects only. [...] Personal projects never: Attract a fee or payment for access or use; Appear in social media, marketing or an advertisement for a business or something that you sell or make money from (e.g. a monetized YouTube video); Appear on internet-based video on demand services, television or radio broadcasts, or in a film."

### Mixkit music: one licence, with limits
**Stock Music Free License**:
> "Allowed: Podcasts, Social Media video posts, Online marketing ads, Educational Purposes, YouTube videos*. Not Allowed: CDs & DVDs, TV & Radio Broadcasts, Video Games. [...] You're not allowed to use them in CDs or DVDs, video games or tv or radio broadcast. You're also not allowed to remix them (or incorporate in a music-only track), claim them as your own or register them on any rights management service. [...] *If you receive a claim, please forward the details to team@mixkit.co for assistance."

This means a YouTube release is fine. A later TV broadcast or festival/DVD sale of the film would not be covered. The licence of each track was checked against the per-item `copyrightNotice` ("Mixkit Stock Music Free License").

### Mixkit sound effects
**Sound Effects Free License**:
> "...can be used in YouTube videos, Social Media video posts, Online marketing ads, Educational Purposes, Music videos, Commercial projects, Filmmaking, Video games, TV & Radio broadcasts, CDs & DVDs. [...] You can't redistribute the Item on its own, as stock, in a tool or template, or with source files. You're also not allowed to claim them as your own or register them on any rights management service."

Mixkit has only one SFX licence. The search pages link to `#sfxFree`.

### Wikimedia Commons
Only these licences were accepted, read from the API `extmetadata.LicenseShortName`: CC0, Public domain, CC BY x.x and CC BY-SA x.x. NC and ND licences, and anything unknown, are rejected by the script; none came up in this run.

The licences found were Public domain, CC0, CC BY 2.0/3.0/4.0 and CC BY-SA 2.0/2.5/3.0/4.0, including some ported versions (de, igo).

- **CC BY and BY-SA require attribution.** Credit the author, title, licence and link, and say if the file was changed. The `attribution` column holds ready-made text. Put it in the end credits and the YouTube description.
- **BY-SA is ShareAlike.** An adapted version of the clip itself must be released under BY-SA. Simply editing it into a larger documentary is normally a "collection"-style use, but keep the attribution complete.
- **Personality, trademark and third-party rights are not covered by the copyright licence.** The script copied the Commons `Restrictions` field into `notes` where it was set. Explainer and corporate videos (ST, NXP, "Data Center Tour" and others) are flagged: use clean visual sections only.

### NASA
NASA material is generally not copyrighted in the US (it is a US Government work). Credit "NASA" (and the centre).

You may not use the NASA insignia or logo, and you may not imply NASA endorsement. Identifiable astronauts or personnel must not be used for commercial endorsement.

Some NASA videos contain third-party material. Any NASA item whose description mentions ©, copyright or "courtesy of" was marked `licence_ok=no`. www.nasa.gov (the guidelines page) was blocked by the proxy (403), so these terms are summarised from NASA's standard media-usage guidelines, not quoted.

## What was blocked or not done
- **Pexels and Pixabay:** 403 bot protection. They were not attempted, per instructions. Use them as manual-download alternatives, especially for data centres and pylons. Both licences allow commercial use without attribution.
- **www.nasa.gov:** blocked by the proxy (403). images-api.nasa.gov and images-assets.nasa.gov work.
- **Wikimedia:** started returning 429 near the end of the session, so the second, extended run was stopped at the coordinator's request. The extra queries are still in `footage_queries.json` but have **not** been run. They cover:
  - data centres: datacenter, servers, server racks, Rechenzentrum
  - pylons and power lines
  - port, cargo and crane
  - wall street and stock chart
  - earth, space and satellite
  - 13 extra SFX searches: server room, computer fan, electric arc, power surge, sub drop, metal clank and others

  The catalogue comes from the first run plus an offline cleanup.
- **Mixkit music search:** `/free-stock-music/discover/<term>/` renders its results client-side and returns nothing. The script uses listing paths instead (`mood/dark`, `tag/cinematic`, `film-score`, and so on).
- **Mixkit download URLs:** older items use `assets.mixkit.co/videos/<id>/<id>-1080.mp4`. Newer items use opaque keys (`assets.mixkit.co/<key>` or `active_storage/video_items/...`). These were found through the download page. Every listed URL passed a HEAD check, and resolutions were confirmed with ffprobe. 4K clips list the 2160p URL.

## Cleanup
The manual title check dropped 373 obvious mismatches using `drop_title_regex` in the config. Examples:
- "chip" returned poker chips.
- "transformer" returned make-up.
- "cables" returned ski lifts.
- "skyline" returned nature shots.
- Commons "server room" returned White House press briefings.
- "FAB" returned bomb disposal.

Also removed: 46 vertical (9:16) clips and rows without dimensions.

## Counts in the final catalogue

| Category | Total | Video | Photo | Videos at least 1920 wide, landscape |
|---|---|---|---|---|
| semiconductors | 64 | 44 | 20 | 38 |
| data_centres | 27 | 6 | 21 | 3 |
| electricity | 106 | 48 | 58 | 43 |
| global_business | 145 | 103 | 42 | 101 |
| mood | 85 | 85 | 0 | 60 |

By source: Mixkit 180, Commons video 94, Commons photo 141, NASA 12.

## Gaps (where good, licence-clean footage is missing)
1. **Data centres (critical).** Mixkit's server, rack and data-centre clips are almost all Restricted; only 2 were Free, and neither was relevant. The Commons videos are poor; the best are "Data Center Tour", "Decommissioned Data Center", "Airship over Utah Data Center" and the NASA Ames modular supercomputer facility. Mostly stills are left.
   - Get these manually from Pexels or Pixabay: server aisles, blinking LEDs, fibre and cable trays, chillers, aerial data-centre campuses.
2. **Semiconductor fab.** There is no real wafer-fab or lithography video, and no EUV. What exists:
   - Macro shots of motherboards and chipsets (Mixkit 4K, good).
   - Commons explainers: ST, NXP, "So werden Mikrochips hergestellt" and "Zoom Into a Microchip".
   - NASA spacecraft cleanrooms, usable as generic gowned-cleanroom b-roll only.
   - Silicon-wafer and ASML stills.
   Consider stills with motion (Ken Burns) or Pexels.
3. **Electricity.** Pylons and transmission lines have no free Mixkit video. Commons has REN line maintenance and BPA transmission explainers. Also missing: substation, switchgear and transformer **video**, cable factories and spools, and linemen. These are well covered by Commons stills.
   - Good video exists for: power plants (Austin, aerials), wind farms, dams, cooling towers (including demolitions), Chernobyl pumps and Darlington nuclear.
4. **Global business.** This is well covered: offices, handshakes, money, city at night, container ships and port cranes, factory aerials. Weak spots:
   - Stock tickers and trading floors (one "Electronic ticker" clip, plus historic NYSE and Frankfurt stills).
   - Industrial robots (one capsule-packing machine and one "Industrial machine").
5. **Mood.** Good: typing, laptops, coding and smartphones, including green-screen phones for chatbot UI comps. Weak: earth at night from space. There are 20 Commons ISS night timelapses, but only at 1280x854, plus the NASA Black Marble 4K and the "Earth at Night" 1080p. There are few clean abstract or AI visualisations; build these in motion graphics.

## Audio
- **Music.** The 22 tracks cover dark, ambient and drone; cinematic tension; electronic and pulsing; and minimal piano.
  - Dark, ambient and drone: Echoes, Fallen (Asper), Cyberpunk City.
  - Cinematic tension: Fright Night, Vampires in the City, Epical Drums.
  - Electronic and pulsing: Masking the Masters, Xceed Thru Johann, Moon Walk, Focus on Yourself.
  - Minimal piano: Silent Descent, The Journey, Ode to Loneliness.
  Mixkit has no strong "corporate-cinematic" tracks; "Sci-Fi Score" is the closest.
- **SFX gaps.** There is no dedicated server-room ambience, transformer buzz or power surge (the extended queries were not run). "Industrial hum loop", "Industrial machine hum" and "Technological futuristic hum" are stand-ins.
