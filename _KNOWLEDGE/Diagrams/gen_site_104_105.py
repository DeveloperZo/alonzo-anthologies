"""Generates DIA-104 (site build) and DIA-105 (resume app) in plain language.
Run from this folder:  python gen_site_104_105.py .
Helpers and palette come from the home library generator so the two sets look alike.
Do not edit the SVGs by hand."""
import sys

sys.path.insert(0, r"F:\Programming\alonzo-anthologies\anthologies\home-library-series\diagrams")
from gen_diagrams import STYLE, T, L, RECT, box, sbox, circ, head, foot, swatch, G, GS, B, BS, A, AS, R, MU, BG  # noqa: E402,F401

TEXT = "#2A2A35"
EDGE = "#9D9A95"


def chip(x, y, w, color, name, line, h=52):
    cx = x + w / 2
    return RECT(x, y, w, h, BG, color, 8, 1.5) + T(cx, y + 22, name, 13, color, "middle", "700") + T(cx, y + 40, line, 12, color, "middle")


def dia104():
    p, H = "s104", 644
    s = head(p, H, "DIA-104 · Site build: from Zo's folders to the one finished folder",
             "Left to right. The writing folder holds Zo's written pages and their pictures. The page maker (Quartz, run by build.sh) reads only that folder, turns the writing into web pages, and leaves out any page marked draft. The resume app sits in its own folder. It is made ready alongside by an extra step added for this site, and placed at the address /resume/. Both land in one finished folder, which is made fresh every time and holds the web pages and the resume app. The publisher (Cloudflare Pages) puts that folder online as the live site. The project notes are never published, because the page maker never reads them. This runs by itself every time Zo sends the changes up. If a step fails, the live site stays as it was.",
             "DIA-104 · HOW THE SITE IS PUT TOGETHER", "How do Zo's written pages and the resume app become the one folder that gets published?")
    # arrows
    s += L(274, 196, 392, 196, B, p) + L(625, 196, 743, 196, B, p)
    s += L(274, 328, 743, 328, B, p)
    s += L(861, 404, 861, 457, B, p)
    # what Zo makes
    s += box(24, 150, 250, 92, B, BS, "THE WRITING FOLDER", "Zo's written pages", "and their pictures", "website-series/site/content")
    s += box(24, 282, 250, 92, B, BS, "THE RESUME APP", "kept in its own folder,", "with Zo's facts inside", "the resume SPA · resumeContent")
    # the automatic part
    s += box(395, 150, 230, 92, G, GS, "THE PAGE MAKER", "turns the writing into web pages", "leaves out pages marked draft", "Quartz, run by build.sh")
    s += RECT(746, 110, 230, 294, GS, G)
    s += T(861, 136, "THE FINISHED FOLDER", 16, G, "middle", "700") + T(861, 156, "everything the site needs", 13, G, "middle")
    s += chip(760, 170, 202, G, "THE WEB PAGES", "and their pictures")
    s += chip(760, 302, 202, G, "THE RESUME APP", "at the address /resume/")
    s += T(861, 250, "one folder,", 13, G, "middle") + T(861, 268, "made fresh every time", 13, G, "middle")
    s += T(861, 386, "website-series/site/public", 11, MU, "middle")
    s += box(746, 460, 230, 92, G, GS, "THE PUBLISHER", "puts the finished folder", "online as the live site", "Cloudflare Pages")
    # arrow labels
    s += T(333, 170, "reads only", 12.5, B, "middle", "600") + T(333, 186, "this folder", 12.5, B, "middle", "600")
    s += T(684, 170, "writes the", 12.5, B, "middle", "600") + T(684, 186, "web pages", 12.5, B, "middle", "600")
    s += T(510, 302, "made ready alongside,", 12.5, B, "middle", "600") + T(510, 318, "then placed at /resume/", 12.5, B, "middle", "600")
    s += T(510, 348, "by an extra step added for this site · StageResumeSpa", 11, MU, "middle")
    s += T(849, 436, "this folder goes online", 12.5, B, "end", "600")
    # never published
    s += RECT(24, 460, 250, 92, BG, MU, 12, 2, "5,4")
    s += T(149, 486, "THE PROJECT NOTES", 16, MU, "middle", "700") + T(149, 507, "never published", 13, MU, "middle")
    s += T(149, 525, "the page maker never reads them", 13, MU, "middle") + T(149, 544, "_KNOWLEDGE", 11, MU, "middle")
    # when it runs
    s += T(320, 474, "WHEN THIS RUNS", 12, MU, w="700", ls=True)
    for k, t in enumerate(["Every time Zo sends the changes up,", "the publisher runs all of this by itself.", "If a step fails, the live site stays as it was."]):
        s += T(320, 498 + 19 * k, t, 13.5, TEXT)
    s += swatch(24, 588, BS, B, "what Zo makes by hand") + swatch(240, 588, GS, G, "the automatic part") + swatch(430, 588, BG, MU, "kept out of the site", "3,3")
    return s + foot(H, "DIA-104 · Site build: the writing becomes web pages, the resume app goes in at /resume/, and one finished folder is published.")


def dia105():
    p, H = "s105", 608
    s = head(p, H, "DIA-105 · Resume app: from Zo's facts to the pages and the PDF",
             "Left to right. The data files hold Zo's facts: jobs, projects and dates, the summary and key skills, and the menu words and colors. To change the resume, change these files and nothing else. Every page of the resume app reads from them. The printed resume view is the resume laid out for printing, showing only the jobs chosen for print. The other pages are a timeline, the accomplishments, and a page for each job; they show every job. Only the printed resume view has a Download PDF button. The PDF is pictures of that view, not text: the app takes a picture of the view in the visitor's web browser, cuts it into page-sized strips, and saves one picture per page. The words in the PDF cannot be searched, selected or copied, and a program that reads resumes sees no words at all. A text version is planned.",
             "DIA-105 · RESUME APP", "How does the resume app turn Zo's facts into the pages and the PDF?")
    # arrows
    s += L(274, 176, 387, 176, B, p) + L(274, 336, 387, 336, B, p)
    s += L(640, 176, 743, 176, A, p)
    s += L(640, 336, 672, 336, MU) + L(674, 320, 674, 352, MU, w=4)
    # the data files
    s += RECT(24, 110, 250, 292, BS, B)
    s += T(149, 138, "THE DATA FILES", 16, B, "middle", "700") + T(149, 159, "Zo's facts, kept in one place", 13, B, "middle")
    for k, t in enumerate(["jobs, projects and dates", "the summary and key skills", "menu words and colors"]):
        s += RECT(40, 180 + 42 * k, 218, 32, BG, B, 8, 1.5) + T(149, 201 + 42 * k, t, 13, B, "middle")
    s += T(149, 330, "To change the resume,", 13, B, "middle", i=True) + T(149, 348, "change these. Nothing else.", 13, B, "middle", i=True)
    s += T(149, 384, "resume-series/resumeContent/src/data", 11, MU, "middle")
    # the pages
    s += box(390, 130, 250, 92, G, GS, "THE PRINTED RESUME VIEW", "the resume, laid out for printing", "only the jobs chosen for print", "/resume/#/resume")
    s += box(390, 290, 250, 92, G, GS, "THE OTHER PAGES", "a timeline, the accomplishments,", "and a page for each job", "they show every job")
    # the PDF
    s += box(746, 130, 230, 92, A, AS, "THE PDF", "pictures of that view, not text", "one picture per page", "Alonzo_Williams_Resume.pdf")
    # arrow labels
    s += T(330, 150, "every page", 12.5, B, "middle", "600") + T(330, 166, "reads these", 12.5, B, "middle", "600")
    s += T(330, 310, "the same", 12.5, B, "middle", "600") + T(330, 326, "facts", 12.5, B, "middle", "600")
    s += T(692, 150, "the Download", 12.5, A, "middle", "600") + T(692, 166, "PDF button", 12.5, A, "middle", "600")
    s += T(692, 198, "only here", 12, MU, "middle")
    s += T(686, 332, "no PDF", 12.5, MU, w="700") + T(686, 349, "from these pages", 12.5, MU)
    # notes
    s += T(390, 440, "HOW THE PDF IS MADE", 12, MU, w="700", ls=True)
    for k, t in enumerate(["The app takes a picture of the printed", "resume view, in the visitor's own web", "browser, and cuts it into page-sized strips."]):
        s += T(390, 464 + 19 * k, t, 13.5, TEXT)
    s += T(700, 440, "WHAT THAT MEANS", 12, MU, w="700", ls=True)
    for k, t in enumerate(["The words in the PDF cannot be searched,", "selected or copied. A program that reads", "resumes sees no words. A fix is planned."]):
        s += T(700, 464 + 19 * k, t, 13.5, TEXT)
    s += swatch(24, 552, BS, B, "Zo's facts, changed by hand") + swatch(270, 552, GS, G, "pages a visitor sees") + swatch(470, 552, AS, A, "the file a visitor downloads: pictures only")
    return s + foot(H, "DIA-105 · Resume app: change the facts in the data files. Only the printed resume view becomes the PDF, as pictures, not text.")


FILES = (("DIA-104-SiteBuild.svg", dia104), ("DIA-105-ResumeSpa.svg", dia105))
if __name__ == "__main__":
    OUT = sys.argv[1]
    for name, fn in FILES:
        with open(f"{OUT}/{name}", "w", encoding="utf-8", newline=chr(10)) as f:
            f.write(fn())
        print("wrote", name)
