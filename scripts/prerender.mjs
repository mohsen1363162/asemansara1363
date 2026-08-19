/**
 * Prerender the TanStack Start app to static HTML for GitHub Pages.
 *
 * It boots the built Nitro (Cloudflare-module) server locally with a minimal
 * ASSETS binding that serves the client build from dist/client, then fetches
 * the routes and writes index.html + 404.html into the static output.
 */
import { readFile, writeFile, mkdir, stat, readdir } from "node:fs/promises";
import { join, extname, normalize, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const clientDir = join(root, "dist", "client");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

async function serveAsset(request) {
  const url = new URL(request.url);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const safe = normalize(pathname).replace(/^([/\\])+/, "");
  const filePath = join(clientDir, safe);
  if (!filePath.startsWith(clientDir)) {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    const st = await stat(filePath);
    if (!st.isFile()) throw new Error("not a file");
    const body = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
    return new Response(body, {
      status: 200,
      headers: { "content-type": type },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

const { default: server } = await import(join(root, "dist", "server", "index.mjs") + `?t=${Date.now()}`);

const BASE_PATH = process.env.VITE_BASEPATH ?? "/";

const env = {
  ASSETS: { fetch: serveAsset },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

async function prerenderRoute(path, outFile) {
  const url = new URL(path, "http://localhost/");
  const res = await server.fetch(new Request(url), env, ctx);
  const text = await res.text();
  if (res.status !== 200) {
    throw new Error(`Prerender ${path} failed with status ${res.status}\n${text.slice(0, 500)}`);
  }
  const outPath = join(clientDir, outFile);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, text, "utf8");
  console.log(`[prerender] ${path} -> ${outPath} (${text.length} bytes, status ${res.status})`);
}

const rootPath = `${BASE_PATH.replace(/\/?$/, "/")}`;
await prerenderRoute(rootPath, "index.html");
// GitHub Pages SPA fallback: 404.html is served for unknown paths.
await prerenderRoute(rootPath, "404.html");

// Sanity: list output
const files = await readdir(join(clientDir, "assets"));
console.log(`[prerender] done. assets: ${files.join(", ")}`);
