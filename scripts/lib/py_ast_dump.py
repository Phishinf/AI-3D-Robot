#!/usr/bin/env python3
"""
Reads a MicroPython/Python 3 source file on stdin and prints a JSON AST to
stdout. Used as a build-time helper by src/lib/lms/convertPython.ts to
transpile LEGO Robot Inventor "python mode" .lms projects into TypeScript.

We reuse Python's own `ast` module rather than hand-rolling a Python parser
in TypeScript -- that would be a much larger and more error-prone project
for comparatively little benefit, since a correct Python parser already
ships with every Python 3 interpreter.
"""
import ast
import json
import sys

FIELDS_TO_DROP = {"lineno", "col_offset", "end_lineno", "end_col_offset", "type_comment", "kind"}


def node_to_dict(node):
    if isinstance(node, ast.AST):
        result = {"_type": type(node).__name__}
        for field, value in ast.iter_fields(node):
            if field in FIELDS_TO_DROP:
                continue
            result[field] = node_to_dict(value)
        return result
    if isinstance(node, list):
        return [node_to_dict(item) for item in node]
    return node


def main():
    source = sys.stdin.read()
    tree = ast.parse(source)
    json.dump(node_to_dict(tree), sys.stdout)


if __name__ == "__main__":
    main()
