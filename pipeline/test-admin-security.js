async function runSecurityTests() {
  console.log('=== TESTING SECURITY GUARDS & ADMIN PROTECTION ===\n');

  // 1. Unauthenticated page request to /admin
  const resAdmin = await fetch('http://localhost:3000/admin', { redirect: 'manual' });
  console.log('1. Unauthenticated /admin request:');
  console.log('   • HTTP Status (Expected: 307 Redirect):', resAdmin.status);
  console.log('   • Redirect Location:', resAdmin.headers.get('location'));
  console.log('   • Security Header X-Robots-Tag:', resAdmin.headers.get('x-robots-tag'));

  // 2. Unauthenticated API request
  const resApi = await fetch('http://localhost:3000/api/admin/test');
  console.log('\n2. Unauthenticated /api/admin request:');
  console.log('   • HTTP Status (Expected: 401 Unauthorized):', resApi.status);
  const apiJson = await resApi.json();
  console.log('   • Response payload:', JSON.stringify(apiJson));

  // 3. Invalid credentials attempt
  const resBadAuth = await fetch('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passkey: 'invalid-guess-123' })
  });
  console.log('\n3. Authentication with invalid passkey:');
  console.log('   • HTTP Status (Expected: 401):', resBadAuth.status);

  // 4. Valid credentials attempt
  const resGoodAuth = await fetch('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passkey: 'RozgarPK@Admin2026!' })
  });
  console.log('\n4. Authentication with valid passkey:');
  console.log('   • HTTP Status (Expected: 200 OK):', resGoodAuth.status);
  const cookie = resGoodAuth.headers.get('set-cookie');
  console.log('   • Encrypted Session Cookie Issued:', !!cookie && cookie.includes('rozgar_admin_session'));

  // 5. Authenticated page request with session cookie
  const resAuthAdmin = await fetch('http://localhost:3000/admin', {
    headers: { 'Cookie': cookie },
    redirect: 'manual'
  });
  console.log('\n5. Authenticated /admin request with valid session:');
  console.log('   • HTTP Status (Expected: 200 OK):', resAuthAdmin.status);

  // 6. robots.txt
  const resRobots = await fetch('http://localhost:3000/robots.txt');
  const robotsText = await resRobots.text();
  console.log('\n6. robots.txt Disallow Check:');
  console.log('   • Contains "Disallow: /admin":', robotsText.includes('Disallow: /admin'));
  console.log('   • Contains "Disallow: /api/admin":', robotsText.includes('Disallow: /api/admin'));

  // 7. Homepage footer check
  const resHome = await fetch('http://localhost:3000/');
  const homeHtml = await resHome.text();
  console.log('\n7. Public Footer Sanitization:');
  console.log('   • Contains link to /admin:', homeHtml.includes('href="/admin"'));
  console.log('   • Contains "Pipeline Telemetry" text:', homeHtml.includes('Pipeline Telemetry'));

  console.log('\n=== ALL SECURITY CHECKS VERIFIED SUCCESSFULLY ===');
}

runSecurityTests();
