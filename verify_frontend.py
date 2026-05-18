import os
import sys


def verify_index_html() -> bool:
    if not os.path.exists("index.html"):
        print("index.html not found", file=sys.stderr)
        return False

    with open("index.html", "r", encoding="utf-8") as html_file:
        html = html_file.read()

    required_markers = ['<div id="root"></div>', 'src="/src/main.tsx"']
    missing = [marker for marker in required_markers if marker not in html]
    if missing:
        print(f"index.html missing required markers: {', '.join(missing)}", file=sys.stderr)
        return False

    print("index.html found and contains the Vite React root.")
    return True


if __name__ == "__main__":
    raise SystemExit(0 if verify_index_html() else 1)
