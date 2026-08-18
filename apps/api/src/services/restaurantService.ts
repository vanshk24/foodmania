import { prisma } from "../utils/prisma.js";

export const getAllRestaurants = async (search?: string, city?: string) => {
  const where: any = {
    status: "ACTIVE",
  };
  if (city && city !== "All") {
    where.city = { equals: city, mode: "insensitive" };
  }
  if (search) {
    where.AND = [
      { status: "ACTIVE" },
      {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      },
    ];
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return restaurants;
};

export const getRestaurantByIdOrSlug = async (idOrSlug: string) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!restaurant) return null;

  // Include owner, tables, categories, menu items, reviews count
  const rawTables = await prisma.restaurantTable.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { tableNumber: "asc" },
  });

  const tables = await Promise.all(
    rawTables.map(async (t) => {
      let customerName: string | null = null;
      let customerPhone: string | null = null;

      if (t.status !== "AVAILABLE") {
        const activeBooking = await prisma.booking.findFirst({
          where: {
            tableId: t.id,
            restaurantId: restaurant.id,
          },
          orderBy: { createdAt: "desc" },
        });

        const activeOrder = await prisma.order.findFirst({
          where: {
            tableId: t.id,
            restaurantId: restaurant.id,
          },
          orderBy: { createdAt: "desc" },
        });

        customerName = activeBooking?.guestName || activeOrder?.customerName || null;
        customerPhone = activeBooking?.guestPhone || activeOrder?.customerPhone || null;
      }

      return {
        ...t,
        customerName,
        customerPhone,
      };
    })
  );

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { sortOrder: "asc" },
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
  });

  const reviews = await prisma.review.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 4.8;

  return {
    ...restaurant,
    avgRating: Number(avgRating.toFixed(1)),
    reviewsCount: reviews.length,
    tables,
    categories,
    menuItems,
    reviews,
  };
};

export const addMenuCategory = async (restaurantId: string, name: string) => {
  const count = await prisma.menuCategory.count({ where: { restaurantId } });
  return prisma.menuCategory.create({
    data: {
      name,
      restaurantId,
      sortOrder: count + 1,
    },
  });
};

export const addMenuItem = async (
  data: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    categoryId: string;
    restaurantId: string;
    isAvailable?: boolean;
  },
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      data.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot add items to another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  return prisma.menuItem.create({
    data: {
      name: data.name,
      price: Number(data.price),
      description: data.description,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
      categoryId: data.categoryId,
      restaurantId: data.restaurantId,
      isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
    },
  });
};

export const updateMenuItem = async (
  itemId: string,
  data: { name?: string; price?: number; isAvailable?: boolean; description?: string; imageUrl?: string },
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const existing = await prisma.menuItem.findUnique({
    where: { id: itemId },
  });

  if (!existing) {
    throw new Error("Menu item not found");
  }

  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      existing.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot modify items for another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  return prisma.menuItem.update({
    where: { id: itemId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.price !== undefined ? { price: Number(data.price) } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
    },
  });
};

export const getRestaurantMenu = async (idOrSlug: string) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });

  if (!restaurant) return null;

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { sortOrder: "asc" },
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurant.id },
  });

  return categories.map((c) => ({
    ...c,
    items: menuItems.filter((m) => m.categoryId === c.id),
  }));
};

export const deleteMenuItem = async (
  itemId: string,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const existing = await prisma.menuItem.findUnique({
    where: { id: itemId },
  });

  if (!existing) {
    throw new Error("Menu item not found");
  }

  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      existing.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot delete items from another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  await prisma.menuItem.delete({
    where: { id: itemId },
  });

  return { id: itemId, success: true };
};

export const updateTableStatus = async (
  tableId: string,
  status: string,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const existing = await prisma.restaurantTable.findFirst({
    where: {
      OR: [{ id: tableId }, { tableNumber: tableId }],
    },
  });

  if (!existing) {
    throw new Error("Table not found");
  }

  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      existing.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot modify tables for another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  const normalizedStatus = status.toUpperCase();

  return prisma.restaurantTable.update({
    where: { id: existing.id },
    data: { status: normalizedStatus },
  });
};

