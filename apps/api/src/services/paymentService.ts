import { prisma } from "../utils/prisma.js";

export interface CreatePaymentInput {
  orderId: string;
  amount?: number;
  method?: string;
  userId?: string;
  restaurantId?: string;
  currency?: string;
}

export interface PaymentRequester {
  userId: string;
  role: string;
  restaurantId?: string | null;
}

/**
 * Creates a new Payment record in PENDING status.
 * Ensures the payment is tied to an existing Order and matches the authoritative Order total.
 */
export const createPaymentRecord = async (
  input: CreatePaymentInput,
  requester?: PaymentRequester
) => {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
  });

  if (!order) {
    const err: any = new Error(`Order not found: ${input.orderId}`);
    err.statusCode = 404;
    throw err;
  }

  // Authorization check if user is not SUPER_ADMIN
  if (requester && requester.role !== "SUPER_ADMIN") {
    if (requester.role === "CUSTOMER" && order.userId && order.userId !== requester.userId) {
      const err: any = new Error("Forbidden: You cannot create payment for another customer's order");
      err.statusCode = 403;
      throw err;
    }
    if ((requester.role === "OWNER" || requester.role === "STAFF") && requester.restaurantId && order.restaurantId !== requester.restaurantId) {
      const err: any = new Error("Forbidden: You cannot create payment for another restaurant's order");
      err.statusCode = 403;
      throw err;
    }
  }

  // Idempotency: check if an active pending payment already exists for this order
  const existingPending = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingPending) {
    return existingPending;
  }

  // Authoritative amount comes directly from Order total
  const paymentAmount = order.totalAmount;

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: paymentAmount,
      currency: input.currency || "INR",
      status: "PENDING",
      method: input.method || order.paymentMethod || "CARD",
      restaurantId: order.restaurantId,
      userId: input.userId || order.userId || null,
    },
  });

  return payment;
};

/**
 * Retrieves a Payment record by ID with role-based access control.
 */
export const getPaymentById = async (
  id: string,
  requester?: PaymentRequester
) => {
  if (!requester) {
    const err: any = new Error("Unauthorized: Access token required to view payment details");
    err.statusCode = 401;
    throw err;
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    const err: any = new Error("Payment record not found");
    err.statusCode = 404;
    throw err;
  }

  // Access Control
  if (requester.role !== "SUPER_ADMIN") {
    if (requester.role === "CUSTOMER") {
      if (payment.userId && payment.userId !== requester.userId) {
        const err: any = new Error("Forbidden: You cannot view another customer's payment details");
        err.statusCode = 403;
        throw err;
      }
    } else if (requester.role === "OWNER" || requester.role === "STAFF") {
      if (requester.restaurantId && payment.restaurantId && payment.restaurantId !== requester.restaurantId) {
        const err: any = new Error("Forbidden: You cannot view payments for another restaurant");
        err.statusCode = 403;
        throw err;
      }
    }
  }

  return payment;
};

/**
 * Retrieves the latest Payment record for a given orderId with role-based access control.
 */
export const getPaymentByOrderId = async (
  orderId: string,
  requester?: PaymentRequester
) => {
  if (!requester) {
    const err: any = new Error("Unauthorized: Access token required to view payment details");
    err.statusCode = 401;
    throw err;
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
  });

  if (!order) {
    const err: any = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  if (requester.role !== "SUPER_ADMIN") {
    if (requester.role === "CUSTOMER" && order.userId && order.userId !== requester.userId) {
      const err: any = new Error("Forbidden: You cannot view another customer's payment");
      err.statusCode = 403;
      throw err;
    }
    if ((requester.role === "OWNER" || requester.role === "STAFF") && requester.restaurantId && order.restaurantId !== requester.restaurantId) {
      const err: any = new Error("Forbidden: You cannot view payments for another restaurant");
      err.statusCode = 403;
      throw err;
    }
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId: order.id },
    orderBy: { createdAt: "desc" },
  });

  return payment;
};

/**
 * Lists all payments with filters (for Admin / Super Admin).
 */
export const getAllPayments = async (filters?: {
  restaurantId?: string;
  userId?: string;
  status?: string;
}) => {
  const where: any = {};
  if (filters?.restaurantId) where.restaurantId = filters.restaurantId;
  if (filters?.userId) where.userId = filters.userId;
  if (filters?.status) where.status = filters.status.toUpperCase();

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

/**
 * Updates a payment status with idempotency and syncs Order paymentStatus.
 */
export const updatePaymentStatus = async (
  id: string,
  newStatus: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED",
  gatewayData?: {
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
    failureReason?: string;
  },
  requester?: PaymentRequester
) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    const err: any = new Error("Payment record not found");
    err.statusCode = 404;
    throw err;
  }

  // Idempotency: if already in target final status, return without duplicate operations
  if (payment.status === newStatus) {
    return payment;
  }

  // Role validation: only SUPER_ADMIN or authorized backend system can manually update payment status
  if (requester && requester.role !== "SUPER_ADMIN") {
    const err: any = new Error("Forbidden: Only administrators can modify payment records directly");
    err.statusCode = 403;
    throw err;
  }

  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: {
      status: newStatus,
      ...(gatewayData?.gatewayOrderId ? { gatewayOrderId: gatewayData.gatewayOrderId } : {}),
      ...(gatewayData?.gatewayPaymentId ? { gatewayPaymentId: gatewayData.gatewayPaymentId } : {}),
      ...(gatewayData?.gatewaySignature ? { gatewaySignature: gatewayData.gatewaySignature } : {}),
      ...(gatewayData?.failureReason ? { failureReason: gatewayData.failureReason } : {}),
    },
  });

  // Synchronize Order paymentStatus
  const orderPaymentStatusMap: Record<string, string> = {
    PENDING: "PENDING_PAYMENT",
    PROCESSING: "PAYMENT_PROCESSING",
    SUCCESS: "PAID",
    FAILED: "PAYMENT_FAILED",
    REFUNDED: "REFUNDED",
  };

  const correspondingOrderPaymentStatus = orderPaymentStatusMap[newStatus] || "PENDING_PAYMENT";

  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      paymentStatus: correspondingOrderPaymentStatus,
    },
  });

  return updatedPayment;
};

/**
 * DEVELOPMENT PAYMENT FLOW — NOT RAZORPAY.
 * Server-controlled endpoint for confirming payment during development/testing.
 * Validates order ownership, computes amount server-side, and marks payment SUCCESS.
 * Never trusts client-sent amounts, payment IDs, or success flags.
 */
export const devConfirmPayment = async (
  orderId: string,
  requester: PaymentRequester
) => {
  // Find order by ID or order number
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
  });

  if (!order) {
    const err: any = new Error(`Order not found: ${orderId}`);
    err.statusCode = 404;
    throw err;
  }

  // Authorization: customer can only confirm their own order; owner/staff restricted to their restaurant
  if (requester.role === 'CUSTOMER') {
    if (order.userId && order.userId !== requester.userId) {
      const err: any = new Error('Forbidden: You cannot confirm payment for another customer\'s order');
      err.statusCode = 403;
      throw err;
    }
  } else if (requester.role === 'OWNER' || requester.role === 'STAFF') {
    if (requester.restaurantId && order.restaurantId !== requester.restaurantId) {
      const err: any = new Error('Forbidden: You cannot confirm payment for another restaurant\'s order');
      err.statusCode = 403;
      throw err;
    }
  }

  // Idempotency: return existing SUCCESS payment if already confirmed
  const existingSuccess = await prisma.payment.findFirst({
    where: { orderId: order.id, status: 'SUCCESS' },
  });
  if (existingSuccess) {
    return { payment: existingSuccess, order, alreadyConfirmed: true };
  }

  // Server computes the authoritative amount — never trust client value
  const serverAmount = order.totalAmount;

  // Upsert payment record — ensure only one payment per order
  let payment = await prisma.payment.findFirst({
    where: { orderId: order.id },
    orderBy: { createdAt: 'desc' },
  });

  if (payment) {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        method: 'DEV_PAYMENT',
        amount: serverAmount,
        gatewayPaymentId: `DEV-${Date.now()}`,
      },
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: serverAmount,
        currency: 'INR',
        status: 'SUCCESS',
        method: 'DEV_PAYMENT',
        gatewayPaymentId: `DEV-${Date.now()}`,
        restaurantId: order.restaurantId,
        userId: order.userId || requester.userId,
      },
    });
  }

  // Update order payment status to PAID
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'PAID' },
  });

  // Create notification for business
  await prisma.notification.create({
    data: {
      title: 'Development Payment Confirmed',
      message: `Order #${order.orderNumber} payment of ₹${serverAmount} confirmed via DEVELOPMENT PAYMENT FLOW`,
      type: 'PAYMENT',
      restaurantId: order.restaurantId,
    },
  }).catch(() => {});

  return { payment, order: updatedOrder, alreadyConfirmed: false };
};
