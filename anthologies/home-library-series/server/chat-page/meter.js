// Williams Home Lab meter, beside the message box on both chat pages.
// Open WebUI runs /static/loader.js on every screen.
//   Everyday page: a ring that fills as this month's Claude spend nears BUDGET.
//   Private page:  a "saved" figure: what Claude would have charged for the
//                  home AI's replies. Nothing leaves the house to work it out.
// Hover or tap for the detail. Month totals come from the signed-in user's
// own settings (written by the "Home Lab meter" filter); the chat figure is
// worked out from the open chat. Both are read with the user's own session.
(() => {
  const BUDGET = 100; // dollars a month; the everyday ring is full at this figure
  const COMPARE = { name: "Claude Opus 5.5", inp: 4.0, out: 20.0 }; // list price per million tokens
  const ID = "whl-meter";

  const money = (x) => (!x ? "$0.00" : x < 0.01 ? "$" + x.toFixed(4) : "$" + x.toFixed(2));
  const about = (x) => (x && x < 0.01 ? "under 1¢" : money(x));
  const isDark = () => document.documentElement.classList.contains("dark");
  const auth = () => ({ Authorization: "Bearer " + localStorage.token });
  const st = { privatePage: null, spent: 0, saved: 0, homeReplies: 0, chatSpent: 0, chatSaved: 0 };

  const css = document.createElement("style");
  css.textContent = `
    #${ID}{position:relative;display:flex;align-items:center;gap:5px;height:32px;min-width:32px;justify-content:center;
      border-radius:9999px;background:transparent;border:0;padding:0 6px;margin-right:2px;cursor:default;font-size:13px}
    #${ID}:hover,#${ID}:focus-visible{background:rgba(127,127,127,.15);outline:none}
    #${ID} .tip{position:absolute;bottom:calc(100% + 10px);right:-8px;white-space:nowrap;pointer-events:none;opacity:0;
      transform:translateY(4px);transition:opacity .12s,transform .12s;z-index:60;text-align:left;padding:9px 12px;
      border-radius:10px;line-height:1.35;box-shadow:0 6px 24px rgba(0,0,0,.25)}
    #${ID}:hover .tip,#${ID}:focus-visible .tip,#${ID}.open .tip{opacity:1;transform:none}
    #${ID} .tip b{font-weight:500;display:block;font-size:14px}
    #${ID} .tip span{display:block;font-size:12px}
    html.dark #${ID} .tip{background:#2a2a2a;color:#ececec;border:1px solid #3a3a3a}
    html.dark #${ID} .tip span{color:#9b9b9b}
    html:not(.dark) #${ID} .tip{background:#fff;color:#1f1f1f;border:1px solid #e5e5e5}
    html:not(.dark) #${ID} .tip span{color:#6b6b6b}
    html.dark #${ID} .saved{color:#4ade80} html:not(.dark) #${ID} .saved{color:#15803d}`;
  document.head.appendChild(css);

  function ring(frac) {
    const r = 8, c = 2 * Math.PI * r, f = Math.max(0, Math.min(frac, 1));
    const track = isDark() ? "#4a4a4a" : "#d4d4d4";
    const fill = frac >= 1 ? "#ef4444" : frac >= 0.8 ? "#f59e0b" : isDark() ? "#60a5fa" : "#2563eb";
    const dash = f > 0 ? Math.max(f * c, 1.5) : 0; // a sliver shows for any spend at all
    return `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="${r}" fill="none" stroke="${track}" stroke-width="2.5"/>
      <circle cx="10" cy="10" r="${r}" fill="none" stroke="${fill}" stroke-width="2.5" stroke-linecap="round"
        stroke-dasharray="${dash} ${c}" transform="rotate(-90 10 10)"/></svg>`;
  }

  function render() {
    const el = document.getElementById(ID);
    if (!el || st.privatePage === null) return;
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const resets = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString("en-US", { month: "short", day: "numeric" });
    let face, lines, label;
    if (st.privatePage) {
      face = `<span class="saved">${money(st.saved)} saved</span>`;
      lines = `<b>Saved about ${money(st.saved)} in ${month}</b>
        <span>This chat: about ${about(st.chatSaved)}</span>
        <span>${st.homeReplies} home AI ${st.homeReplies === 1 ? "reply" : "replies"} this month</span>
        <span>What ${COMPARE.name} would have charged. Nothing left the house.</span>`;
      label = `Saved about ${money(st.saved)} in ${month} by using the home AI.`;
    } else {
      const raw = (st.spent / BUDGET) * 100, pct = raw > 0 && raw < 1 ? "<1" : String(Math.round(raw));
      face = ring(st.spent / BUDGET);
      lines = `<b>Claude · ${month}: ${money(st.spent)} of $${BUDGET} (${pct}%)</b>
        <span>This chat: ${st.chatSpent ? money(st.chatSpent) : "nothing spent"}${st.chatSaved ? " · home AI saved about " + about(st.chatSaved) : ""}</span>
        <span>Home AI saved about ${money(st.saved)} this month</span>
        <span>Resets ${resets} · an estimate, Anthropic's bill is final</span>`;
      label = `Claude spend ${month}: ${money(st.spent)} of $${BUDGET}. Home AI saved about ${money(st.saved)}.`;
    }
    el.innerHTML = face + `<div class="tip" role="tooltip">${lines}</div>`;
    el.setAttribute("aria-label", label);
  }

  function mount() {
    if (document.getElementById(ID)) return;
    const voice = document.querySelector('button[aria-label="Voice Input"]');
    const anchor = voice && voice.parentElement;
    if (!anchor || !anchor.parentElement) return;
    const b = document.createElement("button");
    b.id = ID; b.type = "button";
    b.addEventListener("click", (e) => { e.preventDefault(); b.classList.toggle("open"); });
    b.addEventListener("blur", () => b.classList.remove("open"));
    anchor.parentElement.insertBefore(b, anchor);
    render();
  }

  async function refresh() {
    if (!localStorage.token) return;
    try {
      if (st.privatePage === null) {
        const c = await (await fetch("/api/config")).json();
        st.privatePage = /PRIVATE/i.test(c.name || "");
      }
      const s = await (await fetch("/api/v1/users/user/settings?raw=true", { headers: auth() })).json();
      const w = (s && s.whl) || {};
      const ym = new Date().toISOString().slice(0, 7);
      const ok = w.month === ym;
      st.spent = ok ? w.spent || 0 : 0; st.saved = ok ? w.saved || 0 : 0; st.homeReplies = ok ? w.home_replies || 0 : 0;
      await loadSidebar(w);
    } catch (e) {}
    st.chatSpent = 0; st.chatSaved = 0;
    const m = location.pathname.match(/^\/c\/([^/]+)/);
    if (m) {
      try {
        const r = await fetch("/api/v1/chats/" + m[1], { headers: auth() });
        if (r.ok) {
          const msgs = Object.values((((await r.json()).chat || {}).history || {}).messages || {});
          for (const x of msgs) {
            const u = x.usage, mod = x.model || "";
            if (x.role !== "assistant" || !u) continue;
            if (mod.startsWith("claude") || mod === "paid") st.chatSpent += typeof u.cost === "number" ? u.cost : 0;
            else st.chatSaved += ((u.input_tokens || 0) * COMPARE.inp + (u.output_tokens || 0) * COMPARE.out) / 1e6;
          }
        }
      } catch (e) {}
    }
    mount(); render();
  }

  // ---- Home and Paid marks in the sidebar (everyday page only) ----------------
  // A chat gets the money mark once any reply in it came from Claude (the list
  // is kept by the meter filter in the user's settings, key whl.paid_chats).
  // A folder takes its side from its own setting (meta.whl_side: "home" or
  // "paid") if it has one, otherwise from its chats: money if any used Claude.
  const MARK = {
    home: { title: "Home: answered on this computer", svg: '<path d="M8 2.2 1.8 7.4h1.7v6.3h3.4V10h2.2v3.7h3.4V7.4h1.7z" fill="currentColor"/>' },
    paid: { title: "Paid: sent to Anthropic", svg: '<rect x="1.3" y="4" width="13.4" height="8" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="1.9" fill="currentColor"/>' },
  };
  const marks = document.createElement("style");
  marks.textContent = `.whl-mark{display:inline-flex;flex:none;width:14px;height:14px;margin-right:6px;align-self:center}
    html.dark .whl-mark.home{color:#4ade80} html:not(.dark) .whl-mark.home{color:#15803d}
    html.dark .whl-mark.paid{color:#fbbf24} html:not(.dark) .whl-mark.paid{color:#b45309}`;
  document.head.appendChild(marks);
  const side = { paidChats: new Set(), folders: {}, at: 0 };

  function markEl(kind) {
    const s = document.createElement("span");
    s.className = "whl-mark " + kind; s.title = MARK[kind].title; s.dataset.kind = kind;
    s.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" aria-label="${MARK[kind].title}">${MARK[kind].svg}</svg>`;
    return s;
  }
  function place(host, kind) {
    if (!host) return;
    const old = host.querySelector(":scope > .whl-mark");
    if (old && old.dataset.kind === kind) return;
    if (old) old.remove();
    host.insertBefore(markEl(kind), host.firstChild);
  }
  function paintSidebar() {
    if (st.privatePage !== false) return;
    document.querySelectorAll("a#sidebar-chat-item").forEach((a) => {
      const id = (a.getAttribute("href") || "").replace(/^\/c\//, "");
      const title = a.querySelector("div.truncate");
      place(title && title.parentElement, side.paidChats.has(id) ? "paid" : "home");
    });
    for (const [id, kind] of Object.entries(side.folders)) {
      const btn = document.getElementById(`folder-${id}-button`);
      const name = btn && btn.querySelector(".truncate");
      place(name && name.parentElement, kind);
    }
  }
  async function loadSidebar(settingsWhl) {
    if (st.privatePage !== false) return;
    side.paidChats = new Set((settingsWhl && settingsWhl.paid_chats) || []);
    if (Date.now() - side.at > 20000) {
      side.at = Date.now();
      try {
        const folders = await (await fetch("/api/v1/folders/", { headers: auth() })).json();
        const out = {};
        for (const f of Array.isArray(folders) ? folders : []) {
          const set = (f.meta || {}).whl_side;
          if (set === "home" || set === "paid") { out[f.id] = set; continue; }
          let kind = "home";
          try {
            const chats = await (await fetch(`/api/v1/chats/folder/${f.id}/list`, { headers: auth() })).json();
            if ((chats || []).some((c) => side.paidChats.has(c.id))) kind = "paid";
          } catch (e) {}
          out[f.id] = kind;
        }
        side.folders = out;
      } catch (e) {}
    }
    paintSidebar();
  }

  // Refresh once the page settles after a change (a reply finishing, a new chat),
  // when the address changes, and every 30 s as a fallback.
  let t = null, path = location.pathname;
  new MutationObserver(() => {
    mount(); paintSidebar();
    if (location.pathname !== path) { path = location.pathname; refresh(); return; }
    clearTimeout(t); t = setTimeout(refresh, 1500);
  }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(() => { if (!document.hidden) refresh(); }, 30000);
  refresh();
})();
