// Food Mania Monorepo REST API Client
// Connects Customer App, Business Panel, and Admin Panel to http://localhost:4000

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && !host.startsWith("192.168.")) {
      return "https://thousands-saskatchewan-queensland-intl.trycloudflare.com";
    }
  }
  return "http://localhost:4000";
}

export const API_BASE_URL = getApiBaseUrl();

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[API Client Warning] ${options?.method || "GET"} ${url} failed with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  } catch (err) {
    console.error(`[API Client Network Error] ${url}:`, err);
    throw err;
  }
}

// ─── Authentication API ──────────────────────────────────────────────────────
export async function authRegister(registerData: any) {
  return apiFetch<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify(registerData),
  });
}

export async function authLogin(credentials: any) {
  return apiFetch<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function authGetMe(token: string) {
  return apiFetch<any>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Restaurants API ────────────────────────────────────────────────────────
export async function getBackendRestaurants(search?: string, city?: string) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (city && city !== "All") query.append("city", city);
  const qStr = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<any[]>(`/restaurants${qStr}`);
}

export async function getBackendRestaurantById(idOrSlug: string) {
  return apiFetch<any>(`/restaurants/${idOrSlug}`);
}

export async function getBackendRestaurantMenu(id: string) {
  return apiFetch<any[]>(`/restaurants/${id}/menu`);
}

export async function postBackendMenuCategory(restaurantId: string, name: string) {
  return apiFetch<any>(`/restaurants/${restaurantId}/categories`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function postBackendMenuItem(restaurantId: string, itemData: any) {
  return apiFetch<any>(`/restaurants/${restaurantId}/items`, {
    method: "POST",
    body: JSON.stringify(itemData),
  });
}

export async function patchBackendMenuItem(itemId: string, itemData: any) {
  return apiFetch<any>(`/restaurants/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(itemData),
  });
}


// ─── Table Bookings API ──────────────────────────────────────────────────────
export async function postBackendBooking(bookingData: {
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestCount: number;
  bookingDate: string;
  timeSlot: string;
  tableId?: string;
  userId?: string;
}) {
  return apiFetch<any>("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

export async function getBackendBookings(restaurantId?: string) {
  const qStr = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : "";
  return apiFetch<any[]>(`/bookings${qStr}`);
}

export async function patchBackendBookingStatus(id: string, status: string) {
  return apiFetch<any>(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Orders API ──────────────────────────────────────────────────────────────
export async function postBackendOrder(orderData: {
  restaurantId: string;
  totalAmount: number;
  items: Array<{ menuItemId: string; quantity: number; price: number }>;
  userId?: string;
  tableId?: string;
  paymentMethod?: string;
}) {
  return apiFetch<any>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getBackendOrders(restaurantId?: string) {
  const qStr = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : "";
  return apiFetch<any[]>(`/orders${qStr}`);
}

export async function patchBackendOrderStatus(id: string, status: string) {
  return apiFetch<any>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Reviews API ─────────────────────────────────────────────────────────────
export async function postBackendReview(reviewData: {
  restaurantId: string;
  rating: number;
  comment?: string;
  userId?: string;
}) {
  return apiFetch<any>("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function getBackendReviews(restaurantId: string) {
  return apiFetch<any[]>(`/reviews?restaurantId=${encodeURIComponent(restaurantId)}`);
}

// ─── Super Admin API ─────────────────────────────────────────────────────────
export async function getAdminUsers() {
  return apiFetch<any[]>("/admin/users");
}

export async function getAdminRestaurants() {
  return apiFetch<any[]>("/admin/restaurants");
}

export async function postAdminRestaurant(restaurantData: any) {
  return apiFetch<any>("/admin/restaurants", {
    method: "POST",
    body: JSON.stringify(restaurantData),
  });
}

export async function patchAdminRestaurant(id: string, restaurantData: any) {
  return apiFetch<any>(`/admin/restaurants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(restaurantData),
  });
}

export async function getAdminSubscriptions() {
  return apiFetch<any[]>("/admin/subscriptions");
}

export async function getAdminAnalytics() {
  return apiFetch<any>("/admin/analytics");
}

// ─── Payments API ────────────────────────────────────────────────────────────
export async function getBackendPaymentById(id: string, token?: string) {
  return apiFetch<any>(`/payments/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getBackendPaymentByOrder(orderId: string, token?: string) {
  return apiFetch<any>(`/payments/order/${orderId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getBackendPaymentsList(restaurantId?: string, token?: string) {
  const qStr = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : "";
  return apiFetch<any[]>(`/payments${qStr}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
