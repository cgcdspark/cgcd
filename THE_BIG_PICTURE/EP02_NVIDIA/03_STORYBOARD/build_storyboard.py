"""Builds storyboard.json for EP02 'Nvidia After Jensen' from the approved script (02_SCRIPT/script_v1_for_approval.md).
Edit here, then run: python build_storyboard.py"""
import json
from pathlib import Path

def V(i, text, say=None, pause=0.35):
    d = {"id": i, "text": text, "pause": pause}
    if say:
        d["say"] = say
    return d

def F(asset, need, at=None, w=1.0, **k):
    d = {"asset": asset, "need": need, "w": w, **k}
    if at:
        d["at"] = at
    return d

def G(comp, props, at=None, w=1.0, **k):
    d = {"graphic": comp, "props": props, "w": w, **k}
    if at:
        d["at"] = at
    return d

def X(sfx, at=None, gain=-14, **k):
    d = {"sfx": sfx, "gain_db": gain, **k}
    if at:
        d["at"] = at
    return d

EMAIL = dict(frm="Jensen Huang", to="All NVIDIA employees", subject="A Message to Our Company", date="Sunday, 8 November 2026",
             lines=["I owe my family and all of you an apology.", "I was unfaithful to my wife."])
EIGHTK = dict(header="FORM 8-K · ITEM 5.02", meta="NVIDIA CORPORATION · FILED 12 NOVEMBER 2026",
              paragraphs=["On November 11, 2026, the Board of Directors of NVIDIA Corporation accepted the resignation of Jen-Hsun Huang, as NVIDIA's President, Chief Executive Officer and member of the Board, effective immediately.",
                          "Following Mr. Huang's resignation, the Board appointed Colette M. Kress to serve as interim Chief Executive Officer, while the Board conducts a search for a new Chief Executive Officer."],
              mark=0)
CASE = [
    {"date": "29 OCT", "text": "NYT: US officials suspected an intelligence link"},
    {"date": "29 OCT", "text": "Nvidia: allegations 'debunked last year'"},
    {"date": "30 OCT", "text": "WSJ follow-up · Singapore denies its claims"},
    {"date": "04 NOV", "text": "Three House committees write to Huang"},
    {"date": "08 NOV", "text": "The email · board opens an investigation"},
    {"date": "09 NOV", "text": "China: 'groundless' · shareholder lawsuit"},
    {"date": "11 NOV", "text": "Another relationship reported · resignation accepted"},
    {"date": "12 NOV", "text": "Nvidia announces: Huang is out"},
]
def case(n): return {"entries": CASE, "upTo": n}
def email(hi=1): return {"from": EMAIL["frm"], "to": EMAIL["to"], "subject": EMAIL["subject"], "date": EMAIL["date"], "lines": EMAIL["lines"], "highlight": hi}
MAP_NODES = [
    {"id": "bj", "name": "Beijing", "lon": 116.4, "lat": 39.9},
    {"id": "tp", "name": "Taipei", "lon": 121.5, "lat": 25.0},
    {"id": "kl", "name": "Kuala Lumpur", "lon": 101.7, "lat": 3.1, "left": True},
    {"id": "sg", "name": "Singapore", "lon": 103.8, "lat": 1.35, "hot": True},
]
MAP_BOX = [94, -4, 128, 44]

scenes = []
def scene(id, act, title, vo, shots, overlays=None, sfx=None, lead_in=0.4, tail=0.5, short=None, **k):
    s = {"id": id, "act": act, "title": title, "lead_in": lead_in, "tail": tail, "vo": vo, "shots": shots, "overlays": overlays or [], "sfx": sfx or []}
    if short:
        s["short"] = short
    s.update(k)
    scenes.append(s)

def chapter(n, name, dur=3.2):
    return {"component": "ChapterCard", "at_scene_start": 0.0, "dur": dur, "props": {"act": f"CHAPTER {n}", "title": name}}

# ---------------- COLD OPEN ----------------
scene("S00", "COLD", "Cold open", [
    V("L001", "On Sunday, November the eighth, Jensen Huang sent an email to everyone at Nvidia.", pause=0.5),
    V("L002", "It started with an apology.", pause=0.7),
    V("L003", "“I was unfaithful to my wife.”", say="I was unfaithful to my wife.", pause=1.0),
    V("L004", "Four days later, Nvidia told the world he was gone. Not just as CEO. Off the board too. Effective immediately.", pause=0.6),
    V("L005", "Think about that. For thirty-three years, Nvidia had one boss.", pause=0.4),
    V("L006", "The guy who started it in a Denny's booth. Who once had it thirty days from going under… and turned it into the first company in history worth five trillion dollars.", pause=0.5),
    V("L007", "Gone. In less than a week.", pause=1.1),
    V("L008", "But the affair… wasn't really the story.", pause=0.6),
    V("L009", "Behind it was a businesswoman, a company in Singapore, billions of dollars of AI chips… and questions that now reach all the way to the US Justice Department and Congress.", pause=0.6),
    V("L010", "So what actually happened?", pause=0.4),
    V("L011", "And what happens to Nvidia now?", pause=1.0),
], [
    F("E2-MOOD-097", "Phone on a laptop in the dark", w=0.6),
    G("EmailReveal", email(), at="L001", offset=1.2, w=3),
    G("DocumentCard", EIGHTK, at="L004", w=1),
    G("BigWords", {"lines": ["33 YEARS.", "ONE CEO."], "accent": "ONE CEO."}, at="L005", w=1),
    F("SEM-042", "Chip macro", at="L006", w=0.6),
    F("DC-010", "Supercomputer racks", w=0.6, **{"in": 70}),
    F("BIZ-085", "City at night, aerial", w=0.7),
    G("BigWords", {"lines": ["GONE.", "IN LESS THAN A WEEK."], "accent": "GONE."}, at="L007", w=1),
    F("E2-MOOD-003", "Person in the dark watching projected light", at="L008", w=1),
    F("E2-BIZ-014", "Screen reflected in glasses", at="L009", w=0.8),
    F("E2-BIZ-106", "City at night, timelapse", w=0.6),
    F("SEM-045", "Chipset close-up", w=0.6),
    F("E2-MOOD-004", "Digital clock at midnight", at="L010", w=1),
], sfx=[
    X("SFX2_KEY", "L001", -10, offset=-0.3), X("SFX2_TYPE", "L002", -18, offset=0.3),
    X("SFX2_IMPACT", "L004", -9, offset=0.0), X("SFX2_PULSE", "L005", -16, dur=9),
    X("SFX2_DEEP", "L007", -8), X("SFX2_HEART", "L008", -14, dur=7), X("SFX2_STATIC", "L009", -26, dur=4),
    X("SFX2_TICK", "L010", -18, dur=5), X("SFX2_RISER", "L011", -12, offset=1.2),
], lead_in=1.0, tail=0.4, short="How Jensen Huang lost Nvidia in four days")

scene("S01", "COLD", "Title", [], [F("E2-BIZ-106", "City at night (under title)", dim=0.45, **{"in": 4})],
      overlays=[{"component": "TitleCard", "at_scene_start": 0.1, "dur": 4.6, "props": {"title": "NVIDIA|AFTER JENSEN"}}],
      sfx=[X("SFX2_BOOM", None, -7, at_scene_start=0.3)], lead_in=0, tail=0, hold=5.0)

# ---------------- CHAPTER 1: THE DINER ----------------
scene("S02", "CH1", "The Diner", [
    V("L101", "To understand what Nvidia just lost, you have to go back."),
    V("L102", "He was nine when his family sent him to America. His relatives thought they'd found him a good boarding school in Kentucky. It turned out to be a school for troubled kids. One of his jobs? Cleaning the toilets."),
    V("L103", "A few years later, he was washing dishes at Denny's."),
    V("L104", "And in 1993, in a Denny's booth in East San Jose, he and two engineer friends, Chris Malachowsky and Curtis Priem, sketched out a company that would build graphics chips.", pause=0.6),
    V("L105", "It almost died straight away.", pause=0.5),
    V("L106", "Their first chip bet on the wrong technology. The whole industry went one way; Nvidia went the other. By 1996, more than half the staff had been let go."),
    V("L107", "One customer, Sega, dropped Nvidia's chip… and then invested five million dollars anyway. Jensen says that gave them six months to live."),
    V("L108", "The company even had an unofficial motto: “Our company is thirty days from going out of business.”", say="The company even had an unofficial motto. Our company is thirty days from going out of business.", pause=0.8),
    V("L109", "They survived. In 1999, Nvidia went public at twelve dollars a share."),
    V("L110", "And sitting on its board that year was a forty-five-year-old director called Harvey Jones.", pause=0.6),
    V("L111", "Remember that name.", pause=1.0),
], [
    F("E2-BIZ-092", "City streets at night", w=1, dim=0.25),
    G("DocumentCard", {"header": "JEN-HSUN “JENSEN” HUANG", "meta": "PROFILE", "paragraphs": ["Born in Taiwan. Sent to the United States at nine.", "Enrolled at a school in rural Kentucky. Chores included cleaning the toilets.", "Teenage job: washing dishes at Denny's."], "mark": 0}, at="L102", w=2),
    G("DocumentCard", {"header": "JEN-HSUN “JENSEN” HUANG", "meta": "PROFILE", "paragraphs": ["Born in Taiwan. Sent to the United States at nine.", "Enrolled at a school in rural Kentucky. Chores included cleaning the toilets.", "Teenage job: washing dishes at Denny's."], "mark": 2}, at="L103", w=1),
    G("HistoryTimeline", {"kicker": "Nvidia", "title": "From a diner booth to the top", "start": 1993, "end": 2026, "points": [
        {"year": 1993, "label": "Founded at a Denny's", "hot": True}, {"year": 1996, "label": "Most staff let go"}, {"year": 1999, "label": "IPO at $12"},
        {"year": 2006, "label": "CUDA"}, {"year": 2012, "label": "AlexNet"}, {"year": 2016, "label": "First DGX-1 to OpenAI"},
        {"year": 2023, "label": "$1tn"}, {"year": 2025, "label": "$5tn"}]}, at="L104", w=1),
    F("SEM-037", "Chipset close-up", at="L105", w=1),
    G("BigWords", {"lines": ["1996.", "MORE THAN HALF", "THE STAFF, GONE."], "accent": "1996."}, at="L106", offset=2.5, w=1),
    F("E2-BIZ-111", "Banknotes falling in the dark", at="L107", w=1),
    F("SEM-044", "Circuit board macro", w=0.6),
    G("BigWords", {"lines": ["“OUR COMPANY IS", "THIRTY DAYS FROM", "GOING OUT OF BUSINESS.”"], "accent": "THIRTY DAYS FROM"}, at="L108", offset=1.6, w=1),
    F("BIZ-043", "Financial district at sunrise", at="L109", w=1, **{"in": 4}),
    G("DocumentCard", {"header": "PROSPECTUS · 3,500,000 SHARES", "meta": "NVIDIA CORPORATION · JANUARY 1999", "paragraphs": ["Initial public offering price: $12.00 per share.", "Directors: … Harvey C. Jones, 45, Director …"], "mark": 1}, at="L110", w=1),
], overlays=[chapter(1, "THE DINER")], sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_SHUTTER", "L102", -16), X("SFX2_DEEP", "L106", -11, offset=2.5), X("SFX2_IMPACT", "L111", -12, offset=-0.2)],
   short="Nvidia was 30 days from going bust")

# ---------------- CHAPTER 2: THE BET ----------------
scene("S03", "CH2", "The Bet", [
    V("L201", "Then Jensen made the bet that defined him."),
    V("L202", "In 2006, Nvidia launched CUDA, software that turned its gaming chips into machines that could do almost any kind of maths.", say="In two thousand and six, Nvidia launched CUDA, software that turned its gaming chips into machines that could do almost any kind of maths."),
    V("L203", "It cost a fortune. Wall Street didn't get it. By late 2008, the whole company was worth less than four billion dollars.", say="It cost a fortune. Wall Street didn't get it. By late two thousand and eight, the whole company was worth less than four billion dollars.", pause=0.6),
    V("L204", "And then, in 2012, a grad student trained an AI program called AlexNet on two Nvidia gaming cards. About five hundred dollars each. In his bedroom, at his parents' house.", say="And then, in twenty twelve, a grad student trained an AI program called AlexNet on two Nvidia gaming cards. About five hundred dollars each. In his bedroom, at his parents' house."),
    V("L205", "It blew away the competition. Nvidia's own annual report calls that moment AI's “Big Bang”.", say="It blew away the competition. Nvidia's own annual report calls that moment AI's Big Bang.", pause=0.6),
    V("L206", "In 2016, Jensen personally delivered Nvidia's first AI supercomputer to a small non-profit called OpenAI.", say="In twenty sixteen, Jensen personally delivered Nvidia's first AI supercomputer to a small non-profit called OpenAI."),
    V("L207", "Six years later, OpenAI released ChatGPT.", pause=0.4),
    V("L208", "And suddenly, everyone needed Nvidia.", pause=0.5),
    V("L209", "It touched a trillion dollars in 2023. And in October 2025 it became the first company ever worth five trillion.", say="It touched a trillion dollars in twenty twenty-three. And in October twenty twenty-five it became the first company ever worth five trillion.", pause=0.8),
], [
    F("MOOD-053", "Code on screen", w=1, dim=0.2),
    F("SEM-041", "Chipset close-up", at="L202", w=1),
    G("BigStat", {"kicker": "Nvidia · late 2008", "value": 4, "prefix": "< $", "suffix": "bn", "label": "What the whole company was worth"}, at="L203", offset=2.2, w=1),
    F("SEM-001", "Engineer working on a circuit board", at="L204", w=1, **{"in": 3}),
    F("MOOD-015", "Hands typing", w=0.7),
    G("BigWords", {"lines": ["AI'S", "“BIG BANG”"], "accent": "“BIG BANG”"}, at="L205", offset=1.6, w=1),
    F("DC-010", "Supercomputer racks", at="L206", w=1, **{"in": 75}),
    F("MOOD-049", "Typing on a laptop", at="L207", w=1),
    F("DC-010", "Cable trays above racks", at="L208", w=1, **{"in": 104}),
    G("ColumnChart", {"kicker": "Nvidia market value", "title": "From under $4bn to $5tn", "unit": "", "cols": [
        {"label": "Nov 2008", "value": 4, "display": "<$4bn"}, {"label": "May 2023", "value": 1000, "display": "$1tn"}, {"label": "Oct 2025", "value": 5000, "display": "$5tn", "highlight": True}]}, at="L209", w=1),
], overlays=[chapter(2, "THE BET")], sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_DEEP", "L203", -11, offset=2.2), X("SFX2_BRASS", "L208", -16)],
   short="The bet Wall Street hated")

# ---------------- CHAPTER 3: THE EMPIRE ----------------
scene("S04", "CH3", "The Empire", [
    V("L301", "Here's how big it got."),
    V("L302", "In the three months to late October, Nvidia sold almost a hundred and sixteen billion dollars' worth of products. Around nine in every ten of those dollars came from data centres."),
    V("L303", "And it kept sixty-five billion of it as profit. In one quarter.", pause=0.6),
    V("L304", "Jensen ran the whole thing like nobody else. Dozens of people reporting straight to him. The same leather jacket on every stage.", pause=0.6),
    V("L305", "But there was one market Nvidia could never fully have. China.", pause=0.6),
    V("L306", "Not long ago, China was about one dollar in every five Nvidia made. Then US export rules cut off its most powerful chips. Today, Nvidia's own forecast assumes zero data-centre chip sales there."),
    V("L307", "And that's exactly where this story takes a turn.", pause=0.8),
], [
    F("DC-010", "Long aisle of racks", w=1, dim=0.2, **{"in": 122}),
    G("BigStat", {"kicker": "Nvidia · one quarter", "value": 115.8, "decimals": 1, "prefix": "$", "suffix": "bn", "label": "Revenue, three months to 25 Oct 2026", "sublabel": "About 93% from data centres"}, at="L302", w=1),
    G("BigStat", {"kicker": "Nvidia · one quarter", "value": 65.3, "decimals": 1, "prefix": "$", "suffix": "bn", "label": "Profit, same three months"}, at="L303", w=1),
    F("E2-BIZ-024", "Silhouettes shaking hands", at="L304", w=1),
    F("E2-MOOD-003", "Figure in the dark", w=0.8),
    G("BigWords", {"lines": ["CHINA."], "accent": "CHINA."}, at="L305", offset=2.4, w=1),
    G("ColumnChart", {"kicker": "Nvidia revenue from China", "title": "China's share of revenue", "unit": "%", "cols": [
        {"label": "FY2025", "value": 19.2, "display": "19%", "highlight": True}, {"label": "FY2026", "value": 9.1, "display": "9%"}]}, at="L306", w=1),
    F("E2-BIZ-102", "Night drive through city traffic", at="L307", w=1),
], overlays=[chapter(3, "THE EMPIRE"), {"component": "CornerStat", "at": "L306", "offset": 7.5, "dur": 4.5, "props": {"value": "$0", "label": "China data-centre chip sales in Nvidia's outlook"}}],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_DEEP", "L302", -12, offset=0.2), X("SFX2_DEEP", "L303", -12), X("SFX2_TICK", "L305", -20, dur=12)],
   short="Nvidia's profit in ONE quarter")

# ---------------- CHAPTER 4: SINGAPORE ----------------
scene("S05", "CH4", "The Singapore Connection", [
    V("L401", "Meet Megaspeed. A data-centre company based in Singapore."),
    V("L402", "According to reports, it became one of Nvidia's biggest customers in South-East Asia, buying billions of dollars' worth of its chips."),
    V("L403", "In 2024, investigators at the US Commerce Department noticed what they later called “suspicious activity”. They started looking at whether chips bought by Megaspeed were ending up in China.", say="In twenty twenty-four, investigators at the US Commerce Department noticed what they later called suspicious activity. They started looking at whether chips bought by Megaspeed were ending up in China.", pause=0.6),
    V("L404", "By mid-2025, Nvidia had stopped selling to Megaspeed.", say="By mid twenty twenty-five, Nvidia had stopped selling to Megaspeed.", pause=0.5),
    V("L405", "That June, US and Singapore officials visited the company and interviewed its boss: a businesswoman who, according to Bloomberg, had spent years in Nvidia's orbit.", pause=0.8),
    V("L406", "Today, that investigation is a criminal case, led by the US Justice Department.", pause=0.5),
    V("L407", "Megaspeed says it does legitimate, lawful business, and denies any wrongdoing.", pause=0.8),
], [
    F("E2-BIZ-106", "City at night, timelapse", w=1, dim=0.25, **{"in": 2}),
    G("RegionMap", {"kicker": "South-East Asia", "title": "Where the chips went", "nodes": MAP_NODES, "links": [], "bbox": MAP_BOX}, at="L401", offset=1.0, w=1),
    F("SEM-045", "Chipset close-up", at="L402", w=0.8),
    F("E2-BIZ-024", "Silhouettes shaking hands", w=0.7),
    G("RegionMap", {"kicker": "Under investigation since 2024", "title": "Did the chips reach China?", "nodes": MAP_NODES, "links": [{"from": "sg", "to": "bj", "label": "investigators asked", "dashed": True}], "bbox": MAP_BOX}, at="L403", w=1),
    G("BigWords", {"lines": ["JUNE 2025.", "NVIDIA STOPS SELLING", "TO MEGASPEED."], "accent": "JUNE 2025."}, at="L404", w=1),
    F("E2-BIZ-014", "Screen reflected in glasses", at="L405", w=1),
    F("E2-MOOD-003", "Figure in the dark", w=0.7),
    G("BigWords", {"lines": ["A CRIMINAL CASE.", "LED BY THE U.S. JUSTICE DEPARTMENT"], "accent": "A CRIMINAL CASE."}, at="L406", w=1),
    F("E2-BIZ-092", "City streets at night", at="L407", w=1),
], overlays=[chapter(4, "THE SINGAPORE CONNECTION")],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_STATIC", "L401", -24, dur=5), X("SFX2_PULSE", "L403", -16, dur=12), X("SFX2_IMPACT", "L406", -10)],
   short="The Singapore company at the centre of the Nvidia scandal")

# ---------------- CHAPTER 5: FIFTEEN DAYS ----------------
scene("S06", "CH5", "Fifteen Days", [
    V("L501", "October the twenty-ninth, 2026.", say="October the twenty-ninth, twenty twenty-six.", pause=0.5),
    V("L502", "The New York Times reports that, according to US officials, American intelligence suspected that same businesswoman of working for Chinese intelligence."),
    V("L503", "Nvidia hits back the same day. It says the allegations about chips reaching China were investigated and debunked last year, and that meeting customers is just part of a CEO's job."),
    V("L504", "The next day, the Wall Street Journal reports that Singapore and Taiwan had concerns about her too. Singapore's government publicly denies saying that."),
    V("L505", "Nvidia's shares start to slide.", pause=0.5),
    V("L506", "November the fourth. Three committees of the US House of Representatives write to Jensen Huang. They want answers.", pause=0.6),
    V("L507", "November the eighth. A Sunday. The email.", pause=0.6),
    V("L508", "“I was unfaithful to my wife.”", say="I was unfaithful to my wife.", pause=0.8),
    V("L509", "The same day, Nvidia's board opens an independent investigation after reports that Huang had been the target of a foreign intelligence effort. The board says it has “no reason to believe” national security or company secrets were compromised.", say="The same day, Nvidia's board opens an independent investigation after reports that Huang had been the target of a foreign intelligence effort. The board says it has no reason to believe national security or company secrets were compromised.", pause=0.5),
    V("L510", "November the ninth. China's foreign ministry calls the spy claim “completely groundless”. President Trump says Huang told him he had no idea, and that he believes him. A shareholder sues, claiming investors were misled. Those are allegations, not findings.", say="November the ninth. China's foreign ministry calls the spy claim completely groundless. President Trump says Huang told him he had no idea, and that he believes him. A shareholder sues, claiming investors were misled. Those are allegations, not findings.", pause=0.5),
    V("L511", "November the eleventh. The New York Times reports that Huang also had a relationship with a senior Nvidia executive. Nvidia doesn't comment.", pause=0.4),
    V("L512", "That same day, the board accepts his resignation.", pause=1.4),
    V("L513", "November the twelfth. The announcement.", pause=0.6),
    V("L514", "After thirty-three years… the only CEO Nvidia had ever had… was gone.", pause=1.2),
    V("L515", "Days later, Reuters reported a relationship with yet another Nvidia employee. Again, Nvidia declined to comment.", pause=0.8),
], [
    G("CaseTimeline", case(0), w=1),
    F("E2-BIZ-102", "Night drive through city traffic", at="L502", offset=3.0, w=1, **{"in": 1}),
    G("CaseTimeline", case(1), at="L503", w=1),
    F("BIZ-043", "Financial district, silhouettes", w=0.8, **{"in": 14}),
    G("CaseTimeline", case(2), at="L504", w=1),
    F("E2-BIZ-084", "Man presenting charts", at="L505", w=1),
    G("CaseTimeline", case(3), at="L506", w=1),
    G("CaseTimeline", case(4), at="L507", w=1),
    G("EmailReveal", email(), at="L508", offset=-0.6, w=1),
    F("E2-MOOD-003", "Figure in the dark", at="L509", w=1),
    F("E2-BIZ-092", "City streets at night", w=1),
    G("CaseTimeline", case(5), at="L510", w=1),
    F("E2-BIZ-102", "Night drive", w=1),
    G("CaseTimeline", case(6), at="L511", w=1),
    F("E2-MOOD-004", "Digital clock at midnight", at="L512", w=1),
    G("CaseTimeline", case(7), at="L513", w=1),
    G("BigWords", {"lines": ["33 YEARS.", "GONE."], "accent": "GONE."}, at="L514", offset=2.0, w=1),
    F("E2-MOOD-097", "Phone on a laptop in the dark", at="L515", w=1),
], overlays=[chapter(5, "FIFTEEN DAYS")],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_TICK", "L501", -17, dur=28), X("SFX2_TYPE", "L503", -20, dur=1.5), X("SFX2_TYPE", "L506", -20, dur=1.5),
        X("SFX2_HEART", "L507", -12, dur=9), X("SFX2_TICK", "L510", -18, dur=20), X("SFX2_IMPACT", "L512", -8, offset=2.4), X("SFX2_DEEP", "L514", -9, offset=2.0)],
   short="15 days that ended Jensen Huang's reign")

# ---------------- CHAPTER 6: WHAT WE KNOW ----------------
scene("S07", "CH6", "What We Actually Know", [
    V("L601", "So… was this a honey trap? That's what everyone's asking.", pause=0.6),
    V("L602", "Here's what we actually know.", pause=0.4),
    V("L603", "She hasn't been charged with anything, anywhere. She hasn't said a word in public. Bloomberg reports she's living in Beijing. China calls the whole thing a smear."),
    V("L604", "The US Attorney General says the Justice Department has reached “no conclusions” about who she is. And President Trump put it bluntly: “nobody's proven that she's a spy.”", say="The US Attorney General says the Justice Department has reached no conclusions about who she is. And President Trump put it bluntly. Nobody's proven that she's a spy."),
    V("L605", "Nvidia's board says it has no reason to believe any secrets were compromised.", pause=0.7),
    V("L606", "But the investigations keep coming.", pause=0.4),
    V("L607", "The Justice Department's criminal case into Megaspeed. A reported SEC inquiry into whether Nvidia's disclosures misled investors. Malaysia checking whether chips were shipped on to somewhere else."),
    V("L608", "And the Treasury Secretary went on TV and asked whether Nvidia had made “seemingly illicit sales” to boost its numbers. Nvidia hasn't been charged with anything.", say="And the Treasury Secretary went on TV and asked whether Nvidia had made seemingly illicit sales to boost its numbers. Nvidia hasn't been charged with anything.", pause=0.6),
    V("L609", "On December the first, Jensen Huang has agreed to sit down, behind closed doors, with three House committees.", pause=0.6),
    V("L610", "And Jensen himself? He's posted that he'd be “honored” to come back.", say="And Jensen himself? He's posted that he'd be honored to come back.", pause=0.5),
    V("L611", "The board's answer: it does “not intend to reinstate” him.", say="The board's answer. It does not intend to reinstate him.", pause=0.9),
], [
    F("E2-MOOD-003", "Figure in the dark", w=1, dim=0.2),
    G("BigWords", {"lines": ["A HONEY TRAP?"], "accent": "A HONEY TRAP?"}, at="L601", offset=3.0, w=1),
    G("AllegedVsKnown", {"kicker": "The spy question", "title": "What we actually know", "left": ["US officials suspected an intelligence link (NYT)", "Singapore and Taiwan concerns (WSJ)", "Further relationships with employees (NYT, Reuters)"],
        "right": ["She has not been charged, anywhere", "DOJ: “no conclusions”", "China: the claims are “a smear”", "Board: no reason to believe secrets were compromised"]}, at="L602", w=3),
    F("E2-BIZ-106", "City at night, timelapse", at="L604", offset=4.0, w=1, **{"in": 8}),
    F("E2-BIZ-092", "City streets at night", at="L606", w=1),
    G("AllegedVsKnown", {"kicker": "The investigations", "title": "Who is looking at what", "leftTitle": "UNDER WAY", "rightTitle": "NOT ESTABLISHED",
        "left": ["DOJ: criminal case into Megaspeed", "SEC: inquiry (reported by WSJ)", "Malaysia: chip re-export check", "House: closed-door interview, 1 Dec"],
        "right": ["Any charge against Nvidia", "Any charge against Huang", "That she is a spy"]}, at="L607", w=2),
    F("BIZ-043", "Financial district, silhouettes", at="L608", w=1, **{"in": 20}),
    G("BigWords", {"lines": ["DECEMBER 1.", "BEHIND CLOSED DOORS."], "accent": "DECEMBER 1."}, at="L609", w=1),
    F("E2-MOOD-087", "Hands texting on a smartphone", at="L610", w=1),
    G("Quote", {"kicker": "Nvidia's board", "quote": "The Nvidia board unanimously accepted his resignation and does not intend to reinstate Jensen as CEO.", "who": "Harvey Jones", "role": "Chair · earnings call, 17 November 2026"}, at="L611", w=1),
], overlays=[chapter(6, "WHAT WE ACTUALLY KNOW")],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_HEART", "L601", -13, dur=8), X("SFX2_PULSE", "L606", -16, dur=10), X("SFX2_IMPACT", "L609", -10)],
   short="Was it a honey trap? Here's what we actually know")

# ---------------- CHAPTER 7: THE EMPTY CHAIR ----------------
scene("S08", "CH7", "The Empty Chair", [
    V("L701", "So who's running the most important company in AI right now?", pause=0.5),
    V("L702", "Its finance chief, Colette Kress, is doing two jobs: interim CEO and CFO.", pause=0.5),
    V("L703", "And remember Harvey Jones? The director from 1999? He's been on the board since 1993. He's now Nvidia's first-ever chair.", say="And remember Harvey Jones? The director from nineteen ninety-nine? He's been on the board since nineteen ninety-three. He's now Nvidia's first-ever chair."),
    V("L704", "The man who watched Nvidia grow up is now picking who runs it next.", pause=0.6),
    V("L705", "The business? On November the seventeenth, Nvidia posted the biggest quarter in its history. Kress's message: “Our momentum is real.”", say="The business? On November the seventeenth, Nvidia posted the biggest quarter in its history. Kress's message. Our momentum is real."),
    V("L706", "It's forecasting about a hundred and thirty billion dollars next quarter.", pause=0.5),
    V("L707", "But the stock tells a different story. At its October peak, Nvidia was worth nearly six trillion dollars. On earnings day, it was under four trillion, though part of that slide was a market-wide sell-off."),
    V("L708", "And its biggest customers? Google, Amazon, Microsoft and Meta are all building chips of their own.", pause=0.8),
], [
    F("DC-010", "Empty aisle of racks", w=1, dim=0.25, **{"in": 124}),
    G("BigWords", {"lines": ["COLETTE KRESS", "INTERIM CEO + CFO"], "accent": "COLETTE KRESS"}, at="L702", w=1),
    G("BigWords", {"lines": ["HARVEY JONES", "ON THE BOARD SINCE 1993", "FIRST-EVER CHAIR"], "accent": "HARVEY JONES"}, at="L703", w=1),
    F("E2-MOOD-004", "Digital clock at midnight", at="L704", w=1),
    G("BigStat", {"kicker": "Reported 17 Nov 2026", "value": 115.8, "decimals": 1, "prefix": "$", "suffix": "bn", "label": "The biggest quarter in Nvidia's history", "sublabel": "“Our momentum is real.” Colette Kress"}, at="L705", w=1),
    F("DC-010", "Server boards", at="L706", w=1, **{"in": 186}),
    G("EventLine", {"kicker": "Nvidia shares", "title": "Closing price through the scandal", "unit": "$", "min": 140, "max": 270, "note": "US$ per share, closing prices · 5 Nov includes a market-wide sell-off",
        "points": [{"label": "6 Oct", "value": 239.24}, {"label": "28 Oct", "value": 215.38}, {"label": "30 Oct", "value": 204.64}, {"label": "4 Nov", "value": 200.13}, {"label": "5 Nov", "value": 181.5},
                   {"label": "9 Nov", "value": 178.67}, {"label": "10 Nov", "value": 168.89}, {"label": "12 Nov", "value": 166.19}, {"label": "13 Nov", "value": 162.85}, {"label": "16 Nov", "value": 156.14}, {"label": "17 Nov", "value": 155.46}],
        "events": [{"index": 0, "text": "Record close"}, {"index": 2, "text": "First reports"}, {"index": 4, "text": "Market sell-off"}, {"index": 5, "text": "After the email"}, {"index": 7, "text": "Resignation"}]}, at="L707", w=1),
    F("SEM-042", "Processor socket, macro", at="L708", w=1),
], overlays=[chapter(7, "THE EMPTY CHAIR"), {"component": "CornerStat", "at": "L706", "offset": 0.5, "dur": 4.5, "props": {"value": "~$130bn", "label": "Nvidia's forecast for next quarter"}}],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_DEEP", "L702", -12), X("SFX2_DEEP", "L703", -12), X("SFX2_PULSE", "L707", -17, dur=10)],
   short="Who's running Nvidia now?")

# ---------------- CHAPTER 8: WHAT NEXT ----------------
PATHS = [{"name": "Business as usual", "line": "Roadmap to 2028 · a strong new CEO · the machine keeps running"},
         {"name": "The slow squeeze", "line": "Customers build their own chips · China stays shut · the edge wears down"},
         {"name": "The investigations go deeper", "line": "Megaspeed · export controls · what investors were told"}]
scene("S09", "CH8", "What Happens Next", [
    V("L801", "So how does this end? Three ways it could play out.", pause=0.5),
    V("L802", "One: business as usual. Nvidia designs its chips years ahead. The roadmap already runs to 2028. A strong new CEO steps in and the machine keeps running. After Steve Jobs, Apple became the first US company worth a trillion dollars.", say="One. Business as usual. Nvidia designs its chips years ahead. The roadmap already runs to twenty twenty-eight. A strong new CEO steps in and the machine keeps running. After Steve Jobs, Apple became the first US company worth a trillion dollars.", pause=0.6),
    V("L803", "Two: the slow squeeze. Customers keep building their own chips, China stays shut, and without its founder pushing, Nvidia's edge slowly wears down. After Bill Gates handed over the CEO job, Microsoft's stock took nearly seventeen years to beat its old high.", say="Two. The slow squeeze. Customers keep building their own chips, China stays shut, and without its founder pushing, Nvidia's edge slowly wears down. After Bill Gates handed over the CEO job, Microsoft's stock took nearly seventeen years to beat its old high.", pause=0.6),
    V("L804", "Three: the investigations go deeper. If they find something serious about Megaspeed, export controls or what investors were told, that could hurt Nvidia far more than losing a CEO.", say="Three. The investigations go deeper. If they find something serious about Megaspeed, export controls or what investors were told, that could hurt Nvidia far more than losing a CEO.", pause=0.5),
    V("L805", "If they find nothing, this becomes the story of one man's private life… and an empire that outlived him.", pause=0.8),
    V("L806", "Watch three things: who the board picks, what happens on December the first, and whether the biggest buyers keep ordering.", pause=0.9),
], [
    G("ScenarioTree", {"kicker": "What happens next", "title": "Three ways this could play out", "paths": PATHS}, w=1),
    G("ScenarioTree", {"kicker": "Scenario 1", "title": "Three ways this could play out", "paths": PATHS, "focus": 0}, at="L802", w=1),
    F("DC-010", "Racks", w=1, **{"in": 70}),
    G("ScenarioTree", {"kicker": "Scenario 2", "title": "Three ways this could play out", "paths": PATHS, "focus": 1}, at="L803", w=1),
    F("E2-BIZ-106", "City at night, timelapse", w=1),
    G("ScenarioTree", {"kicker": "Scenario 3", "title": "Three ways this could play out", "paths": PATHS, "focus": 2}, at="L804", w=1),
    F("E2-BIZ-102", "Night drive", at="L805", w=1),
    G("BigWords", {"lines": ["WHO THEY PICK.", "DECEMBER 1.", "THE ORDERS."], "accent": "DECEMBER 1."}, at="L806", w=1),
], overlays=[chapter(8, "WHAT HAPPENS NEXT")],
   sfx=[X("SFX2_WHOOSH", None, -12, at_scene_start=0.0), X("SFX2_SHUTTER", "L802", -16), X("SFX2_SHUTTER", "L803", -16), X("SFX2_SHUTTER", "L804", -16), X("SFX2_RISER", "L806", -14, offset=4.0)],
   short="3 ways this ends for Nvidia")

# ---------------- CLOSE ----------------
scene("S10", "CLOSE", "Close", [
    V("L901", "Thirty-three years ago, three engineers sat in a diner and bet everything on chips nobody thought they needed.", pause=0.6),
    V("L902", "One of them built the most valuable company in the world.", pause=0.6),
    V("L903", "Now that company has to prove it can survive without him.", pause=1.6),
], [
    F("E2-BIZ-092", "City streets at night", w=1),
    F("MOOD-113", "Earth at night from orbit", at="L902", w=1, motion="push", letterbox=True, **{"in": 27}),
    F("E2-MOOD-004", "Digital clock at midnight", at="L903", w=1, letterbox=True),
], sfx=[X("SFX2_BRASS", "L903", -14, offset=2.0)], lead_in=0.6, tail=1.0)

scene("S11", "CLOSE", "End card", [], [G("EndCard", {}, w=1)], sfx=[X("SFX2_BOOM", None, -9, at_scene_start=0.3)], lead_in=0, tail=0, hold=7.0)

meta = {
    "title": "Nvidia After Jensen", "slug": "THE_BIG_PICTURE_EP02_Nvidia_After_Jensen", "brand": "THE BIG PICTURE",
    "voice": "am_michael", "voice_lang": "en-us", "speed": 0.95, "fps": 25, "show_captions": False,
    "music": [
        {"track": "M2_OPEN", "from": "S00", "to": "S01", "gain_db": -13, "fade_in": 1.0, "fade_out": 2.0},
        {"track": "M2_HISTORY", "from": "S02", "to": "S03", "gain_db": -15, "fade_in": 2.0, "fade_out": 2.5},
        {"track": "M2_EMPIRE", "from": "S04", "to": "S04", "gain_db": -15, "fade_in": 2.0, "fade_out": 2.5},
        {"track": "M2_SINGAPORE", "from": "S05", "to": "S05", "gain_db": -13, "fade_in": 1.5, "fade_out": 2.0},
        {"track": "M2_DAYS", "from": "S06", "to": "S06", "gain_db": -14, "fade_in": 1.5, "fade_out": 2.0},
        {"track": "M2_KNOWN", "from": "S07", "to": "S07", "gain_db": -15, "fade_in": 1.5, "fade_out": 2.0},
        {"track": "M2_CHAIR", "from": "S08", "to": "S09", "gain_db": -15, "fade_in": 2.0, "fade_out": 2.5},
        {"track": "M2_CLOSE", "from": "S10", "to": "S11", "gain_db": -12, "fade_in": 2.0, "fade_out": 1.0, "align": "end"},
    ],
    # music drops to silence just before key lines, so they land harder
    "music_cuts": [{"at": "L008", "offset": -0.8, "dur": 2.6}, {"at": "L111", "offset": -0.6, "dur": 2.2}, {"at": "L512", "offset": 2.0, "dur": 4.5},
                   {"at": "L514", "offset": -0.4, "dur": 4.5}, {"at": "L601", "offset": -0.5, "dur": 2.0}, {"at": "L805", "offset": -0.3, "dur": 3.0}],
    "thumbnail": {"left": "DC-010@70", "right": "E2-MOOD-004@3"},
    "thumb_variants": [4, 5, 6],
    "short_hooks": {"S00": "How Jensen Huang lost|Nvidia in *4 days*", "S02": "Nvidia was *30 days*|from going bust", "S03": "The bet Wall Street|*hated*",
                    "S04": "Nvidia's profit in|*one quarter*", "S05": "The Singapore company|at the *centre* of it all", "S06": "*15 days* that ended|Jensen Huang's reign",
                    "S07": "Was it a *honey trap*?|What we actually know", "S08": "Who's running|Nvidia *now*?", "S09": "3 ways this *ends*|for Nvidia"},
}
out = Path(__file__).with_name("storyboard.json")
out.write_text(json.dumps({"meta": meta, "scenes": scenes}, indent=1, ensure_ascii=False), encoding="utf-8")
print("storyboard.json:", len(scenes), "scenes,", sum(len(s["vo"]) for s in scenes), "lines,", sum(len(s["shots"]) for s in scenes), "shots")
