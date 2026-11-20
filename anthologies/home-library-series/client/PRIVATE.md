# Private and paid

<!--
Purpose: The rules that keep private material in the house, and how the paid channel is switched on.
Status: working
Owner: zo
Human id: home-library-private-and-paid
Update trigger: when a drive, a door, a route or a rule changes
Last updated: 2026-11-18
-->

The picture is [DIA-106](../diagrams/DIA-106-HomeInFront.svg).

## The split

| | Private side | Working side |
| --- | --- | --- |
| Drives on lemonpepper | `C:` and `D:` | `F:` |
| Door | the private door, port 4001. Also published to the internet for n8n | the front door, port 4000. Not published |
| Routes on that door | `local-fast`, `local-think` | the same, plus `paid` |
| Chat page | `http://lemonpepper:3002` (Private chat) | `http://lemonpepper:3000` |
| Logbook | a line per request, no words | full text |
| Paid AI | cannot be reached | reached only when you choose `paid` |

The two chat pages are named so they cannot be mistaken for each other
(set on 2026-11-18):

| | Private page | Everyday page |
| --- | --- | --- |
| Name on the tab and sign-in | Williams Home Lab · PRIVATE | Williams Home Lab · Everyday |
| Banner | green: chats stay in the house, only search words go out | blue: Claude is paid and leaves the house |
| Models listed | Private · Home AI best, Private · Home AI quick | Home AI · best, Home AI · quick, and four Claude models, each marked PAID, leaves the house: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5 |
| Opens on | the best home AI | the best home AI |

The names and banners are set in `E:\WHL\compose\docker-compose.yml`
(`WEBUI_NAME`, `WEBUI_BANNERS`, `DEFAULT_MODELS`). The model names and the
switched-off extras (tags, follow-up questions) are set inside each page,
under Admin Panel, Settings.

`E:` holds the system itself (`E:\WHL`) and its keys.

## n8n Cloud

Zo has an n8n Cloud subscription. It runs on n8n's servers.

Zo's decision on 2026-11-18: n8n Cloud may be used with private material.
Claude may not. Self-hosting n8n is put off.

What that means in practice:

- An n8n workflow may send private text to the home AI and get the answer
  back. That text passes through n8n's servers on the way, and n8n keeps a
  record of each run unless saving run data is turned off in the workflow's
  settings.
- n8n reaches the home AI through the **private door**, never the front
  door. The private door has no paid route, so a workflow that uses it
  cannot reach Claude by way of this system.
- n8n cannot read `C:` or `D:`. It sees only what a workflow is given.

Wired on 2026-11-18:

- Tailscale Funnel publishes the private door (port 4001) at
  `https://lemonpepper.tailef54bd.ts.net`. Checked: no password gives 401,
  and the password lists only `local-fast` and `local-think`.
- In n8n, the credential "Home AI (private door)" (OpenAI type) points at
  that address with `/v1` on the end and holds the private door's password.
  n8n's own test of it passed.
- AI steps in a workflow pick that credential and the model `local-fast` or
  `local-think`. If the list shows OpenAI names, type the name in.

What opening the door means: anyone on the internet can now knock on it,
and its password is the only guard. Its welcome page is visible without a
password; nothing else is. To close it again: `tailscale funnel reset`.

## Web search

Zo's decision on 2026-11-18: web search is allowed on both pages, the
private one included. Looking something up is not the same as a model
company holding a record about you.

- It starts switched on for the home models on both pages (the globe
  button beside the message box, lit when on). The home AI decides,
  question by question, whether to look something up. Click the globe to
  switch it off for a chat. Since 2026-11-19 Claude on the everyday page
  has the same tools, on by default. When Claude uses them, the search
  results and code output go to Anthropic along with the chat.
- Searches go to a search service running at home (`whl-searxng`), which
  asks several public search engines on your behalf with no account and
  keeps no history. What leaves the house is the search words and the
  requests for the pages it opens. The chat and the answer stay at home.
- Each home model carries a standing instruction: today's date, search
  before answering anything recent, assume the latest year, do not ask the
  user to clarify first. Its tool list is short on purpose. With the full
  list the earlier model picked the wrong tool and never searched.
- Checked on 2026-11-18 in signed-in chats on both pages: "who won
  midterms" searched for 2026, opened two pages and answered with sources
  in about a minute. A Dallas weekend forecast came back with links.
- A searched answer is as good as the pages it found. Check anything that
  matters against the links it gives.

## What the chat pages can do

| Feature | State on 2026-11-18 |
| --- | --- |
| Look things up on the web | Works on both pages, on by default |
| Read a photo or screenshot | Works on both pages, both home models |
| Answer from an uploaded document | Works on both pages |
| Fast answers while a game is open | Works: `home-best` 73 tokens a second, `home-quick` 163 |
| Run code for sums and data | Works on both pages, on by default. The home AI writes a few lines of Python and a code runner at home runs them (`whl-code` for the everyday page, `whl-code-private` for the private page). Each runner is sealed: no internet, no access to the doors, the model server or the other runner |
| Make images | Not built |
| Voice | Left as it came. Zo declined it |
| Claude on the everyday page | Works since 2026-11-19, with the same tools as the home models (search, code, files, memory). Checked in a chat: it searched, ran code and gave links in about 30 seconds. It runs at high effort with room for long answers. It is `claude-opus-5-5`, billed per use through the API key, separate from any Claude subscription |

## What enforces each rule

| Rule | Enforced by | How strong |
| --- | --- | --- |
| A private chat has no switch | The private chat page talks only to the private door, which has no paid route and is given no paid key | Strong. Adding paid would mean editing two files in `E:\WHL` |
| Private input never goes to paid | `ask-local.ps1` refuses (exit 5) before anything is sent | Strong for this tool |
| What is made from private stays private | `ask-local.ps1` requires `-Out` on a private drive and never prints the reply | Strong for this tool |
| The logbook keeps no private words | `turn_off_message_logging` on the private door. Checked: a marker sent through it did not appear in the logbook | Strong |
| Paid tools cannot read the private drives | Deny rules in `C:\Users\awill\.claude\settings.json` for all of `D:` and the personal folders on `C:` | Weak. See below |

## What is not enforced

- **The deny rules stop the file tools, not shell commands.** Claude Code
  refuses to open a denied file with its read and edit tools. A shell command
  it runs can still read anything this Windows account can. The real fix is
  the separate Windows account, `claude_agent` (below). The deny rules only
  matter while paid tools are still run from the `awill` account.
- **Not all of `C:` is denied.** Claude Code itself lives on `C:`, so only the
  personal folders are listed: Documents, Desktop, Downloads, Pictures,
  Videos, Music, OneDrive. Private files kept elsewhere on `C:` are covered by
  the hand-off tool's rules but not by the deny rules.
- **A link on `F:` that points into `C:` or `D:` is not detected.**
- **The prompt text is not inspected.** Private text typed into a prompt on
  the working side goes wherever that request goes. Use `-Private`, or the
  private chat page.
- **Switching a chat to `paid` sends its whole history.** On the working chat
  page, start a new chat before choosing `paid`.
- **OneDrive runs on this computer.** Anything under the OneDrive folder is
  also on Microsoft's servers.

## The paid AI account

Created 2026-11-18: a standard Windows account named `claude_agent`, for
paid AI tools. It is not an administrator. The plan is that paid tools
(Claude Code, and anything else that sends to a paid company) run only
when signed in to Windows as `claude_agent`, and Zo's own account `awill`
is kept for private work.

What Windows enforces for `claude_agent`:

| Location | Access | Why |
| --- | --- | --- |
| `C:\Users\awill` | none | Windows closes one account's profile to another by default. Checked |
| `D:` | none, once the command below is run | `D:` is open to every signed-in user until then |
| `F:` | read and write | open to every signed-in user |
| `E:\WHL` | read and write | open to every signed-in user. The hand-off tool reads its key there |
| the rest of `C:` (Windows, programs) | read | programs, not private files. Anything private kept on `C:` outside `C:\Users\awill` is NOT protected |

The one command, run once in an administrator terminal:

```powershell
icacls D:\ /deny "claude_agent:(OI)(CI)F"
```

To undo it: `icacls D:\ /remove:d claude_agent`.

Unlike the deny rules above, this holds against shell commands too,
because Windows itself refuses the read.

To start using it: sign in to Windows as `claude_agent`, install and sign
in to Claude there, and open `F:\Programming\alonzo-anthologies`.

## Projects on the chat pages

Added 2026-11-19. Each project is a folder with its own standing
instructions and reference documents attached, plus catch-up chats saying
where the work stands. Open a catch-up chat and carry on.

| Folder | Page | Side | What is in it |
| --- | --- | --- | --- |
| Alonzo's Anthologies | Everyday | Paid | site, resume, essays: 9 documents, 2 catch-up chats |
| Gatekeeper's Protocol | Everyday | Paid | the Unity game: 16 documents, 3 catch-up chats |
| Williams Home Lab | Private | Home | this system: 10 documents, 4 catch-up chats |
| Job search | Private | Home | applications and cover letters: 12 documents |

A new chat in a Paid folder still opens on the home AI. Pick a Claude
model from the switcher for that folder's work. The chat pages cannot edit
files, run builds, open Unity or commit: the catch-up chats end with what
still needs Claude Code.

On the everyday page a house or banknote beside each chat and folder shows
which side it is on.

## Moving a chat between Home and Paid

Under each reply there is a two-arrow button, "Move to the other page".
It asks first, copies the whole chat to the other page (inside the house,
over the home's own Docker network), files it in a folder of the same name
if there is one, and archives the original. The archived original can be
brought back from Archived Chats. Attached files and images do not move:
only the words. Moving from Private to Everyday warns that the chat will
then be stored outside the private drives and sent to Anthropic if Claude
is picked there.

## Switching between models

The model name beside the message box is the switcher. Click it to pick a
model for a new chat, or to change model part way through a chat. On the
everyday page it lists the two home models and four Claude models (added
2026-11-19):

| Model | Route | Anthropic's price per million tokens, in and out |
| --- | --- | --- |
| Claude Fable 5.2, the one in the Claude app | `claude-fable` | $8 and $40 |
| Claude Opus 5.5 | `claude-opus` | $4 and $20 |
| Claude Sonnet 5.5 | `claude-sonnet` | $2 and $10 |
| Claude Haiku 5.5 | `claude-haiku` | $0.10 and $0.50 |

Both pages have a meter beside the microphone (2026-11-19). Hover or tap
it for the detail.

| | Everyday page | Private page |
| --- | --- | --- |
| Beside the microphone | a ring that fills as this month's Claude spend nears $100 (amber at 80%, red at 100%) | the month's savings in green, for example "$0.04 saved" |
| Under a Claude reply | its price, for example "$0.02" | (no Claude here) |
| Under a home AI reply | "saved $0.02" | "saved $0.02" |
| In the tooltip | Claude this month and this chat, home AI savings this month, reset date | savings this month and this chat, number of home replies |

"Saved" is what Claude Opus 5.5 would have charged for the same reply at
list price. It is an estimate: Claude counts words a little differently
and would have reused part of a long chat for less. Claude prices come
from the gateway, which prices each reply from Anthropic's list;
"(est.)" after one means the page worked it out from the token counts.
The $100 is a gauge, not a limit. To change it, edit `BUDGET` at the top
of `E:\WHL\config\openwebui\loader.js` and restart the pages.

Month totals are kept in your own account settings on each page and read
with your sign-in. Nothing is published. The month counts only chats on
that page, not the hand-off tool. Anthropic's bill at
console.anthropic.com is the one that counts.

Switching to a Claude model part way through a chat sends that whole chat
to Anthropic. The private page lists only the two home models. The route
`paid` still exists for the hand-off tool and is the same as `claude-opus`.

## Switching the paid channel on

1. Create an API key at Anthropic.
2. Put it on the `ANTHROPIC_API_KEY=` line in `E:\WHL\compose\.env`.
3. Run `server/start.ps1`.

The route is named `paid` and points at `claude-opus-5-5`. To change the
model, edit the `paid` entry in `E:\WHL\config\litellm\config.yaml`.
Until a key is set the route is listed and every call to it fails.

## Using it

Private, from a tool (the reply is saved, never shown):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Prompt "Summarize this." -File "D:\Records\letter.txt" -Out "D:\Records\letter.summary.txt"
```

Paid, from a tool (working drive only):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Route paid -Prompt "Which of these two plans is riskier, and why?" -File "F:\Programming\alonzo-anthologies\_KNOWLEDGE\Stories\ST-014-SeriesDiagrams.md"
```

## Changelog

- 2026-11-18: Created with the private door, the private chat page, the paid route and the drive rules.
