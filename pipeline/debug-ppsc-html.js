/**
 * Debug HTML inspector for PPSC (links 26-74)
 */
async function inspectPPSCLinks() {
  const res = await fetch("https://www.ppsc.gop.pk/Jobs.aspx", {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  const links = html.match(/<a[^>]+href=[^>]+>[^<]+<\/a>/gi) || [];
  
  console.log("Links 26 to 74:");
  links.slice(25).forEach((l, i) => console.log(`[${i+26}] ${l}`));
}

inspectPPSCLinks().catch(console.error);
