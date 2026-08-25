#!/usr/bin/env node
/**
 * Agentic readiness checks (stdlib only).
 * Usage:
 *   node scripts/agentic-checks.mjs              # local file checks
 *   BASE_URL=https://alexmesch.com node scripts/agentic-checks.mjs  # live probes
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.BASE_URL || "";
let failed = 0;

function ok(name, cond, detail = "") {
  if (cond) {
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function stripTags(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+aria-hidden=["']true["'][^>]*>[\s\S]*?<\/[^>]+>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Local file checks ---
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const visible = stripTags(indexHtml);
ok("dist/.ai is not published", !fs.existsSync(path.join(root, "dist", ".ai")));

ok("homepage has H1", /<h1[\s>]/i.test(indexHtml));
ok("homepage visible text >= 500 chars", visible.length >= 500, `got ${visible.length}`);
ok("homepage has no aria-hidden agent dump", !/class=["']agent-seo["']/.test(indexHtml));
ok("homepage has JSON-LD", /application\/ld\+json/.test(indexHtml));
ok("JSON-LD includes Person", /"@type"\s*:\s*"Person"/.test(indexHtml));
ok("JSON-LD includes WebSite", /"@type"\s*:\s*"WebSite"/.test(indexHtml));

const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
ok("llms.txt has When to use this site", /## When to use this site/i.test(llms));
ok("llms.txt names lead/senior use cases", /Lead|Senior Software/i.test(llms));

const notFoundMd = fs.readFileSync(path.join(root, "404.md"), "utf8");
ok("404.md points to llms.txt", /llms\.txt/.test(notFoundMd));
ok("404.md points to sitemap", /sitemap/i.test(notFoundMd));

const notFoundHtml = fs.readFileSync(path.join(root, "404.html"), "utf8");
ok("404.html includes markdown recovery block", /md-recovery/.test(notFoundHtml));
ok("404.html links llms.txt", /llms\.txt/.test(notFoundHtml));

const negotiate = fs.readFileSync(
  path.join(root, "netlify/edge-functions/negotiate.ts"),
  "utf8",
);
ok("edge negotiate sets Vary Accept", /appendVaryAccept|Vary.*Accept/i.test(negotiate));
ok("edge negotiate serves text/markdown", /text\/markdown/.test(negotiate));

const toml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
ok("netlify.toml has 404 redirect", /status\s*=\s*404/.test(toml));
ok(
  "netlify.md headers include Vary Accept",
  /for = "\/\*\.md"[\s\S]*?Vary = "Accept, Accept-Encoding"/.test(toml),
);

// --- Optional live probes ---
async function live() {
  const u = baseUrl.replace(/\/$/, "");
  const home = await fetch(u + "/");
  const homeHtml = await home.text();
  ok("live homepage 200", home.status === 200);
  ok("live homepage visible >= 500", stripTags(homeHtml).length >= 500, `got ${stripTags(homeHtml).length}`);
  ok("live homepage JSON-LD", /application\/ld\+json/.test(homeHtml));

  const md = await fetch(u + "/", { headers: { Accept: "text/markdown" } });
  const mdCt = md.headers.get("content-type") || "";
  const mdVary = md.headers.get("vary") || "";
  ok("live Accept markdown content-type", /text\/markdown/i.test(mdCt), mdCt);
  ok("live Accept markdown Vary includes Accept", /accept/i.test(mdVary), mdVary);
  ok("live markdown body non-empty", (await md.text()).length > 100);

  const miss = `/agentic-missing-${Date.now()}`;
  const html404 = await fetch(u + miss);
  ok("live missing path HTTP 404", html404.status === 404, `got ${html404.status}`);

  const md404 = await fetch(u + miss, { headers: { Accept: "text/markdown" } });
  const md404Ct = md404.headers.get("content-type") || "";
  const md404Body = await md404.text();
  ok("live 404 markdown status 404", md404.status === 404, `got ${md404.status}`);
  ok("live 404 markdown content-type", /text\/markdown/i.test(md404Ct), md404Ct);
  ok("live 404 markdown mentions llms or sitemap", /llms\.txt|sitemap/i.test(md404Body));

  const llmsLive = await fetch(u + "/llms.txt");
  const llmsText = await llmsLive.text();
  ok("live llms when-to-use", /When to use this site/i.test(llmsText));
}

const run = baseUrl ? live() : Promise.resolve();
run
  .then(() => {
    if (failed) {
      console.error(`\n${failed} check(s) failed`);
      process.exit(1);
    }
    console.log("\nAll checks passed");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
