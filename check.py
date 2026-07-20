"""Self-check: python check.py — fails loudly if the site is broken.

ponytail: counts .es vs .en instead of verifying each pair is adjacent. Catches the
real mistake (adding text in one language only). Upgrade to a DOM walk if pairs ever
get nested in a way where counts match but placement doesn't.
"""
import os
import re
from datetime import datetime, timezone, timedelta

html = open("index.html", encoding="utf-8").read()

es, en = html.count('class="es"'), html.count('class="en"')
assert es == en, f"language spans unbalanced: {es} .es vs {en} .en"
assert es > 20, f"suspiciously few translated strings: {es}"

missing = [p for p in re.findall(r'(?:src|href)="([^"#:]+)"', html) if not os.path.exists(p)]
assert not missing, f"broken local references: {missing}"

leftovers = re.findall(r"lani|zinkov|brooklyn|forms\.gle/ju61", html, re.I)
assert not leftovers, f"leftover template content: {set(leftovers)}"

# countdown target must match the invitation and still be in the future
target = re.search(r"new Date\('([^']+)'\)", open("js/boda.js", encoding="utf-8").read()).group(1)
wedding = datetime.fromisoformat(target)
assert wedding == datetime(2026, 12, 26, 16, 0, tzinfo=timezone(timedelta(hours=-6))), wedding
assert wedding > datetime.now(timezone.utc), "wedding date is in the past"

for form in ("kiYMNmNj8u4sWkAA8", "rVYcaES9pdh42AKg8"):
    assert form in html, f"missing RSVP form link: {form}"

# every lightbox image needs a thumbnail, a full size, and alt text in both languages
shots = re.findall(r'data-full="([^"]+)"', html)
assert len(shots) == len(re.findall(r'data-alt-es="', html)) == len(re.findall(r'data-alt-en="', html))
assert all(re.findall(r'data-alt-es="([^"]+)"', html)), "empty alt text"
thumbs = [f for f in os.listdir("images/gallery") if f.endswith("-t.jpg")]
assert len(thumbs) == len([s for s in shots if "gallery/" in s]), "thumbnail/photo count mismatch"

heavy = [p for p in shots if os.path.getsize(p) > 700_000]
assert not heavy, f"images too heavy for mobile, re-encode: {heavy}"

print(f"ok — {es} bilingual strings, {(wedding - datetime.now(timezone.utc)).days} days to go")
