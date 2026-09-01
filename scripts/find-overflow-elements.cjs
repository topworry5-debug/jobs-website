const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const overflowingElements = await page.evaluate(() => {
    const docWidth = window.innerWidth;
    const all = document.querySelectorAll('*');
    const culprits = [];

    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || el.scrollWidth > docWidth + 1) {
        culprits.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          width: rect.width,
          scrollWidth: el.scrollWidth,
          right: rect.right
        });
      }
    });

    return culprits;
  });

  console.log('Culprits exceeding 375px width:');
  console.log(JSON.stringify(overflowingElements.slice(0, 15), null, 2));

  await browser.close();
}

main().catch(console.error);
