import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "/tmp/inbetween-shots";
const routes = process.argv.slice(2);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });

for (const r of routes) {
  const name = (r === "/" ? "home" : r.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")).slice(0, 60);
  try {
    await page.goto(BASE + r, { waitUntil: "load", timeout: 40000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
    const lay = await page.evaluate(() => document.querySelector("main")?.getAttribute("data-scheme") ?? "");
    console.log(`shot ${name}.png  (${r})`);
  } catch (e) {
    console.log(`FAIL ${r}: ${e.message}`);
  }
}
await browser.close();
console.log("done ->", OUT);
