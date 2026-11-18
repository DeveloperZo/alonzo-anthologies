"""Reference answers for the two function tasks. They prove the tests are satisfiable:
python tests/test_header.py tests/ref_header.py
python tests/test_slugify.py tests/ref_header.py"""
import re


def slugify(title, max_len=60):
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower(), flags=re.ASCII).strip("-")
    slug = slug[:max_len].rstrip("-")
    return slug or "untitled"


def parse_doc_header(md):
    start = md.find("<!--")
    if start == -1:
        return {}
    end = md.find("-->", start + 4)
    if end == -1:
        return {}
    result = {}
    key = None
    for number, raw in enumerate(md[start + 4:end].split("\n")):
        line = raw.rstrip("\r")
        text = line.strip()
        if not text:
            continue
        # The text that shares a line with the opening marker counts as unindented.
        indented = number > 0 and line[0] in " \t"
        if not indented:
            if ":" in text:
                name, value = text.split(":", 1)
                key = "_".join(name.lower().split())
                result[key] = value.strip()
            continue
        if key is None:
            continue
        current = result[key]
        if text.startswith("- ") and (isinstance(current, list) or current == ""):
            item = text[2:].strip()
            if isinstance(current, list):
                current.append(item)
            else:
                result[key] = [item]
        elif isinstance(current, list):
            current[-1] = current[-1] + " " + text
        elif current == "":
            result[key] = text
        else:
            result[key] = current + " " + text
    return result
