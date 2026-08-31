async function inspect() {
  const res = await fetch('http://localhost:3000/jobs/govt-fpsc-01');
  const html = await res.text();

  console.log("=== 1. RAW HTML TITLE & META IN HEAD ===");
  const titleMatch = html.match(/<title>.*?<\/title>/);
  console.log(titleMatch ? titleMatch[0] : "No title");

  console.log("\n=== 2. RAW HTML JOB POSTING JSON-LD SCHEMA ===");
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">.*?<\/script>/gs);
  if (jsonLdMatches) {
    jsonLdMatches.forEach((m, idx) => console.log(`Schema [${idx + 1}]:\n${m}\n`));
  }

  console.log("=== 3. RAW HTML H1 & VISIBLE JOB CONTENT ===");
  const h1Match = html.match(/<h1.*?<\/h1>/);
  console.log(h1Match ? h1Match[0] : "No h1");

  const specMatch = html.match(/<section class="spec-matrix-section.*?<\/section>/s);
  console.log(specMatch ? specMatch[0].substring(0, 500) + "..." : "No spec");
}

inspect().catch(console.error);
