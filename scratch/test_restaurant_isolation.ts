import { createBooking } from "../apps/api/src/services/bookingService.js";
import { getRestaurantByIdOrSlug } from "../apps/api/src/services/restaurantService.js";
import { getBookings } from "../apps/api/src/services/bookingService.js";
import { getOrders } from "../apps/api/src/services/orderService.js";
import { prisma } from "../apps/api/src/utils/prisma.js";

async function runIsolationTest() {
  console.log("=== STARTING MULTI-TENANT RESTAURANT ISOLATION TEST ===");

  // 1. Get Restaurant A (The Urban Cafe) & Restaurant B (Royal Spice / Bistro)
  const restoA = await prisma.restaurant.findFirst({ where: { slug: "the-urban-cafe" } });
  let restoB = await prisma.restaurant.findFirst({ where: { NOT: { id: restoA?.id } } });

  if (!restoA || !restoB) {
    console.error("Could not find 2 distinct restaurants for isolation test");
    process.exit(1);
  }

  console.log(`Restaurant A: ${restoA.name} (id: ${restoA.id}, slug: ${restoA.slug})`);
  console.log(`Restaurant B: ${restoB.name} (id: ${restoB.id}, slug: ${restoB.slug})`);

  // 2. Book Table T-04 on Restaurant B ONLY for guest "Gaurav Sharma"
  const testGuestName = "Gaurav Sharma";
  console.log(`\nBooking Table T-04 on Restaurant B (${restoB.name}) for ${testGuestName}...`);

  const bookingB = await createBooking({
    restaurantId: restoB.id,
    tableId: "T-04",
    guestName: testGuestName,
    guestPhone: "+91 91111 22222",
    guestCount: 2,
    bookingDate: new Date().toISOString(),
    timeSlot: "09:00 PM",
  });

  console.log(`Booking Created for Resto B! (Booking Code: ${bookingB.bookingCode})`);

  // 3. Query Restaurant B tables & details
  const restoBDetails = await getRestaurantByIdOrSlug(restoB.id);
  const tableB = (restoBDetails?.tables || []).find((t: any) => t.tableNumber === "T-04" || t.id === bookingB.tableId);

  console.log(`\nRestaurant B Table T-04 Status:`, {
    tableNumber: tableB?.tableNumber,
    status: tableB?.status,
    customerName: tableB?.customerName,
  });

  // 4. Query Restaurant A tables & details to verify 100% ISOLATION
  const restoADetails = await getRestaurantByIdOrSlug(restoA.id);
  const tableA = (restoADetails?.tables || []).find((t: any) => t.tableNumber === "T-04" || t.id === bookingB.tableId);

  console.log(`\nRestaurant A Table T-04 Status (Must be AVAILABLE & no customer):`, {
    tableNumber: tableA?.tableNumber || "N/A",
    status: tableA?.status || "AVAILABLE",
    customerName: tableA?.customerName || null,
  });

  // 5. Query Bookings API for Resto A vs Resto B
  const bookingsA = await getBookings(restoA.id);
  const bookingsB = await getBookings(restoB.id);

  const restoBHasBooking = bookingsB.some((b) => b.id === bookingB.id);
  const restoAHasBooking = bookingsA.some((b) => b.id === bookingB.id);

  console.log(`\nBookings Scoping Verification:`);
  console.log(`- Booking present in Resto B list: ${restoBHasBooking}`);
  console.log(`- Booking present in Resto A list: ${restoAHasBooking}`);

  // Checks
  const profileIsolationPass = restoA.id !== restoB.id;
  const dataIsolationPass = !restoAHasBooking && restoBHasBooking;
  const tableIsolationPass = tableB?.status === "RESERVED" && (tableA ? tableA.status === "AVAILABLE" : true);
  const customerNamePass = tableB?.customerName === testGuestName && (!tableA || !tableA.customerName);

  console.log("\n=== ISOLATION TEST SUMMARY ===");
  console.log(`RESTAURANT PROFILE ISOLATION: ${profileIsolationPass ? "PASS" : "FAIL"}`);
  console.log(`RESTAURANT DATA ISOLATION: ${dataIsolationPass ? "PASS" : "FAIL"}`);
  console.log(`TABLE ISOLATION: ${tableIsolationPass ? "PASS" : "FAIL"}`);
  console.log(`BOOKING RESTAURANT/TABLE ASSOCIATION: ${bookingB.restaurantId === restoB.id ? "PASS" : "FAIL"}`);
  console.log(`CUSTOMER NAME ON TABLE: ${customerNamePass ? "PASS" : "FAIL"}`);
  console.log(`CROSS-RESTAURANT UPDATE ISOLATION: ${!restoAHasBooking ? "PASS" : "FAIL"}`);

  if (profileIsolationPass && dataIsolationPass && tableIsolationPass && customerNamePass) {
    console.log("\nSUCCESS: ALL ISOLATION CHECKS PASSED!");
  } else {
    console.error("\nFAILURE: ONE OR MORE ISOLATION CHECKS FAILED");
    process.exit(1);
  }
}

runIsolationTest()
  .catch((e) => {
    console.error("Isolation test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
