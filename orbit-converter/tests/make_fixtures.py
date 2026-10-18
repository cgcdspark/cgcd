"""Builds test inputs with tools independent of the app (Pillow, LibreOffice, pypdf)."""
import io
import os
import shutil
import subprocess
import sys

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter

out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "fixtures")
os.makedirs(out, exist_ok=True)
p = lambda name: os.path.join(out, name)

# Images
img = Image.new("RGBA", (640, 400), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rectangle([40, 40, 600, 360], fill=(80, 120, 255, 200))
d.ellipse([200, 100, 440, 340], fill=(255, 170, 120, 255))
img.save(p("alpha.png"))
img.convert("RGB").save(p("photo.jpg"), quality=90)
img.save(p("pic.webp"))
img.convert("P").save(p("anim.gif"))
img.convert("RGB").save(p("bitmap.bmp"))

# JPEG stored sideways with EXIF orientation 6 (rotate 90° CW to display): stored 300x200, shown 200x300
rot = Image.new("RGB", (300, 200), (200, 40, 40))
ImageDraw.Draw(rot).rectangle([0, 0, 60, 200], fill=(40, 200, 40))
exif = Image.Exif()
exif[0x0112] = 6
rot.save(p("rotated.jpg"), exif=exif.tobytes())

# Broken and misleading inputs
data = open(p("alpha.png"), "rb").read()
open(p("truncated.png"), "wb").write(data[: len(data) // 3])
open(p("not-really.png"), "w").write("hello, I am text pretending to be a PNG")
open(p("empty.txt"), "wb").close()
open(p("random.bin"), "wb").write(os.urandom(4096))
open(p("broken.pdf"), "wb").write(b"%PDF-1.7\n1 0 obj << /Type /Catalog >>\ngarbage garbage\n")
open(p("png-named.jpg"), "wb").write(data)  # wrong extension; content is PNG

# Text
text = "\n".join(
    ["Orbit test document", "", "Line with café, naïve, €100 and “quotes”.", "Hindi: नमस्ते and emoji 🚀 should be replaced.",
     "A very long line " + "word " * 200, "", "\tTabbed line"]
    + [f"Row {i}: the quick brown fox jumps over the lazy dog." for i in range(150)]
)
open(p("notes.txt"), "w", encoding="utf-8").write(text)
open(p("data.csv"), "w", encoding="utf-8").write("id,name,amount\n" + "\n".join(f"{i},Item {i},{i*3.5}" for i in range(80)))
open(p("latin1.txt"), "wb").write("Caf\xe9 cr\xe8me br\xfbl\xe9e".encode("latin-1"))

# PDF and DOCX made by LibreOffice, a third-party producer
work = os.path.join(out, "_lo")
os.makedirs(work, exist_ok=True)
src = os.path.join(work, "Report.txt")
open(src, "w", encoding="utf-8").write("Quarterly Report\n\nRevenue grew in every region.\n" + "\f".join(
    f"Page {i} body text for extraction checks.\n" for i in range(1, 4)))
subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", work, src], check=True, capture_output=True, timeout=180)
subprocess.run(["soffice", "--headless", "--convert-to", "docx:MS Word 2007 XML", "--outdir", work, src], check=True, capture_output=True, timeout=180)
shutil.copy(os.path.join(work, "Report.pdf"), p("report.pdf"))
shutil.copy(os.path.join(work, "Report.docx"), p("report.docx"))
shutil.rmtree(work)

# Multi-page PDF (3 pages) and a password-protected copy
w = PdfWriter()
for _ in range(3):
    w.add_blank_page(width=300, height=400)
w.write(p("blank3.pdf"))
r = PdfReader(p("report.pdf"))
w = PdfWriter()
for page in r.pages:
    w.add_page(page)
w.encrypt("secret")
w.write(p("locked.pdf"))

# Image-only PDF (no text layer)
buf = io.BytesIO()
img.convert("RGB").save(buf, format="PDF")
open(p("scanned.pdf"), "wb").write(buf.getvalue())

# Rich Word document (python-docx): headings, bold/italic, lists, table, picture, non-Latin text
import docx as pydocx
from docx.shared import Inches
d = pydocx.Document()
d.add_heading("Launch Plan", level=1)
para = d.add_paragraph("This plan has ")
para.add_run("bold words").bold = True
para.add_run(" and ")
para.add_run("italic words").italic = True
para.add_run(".")
d.add_heading("Milestones", level=2)
for item in ["Finish prototype", "Run user tests"]:
    d.add_paragraph(item, style="List Bullet")
for item in ["Draft listing", "Submit to store"]:
    d.add_paragraph(item, style="List Number")
t = d.add_table(rows=3, cols=3)
for r, row in enumerate([["Region", "Owner", "Budget"], ["North", "Asha", "1200"], ["South", "Ben", "950"]]):
    for c, v in enumerate(row):
        t.cell(r, c).text = v
d.add_picture(p("alpha.png"), width=Inches(3))
d.add_paragraph("Greeting in Hindi: नमस्ते दुनिया")
d.save(p("plan.docx"))

# Workbook (openpyxl), then recalculated by LibreOffice so formula results are cached like a real Excel file
import datetime
import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Sales"
ws.append(["Region", "Units", "Price", "Revenue", "Date"])
for i, (region, units, price) in enumerate([("North", 120, 9.5), ("South", 80, 12.25), ("East", 45, 20)], start=2):
    ws.append([region, units, price, f"=B{i}*C{i}", datetime.date(2026, 3, 13 + i)])
ws.append(["Total", "=SUM(B2:B4)", None, "=SUM(D2:D4)", None])
staff = wb.create_sheet("Staff")
staff.append(["Name", "Role"])
staff.append(["Asha", "Lead"])
hidden = wb.create_sheet("Secret")
hidden.append(["do not export"])
hidden.sheet_state = "hidden"
wide = openpyxl.Workbook()
wws = wide.active
wws.title = "Wide"
wws.append([f"Column {c}" for c in range(1, 11)])
for r in range(300):
    wws.append([f"r{r}c{c}" for c in range(1, 11)])
raw = os.path.join(out, "_raw")
os.makedirs(raw, exist_ok=True)
wb.save(os.path.join(raw, "sales.xlsx"))
wide.save(os.path.join(raw, "wide.xlsx"))
for name in ["sales.xlsx", "wide.xlsx"]:
    subprocess.run(["soffice", "--headless", "--convert-to", "xlsx:Calc MS Excel 2007 XML", "--outdir", out, os.path.join(raw, name)], check=True, capture_output=True, timeout=180)
shutil.rmtree(raw)

# CSV edge cases: quoted commas, embedded newline, leading zeros, semicolons elsewhere
open(p("tricky.csv"), "w", encoding="utf-8").write('id,name,note\n007,"Smith, J","line one\nline two"\n42,Ana,"say ""hi"""\n')

# Legacy / protected Office containers (OLE header) should be refused with a clear reason
ole = bytes([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]) + bytes(504)
open(p("old.xls"), "wb").write(ole)
open(p("protected.docx"), "wb").write(ole)

print("fixtures:", sorted(os.listdir(out)))
