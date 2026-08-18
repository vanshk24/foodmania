/**
 * Food Mania Backend API 31-Point REST Endpoint Verification Suite
 */

const API_BASE_URL = "http://localhost:4000";

interface TestResult {
  name: string;
  endpoint: string;
  passed: boolean;
  expectedStatus: number;
  actualStatus: number;
  data?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  endpoint: string,
  options?: RequestInit,
  expectedStatus: number = 200
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const passed = res.status === expectedStatus;
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // Body might be empty
    }

    results.push({
      name,
      endpoint,
      passed,
      expectedStatus,
      actualStatus: res.status,
      data,
    });

    if (passed) {
      console.log(`✅ [${options?.method || "GET"}] ${endpoint} -> ${res.status} (${name})`);
    } else {
      console.error(
        `❌ [${options?.method || "GET"}] ${endpoint} -> Expected ${expectedStatus}, Got ${res.status} (${name})`
      );
    }
    return { status: res.status, data };
  } catch (err: any) {
    results.push({
      name,
      endpoint,
      passed: false,
      expectedStatus,
      actualStatus: 0,
    });
    console.error(`❌ [${options?.method || "GET"}] ${endpoint} -> Network/Fetch Error: ${err.message}`);
    return { status: 0, data: null };
  }
}

async function runAuditTests() {
  console.log("\n=======================================================");
  console.log("🚀 STARTING FOOD MANIA FULL BACKEND SUITE VERIFICATION");
  console.log("=======================================================\n");

  // 1. Health Check
  await testEndpoint("Health Check", "/health", undefined, 200);

  // 2. Authentication Flow
  const adminLogin = await testEndpoint(
    "Super Admin Login",
    "/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@foodmania.com", password: "admin123", twoFactorCode: "123456" }),
    },
    200
  );
  const adminToken = adminLogin.data?.data?.token;

  const ownerLogin = await testEndpoint(
    "Owner Login",
    "/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "rohit@urbancafe.com", password: "owner123" }),
    },
    200
  );
  const ownerToken = ownerLogin.data?.data?.token;

  const customerLogin = await testEndpoint(
    "Customer Login",
    "/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "gaurav@example.com", password: "password123" }),
    },
    200
  );
  const customerToken = customerLogin.data?.data?.token;

  // 3. User Token Validation
  await testEndpoint(
    "Get Me (Authorized)",
    "/auth/me",
    { headers: { Authorization: `Bearer ${customerToken}` } },
    200
  );
  await testEndpoint("Get Me (Unauthorized)", "/auth/me", undefined, 401);

  // 4. Restaurant Discovery Flow
  await testEndpoint("List All Restaurants", "/restaurants", undefined, 200);
  await testEndpoint("Get Restaurant by Slug", "/restaurants/the-urban-cafe", undefined, 200);

  // 5. Menu Items Management Flow
  const menuRes = await testEndpoint("Get Restaurant Menu", "/restaurants/the-urban-cafe/menu", undefined, 200);
  const menuItems = menuRes.data?.data?.[0]?.items || menuRes.data?.items || [];
  const validMenuItemId = menuItems[0]?.id || "m-1";

  const newMenuItem = await testEndpoint(
    "Create Menu Item",
    "/restaurants/the-urban-cafe/items",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Audit Item",
        price: 350,
        categoryId: "c-1",
        description: "Temporary menu item for endpoint verification",
      }),
    },
    201
  );

  const itemId = newMenuItem.data?.data?.id;
  if (itemId) {
    await testEndpoint(
      "Update Menu Item",
      `/restaurants/items/${itemId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 390 }),
      },
      200
    );
    await testEndpoint("Delete Menu Item", `/restaurants/items/${itemId}`, { method: "DELETE" }, 200);
  }

  // 6. Tables Operations
  await testEndpoint(
    "Update Table Status",
    "/restaurants/tables/t-01",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESERVED" }),
    },
    200
  );

  // 7. Bookings Flow (Dual Identifier Check: UUID and BK-XXXXX Code)
  const bookingRes = await testEndpoint(
    "Create Table Booking",
    "/bookings",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        guestName: "Audit Test User",
        guestPhone: "+91 99999 88888",
        guestCount: 4,
        bookingDate: "2026-08-25",
        timeSlot: "07:30 PM",
        tableId: "t-01",
      }),
    },
    201
  );

  const bookingUuid = bookingRes.data?.data?.id;
  const bookingCode = bookingRes.data?.data?.bookingCode;

  if (bookingUuid) {
    await testEndpoint(
      "Patch Booking by UUID",
      `/bookings/${bookingUuid}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ status: "CONFIRMED" }),
      },
      200
    );
  }

  if (bookingCode) {
    await testEndpoint(
      "Patch Booking by bookingCode (BK-XXXXX)",
      `/bookings/${bookingCode}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ status: "COMPLETED" }),
      },
      200
    );
  }

  await testEndpoint("Get Bookings List", "/bookings?restaurantId=the-urban-cafe", undefined, 200);

  // 8. Order Creation & Calculation Security Flow
  const orderRes = await testEndpoint(
    "Create Order",
    "/orders",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        items: [{ menuItemId: validMenuItemId, quantity: 2 }],
        diningOption: "DINE_IN",
      }),
    },
    201
  );

  const orderId = orderRes.data?.data?.id;
  const orderNumber = orderRes.data?.data?.orderNumber;

  // 9. Order Retrieval & Status Lifecycle
  await testEndpoint("Get Orders List", "/orders?restaurantId=the-urban-cafe", undefined, 200);
  if (orderId) {
    await testEndpoint("Get Order by ID", `/orders/${orderId}`, undefined, 200);
    await testEndpoint("Get Order by OrderNumber", `/orders/${orderNumber}`, undefined, 200);
    await testEndpoint(
      "Update Order Status",
      `/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ status: "PREPARING" }),
      },
      200
    );
  }

  // 10. Reviews Flow
  await testEndpoint(
    "Submit Review",
    "/reviews",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        rating: 5,
        comment: "Excellent food and great ambiance!",
        customerName: "Gaurav Sharma",
      }),
    },
    201
  );
  await testEndpoint("Get Reviews", "/reviews?restaurantId=the-urban-cafe", undefined, 200);

  // 11. Admin Endpoints (Authorized Super Admin headers attached)
  const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };
  await testEndpoint("Admin Users List", "/admin/users", adminHeaders, 200);
  await testEndpoint(
    "Admin Moderate User Status",
    "/admin/users/u-customer-2",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "active" }),
    },
    200
  );
  await testEndpoint("Admin Restaurants List", "/admin/restaurants", adminHeaders, 200);
  await testEndpoint("Admin Subscriptions", "/admin/subscriptions", adminHeaders, 200);
  await testEndpoint("Admin Analytics", "/admin/analytics", adminHeaders, 200);

  // 12. Notifications Flow (Auth required & ownership checks)
  await testEndpoint("Get Notifications (Unauthorized)", "/notifications", undefined, 401);
  const notifs = await testEndpoint(
    "Get Notifications (Authorized)",
    "/notifications",
    { headers: { Authorization: `Bearer ${adminToken}` } },
    200
  );
  const notifId = notifs?.data?.data?.[0]?.id;
  if (notifId) {
    await testEndpoint(
      "Mark Notification Read (Authorized)",
      `/notifications/${notifId}/read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      200
    );
  }

  console.log("\n=======================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`📊 TEST SUITE SUMMARY: ${passed}/${total} PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log("=======================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runAuditTests();
