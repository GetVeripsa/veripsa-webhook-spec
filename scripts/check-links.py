from pathlib import Path
import re
from urllib.parse import unquote
root = Path(__file__).resolve().parents[1]
link_re = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
checked = 0
for md in sorted(root.rglob("*.md")):
    text = md.read_text(encoding="utf-8")
    for raw in link_re.findall(text):
        target = raw.split()[0].strip("<>")
        if target.startswith(("http://", "https://", "mailto:")) or target.startswith("#"):
            checked += 1
            continue
        path_part = unquote(target.split("#", 1)[0])
        if path_part and not (md.parent / path_part).resolve().exists():
            raise SystemExit(f"{md.relative_to(root)}: missing relative link {target}")
        checked += 1
print(f"checked {checked} Markdown links (relative targets + external URL syntax)")
