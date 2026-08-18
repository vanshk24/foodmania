// ─── Admin Data Types ───────────────────────────────────────────────────────

export type RestaurantStatus = "active" | "suspended" | "pending" | "rejected";
export type SubscriptionPlan = "Basic" | "Pro" | "Enterprise";
export type SubscriptionStatus = "active" | "expired" | "trial" | "cancelled";
export type UserStatus = "active" | "suspended" | "banned";
export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed" | "escalated";
export type PaymentStatus = "success" | "failed" | "refunded" | "pending";

export interface AdminRestaurant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  phone: string;
  plan: SubscriptionPlan;
  status: RestaurantStatus;
  verified: boolean;
  qrActive: boolean;
  ordersCount: number;
  tablesCount: number;
  revenue: number;
  reviewRating: number;
  joinedDate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: UserStatus;
  totalOrders: number;
  totalSpend: number;
  loyaltyPoints: number;
  favouriteRestaurant: string;
  joinedDate: string;
  lastActive: string;
}

export interface AdminSubscription {
  id: string;
  restaurantName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  paidAmount: number;
  nextRenewal: string;
}

export interface AdminPaymentTxn {
  id: string;
  restaurantName: string;
  customerName: string;
  amount: number;
  commission: number;
  gst: number;
  netSettlement: number;
  method: "UPI" | "Card" | "Cash" | "Wallet";
  status: PaymentStatus;
  date: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  restaurantName: string;
  subject: string;
  category: "Payment" | "Order" | "Booking" | "Technical" | "Other";
  status: SupportTicketStatus;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const ADMIN_RESTAURANTS: AdminRestaurant[] = [
  {
    id: "the-urban-cafe",
    name: "The Urban Cafe",
    ownerName: "Rohit Sharma",
    ownerEmail: "rohit@urbancafe.com",
    city: "Mumbai",
    phone: "+91 98765 43210",
    plan: "Pro",
    status: "active",
    verified: true,
    qrActive: true,
    ordersCount: 1842,
    tablesCount: 30,
    revenue: 184520,
    reviewRating: 4.6,
    joinedDate: "2025-01-12",
  },
  {
    id: "spice-symphony",
    name: "Spice Symphony",
    ownerName: "Kiran Patel",
    ownerEmail: "kiran@spicesymphony.com",
    city: "Mumbai",
    phone: "+91 98123 45678",
    plan: "Enterprise",
    status: "active",
    verified: true,
    qrActive: true,
    ordersCount: 2340,
    tablesCount: 28,
    revenue: 312400,
    reviewRating: 4.8,
    joinedDate: "2024-11-05",
  },
  {
    id: "royal-treat",
    name: "Royal Treat Hotel",
    ownerName: "Vijay Malhotra",
    ownerEmail: "vijay@royaltreat.com",
    city: "Mumbai",
    phone: "+91 98999 11223",
    plan: "Basic",
    status: "pending",
    verified: false,
    qrActive: false,
    ordersCount: 0,
    tablesCount: 20,
    revenue: 0,
    reviewRating: 0,
    joinedDate: "2026-08-01",
  },
  {
    id: "burger-hub",
    name: "Burger Hub",
    ownerName: "Arjun Singh",
    ownerEmail: "arjun@burgerhub.com",
    city: "Pune",
    phone: "+91 98444 55566",
    plan: "Pro",
    status: "active",
    verified: true,
    qrActive: true,
    ordersCount: 980,
    tablesCount: 15,
    revenue: 92400,
    reviewRating: 4.5,
    joinedDate: "2025-03-18",
  },
  {
    id: "italian-corner",
    name: "Italian Corner",
    ownerName: "Marco D'souza",
    ownerEmail: "marco@italiancorner.com",
    city: "Bangalore",
    phone: "+91 98222 33344",
    plan: "Enterprise",
    status: "suspended",
    verified: true,
    qrActive: false,
    ordersCount: 1240,
    tablesCount: 22,
    revenue: 148000,
    reviewRating: 4.7,
    joinedDate: "2025-02-20",
  },
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "u-1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@gmail.com",
    status: "active",
    totalOrders: 34,
    totalSpend: 28400,
    loyaltyPoints: 840,
    favouriteRestaurant: "The Urban Cafe",
    joinedDate: "2025-02-14",
    lastActive: "Today",
  },
  {
    id: "u-2",
    name: "Priya Patel",
    phone: "+91 98123 45678",
    email: "priya.patel@gmail.com",
    status: "active",
    totalOrders: 18,
    totalSpend: 14200,
    loyaltyPoints: 420,
    favouriteRestaurant: "Spice Symphony",
    joinedDate: "2025-04-22",
    lastActive: "Yesterday",
  },
  {
    id: "u-3",
    name: "Vikram Malhotra",
    phone: "+91 98999 77800",
    email: "vikram.m@hotmail.com",
    status: "suspended",
    totalOrders: 8,
    totalSpend: 6800,
    loyaltyPoints: 180,
    favouriteRestaurant: "Burger Hub",
    joinedDate: "2025-06-10",
    lastActive: "5 days ago",
  },
];

export const ADMIN_SUBSCRIPTIONS: AdminSubscription[] = [
  {
    id: "sub-1",
    restaurantName: "The Urban Cafe",
    plan: "Pro",
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    monthlyAmount: 4999,
    paidAmount: 4999,
    nextRenewal: "2026-09-01",
  },
  {
    id: "sub-2",
    restaurantName: "Spice Symphony",
    plan: "Enterprise",
    status: "active",
    startDate: "2025-11-01",
    endDate: "2026-10-31",
    monthlyAmount: 9999,
    paidAmount: 9999,
    nextRenewal: "2026-09-01",
  },
  {
    id: "sub-3",
    restaurantName: "Royal Treat Hotel",
    plan: "Basic",
    status: "trial",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
    monthlyAmount: 1999,
    paidAmount: 0,
    nextRenewal: "2026-08-14",
  },
  {
    id: "sub-4",
    restaurantName: "Italian Corner",
    plan: "Enterprise",
    status: "expired",
    startDate: "2025-02-01",
    endDate: "2026-01-31",
    monthlyAmount: 9999,
    paidAmount: 9999,
    nextRenewal: "N/A",
  },
];

export const ADMIN_PAYMENTS: AdminPaymentTxn[] = [
  {
    id: "txn-1001",
    restaurantName: "The Urban Cafe",
    customerName: "Rahul Sharma",
    amount: 848,
    commission: 84.8,
    gst: 42.4,
    netSettlement: 720.8,
    method: "UPI",
    status: "success",
    date: "2026-08-04",
  },
  {
    id: "txn-1002",
    restaurantName: "Spice Symphony",
    customerName: "Priya Patel",
    amount: 630,
    commission: 63,
    gst: 31.5,
    netSettlement: 535.5,
    method: "Card",
    status: "success",
    date: "2026-08-04",
  },
  {
    id: "txn-1003",
    restaurantName: "Burger Hub",
    customerName: "Vikram Malhotra",
    amount: 420,
    commission: 42,
    gst: 21,
    netSettlement: 357,
    method: "Wallet",
    status: "refunded",
    date: "2026-08-03",
  },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TKT-4001",
    customerName: "Rahul Sharma",
    restaurantName: "The Urban Cafe",
    subject: "Order not delivered — charged",
    category: "Order",
    status: "open",
    priority: "High",
    assignedTo: "Unassigned",
    createdAt: "2026-08-04T14:22:00Z",
    updatedAt: "2026-08-04T14:22:00Z",
  },
  {
    id: "TKT-4002",
    customerName: "Priya Patel",
    restaurantName: "Spice Symphony",
    subject: "Refund not received after cancellation",
    category: "Payment",
    status: "in_progress",
    priority: "Critical",
    assignedTo: "Agent Meera",
    createdAt: "2026-08-03T09:00:00Z",
    updatedAt: "2026-08-04T10:30:00Z",
  },
  {
    id: "TKT-4003",
    customerName: "Vikram Malhotra",
    restaurantName: "Burger Hub",
    subject: "QR code not scanning at table",
    category: "Technical",
    status: "resolved",
    priority: "Medium",
    assignedTo: "Agent Rohit",
    createdAt: "2026-08-02T16:00:00Z",
    updatedAt: "2026-08-03T11:00:00Z",
  },
];
