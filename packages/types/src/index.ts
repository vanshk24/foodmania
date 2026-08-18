/**
 * @food-mania/types
 *
 * Central export barrel for all shared TypeScript types across the Food Mania platform.
 *
 * Organized by domain:
 * - common:       Shared primitive types, API response wrappers, pagination
 * - user:         Customer, Staff, and Admin user types
 * - restaurant:   Restaurant, Outlet, and Table types
 * - menu:         Menu categories, items, variants, and add-ons
 * - order:        Order lifecycle, cart, and item types
 * - reservation:  Table booking and slot types
 * - payment:      Payment methods, transactions, and gateway types
 * - notification: Notification payloads and channels
 * - subscription: SaaS plan tiers and billing types
 * - analytics:    Metric and reporting types
 * - enums:        All platform-wide enumerations
 */

// Common
export * from "./common/api.types";
export * from "./common/pagination.types";
export * from "./common/response.types";

// User
export * from "./user/customer.types";
export * from "./user/staff.types";
export * from "./user/admin.types";

// Restaurant
export * from "./restaurant/restaurant.types";
export * from "./restaurant/outlet.types";
export * from "./restaurant/table.types";

// Menu
export * from "./menu/category.types";
export * from "./menu/item.types";
export * from "./menu/variant.types";
export * from "./menu/addon.types";

// Order
export * from "./order/cart.types";
export * from "./order/order.types";
export * from "./order/orderItem.types";

// Reservation
export * from "./reservation/reservation.types";
export * from "./reservation/slot.types";

// Payment
export * from "./payment/payment.types";
export * from "./payment/transaction.types";

// Notification
export * from "./notification/notification.types";

// Subscription
export * from "./subscription/plan.types";
export * from "./subscription/subscription.types";

// Analytics
export * from "./analytics/metric.types";

// Enums
export * from "./enums";
