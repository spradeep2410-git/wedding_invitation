#!/usr/bin/env python3
"""
Indian Wedding Invitation — Local Dev Server
Run: python server.py
Then open: http://localhost:8080
"""

import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"  [{self.address_string()}] {format % args}")

    def end_headers(self):
        # Add CORS headers so map iframes load fine locally
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()


def open_browser():
    import time
    time.sleep(0.8)
    url = f"http://localhost:{PORT}"
    print(f"\n  🌸 Opening  →  {url}\n")
    webbrowser.open(url)


if __name__ == "__main__":
    os.chdir(DIRECTORY)

    print("=" * 55)
    print("  💍  Indian Wedding Invitation — Local Server")
    print("=" * 55)
    print(f"\n  Serving files from:  {DIRECTORY}")
    print(f"  Listening on:        http://localhost:{PORT}")
    print("\n  Press  Ctrl + C  to stop the server.\n")
    print("-" * 55)

    threading.Thread(target=open_browser, daemon=True).start()

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  👋  Server stopped. See you at the wedding!\n")
