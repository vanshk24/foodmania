import { createBooking } from "../apps/api/src/services/bookingService.js";
import { getRestaurantByIdOrSlug } from "../apps/api/src/services/restaurantService.js";
import { prisma } from "../apps/api/src/utils/prisma.js";

async function testBookingFlow() {
  console.log("=== STARTING TARGETED TABLE BOOKING & CUSTOMER NAME TEST ===");

  const restaurant = await prisma.restaurant.findFirst({
    where: { slug: "the-urban-cafe" },
  });

  if (!restaurant) {
    console.error("Test restaurant 'the-urban-cafe' not found");
    process.exit(1);
  }

  const table = await prisma.restaurantTable.findFirst({
    where: { restaurantId: restaurant.id, tableNumber: "T-01" },
  });

  if (!table) {
    console.error("Table T-01 not found");
    process.exit(1);
  }

  const testGuestName = "Gaurav Sharma";
  const testGuestPhone = "+91 98765 43210";

  console.log(`1. Creating booking for ${restaurant.name}, Table ${table.tableNumber} for ${testGuestName}...`);

  const booking = await createBooking({
    restaurantId: restaurant.id,
    tableId: table.id,
    guestName: testGuestName,
    guestPhone: testGuestPhone,
    guestCount: 4,
    bookingDate: new Date().toISOString(),
    timeSlot: "08:30 PM",
  });

  console.log(`Booking created successfully (ID: ${booking.id}, Code: ${booking.bookingCode})`);

  // Verify table status in DB
  const updatedTableInDb = await prisma.restaurantTable.findUnique({
    where: { id: table.id },
  });

  console.log(`2. Updated Table DB Status: ${updatedTableInDb?.status}`);

  // Fetch restaurant details (as returned to Business/Admin tables UI)
  const fullDetails = await getRestaurantByIdOrSlug(restaurant.id);
  const matchedTableInResponse = (fullDetails?.tables || []).find((t: any) => t.id === table.id);

  console.log("3. API Table Response:", {
    tableNumber: matchedTableInResponse?.tableNumber,
    status: matchedTableInResponse?.status,
    customerName: matchedTableInResponse?.customerName,
    customerPhone: matchedTableInResponse?.customerPhone,
  });

  const isStatusReservedOrOccupied = updatedTableInDb?.status === "RESERVED" || updatedTableInDb?.status === "OCCUPIED";
  const isCustomerNameMatched = matchedTableInResponse?.customerName === testGuestName;

  console.log("\n=== VERIFICATION RESULTS ===");
  console.log(`TABLE BOOKING API: ${booking ? "PASS" : "FAIL"}`);
  console.log(`TABLE ID + RESTAURANT ID ASSOCIATION: ${booking.tableId === table.id && booking.restaurantId === restaurant.id ? "PASS" : "FAIL"}`);
  console.log(`TABLE STATUS UPDATE: ${isStatusReservedOrOccupied ? "PASS" : "FAIL"}`);
  console.log(`CUSTOMER NAME ON TABLE: ${isCustomerNameMatched ? "PASS" : "FAIL"}`);

  if (booking && isStatusReservedOrOccupied && isCustomerNameMatched) {
    console.log("\nSUCCESS: ALL TABLE BOOKING CHECKS PASSED!");
  } else {
    console.error("\nFAILURE: ONE OR MORE CHECKS FAILED");
    process.exit(1);
  }
}

testBookingFlow()
  .catch((e) => {
    console.error("Test execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
