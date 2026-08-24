#!/usr/bin/env node
/** Copy public site files into dist/ for Netlify publish (develop UI + agentic layers). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");

const files = [
  "index.html",
  "index.md",
  "404.html",
  "404.md",
  "site.css",
  "llms.txt",
  "llms-full.txt",
  "robots.txt",
  "sitemap.xml",
  "sitemap.md",
  "AGENTS.md",
];

const dirs = ["about", "work", "contact", "privacy"];

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyFile(rel) {
  const src = path.join(root, rel);
  const dest = path.join(out, rel);
  if (!fs.existsSync(src)) {
    console.warn("skip missing", rel);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(rel) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) {
    console.warn("skip missing dir", rel);
    return;
  }
  fs.cpSync(src, path.join(out, rel), { recursive: true });
}

rmrf(out);
fs.mkdirSync(out, { recursive: true });
for (const f of files) copyFile(f);
for (const d of dirs) copyDir(d);
console.log("Prepared Netlify dist/ with", files.length, "files and", dirs.length, "dirs");
