const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  for (const width of [375, 768, 1024, 1100, 1280, 1350, 1440, 1920]) {
    await page.setViewport({ width, height: 950 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Inject the CSS fixes
    await page.addStyleTag({
      content: `
        body, .homepage-wrapper, main {
          overflow-x: hidden;
        }
        .main-content-layout {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          gap: 1.75rem;
          width: 100%;
          min-width: 0;
        }
        @media (max-width: 992px) {
          .main-content-layout {
            grid-template-columns: 1fr;
          }
        }
        .jobs-feed-col {
          min-width: 0;
          width: 100%;
          flex: 1;
        }
        .jobs-cards-grid,
        .jobs-layout-container.grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          width: 100%;
          min-width: 0;
        }
        @media (min-width: 1400px) {
          .jobs-cards-grid,
          .jobs-layout-container.grid-view {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .jobs-cards-grid,
          .jobs-layout-container.grid-view {
            grid-template-columns: 1fr !important;
          }
        }
        .job-card-entrance-wrapper {
          min-width: 0;
          width: 100%;
        }
        .job-card-item {
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .card-top-row,
        .card-badge-cluster,
        .card-body-content,
        .card-org-name,
        .card-meta-row,
        .card-footer-row {
          min-width: 0;
        }
      `
    });
    
    const info = await page.evaluate((w) => {
      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const hasHScroll = scrollWidth > docWidth;
      
      const feedCol = document.querySelector('.jobs-feed-col');
      const grid = document.querySelector('.main-content-layout .jobs-cards-grid');
      const cards = grid ? [...grid.querySelectorAll('.job-card-item')] : [];
      const thirdCard = cards[2];
      const thirdRect = thirdCard ? thirdCard.getBoundingClientRect() : null;
      
      return {
        viewportWidth: w,
        docWidth,
        scrollWidth,
        hasHScroll,
        gridColumns: grid ? window.getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,
        feedColWidth: feedCol ? Math.round(feedCol.getBoundingClientRect().width) : null,
        gridWidth: grid ? Math.round(grid.getBoundingClientRect().width) : null,
        thirdCardRight: thirdRect ? Math.round(thirdRect.right) : null,
        isThirdCardVisible: thirdRect ? thirdRect.right <= docWidth : null
      };
    }, width);
    
    console.log('=== Width ' + width + 'px ===');
    console.log('Doc width:', info.docWidth, '| Scroll width:', info.scrollWidth, '| Has H-Scroll:', info.hasHScroll);
    console.log('Grid columns:', info.gridColumns, '| Feed col width:', info.feedColWidth, '| Grid width:', info.gridWidth);
    console.log('Third card right edge:', info.thirdCardRight, '| Within viewport?:', info.isThirdCardVisible);
    console.log('');
  }
  
  await browser.close();
})();
