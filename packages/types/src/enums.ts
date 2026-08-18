/**
 * Platform-wide enumerations for Food Mania.
 *
 * All enums are kept in a single file to prevent circular imports
 * and provide a single source of truth for all status codes,
 * roles, and modes used across the customer, business, and admin apps.
 */

// ─── User & Authentication ──────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  WAITER = "WAITER",
  KITCHEN_STAFF = "KITCHEN_STAFF",
  CUSTOMER = "CUSTOMER",
}

export enum AuthProvider {
  EMAIL_OTP = "EMAIL_OTP",
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  GUEST = "GUEST",
}

// ─── Restaurant & Outlet ────────────────────────────────────────────────────

export enum RestaurantType {
  CAFE = "CAFE",
  RESTAURANT = "RESTAURANT",
  FINE_DINING = "FINE_DINING",
  FAMILY_RESTAURANT = "FAMILY_RESTAURANT",
  QSR = "QSR",
  HOTEL = "HOTEL",
  BAR = "BAR",
  BAKERY = "BAKERY",
}

export enum DietaryCategory {
  VEG = "VEG",
  NON_VEG = "NON_VEG",
  MIXED = "MIXED",
  VEGAN = "VEGAN",
}

export enum RestaurantApprovalStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  DOCUMENTS_VERIFIED = "DOCUMENTS_VERIFIED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

// ─── Table ──────────────────────────────────────────────────────────────────

export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
  BILL_REQUESTED = "BILL_REQUESTED",
  CLEANING = "CLEANING",
  LOCKED = "LOCKED",
}

export enum WaiterMode {
  HYBRID = "HYBRID",
  SELF_SERVICE = "SELF_SERVICE",
}

// ─── Order ──────────────────────────────────────────────────────────────────

export enum OrderStatus {
  DRAFT = "DRAFT",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  CONFIRMED = "CONFIRMED",
  KITCHEN_PENDING = "KITCHEN_PENDING",
  PREPARING = "PREPARING",
  READY = "READY",
  SERVED = "SERVED",
  SETTLED = "SETTLED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEAWAY = "TAKEAWAY",
  WALK_IN = "WALK_IN",
}

export enum PaymentMode {
  PAY_UPFRONT = "PAY_UPFRONT",
  PAY_AFTER_MEAL = "PAY_AFTER_MEAL",
}

// ─── Payment ────────────────────────────────────────────────────────────────

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  CASH = "CASH",
}

export enum PaymentGateway {
  RAZORPAY = "RAZORPAY",
  STRIPE = "STRIPE",
  PHONEPE = "PHONEPE",
}

// ─── Reservation ────────────────────────────────────────────────────────────

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  EXPIRED = "EXPIRED",
}

// ─── Menu ───────────────────────────────────────────────────────────────────

export enum SpiceLevel {
  MILD = "MILD",
  MEDIUM = "MEDIUM",
  HOT = "HOT",
  EXTRA_HOT = "EXTRA_HOT",
}

export enum ItemDietaryType {
  VEG = "VEG",
  NON_VEG = "NON_VEG",
  EGG = "EGG",
  VEGAN = "VEGAN",
  GLUTEN_FREE = "GLUTEN_FREE",
}

// ─── Subscription ───────────────────────────────────────────────────────────

export enum SubscriptionPlan {
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export enum SubscriptionBillingCycle {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum SubscriptionStatus {
  TRIALING = "TRIALING",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  SUSPENDED = "SUSPENDED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

// ─── Notification ───────────────────────────────────────────────────────────

export enum NotificationChannel {
  PUSH = "PUSH",
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
  IN_APP = "IN_APP",
}

export enum NotificationType {
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_REMINDER = "BOOKING_REMINDER",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  ORDER_CONFIRMED = "ORDER_CONFIRMED",
  ORDER_PREPARING = "ORDER_PREPARING",
  ORDER_READY = "ORDER_READY",
  ORDER_SERVED = "ORDER_SERVED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  NEW_RESTAURANT_SIGNUP = "NEW_RESTAURANT_SIGNUP",
  RESTAURANT_APPROVED = "RESTAURANT_APPROVED",
  RESTAURANT_REJECTED = "RESTAURANT_REJECTED",
  WAITER_CALL = "WAITER_CALL",
}

// ─── KDS (Kitchen Display System) ───────────────────────────────────────────

export enum KDSTier {
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export enum KDSStation {
  ALL = "ALL",
  MAIN_KITCHEN = "MAIN_KITCHEN",
  BAR = "BAR",
  DESSERT = "DESSERT",
  GRILL = "GRILL",
}
