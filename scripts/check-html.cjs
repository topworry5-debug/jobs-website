fetch('http://localhost:3000/')
  .then(r => r.text())
  .then(html => {
    const regex = /<script[^>]+src="([^"]+)"/g;
    let match;
    console.log('Scripts in HTML:');
    while ((match = regex.exec(html)) !== null) {
      console.log(match[1]);
    }
  });
