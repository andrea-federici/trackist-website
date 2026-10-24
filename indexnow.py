#!/usr/bin/env python3
"""Tell search engines which stridebuddy.app pages changed, through IndexNow.

IndexNow is a ping: we send a list of URLs, and Bing, Yandex, Seznam, Naver and
the other engines that take part crawl them soon after. Google does not take
part, so this adds to the Search Console sitemap and never replaces it.

The key proves we own the host. It is public on purpose: it is served at
https://stridebuddy.app/<KEY>.txt, and that file holds only the key.

Run it after a push to main that adds or changes pages, once the deploy is live
(about a minute):

    python3 indexnow.py                     # every URL in the live sitemap.xml
    python3 indexnow.py --local             # every URL in ./sitemap.xml
    python3 indexnow.py /faq /it            # only these pages (paths or full URLs)
    python3 indexnow.py --dry-run [...]     # print the request, send nothing

Before it submits, it fetches the live key file without following redirects
and checks the body matches the key. The API answers a bad key with a bare
403 or 422, so this check gives a clearer error first.

Standard library only. A development tool, like serve.py: it does nothing on
the published site.
"""

import json
import os
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

HOST = "stridebuddy.app"
KEY = "a7689d76cbf393f0b43d86b076b47f32"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP_URL = f"https://{HOST}/sitemap.xml"
ENDPOINT = "https://api.indexnow.org/indexnow"
HERE = os.path.dirname(os.path.abspath(__file__))
# Cloudflare answers 403 to urllib's default User-Agent, so name ourselves.
HEADERS = {"User-Agent": f"stridebuddy-indexnow/1.0 (+https://{HOST})"}

MEANING = {
    200: "OK: URLs received",
    202: "Accepted: URLs received, key check still pending",
    400: "Bad request: the body is not valid",
    403: "Forbidden: the key file was not found or does not match",
    422: "Unprocessable: a URL is not on the host, or the key does not match",
    429: "Too many requests: wait and try again later",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fail(message):
    sys.exit(f"indexnow: {message}")


def sitemap_urls(local):
    if local:
        with open(os.path.join(HERE, "sitemap.xml"), "rb") as f:
            data = f.read()
    else:
        request = urllib.request.Request(SITEMAP_URL, headers=HEADERS)
        with urllib.request.urlopen(request, timeout=20) as r:
            data = r.read()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [loc.text.strip() for loc in ET.fromstring(data).findall("s:url/s:loc", ns)]


def normalize(arg):
    if arg.startswith("/"):
        return f"https://{HOST}{arg}"
    return arg


def check_key_file():
    with open(os.path.join(HERE, f"{KEY}.txt"), encoding="utf-8") as f:
        if f.read() != KEY:
            fail(f"{KEY}.txt in the repository does not contain exactly the key")
    opener = urllib.request.build_opener(NoRedirect)
    try:
        with opener.open(urllib.request.Request(KEY_LOCATION, headers=HEADERS), timeout=20) as r:
            body = r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        fail(f"{KEY_LOCATION} returned {e.code}, not 200. Is the push deployed?")
    if body.strip() != KEY:
        fail(f"{KEY_LOCATION} returned 200 but the body is not the key")


def main(argv):
    dry_run = "--dry-run" in argv
    local = "--local" in argv
    args = [a for a in argv if a not in ("--dry-run", "--local")]
    unknown = [a for a in args if a.startswith("-")]
    if unknown:
        fail(f"unknown option {unknown[0]}. See the top of this file for usage.")

    urls = [normalize(a) for a in args] if args else sitemap_urls(local)
    if not urls:
        fail("no URLs to submit")
    wrong_host = [u for u in urls if not u.startswith(f"https://{HOST}/")]
    if wrong_host:
        fail(f"only https://{HOST}/ URLs can be sent with this key: {wrong_host[0]}")

    payload = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    body = json.dumps(payload, indent=2)
    if dry_run:
        print(f"POST {ENDPOINT}\n{body}")
        return

    check_key_file()
    request = urllib.request.Request(
        ENDPOINT,
        data=body.encode("utf-8"),
        headers={**HEADERS, "Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as r:
            status, text = r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        status, text = e.code, e.read().decode("utf-8", "replace")

    print(f"Submitted {len(urls)} URL(s):")
    for u in urls:
        print(f"  {u}")
    print(f"HTTP {status} {MEANING.get(status, '')}".rstrip())
    if text.strip():
        print(text.strip())
    if status not in (200, 202):
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1:])
