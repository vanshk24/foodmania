import { prisma } from "../utils/prisma.js";

export interface NotificationFilter {
  userId?: string;
  restaurantId?: string;
  isRead?: boolean;
}

export const getNotifications = async (
  filter: NotificationFilter,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const where: any = {};

  if (requester) {
    if (requester.role === "SUPER_ADMIN") {
      if (filter.userId) where.userId = filter.userId;
      if (filter.restaurantId) where.restaurantId = filter.restaurantId;
    } else if (requester.role === "OWNER" || requester.role === "STAFF") {
      const restId = requester.restaurantId || filter.restaurantId;
      where.OR = [
        { userId: requester.userId },
        ...(restId ? [{ restaurantId: restId }] : []),
      ];
    } else {
      // Regular customer
      where.userId = requester.userId;
    }
  } else {
    if (filter.userId) where.userId = filter.userId;
    if (filter.restaurantId) where.restaurantId = filter.restaurantId;
  }

  if (filter.isRead !== undefined) {
    where.isRead = filter.isRead;
  }

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};

export const markNotificationAsRead = async (
  id: string,
  requester?: { userId: string; role: string; restaurantId?: string | null }
) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  // Ownership verification
  if (requester && requester.role !== "SUPER_ADMIN") {
    const isUserOwner = notification.userId === requester.userId;
    const isRestOwner =
      requester.restaurantId && notification.restaurantId === requester.restaurantId;

    if (!isUserOwner && !isRestOwner) {
      const err: any = new Error("Forbidden: You do not own this notification");
      err.statusCode = 403;
      throw err;
    }
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};
