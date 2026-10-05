import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const widths = [320, 375, 425];
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

const runCommand = (cmd, args) =>
  new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => resolve({ code, stdout, stderr }));
    proc.on("error", reject);
  });

async function main() {
  console.log("Checking responsive rendering using browser:", BROWSER_PATH);

  const outDir = path.join(process.cwd(), ".tmp-responsive-audit");
  fs.mkdirSync(outDir, { recursive: true });

  for (const width of widths) {
    for (const route of routes) {
      const url = `http://localhost:5173${route}`;
      const safeName = `${width}_${route.replace(/[\/]/g, "_") || "home"}.png`;
      const outPath = path.join(outDir, safeName);

      // Run headless chrome with window size
      await runCommand(BROWSER_PATH, [
        "--headless=new",
        `--window-size=${width},800`,
        "--hide-scrollbars",
        `--screenshot=${outPath}`,
        url,
      ]);
    }
  }

  console.log("Screenshots captured in .tmp-responsive-audit");
}

main().catch(console.error);
