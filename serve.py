#!/usr/bin/env python3
"""Local dev server that behaves like the production host.

Cloudflare Pages serves this site with the .html extension stripped: /support
returns support.html, and the /support.html form 307s to it. Every internal
link, every rel="canonical" and every URL in sitemap.xml therefore uses the
extensionless form.

`python3 -m http.server` does not do that. Under it, the footer links 404 and
the site looks broken locally while being correct in production — which is
misleading in exactly the direction that gets a real fix reverted.

This adds the one behaviour that matters and nothing else. It is a development
tool: it is never deployed, and it does not make the published site any less
dependency-free.

    python3 serve.py [port]        # default 8000
"""

import http.server
import os
import sys


class ExtensionStrippingHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        resolved = super().translate_path(path)
        if not os.path.exists(resolved) and os.path.exists(resolved + ".html"):
            return resolved + ".html"
        return resolved


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Serving StrideBuddy on http://localhost:{port} (extensionless URLs on)")
    http.server.test(HandlerClass=ExtensionStrippingHandler, port=port)
