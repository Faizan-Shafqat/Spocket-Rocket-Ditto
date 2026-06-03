/**
 * Local server: open http://127.0.0.1:3710/ — type new theme name, click button → hs cms upload.
 * Same HubSpot account as in `hs` CLI (e.g. fake-demo-account / 40576602).
 *
 *   node tools/create-theme-button-server.cjs
 */
const http = require("http");
const { exec } = require("child_process");
const path = require("path");
const root = path.join(__dirname, "..");
const port = process.env.THEME_PORT || 3710;
const acct = process.env.HS_ACCOUNT || "fake-demo-account";
const src = process.env.THEME_SOURCE || path.join(root, "hubspot-fetched", "sr");

const page = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Push new theme to HubSpot</title>
<style>body{font-family:system-ui;max-width:32rem;margin:2rem auto;padding:0 1rem}label{display:block;margin:.5rem 0}input{width:100%;padding:.5rem}button{margin-top:1rem;padding:.6rem 1.2rem;cursor:pointer}#out{white-space:pre-wrap;margin-top:1rem;background:#111;color:#0f0;padding:1rem;font-size:12px;min-height:3rem}.err{background:#300;color:#faa}</style></head><body>
<h1>New theme in this HubSpot account</h1>
<p>Source folder (local): <code>${src.replace(/\\/g, "\\\\")}</code></p>
<form id="f">
  <label>New theme folder name in Design Manager<br><input name="name" required placeholder="e.g. Testing-hardcoded-2026" /></label>
  <button type="submit">Create / update theme in HubSpot</button>
</form>
<div id="out"></div>
<script>
document.getElementById("f").onsubmit=async (e)=>{e.preventDefault();
  const o=document.getElementById("out");o.className="";o.textContent="Uploading...";
  const r=await fetch("/publish",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name: document.querySelector("[name=name]").value})});
  const t=await r.text(); o.className=r.ok?"":"err"; o.textContent=t;};
</script>
</body></html>`;

function publish(name, cb) {
  const n = String(name).trim();
  if (!n || /[/\\<>]/.test(n)) return cb(new Error("Invalid name"));
  const line = `hs cms upload ${JSON.stringify(src)} ${JSON.stringify(n)} -a ${JSON.stringify(acct)} -o`;
  const env = { ...process.env, FORCE_COLOR: "0" };
  exec(line, { cwd: root, env, maxBuffer: 5 * 1024 * 1024, windowsHide: true, shell: true }, (err, stdout, stderr) => {
    const out = (stdout || "") + (stderr || "");
    if (err) return cb(new Error(out || err.message));
    cb(null, out || "OK");
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(page);
  }
  if (req.method === "POST" && req.url === "/publish") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      let name = "";
      try {
        name = JSON.parse(body).name;
      } catch (e) {
        res.writeHead(400);
        return res.end("bad json");
      }
      publish(name, (err, msg) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("FAILED\n\n" + (err && err.message ? err.message : String(err)));
        }
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("SUCCESS\n\n" + String(msg).slice(0, 12000));
      });
    });
    return;
  }
  res.writeHead(404);
  res.end("not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open in browser: http://127.0.0.1:" + port + "/");
  console.log("Source:", src, "| Account:", acct);
});
