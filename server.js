import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { bootstrap } from "@mercuryworkshop/proxy-bootstrap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

const app = express();

// Bootstrap downloads the matching Scramjet client/runtime packages from npm
// on first start, then exposes the service worker, browser bundles, and Wisp route.
const { routeRequest, routeUpgrade } = await bootstrap({ transport: "libcurl" });

// Scramjet routes must run before Express static files and the SPA fallback.
app.use((req, res, next) => {
  if (routeRequest(req, res)) return;
  next();
});

app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.get("/health", (req, res) => {
  res.json({ status: "ok", scramjet: "initialized" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);
server.on("upgrade", (req, socket, head) => {
  const handled = routeUpgrade(req, socket, head);
  if (!handled) socket.destroy();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Pocket's Arcade with Scramjet running on port ${PORT}`);
});
