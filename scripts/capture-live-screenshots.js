const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureLiveProduction() {
  console.log("=================================================");
  console.log("Capturing Real Browser Screenshots of Vercel Production");
  console.log("Target: https://jobs-website-delta.vercel.app");
  console.log("=================================================\n");

  const artifactDir = "C:\\Users\\topwo\\.gemini\\antigravity-ide\\brain\\974ebed1-b4d4-4fd6-81e8-55e43559661c";
  
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);

  const targets = [
    {
      name: "Homepage",
      url: "https://jobs-website-delta.vercel.app/",
      out: path.join(artifactDir, "vercel_live_homepage.png")
    },
    {
      name: "Govt Jobs Hub",
      url: "https://jobs-website-delta.vercel.app/jobs/govt",
      out: path.join(artifactDir, "vercel_live_govt_jobs.png")
    },
    {
      name: "Job Detail (FPSC)",
      url: "https://jobs-website-delta.vercel.app/jobs/govt-fpsc-01",
      out: path.join(artifactDir, "vercel_live_job_detail.png")
    },
    {
      name: "CV Builder",
      url: "https://jobs-website-delta.vercel.app/cv-builder",
      out: path.join(artifactDir, "vercel_live_cv_builder.png")
    }
  ];

  for (const t of targets) {
    console.log(`Navigating to ${t.name}: ${t.url} ...`);
    await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Inspect computed style of body and hero/navbar
    const styles = await page.evaluate(() => {
      const body = document.querySelector('body');
      const navbar = document.querySelector('.navbar-wrapper');
      const hero = document.querySelector('.hero-section') || document.querySelector('.hero-container');
      const card = document.querySelector('.job-card-item');

      return {
        bodyBg: body ? window.getComputedStyle(body).backgroundColor : null,
        bodyColor: body ? window.getComputedStyle(body).color : null,
        bodyFont: body ? window.getComputedStyle(body).fontFamily : null,
        navbarBg: navbar ? window.getComputedStyle(navbar).backgroundColor : null,
        cardBorder: card ? window.getComputedStyle(card).borderColor : null,
        cardBg: card ? window.getComputedStyle(card).backgroundColor : null
      };
    });

    console.log(`   • Computed Styles:`, styles);

    await page.screenshot({ path: t.out, fullPage: false });
    console.log(`   📸 Captured: ${t.out} (${fs.statSync(t.out).size} bytes)\n`);
  }

  await browser.close();
  console.log("🎉 All real browser screenshots successfully saved!");
}

captureLiveProduction().catch(console.error);
