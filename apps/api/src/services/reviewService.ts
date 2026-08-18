import { prisma } from "../utils/prisma.js";

export const createReview = async (data: {
  restaurantId: string;
  rating: number;
  comment?: string;
  userId?: string;
  customerName?: string;
}) => {
  const review = await prisma.review.create({
    data: {
      restaurantId: data.restaurantId,
      rating: Number(data.rating),
      comment: data.comment,
      userId: data.userId,
      customerName: data.customerName || "Satisfied Guest",
    },
  });

  // Recalculate average rating & review count for restaurant
  const allReviews = await prisma.review.findMany({
    where: { restaurantId: data.restaurantId },
  });

  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await prisma.restaurant.update({
    where: { id: data.restaurantId },
    data: {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    },
  });

  await prisma.notification.create({
    data: {
      title: "New Review Received",
      message: `Received a ${data.rating}★ review: "${data.comment || "Great experience!"}"`,
      type: "REVIEW",
      restaurantId: data.restaurantId,
    },
  });

  return review;
};

export const getReviews = async (restaurantId: string) => {
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    orderBy: { createdAt: "desc" },
  });
  return reviews;
};

