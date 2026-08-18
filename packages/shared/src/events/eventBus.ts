/**
 * Food Mania — Mock Event Bus (Socket.IO Ready Architecture)
 * 
 * Uses BroadcastChannel and in-memory listeners to broadcast real-time events
 * across browser tabs and ports (Customer :3000 <-> Business :3001 <-> Admin :3002).
 */

export type OrderStatus = "placed" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";

export type BookingStatus = "pending" | "confirmed" | "rejected" | "arrived" | "completed" | "cancelled";

export type ServiceRequestType = "waiter" | "water" | "tissue" | "cleaning" | "bill";

export type EventType =
  | "ORDER_CREATED"
  | "ORDER_ACCEPTED"
  | "ORDER_PREPARING"
  | "ORDER_READY"
  | "ORDER_COMPLETED"
  | "ORDER_CANCELLED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "BOOKING_CREATED"
  | "BOOKING_ACCEPTED"
  | "BOOKING_REJECTED"
  | "BOOKING_ARRIVED"
  | "BOOKING_COMPLETED"
  | "BOOKING_CANCELLED"
  | "WAITER_CALL_CREATED"
  | "SERVICE_REQUEST_CREATED"
  | "BILL_REQUEST_CREATED";

export interface OrderPayload {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    isVeg: boolean;
  }>;
  totalAmount: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPayload {
  bookingId: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  tableNumber: string;
  seatingPreference: "Indoor" | "Outdoor" | "Window" | "Rooftop" | "Family" | "AC";
  occasion?: string;
  specialRequest?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestPayload {
  requestId: string;
  restaurantId: string;
  restaurantName: string;
  tableNumber: string;
  type: ServiceRequestType;
  note?: string;
  status: "pending" | "acknowledged" | "resolved";
  createdAt: string;
}

export interface EventMessage {
  type: EventType;
  payload: OrderPayload | BookingPayload | ServiceRequestPayload | any;
  timestamp: string;
}

type EventListener = (event: EventMessage) => void;

class EventBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<EventType, Set<EventListener>> = new Map();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("food-mania-realtime-bus");
      this.channel.onmessage = (e: MessageEvent<EventMessage>) => {
        this.dispatchLocal(e.data);
      };
    }
  }

  public subscribe(eventType: EventType | "*", callback: EventListener): () => void {
    const key = eventType as EventType;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  public publish(type: EventType, payload: any): void {
    const message: EventMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Broadcast across browser windows & ports
    if (this.channel) {
      this.channel.postMessage(message);
    }

    // Dispatch locally in current window
    this.dispatchLocal(message);
  }

  private dispatchLocal(message: EventMessage): void {
    // Specific event listeners
    const specificListeners = this.listeners.get(message.type);
    if (specificListeners) {
      specificListeners.forEach((fn) => fn(message));
    }

    // Wildcard listeners
    const wildcardListeners = this.listeners.get("*" as EventType);
    if (wildcardListeners) {
      wildcardListeners.forEach((fn) => fn(message));
    }
  }
}

export const eventBus = new EventBus();
