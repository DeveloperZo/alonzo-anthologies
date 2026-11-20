"""Generates DIA-102 (where the work lives) and DIA-103 (from sent to seen).
Run from this folder:  python gen_site_102_103.py .
Helpers come from the home library generator so the two sets look alike. Do not edit an SVG by hand."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "anthologies" / "home-library-series" / "diagrams"))
from gen_diagrams import STYLE, T, L, RECT, box, sbox, circ, head, foot, swatch, G, GS, B, BS, A, AS, R, MU, BG  # noqa: E402,F401

FRAME = "#9D9A95"


def gbox(x, y, w, name, line1, line2, small, size=16):
    """A left-over piece: grey, dashed outline."""
    cx = x + w / 2
    return (RECT(x, y, w, 92, BG, MU, 12, 2, "6,4") + T(cx, y + 26, name, size, MU, "middle", "700")
            + T(cx, y + 47, line1, 13, MU, "middle") + T(cx, y + 65, line2, 13, MU, "middle")
            + T(cx, y + 84, small, 11, MU, "middle"))


def dashed(x1, y1, x2, y2, pfx):
    return (f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{MU}" stroke-width="2.5" '
            f'stroke-dasharray="6,4" marker-end="url(#{pfx}-gray)"/>\n')


def notes(x, y, title, lines):
    s = T(x, y, title, 12, MU, w="700", ls=True)
    for k, t in enumerate(lines):
        s += T(x, y + 24 + 19 * k, t, 13.5)
    return s


def dia102():
    p, H = "s102", 632
    s = head(p, H, "DIA-102 · Where the work lives",
             "One road, left to right. On the left, Zo's computer (the working copy). It holds the work: every page, "
             "picture and program. New work exists only there until it is sent. It also holds the secrets folder (_ENV), "
             "with a key to the publisher account, which stays on the computer and is never sent up. Zo sends the changes "
             "up (git push) to the online copy on GitHub, which is public. Inside the online copy is the main copy (the "
             "main branch), the version the live site is made from. From there the publisher takes over, shown in DIA-103. "
             "Before sending, Zo checks by hand that no password is going along; nothing else checks. Two things are left "
             "over. The old shelf (GitLab, archived) held the work for a few hours and was closed on 2026-10-14; nothing "
             "goes there. The old duplicate site (zo-garden) still gets every change made to the main copy, until it is retired.",
             "DIA-102 · WHERE THE WORK LIVES", "Where does the work live, and how does a change leave Zo's computer?")
    # Zo's computer
    s += RECT(24, 84, 300, 286, "none", FRAME, 14, 1.5)
    s += T(40, 106, "ZO'S COMPUTER", 12, MU, w="700", ls=True) + T(40, 123, "the working copy", 12, MU)
    s += box(40, 140, 268, 92, B, BS, "THE WORK", "every page, picture and program", "new work is only here until sent", "the folder alonzo-anthologies")
    s += box(40, 262, 268, 92, B, BG, "THE SECRETS FOLDER", "a key to the publisher account", "stays here, is never sent up", "_ENV")
    # the one road
    s += L(308, 186, 513, 186, B, p)
    s += T(416, 170, "send the changes up", 12.5, B, "middle", "600") + T(416, 206, "git push", 11, MU, "middle")
    s += notes(344, 268, "BEFORE SENDING", [])
    for k, t in enumerate(["Zo checks by hand that", "no password is going", "along. Nothing else", "checks."]):
        s += T(344, 290 + 18 * k, t, 13)
    # the online copy
    s += RECT(500, 84, 300, 166, "none", FRAME, 14, 1.5)
    s += T(516, 106, "THE ONLINE COPY", 12, MU, w="700", ls=True) + T(516, 123, "GitHub · public, anyone can read it", 12, MU)
    s += box(516, 140, 268, 92, G, GS, "THE MAIN COPY", "the version that counts", "the live site is made from it", "the main branch")
    # hand-off to DIA-103
    s += L(784, 186, 853, 186, B, p)
    s += T(864, 174, "then the", 12.5, B, w="600") + T(864, 190, "publisher", 12.5, B, w="600") + T(864, 206, "takes over", 12.5, B, w="600")
    s += T(864, 224, "see DIA-103", 11, MU)
    # left over
    s += RECT(24, 400, 952, 136, "none", FRAME, 8, 1.2, "3,3")
    s += T(40, 420, "LEFT OVER", 12, MU, w="700", ls=True)
    s += gbox(40, 430, 268, "THE OLD SHELF, CLOSED", "held the work for a few hours", "closed 2026-10-14, nothing goes there", "GitLab, archived")
    s += gbox(516, 430, 268, "THE OLD DUPLICATE SITE", "a second copy of the live site", "kept going until it is retired", "zo-garden")
    s += dashed(650, 232, 650, 427, p)
    s += T(664, 300, "every change to the main copy", 12.5, MU) + T(664, 316, "is still copied here too", 12.5, MU)
    # legend
    s += swatch(24, 570, BS, B, "on Zo's computer") + swatch(200, 570, GS, G, "online, in use") + swatch(360, 570, BG, MU, "left over", "3,2")
    return s + foot(H, "DIA-102 · Where the work lives: one road, from Zo's computer up to the online copy. The rest is left over.")


def dia103():
    p, H = "s103", 662
    s = head(p, H, "DIA-103 · From sent to seen",
             "Six numbered steps. One: a change arrives at the online copy (GitHub) from Zo's computer, and the online copy "
             "tells the publisher (Cloudflare Pages) that a change has arrived. Two: the publisher hands the work to the page "
             "maker (Quartz, run by build.sh). Three: the page maker turns the work into web pages, on the publisher's "
             "machines. Four: the pages come back. Five: the publisher puts them on the internet. A change to the main copy "
             "goes to the live site, alonzo-anthologies.pages.dev. A change to any other copy becomes a trial copy at its own "
             "address, which is also public. Six: a visitor opens the live site and sees the change. Separately, the same "
             "change is published on the old duplicate site (zo-garden), which is left over until it is retired. Nobody "
             "uploads anything by hand. If the pages cannot be made, the site keeps showing the pages it had and no alarm goes off.",
             "DIA-103 · FROM SENT TO SEEN", "What happens after a change is sent up, until a visitor sees it?")
    # arrows
    s += L(244, 180, 387, 180, B, p) + L(610, 180, 753, 180, B, p) + L(756, 216, 613, 216, B, p)
    s += L(500, 242, 500, 337, B, p) + L(500, 300, 866, 300, B) + L(866, 299, 866, 337, B, p)
    s += L(500, 432, 500, 487, B, p)
    s += dashed(134, 242, 134, 337, p)
    # boxes
    s += box(24, 150, 220, 92, G, GS, "THE ONLINE COPY", "a change arrives here", "from Zo's computer (DIA-102)", "GitHub")
    s += box(390, 150, 220, 92, G, GS, "THE PUBLISHER", "starts by itself, then puts", "the pages on the internet", "Cloudflare Pages")
    s += box(756, 150, 220, 92, G, GS, "THE PAGE MAKER", "turns the work into web pages", "on the publisher's machines", "Quartz, run by build.sh")
    s += gbox(24, 340, 220, "THE OLD DUPLICATE SITE", "a second copy of the live site", "left over until it is retired", "zo-garden", 14.5)
    s += box(390, 340, 220, 92, G, GS, "THE LIVE SITE", "the real site", "open to everyone", "alonzo-anthologies.pages.dev")
    s += box(756, 340, 220, 92, G, GS, "A TRIAL COPY", "a try-out, at its own address", "public too: anyone can open it", "branch preview")
    s += RECT(390, 490, 220, 64, BS, B, 32) + T(500, 518, "A VISITOR", 15, B, "middle", "700") + T(500, 537, "sees the change", 13, B, "middle")
    # steps
    s += circ(317, 180, 1) + circ(683, 180, 2) + circ(756, 150, 3) + circ(683, 216, 4) + circ(500, 272, 5) + circ(500, 458, 6)
    s += T(317, 138, "says a change", 12.5, B, "middle", "600") + T(317, 154, "has arrived", 12.5, B, "middle", "600")
    s += T(683, 138, "hands the", 12.5, B, "middle", "600") + T(683, 154, "work over", 12.5, B, "middle", "600")
    s += T(683, 244, "the pages come back", 12.5, MU, "middle")
    s += T(520, 268, "puts the pages up", 12.5, B, w="600")
    s += T(488, 322, "a change to the main copy", 12.5, B, "end", "600")
    s += T(854, 322, "a change to any other copy", 12.5, B, "end", "600")
    s += T(520, 462.5, "opens the live site", 12.5, B, w="600")
    s += T(148, 286, "the same change is", 12.5, MU) + T(148, 302, "published here too", 12.5, MU)
    # notes
    s += notes(24, 478, "IF THE PAGES CANNOT BE MADE", ["Nothing changes. The site keeps", "showing the pages it had.", "No alarm goes off."])
    s += notes(700, 478, "NOBODY UPLOADS BY HAND", ["Sending the change up is all it", "takes. The rest happens by itself."])
    # legend
    s += circ(36, 596, "n") + T(56, 600.5, "a step, in order", 12.5, MU)
    s += swatch(200, 600, GS, G, "in use") + swatch(310, 600, BG, MU, "left over", "3,2")
    return s + foot(H, "DIA-103 · From sent to seen: the publisher has the pages made, then puts the main copy on the live site.")


FILES = (("DIA-102-SourceControl.svg", dia102), ("DIA-103-Hosting.svg", dia103))
if __name__ == "__main__":
    OUT = sys.argv[1]
    for name, fn in FILES:
        with open(f"{OUT}/{name}", "w", encoding="utf-8", newline=chr(10)) as f:
            f.write(fn())
        print("wrote", name)
