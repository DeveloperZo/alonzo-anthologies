"""Tests for the harder function task. Usage: python test_header.py <candidate.py>
Prints "<passed> <total>" on the last line.
Run with a reference: python test_header.py tests/ref_header.py"""
import importlib.util
import sys

VERIFY = """# Verify the home library from limesalt

<!--
Purpose: Brief for a person or an agent on limesalt to prove the laptop can use the desktop server.
Status: working
Owner: zo
Human id: home-library-client-verify
Update trigger: when a service, port or route on the desktop changes
Last updated: 2026-11-18
-->

Body text: this colon must not matter.
"""

ARCH = """# ARCH-003 Hosting

<!--
Audience: owner, collaborators, new agents
Sources:
  - build.sh, wrangler.toml (HEAD c6dadfe)
  - Cloudflare API, read-only GET: /accounts/<id>/pages/projects
    and /zo-garden (source, build_config)
  - local git: git remote -v
Human id: hosting
Last synthesized: 2026-10-14
-->
"""

CASES = [
    ("verify header", VERIFY, {
        "purpose": "Brief for a person or an agent on limesalt to prove the laptop can use the desktop server.",
        "status": "working",
        "owner": "zo",
        "human_id": "home-library-client-verify",
        "update_trigger": "when a service, port or route on the desktop changes",
        "last_updated": "2026-11-18",
    }),
    ("list with colons and a continuation", ARCH, {
        "audience": "owner, collaborators, new agents",
        "sources": [
            "build.sh, wrangler.toml (HEAD c6dadfe)",
            "Cloudflare API, read-only GET: /accounts/<id>/pages/projects and /zo-garden (source, build_config)",
            "local git: git remote -v",
        ],
        "human_id": "hosting",
        "last_synthesized": "2026-10-14",
    }),
    ("no comment", "# Title\n\nPurpose: none\n", {}),
    ("unclosed comment", "# Title\n<!--\nPurpose: x\n", {}),
    ("single line comment", "<!-- Purpose: x -->\n", {"purpose": "x"}),
    ("later key wins", "<!--\nOwner: a\nOwner: b\n-->", {"owner": "b"}),
    ("value keeps later colons", "<!--\nUpdate trigger: when a: b changes\n-->", {"update_trigger": "when a: b changes"}),
    ("only the first comment", "<!--\nA: 1\n-->\n<!--\nB: 2\n-->", {"a": "1"}),
    ("scalar continuation", "<!--\nPurpose: first part\n  second part\nOwner: zo\n-->",
     {"purpose": "first part second part", "owner": "zo"}),
    ("empty value, no items", "<!--\nSources:\nOwner: zo\n-->", {"sources": "", "owner": "zo"}),
    ("empty value then continuation", "<!--\nPurpose:\n  filled in below\n-->", {"purpose": "filled in below"}),
    ("tab indent and blank lines", "<!--\nSources:\n\n\t- one\n\n\t- two\n-->", {"sources": ["one", "two"]}),
    ("key spacing and case", "<!--\n  Ignored: indented before any key\nLast   Updated :  2026-11-18  \n-->",
     {"last_updated": "2026-11-18"}),
    ("unindented line without colon is ignored", "<!--\nOwner: zo\njust a note\nStatus: working\n-->",
     {"owner": "zo", "status": "working"}),
    ("windows line endings", "<!--\r\nOwner: zo\r\nSources:\r\n  - a\r\n-->\r\n", {"owner": "zo", "sources": ["a"]}),
]


def main():
    spec = importlib.util.spec_from_file_location("candidate", sys.argv[1])
    mod = importlib.util.module_from_spec(spec)
    passed = 0
    try:
        spec.loader.exec_module(mod)
        fn = mod.parse_doc_header
    except Exception as exc:
        print(f"load error: {exc!r}")
        print(f"0 {len(CASES)}")
        return
    for name, text, want in CASES:
        try:
            got = fn(text)
        except Exception as exc:
            got = f"raised {exc!r}"
        if got == want:
            passed += 1
        else:
            print(f"FAIL {name}: want {want!r}, got {got!r}")
    print(f"{passed} {len(CASES)}")


main()
