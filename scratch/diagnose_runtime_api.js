async function testRealLogins() {
  console.log('=== TEST 1: SUPER_ADMIN LOGIN (admin@foodmania.com) ===');
  const adminLogin = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@foodmania.com', password: 'admin123', role: 'SUPER_ADMIN' })
  }).then(r => r.json()).catch(e => ({ error: e.message }));

  console.log('Admin Login Result:', JSON.stringify(adminLogin, null, 2));

  if (adminLogin.data?.token) {
    const token = adminLogin.data.token;
    console.log('\n--- GET /admin/restaurants ---');
    const r1 = await fetch('http://localhost:4000/api/v1/admin/restaurants', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Status:', r1.status);
    const j1 = await r1.json();
    console.log('Count:', Array.isArray(j1.data) ? j1.data.length : j1);

    console.log('\n--- GET /admin/users ---');
    const r2 = await fetch('http://localhost:4000/api/v1/admin/users', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Status:', r2.status);
    const j2 = await r2.json();
    console.log('Count:', Array.isArray(j2.data) ? j2.data.length : j2);
  }

  console.log('\n=== TEST 2: BUSINESS OWNER LOGIN (shinchan@gmail.com) ===');
  const ownerLogin = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'shinchan@gmail.com', password: 'owner123' })
  }).then(r => r.json()).catch(e => ({ error: e.message }));

  console.log('Owner Login Result:', JSON.stringify(ownerLogin, null, 2));
  if (ownerLogin.data?.token) {
    const token = ownerLogin.data.token;
    const rId = ownerLogin.data.user?.restaurantId;

    console.log('\n--- GET /orders?restaurantId=' + rId + ' ---');
    const r3 = await fetch('http://localhost:4000/api/v1/orders?restaurantId=' + rId, {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Status:', r3.status);
    const j3 = await r3.json();
    console.log('Orders Count:', Array.isArray(j3.data) ? j3.data.length : j3);

    console.log('\n--- GET /restaurants/' + rId + '/menu ---');
    const r4 = await fetch('http://localhost:4000/api/v1/restaurants/' + rId + '/menu', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Status:', r4.status);
    const j4 = await r4.json();
    console.log('Menu Categories:', Array.isArray(j4.data) ? j4.data.length : j4);
  }
}

testRealLogins();
