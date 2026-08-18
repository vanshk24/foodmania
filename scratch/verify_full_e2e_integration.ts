import { prisma } from "../apps/api/src/utils/prisma.js";

const BASE_URL = "http://localhost:4000";

interface FlowCheck {
  step: string;
  substep: string;
  passed: boolean;
  details: string;
}

const checks: FlowCheck[] = [];

function recordCheck(step: string, substep: string, passed: boolean, details: string) {
  checks.push({ step, substep, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${step}] ${substep}: ${details}`);
}

async function api(endpoint: string, options?: any) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

async function runEndToEndVerification() {
  console.log("\n=======================================================================");
  console.log("🌟 STARTING FOOD MANIA FULL REAL END-TO-END INTEGRATION VERIFICATION");
  console.log("=======================================================================\n");

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. SUPER ADMIN → RESTAURANT
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 1: SUPER ADMIN → RESTAURANT CREATION & DISCOVERY ---");

  // Admin login
  const adminLogin = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "admin@foodmania.com",
      password: "admin123",
      twoFactorCode: "123456",
    }),
  });
  const adminToken = adminLogin.data?.data?.token;
  recordCheck(
    "1. Admin Login",
    "Super Admin Authenticated",
    adminLogin.status === 200 && !!adminToken,
    `Admin token obtained: ${adminToken ? "YES" : "NO"}`
  );

  const testSlug = `e2e-bistro-${Date.now()}`;
  const testCode = `BST${Math.floor(100 + Math.random() * 900)}`;
  const ownerEmail = `owner.${testSlug}@foodmania.com`;

  // Create restaurant via Admin API
  const createRestRes = await api("/admin/restaurants", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: "E2E Artisan Bistro",
      slug: testSlug,
      city: "Bengaluru",
      code: testCode,
      cuisine: "Continental & Bistro",
      ownerName: "Bistro Owner",
      ownerEmail: ownerEmail,
      ownerPassword: "bistroPassword123",
      phone: "+91 98000 12345",
    }),
  });
  const createdRest = createRestRes.data?.data;
  recordCheck(
    "1. Admin Restaurant",
    "Create Restaurant via Admin API",
    createRestRes.status === 201 && !!createdRest?.id,
    `Restaurant ID: ${createdRest?.id}, Name: ${createdRest?.name}`
  );

  // PostgreSQL direct verification
  const dbRestaurant = await prisma.restaurant.findUnique({
    where: { id: createdRest?.id || "" },
  });
  recordCheck(
    "1. DB Persistence",
    "Verify Restaurant in PostgreSQL",
    !!dbRestaurant && dbRestaurant.slug === testSlug,
    `DB ID: ${dbRestaurant?.id}, Status: ${dbRestaurant?.status}`
  );

  const dbOwnerUser = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });
  recordCheck(
    "1. Tenant Relation",
    "Verify Owner & Restaurant Relationship",
    !!dbOwnerUser && dbOwnerUser.restaurantId === dbRestaurant?.id && dbOwnerUser.role === "OWNER",
    `Owner ID: ${dbOwnerUser?.id}, Role: ${dbOwnerUser?.role}, RestId: ${dbOwnerUser?.restaurantId}`
  );

  // Customer Discovery verification
  const customerListRes = await api("/restaurants");
  const inCustomerList = customerListRes.data?.data?.some((r: any) => r.id === dbRestaurant?.id);
  recordCheck(
    "1. Customer Discovery",
    "Newly created restaurant appears in GET /restaurants",
    inCustomerList === true,
    `Found in public list of ${customerListRes.data?.data?.length} restaurants`
  );

  const customerDetailRes = await api(`/restaurants/${testSlug}`);
  recordCheck(
    "1. Customer Query",
    "Customer retrieves newly created restaurant by slug",
    customerDetailRes.status === 200 && customerDetailRes.data?.data?.name === "E2E Artisan Bistro",
    `Retrieved name: ${customerDetailRes.data?.data?.name}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RESTAURANT → MENU MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 2: RESTAURANT → MENU MANAGEMENT & CUSTOMER SYNC ---");

  // Owner Login
  const ownerLogin = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: ownerEmail,
      password: "bistroPassword123",
      restaurantCode: testCode,
    }),
  });
  const ownerToken = ownerLogin.data?.data?.token;
  recordCheck(
    "2. Owner Login",
    "Authenticate as Restaurant Owner",
    ownerLogin.status === 200 && !!ownerToken,
    `Owner token obtained: ${ownerToken ? "YES" : "NO"}`
  );

  // Create Menu Category
  const catRes = await api(`/restaurants/${dbRestaurant?.id}/categories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ name: "Handcrafted Pizzas" }),
  });
  const createdCat = catRes.data?.data;
  recordCheck(
    "2. Menu Category",
    "Create category 'Handcrafted Pizzas'",
    catRes.status === 201 && !!createdCat?.id,
    `Category ID: ${createdCat?.id}`
  );

  // Create Menu Item
  const itemRes = await api(`/restaurants/${dbRestaurant?.id}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({
      name: "Truffle Burrata Pizza",
      price: 550,
      description: "Organic sourdough base, truffle cream, fresh burrata.",
      categoryId: createdCat?.id,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    }),
  });
  const createdItem = itemRes.data?.data;
  recordCheck(
    "2. Menu Item",
    "Create item 'Truffle Burrata Pizza'",
    itemRes.status === 201 && !!createdItem?.id,
    `Item ID: ${createdItem?.id}, Price: ₹${createdItem?.price}`
  );

  // Verify GET /restaurants/:id/menu
  const menuRes = await api(`/restaurants/${dbRestaurant?.id}/menu`);
  const catWithItems = menuRes.data?.data?.find((c: any) => c.id === createdCat?.id);
  const hasItem = catWithItems?.items?.some((i: any) => i.id === createdItem?.id);
  recordCheck(
    "2. Dedicated Menu API",
    "GET /restaurants/:id/menu returns category with items",
    hasItem === true,
    `Category '${createdCat?.name}' contains ${catWithItems?.items?.length} items`
  );

  // Update Menu Item
  const updateItemRes = await api(`/restaurants/items/${createdItem?.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({
      name: "Truffle & Aged Burrata Pizza (Chef Special)",
      price: 590,
    }),
  });
  recordCheck(
    "2. Menu Item Update",
    "Update item price to ₹590 & name",
    updateItemRes.status === 200 && updateItemRes.data?.data?.price === 590,
    `Updated price: ₹${updateItemRes.data?.data?.price}`
  );

  // Customer verification of update
  const customerMenuAfterUpdate = await api(`/restaurants/${testSlug}`);
  const customerItem = customerMenuAfterUpdate.data?.data?.menuItems?.find((i: any) => i.id === createdItem?.id);
  recordCheck(
    "2. Customer Sees Update",
    "Customer portal retrieves updated price & name in live query",
    customerItem?.price === 590 && customerItem?.name.includes("Chef Special"),
    `Live Customer Name: ${customerItem?.name}, Price: ₹${customerItem?.price}`
  );

  // Delete test item
  const deleteRes = await api(`/restaurants/items/${createdItem?.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  recordCheck(
    "2. Menu Item Delete",
    "Delete temporary item from menu",
    deleteRes.status === 200 && deleteRes.data?.data?.success === true,
    `Delete status: ${deleteRes.status}`
  );

  // Customer verification of deletion
  const customerMenuAfterDelete = await api(`/restaurants/${testSlug}`);
  const itemStillPresent = customerMenuAfterDelete.data?.data?.menuItems?.some((i: any) => i.id === createdItem?.id);
  recordCheck(
    "2. Customer Sees Deletion",
    "Deleted item disappears from customer portal",
    itemStillPresent === false,
    `Item present in customer response: ${itemStillPresent ? "YES" : "NO"}`
  );

  // Create permanent orderable item for steps 3-6
  const finalItemRes = await api(`/restaurants/${dbRestaurant?.id}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({
      name: "Signature Woodfired Margherita",
      price: 480,
      description: "San Marzano tomatoes, buffalo mozzarella, fresh basil.",
      categoryId: createdCat?.id,
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    }),
  });
  const orderableItem = finalItemRes.data?.data;

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CUSTOMER → ORDER PLACEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 3: CUSTOMER → ORDER PLACEMENT & DB PERSISTENCE ---");

  // Customer Login
  const custLogin = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "gaurav@example.com",
      password: "password123",
    }),
  });
  const custToken = custLogin.data?.data?.token;
  const custUser = custLogin.data?.data?.user;

  // Place Order
  const orderPlaceRes = await api("/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${custToken}` },
    body: JSON.stringify({
      restaurantId: dbRestaurant?.id,
      userId: custUser?.id,
      customerName: custUser?.name || "Gaurav Sharma",
      customerPhone: "+91 98765 43210",
      deliveryAddress: "Table 02 (Indoor)",
      totalAmount: 960,
      paymentMethod: "UPI",
      items: [
        {
          menuItemId: orderableItem?.id,
          name: orderableItem?.name,
          price: 480,
          quantity: 2,
        },
      ],
    }),
  });
  const createdOrder = orderPlaceRes.data?.data;
  recordCheck(
    "3. Customer Order",
    "Place Order via Customer API",
    orderPlaceRes.status === 201 && !!createdOrder?.id,
    `Order Number: ${createdOrder?.orderNumber}, Total: ₹${createdOrder?.totalAmount}`
  );

  // PostgreSQL Verification
  const dbOrder = await prisma.order.findUnique({
    where: { id: createdOrder?.id || "" },
  });
  recordCheck(
    "3. Order DB Persistence",
    "Verify Order in PostgreSQL",
    !!dbOrder && dbOrder.restaurantId === dbRestaurant?.id && dbOrder.userId === custUser?.id,
    `DB Order ID: ${dbOrder?.id}, RestId: ${dbOrder?.restaurantId}, Status: ${dbOrder?.status}`
  );

  const dbOrderItems = await prisma.orderItem.findMany({
    where: { orderId: createdOrder?.id || "" },
  });
  recordCheck(
    "3. Order Items DB",
    "Verify Order Items & Quantities in PostgreSQL",
    dbOrderItems.length === 1 && dbOrderItems[0]?.quantity === 2 && dbOrderItems[0]?.price === 480,
    `Stored items count: ${dbOrderItems.length}, Qty: ${dbOrderItems[0]?.quantity}, Price: ₹${dbOrderItems[0]?.price}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. BUSINESS → ORDER ISOLATION & VERIFICATION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 4: BUSINESS → ORDER RETRIEVAL & TENANT ISOLATION ---");

  // Restaurant B Owner retrieves orders
  const businessOrdersRes = await api(`/orders?restaurantId=${dbRestaurant?.id}`, {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  const ownerOrders = businessOrdersRes.data?.data || [];
  const foundInBusiness = ownerOrders.some((o: any) => o.id === createdOrder?.id);
  recordCheck(
    "4. Business Order Sync",
    "Owner retrieves the newly created order",
    foundInBusiness === true,
    `Owner received ${ownerOrders.length} order(s) for ${testSlug}`
  );

  // Verify all orders in response strictly belong to this restaurant
  const allMatchRestaurant = ownerOrders.every((o: any) => o.restaurantId === dbRestaurant?.id);
  recordCheck(
    "4. Tenant Isolation",
    "No orders from other restaurants appear in Business view",
    allMatchRestaurant === true,
    `All ${ownerOrders.length} orders match restaurantId: ${dbRestaurant?.id}`
  );

  // Verify item details inside business order
  const targetBusinessOrder = ownerOrders.find((o: any) => o.id === createdOrder?.id);
  recordCheck(
    "4. Business Order Data",
    "Totals and line items match PostgreSQL exact values",
    targetBusinessOrder?.totalAmount === 960 && targetBusinessOrder?.items?.[0]?.quantity === 2,
    `Total: ₹${targetBusinessOrder?.totalAmount}, Line items count: ${targetBusinessOrder?.items?.length}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. KITCHEN KDS LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 5: KITCHEN KDS LIFECYCLE TRANSITIONS ---");

  const lifecycleStages = ["CONFIRMED", "PREPARING", "READY", "COMPLETED"];

  for (const nextStatus of lifecycleStages) {
    const patchStatusRes = await api(`/orders/${createdOrder?.id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({ status: nextStatus }),
    });

    const dbOrderAfter = await prisma.order.findUnique({
      where: { id: createdOrder?.id || "" },
    });

    const customerCheck = await api(`/orders/${createdOrder?.id}`);

    const stagePassed =
      patchStatusRes.status === 200 &&
      dbOrderAfter?.status === nextStatus &&
      customerCheck.data?.data?.status === nextStatus;

    recordCheck(
      "5. Kitchen Lifecycle",
      `Transition to ${nextStatus}`,
      stagePassed,
      `API: ${patchStatusRes.status}, DB: ${dbOrderAfter?.status}, Customer API: ${customerCheck.data?.data?.status}`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. CUSTOMER LIVE TRACKING VERIFICATION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 6: CUSTOMER LIVE TRACKING VERIFICATION ---");

  const trackById = await api(`/orders/${createdOrder?.id}`);
  const trackByNumber = await api(`/orders/${createdOrder?.orderNumber}`);

  recordCheck(
    "6. Customer Tracking ID",
    "Fetch order by UUID reflects real DB status and items",
    trackById.status === 200 &&
      trackById.data?.data?.orderNumber === createdOrder?.orderNumber &&
      trackById.data?.data?.status === "COMPLETED",
    `Order Number: ${trackById.data?.data?.orderNumber}, Live Status: ${trackById.data?.data?.status}`
  );

  recordCheck(
    "6. Customer Tracking Number",
    "Fetch order by Order Number (ORD-XXXXXX) reflects real DB status",
    trackByNumber.status === 200 &&
      trackByNumber.data?.data?.id === createdOrder?.id &&
      trackByNumber.data?.data?.status === "COMPLETED",
    `Retrieved ID: ${trackByNumber.data?.data?.id}, Status: ${trackByNumber.data?.data?.status}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. TABLE BOOKING (UUID + CODE & ACCEPT/REJECT)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 7: TABLE BOOKING LIFECYCLE (UUID & CODE) ---");

  // Create Table Booking
  const bookingCreateRes = await api("/bookings", {
    method: "POST",
    headers: { Authorization: `Bearer ${custToken}` },
    body: JSON.stringify({
      restaurantId: dbRestaurant?.id,
      userId: custUser?.id,
      guestName: "Gaurav Sharma",
      guestPhone: "+91 98765 43210",
      guestCount: 4,
      bookingDate: "2026-08-20",
      timeSlot: "07:30 PM",
      tableId: "t-01",
    }),
  });
  const createdBooking = bookingCreateRes.data?.data;
  recordCheck(
    "7. Create Booking",
    "Customer submits table reservation",
    bookingCreateRes.status === 201 && !!createdBooking?.bookingCode,
    `Booking Code: ${createdBooking?.bookingCode}, UUID: ${createdBooking?.id}`
  );

  // Test PATCH with UUID (Accept -> CONFIRMED)
  const patchBookingUuidRes = await api(`/bookings/${createdBooking?.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ status: "CONFIRMED" }),
  });
  const dbBookingAfterUuid = await prisma.booking.findUnique({
    where: { id: createdBooking?.id || "" },
  });
  recordCheck(
    "7. Booking UUID Patch",
    "Business accepts booking using UUID",
    patchBookingUuidRes.status === 200 && dbBookingAfterUuid?.status === "CONFIRMED",
    `DB Booking Status: ${dbBookingAfterUuid?.status}`
  );

  // Test PATCH with bookingCode (Complete -> COMPLETED)
  const patchBookingCodeRes = await api(`/bookings/${createdBooking?.bookingCode}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ status: "COMPLETED" }),
  });
  const dbBookingAfterCode = await prisma.booking.findUnique({
    where: { id: createdBooking?.id || "" },
  });
  recordCheck(
    "7. Booking Code Patch",
    "Business updates booking using bookingCode (BK-XXXXX)",
    patchBookingCodeRes.status === 200 && dbBookingAfterCode?.status === "COMPLETED",
    `DB Booking Status after Code Patch: ${dbBookingAfterCode?.status}`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. NOTIFICATIONS SCOPING & OWNERSHIP
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 8: NOTIFICATIONS SCOPING & OWNERSHIP ENFORCEMENT ---");

  // Check notifications generated for restaurant owner
  const ownerNotifsRes = await api("/notifications", {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  const ownerNotifs = ownerNotifsRes.data?.data || [];
  recordCheck(
    "8. Owner Notifications",
    "Restaurant owner receives order & booking notifications",
    ownerNotifsRes.status === 200 && ownerNotifs.length > 0,
    `Received ${ownerNotifs.length} notification(s)`
  );

  // Pick a restaurant-specific notification (not owned by customer)
  const restOnlyNotif = ownerNotifs.find((n: any) => !n.userId || n.userId !== custUser?.id) || ownerNotifs[0];

  // Mark read by owner
  const markReadRes = await api(`/notifications/${restOnlyNotif?.id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  recordCheck(
    "8. Mark Notification Read",
    "Owner marks notification as read",
    markReadRes.status === 200 && markReadRes.data?.data?.isRead === true,
    `isRead: ${markReadRes.data?.data?.isRead}`
  );

  // Customer attempts to mark restaurant owner's notification read (Should be 403 Forbidden)
  const forbiddenNotifRes = await api(`/notifications/${restOnlyNotif?.id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${custToken}` },
  });
  recordCheck(
    "8. Notification Ownership Security",
    "Customer is blocked from modifying another tenant's notification",
    forbiddenNotifRes.status === 403,
    `Returned Status: ${forbiddenNotifRes.status} (Expected 403 Forbidden)`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. MULTI-TENANT CROSS-RESTAURANT SECURITY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n--- STEP 9: MULTI-TENANT SECURITY & ISOLATION ENFORCEMENT ---");

  // Urban Cafe Owner (Restaurant A)
  const urbanOwnerLogin = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "rohit@urbancafe.com",
      password: "owner123",
      restaurantCode: "URBAN123",
    }),
  });
  const urbanOwnerToken = urbanOwnerLogin.data?.data?.token;
  recordCheck(
    "9. Restaurant A Auth",
    "Authenticate Restaurant A Owner (Rohit)",
    urbanOwnerLogin.status === 200 && !!urbanOwnerToken,
    `Restaurant A Owner Token Obtained: ${urbanOwnerToken ? "YES" : "NO"}`
  );

  // Attack 1: Urban Cafe Owner attempts to query E2E Bistro's orders
  const crossOrderQuery = await api(`/orders?restaurantId=${dbRestaurant?.id}`, {
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
  });
  recordCheck(
    "9. Cross-Tenant Orders",
    "Restaurant A owner blocked from querying Restaurant B orders",
    crossOrderQuery.status === 403,
    `Status: ${crossOrderQuery.status} (Expected 403 Forbidden)`
  );

  // Attack 2: Urban Cafe Owner attempts to modify E2E Bistro's order status
  const crossOrderPatch = await api(`/orders/${createdOrder?.id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
    body: JSON.stringify({ status: "CANCELLED" }),
  });
  recordCheck(
    "9. Cross-Tenant Order Status",
    "Restaurant A owner blocked from modifying Restaurant B order",
    crossOrderPatch.status === 403,
    `Status: ${crossOrderPatch.status} (Expected 403 Forbidden)`
  );

  // Attack 3: Urban Cafe Owner attempts to modify E2E Bistro's menu item
  const crossMenuPatch = await api(`/restaurants/items/${orderableItem?.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
    body: JSON.stringify({ price: 10 }),
  });
  recordCheck(
    "9. Cross-Tenant Menu Mutation",
    "Restaurant A owner blocked from modifying Restaurant B menu item",
    crossMenuPatch.status === 403,
    `Status: ${crossMenuPatch.status} (Expected 403 Forbidden)`
  );

  // Attack 4: Urban Cafe Owner attempts to delete E2E Bistro's menu item
  const crossMenuDelete = await api(`/restaurants/items/${orderableItem?.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
  });
  recordCheck(
    "9. Cross-Tenant Menu Deletion",
    "Restaurant A owner blocked from deleting Restaurant B menu item",
    crossMenuDelete.status === 403,
    `Status: ${crossMenuDelete.status} (Expected 403 Forbidden)`
  );

  // Attack 5: Urban Cafe Owner attempts to modify E2E Bistro's bookings
  const crossBookingPatch = await api(`/bookings/${createdBooking?.id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
    body: JSON.stringify({ status: "CANCELLED" }),
  });
  recordCheck(
    "9. Cross-Tenant Booking Mutation",
    "Restaurant A owner blocked from modifying Restaurant B booking",
    crossBookingPatch.status === 403,
    `Status: ${crossBookingPatch.status} (Expected 403 Forbidden)`
  );

  // Attack 6: Urban Cafe Owner attempts to read/modify Restaurant B's notifications
  const crossNotifPatch = await api(`/notifications/${restOnlyNotif?.id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${urbanOwnerToken}` },
  });
  recordCheck(
    "9. Cross-Tenant Notification",
    "Restaurant A owner blocked from modifying Restaurant B notification",
    crossNotifPatch.status === 403,
    `Status: ${crossNotifPatch.status} (Expected 403 Forbidden)`
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n=======================================================================");
  const total = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  console.log(`🏆 END-TO-END VERIFICATION SUMMARY: ${passed}/${total} PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log("=======================================================================\n");
}

runEndToEndVerification()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Verification error:", e);
    await prisma.$disconnect();
  });
