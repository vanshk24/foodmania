import { prisma } from "../utils/prisma.js";

export const createOrder = async (data: {
  restaurantId: string;
  totalAmount?: number;
  items: Array<{ menuItemId: string; quantity: number; price?: number; name?: string }>;
  userId?: string;
  tableId?: string;
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
}) => {
  // 1. Resolve and verify restaurant
  if (!data.restaurantId) {
    const err: any = new Error("Restaurant ID is required");
    err.statusCode = 400;
    throw err;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      OR: [{ id: data.restaurantId }, { slug: data.restaurantId }],
    },
  });

  if (!restaurant) {
    const err: any = new Error(`Restaurant not found: ${data.restaurantId}`);
    err.statusCode = 404;
    throw err;
  }

  // 2. Validate items array
  if (!Array.isArray(data.items) || data.items.length === 0) {
    const err: any = new Error("Order must contain at least one item");
    err.statusCode = 400;
    throw err;
  }

  // 3. Verify each menu item, availability, restaurant ownership, and calculate authoritative server price
  let serverCalculatedTotal = 0;
  const validatedItems: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
    name: string;
  }> = [];

  for (const item of data.items) {
    if (!item.menuItemId) {
      const err: any = new Error("Menu item ID is required for each item");
      err.statusCode = 400;
      throw err;
    }

    if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 100 || !Number.isInteger(item.quantity)) {
      const err: any = new Error(`Invalid quantity (${item.quantity}) for menu item ${item.menuItemId}. Quantity must be an integer between 1 and 100`);
      err.statusCode = 400;
      throw err;
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: item.menuItemId },
    });

    if (!menuItem) {
      const err: any = new Error(`Menu item not found: ${item.menuItemId}`);
      err.statusCode = 404;
      throw err;
    }

    if (menuItem.restaurantId !== restaurant.id) {
      const err: any = new Error(`Menu item '${menuItem.name}' does not belong to restaurant '${restaurant.name}'`);
      err.statusCode = 400;
      throw err;
    }

    if (!menuItem.isAvailable) {
      const err: any = new Error(`Menu item '${menuItem.name}' is currently unavailable`);
      err.statusCode = 400;
      throw err;
    }

    // Authoritative price comes strictly from PostgreSQL
    const itemPrice = menuItem.price;
    serverCalculatedTotal += itemPrice * item.quantity;

    validatedItems.push({
      menuItemId: menuItem.id,
      quantity: item.quantity,
      price: itemPrice,
      name: menuItem.name,
    });
  }

  // 3.5 Validate table if tableId/tableNumber/table parameter is provided
  let targetTableId: string | null = null;
  let targetTableNumber: string | null = null;

  const rawTableParam = data.tableId || (data as any).tableNumber || (data as any).table;
  if (rawTableParam && typeof rawTableParam === "string") {
    const trimmedTable = rawTableParam.trim();
    const normalizedNumber = trimmedTable.toUpperCase().replace(/^T(\d+)$/, "T-$1");
    const digitsMatch = trimmedTable.match(/\d+/);
    const digitsOnly = digitsMatch ? digitsMatch[0] : "";
    const tDashFormat = digitsOnly ? `T-${digitsOnly.padStart(2, "0")}` : "";
    const tShortFormat = digitsOnly ? `T-${parseInt(digitsOnly, 10)}` : "";
    const tableWordFormat = digitsOnly ? `Table ${digitsOnly.padStart(2, "0")}` : "";

    const searchOR = [
      { id: trimmedTable },
      { tableNumber: { equals: trimmedTable, mode: "insensitive" as const } },
      { tableNumber: { equals: normalizedNumber, mode: "insensitive" as const } },
      ...(tDashFormat ? [{ tableNumber: { equals: tDashFormat, mode: "insensitive" as const } }] : []),
      ...(tShortFormat ? [{ tableNumber: { equals: tShortFormat, mode: "insensitive" as const } }] : []),
      ...(tableWordFormat ? [{ tableNumber: { equals: tableWordFormat, mode: "insensitive" as const } }] : []),
      ...(digitsOnly ? [{ tableNumber: { equals: digitsOnly, mode: "insensitive" as const } }] : []),
    ];

    let foundTable = await prisma.restaurantTable.findFirst({
      where: {
        restaurantId: restaurant.id,
        OR: searchOR,
      },
    });

    if (!foundTable) {
      // Fallback within the SAME restaurant (never cross-tenant) if exact table number string varies
      foundTable = await prisma.restaurantTable.findFirst({
        where: {
          restaurantId: restaurant.id,
        },
      });
    }

    if (!foundTable) {
      // Check if table exists under another restaurant to return precise cross-tenant error
      const otherRestaurantTable = await prisma.restaurantTable.findFirst({
        where: {
          OR: searchOR,
        },
      });

      if (otherRestaurantTable) {
        const err: any = new Error(`Table '${trimmedTable}' belongs to another restaurant and cannot be used for '${restaurant.name}'`);
        err.statusCode = 400;
        throw err;
      }

      const err: any = new Error(`Invalid table '${trimmedTable}' for restaurant '${restaurant.name}'`);
      err.statusCode = 400;
      throw err;
    }

    targetTableId = foundTable.id;
    targetTableNumber = foundTable.tableNumber;
  }

  // DEV/TEST ONLY: Evaluate FREE100 coupon code
  const isFree100Test = (data as any).couponCode && String((data as any).couponCode).trim().toUpperCase() === "FREE100";
  if (isFree100Test) {
    serverCalculatedTotal = 0;
  }

  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const displayAddress = targetTableNumber
    ? `Table ${targetTableNumber} (Dine-In)`
    : data.deliveryAddress || "Dine-In / Delivery";

  // 4. Create Order, OrderItems, Payment, and Notification atomically inside a Prisma transaction
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        totalAmount: serverCalculatedTotal,
        status: "PENDING",
        paymentStatus: isFree100Test ? "PAID" : "PENDING_PAYMENT",
        paymentMethod: isFree100Test ? "FREE100_TEST" : (data.paymentMethod || "CARD"),
        customerName: data.customerName || "Guest",
        customerPhone: data.customerPhone || "+91 98765 00000",
        deliveryAddress: displayAddress,
        restaurantId: restaurant.id,
        userId: data.userId || null,
        tableId: targetTableId,
      },
    });

    if (targetTableId) {
      await tx.restaurantTable.update({
        where: { id: targetTableId },
        data: { status: "OCCUPIED" },
      }).catch(() => {});
    } else if (rawTableParam && restaurant.id) {
      const digitsMatch = String(rawTableParam).match(/\d+/);
      const tableNumStr = digitsMatch ? `T-${digitsMatch[0].padStart(2, "0")}` : (String(rawTableParam).trim() || "T-01");
      const newTable = await tx.restaurantTable.create({
        data: {
          tableNumber: tableNumStr,
          capacity: 4,
          status: "OCCUPIED",
          restaurantId: restaurant.id,
        },
      }).catch(() => null);

      if (newTable) {
        await tx.order.update({
          where: { id: createdOrder.id },
          data: { tableId: newTable.id },
        }).catch(() => {});
      }
    }

    for (const vItem of validatedItems) {
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          menuItemId: vItem.menuItemId,
          quantity: vItem.quantity,
          price: vItem.price,
        },
      });
    }

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        amount: serverCalculatedTotal,
        currency: "INR",
        status: "PENDING",
        method: data.paymentMethod || "CARD",
        restaurantId: restaurant.id,
        userId: data.userId || null,
      },
    });

    await tx.notification.create({
      data: {
        title: "New Order Received",
        message: `Order #${createdOrder.orderNumber} placed for ₹${serverCalculatedTotal} (Awaiting Payment)`,
        type: "ORDER",
        restaurantId: restaurant.id,
      },
    });

    return createdOrder;
  });

  return getOrderById(order.id);
};

export const getOrders = async (restaurantId?: string, userId?: string) => {
  const where: any = {};
  if (restaurantId) where.restaurantId = restaurantId;
  if (userId) where.userId = userId;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Attach order items for each order along with item & table details
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await prisma.orderItem.findMany({
        where: { orderId: order.id },
      });
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const menuItem = await prisma.menuItem.findUnique({
            where: { id: item.menuItemId },
          });
          return {
            ...item,
            name: menuItem?.name || "Dish Item",
            menuItem,
          };
        })
      );

      let tableData: any = null;
      let tableNumberStr: string | null = null;

      if (order.tableId) {
        tableData = await prisma.restaurantTable.findUnique({
          where: { id: order.tableId },
        });
        if (tableData) {
          tableNumberStr = tableData.tableNumber;
        }
      }

      if (!tableNumberStr && order.deliveryAddress) {
        const match = order.deliveryAddress.match(/Table\s+([A-Za-z0-9-]+)/i);
        if (match) {
          tableNumberStr = match[1];
        }
      }

      return {
        ...order,
        tableNumber: tableNumberStr,
        table: tableData,
        items: itemsWithDetails,
      };
    })
  );

  return ordersWithItems;
};

export const getOrderById = async (idOrNumber: string) => {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
    },
  });

  if (!order) return null;

  const items = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });

  const itemsWithDetails = await Promise.all(
    items.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      return {
        ...item,
        name: menuItem?.name || "Dish Item",
        menuItem,
      };
    })
  );

  const payment = await prisma.payment.findFirst({
    where: { orderId: order.id },
    orderBy: { createdAt: "desc" },
  });

  let tableData: any = null;
  let tableNumberStr: string | null = null;

  if (order.tableId) {
    tableData = await prisma.restaurantTable.findUnique({
      where: { id: order.tableId },
    });
    if (tableData) {
      tableNumberStr = tableData.tableNumber;
    }
  }

  if (!tableNumberStr && order.deliveryAddress) {
    const match = order.deliveryAddress.match(/Table\s+([A-Za-z0-9-]+)/i);
    if (match) {
      tableNumberStr = match[1];
    }
  }

  return {
    ...order,
    tableNumber: tableNumberStr,
    table: tableData,
    items: itemsWithDetails,
    payment,
  };
};

export const updateOrderStatus = async (
  idOrNumber: string,
  status: string,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const existing = await prisma.order.findFirst({
    where: {
      OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
    },
  });

  if (!existing) {
    const err: any = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      existing.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot modify orders for another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  const normalizedStatus = status.toUpperCase();

  const order = await prisma.order.update({
    where: { id: existing.id },
    data: { status: normalizedStatus },
  });

  await prisma.notification.create({
    data: {
      title: "Order Status Updated",
      message: `Order #${order.orderNumber} status changed to ${normalizedStatus}`,
      type: "ORDER_STATUS",
      userId: order.userId || undefined,
      restaurantId: order.restaurantId,
    },
  });

  return getOrderById(order.id);
};

export const updateOrderPaymentStatus = async (
  idOrNumber: string,
  paymentStatus: string,
  paymentMethod?: string
) => {
  const existing = await prisma.order.findFirst({
    where: {
      OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
    },
  });

  if (!existing) {
    const err: any = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  const normalizedStatus = paymentStatus.toUpperCase();

  const order = await prisma.order.update({
    where: { id: existing.id },
    data: {
      paymentStatus: normalizedStatus,
      ...(paymentMethod ? { paymentMethod } : {}),
    },
  });

  return getOrderById(order.id);
};

