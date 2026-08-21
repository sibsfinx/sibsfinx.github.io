type AcceptEntry = { type: string; q: number; specificity: number };

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(",")
    .map((raw) => {
      const parts = raw.trim().split(";").map((s) => s.trim());
      const type = parts[0]?.toLowerCase();
      if (!type) return null;
      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split("=").map((s) => s.trim());
        if (name === "q") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
      return { type, q, specificity };
    })
    .filter((e): e is AcceptEntry => e !== null);
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

function preferredType(header: string | null, produces: string[]): string | null {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType: string | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null || matched.q <= 0) continue;
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  if (!tokens.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}

function markdownPath(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return "/index.md";
  return `${clean}/index.md`;
}

const STATIC_EXT =
  /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|xml|txt|json|pdf|mp4|webm|mp3|wav|ogg|zip|md)$/i;

export default async (
  request: Request,
  context: { next: () => Promise<Response>; rewrite: (path: string) => Promise<Response> },
) => {
  const url = new URL(request.url);

  if (STATIC_EXT.test(url.pathname)) {
    const res = await context.next();
    const out = new Response(res.body, res);
    appendVaryAccept(out.headers);
    if (url.pathname.endsWith(".md") && out.status === 200) {
      out.headers.set("Content-Type", "text/markdown; charset=utf-8");
    }
    return out;
  }

  const accept = request.headers.get("accept");
  const chosen = preferredType(accept, ["text/html", "text/markdown"]);

  if (chosen === null && accept) {
    const res = new Response("Not Acceptable\n\nAvailable: text/html, text/markdown\n", {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    appendVaryAccept(res.headers);
    return res;
  }

  if (chosen === "text/markdown") {
    const mdRes = await context.rewrite(markdownPath(url.pathname));
    if (mdRes.status === 200) {
      const body = await mdRes.text();
      const res = new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
      appendVaryAccept(res.headers);
      return res;
    }

    const notFound = await context.rewrite("/404.md");
    const notFoundBody =
      notFound.status === 200
        ? await notFound.text()
        : "# Page not found\n\nSee /llms.txt and /sitemap.xml\n";
    const res = new Response(notFoundBody, {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
    appendVaryAccept(res.headers);
    return res;
  }

  const htmlRes = await context.next();
  const res = new Response(htmlRes.body, htmlRes);
  appendVaryAccept(res.headers);

  if (res.status === 200 && res.headers.get("content-type")?.includes("text/html")) {
    const mdPath = markdownPath(url.pathname);
    const linkValue = `<${mdPath}>; rel="alternate"; type="text/markdown"`;
    const existing = res.headers.get("link");
    res.headers.set("Link", existing ? `${existing}, ${linkValue}` : linkValue);
  }

  return res;
};

export const config = { path: "/*" };
