# DIA-112: Who can reach what
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-112-HomeLibraryReach.svg`
- **Theme:** Which ports on the desktop are open, to which callers, and what guards each one
- **Primary audience takeaway:** The laptop gets in over the tailnet as intended, but the same ports are also published to the whole home network, three of the five doors have a weak or unfinished guard, and Ollama has no guard at all.

## What The Diagram Shows
The picture reads left to right: who is knocking, which door, what guards it. Three callers stand on the left. The laptop `limesalt` comes in over the tailnet, which is the intended way in. Any device on the home network reaches the same ports, which is not intended. The internet is drawn stopped. On the right, inside the desktop `lemonpepper`, five doors sit in a frame that says they are open on every network address. Each door is one row: the port, the name, what it is, and on the right the guard, colored by how good it is. Jellyfin was never set up. Open WebUI has login switched on but no account. Langfuse has its own login. LiteLLM needs a key, but it is one key for every caller. Ollama asks for nothing. A note under the rows names two more ports that are open the same way.

## Elements And Flow
- **Components:**
  - **LIMESALT** (blue caller pill). What: the laptop, coming in over the tailnet. Why: it is the caller the system was built for, so it marks the intended way in.
  - **ANY DEVICE AT HOME** (amber caller pill). What: anything on the same wifi or cable as the desktop. Why: it is the caller nobody planned for, and it reaches the same doors.
  - **THE INTERNET** (gray caller pill). What: everyone else. Why: to show that no way in from outside was found, and how far that was checked.
  - **DESKTOP · lemonpepper** (machine frame). What: the desktop, by its tailnet name. Why: every door is on this one machine.
  - **OPEN ON EVERY NETWORK ADDRESS** (group frame). What: the set of ports bound to all addresses. Why: this binding is the reason the home network can reach them, not only the tailnet.
  - **JELLYFIN `:8096`** (container). What: media server. Guard, amber: never set up, so the first visitor to run its setup wizard becomes administrator.
  - **OPEN WEBUI `:3000`** (container). What: chat page in the browser. Guard, amber: login is on, but no account exists and sign-up is open, so the first sign-up becomes administrator. That account can use the relay's key through the chat page.
  - **LANGFUSE `:3001`** (several containers drawn as one). What: stores the request record. Guard, green: its own login, with one account, the owner.
  - **LITELLM (the relay) `:4000`** (container). What: passes requests to a model. Guard, amber: it needs a key, but there is one key shared by every caller, with no per-tool keys.
  - **OLLAMA `:11434`** (native Windows program, square corners). What: the model runtime. Guard, red: no key and no login. Anyone who reaches the port can run models, pull new ones and delete existing ones.
  - **Note under the rows** (amber). Ports `:3031` (the Langfuse AI gateway, not configured) and `:9090` (the Langfuse file store) are open the same way, and nothing outside the desktop needs them.
- **Relationships:**
  - Blue arrow from LIMESALT to a blue bracket that spans all five doors: a call that works today. The words under the pill give the reason: the firewall allows every port from the tailnet.
  - Amber arrow from ANY DEVICE AT HOME to an amber bracket that spans the same five doors: works today, but is a weak point. The words under the pill say Docker and Ollama publish these ports to the home network too, and that this was tested from the desktop itself, not from a second device.
  - Gray line from THE INTERNET that ends at a stop bar: not a call into the system. The words under the pill say Tailscale publishes nothing and the router was not checked.
- **Notable labels or metrics:**
  - All facts come from the verified fact sheet of 2026-11-18 (`components.md`) and the changes made the same day. Only ports that are open today are drawn.
  - Port numbers and bindings: `Get-NetTCPConnection -State Listen` and `docker inspect` port bindings.
  - Tailnet reach: firewall rule "Tailscale-In" allows any port addressed to the tailnet address. Rule "Ollama tailnet" allows TCP 11434 from the tailnet range. Tailscale access controls live in the admin console and were not read. The tailnet has two devices, both the owner's.
  - Home network reach: firewall rule "Docker Desktop Backend" allows inbound traffic on any port from any address, and rule "ollama.exe" does the same on the Private profile. A request from the desktop to its own home network address answered on 11434, 3001, 9090 and 3031. No second home device was used, which is why the label says "tested from the desktop itself".
  - Internet: `tailscale serve status` returned no serve config. Router port forwarding was not checked, so the picture does not claim that no port is forwarded.
  - Jellyfin: `StartupWizardCompleted` is false. Open WebUI: 0 users, sign-up enabled, login required. Langfuse: 1 row in the users table. LiteLLM: `/v1/models` with no key returned 401, and no database is connected, so there is one key. Ollama: no key and no login.
  - "Seven ports" in the caption is the five doors plus `:3031` and `:9090`.

## How To Read It
1. Start on the left and pick a caller.
2. Follow its line to the bracket. The bracket spans every door that caller can reach.
3. Read each door from left to right: port, name, what it is, then the guard.
4. Read the guard color: green is guarded, amber is a guard that is weak or not finished, red is no guard.
5. Finish on the amber note under the rows and the gray words under THE INTERNET, which say what was and was not checked.

## Home Library Relevance
This is the picture for the Known gaps part of ARCH-006. It shows the owner what to close first: the Ollama port, which lets anyone on the home network or the tailnet run or delete models with no key and no record. It also shows two jobs that take minutes: finish the Jellyfin setup and create the Open WebUI account, so that nobody else can claim them. The fix for each door is the owner's decision and is not drawn. Callers on the desktop itself are left out, because they reach everything. What each service is belongs to DIA-107, and what a request does once inside belongs to DIA-109.

## Suggested Caption
DIA-112 · Reach: seven ports are open to the home network as well as the tailnet, and Ollama asks for no key.
