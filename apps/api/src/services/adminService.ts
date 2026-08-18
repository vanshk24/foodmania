import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";


export const getAdminUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const orders = await prisma.order.findMany({ where: { userId: u.id } });
      const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        ...u,
        totalOrders: orders.length,
        totalSpend,
      };
    })
  );

  return usersWithStats;
};

export const getAdminRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = await Promise.all(
    restaurants.map(async (r) => {
      const owner = await prisma.restaurantOwner.findFirst({
        where: { restaurantId: r.id },
      });
      const menuCount = await prisma.menuItem.count({
        where: { restaurantId: r.id },
      });
      const ordersCount = await prisma.order.count({
        where: { restaurantId: r.id },
      });
      const tablesCount = await prisma.restaurantTable.count({
        where: { restaurantId: r.id },
      });

      return {
        ...r,
        ownerName: owner?.name || "Unassigned",
        ownerEmail: owner?.email || "N/A",
        menuCount,
        ordersCount,
        tablesCount,
      };
    })
  );

  return formatted;
};

export const createRestaurant = async (data: {
  name: string;
  slug?: string;
  city: string;
  address?: string;
  phone?: string;
  code?: string;
  cuisine?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPassword?: string;
}) => {
  const generatedCode = (data.code || data.name.substring(0, 4) + Math.floor(100 + Math.random() * 900)).toUpperCase();
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const hashedPassword = await bcrypt.hash(data.ownerPassword || "owner123", 10);

  return prisma.$transaction(async (tx) => {
    const restaurant = await tx.restaurant.create({
      data: {
        name: data.name,
        slug,
        city: data.city,
        address: data.address || `${data.city} City Center`,
        phone: data.phone || "+91 98765 00000",
        code: generatedCode,
        cuisine: data.cuisine || "Multi-Cuisine",
        rating: 4.8,
        reviewCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
        status: "ACTIVE",
      },
    });

    if (data.ownerEmail) {
      await tx.restaurantOwner.create({
        data: {
          name: data.ownerName || `${data.name} Owner`,
          email: data.ownerEmail,
          phone: data.phone || "+91 98765 00000",
          restaurantId: restaurant.id,
        },
      });

      await tx.user.upsert({
        where: { email: data.ownerEmail },
        update: {
          role: "OWNER",
          restaurantCode: generatedCode,
          restaurantId: restaurant.id,
        },
        create: {
          email: data.ownerEmail,
          name: data.ownerName || `${data.name} Owner`,
          phone: data.phone || "+91 98765 00000",
          password: hashedPassword,
          role: "OWNER",
          restaurantCode: generatedCode,
          restaurantId: restaurant.id,
        },
      });
    }

    // Create default subscription
    await tx.subscription.create({
      data: {
        plan: "PRO",
        status: "ACTIVE",
        monthlyAmount: 4999,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        restaurantId: restaurant.id,
      },
    });

    // Create default starter category and table
    const cat = await tx.menuCategory.create({
      data: {
        name: "Chef Specials",
        restaurantId: restaurant.id,
        sortOrder: 1,
      },
    });

    await tx.menuItem.create({
      data: {
        name: "Signature House Special",
        price: 450,
        description: "Delightful house special recipe prepared with fresh organic ingredients.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
        isAvailable: true,
        categoryId: cat.id,
        restaurantId: restaurant.id,
      },
    });

    await tx.restaurantTable.create({
      data: {
        tableNumber: "T-01",
        capacity: 4,
        status: "AVAILABLE",
        restaurantId: restaurant.id,
      },
    });

    return restaurant;
  });
};


export const updateRestaurant = async (id: string, data: any) => {
  const { ownerName, ownerEmail, ownerPassword, ...restData } = data;

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: restData,
  });

  if (ownerName || ownerEmail || ownerPassword) {
    const owner = await prisma.restaurantOwner.findFirst({
      where: { restaurantId: id },
    });

    if (owner) {
      await prisma.restaurantOwner.update({
        where: { id: owner.id },
        data: {
          ...(ownerName ? { name: ownerName } : {}),
          ...(ownerEmail ? { email: ownerEmail } : {}),
        },
      });

      const user = await prisma.user.findFirst({
        where: { email: owner.email },
      });

      if (user) {
        let userUpdatePayload: any = {};
        if (ownerName) userUpdatePayload.name = ownerName;
        if (ownerEmail) userUpdatePayload.email = ownerEmail;
        if (ownerPassword) userUpdatePayload.password = await bcrypt.hash(ownerPassword, 10);

        await prisma.user.update({
          where: { id: user.id },
          data: userUpdatePayload,
        });
      }
    }
  }

  return restaurant;
};

export const deleteRestaurant = async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    const err: any = new Error("Restaurant not found");
    err.statusCode = 404;
    throw err;
  }

  const orders = await prisma.order.findMany({ where: { restaurantId: id }, select: { id: true } });
  const orderIds = orders.map((o) => o.id);

  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
    prisma.order.deleteMany({ where: { restaurantId: id } }),
    prisma.booking.deleteMany({ where: { restaurantId: id } }),
    prisma.payment.deleteMany({ where: { restaurantId: id } }),
    prisma.review.deleteMany({ where: { restaurantId: id } }),
    prisma.menuItem.deleteMany({ where: { restaurantId: id } }),
    prisma.menuCategory.deleteMany({ where: { restaurantId: id } }),
    prisma.restaurantTable.deleteMany({ where: { restaurantId: id } }),
    prisma.restaurantOwner.deleteMany({ where: { restaurantId: id } }),
    prisma.subscription.deleteMany({ where: { restaurantId: id } }),
    prisma.notification.deleteMany({ where: { restaurantId: id } }),
    prisma.restaurant.delete({ where: { id } }),
  ]);

  return { id };
};

export const getAdminSubscriptions = async () => {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = await Promise.all(
    subscriptions.map(async (s) => {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: s.restaurantId },
      });
      return {
        ...s,
        restaurantName: restaurant?.name || "Unknown",
      };
    })
  );

  return formatted;
};

export const updateAdminUser = async (
  id: string,
  data: { status?: string; role?: string; name?: string; phone?: string }
) => {
  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("User not found");
  }

  let newRole = data.role;
  if (data.status) {
    const statusLower = data.status.toLowerCase();
    if (statusLower === "banned") newRole = "BANNED";
    else if (statusLower === "suspended") newRole = "SUSPENDED";
    else if (statusLower === "active" && (existing.role === "BANNED" || existing.role === "SUSPENDED")) {
      newRole = "CUSTOMER";
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(newRole ? { role: newRole } : {}),
      ...(data.name ? { name: data.name } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
    },
  });

  const { password, twoFactorSecret, ...userWithoutSecrets } = updated;
  return userWithoutSecrets;
};

export const getAdminAnalytics = async () => {
  const totalRestaurants = await prisma.restaurant.count();
  const totalUsers = await prisma.user.count();
  const totalOrders = await prisma.order.count();

  const orders = await prisma.order.findMany();
  const totalGrossRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPlatformFees = totalGrossRevenue * 0.05;

  return {
    totalRestaurants,
    totalUsers,
    totalOrders,
    totalGrossRevenue,
    totalPlatformFees,
  };
};
