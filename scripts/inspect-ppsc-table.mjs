async function fetchPPSC() {
  const res = await fetch('https://www.ppsc.gop.pk/Jobs.aspx', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  console.log('Total table rows on PPSC:', trMatches.length);
  trMatches.slice(0, 10).forEach((tr, idx) => {
    const text = tr[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`Row #${idx + 1}: ${text}`);
  });
}

fetchPPSC().catch(console.error);
