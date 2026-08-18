import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Food Mania PostgreSQL database (foodmania_dev)...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.restaurantTable.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.restaurantOwner.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  const customerPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);
  const ownerPassword = await bcrypt.hash("owner123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  // 1. Seed Super Admin
  const adminUser = await prisma.user.create({
    data: {
      id: "u-admin-1",
      email: "admin@foodmania.com",
      name: "Super Admin",
      phone: "+91 99999 99999",
      password: adminPassword,
      role: "SUPER_ADMIN",
      is2FAEnabled: true,
    },
  });

  // 2. Seed Customer Users
  const user1 = await prisma.user.create({
    data: {
      id: "u-customer-1",
      email: "gaurav@example.com",
      name: "Gaurav Sharma",
      phone: "+91 98765 43210",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "u-customer-2",
      email: "priya@example.com",
      name: "Priya Patel",
      phone: "+91 98123 45678",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  // 3. Seed Restaurants
  const urbanCafe = await prisma.restaurant.create({
    data: {
      id: "the-urban-cafe",
      name: "The Urban Cafe",
      slug: "the-urban-cafe",
      city: "Mumbai",
      address: "Bandra West, Hill Road, Mumbai",
      phone: "+91 98765 11111",
      code: "URBAN123",
      cuisine: "Café & Italian",
      rating: 4.8,
      reviewCount: 24,
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
      bannerUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200",
      deliveryFee: 40,
      minOrder: 200,
      status: "ACTIVE",
    },
  });

  const burgerHub = await prisma.restaurant.create({
    data: {
      id: "burger-hub",
      name: "Burger Hub",
      slug: "burger-hub",
      city: "Mumbai",
      address: "Andheri West, Link Road, Mumbai",
      phone: "+91 98765 22222",
      code: "BURGER123",
      cuisine: "American & Burgers",
      rating: 4.6,
      reviewCount: 18,
      imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
      bannerUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200",
      deliveryFee: 35,
      minOrder: 150,
      status: "ACTIVE",
    },
  });

  const spiceSymphony = await prisma.restaurant.create({
    data: {
      id: "spice-symphony",
      name: "Spice Symphony",
      slug: "spice-symphony",
      city: "Pune",
      address: "Koregaon Park, Lane 7, Pune",
      phone: "+91 98765 33333",
      code: "SPICE123",
      cuisine: "North Indian & Mughlai",
      rating: 4.7,
      reviewCount: 32,
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
      deliveryFee: 50,
      minOrder: 300,
      status: "ACTIVE",
    },
  });

  // 4. Seed Owners & Staff Users
  const ownerUser = await prisma.user.create({
    data: {
      id: "u-owner-1",
      email: "rohit@urbancafe.com",
      name: "Rohit Sharma",
      phone: "+91 98765 11111",
      password: ownerPassword,
      role: "OWNER",
      restaurantCode: "URBAN123",
      restaurantId: urbanCafe.id,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      id: "u-staff-1",
      email: "staff@urbancafe.com",
      name: "Urban Cafe Staff",
      phone: "+91 98765 11122",
      password: staffPassword,
      role: "STAFF",
      restaurantCode: "URBAN123",
      restaurantId: urbanCafe.id,
    },
  });

  await prisma.restaurantOwner.create({
    data: {
      name: "Rohit Sharma",
      email: "rohit@urbancafe.com",
      phone: "+91 98765 11111",
      restaurantId: urbanCafe.id,
    },
  });

  await prisma.subscription.create({
    data: {
      plan: "PRO",
      status: "ACTIVE",
      monthlyAmount: 4999,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      restaurantId: urbanCafe.id,
    },
  });

  // 5. Seed Tables
  const table1 = await prisma.restaurantTable.create({
    data: {
      id: "t-01",
      tableNumber: "T-01",
      capacity: 2,
      status: "AVAILABLE",
      restaurantId: urbanCafe.id,
    },
  });

  const table2 = await prisma.restaurantTable.create({
    data: {
      id: "t-02",
      tableNumber: "T-02",
      capacity: 4,
      status: "OCCUPIED",
      restaurantId: urbanCafe.id,
    },
  });

  const table3 = await prisma.restaurantTable.create({
    data: {
      id: "t-03",
      tableNumber: "T-03",
      capacity: 6,
      status: "RESERVED",
      restaurantId: urbanCafe.id,
    },
  });

  // 6. Seed Categories
  const catStarters = await prisma.menuCategory.create({
    data: {
      id: "cat-starters",
      name: "Starters & Appetizers",
      restaurantId: urbanCafe.id,
      sortOrder: 1,
    },
  });

  const catMains = await prisma.menuCategory.create({
    data: {
      id: "cat-mains",
      name: "Main Course",
      restaurantId: urbanCafe.id,
      sortOrder: 2,
    },
  });

  const catBeverages = await prisma.menuCategory.create({
    data: {
      id: "cat-beverages",
      name: "Beverages & Shakes",
      restaurantId: urbanCafe.id,
      sortOrder: 3,
    },
  });

  // 7. Seed Items
  const item1 = await prisma.menuItem.create({
    data: {
      id: "item-101",
      name: "Classic Artisan Cappuccino",
      price: 240,
      description: "Rich double-shot espresso topped with velvet steamed milk and cocoa dust.",
      imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500",
      isAvailable: true,
      categoryId: catBeverages.id,
      restaurantId: urbanCafe.id,
    },
  });

  const item2 = await prisma.menuItem.create({
    data: {
      id: "item-102",
      name: "Truffle Mushroom Risotto",
      price: 520,
      description: "Arborio rice cooked in wild mushroom broth, finished with white truffle oil and aged parmesan.",
      imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500",
      isAvailable: true,
      categoryId: catMains.id,
      restaurantId: urbanCafe.id,
    },
  });

  const item3 = await prisma.menuItem.create({
    data: {
      id: "item-103",
      name: "Crispy Avocado Bruschetta",
      price: 360,
      description: "Toasted sourdough topped with smashed avocado, cherry tomatoes, and balsamic reduction.",
      imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500",
      isAvailable: true,
      categoryId: catStarters.id,
      restaurantId: urbanCafe.id,
    },
  });

  const item4 = await prisma.menuItem.create({
    data: {
      id: "item-104",
      name: "Smoked Salmon Bagel",
      price: 480,
      description: "Fresh Norwegian smoked salmon, cream cheese, capers, and red onion on toasted sesame bagel.",
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500",
      isAvailable: true,
      categoryId: catStarters.id,
      restaurantId: urbanCafe.id,
    },
  });

  // Burger Hub Categories & Items
  const catBurger = await prisma.menuCategory.create({
    data: {
      id: "cat-burgers",
      name: "Signature Burgers",
      restaurantId: burgerHub.id,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      id: "item-201",
      name: "Double Smash Bacon Cheeseburger",
      price: 390,
      description: "Two smashed beef patties, crispy bacon, cheddar, grilled onions, and house sauce.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
      isAvailable: true,
      categoryId: catBurger.id,
      restaurantId: burgerHub.id,
    },
  });

  // 8. Seed Bookings
  await prisma.booking.create({
    data: {
      id: "b-1001",
      bookingCode: "BK-84210",
      guestName: "Gaurav Sharma",
      guestPhone: "+91 98765 43210",
      guestCount: 4,
      bookingDate: new Date(),
      timeSlot: "08:00 PM",
      status: "CONFIRMED",
      restaurantId: urbanCafe.id,
      tableId: table3.id,
      userId: user1.id,
    },
  });

  // 9. Seed Orders
  const sampleOrder = await prisma.order.create({
    data: {
      id: "ord-9001",
      orderNumber: "ORD-9001",
      totalAmount: 1000,
      status: "PREPARING",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      customerName: "Gaurav Sharma",
      customerPhone: "+91 98765 43210",
      deliveryAddress: "Bandra West, Mumbai",
      restaurantId: urbanCafe.id,
      userId: user1.id,
      tableId: table2.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder.id,
      menuItemId: item2.id,
      quantity: 1,
      price: 520,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: sampleOrder.id,
      menuItemId: item4.id,
      quantity: 1,
      price: 480,
    },
  });

  // 10. Seed Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Absolutely amazing ambiance and delicious Truffle Risotto! Highly recommended.",
      customerName: "Gaurav Sharma",
      restaurantId: urbanCafe.id,
      userId: user1.id,
    },
  });

  console.log("✅ PostgreSQL Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

