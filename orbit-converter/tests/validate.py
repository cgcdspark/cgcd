"""Inspects a converted file with tools that share no code with the app. Prints JSON."""
import io
import json
import subprocess
import sys
import zipfile

from PIL import Image


def image_info(data):
    im = Image.open(io.BytesIO(data))
    fmt = im.format
    im.load()  # full decode: catches truncated or corrupt pixel data
    return {"format": fmt, "width": im.width, "height": im.height, "mode": im.mode}


def pdf_info(path):
    info = subprocess.run(["pdfinfo", path], capture_output=True, text=True)
    if info.returncode != 0:
        return {"format": None, "error": info.stderr.strip()}
    pages = int(next(l.split()[-1] for l in info.stdout.splitlines() if l.startswith("Pages:")))
    text = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True).stdout
    return {"format": "PDF", "pages": pages, "text": text}


def main(path):
    data = open(path, "rb").read()
    if data[:5] == b"%PDF-":
        return pdf_info(path)
    if data[:4] == b"PK\x03\x04":
        z = zipfile.ZipFile(io.BytesIO(data))
        return {"format": "ZIP", "entries": [{"name": n, **image_info(z.read(n))} for n in z.namelist()]}
    try:
        return image_info(data)
    except Exception:
        pass
    try:
        return {"format": "TEXT", "text": data.decode("utf-8")}
    except UnicodeDecodeError:
        return {"format": None}


print(json.dumps(main(sys.argv[1])))
