const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  console.log('=== STEP 2: READ-ONLY DATABASE RECORD COUNT ===');
  const userCount = await prisma.user.count();
  const restaurantCount = await prisma.restaurant.count();
  const menuItemCount = await prisma.menuItem.count();
  const orderCount = await prisma.order.count();

  console.log('Users in DB:', userCount);
  console.log('Restaurants in DB:', restaurantCount);
  console.log('MenuItems in DB:', menuItemCount);
  console.log('Orders in DB:', orderCount);

  if (userCount > 0) {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, restaurantId: true } });
    console.log('Sample Users:', users);
  }

  if (restaurantCount > 0) {
    const restaurants = await prisma.restaurant.findMany({ select: { id: true, name: true, slug: true } });
    console.log('Sample Restaurants:', restaurants);
  }

  console.log('\n=== STEP 3: API AUTH & ROUTE TESTS ===');
  // 1. Try login as Admin
  const adminLoginRes = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@foodmania.com', password: 'admin123', role: 'SUPER_ADMIN' })
  }).then(r => r.json()).catch(e => ({ error: e.message }));

  console.log('Admin Login Response:', JSON.stringify(adminLoginRes, null, 2));

  if (adminLoginRes.data && adminLoginRes.data.token) {
    const token = adminLoginRes.data.token;
    
    // Test Admin Restaurants
    const adminRestRes = await fetch('http://localhost:4000/api/v1/admin/restaurants', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json());
    console.log('GET /admin/restaurants Response:', JSON.stringify(adminRestRes, null, 2));

    // Test Admin Users
    const adminUserRes = await fetch('http://localhost:4000/api/v1/admin/users', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json());
    console.log('GET /admin/users Response:', JSON.stringify(adminUserRes, null, 2));
  }

  // 2. Try login as Business Owner
  const ownerLoginRes = await fetch('http://localhost:4000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rohit@urbancafe.com', password: 'owner123', role: 'OWNER' })
  }).then(r => r.json()).catch(e => ({ error: e.message }));

  console.log('\nOwner Login Response:', JSON.stringify(ownerLoginRes, null, 2));
  if (ownerLoginRes.data && ownerLoginRes.data.token) {
    const token = ownerLoginRes.data.token;
    const rId = ownerLoginRes.data.user?.restaurantId || 'cbd67fb6-15aa-46a5-b13f-ec0108b336f3';
    console.log('Owner restaurantId:', rId);

    // Test Business Orders
    const ordersRes = await fetch('http://localhost:4000/api/v1/orders?restaurantId=' + rId, {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json());
    console.log('GET /orders?restaurantId=' + rId + ' Response:', JSON.stringify(ordersRes, null, 2));

    // Test Business Menu
    const menuRes = await fetch('http://localhost:4000/api/v1/restaurants/' + rId + '/menu', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => r.json());
    console.log('GET /restaurants/' + rId + '/menu Response:', JSON.stringify(menuRes, null, 2));
  }

  await prisma.$disconnect();
}

diagnose().catch(err => { console.error('Diag error:', err); prisma.$disconnect(); });
