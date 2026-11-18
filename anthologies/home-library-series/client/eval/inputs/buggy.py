"""Split text into chunks that fit a local model's context window,
and total up the numbers from a batch of runs."""
import re

CHARS_PER_TOKEN = 4


def estimate_tokens(text):
    """Rough token count: about four characters to a token."""
    return len(text) // CHARS_PER_TOKEN


def split_paragraphs(text):
    """Split on blank lines and drop empty paragraphs."""
    parts = re.split(r"\n\s*\n", text)
    return [p.strip() for p in parts if p.strip()]


def hard_split(text, max_chars):
    """Cut one over-long paragraph into pieces of at most max_chars.
    Joining the pieces gives back the original text."""
    pieces = []
    for start in range(0, len(text), max_chars):
        pieces.append(text[start:start + max_chars - 1])
    return pieces


def chunk_text(text, max_tokens):
    """Group paragraphs into chunks of at most max_tokens each.
    A paragraph is kept whole unless it alone is too large."""
    if max_tokens <= 0:
        raise ValueError("max_tokens must be positive")
    max_chars = max_tokens * CHARS_PER_TOKEN
    chunks = []
    current = []
    size = 0
    for para in split_paragraphs(text):
        if len(para) > max_chars:
            if current:
                chunks.append("\n\n".join(current))
                current = []
                size = 0
            chunks.extend(hard_split(para, max_chars))
            continue
        extra = len(para) + (2 if current else 0)
        if size + extra > max_chars:
            chunks.append("\n\n".join(current))
            current = [para]
            size = len(para)
        else:
            current.append(para)
            size += extra
    if current:
        chunks.append("\n\n".join(current))
    return chunks


def summarize_stats(runs):
    """Total up run records. Each record is a dict with the keys
    route, tokens_in, tokens_out and seconds."""
    totals = {}
    for run in runs:
        entry = totals.setdefault(
            run["route"],
            {"runs": 0, "tokens_in": 0, "tokens_out": 0, "seconds": 0.0},
        )
        entry["runs"] += 1
        entry["tokens_in"] += run["tokens_in"]
        entry["tokens_out"] += run["tokens_out"]
        entry["seconds"] += run["seconds"]
    for entry in totals.values():
        if entry["seconds"] > 0:
            entry["tokens_per_second"] = round(entry["tokens_out"] / entry["seconds"], 1)
        else:
            entry["tokens_per_second"] = 0.0
    return totals


def slowest(runs, count=3):
    """Return the slowest runs, slowest first."""
    ordered = sorted(runs, key=lambda run: run["seconds"], reverse=True)
    return ordered[:count]


def fits(text, reply_tokens=2000, window=16384):
    """True when the text plus the reserved reply fits the window."""
    if reply_tokens >= window:
        return False
    return estimate_tokens(text) + reply_tokens <= window
