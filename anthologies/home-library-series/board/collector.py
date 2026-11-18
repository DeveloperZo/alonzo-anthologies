"""Collector for the home library board.

Polls each source on its own timer and writes status.json next to this file.
The page (index.html) reads that file. Standard library only, Python 3.12.

    py -3.12 collector.py                 run until stopped
    py -3.12 collector.py --once          one pass over every source, write, exit
    py -3.12 collector.py --break ollama  test: point one source at a dead port

Rules this file keeps:
  - Keys are read from the two .env files into memory and go nowhere else.
    They are never printed, logged or written.
  - status.json never holds prompt or reply text. The Langfuse calls ask only
    for timing, model, usage and metadata fields, and only named fields are
    copied out of each record.
  - LiteLLM GET /health is never called. It sends a real chat to every route.
"""
import argparse
import base64
import ctypes
import datetime as dt
import json
import os
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RELAY_ENV = r"E:\WHL\compose\.env"
LANGFUSE_ENV = os.path.normpath(os.path.join(HERE, "..", "server", ".env"))

URLS = {
    "ollama": "http://127.0.0.1:11434",
    "relay": "http://127.0.0.1:4000",
    "langfuse": "http://127.0.0.1:3001",
    "openwebui": "http://127.0.0.1:3000",
    "jellyfin": "http://127.0.0.1:8096",
}
DEAD = "http://127.0.0.1:9"  # nothing listens here; used by --break

# Used until the relay's own route list has been read once.
DEFAULT_ROUTES = {"local-fast": "gpt-oss:20b", "local-think": "gpt-oss:20b", "local-coder": "gpt-oss:20b"}
KEEP_ALIVE_S = 1800      # the relay asks Ollama to keep a model for 30 minutes
BUSY_UTIL_PCT = 40       # card utilization that counts as "working"
SELF_NAME = "lemonpepper"
NO_WINDOW = 0x08000000 if os.name == "nt" else 0

SECRETS = []             # values to scrub from any error text, never output
STATE = {}               # source name -> latest data
SOURCES = {}             # source name -> {ok, last_ok, last_try, error, every_s}
LOCK = threading.Lock()


def now_utc():
    return dt.datetime.now(dt.timezone.utc)


def iso(t):
    return t.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") if t else None


def parse_time(s):
    if not s:
        return None
    s = s.strip().replace("Z", "+00:00")
    # Trim fractional seconds to six digits (Ollama sends seven).
    if "." in s:
        head, tail = s.split(".", 1)
        cut = len(tail)
        for i, ch in enumerate(tail):
            if ch in "+-":
                cut = i
                break
        s = head + "." + tail[:cut][:6].ljust(6, "0") + tail[cut:]
    try:
        t = dt.datetime.fromisoformat(s)
    except ValueError:
        return None
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)


def read_env(path):
    out = {}
    try:
        with open(path, encoding="utf-8-sig") as fh:
            for line in fh:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    out[k.strip()] = v.strip().strip('"').strip("'")
    except OSError:
        pass
    return out


def safe_error(exc):
    text = "%s: %s" % (type(exc).__name__, str(exc))
    for s in SECRETS:
        if s:
            text = text.replace(s, "[redacted]")
    return text[:140]


def http_json(url, headers=None, timeout=5, raw=False):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        body = r.read()
    return body.decode("utf-8", "replace") if raw else json.loads(body)


def run(cmd, timeout=20):
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout,
                       creationflags=NO_WINDOW, encoding="utf-8", errors="replace")
    if p.returncode != 0:
        raise RuntimeError("exit %s: %s" % (p.returncode, (p.stderr or "").strip()[:100]))
    return p.stdout


# ---------------------------------------------------------------- sources

def src_gpu():
    out = run(["nvidia-smi", "--query-gpu=name,memory.used,memory.total,utilization.gpu,temperature.gpu,power.draw",
               "--format=csv,noheader,nounits"], timeout=8)
    f = [x.strip() for x in out.strip().splitlines()[0].split(",")]

    def num(x):
        try:
            return float(x)
        except ValueError:
            return None
    prev = STATE.get("gpu") or {}
    hist = (prev.get("util_history") or [])[-59:] + [num(f[3])]
    return {"name": f[0], "used_mb": num(f[1]), "total_mb": num(f[2]), "util_pct": num(f[3]),
            "temp_c": num(f[4]), "watts": num(f[5]), "util_history": hist}


PS_COUNTERS = (
    "$ErrorActionPreference='SilentlyContinue';"
    "(Get-Counter '\\GPU Process Memory(*)\\Dedicated Usage').CounterSamples |"
    " Where-Object { $_.CookedValue -gt 50MB } | ForEach-Object {"
    " if ($_.InstanceName -match 'pid_(\\d+)') {"
    " $p = Get-Process -Id $matches[1];"
    " '{0}|{1}|{2}' -f $matches[1], [int]($_.CookedValue/1MB), $p.Path } }"
)


def src_gpu_procs():
    out = run(["powershell", "-NoProfile", "-NonInteractive", "-Command", PS_COUNTERS], timeout=25)
    ollama_mb, others = 0, {}
    for line in out.splitlines():
        parts = line.strip().split("|")
        if len(parts) != 3 or not parts[1].isdigit():
            continue
        mb, path = int(parts[1]), parts[2]
        if "ollama" in path.lower():
            ollama_mb += mb
        else:
            name = os.path.basename(path) if path else "Windows desktop"
            others[name] = others.get(name, 0) + mb
    top = sorted(others.items(), key=lambda kv: -kv[1])[:4]
    return {"ollama_mb": ollama_mb, "others": [{"name": n, "mb": m} for n, m in top]}


def src_ollama_ps():
    data = http_json(URLS["ollama"] + "/api/ps", timeout=4)
    loaded = []
    for m in data.get("models", []):
        det = m.get("details") or {}
        loaded.append({
            "name": m.get("name"),
            "size_mb": round((m.get("size") or 0) / 1048576),
            "vram_mb": round((m.get("size_vram") or 0) / 1048576),
            "context": m.get("context_length"),
            "expires_at": iso(parse_time(m.get("expires_at"))),
            "params": det.get("parameter_size"),
            "quant": det.get("quantization_level"),
        })
    return {"loaded": loaded}


def src_ollama_tags():
    data = http_json(URLS["ollama"] + "/api/tags", timeout=6)
    return {"installed": [{"name": m.get("name"), "size_mb": round((m.get("size") or 0) / 1048576)}
                          for m in data.get("models", [])]}


def src_relay():
    body = http_json(URLS["relay"] + "/health/liveliness", timeout=4, raw=True)
    if "alive" not in body.lower():
        raise RuntimeError("unexpected liveliness reply")
    return {"alive": True}


def src_relay_routes(key):
    data = http_json(URLS["relay"] + "/model/info", {"Authorization": "Bearer " + key}, timeout=8)
    routes = {}
    for m in data.get("data", []):
        model = ((m.get("litellm_params") or {}).get("model") or "")
        routes[m.get("model_name")] = model.split("/", 1)[1] if "/" in model else model
    if not routes:
        raise RuntimeError("relay listed no routes")
    return {"routes": routes}


def src_langfuse_health():
    data = http_json(URLS["langfuse"] + "/api/public/health", timeout=4)
    if data.get("status") != "OK":
        raise RuntimeError("status %s" % data.get("status"))
    return {"version": data.get("version")}


def src_http_ok(name, path):
    def fn():
        http_json(URLS[name] + path, timeout=4, raw=True)
        return {"up": True}
    return fn


def routes_now():
    return (STATE.get("relay_routes") or {}).get("routes") or DEFAULT_ROUTES


def meta_get(md, dotted):
    """Langfuse returns metadata flat with dotted keys. Accept nested too."""
    if not isinstance(md, dict):
        return None
    if dotted in md:
        return md[dotted]
    cur = md
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def slim(o, routes):
    """Copy only the allowed fields out of one Langfuse record. No text."""
    md = o.get("metadata") or {}
    usage = o.get("usageDetails") or {}
    tags = meta_get(md, "attributes.langfuse.trace.tags") or []
    if not isinstance(tags, list):
        tags = []
    tags = [str(t)[:40] for t in tags][:6]
    route = o.get("model") or ""
    user = (o.get("userId") or "").strip()
    level = o.get("level") or "DEFAULT"
    if level == "ERROR":
        status = "failed" if route in routes else "refused"
    else:
        status = "ok"
    probe = None
    if user.startswith("litellm:") or "litellm-internal-health-check" in tags:
        probe = "relay health check"
    elif status == "refused":
        probe = "refused before routing (no key or bad request)"
    elif route not in routes:
        probe = "not a current route"
    elif user.lower().startswith("probe") or "probe" in tags or "verify" in tags:
        probe = "probe"
    secs = o.get("latency")
    out_tok = usage.get("output")
    return {
        "id": o.get("id"),
        "start": o.get("startTime"),
        "end": o.get("endTime") or o.get("startTime"),
        "route": route[:60],
        "model": str(meta_get(md, "attributes.llm.model_name") or routes.get(route) or "")[:60],
        "caller": user[:40] if user and user != "default_user_id" else "unnamed",
        "tags": tags,
        "tokens_in": usage.get("input"),
        "tokens_out": out_tok,
        "seconds": round(secs, 2) if isinstance(secs, (int, float)) else None,
        "tps": round(out_tok / secs, 1) if out_tok and secs and secs > 0.2 else None,
        "status": status,
        "probe": probe,
    }


def mark_verify(rows):
    """The verify script sends a no-key request and an unnamed keyed chat within
    a second or two of each other. Mark that chat as a probe. This is a guess."""
    refused = [parse_time(r["start"]) for r in rows if r["status"] == "refused"]
    refused = [t for t in refused if t]
    for r in rows:
        if r["probe"] or r["caller"] != "unnamed" or r["tags"]:
            continue
        t = parse_time(r["start"])
        if t and any(abs((t - x).total_seconds()) <= 3 for x in refused):
            r["probe"] = "verify script (guess)"
    return rows


def lf_headers(pk, sk):
    return {"Authorization": "Basic " + base64.b64encode((pk + ":" + sk).encode()).decode()}


OBS_FIELDS = "core,basic,time,model,usage,metadata"   # never "io"


def src_langfuse_recent(pk, sk):
    url = URLS["langfuse"] + "/api/public/v2/observations?type=GENERATION&limit=60&fields=" + OBS_FIELDS
    data = http_json(url, lf_headers(pk, sk), timeout=8)
    routes = routes_now()
    rows = mark_verify([slim(o, routes) for o in data.get("data", [])])
    return {"rows": rows}


def src_langfuse_day(pk, sk):
    """Scan the last 24 hours of records for honest counts (probes left out),
    and ask the metrics endpoint for per-route medians."""
    hdr = lf_headers(pk, sk)
    routes = routes_now()
    now = now_utc()
    since = now - dt.timedelta(hours=24)
    rows, cursor, truncated = [], None, False
    for page in range(30):
        url = (URLS["langfuse"] + "/api/public/v2/observations?type=GENERATION&limit=100&fields=" + OBS_FIELDS
               + "&fromStartTime=" + urllib.parse.quote(iso(since)))
        if cursor:
            url += "&cursor=" + urllib.parse.quote(cursor)
        data = http_json(url, hdr, timeout=10)
        batch = data.get("data", [])
        rows += [slim(o, routes) for o in batch]
        cursor = (data.get("meta") or {}).get("cursor")
        if not cursor or len(batch) < 100:
            break
    else:
        truncated = True
    seen, uniq = set(), []
    for r in rows:
        if r["id"] not in seen:
            seen.add(r["id"])
            uniq.append(r)
    rows = mark_verify(uniq)

    first_hour = (now - dt.timedelta(hours=23)).replace(minute=0, second=0, microsecond=0)
    hourly = [{"hour": iso(first_hour + dt.timedelta(hours=i)), "count": 0, "tokens": 0, "failed": 0} for i in range(24)]
    midnight = dt.datetime.now().astimezone().replace(hour=0, minute=0, second=0, microsecond=0)
    today = {"requests": 0, "tokens_in": 0, "tokens_out": 0, "failed": 0, "since": iso(midnight.astimezone(dt.timezone.utc))}
    callers, probes = {}, 0
    for r in rows:
        t = parse_time(r["start"])
        if not t:
            continue
        if r["probe"]:
            probes += 1
            continue
        idx = int((t - first_hour).total_seconds() // 3600)
        ok = r["status"] == "ok"
        tok = (r["tokens_in"] or 0) + (r["tokens_out"] or 0)
        if 0 <= idx < 24:
            if ok:
                hourly[idx]["count"] += 1
                hourly[idx]["tokens"] += tok
            else:
                hourly[idx]["failed"] += 1
        if t >= midnight:
            if ok:
                today["requests"] += 1
                today["tokens_in"] += r["tokens_in"] or 0
                today["tokens_out"] += r["tokens_out"] or 0
                callers[r["caller"]] = callers.get(r["caller"], 0) + 1
            else:
                today["failed"] += 1

    q = {"view": "observations",
         "metrics": [{"measure": "count", "aggregation": "count"}, {"measure": "latency", "aggregation": "p50"},
                     {"measure": "totalTokens", "aggregation": "sum"}, {"measure": "tokensPerSecond", "aggregation": "p50"}],
         "dimensions": [{"field": "providedModelName"}],
         "filters": [{"column": "type", "operator": "=", "value": "GENERATION", "type": "string"},
                     {"column": "level", "operator": "=", "value": "DEFAULT", "type": "string"},
                     {"column": "providedModelName", "operator": "any of", "value": sorted(routes), "type": "stringOptions"}],
         "fromTimestamp": iso(since), "toTimestamp": iso(now)}
    by_route = {}
    try:
        m = http_json(URLS["langfuse"] + "/api/public/v2/metrics?query=" + urllib.parse.quote(json.dumps(q)), hdr, timeout=10)
        for row in m.get("data", []):
            name = row.get("providedModelName")
            if name in routes:
                lat, tps = row.get("p50_latency"), row.get("p50_tokensPerSecond")
                by_route[name] = {"model": routes[name], "count_24h": row.get("count_count"),
                                  "tokens_24h": row.get("sum_totalTokens"),
                                  "p50_seconds": round(lat / 1000, 1) if isinstance(lat, (int, float)) else None,
                                  "p50_tps": round(tps, 1) if isinstance(tps, (int, float)) else None}
    except Exception as exc:  # the scan above is still good
        by_route = {"error": safe_error(exc)}
    return {"hourly": hourly, "today": today, "callers_today": callers, "probes_24h": probes,
            "by_route": by_route, "truncated": truncated}


def src_docker():
    out = run(["docker", "ps", "-a", "--format", "{{.ID}}|{{.Names}}|{{.State}}|{{.Status}}"], timeout=15)
    items = []
    for line in out.splitlines():
        p = line.split("|")
        if len(p) == 4:
            items.append({"id": p[0], "name": p[1], "state": p[2], "status": p[3]})
    restarts = {}
    if items:
        try:
            ins = run(["docker", "inspect", "--format", "{{.Name}}|{{.RestartCount}}"] + [i["id"] for i in items], timeout=15)
            for line in ins.splitlines():
                n, _, c = line.partition("|")
                restarts[n.lstrip("/")] = int(c) if c.strip().isdigit() else 0
        except Exception:
            pass
    return {
        "total": len(items),
        "running": sum(1 for i in items if i["state"] == "running"),
        "not_running": [i["name"] for i in items if i["state"] != "running"],
        "unhealthy": [i["name"] for i in items if "unhealthy" in i["status"]],
        "restarts": [{"name": n, "count": c} for n, c in restarts.items() if c > 0],
        "names": {i["name"]: i["status"] for i in items},
    }


def tailscale_exe():
    default = os.path.join(os.environ.get("ProgramFiles", r"C:\Program Files"), "Tailscale", "tailscale.exe")
    return default if os.path.exists(default) else "tailscale"


def src_tailscale():
    data = json.loads(run([tailscale_exe(), "status", "--json"], timeout=10))
    me = data.get("Self") or {}
    machines = [{"name": me.get("HostName"), "online": bool(me.get("Online")), "self": True, "last_seen": None}]
    for peer in (data.get("Peer") or {}).values():
        seen = peer.get("LastSeen") or ""
        machines.append({"name": peer.get("HostName"), "online": bool(peer.get("Online")), "self": False,
                         "last_seen": None if seen.startswith("0001") else iso(parse_time(seen))})
    return {"machines": machines, "backend": data.get("BackendState")}


# ---------------------------------------------------------------- loop

def poll(name, fn):
    t = now_utc()
    try:
        data = fn()
        with LOCK:
            STATE[name] = data
            SOURCES[name].update(ok=True, last_ok=iso(t), last_try=iso(t), error=None)
    except Exception as exc:
        with LOCK:
            SOURCES[name].update(ok=False, last_try=iso(t), error=safe_error(exc))


def worker(name, fn, every, stop):
    while not stop.is_set():
        poll(name, fn)
        stop.wait(every)


def uptime_s():
    try:
        ctypes.windll.kernel32.GetTickCount64.restype = ctypes.c_uint64
        return int(ctypes.windll.kernel32.GetTickCount64() / 1000)
    except Exception:
        return None


def build():
    """Assemble the document the page reads. Nothing here touches a key."""
    now = now_utc()
    with LOCK:
        st = json.loads(json.dumps(STATE))
        src = json.loads(json.dumps(SOURCES))
    gpu = st.get("gpu") or {}
    procs = st.get("gpu_procs") or {}
    loaded = (st.get("ollama_ps") or {}).get("loaded") or []
    for m in loaded:
        exp = parse_time(m.get("expires_at"))
        m["expires_in_s"] = max(0, int((exp - now).total_seconds())) if exp else None
    model_mb = None
    if loaded:
        counted = procs.get("ollama_mb") if src.get("gpu_procs", {}).get("ok") else None
        model_mb = counted if counted else sum(m["vram_mb"] for m in loaded)
        if gpu.get("used_mb") is not None:
            model_mb = min(model_mb, gpu["used_mb"])
    hist = [h for h in (gpu.get("util_history") or [])[-2:] if h is not None]
    busy = bool(loaded) and len(hist) == 2 and min(hist) >= BUSY_UTIL_PCT
    routes = (st.get("relay_routes") or {}).get("routes") or DEFAULT_ROUTES
    recent = (st.get("langfuse_recent") or {}).get("rows") or []
    day = st.get("langfuse_day") or {}

    def up(name):
        return bool(src.get(name, {}).get("ok"))

    doc = {
        "schema": 1,
        "generated_at": iso(now),
        "generated_epoch": round(now.timestamp(), 1),
        "host": {"name": SELF_NAME, "uptime_s": uptime_s()},
        "sources": src,
        "gpu": {
            "name": gpu.get("name"), "used_mb": gpu.get("used_mb"), "total_mb": gpu.get("total_mb"),
            "util_pct": gpu.get("util_pct"), "temp_c": gpu.get("temp_c"), "watts": gpu.get("watts"),
            "util_history": gpu.get("util_history") or [], "busy": busy,
            "model_mb": model_mb,
            "model_mb_from": "windows counter" if loaded and src.get("gpu_procs", {}).get("ok") and procs.get("ollama_mb") else "ollama report",
            "other_mb": max(0, (gpu.get("used_mb") or 0) - (model_mb or 0)) if gpu.get("used_mb") is not None else None,
            "others": procs.get("others") or [],
        },
        "ollama": {"loaded": loaded, "installed": (st.get("ollama_tags") or {}).get("installed") or [],
                   "keep_alive_s": KEEP_ALIVE_S},
        "relay": {"routes": [{"route": r, "model": m} for r, m in routes.items()]},
        "services": [
            {"id": "relay", "label": "Relay", "up": up("relay"), "source": "relay",
             "down_means": "Clients cannot reach the models through the relay address."},
            {"id": "ollama", "label": "Ollama", "up": up("ollama_ps"), "source": "ollama_ps",
             "down_means": "No model can answer. The relay will return errors."},
            {"id": "langfuse", "label": "Langfuse", "up": up("langfuse_health"), "source": "langfuse_health",
             "down_means": "Requests still work but are not recorded, and this board stops counting."},
            {"id": "openwebui", "label": "Open WebUI", "up": up("openwebui"), "source": "openwebui",
             "down_means": "The chat page is unavailable. The relay still works."},
            {"id": "jellyfin", "label": "Jellyfin", "up": up("jellyfin"), "source": "jellyfin",
             "down_means": "The media server is unavailable. The models are not affected."},
        ],
        "machines": (st.get("tailscale") or {}).get("machines") or [],
        "containers": {k: v for k, v in (st.get("docker") or {}).items() if k != "names"},
        "requests": {
            "recent": recent,
            "today": day.get("today"),
            "callers_today": day.get("callers_today") or {},
            "hourly": day.get("hourly") or [],
            "by_route": day.get("by_route") or {},
            "probes_24h": day.get("probes_24h"),
            "truncated": day.get("truncated", False),
        },
    }
    return doc


def write_atomic(path, doc):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, separators=(",", ":"))
    for attempt in range(5):
        try:
            os.replace(tmp, path)
            return
        except PermissionError:
            time.sleep(0.05 * (attempt + 1))
    os.replace(tmp, path)


def take_lock(path):
    """One collector per output folder. Returns the open handle, or None."""
    try:
        import msvcrt
        fh = open(path, "a+")
        fh.seek(0)
        msvcrt.locking(fh.fileno(), msvcrt.LK_NBLCK, 1)
        return fh
    except OSError:
        return None
    except ImportError:
        return open(path, "a+")


def say(text):
    if sys.stderr:
        try:
            print(time.strftime("%H:%M:%S"), text, file=sys.stderr, flush=True)
        except OSError:
            pass


def main():
    ap = argparse.ArgumentParser(description="Collector for the home library board.")
    ap.add_argument("--out", default=os.path.join(HERE, "status.json"), help="where to write status.json")
    ap.add_argument("--once", action="store_true", help="poll every source once, write, exit")
    ap.add_argument("--break", dest="broken", action="append", default=[], choices=sorted(URLS),
                    help="test only: point this source at a dead port. Changes nothing on the real service.")
    args = ap.parse_args()

    for name in args.broken:
        URLS[name] = DEAD
        say("TEST: %s is pointed at a dead port" % name)

    relay_key = read_env(RELAY_ENV).get("LITELLM_MASTER_KEY", "")
    lf = read_env(LANGFUSE_ENV)
    pk, sk = lf.get("LANGFUSE_INIT_PROJECT_PUBLIC_KEY", ""), lf.get("LANGFUSE_INIT_PROJECT_SECRET_KEY", "")
    SECRETS.extend([relay_key, pk, sk])
    say("keys found: relay %s, langfuse %s" % ("yes" if relay_key else "NO", "yes" if pk and sk else "NO"))

    def need(value, fn):
        def wrapped():
            if not value:
                raise RuntimeError("key not found in the .env file")
            return fn()
        return wrapped

    plan = [
        ("gpu", src_gpu, 2),
        ("ollama_ps", src_ollama_ps, 3),
        ("relay", src_relay, 5),
        ("langfuse_recent", need(pk and sk, lambda: src_langfuse_recent(pk, sk)), 4),
        ("langfuse_health", src_langfuse_health, 10),
        ("openwebui", src_http_ok("openwebui", "/health"), 10),
        ("jellyfin", src_http_ok("jellyfin", "/health"), 10),
        ("tailscale", src_tailscale, 15),
        ("gpu_procs", src_gpu_procs, 20),
        ("docker", src_docker, 20),
        ("langfuse_day", need(pk and sk, lambda: src_langfuse_day(pk, sk)), 15),
        ("relay_routes", need(relay_key, lambda: src_relay_routes(relay_key)), 300),
        ("ollama_tags", src_ollama_tags, 300),
    ]
    for name, _, every in plan:
        SOURCES[name] = {"ok": False, "last_ok": None, "last_try": None, "error": "not read yet", "every_s": every}

    if args.once:
        for name, fn, _ in sorted(plan, key=lambda p: p[0] != "relay_routes"):
            poll(name, fn)
        write_atomic(args.out, build())
        bad = [n for n, s in SOURCES.items() if not s["ok"]]
        say("wrote %s. Sources down: %s" % (args.out, ", ".join(bad) or "none"))
        return 0

    lock = take_lock(args.out + ".lock")
    if lock is None:
        say("another collector is already writing %s. Exiting." % args.out)
        return 2

    stop = threading.Event()
    poll("relay_routes", plan[11][1])   # route names first, so records classify correctly
    for name, fn, every in plan:
        threading.Thread(target=worker, args=(name, fn, every, stop), name=name, daemon=True).start()
    say("collector running. Writing %s every second. Ctrl+C to stop." % args.out)
    try:
        while True:
            time.sleep(1)
            try:
                write_atomic(args.out, build())
            except Exception as exc:
                say("write failed: %s" % safe_error(exc))
    except KeyboardInterrupt:
        stop.set()
        say("stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
