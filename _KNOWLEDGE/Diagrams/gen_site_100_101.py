"""Generates the two most general site pictures: DIA-100 (what the repository is for) and DIA-101 (the pieces).
Run from this folder:  python gen_site_100_101.py .
The helpers come from the home library generator, so the two sets look alike. Do not edit an SVG by hand."""
import os, sys, textwrap
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "williams-home-library", "diagrams"))
from gen_diagrams import STYLE, T, L, RECT, box, sbox, circ, head, foot, swatch, G, GS, B, BS, A, AS, R, MU, BG  # noqa: E402,F401

FRAME = "#9D9A95"


def dia100():
    p, H = "s100", 610
    s = head(p, H, "DIA-100 · What this repository is for",
             "A plain-language overview. On the left is Zo's computer, which holds one folder with four series of work. "
             "The website: essays and an illustrated series, the pages people read. The resume: an interactive resume; its cover letters stay off the site. "
             "The home library: our own AI at home, which has its own set of pictures. Checking AI work: a way to check what AI did, plans only, nothing built yet. "
             "The same folder also holds the project notes, which are never published. "
             "On the right is the one road to the public website, in three steps. One: Zo sends the changes up to the online copy (GitHub), "
             "which keeps a copy of the whole folder in public. Two: the online copy tells the publisher (Cloudflare Pages), "
             "which makes web pages from the website and the resume only. Three: the publisher puts the pages up on the live site, "
             "alonzo-anthologies.pages.dev, where anyone can read the essays, the series and the resume. "
             "The small grey print under each box is the real name of the program or folder.",
             "DIA-100 · WHAT IT IS FOR", "One folder of Zo's work, in four series. Two of them become the public website.")
    # frame: Zo's computer
    s += RECT(24, 84, 496, 424, "none", FRAME, 14, 1.5)
    s += T(40, 106, "ZO'S COMPUTER", 12, MU, w="700", ls=True)
    s += T(40, 123, "Everything is written here first · the working copy", 12, MU)
    s += box(40, 140, 224, 92, G, GS, "THE WEBSITE", "essays and an illustrated series", "the pages people read", "website-series")
    s += box(280, 140, 224, 92, G, GS, "THE RESUME", "an interactive resume", "cover letters stay off the site", "resume-series")
    s += box(40, 250, 224, 92, MU, BG, "THE HOME LIBRARY", "our own AI at home", "has its own set of pictures", "williams-home-library")
    s += box(280, 250, 224, 92, MU, BG, "CHECKING AI WORK", "a way to check what AI did", "plans only, nothing built yet", "gatekeeper-series")
    s += RECT(40, 368, 464, 1, "none", "#E2DFD6", 0, 1)
    s += T(40, 392, "ALSO IN THE FOLDER", 12, MU, w="700", ls=True)
    s += sbox(40, 404, 464, MU, BG, "THE PROJECT NOTES, NEVER PUBLISHED", "plans, decisions and pictures like this one", "_KNOWLEDGE", h=84)
    # the road
    s += T(826, 106, "THE ONE ROAD TO THE PUBLIC WEBSITE", 12, MU, "middle", "700", ls=True)
    s += L(520, 186, 673, 186, B, p) + L(826, 232, 826, 273, B, p) + L(826, 368, 826, 409, B, p)
    s += box(676, 140, 300, 92, B, BS, "THE ONLINE COPY", "a copy of the whole folder,", "kept on the internet, in public", "GitHub")
    s += box(676, 276, 300, 92, B, BS, "THE PUBLISHER", "makes web pages from the", "website and the resume only", "Cloudflare Pages")
    s += box(676, 412, 300, 92, G, GS, "THE LIVE SITE", "the essays, the series and the resume", "anyone can read it", "alonzo-anthologies.pages.dev")
    s += circ(596, 186, 1) + circ(826, 252, 2) + circ(826, 388, 3)
    s += T(596, 152, "send the", 12.5, B, "middle", "600") + T(596, 168, "changes up", 12.5, B, "middle", "600")
    s += T(596, 214, "git push", 11, MU, "middle")
    s += T(846, 256.5, "tells the publisher", 12.5, B, w="600")
    s += T(846, 392.5, "puts the pages up", 12.5, B, w="600")
    # what does not happen, in the gap between frame and road
    s += T(536, 300, "Nothing is uploaded", 12.5, MU) + T(536, 317, "by hand. Sending", 12.5, MU)
    s += T(536, 334, "the changes up", 12.5, MU) + T(536, 351, "starts the rest.", 12.5, MU)
    # legend
    ly = 546
    s += swatch(24, ly, GS, G, "ends up on the public website")
    s += swatch(276, ly, BG, MU, "stays off the website")
    s += swatch(470, ly, BS, B, "the road: services on the internet")
    s += circ(752, ly - 4, "n") + T(772, ly, "a step, in order", 12.5, MU)
    return s + foot(H, "DIA-100 · What it is for: four series live in one folder, and the website and the resume travel one road to the public site.")


# name, small grey print, what, why, address chip, how you use it
GROUPS = [
    ("WHERE THE WORK IS KEPT", B, [
        ("Zo's computer", "the working copy",
         "The folder on Zo's computer where everything is written and changed",
         "Nothing reaches the internet until Zo sends it up",
         "", "Write and save here, as usual"),
        ("The online copy", "GitHub",
         "A copy of the whole folder on the internet, with every past change. Anyone can read it",
         "It is the copy the publisher reads, and it lets the work travel between computers",
         "", "Send the changes up (git push)"),
        ("The main copy", "the main branch",
         "The one version in the online copy that counts as finished",
         "Whatever is in it is what the public sees on the live site",
         "", "Send changes to it only when they are ready to be seen"),
    ]),
    ("THE ROAD TO THE SITE", B, [
        ("The publisher", "Cloudflare Pages",
         "A free service on the internet. It hears about each change sent up, makes the site and puts it up",
         "Nobody uploads anything by hand. Sending the changes up is the whole job",
         "", "Nothing to do. It starts by itself after each send"),
        ("The page maker", "Quartz, run by build.sh",
         "A program the publisher runs. It turns plain written files into web pages",
         "Zo writes plain text and never makes a page by hand. A file marked as a draft is left out",
         "", "Nothing to do. The publisher runs it each time"),
    ]),
    ("WHAT THE PUBLIC SEES", G, [
        ("The live site", "the public website",
         "The website anyone can open: the essays, the illustrated series and the resume",
         "It is the reason for all the rest: a public home for Zo's writing",
         "alonzo-anthologies.pages.dev", "in a web browser"),
        ("The resume app", "the resume SPA",
         "An interactive resume. It is a small program of its own, made in the same run as the pages",
         "A recruiter can explore the resume and download it as a PDF",
         "/resume/", "after the live site's address"),
        ("A trial copy", "branch preview",
         "A change sent up beside the main copy gets a web address of its own",
         "See a change on a real page before it replaces the live site",
         "", "Open the address the publisher gives. It is public too"),
    ]),
    ("NEVER ON THE SITE", MU, [
        ("The project notes, never published", "_KNOWLEDGE",
         "The plans, the decisions and the pictures, such as this one",
         "So the reasons behind the work are written down and travel with it",
         "", "Read them in the folder, or in the online copy"),
    ]),
]
NOTES = [
    ("LEFT OVER", "The old duplicate site (zo-garden): an earlier publisher project that still puts up a second copy of the site. To be retired."),
    ("LEFT OVER", "The old shelf, closed (GitLab, archived): the work was kept there for a few hours on 2026-10-14. Nothing goes there now."),
]
COLS = (24, 222, 478, 742)   # name, what, why, how you use it
WRAP = (39, 40, 35)          # characters per line for what, why, use (13 px text)
NAMEW = 22                   # characters per line for the name (15.5 px bold)
LINE = "#E2DFD6"


def dia101():
    p = "s101"
    body = []
    y = 104
    for title, color, rows in GROUPS:
        body.append(RECT(24, y, 952, 22, BG, LINE, 4, 1))
        body.append(T(34, y + 15.5, title, 12, MU, w="700", ls=True))
        y += 22
        for i, (name, prog, what, why, addr, use) in enumerate(rows):
            if i:
                body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="{LINE}" stroke-width="1"/>\n')
            ln = textwrap.wrap(name, NAMEW)
            lw, ly, lu = textwrap.wrap(what, WRAP[0]), textwrap.wrap(why, WRAP[1]), textwrap.wrap(use, WRAP[2])
            n = max(len(lw), len(ly), len(lu) + (1 if addr else 0), len(ln) + 1)
            h = 22 + 18 * n + 6
            t = y + 27          # first baseline
            for k, line in enumerate(ln):
                body.append(T(COLS[0], t + 18 * k, line, 15.5, color, w="700"))
            body.append(T(COLS[0], t + 18 * len(ln), prog, 11.5, MU))
            for k, line in enumerate(lw):
                body.append(T(COLS[1], t + 18 * k, line, 13))
            for k, line in enumerate(ly):
                body.append(T(COLS[2], t + 18 * k, line, 13, i=True))
            k0 = 0
            if addr:
                w = round(len(addr) * 7.4 + 14)
                body.append(RECT(COLS[3], t - 13.5, w, 19, BG, G, 4, 1))
                body.append(T(COLS[3] + w / 2, t, addr, 12, G, "middle", "600", m=True))
                k0 = 1
            for k, line in enumerate(lu):
                body.append(T(COLS[3], t + 18 * (k + k0) + (2 if k0 else 0), line, 13, MU))
            y += h
    for label, text in NOTES:
        body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="{LINE}" stroke-width="1"/>\n')
        body.append(T(24, y + 21.5, label, 12, MU, w="700", ls=True))
        body.append(T(110, y + 21.5, text, 13, MU))
        y += 34
    body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="{LINE}" stroke-width="1"/>\n')
    y += 28
    body.append(RECT(24, y - 13.5, 221, 19, BG, G, 4, 1))
    body.append(T(134.5, y, "alonzo-anthologies.pages.dev", 12, G, "middle", "600", m=True))
    body.append(T(255, y, "an address to type into a web browser. It works for anyone, anywhere.", 12.5, MU))
    H = y + 56
    desc = ("A plain-language table of the pieces that publish the website, in four groups. Each row gives a plain name with the real name in small print, "
            "what it is, why we have it, and how you use it. Where the work is kept: Zo's computer (the working copy), the online copy (GitHub), "
            "and the main copy (the main branch). The road to the site: the publisher (Cloudflare Pages) and the page maker (Quartz, run by build.sh). "
            "What the public sees: the live site at alonzo-anthologies.pages.dev, the resume app at /resume/, and a trial copy (branch preview). "
            "Never on the site: the project notes (_KNOWLEDGE). Two things are left over: the old duplicate site (zo-garden), to be retired, "
            "and the old shelf, closed (GitLab, archived).")
    s = head(p, H, "DIA-101 · The pieces: what each piece is, why we have it, and how you use it", desc,
             "DIA-101 · THE PIECES", "What is each piece of the publishing system, why do we have it, and how do you use it?")
    s += '  <g font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">\n'
    s += f'    <text x="{COLS[0]}" y="97">NAME</text><text x="{COLS[1]}" y="97">WHAT IT IS</text><text x="{COLS[2]}" y="97">WHY WE HAVE IT</text><text x="{COLS[3]}" y="97">HOW YOU USE IT</text>\n  </g>\n'
    return s + "".join(body) + foot(H, "DIA-101 · The pieces: what each piece of the publishing system is, why we have it, and how you use it.")


FILES = (("DIA-100-WhatItIsFor.svg", dia100), ("DIA-101-ThePieces.svg", dia101))
if __name__ == "__main__":
    OUT = sys.argv[1]
    for name, fn in FILES:
        with open(f"{OUT}/{name}", "w", encoding="utf-8", newline=chr(10)) as f:
            f.write(fn())
        print("wrote", name)
