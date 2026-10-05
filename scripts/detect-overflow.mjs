import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import WebSocket from "ws";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const PORT = 9222;

const routes = [
  "/",
  "/about",
  "/services",
  "/services/clinical-physiotherapy",
  "/treatments",
  "/treatments/sciatica",
  "/doctors",
  "/doctors/dr-md-rashid",
  "/booking",
  "/contact",
  "/blogs",
  "/blogs/pf-blog-1-neck-stiffness-karan-aur-exercise-se-rahat",
  "/gallery",
];

const widths = [320, 375, 425];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
      return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on("open", resolve);
      this.ws.on("error", reject);
      this.ws.on("message", (msg) => {
        const parsed = JSON.parse(msg.toString());
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const cb = this.callbacks.get(parsed.id);
          this.callbacks.delete(parsed.id);
          if (parsed.error) cb.reject(parsed.error);
          else cb.resolve(parsed.result);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log("Starting Chrome for overflow detection...");
  const chrome = spawn(BROWSER_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ]);

  await sleep(1500);

  try {
    const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
    const pages = await fetchJson(`http://127.0.0.1:${PORT}/json`);
    const page = pages[0];
    if (!page) throw new Error("No page found");

    const cdp = new SimpleCDP(page.webSocketDebuggerUrl);
    await cdp.connect();

    console.log("Connected to CDP. Testing routes across 320, 375, 425...");

    const results = [];

    for (const width of widths) {
      // Set viewport
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 800,
        deviceScaleFactor: 2,
        mobile: true,
      });

      for (const route of routes) {
        const url = `http://localhost:5173${route}`;
        await cdp.send("Page.navigate", { url });
        await sleep(1200);

        // Evaluate scrollWidth and check overflowing elements
        const evalRes = await cdp.send("Runtime.evaluate", {
          expression: `
            (() => {
              const docWidth = document.documentElement.offsetWidth;
              const scrollWidth = document.documentElement.scrollWidth;
              const bodyScrollWidth = document.body.scrollWidth;
              const hasOverflow = scrollWidth > docWidth || bodyScrollWidth > docWidth;

              const overflowingElements = [];
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > docWidth + 1) {
                  overflowingElements.push({
                    tag: el.tagName.toLowerCase(),
                    className: el.className?.toString?.().slice(0, 100) || '',
                    text: el.innerText?.slice(0, 40) || '',
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                    maxAllowed: docWidth
                  });
                }
              }

              return {
                docWidth,
                scrollWidth,
                bodyScrollWidth,
                hasOverflow,
                overflowCount: overflowingElements.length,
                samples: overflowingElements.slice(0, 5)
              };
            })()
          `,
          returnByValue: true,
        });

        const val = evalRes.result.value;
        results.push({
          width,
          route,
          ...val,
        });

        if (val.hasOverflow) {
          console.warn(`⚠️ OVERFLOW at ${width}px on ${route}: doc=${val.docWidth}, scroll=${val.scrollWidth}`);
          console.warn(JSON.stringify(val.samples, null, 2));
        } else {
          console.log(`✅ OK at ${width}px on ${route}`);
        }
      }
    }

    cdp.close();
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
