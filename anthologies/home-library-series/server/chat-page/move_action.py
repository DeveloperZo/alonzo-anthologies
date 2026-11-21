"""
title: Move to the other page
description: Moves this chat between the everyday page and the private page. It asks first, copies the chat across inside the house, then archives the original here.
version: 1.0
icon_url: data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS44IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik03IDdoMTFsLTMtMyIvPjxwYXRoIGQ9Ik0xNyAxN0g2bDMgMyIvPjwvc3ZnPg==
"""

# Installed on both chat pages. The page it runs on works out the direction.
# The chat travels page to page over the home's own Docker network; it never
# leaves the computer. Attached files and images do not travel: only the words.
# The token for the other page is a setting of this function (Admin Panel,
# Functions, the gear), put there by the setup script. It is never shown.

import json, time, urllib.request, urllib.error
from pydantic import BaseModel, Field


class Action:
    class Valves(BaseModel):
        this_page: str = Field(default="", description="everyday or private")
        other_url: str = Field(default="", description="The other chat page, inside Docker")
        other_token: str = Field(default="", description="Sign-in for the other page (set by the setup script)")

    def __init__(self):
        self.valves = self.Valves()

    def _other(self, path, body=None, method=None):
        req = urllib.request.Request(self.valves.other_url.rstrip("/") + path,
                                     json.dumps(body).encode() if body is not None else None,
                                     {"Content-Type": "application/json", "Authorization": "Bearer " + self.valves.other_token},
                                     method=method)
        return json.load(urllib.request.urlopen(req, timeout=60))

    async def action(self, body: dict, __user__=None, __event_emitter__=None, __event_call__=None):
        async def say(text, done=True):
            if __event_emitter__:
                await __event_emitter__({"type": "status", "data": {"description": text, "done": done}})

        to_private = self.valves.this_page == "everyday"
        where = "the Private page" if to_private else "the Everyday page"
        if not (self.valves.other_url and self.valves.other_token):
            await say("Moving is not set up on this page yet.")
            return
        chat_id = body.get("chat_id")
        if not chat_id:
            await say("Save the chat first, then move it.")
            return

        if to_private:
            prompt = ("This copies the whole chat to the Private page and archives it here. "
                      "From then on only the home AI can answer it. Attached files and images stay behind.")
        else:
            prompt = ("This copies the whole chat to the Everyday page and archives it on the Private page. "
                      "On the Everyday page it is stored outside the private drives, and if you pick Claude "
                      "there, the whole chat is sent to Anthropic. Only move it if nothing in it is private. "
                      "Attached files and images stay behind.")
        if __event_call__:
            ok = await __event_call__({"type": "confirmation", "data": {"title": "Move this chat to " + where + "?", "message": prompt}})
            if not ok:
                await say("Not moved.")
                return

        from open_webui.models.chats import Chats
        from open_webui.models.folders import Folders
        uid = (__user__ or {}).get("id")
        chat = await Chats.get_chat_by_id_and_user_id(chat_id, uid)
        if not chat:
            await say("Could not read this chat.")
            return
        await say("Moving to " + where + "...", done=False)

        # Same-named folder on the other page, if there is one.
        folder_id = None
        if chat.folder_id:
            here = await Folders.get_folder_by_id_and_user_id(chat.folder_id, uid)
            try:
                for f in self._other("/api/v1/folders/"):
                    if here and f.get("name") == here.name:
                        folder_id = f["id"]
            except Exception:
                pass

        content = dict(chat.chat or {})
        content["files"] = []
        content["title"] = chat.title
        form = {"chats": [{"chat": content, "folder_id": folder_id, "meta": {"moved_from": self.valves.this_page},
                           "pinned": False, "archived": False,
                           "created_at": chat.created_at, "updated_at": int(time.time())}]}
        try:
            made = self._other("/api/v1/chats/import", form)
            new_id = made[0]["id"]
        except urllib.error.HTTPError as e:
            await say("Not moved: the other page refused (%s). Nothing changed here." % e.code)
            return
        except Exception as e:
            await say("Not moved: %s. Nothing changed here." % e)
            return

        # Only once the copy exists: archive the original (recoverable from Archived Chats).
        try:
            if not chat.archived:
                await Chats.toggle_chat_archive_by_id(chat_id)
        except Exception:
            await say("Copied to %s, but this copy could not be archived. Archive it by hand." % where)
            return
        base = "http://lemonpepper:3002" if to_private else "http://lemonpepper:3000"
        await say("Moved to %s. Open it there: %s/c/%s" % (where, base, new_id))
