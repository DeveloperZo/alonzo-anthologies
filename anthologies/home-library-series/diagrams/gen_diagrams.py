"""Generates the home library diagram set: DIA-100 to DIA-105 and DIA-200.
Run from this folder:  python gen_diagrams.py .
The helpers (STYLE, T, L, RECT, box, sbox, circ, head, foot, swatch) can be imported by other generators."""
import sys, textwrap
from xml.sax.saxutils import escape


STYLE = """  <defs>
    <style>
      :root {
        --bg: #FAFAF8; --paper: #F2EEE3; --text: #2A2A35; --muted: #6B6873; --muted2: #9D9A95; --line: #E2DFD6;
        --red: #A85B49; --blue: #4F627F; --blue-soft: #DEE3EC; --green: #5A8270; --green-soft: #DEE8E1;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #1B1D23; --paper: #1E2128; --text: #E8E5DC; --muted: #B8B5AD; --muted2: #908D87; --line: #3E3D38;
          --red: #D29183; --blue: #94A6C4; --blue-soft: #2A323F; --green: #92BAA6; --green-soft: #233029;
        }
      }
      text { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
      text.m, tspan.m { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; }
      [fill="#FAFAF8"] { fill: var(--bg); } [fill="#F2EEE3"] { fill: var(--paper); }
      [fill="#2A2A35"] { fill: var(--text); }
      [fill="#6B6873"] { fill: var(--muted); } [fill="#9D9A95"] { fill: var(--muted2); }
      [stroke="#E2DFD6"] { stroke: var(--line); } [stroke="#9D9A95"] { stroke: var(--muted2); }
      [fill="#A85B49"] { fill: var(--red); }
      [fill="#4F627F"] { fill: var(--blue); } [stroke="#4F627F"] { stroke: var(--blue); } [fill="#DEE3EC"] { fill: var(--blue-soft); }
      [fill="#5A8270"] { fill: var(--green); } [stroke="#5A8270"] { stroke: var(--green); } [fill="#DEE8E1"] { fill: var(--green-soft); }
    </style>
    <marker id="PFX-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 Z" fill="#4F627F"/></marker>
  </defs>
"""


def box(x, y, w, h, color, soft, name, line1, line2, small):
    cx = x + w / 2
    return f"""  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{soft}" stroke="{color}" stroke-width="2"/>
  <text x="{cx}" y="{y + 26}" text-anchor="middle" font-size="16" font-weight="700" fill="{color}">{escape(name)}</text>
  <text x="{cx}" y="{y + 47}" text-anchor="middle" font-size="13" fill="{color}">{escape(line1)}</text>
  <text x="{cx}" y="{y + 65}" text-anchor="middle" font-size="13" fill="{color}">{escape(line2)}</text>
  <text x="{cx}" y="{y + 84}" text-anchor="middle" font-size="11" fill="#6B6873">{escape(small)}</text>
"""


def dia106():
    G, GS, B, BS = "#5A8270", "#DEE8E1", "#4F627F", "#DEE3EC"
    arrow = 'stroke="#4F627F" stroke-width="2.5" marker-end="url(#d100-blue)"'
    s = f"""<svg viewBox="0 0 1000 670" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="d100-title d100-desc">
  <title id="d100-title">DIA-100 · Home library: what it is for</title>
  <desc id="d100-desc">A plain-language overview. On the left is you, at a laptop, at home or away. You can ask the Arbiter for help. The Arbiter is the AI that plans the job and checks the result. Today it is a paid AI on the internet (Claude Code); later it can be our own model. It hands the bulk reading and writing to the computer at home. On the computer at home the request arrives at the front door, which checks the caller's key and passes it to the home AI. The home AI reads, summarizes and drafts, and costs only electricity. The front door also writes a note of each request in the logbook. You can also use the chat page in a web browser to talk to the home AI directly. A movies and shows shelf also runs on the same computer and is not set up yet. The small grey print under each box is the real name of the program.</desc>
{STYLE.replace("PFX", "d100")}  <rect width="1000" height="670" fill="#F2EEE3"/>
  <text x="500" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#A85B49" letter-spacing="0.04em">DIA-100 · HOME LIBRARY: WHAT IT IS FOR</text>
  <text x="500" y="58" text-anchor="middle" font-size="14" fill="#6B6873">Our own AI at home. The small grey print is the real name of each program.</text>
  <!-- why note, top left -->
  <text x="24" y="112" font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">WHY HAVE IT</text>
  <text x="24" y="134" font-size="14" fill="#2A2A35">Private things, like health</text>
  <text x="24" y="153" font-size="14" fill="#2A2A35">records, should not sit on a</text>
  <text x="24" y="172" font-size="14" fill="#2A2A35">company's computers. The AI at</text>
  <text x="24" y="191" font-size="14" fill="#2A2A35">home reads them here, for free.</text>
  <text x="24" y="220" font-size="14" fill="#A85B49">While the Arbiter is a paid AI,</text>
  <text x="24" y="239" font-size="14" fill="#A85B49">use the chat page for anything</text>
  <text x="24" y="258" font-size="14" fill="#A85B49">private. It never leaves the house.</text>
  <!-- frames -->
  <rect x="430" y="80" width="546" height="486" rx="14" fill="none" stroke="#9D9A95" stroke-width="1.5"/>
  <text x="448" y="102" font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">THE COMPUTER AT HOME</text>
  <text x="448" y="119" font-size="12" fill="#6B6873">Only our own devices can reach it, over a private connection (Tailscale).</text>
  <rect x="440" y="420" width="526" height="134" rx="8" fill="none" stroke="#9D9A95" stroke-width="1.2" stroke-dasharray="3,3"/>
  <text x="452" y="438" font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">PAGES YOU CAN OPEN</text>
  <!-- arrows -->
  <line x1="144" y1="446" x2="144" y2="393" {arrow}/>
  <line x1="264" y1="342" x2="447" y2="342" {arrow}/>
  <line x1="264" y1="496" x2="447" y2="496" {arrow}/>
  <line x1="685" y1="342" x2="718" y2="342" {arrow}/>
  <line x1="567.5" y1="296" x2="567.5" y2="227" {arrow}/>
  <line x1="635" y1="450" x2="635" y2="391" {arrow}/>
"""
    s += box(24, 296, 240, 92, B, BS, "THE ARBITER", "plans the job, checks the result", "a paid AI today, or our own later", "Claude Code today")
    s += f"""  <rect x="24" y="450" width="240" height="92" rx="46" fill="#FAFAF8" stroke="#4F627F" stroke-width="2"/>
  <text x="144" y="490" text-anchor="middle" font-size="16" font-weight="700" fill="#4F627F">YOU</text>
  <text x="144" y="512" text-anchor="middle" font-size="13" fill="#4F627F">at a laptop, at home or away</text>
"""
    s += box(450, 132, 235, 92, G, GS, "THE LOGBOOK", "writes down every request", "so we can see what was saved", "Langfuse")
    s += box(450, 296, 235, 92, G, GS, "THE FRONT DOOR", "checks the caller's key", "passes the request to the AI", "LiteLLM")
    s += box(721, 296, 235, 92, G, GS, "THE HOME AI", "reads, summarizes and drafts", "costs only electricity", "Ollama, on the graphics card")
    s += box(450, 450, 235, 92, G, GS, "THE CHAT PAGE", "type a question, get an answer", "in a web browser", "Open WebUI")
    s += box(721, 450, 235, 92, G, GS, "MOVIES AND SHOWS", "our own films and music", "on any of our screens", "Jellyfin · not set up yet")
    s += """  <!-- arrow labels -->
  <text x="158" y="424" font-size="12.5" font-weight="600" fill="#4F627F">ask it for help</text>
  <text x="347" y="314" text-anchor="middle" font-size="12.5" font-weight="600" fill="#4F627F">hands over the bulk</text>
  <text x="347" y="330" text-anchor="middle" font-size="12.5" font-weight="600" fill="#4F627F">reading and writing</text>
  <text x="347" y="362" text-anchor="middle" font-size="12.5" fill="#6B6873">the answer comes back</text>
  <text x="347" y="470" text-anchor="middle" font-size="12.5" font-weight="600" fill="#4F627F">or chat with the</text>
  <text x="347" y="486" text-anchor="middle" font-size="12.5" font-weight="600" fill="#4F627F">home AI yourself</text>
  <text x="580" y="266" font-size="12.5" font-weight="600" fill="#4F627F">a note of each request</text>
  <!-- legend -->
  <line x1="24" y1="606" x2="60" y2="606" stroke="#4F627F" stroke-width="2.5"/>
  <text x="68" y="610" font-size="12.5" fill="#6B6873">a request</text>
  <rect x="160" y="598" width="24" height="16" rx="4" fill="#DEE3EC" stroke="#4F627F" stroke-width="1.5"/>
  <text x="192" y="610" font-size="12.5" fill="#6B6873">the Arbiter: paid today, ours later</text>
  <rect x="450" y="598" width="24" height="16" rx="4" fill="#DEE8E1" stroke="#5A8270" stroke-width="1.5"/>
  <text x="482" y="610" font-size="12.5" fill="#6B6873">ours, on the computer at home, free to use</text>
  <text x="500" y="646" text-anchor="middle" font-size="13.5" font-weight="600" fill="#A85B49">DIA-100 · Home library: the AI at home does the bulk reading, free and in the house. The Arbiter does the hard thinking.</text>
</svg>
"""
    return s


# name, program, what, why, how you use it (address in backticks renders as a chip)
GROUPS = [
    ("THE AI AT HOME", [
        ("The home AI", "Ollama, running the gpt-oss model",
         "An AI program on our own computer. It reads, summarizes and drafts",
         "It is in front: everything meets it first. Free to use, and private",
         "", "Nothing to open. The chat pages talk to it for you"),
        ("The graphics card", "RTX 5080, 16 GB",
         "The part inside the computer that does the AI's work",
         "A bigger card fits a cleverer AI. Ours fits a mid-sized one at full speed",
         "", "Inside the desktop. Nothing to do"),
    ]),
    ("THE TWO DOORS", [
        ("The front door", "LiteLLM, port 4000",
         "The everyday entrance. It has a switch: home, or paid",
         "Each tool has its own key, and one logbook for everything",
         "", "Behind the scenes. Each tool needs its own key"),
        ("The private door", "a second LiteLLM, port 4001",
         "A second entrance that only knows the home AI",
         "Private things go this way. It has no way out to paid help",
         "", "Behind the private chat page"),
    ]),
    ("PAGES YOU CAN OPEN", [
        ("The private chat page", "Open WebUI",
         "A chat page for private things. Only the home AI answers",
         "Health, family, money. Nothing typed here leaves the house",
         "lemonpepper:3002", "in a web browser"),
        ("The chat page", "Open WebUI",
         "The everyday chat page. The home AI answers unless you pick paid",
         "The easy way to use the home AI, with paid help one click away",
         "lemonpepper:3000", "pick paid in the model list"),
        ("The live board", "made for this system",
         "A page that shows what the system is doing right now",
         "See at a glance that everything is on, and watch a request travel",
         "lemonpepper:8088", "in a web browser"),
        ("The logbook", "Langfuse",
         "A record of every request. From the private door it keeps no words",
         "Shows how much work the home AI did, and what went to paid help",
         "lemonpepper:3001", "sign in needed"),
        ("Movies and shows", "Jellyfin",
         "A shelf for our own films, shows and music",
         "Watch our own collection on any of our screens. Not set up yet",
         "lemonpepper:8096", "in a web browser"),
    ]),
    ("PAID HELP, ON THE INTERNET", [
        ("Claude", "the route named paid",
         "A paid AI. Smarter than the home AI, and charged for each use",
         "For hard thinking the home AI gets wrong. It sees only what is sent",
         "", "Off until an API key is added"),
        ("n8n Cloud", "a paid subscription",
         "A service that runs chores by itself: on a schedule, or when something happens",
         "Connects apps and repeats work. It may ask the home AI, never Claude",
         "", "Not connected today. Its credential has its own key"),
    ]),
    ("UNDERNEATH", [
        ("The private connection", "Tailscale",
         "A private link between our own devices",
         "Lets the laptop reach the home computer from anywhere. Strangers cannot use it",
         "", "Always on. Nothing to do"),
        ("The service runner", "Docker Desktop",
         "A program that keeps the pages and the doors running",
         "The chat pages, logbook, movie shelf, board and both doors all run inside it",
         "", "One command starts it all after a restart"),
    ]),
]
NOTES = [
    ("DROPPED", "LM Studio: a second AI program that did the same job as Ollama, a little differently. Dropped on 2026-11-18."),
    ("LATER", "A memory, so the home AI can remember earlier work. Not built."),
]
COLS = (24, 250, 510, 790)   # name, what, why, how you use it
WRAP = (37, 40, 27)          # characters per line for what, why, use (13 px text)


def dia107():
    body = []
    y = 104
    for title, rows in GROUPS:
        body.append(f'  <rect x="24" y="{y}" width="952" height="22" rx="4" fill="#FAFAF8" stroke="#E2DFD6" stroke-width="1"/>')
        body.append(f'  <text x="34" y="{y + 15.5}" font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">{title}</text>')
        y += 22
        for i, (name, prog, what, why, addr, use) in enumerate(rows):
            if i:
                body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="#E2DFD6" stroke-width="1"/>')
            lw = textwrap.wrap(what, WRAP[0])
            ly = textwrap.wrap(why, WRAP[1])
            lu = textwrap.wrap(use, WRAP[2])
            n = max(len(lw), len(ly), len(lu) + (1 if addr else 0), 2)
            h = 22 + 18 * n + 6
            t = y + 27          # first baseline
            color = "#A28438" if title.startswith("PAID") else "#5A8270"
            body.append(f'  <text x="{COLS[0]}" y="{t}" font-size="15.5" font-weight="700" fill="{color}">{escape(name)}</text>')
            body.append(f'  <text x="{COLS[0]}" y="{t + 18}" font-size="11.5" fill="#6B6873">{escape(prog)}</text>')
            for k, line in enumerate(lw):
                body.append(f'  <text x="{COLS[1]}" y="{t + 18 * k}" font-size="13" fill="#2A2A35">{escape(line)}</text>')
            for k, line in enumerate(ly):
                body.append(f'  <text x="{COLS[2]}" y="{t + 18 * k}" font-size="13" font-style="italic" fill="#2A2A35">{escape(line)}</text>')
            k0 = 0
            if addr:
                w = round(len(addr) * 7.7 + 14)
                body.append(f'  <rect x="{COLS[3]}" y="{t - 13.5}" width="{w}" height="19" rx="4" fill="#FAFAF8" stroke="#5A8270" stroke-width="1"/>')
                body.append(f'  <text class="m" x="{COLS[3] + w / 2}" y="{t}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#5A8270">{addr}</text>')
                k0 = 1
            for k, line in enumerate(lu):
                body.append(f'  <text x="{COLS[3]}" y="{t + 18 * (k + k0) + (2 if k0 else 0)}" font-size="13" fill="#6B6873">{escape(line)}</text>')
            y += h
    for label, text in NOTES:
        body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="#E2DFD6" stroke-width="1"/>')
        body.append(f'  <text x="24" y="{y + 21.5}" font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">{label}</text>')
        body.append(f'  <text x="110" y="{y + 21.5}" font-size="13" fill="#6B6873">{escape(text)}</text>')
        y += 34
    body.append(f'  <line x1="24" y1="{y}" x2="976" y2="{y}" stroke="#E2DFD6" stroke-width="1"/>')
    y += 28
    body.append(f'  <rect x="24" y="{y - 13.5}" width="130" height="19" rx="4" fill="#FAFAF8" stroke="#5A8270" stroke-width="1"/>')
    body.append(f'  <text class="m" x="89" y="{y}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#5A8270">lemonpepper:3000</text>')
    body.append(f'  <text x="164" y="{y}" font-size="12.5" fill="#6B6873">an address to type into a web browser. It works on a device that has joined the private connection.</text>')
    y += 34
    body.append(f'  <text x="500" y="{y}" text-anchor="middle" font-size="13.5" font-weight="600" fill="#A85B49">DIA-101 · The pieces: what each piece of the home library is, why we have it, and how you use it.</text>')
    H = y + 22
    head = f"""<svg viewBox="0 0 1000 {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="d101-title d101-desc">
  <title id="d101-title">DIA-101 · The pieces: what each piece is, why we have it, and how you use it</title>
  <desc id="d101-desc">A plain-language table of every piece of the home library, in five groups. Each row gives a plain name with the real program name in small print, what it is, why we have it, and how you use it. The AI at home: the home AI (Ollama running the gpt-oss model), which is in front, and the graphics card. The two doors: the front door (LiteLLM, port 4000) with a switch for home or paid, and the private door (port 4001) that only knows the home AI. Pages you can open: the private chat page at lemonpepper:3002, the chat page at lemonpepper:3000, the live board at lemonpepper:8088, the logbook (Langfuse) at lemonpepper:3001, and movies and shows (Jellyfin) at lemonpepper:8096, not set up yet. Paid help, on the internet: Claude, off until an API key is added, and n8n Cloud, which has no way in while it is not used. Underneath: the private connection (Tailscale) and the service runner (Docker Desktop). Two notes: LM Studio was dropped on 2026-11-18, and a memory is planned and not built.</desc>
{STYLE.replace("PFX", "d101")}  <rect width="1000" height="{H}" fill="#F2EEE3"/>
  <text x="500" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#A85B49" letter-spacing="0.04em">DIA-101 · THE PIECES</text>
  <text x="500" y="58" text-anchor="middle" font-size="14" fill="#6B6873">What is each piece, why do we have it, and how do you use it?</text>
  <g font-size="12" font-weight="700" fill="#6B6873" letter-spacing="0.03em">
    <text x="{COLS[0]}" y="97">NAME</text><text x="{COLS[1]}" y="97">WHAT IT IS</text><text x="{COLS[2]}" y="97">WHY WE HAVE IT</text><text x="{COLS[3]}" y="97">HOW YOU USE IT</text>
  </g>
"""
    return head + "\n".join(body) + "\n</svg>\n"


# ---------------------------------------------------------------------------
# DIA-102 to DIA-105 and DIA-200. Shared helpers first.
# ---------------------------------------------------------------------------
G, GS, B, BS = "#5A8270", "#DEE8E1", "#4F627F", "#DEE3EC"
A, AS, R, MU, BG = "#A28438", "#F0E5CD", "#A85B49", "#6B6873", "#FAFAF8"
MARK = {B: "blue", A: "amber", MU: "gray"}

STYLE = STYLE.replace("--green: #5A8270; --green-soft: #DEE8E1;", "--green: #5A8270; --green-soft: #DEE8E1; --amber: #A28438; --amber-soft: #F0E5CD;")
STYLE = STYLE.replace("--green: #92BAA6; --green-soft: #233029;", "--green: #92BAA6; --green-soft: #233029; --amber: #D6B574; --amber-soft: #3B3220;")
STYLE = STYLE.replace("    </style>", """      [fill="#A28438"] { fill: var(--amber); } [stroke="#A28438"] { stroke: var(--amber); } [fill="#F0E5CD"] { fill: var(--amber-soft); }
      [stroke="#6B6873"] { stroke: var(--muted); } [stroke="#A85B49"] { stroke: var(--red); } [stroke="#2A2A35"] { stroke: var(--text); }
    </style>""")
STYLE = STYLE.replace("  </defs>", """    <marker id="PFX-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 Z" fill="#A28438"/></marker>
    <marker id="PFX-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 Z" fill="#6B6873"/></marker>
    <marker id="PFX-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 Z" fill="#5A8270"/></marker>
  </defs>""")


def T(x, y, s, size=13, fill="#2A2A35", a=None, w=None, i=False, m=False, ls=False):
    at = (f' text-anchor="{a}"' if a else "") + (f' font-weight="{w}"' if w else "")
    at += (' font-style="italic"' if i else "") + (' class="m"' if m else "") + (' letter-spacing="0.03em"' if ls else "")
    return f'  <text x="{x}" y="{y}" font-size="{size}" fill="{fill}"{at}>{escape(s)}</text>\n'


def L(x1, y1, x2, y2, color=B, pfx=None, w=2.5):
    mk = f' marker-end="url(#{pfx}-{MARK[color]})"' if pfx else ""
    return f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}"{mk}/>\n'


def RECT(x, y, w, h, fill, stroke, rx=12, sw=2, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>\n'


def sbox(x, y, w, color, soft, name, line, small, h=72):
    cx = x + w / 2
    return (RECT(x, y, w, h, soft, color) + T(cx, y + 24, name, 14, color, "middle", "700")
            + T(cx, y + 43, line, 12.5, color, "middle") + T(cx, y + 60, small, 11, MU, "middle"))


def circ(x, y, n):
    return (f'  <circle cx="{x}" cy="{y}" r="11" fill="#FAFAF8" stroke="#4F627F" stroke-width="1.8"/>\n'
            + T(x, y + 4.5, str(n), 12.5, B, "middle", "700"))


def head(pfx, H, title, desc, heading, sub):
    return (f'<svg viewBox="0 0 1000 {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="{pfx}-title {pfx}-desc">\n'
            f'  <title id="{pfx}-title">{escape(title)}</title>\n  <desc id="{pfx}-desc">{escape(desc)}</desc>\n'
            + STYLE.replace("PFX", pfx) + f'  <rect width="1000" height="{H}" fill="#F2EEE3"/>\n'
            + f'  <text x="500" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#A85B49" letter-spacing="0.04em">{escape(heading)}</text>\n'
            + T(500, 58, sub, 14, MU, "middle"))


def foot(H, caption):
    return T(500, H - 22, caption, 13.5, R, "middle", "600") + "</svg>\n"


def swatch(x, y, fill, stroke, label, dash=None):
    return RECT(x, y - 12, 24, 16, fill, stroke, 4, 1.5, dash) + T(x + 32, y, label, 12.5, MU)


def dia102():
    p, H = "d102", 540
    s = head(p, H, "DIA-102 · Where it lives",
             "Two computers. On the left, the laptop, which goes anywhere and is named limesalt. It holds the Arbiter (Claude Code today) and a web browser. In the middle, a private connection (Tailscale) that works at home and away. On the right, the computer at home, named lemonpepper, which stays on and never sleeps. Five pieces there are kept running by the service runner (Docker Desktop): the front door, the chat page, the logbook, the live board, and movies and shows. The home AI (Ollama) starts by itself and does its work on the graphics card, filling 12 of the card's 16 gigabytes.",
             "DIA-102 · WHERE IT LIVES", "Two computers, and a private connection between them.")
    s += RECT(24, 84, 240, 366, "none", "#9D9A95", 14, 1.5)
    s += T(40, 106, "THE LAPTOP", 12, MU, w="700", ls=True) + T(40, 123, "goes anywhere · named limesalt", 12, MU)
    s += box(44, 150, 200, 92, B, BS, "THE ARBITER", "plans and checks, from here", "a paid AI today", "Claude Code today")
    s += box(44, 270, 200, 92, B, BG, "A WEB BROWSER", "opens the pages", "on the computer at home", "any browser")
    s += L(268, 244, 417, 244, B, p) + L(416, 258, 267, 258, B, p)
    s += T(342, 222, "PRIVATE CONNECTION", 12, B, "middle", "700", ls=True)
    s += T(342, 282, "works at home", 12.5, MU, "middle") + T(342, 298, "and away", 12.5, MU, "middle") + T(342, 316, "Tailscale", 11, MU, "middle")
    s += RECT(420, 84, 556, 366, "none", "#9D9A95", 14, 1.5)
    s += T(436, 106, "THE COMPUTER AT HOME", 12, MU, w="700", ls=True) + T(436, 123, "stays on, never sleeps · named lemonpepper", 12, MU)
    s += RECT(430, 134, 536, 194, "none", "#9D9A95", 8, 1.2, "3,3")
    s += T(442, 152, "KEPT RUNNING BY THE SERVICE RUNNER", 12, MU, w="700", ls=True) + T(722, 152, "Docker Desktop", 11, MU)
    s += sbox(442, 162, 164, G, GS, "THE FRONT DOOR", "checks the key", "LiteLLM")
    s += sbox(618, 162, 164, G, GS, "THE CHAT PAGE", "ask the home AI", "Open WebUI")
    s += sbox(794, 162, 164, G, GS, "THE LOGBOOK", "notes every request", "Langfuse")
    s += sbox(442, 244, 164, G, GS, "THE LIVE BOARD", "shows what is happening", "made for this system")
    s += sbox(618, 244, 164, G, GS, "MOVIES AND SHOWS", "our films and music", "Jellyfin · not set up yet")
    s += box(442, 344, 250, 92, G, GS, "THE HOME AI", "reads, summarizes and drafts", "starts by itself at sign-in", "Ollama")
    s += L(692, 390, 705, 390, B, p)
    s += RECT(708, 344, 250, 92, BG, MU, 2, 2.5)
    s += T(833, 368, "THE GRAPHICS CARD", 15, MU, "middle", "700") + T(833, 387, "where the home AI does its work", 12.5, MU, "middle")
    # bar: 210 units = 16 GB, so 12 GB = 157.5
    s += f'  <rect x="728" y="398" width="210" height="9" fill="#F2EEE3" stroke="#9D9A95" stroke-width="1"/>\n  <rect x="728" y="398" width="157.5" height="9" fill="#5A8270"/>\n'
    s += T(833, 425, "the home AI fills 12 of its 16 GB", 11, MU, "middle")
    s += swatch(24, 486, BS, B, "on the laptop") + swatch(180, 486, GS, G, "on the computer at home") + swatch(420, 486, "none", "#9D9A95", "kept running by one program", "3,3")
    return s + foot(H, "DIA-102 · Where it lives: everything is on one computer at home, and the laptop reaches it over a private connection.")


def dia103():
    p, H = "d103", 540
    s = head(p, H, "DIA-103 · One request, step by step",
             "Five numbered steps. One: whoever asks (the Arbiter, or you on the chat page) sends a request over the private connection to the front door. Two: the front door checks the caller's key and passes the request on. Three: the home AI reads the request and writes the answer. Four: the answer goes back the same way. Five: the front door writes a note of the request in the logbook, which keeps the full question and answer. A short answer takes 1 to 3 seconds. After an hour of quiet the home AI goes to sleep and the next answer takes up to 30 seconds.",
             "DIA-103 · ONE REQUEST", "What happens when someone asks the home AI something?")
    s += L(244, 200, 387, 200, B, p) + L(610, 200, 753, 200, B, p)
    s += L(756, 236, 613, 236, B, p) + L(390, 236, 247, 236, B, p) + L(500, 262, 500, 357, B, p)
    s += box(24, 170, 220, 92, B, BS, "WHOEVER ASKS", "the Arbiter,", "or you on the chat page", "Claude Code · Open WebUI")
    s += box(390, 170, 220, 92, G, GS, "THE FRONT DOOR", "checks the key", "no key, no answer", "LiteLLM")
    s += box(756, 170, 220, 92, G, GS, "THE HOME AI", "reads the request", "writes the answer", "Ollama")
    s += box(390, 360, 220, 92, G, GS, "THE LOGBOOK", "keeps the note, and the", "full question and answer", "Langfuse")
    s += circ(317, 200, 1) + circ(683, 200, 2) + circ(756, 170, 3) + circ(683, 236, 4) + circ(500, 310, 5)
    s += T(317, 158, "asks, over the", 12.5, B, "middle", "600") + T(317, 174, "private connection", 12.5, B, "middle", "600")
    s += T(683, 174, "passes it on", 12.5, B, "middle", "600")
    s += T(683, 264, "the answer goes back", 12.5, MU, "middle") + T(317, 264, "the same way", 12.5, MU, "middle")
    s += T(520, 306, "a note of the request:", 12.5, B, w="600") + T(520, 322, "who asked, how long it took", 12.5, B, w="600")
    s += T(24, 372, "HOW LONG IT TAKES", 12, MU, w="700", ls=True)
    for k, t in enumerate(["A short answer: 1 to 3 seconds.", "After an hour of quiet the home AI", "goes to sleep. The next answer", "takes up to 30 seconds."]):
        s += T(24, 396 + 19 * k, t, 13.5)
    s += T(700, 372, "FROM THE CHAT PAGE", 12, MU, w="700", ls=True)
    for k, t in enumerate(["The same steps. The chat page asks", "the front door for you. Its key", "is already saved in it. Nothing", "leaves the house."]):
        s += T(700, 396 + 19 * k, t, 13.5)
    s += circ(36, 484, "n") + T(56, 488.5, "a step, in order", 12.5, MU)
    return s + foot(H, "DIA-103 · One request: the front door checks the key, the home AI answers, and the logbook keeps a note.")


OFF = [
    ("The whole computer", "lemonpepper", "Everything. There is no stand-in, and that is by choice"),
    ("The private connection", "Tailscale", "The laptop cannot find the computer at home"),
    ("The service runner", "Docker Desktop", "The front door and every page stop together"),
    ("The front door", "LiteLLM", "No one gets an answer: not the Arbiter, not the chat page"),
    ("The home AI", "Ollama", "No one gets an answer"),
    ("The logbook", "Langfuse", "Answers still come, but no notes are kept"),
    ("The chat page", "Open WebUI", "No chat in the browser. The Arbiter still works"),
    ("Movies and shows", "Jellyfin", "Only the movies. Nothing else notices"),
]


def dia104():
    p, H = "d104", 540
    s = head(p, H, "DIA-104 · After a restart",
             "On the left, three steps to bring the system back after the computer at home restarts. One: sign in to Windows; the private connection and the home AI start by themselves. Two: run the start command, server/start.ps1, which starts everything else and checks all of it. Three: look at the live board at lemonpepper:8088; the badge should say LIVE. On the right, a table of what you lose when one piece is off: the whole computer, the private connection, the service runner, the front door, the home AI, the logbook, the chat page, or movies and shows.",
             "DIA-104 · AFTER A RESTART", "How do you bring it back, and what stops when one piece is off?")
    s += T(24, 104, "TO BRING IT BACK", 12, MU, w="700", ls=True)
    s += L(174, 208, 174, 229, B, p) + L(174, 324, 174, 345, B, p)
    s += box(24, 116, 300, 92, B, BS, "1 · SIGN IN TO WINDOWS", "turn the computer on and sign in", "two pieces then start by themselves", "the private connection, the home AI")
    s += box(24, 232, 300, 92, B, BS, "2 · RUN THE START COMMAND", "it starts everything else", "and checks all of it", "server/start.ps1")
    s += box(24, 348, 300, 92, B, BS, "3 · LOOK AT THE LIVE BOARD", "the badge should say LIVE", "and every light should be on", "lemonpepper:8088")
    s += T(24, 466, "The start command has been tried with pieces", 12.5, MU) + T(24, 483, "switched off, not yet after a full restart.", 12.5, MU)
    s += T(380, 104, "IF THIS IS OFF", 12, MU, w="700", ls=True) + T(590, 104, "YOU LOSE", 12, MU, w="700", ls=True)
    y = 116
    for name, prog, loss in OFF:
        s += f'  <line x1="380" y1="{y}" x2="976" y2="{y}" stroke="#E2DFD6" stroke-width="1"/>\n'
        s += T(380, y + 18, name, 14, G, w="700") + T(380, y + 33, prog, 11, MU) + T(590, y + 24, loss, 13)
        y += 41
    s += f'  <line x1="380" y1="{y}" x2="976" y2="{y}" stroke="#E2DFD6" stroke-width="1"/>\n'
    return s + foot(H, "DIA-104 · After a restart: sign in, run one command, check the board. Each piece that is off takes a known thing with it.")


DOORS = [
    ("MOVIES AND SHOWS", "Jellyfin", "has its own sign-in", "Zo's account", G),
    ("THE CHAT PAGES", "Open WebUI", "have their own sign-in", "Zo's account on each", G),
    ("THE LIVE BOARD", "made for this system", "open on purpose", "shows activity only, never the words", G),
    ("THE LOGBOOK", "Langfuse", "has its own sign-in", "one account, Zo's", G),
    ("THE FRONT DOOR", "LiteLLM", "needs a key", "each tool has its own", G),
    ("THE HOME AI", "Ollama", "only from inside", "closed to other devices; use a door", G),
]


def dia105():
    p, H = "d105", 630
    s = head(p, H, "DIA-105 · Who can get in",
             "On the left, three kinds of visitor. Our own devices on the private connection: the intended way in. Any device on the home wifi, such as a guest's phone or a smart TV: not intended, but it works. The internet, everyone else: blocked. On the right, the six doors on the computer at home and the lock on each. Movies and shows: has its own sign-in. The chat pages: each has its own sign-in. The live board: open on purpose, it shows activity only. The logbook: has its own sign-in. The front door: needs a key, and each tool has its own. The home AI: closed to other devices, reached only through a door.",
             "DIA-105 · WHO CAN GET IN", "Which doors are open, to whom, and how is each one locked?")
    s += RECT(428, 84, 548, 428, "none", "#9D9A95", 14, 1.5)
    s += T(444, 106, "THE DOORS ON THE COMPUTER AT HOME", 12, MU, w="700", ls=True)
    y = 120
    for name, prog, status, detail, color in DOORS:
        s += RECT(454, y, 506, 54, GS, G)
        s += T(470, y + 23, name, 15, G, w="700") + T(470, y + 41, prog, 11.5, MU)
        s += T(946, y + 23, status, 13, color, "end", "700") + T(946, y + 41, detail, 12.5, color, "end", i=True)
        y += 64
    # brackets: blue spans all six doors, amber the same doors from the home wifi
    s += '  <path d="M424,128 H412 V486 H424" fill="none" stroke="#4F627F" stroke-width="2.5"/>\n'
    s += '  <path d="M404,148 H392 V466 H404" fill="none" stroke="#A28438" stroke-width="2.5"/>\n'
    s += L(264, 162, 409, 162, B, p) + L(264, 312, 389, 312, A, p) + L(264, 452, 298, 452, MU) + L(300, 436, 300, 468, MU, w=4)
    s += T(312, 456.5, "blocked", 12.5, MU, w="700")
    s += RECT(24, 120, 240, 84, BS, B, 42) + T(144, 150, "OUR OWN DEVICES", 15, B, "middle", "700") + T(144, 170, "on the private connection", 13, B, "middle") + T(144, 188, "the intended way in", 13, B, "middle", i=True)
    s += RECT(24, 270, 240, 84, AS, A, 42) + T(144, 300, "ANY DEVICE ON HOME WIFI", 14, A, "middle", "700") + T(144, 320, "a guest's phone, a smart TV", 13, A, "middle") + T(144, 338, "not intended, but it works", 13, A, "middle", i=True)
    s += T(144, 376, "Seen from the computer itself, not", 12, A, "middle") + T(144, 392, "yet tried from a second device.", 12, A, "middle")
    s += RECT(24, 420, 240, 64, BG, MU, 32) + T(144, 448, "THE INTERNET", 15, MU, "middle", "700") + T(144, 467, "everyone else", 13, MU, "middle")
    s += T(144, 506, "The private connection lets no one", 12, MU, "middle") + T(144, 522, "else in. The home router was", 12, MU, "middle") + T(144, 538, "not checked.", 12, MU, "middle")
    ly = 572
    s += L(24, ly - 4, 60, ly - 4, B) + T(68, ly, "the intended way in", 12.5, MU)
    s += L(220, ly - 4, 256, ly - 4, A) + T(264, ly, "open wider than intended", 12.5, MU)
    for x, c, t in ((470, G, "locked, or nothing to lock"), (670, A, "lock not finished"), (820, R, "no lock")):
        s += f'  <rect x="{x}" y="{ly - 11}" width="12" height="12" rx="2" fill="{c}"/>\n' + T(x + 20, ly, t, 12.5, MU)
    return s + foot(H, "DIA-105 · Who can get in: every door has a lock, the home AI is closed to other devices, and nothing is open to the internet.")


LANES = [
    (24, G, GS, "THE QUICK ROUTE", "home AI, thinks briefly · local-fast",
     ["summaries, questions about a document", "sorting into categories", "pulling facts into a form", "a small function, an exact small edit"],
     "1 to 3 seconds for a short answer", "bulk reading, plain output"),
    (352, G, GS, "THE THINKING ROUTE", "home AI, thinks first · local-think",
     ["putting things in order", "counting and comparing", "rewriting to a strict rule", "a second try after a quick-route miss"],
     "about three times slower", "needs working out"),
    (680, B, BS, "STAYS WITH THE ARBITER", "Claude Code today",
     ["planning the work", "judgement calls", "rules that affect each other", "final wording that gets published"],
     "a paid Arbiter costs money per use", "needs judgement"),
]


def dia200():
    p, H = "d200", 738
    s = head(p, H, "DIA-200 · Handing over work",
             "A job arrives at the Arbiter, the AI that plans and checks (a paid AI today, Claude Code; possibly our own model later). It sorts the job three ways. Bulk reading with plain output goes to the quick route on the home AI: summaries, questions about a document, sorting into categories, pulling facts into a form, a small function, an exact small edit; 1 to 3 seconds for a short answer. Work that needs working out goes to the thinking route on the same home AI: putting things in order, counting and comparing, rewriting to a strict rule, or a second try; about three times slower. Work that needs judgement stays with the Arbiter: planning, judgement calls, rules that affect each other, final published wording. Two safety catches sit under the home routes: an input of more than about 12,000 words is refused and split, and an answer that stops part-way is thrown away. The Arbiter then checks what comes back, because about 1 claim in 25 was wrong in testing. A warning band says private things do not go this way yet: a paid Arbiter sees every answer, so health records and the like go through the chat page instead. Scores from 12 kinds of job tried twice: quick route 18 right, 4 partly, 2 wrong; thinking route 19 right, 2 partly, 3 wrong.",
             "DIA-200 · HANDING OVER WORK", "Which jobs go to the home AI, and how is the result kept honest?")
    s += RECT(350, 84, 300, 56, BS, B) + T(500, 108, "A JOB ARRIVES", 16, B, "middle", "700") + T(500, 128, "at the Arbiter", 13, B, "middle")
    s += L(500, 140, 500, 162) + L(172, 162, 828, 162)
    for x, color, soft, name, prog, lines, speed, why in LANES:
        cx = x + 148
        s += L(cx, 162, cx, 193, B, p) + T(cx + 12, 184, why, 12, MU)
        s += RECT(x, 196, 296, 170, soft, color)
        s += T(cx, 224, name, 16, color, "middle", "700") + T(cx, 242, prog, 11, MU, "middle")
        for k, t in enumerate(lines):
            s += T(cx, 268 + 20 * k, t, 13, color, "middle")
        s += T(cx, 352, speed, 12.5, color, "middle", i=True)
    for x, name, l1, l2 in ((24, "SAFETY CATCH: TOO BIG", "more than about 12,000 words at once", "is refused, then split into parts"),
                            (352, "SAFETY CATCH: CUT OFF", "an answer that stops part-way", "is thrown away, never used")):
        cx = x + 148
        s += L(cx, 366, cx, 393, B, p) + RECT(x, 396, 296, 76, BG, A)
        s += T(cx, 420, name, 14, A, "middle", "700") + T(cx, 441, l1, 12.5, "#2A2A35", "middle") + T(cx, 459, l2, 12.5, "#2A2A35", "middle")
        s += L(cx, 472, cx, 501, B, p)
    s += T(680, 412, "HOW WE KNOW", 12, MU, w="700", ls=True)
    for k, t in enumerate(["12 kinds of job, each tried twice:", "quick route: 18 right, 4 partly, 2 wrong", "thinking route: 19 right, 2 partly, 3 wrong"]):
        s += T(680, 434 + 19 * k, t, 13)
    s += RECT(24, 504, 952, 68, BS, B)
    s += T(500, 531, "THE ARBITER CHECKS WHAT COMES BACK", 16, B, "middle", "700")
    s += T(500, 554, "A summary points to what to read. It is not proof: about 1 claim in 25 was wrong in testing.", 13, B, "middle")
    s += RECT(24, 586, 952, 62, BG, R)
    s += T(500, 611, "PRIVATE THINGS DO NOT GO THIS WAY YET", 15, R, "middle", "700")
    s += T(500, 633, "The Arbiter is a paid AI today, and it sees every answer. For health records and the like, use the chat page.", 13, "#2A2A35", "middle")
    s += swatch(24, 682, GS, G, "done at home, free") + swatch(210, 682, BS, B, "done by the Arbiter") + swatch(410, 682, BG, A, "refused or thrown away") + swatch(640, 682, BG, R, "a rule to follow")
    return s + foot(H, "DIA-200 · Handing over work: the home AI does the reading, two catches stop bad input and output, the Arbiter checks the rest.")


def P(d, color, pfx):
    return f'  <path d="{d}" fill="none" stroke="{color}" stroke-width="2.5" marker-end="url(#{pfx}-{MARK[color]})"/>\n'


def dbox(x, y, color, soft, name, l1, l2, small):
    cx = x + 88
    return (RECT(x, y, 176, 92, soft, color, 2, 2.5) + T(cx, y + 24, name, 14, color, "middle", "700")
            + T(cx, y + 44, l1, 12, color, "middle") + T(cx, y + 61, l2, 12, color, "middle") + T(cx, y + 80, small, 11, MU, "middle"))


RULES106 = [
    "A private chat has no switch. It cannot reach the paid AI.",
    "Anything made from the private drive is saved to the private drive, and nowhere else.",
    "The logbook keeps no words from the private side.",
    "Paid AI tools work on the working drive. File permissions keep them off the private drives (a separate account is planned).",
]


def dia106tobe():
    p, H = "d106", 758
    s = head(p, H, "DIA-106 · Home in front, paid behind a switch",
             "Built on 2026-11-18. You have two ways in. Private things go to the private door, a second gateway that is home only and has no way out to a paid AI. Everything else goes to the front door, which has a switch: home by default, or paid if you flip it. Both doors lead to the home AI, which answers at home. Only the front door, switched to paid, passes work through to the paid AI on the internet, which sees only what is sent. There are two drives. The private drive (drives C and D) holds health, family and money records; the home AI reads and writes it, and no paid AI may open it. The working drive holds projects and drafts and is the one drive a paid AI sees; the home AI reads it too. Four rules: a private chat has no switch; anything made from the private drive is saved only to the private drive; the logbook keeps no words from the private side; paid AI tools work on the working drive, and file permissions keep them off the private drives.",
             "DIA-106 · HOME IN FRONT, PAID BEHIND A SWITCH", "Built 2026-11-18. The paid switch does nothing until an API key is added.")
    s += f'  <path d="M150,318 H175 V176 H197" fill="none" stroke="{G}" stroke-width="2.5" marker-end="url(#{p}-blue)"/>\n'.replace(f"{p}-blue", f"{p}-green")
    s += P("M150,342 H175 V484 H197", B, p)
    s += f'  <path d="M410,176 H465 V312 H517" fill="none" stroke="{G}" stroke-width="2.5" marker-end="url(#{p}-green)"/>\n'
    s += P("M410,462 H465 V348 H517", B, p) + P("M410,506 H517", A, p)
    s += f'  <path d="M720,306 H760 V176 H797" fill="none" stroke="{G}" stroke-width="2.5" marker-end="url(#{p}-green)"/>\n'
    s += P("M720,354 H760 V470 H797", B, p) + P("M720,506 H797", A, p)
    s += L(888, 438, 888, 254, A) + L(870, 252, 906, 252, R, w=4)
    s += RECT(24, 284, 126, 92, BG, B, 46) + T(87, 326, "YOU", 16, B, "middle", "700") + T(87, 346, "any device", 12.5, B, "middle")
    s += T(87, 266, "private things", 12.5, G, "middle", "600") + T(87, 402, "everything else", 12.5, B, "middle", "600")
    s += box(200, 130, 210, 92, G, GS, "THE PRIVATE DOOR", "home only", "no way out to a paid AI", "a second gateway · port 4001")
    s += box(200, 438, 210, 92, B, BS, "THE FRONT DOOR", "has a switch: home or paid", "home unless you flip it", "LiteLLM")
    s += box(520, 284, 200, 92, G, GS, "THE HOME AI", "answers at home", "reads both drives", "Ollama")
    s += box(520, 438, 200, 92, A, AS, "THE PAID AI", "on the internet", "sees only what is sent", "Claude · the route named paid")
    s += dbox(800, 130, G, GS, "THE PRIVATE DRIVE", "health, family, money", "no paid AI may open it", "drives C: and D:")
    s += dbox(800, 438, B, BS, "THE WORKING DRIVE", "projects and drafts", "the one drive a paid AI sees", "drive F:")
    s += T(472, 250, "always home", 12.5, G, w="600") + T(472, 404, "by default", 12.5, B, w="600") + T(463, 526, "if you flip it", 12.5, A, "middle", "600")
    s += T(766, 246, "reads,", 12, G) + T(766, 262, "writes", 12, G) + T(766, 420, "reads", 12, B)
    s += T(878, 336, "a paid AI cannot", 12, R, "end", "600") + T(878, 352, "reach this drive", 12, R, "end", "600")
    s += RECT(24, 566, 952, 110, BG, R)
    s += T(44, 590, "FOUR RULES THAT MAKE IT HOLD", 12, R, w="700", ls=True)
    for k, t in enumerate(RULES106):
        s += T(44, 611 + 18 * k, f"{k + 1}.  {t}", 13)
    s += swatch(24, 700, GS, G, "private side: never leaves the house") + swatch(330, 700, BS, B, "working side") + swatch(480, 700, AS, A, "leaves the house, on purpose")
    return s + foot(H, "DIA-106 · Home in front: the home AI is in front, a switch passes work to a paid AI, and the private drive is out of its reach.")



def fbox(x, y, w, color, soft, name, l1, l2, small):
    cx = x + w / 2
    return (RECT(x, y, w, 92, soft, color, 2, 2.5) + T(cx, y + 25, name, 15, color, "middle", "700")
            + T(cx, y + 45, l1, 12.5, color, "middle") + T(cx, y + 63, l2, 12.5, color, "middle") + T(cx, y + 81, small, 11, MU, "middle"))


def dia100():
    p, H = "d100", 914
    gm = f'marker-end="url(#{p}-green)"'
    g = lambda d: f'  <path d="{d}" fill="none" stroke="{G}" stroke-width="2.5" {gm}/>\n'
    s = head(p, H, "DIA-100 · Home library: what it is for",
             "The overview. You open one of two pages on the computer at home. Private chat, at lemonpepper:3002, is for health, family and money. Everyday chat, at lemonpepper:3000, is for everything else. Each page talks to a door, which is a gateway with no screen of its own. Private chat uses the private door, port 4001, which only knows the home AI and has no way out to paid help. Everyday chat, and tools, use the front door, port 4000, which has a switch: home by default, or paid. Both doors lead to the home AI, which answers at home and costs only electricity. The home AI reads and writes the private files on drives C and D and reads the working files on drive F. Paid help is outside, on the internet. n8n Cloud runs chores by itself. It may ask only the home AI and never Claude, and it has no way in while it is not used. Claude, a paid AI for hard thinking, is reached from the front door only if you flip the switch, sees only what is sent, and cannot reach in. Also on the computer at home: the logbook, the live board, and movies and shows.",
             "DIA-100 · HOME LIBRARY: WHAT IT IS FOR", "Our own AI at home is in front. Private chat and private files stay in the house. Claude sees only what we send it.")
    s += RECT(136, 216, 852, 444, "none", "#9D9A95", 14, 1.5) + T(156, 238, "THE COMPUTER AT HOME", 12, MU, w="700", ls=True)
    # you to the two pages
    s += g("M120,430 H133 V296 H147") + P("M120,454 H133 V588 H147", B, p)
    # pages to doors
    s += g("M330,296 H367") + P("M330,588 H367", B, p)
    # doors to the home AI
    s += g("M550,296 H575 V420 H597") + P("M550,588 H575 V464 H597", B, p)
    # the home AI to the files
    s += g("M770,420 H790 V296 H807") + P("M770,464 H790 V588 H807", B, p)
    # paid help: n8n comes in at the private door, the front door goes out to Claude
    s += L(460, 634, 460, 701, A, p)
    s += RECT(24, 396, 96, 92, BG, B, 46) + T(72, 438, "YOU", 16, B, "middle", "700") + T(72, 458, "any device", 12, B, "middle")
    s += T(72, 378, "private things", 12.5, G, "middle", "600") + T(72, 514, "everything else", 12.5, B, "middle", "600")
    s += box(150, 250, 180, 92, G, GS, "PRIVATE CHAT", "a page for private things", "health, family, money", "a page · lemonpepper:3002")
    s += box(370, 250, 180, 92, G, GS, "THE PRIVATE DOOR", "only knows the home AI", "no way out to paid help", "port 4001 · no screen of its own")
    s += box(150, 542, 180, 92, B, BS, "EVERYDAY CHAT", "a page for everything else", "pick home or paid", "a page · lemonpepper:3000")
    s += box(370, 542, 180, 92, B, BS, "THE FRONT DOOR", "pages and tools come here", "a switch: home or paid", "port 4000 · no screen of its own")
    s += box(600, 396, 170, 92, G, GS, "THE HOME AI", "answers at home", "costs only electricity", "Ollama")
    s += fbox(810, 250, 166, G, GS, "PRIVATE FILES", "health, family, money", "paid help may not open", "drives C: and D:")
    s += fbox(810, 542, 166, B, BS, "WORKING FILES", "projects and drafts", "paid help may see these", "drive F:")
    s += box(345, 96, 230, 92, A, AS, "N8N CLOUD", "runs chores by itself", "not connected today", "a paid service on the internet")
    s += box(345, 704, 230, 92, A, AS, "CLAUDE", "a paid AI, for hard thinking", "sees only what is sent", "off until an API key is added")
    s += T(581, 366, "always", 12.5, G, w="600") + T(581, 530, "by default", 12.5, B, w="600")
    s += T(796, 366, "reads,", 12, G) + T(796, 382, "writes", 12, G) + T(796, 530, "reads", 12, B)
    s += T(472, 206, "no way in while it is not used", 12.5, A, w="600") + T(472, 678, "goes out only if you flip the switch", 12.5, A, w="600")
    s += T(150, 128, "PAID HELP", 12, A, w="700", ls=True) + T(150, 147, "on the internet", 12.5, MU) + T(150, 165, "costs money", 12.5, MU)
    s += T(150, 736, "PAID HELP", 12, A, w="700", ls=True) + T(150, 755, "on the internet", 12.5, MU) + T(150, 773, "costs money", 12.5, MU)
    s += T(610, 134, "If connected, n8n may ask", 13) + T(610, 153, "the home AI and nothing else.", 13)
    s += T(610, 742, "Claude cannot reach in.", 13) + T(610, 761, "We send work out to it.", 13)
    s += T(500, 834, "Also on the computer at home: the logbook, the live board, movies and shows. Every piece is in DIA-101.", 12.5, MU, "middle")
    s += swatch(24, 864, GS, G, "private side") + swatch(180, 864, BS, B, "working side") + swatch(336, 864, AS, A, "paid help, on the internet")
    return s + foot(H, "DIA-100 · Home library: the AI at home is in front, private things stay in the house, and paid help is one switch away.")


FILES = (
    ("DIA-100-WhatItIsFor.svg", dia100), ("DIA-101-ThePieces.svg", dia107), ("DIA-102-WhereItLives.svg", dia102),
    ("DIA-103-OneRequest.svg", dia103), ("DIA-104-AfterARestart.svg", dia104), ("DIA-105-WhoCanGetIn.svg", dia105),
    ("DIA-106-HomeInFront.svg", dia106tobe), ("DIA-200-HandingOverWork.svg", dia200),
)
if __name__ == "__main__":
    OUT = sys.argv[1]
    for name, fn in FILES:
        with open(f"{OUT}/{name}", "w", encoding="utf-8", newline=chr(10)) as f:
            f.write(fn())
        print("wrote", name)
