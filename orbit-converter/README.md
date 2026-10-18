# Orbit Converter (browser prototype)

A private file converter that runs entirely in the browser. Drop a file, pick the new
format from a radial menu, and save a checked copy. Your original file is never changed
and nothing is uploaded.

"Orbit Converter" is a working name. Check trademarks before selling under it.

This is the HTML prototype of a planned Windows (WPF) app. It proves the interaction
design and the conversion pipeline before the desktop build.

## Run it

- Open `index.html` in Chrome, Edge or Firefox. It needs an internet connection the first
  time to load its open-source libraries from public CDNs. Your files never leave the device.
- Or use the hosted copy on claude.ai (link in the project conversation).

## How to use

| Action | How |
|---|---|
| Convert | Drop files anywhere on the window, or **Choose files** (`Ctrl+O`) |
| Pick a format | Click a bubble, or use `←` `→` and `Enter`, or press `1`–`7` |
| Pick a format while dragging | Hold **Shift** while dragging files over the window, then drop onto a bubble |
| Cancel | `Esc` or click outside the ring |
| Save | **Save** on a row, or **Save all (.zip)** |

## Conversions

| From | To | Notes |
|---|---|---|
| PNG, JPEG, WebP, GIF, BMP | PNG, JPEG, WebP | JPEG quality 92, WebP 90; transparency flattened to white for JPEG; EXIF rotation applied. GIF uses the first frame. |
| PNG, JPEG, WebP, GIF, BMP | PDF | One page per image at its natural size. JPEG and PNG are embedded without re-compression. |
| Several images | One PDF | "Merge into one" bubble appears when 2+ images are dropped |
| PDF | PNG, JPEG | Rendered at 2× (max 6000 px side). Multi-page PDFs produce a ZIP of pages. |
| PDF | TXT | Text layer only. Scanned PDFs report "No selectable text" (no OCR yet). |
| TXT, MD, CSV, LOG, JSON… | PDF | A4, wrapped. CSV/LOG/JSON use a monospace font. UTF-8 or Windows-1252 input. |
| DOCX | TXT, HTML | Via Mammoth. Formatting is simplified. |

Formats are detected from file content, not the extension. A PNG named `photo.jpg` is
treated as a PNG.

Every output is checked before the Save button appears: file signature, plus a full
re-parse for PDFs and ZIPs. A file that fails the check is discarded and reported.

## Checklist

| Feature | Built | Tested |
|---|---|---|
| Drag and drop, file picker, multiple files | ✅ | ✅ automated (simulated drag events) |
| Radial menu with keyboard control and animations | ✅ | ✅ automated + screenshots |
| Shift-drag radial (inside the window) | ✅ | ✅ automated (simulated); real OS drag not yet tried by hand |
| PNG ↔ JPEG ↔ WebP, GIF/BMP input | ✅ | ✅ outputs decoded by Pillow |
| Images → PDF, merge to one PDF | ✅ | ✅ checked with poppler `pdfinfo` |
| PDF → PNG/JPEG (single and multi-page ZIP) | ✅ | ✅ |
| PDF → TXT | ✅ | ✅ on a LibreOffice-made PDF |
| TXT/CSV → PDF | ✅ | ✅ text read back with `pdftotext` |
| DOCX → TXT/HTML | ✅ | ✅ on a LibreOffice-made DOCX |
| Rejects empty, corrupt, mislabelled, password-protected and scanned inputs | ✅ | ✅ 7 cases |
| Batch queue with progress, failures, Save all | ✅ | ✅ |
| Phone layout (390 px) | ✅ | ✅ no horizontal scroll |
| DOCX → PDF | ❌ | Needs LibreOffice. Planned for the Windows app. |
| Non-Latin text (Hindi, CJK, emoji) in TXT → PDF | ⚠️ | Replaced with `?` and a warning. Needs an embedded Unicode font. |
| OCR for scanned PDFs | ❌ | Out of scope for now |
| Shift-drag from File Explorer without the window open | ❌ | Needs the Windows app (browsers can't see drags outside their window) |
| Offline use with no internet at all | ❌ | Libraries load from CDNs. Bundle them for the packaged app. |
| Manual check in Firefox and Safari | ❌ | Only Chromium tested so far |

## Limitations

- Browsers can't write next to the original file. Converted files go to your Downloads
  folder, or wherever you choose.
- Very large files are limited by browser memory. Files over 1 GB are refused, and
  images over 16,384 px on a side or 268 megapixels can't be converted.
- WebP output needs a browser that can encode WebP (Chrome, Edge, Firefox). If a
  browser can't, the check catches it and reports an error.

## Tests

The tests run the real page in headless Chromium and check every output with tools that
share no code with the app (Pillow, poppler). Fixtures are made with Pillow, LibreOffice
and pypdf.

```bash
cd tests
npm install                 # pdf.js, pdf-lib, JSZip, Mammoth, served instead of the CDNs
python3 make_fixtures.py    # needs Pillow, pypdf and LibreOffice
node run-tests.mjs          # needs Playwright with Chromium, and poppler-utils
```

## Third-party licences

All libraries allow commercial use:

| Library | Version | Licence |
|---|---|---|
| pdf.js (Mozilla) | 3.11.174 | Apache-2.0 |
| pdf-lib | 1.17.1 | MIT |
| JSZip | 3.10.1 | MIT (dual MIT/GPLv3, used under MIT) |
| Mammoth | 1.8.0 | BSD-2-Clause |
| Fonts: Sora, Manrope, JetBrains Mono | Google Fonts | SIL Open Font License |
