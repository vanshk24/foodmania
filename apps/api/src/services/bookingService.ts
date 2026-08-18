import { prisma } from "../utils/prisma.js";

export const createBooking = async (data: {
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestCount: number;
  bookingDate: string;
  timeSlot: string;
  tableId?: string;
  userId?: string;
}) => {
  const bookingCode = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateObj = isNaN(Date.parse(data.bookingDate)) ? new Date() : new Date(data.bookingDate);

  let targetTableId: string | null = null;

  if (data.tableId && data.restaurantId) {
    const trimmed = data.tableId.trim();
    const digitsMatch = trimmed.match(/\d+/);
    const digitsOnly = digitsMatch ? digitsMatch[0] : "";
    const tDashFormat = digitsOnly ? `T-${digitsOnly.padStart(2, "0")}` : "";

    const foundTable = await prisma.restaurantTable.findFirst({
      where: {
        restaurantId: data.restaurantId,
        OR: [
          { id: trimmed },
          { tableNumber: { equals: trimmed, mode: "insensitive" as const } },
          ...(tDashFormat ? [{ tableNumber: { equals: tDashFormat, mode: "insensitive" as const } }] : []),
        ],
      },
    });

    if (foundTable) {
      targetTableId = foundTable.id;
    }
  }

  if (!targetTableId && data.restaurantId) {
    const defaultTable = await prisma.restaurantTable.findFirst({
      where: { restaurantId: data.restaurantId, status: "AVAILABLE" },
    });
    if (defaultTable) {
      targetTableId = defaultTable.id;
    }
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestCount: Number(data.guestCount) || 2,
      bookingDate: dateObj,
      timeSlot: data.timeSlot || "08:00 PM",
      status: "PENDING",
      restaurantId: data.restaurantId,
      tableId: targetTableId,
      userId: data.userId || null,
    },
  });

  if (targetTableId) {
    await prisma.restaurantTable.update({
      where: { id: targetTableId },
      data: { status: "RESERVED" },
    }).catch(() => {});
  } else if (data.tableId && data.restaurantId) {
    const digitsMatch = String(data.tableId).match(/\d+/);
    const tableNumStr = digitsMatch ? `T-${digitsMatch[0].padStart(2, "0")}` : (String(data.tableId).trim() || "T-01");
    const newTable = await prisma.restaurantTable.create({
      data: {
        tableNumber: tableNumStr,
        capacity: 4,
        status: "RESERVED",
        restaurantId: data.restaurantId,
      },
    }).catch(() => null);

    if (newTable) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { tableId: newTable.id },
      }).catch(() => {});
    }
  }

  await prisma.notification.create({
    data: {
      title: "New Table Reservation",
      message: `Table reservation request for ${data.guestName} (${data.guestCount} guests, ${data.timeSlot})`,
      type: "BOOKING",
      restaurantId: data.restaurantId,
    },
  });

  return booking;
};

export const getBookings = async (restaurantId?: string, userId?: string) => {
  const where: any = {};
  if (restaurantId) where.restaurantId = restaurantId;
  if (userId) where.userId = userId;

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

export const updateBookingStatus = async (
  idOrCode: string,
  status: string,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const existing = await prisma.booking.findFirst({
    where: {
      OR: [{ id: idOrCode }, { bookingCode: idOrCode }],
    },
  });

  if (!existing) {
    throw new Error("Booking not found");
  }

  if (requester && requester.role !== "SUPER_ADMIN") {
    if (
      (requester.role === "OWNER" || requester.role === "STAFF") &&
      requester.restaurantId &&
      existing.restaurantId !== requester.restaurantId
    ) {
      const err: any = new Error("Forbidden: You cannot modify bookings for another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  const normalizedStatus = status.toUpperCase();

  const booking = await prisma.booking.update({
    where: { id: existing.id },
    data: { status: normalizedStatus },
  });

  if (booking.tableId) {
    if (normalizedStatus === "CONFIRMED" || normalizedStatus === "ACCEPTED" || normalizedStatus === "RESERVED") {
      await prisma.restaurantTable.update({
        where: { id: booking.tableId },
        data: { status: "RESERVED" },
      }).catch(() => {});
    } else if (normalizedStatus === "COMPLETED" || normalizedStatus === "CANCELLED" || normalizedStatus === "REJECTED") {
      await prisma.restaurantTable.update({
        where: { id: booking.tableId },
        data: { status: "AVAILABLE" },
      }).catch(() => {});
    }
  }

  await prisma.notification.create({
    data: {
      title: "Reservation Status Updated",
      message: `Booking #${booking.bookingCode} for ${booking.guestName} status changed to ${normalizedStatus}`,
      type: "BOOKING_STATUS",
      userId: booking.userId || undefined,
      restaurantId: booking.restaurantId,
    },
  });

  return booking;
};

