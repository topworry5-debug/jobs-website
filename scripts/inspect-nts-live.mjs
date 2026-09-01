async function inspectNTS() {
  try {
    const res = await fetch('https://www.nts.org.pk/new/projectsnew.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await res.text();
    console.log('NTS HTML Status:', res.status, 'Length:', html.length);

    const productRegex = /<li[^>]*class=["']product["'][^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    let index = 0;

    while ((match = productRegex.exec(html)) !== null) {
      index++;
      const block = match[1];
      const nameMatch = block.match(/<div[^>]*class=["']product-name["'][^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      const rawDateMatch = block.match(/Last Date[^:]*:\s*([^&<]+)/i) || 
                           block.match(/Submission is:?\s*<\/span>\s*&nbsp;([^&<]+)/i) ||
                           block.match(/Last Date[^\n<]+/i);

      console.log(`\n--- Project #${index} ---`);
      if (nameMatch) {
        console.log('  URL:', nameMatch[1]);
        console.log('  Title:', nameMatch[2].replace(/<[^>]+>/g, '').trim());
      } else {
        console.log('  Title: [NO LINK FOUND]');
      }
      console.log('  Date Matched:', rawDateMatch ? rawDateMatch[0] : 'NO DATE FOUND');
    }
  } catch (err) {
    console.error('Error fetching NTS:', err.message);
  }
}

inspectNTS();
