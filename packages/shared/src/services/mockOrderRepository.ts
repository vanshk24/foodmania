import { eventBus, OrderPayload, OrderStatus } from "../events/eventBus";

const STORAGE_KEY = "food_mania_orders_db_v1";

const INITIAL_MOCK_ORDERS: OrderPayload[] = [
  {
    orderId: "FM-9082",
    restaurantId: "the-urban-cafe",
    restaurantName: "The Urban Cafe",
    tableNumber: "Table 04",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    items: [
      { id: "m-1", name: "Truffle Mushroom Pizza", price: 650, quantity: 1, isVeg: true },
      { id: "m-2", name: "Artisanal Cold Brew", price: 240, quantity: 2, isVeg: true },
    ],
    totalAmount: 848,
    status: "preparing",
    specialInstructions: "Less spicy, extra cheese on pizza.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    orderId: "FM-9081",
    restaurantId: "the-urban-cafe",
    restaurantName: "The Urban Cafe",
    tableNumber: "Table 12",
    customerName: "Priya Patel",
    customerPhone: "+91 98123 45678",
    items: [
      { id: "m-4", name: "Avocado Toast Sourdough", price: 380, quantity: 1, isVeg: true },
      { id: "m-5", name: "Iced Caramel Macchiato", price: 220, quantity: 1, isVeg: true },
    ],
    totalAmount: 630,
    status: "accepted",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    orderId: "FM-9080",
    restaurantId: "the-urban-cafe",
    restaurantName: "The Urban Cafe",
    tableNumber: "Table 08",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98999 11223",
    items: [
      { id: "m-6", name: "Wood-Fired Margherita", price: 520, quantity: 1, isVeg: true },
      { id: "m-7", name: "Tiramisu Dessert", price: 280, quantity: 1, isVeg: true },
    ],
    totalAmount: 835,
    status: "completed",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export class MockOrderRepository {
  private getStorage(): OrderPayload[] {
    if (typeof window === "undefined") return INITIAL_MOCK_ORDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
        return INITIAL_MOCK_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  }

  private setStorage(orders: OrderPayload[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }

  public getAllOrders(): OrderPayload[] {
    return this.getStorage();
  }

  public getOrderById(orderId: string): OrderPayload | undefined {
    return this.getStorage().find((o) => o.orderId === orderId);
  }

  public createOrder(order: Omit<OrderPayload, "orderId" | "createdAt" | "updatedAt">): OrderPayload {
    const orders = this.getStorage();
    const newOrder: OrderPayload = {
      ...order,
      orderId: `FM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    this.setStorage(orders);

    // Also post to backend REST API
    try {
      fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: newOrder.restaurantId,
          totalAmount: newOrder.totalAmount,
          items: newOrder.items.map((i) => ({
            menuItemId: i.id || "item-101",
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      }).catch((e) => console.warn("Backend order POST warning:", e.message));
    } catch (e) {
      console.warn("Backend order sync error:", e);
    }

    // Emit ORDER_CREATED Event via EventBus
    eventBus.publish("ORDER_CREATED", newOrder);

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): OrderPayload | undefined {
    const orders = this.getStorage();
    const target = orders.find((o) => o.orderId === orderId);
    if (!target) return undefined;

    target.status = status;
    target.updatedAt = new Date().toISOString();
    this.setStorage(orders);

    // Also patch status to backend REST API
    try {
      fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase() }),
      }).catch((e) => console.warn("Backend order PATCH warning:", e.message));
    } catch (e) {
      console.warn("Backend order status patch error:", e);
    }

    const eventTypeMap: Record<OrderStatus, any> = {
      placed: "ORDER_CREATED",
      accepted: "ORDER_ACCEPTED",
      preparing: "ORDER_PREPARING",
      ready: "ORDER_READY",
      completed: "ORDER_COMPLETED",
      cancelled: "ORDER_CANCELLED",
    };

    // Emit status change event via EventBus
    eventBus.publish(eventTypeMap[status], target);

    return target;
  }
}

export const mockOrderRepo = new MockOrderRepository();

