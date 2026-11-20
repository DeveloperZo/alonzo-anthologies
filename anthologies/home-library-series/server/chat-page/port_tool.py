"""Runs INSIDE a chat page container. Builds one project from /tmp/port/spec.json:
a knowledge collection of the files in /tmp/port/files, a folder with the
project's standing instructions and that collection, and the catch-up chats.
Prints names and counts only, never file contents."""
import json, os, time, uuid, sqlite3, requests, asyncio
from open_webui.utils.auth import create_token

DB = "/app/backend/data/webui.db"
uid = sqlite3.connect(DB).execute("select id from user where role='admin' limit 1").fetchone()[0]
B = "http://localhost:8080"
H = {"Authorization": "Bearer " + create_token({"id": uid})}
spec = json.load(open("/tmp/port/spec.json", encoding="utf-8"))
page = requests.get(B + "/api/config").json().get("name", "")
want = spec["page"]
assert ("PRIVATE" in page.upper()) == (want == "private"), "wrong page for this spec: " + page


def j(r):
    if r.status_code >= 400:
        raise SystemExit("HTTP %s %s: %s" % (r.status_code, r.request.url, r.text[:300]))
    return r.json()


# Re-running replaces the earlier import of the same project.
for f in j(requests.get(B + "/api/v1/folders/", headers=H)):
    if f["name"] == spec["folder"]["name"]:
        for c in j(requests.get(B + "/api/v1/chats/folder/%s/list" % f["id"], headers=H)):
            requests.delete(B + "/api/v1/chats/" + c["id"], headers=H)
        requests.delete(B + "/api/v1/folders/" + f["id"], headers=H)
        print("replaced earlier folder")
kl = j(requests.get(B + "/api/v1/knowledge/", headers=H))
for k in (kl.get("items", []) if isinstance(kl, dict) else kl):
    if k.get("name") == spec["knowledge"]["name"]:
        requests.delete(B + "/api/v1/knowledge/%s/delete" % k["id"], headers=H)
        print("replaced earlier knowledge")

# 1. Knowledge collection
kb = j(requests.post(B + "/api/v1/knowledge/create", headers=H,
                     json={"name": spec["knowledge"]["name"], "description": spec["knowledge"]["description"]}))
added, failed = 0, []
root = "/tmp/port/files"
for dirpath, _, names in os.walk(root):
    for n in sorted(names):
        p = os.path.join(dirpath, n)
        rel = os.path.relpath(p, root)
        with open(p, "rb") as fh:
            r = requests.post(B + "/api/v1/files/?process=true&process_in_background=false", headers=H,
                              files={"file": (rel.replace(os.sep, "__"), fh)})
        if r.status_code >= 400:
            failed.append(rel); continue
        fid = r.json()["id"]
        r = requests.post(B + "/api/v1/knowledge/%s/file/add" % kb["id"], headers=H, json={"file_id": fid})
        if r.status_code >= 400:
            failed.append(rel)
        else:
            added += 1
print("knowledge:", spec["knowledge"]["name"], "| files added:", added, "| failed:", failed)

# 2. Folder with the standing instructions and the collection
folder = j(requests.post(B + "/api/v1/folders/", headers=H, json={
    "name": spec["folder"]["name"],
    "meta": {"whl_side": spec["folder"]["side"]},
    "data": {"system_prompt": spec["folder"]["system_prompt"],
             "files": [{"type": "collection", "id": kb["id"], "name": spec["knowledge"]["name"]}]},
}))
print("folder:", folder["name"], "| side:", spec["folder"]["side"], "| instructions chars:", len(spec["folder"]["system_prompt"]))

# 3. Catch-up chats, oldest first so the newest sits on top
made = []
t0 = int(time.time()) - len(spec["chats"]) * 60
for i, c in enumerate(spec["chats"]):
    ts = t0 + i * 60
    u, a = str(uuid.uuid4()), str(uuid.uuid4())
    model = c["model"]
    msgs = {
        u: {"id": u, "parentId": None, "childrenIds": [a], "role": "user", "content": c["question"], "timestamp": ts, "models": [model]},
        a: {"id": a, "parentId": u, "childrenIds": [], "role": "assistant", "content": c["answer"], "model": model,
            "modelName": c.get("model_name", model), "modelIdx": 0, "timestamp": ts + 1, "done": True},
    }
    chat = {"title": c["title"], "models": [model], "history": {"messages": msgs, "currentId": a},
            "messages": [msgs[u], msgs[a]], "timestamp": ts * 1000, "params": {}, "files": []}
    r = j(requests.post(B + "/api/v1/chats/new", headers=H, json={"chat": chat, "folder_id": folder["id"]}))
    made.append(r["id"])
print("catch-up chats:", len(made), [c["title"] for c in spec["chats"]])

# 4. Chats written by Claude count as Paid in the everyday sidebar
if want == "everyday" and spec["folder"]["side"] == "paid":
    from open_webui.models.users import Users
    async def mark():
        usr = await Users.get_user_by_id(uid)
        s = usr.settings.model_dump() if hasattr(usr.settings, "model_dump") else dict(usr.settings or {})
        whl = dict(s.get("whl") or {})
        whl["paid_chats"] = sorted(set(whl.get("paid_chats") or []) | set(made))
        await Users.update_user_settings_by_id(uid, {"whl": whl})
    asyncio.run(mark())
    print("marked paid:", len(made))
