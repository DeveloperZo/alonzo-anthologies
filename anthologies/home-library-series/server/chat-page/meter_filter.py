"""
title: Home Lab meter
description: Under each reply, what Claude cost or what the home AI saved. Keeps the month's totals for the meter beside the message box.
version: 2.1
"""

# One filter for both chat pages, attached to every model shown there.
# A Claude reply shows its price ("$0.02"). A home AI reply shows what the
# same reply would have cost from Claude Opus 5.5 at list price ("saved $0.02").
# Month totals go into the signed-in user's own settings (key "whl"), which the
# meter script reads with the user's own session. Nothing is served publicly.
# A ledger file in the page's own data folder stops a reply being counted twice.

import json, os, datetime
from pydantic import BaseModel, Field

# Anthropic's list prices per million tokens: input, output, cache read, cache write.
PRICES = {
    "claude-fable": (8.0, 40.0, 0.20, 10.0),
    "claude-opus": (4.0, 20.0, 0.20, 5.0),
    "claude-sonnet": (2.0, 10.0, 0.10, 2.5),
    "claude-haiku": (0.10, 0.50, 0.01, 0.125),
    "paid": (4.0, 20.0, 0.20, 5.0),
}
COMPARE = "claude-opus"  # what a home reply is priced against
LEDGER = "/app/backend/data/whl_meter.json"


def money(x):
    if x is None:
        return "?"
    return "$%.4f" % x if 0 < x < 0.01 else "$%.2f" % x


def tokens(usage):
    inp = int(usage.get("input_tokens") or usage.get("prompt_tokens") or 0)
    out = int(usage.get("output_tokens") or usage.get("completion_tokens") or 0)
    return inp, out


def claude_cost(usage, model_id):
    c = usage.get("cost")
    if isinstance(c, (int, float)) and c > 0:
        return float(c), False
    p = PRICES.get(model_id, PRICES["claude-opus"])
    inp, out = tokens(usage)
    cached = int(((usage.get("prompt_tokens_details") or {}).get("cached_tokens")) or 0)
    written = int(usage.get("cache_creation_input_tokens") or 0)
    fresh = max(inp - cached - written, 0)
    return (fresh * p[0] + out * p[1] + cached * p[2] + written * p[3]) / 1e6, True


def saved_cost(usage):
    p = PRICES[COMPARE]
    inp, out = tokens(usage)
    return (inp * p[0] + out * p[1]) / 1e6


class Filter:
    class Valves(BaseModel):
        priority: int = Field(default=99, description="Run after other filters.")

    def __init__(self):
        self.valves = self.Valves()

    def _record(self, msg_id, kind, amount, toks):
        month = datetime.date.today().strftime("%Y-%m")
        try:
            with open(LEDGER, encoding="utf-8") as f:
                book = json.load(f)
        except Exception:
            book = {}
        page = book.setdefault(month, {})
        if msg_id:
            page[msg_id] = {"kind": kind, "amount": round(amount or 0, 6), "tokens": toks}
        tmp = LEDGER + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(book, f)
        os.replace(tmp, LEDGER)
        tot = {"month": month, "spent": 0.0, "saved": 0.0, "home_replies": 0, "home_tokens": 0, "claude_replies": 0}
        for e in page.values():
            if e.get("kind") == "claude":
                tot["spent"] += e["amount"]; tot["claude_replies"] += 1
            else:
                tot["saved"] += e["amount"]; tot["home_replies"] += 1; tot["home_tokens"] += e.get("tokens", 0)
        tot["spent"] = round(tot["spent"], 6); tot["saved"] = round(tot["saved"], 6)
        return tot

    async def _store_totals(self, user_id, tot, paid_chat=None):
        # Totals and the list of chats that used Claude (the sidebar marks those
        # with the money icon). Read first so the chat list is kept.
        try:
            from open_webui.models.users import Users
            u = await Users.get_user_by_id(user_id)
            s = u.settings if u else None
            s = s.model_dump() if hasattr(s, "model_dump") else dict(s or {})
            whl = dict(s.get("whl") or {})
            paid = list(whl.get("paid_chats") or [])
            if paid_chat and paid_chat not in paid:
                paid.append(paid_chat)
            whl.update(tot)
            whl["paid_chats"] = paid
            await Users.update_user_settings_by_id(user_id, {"whl": whl})
        except Exception:
            pass

    async def outlet(self, body: dict, __event_emitter__=None, __model__=None, __user__=None) -> dict:
        try:
            model_id = (__model__ or {}).get("id") or body.get("model") or ""
            msgs = body.get("messages") or []
            last = next((m for m in reversed(msgs) if m.get("role") == "assistant"), None)
            usage = (last or {}).get("usage") or {}
            if not usage:
                return body
            inp, out = tokens(usage)
            if model_id.startswith("claude") or model_id == "paid":
                amount, est = claude_cost(usage, model_id)
                kind, text = "claude", money(amount) + (" (est.)" if est else "")
            else:
                amount = saved_cost(usage)
                kind, text = "home", "saved " + money(amount)
            tot = self._record(last.get("id") or body.get("id"), kind, amount, inp + out)
            if __user__ and __user__.get("id"):
                await self._store_totals(__user__["id"], tot, body.get("chat_id") if kind == "claude" else None)
            if __event_emitter__:
                await __event_emitter__({"type": "status", "data": {"description": text, "done": True}})
        except Exception:
            pass
        return body
