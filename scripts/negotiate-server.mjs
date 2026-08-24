#!/usr/bin/env node
/**
 * Local static server with Accept: text/markdown negotiation.
 * Usage: node scripts/negotiate-server.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 8765);

function parseAccept(header) {
  if (!header) return [];
  return header.split(",").map((raw) => {
    const parts = raw.trim().split(";").map((s) => s.trim());
    const type = (parts[0] || "").toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim());
      if (name === "q") q = Number(value) || 0;
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    return { type, q, specificity };
  });
}

function preferredType(header, produces) {
  const entries = parseAccept(header);
  if (!entries.length) return produces[0];
  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;
  for (const candidate of produces) {
    let matched = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      const match =
        e.type === candidate ||
        e.type === "*/*" ||
        (e.type.endsWith("/*") && candidate.startsWith(e.type.slice(0, -1)));
      if (!match) continue;
      if (
        !matched ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (!matched || matched.q <= 0) continue;
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }
  return bestType;
}

function markdownPath(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return "/index.md";
  return `${clean}/index.md`;
}

function safeJoin(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  const rel = decoded.replace(/^\/+/, "");
  const full = path.resolve(root, rel || "index.html");
  if (!full.startsWith(root)) return null;
  return full;
}

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type,
    Vary: "Accept, Accept-Encoding",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  let pathname = url.pathname;
  if (pathname !== "/" && pathname.endsWith("/")) {
    // directory index
  }

  // Serve real files (css, md siblings, pdf, txt, xml) before HTML negotiation.
  let direct = safeJoin(pathname);
  if (direct && fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    const chosen = preferredType(req.headers.accept || null, ["text/html", "text/markdown"]);
    const ext = path.extname(direct).toLowerCase();
    if (chosen === "text/markdown" && (ext === ".html" || ext === "")) {
      // fall through to markdown negotiation for HTML documents only
    } else {
      const types = {
        ".html": "text/html; charset=utf-8",
        ".md": "text/markdown; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".xml": "application/xml; charset=utf-8",
        ".txt": "text/plain; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".svg": "image/svg+xml",
      };
      return send(res, 200, fs.readFileSync(direct), types[ext] || "application/octet-stream");
    }
  }

  const chosen = preferredType(req.headers.accept || null, ["text/html", "text/markdown"]);
  if (chosen === "text/markdown") {
    const mdRel = markdownPath(pathname);
    const mdFile = safeJoin(mdRel);
    if (mdFile && fs.existsSync(mdFile) && fs.statSync(mdFile).isFile()) {
      return send(res, 200, fs.readFileSync(mdFile), "text/markdown; charset=utf-8");
    }
    const notFound = safeJoin("/404.md");
    const body = notFound && fs.existsSync(notFound)
      ? fs.readFileSync(notFound)
      : "# Page not found\n";
    return send(res, 404, body, "text/markdown; charset=utf-8");
  }

  let filePath = safeJoin(pathname);
  if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (pathname === "/") filePath = path.join(root, "index.html");

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const html404 = path.join(root, "404.html");
    if (fs.existsSync(html404)) {
      return send(res, 404, fs.readFileSync(html404), "text/html; charset=utf-8");
    }
    return send(res, 404, "Not found", "text/plain; charset=utf-8");
  }

  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };
  send(res, 200, fs.readFileSync(filePath), types[ext] || "application/octet-stream");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`negotiate-server on http://127.0.0.1:${port}`);
});
