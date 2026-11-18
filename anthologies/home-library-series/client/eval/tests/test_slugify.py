"""Tests for the easy function task. Usage: python test_slugify.py <candidate.py>
Prints "<passed> <total>" on the last line."""
import importlib.util
import sys

CASES = [
    (("Hello, World!",), {}, "hello-world"),
    (("  ARCH-003 Hosting ",), {}, "arch-003-hosting"),
    (("",), {}, "untitled"),
    (("!!!",), {}, "untitled"),
    (("Café déjà vu",), {}, "caf-d-j-vu"),
    (("a" * 70,), {}, "a" * 60),
    (("abcde fghij",), {"max_len": 6}, "abcde"),
    (("Already-slugged_name",), {}, "already-slugged-name"),
    (("x",), {}, "x"),
    (("Tab\tand\nnewline",), {}, "tab-and-newline"),
    (("a٣b",), {}, "a-b"),
    (("Section 7: The Opening",), {}, "section-7-the-opening"),
    (("--Already--Hyphenated--",), {}, "already-hyphenated"),
    (("one two three",), {"max_len": 7}, "one-two"),
]


def main():
    spec = importlib.util.spec_from_file_location("candidate", sys.argv[1])
    mod = importlib.util.module_from_spec(spec)
    passed = 0
    try:
        spec.loader.exec_module(mod)
        fn = mod.slugify
    except Exception as exc:  # the candidate did not even load
        print(f"load error: {exc!r}")
        print(f"0 {len(CASES)}")
        return
    for args, kwargs, want in CASES:
        try:
            got = fn(*args, **kwargs)
        except Exception as exc:
            got = f"raised {exc!r}"
        if got == want:
            passed += 1
        else:
            print(f"FAIL slugify{args!r} {kwargs!r}: want {want!r}, got {got!r}")
    print(f"{passed} {len(CASES)}")


main()
