import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8" };

createServer(async (request, response) => {
  const requested = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const path = join(root, safePath);
  if (!path.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const body = await readFile(path);
    response.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Onchain Mega MVP running at http://127.0.0.1:${port}`);
});

