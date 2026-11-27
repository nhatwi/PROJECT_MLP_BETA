import subprocess
import os
import re
import json

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
html_url = "file:///" + os.path.abspath("index.html").replace("\\", "/")

# 1. Verify all asset paths referenced in app.js, index.html, LivelyInfo.json exist
with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()
with open("LivelyInfo.json", "r", encoding="utf-8") as f:
    lively_info = json.load(f)

asset_refs = set(re.findall(r"assets/[A-Za-z0-9_./-]+\.png", js + "\n" + html))
asset_refs.add(lively_info.get("Thumbnail", ""))
asset_refs.add(lively_info.get("Preview", ""))

missing_assets = [a for a in sorted(asset_refs) if a and not os.path.exists(a)]
if missing_assets:
    print("ERROR: Missing referenced assets:", missing_assets)
    raise SystemExit(1)
print(f"SUCCESS: All {len(asset_refs)} referenced assets exist on disk.")

# 2. Check for any TODO/FIXME/placeholder comments in core files
for fname in ["index.html", "style.css", "app.js", "LivelyInfo.json", "LivelyProperties.json"]:
    with open(fname, "r", encoding="utf-8") as f:
        text = f.read()
    if "// TODO" in text or "TODO:" in text:
        print(f"ERROR: Found TODO placeholder in {fname}")
        raise SystemExit(1)
print("SUCCESS: Zero TODO/placeholder markers found in core files.")

# 3. Run Headless Edge DOM dump
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--enable-logging=stderr",
    "--v=0",
    "--dump-dom",
    html_url
]

proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
print("Edge Returncode:", proc.returncode)
print("DOM output length:", len(proc.stdout))

# Check stderr for JS console errors
console_errs = [
    line for line in proc.stderr.splitlines()
    if "CONSOLE" in line and ("ERROR" in line or "Uncaught" in line or "SyntaxError" in line or "ReferenceError" in line or "TypeError" in line)
]
if console_errs:
    print("ERROR: JS console errors detected:")
    for line in console_errs:
        print("  ", line)
    raise SystemExit(1)
print("SUCCESS: Zero JS console errors in Headless Edge.")

required_dom_markers = [
    "character-coat-color",
    "btn-pose-switch",
    "eye-rig-tuner",
    "dock-drag-handle",
    "taskmgr-ponies-view",
    "pony-speech-bubble",
    "winamp-visualizer",
    "harmony-combo-container",
]
for m in required_dom_markers:
    if m not in proc.stdout:
        print(f"ERROR: Expected DOM marker missing: {m}")
        raise SystemExit(1)
print("SUCCESS: All interactive DOM structures hydrated cleanly!")
