import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/samam/WEB DESIGNING/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');

if (!existsSync(screenshotDir)) mkdirSync(screenshotDir);

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const existing = readdirSync(screenshotDir).filter(f => f.endsWith('.png')).length;
const filename = `screenshot-${existing + 1}${label}.png`;
const filepath = join(screenshotDir, filename);

const executablePath = 'C:/Users/samam/.cache/puppeteer/chrome-headless-shell/win64-146.0.7680.153/chrome-headless-shell-win64/chrome-headless-shell.exe';

const browser = await puppeteer.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();
console.log(`Screenshot saved: ${filepath}`);
