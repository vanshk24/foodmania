import { eventBus, BookingPayload, BookingStatus } from "../events/eventBus";

const STORAGE_KEY = "food_mania_bookings_db_v1";
const TABLES_STORAGE_KEY = "food_mania_tables_db_v1";

export type TableStatus = "available" | "reserved" | "occupied" | "selected" | "cleaning";

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  section: "Indoor" | "Outdoor" | "Window" | "Rooftop" | "Family" | "AC";
  status: TableStatus;
  currentBookingId?: string | undefined;
}

// Generate 30 Tables with diverse seating options
const INITIAL_MOCK_TABLES: RestaurantTable[] = Array.from({ length: 30 }, (_, i) => {
  const num = i + 1;
  const section: RestaurantTable["section"] =
    num <= 8 ? "Indoor" : num <= 14 ? "Outdoor" : num <= 20 ? "Rooftop" : num <= 25 ? "Window" : "Family";
  const capacity = num % 4 === 0 ? 6 : num % 2 === 0 ? 4 : 2;

  // Set default initial table states for realistic demo
  let status: TableStatus = "available";
  let currentBookingId: string | undefined = undefined;
  if (num === 4) { status = "reserved"; currentBookingId = "BK-8401"; }
  if (num === 12) { status = "occupied"; currentBookingId = "BK-8402"; }
  if (num === 18) { status = "reserved"; }

  return {
    id: `tbl-${num}`,
    tableNumber: `Table ${num < 10 ? "0" + num : num}`,
    capacity,
    section,
    status,
    currentBookingId,
  };
});

const INITIAL_MOCK_BOOKINGS: BookingPayload[] = [
  {
    bookingId: "BK-8401",
    restaurantId: "the-urban-cafe",
    restaurantName: "The Urban Cafe",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    guestCount: 4,
    date: new Date().toISOString().split("T")[0]!,
    timeSlot: "07:30 PM",
    tableNumber: "Table 04",
    seatingPreference: "Rooftop",
    occasion: "Birthday Party",
    specialRequest: "Need candles on table and quiet corner.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    bookingId: "BK-8402",
    restaurantId: "the-urban-cafe",
    restaurantName: "The Urban Cafe",
    customerName: "Priya Patel",
    customerPhone: "+91 98123 45678",
    guestCount: 2,
    date: new Date().toISOString().split("T")[0]!,
    timeSlot: "08:00 PM",
    tableNumber: "Table 12",
    seatingPreference: "Window",
    occasion: "Anniversary",
    specialRequest: "Window side seating requested.",
    status: "arrived",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export class MockBookingRepository {
  private getTablesStorage(): RestaurantTable[] {
    if (typeof window === "undefined") return INITIAL_MOCK_TABLES;
    try {
      const data = localStorage.getItem(TABLES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_TABLES));
        return INITIAL_MOCK_TABLES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_TABLES;
    }
  }

  private setTablesStorage(tables: RestaurantTable[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(tables));
    } catch (e) {
      console.error("Failed to save tables:", e);
    }
  }

  private getBookingsStorage(): BookingPayload[] {
    if (typeof window === "undefined") return INITIAL_MOCK_BOOKINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BOOKINGS));
        return INITIAL_MOCK_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_BOOKINGS;
    }
  }

  private setBookingsStorage(bookings: BookingPayload[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings:", e);
    }
  }

  public getAllTables(): RestaurantTable[] {
    return this.getTablesStorage();
  }

  public getAllBookings(): BookingPayload[] {
    return this.getBookingsStorage();
  }

  public getBookingById(bookingId: string): BookingPayload | undefined {
    return this.getBookingsStorage().find((b) => b.bookingId === bookingId);
  }

  public createBooking(booking: Omit<BookingPayload, "bookingId" | "createdAt" | "updatedAt" | "status">): BookingPayload {
    const bookings = this.getBookingsStorage();
    const newBooking: BookingPayload = {
      ...booking,
      bookingId: `BK-${Math.floor(8000 + Math.random() * 1000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    this.setBookingsStorage(bookings);

    // Reserve assigned table in Table layout
    const tables = this.getTablesStorage();
    const targetTable = tables.find((t) => t.tableNumber === booking.tableNumber);
    if (targetTable) {
      targetTable.status = "reserved";
      targetTable.currentBookingId = newBooking.bookingId;
      this.setTablesStorage(tables);
    }

    // Publish event over EventBus
    // Also post to backend REST API
    try {
      fetch("http://localhost:4000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: newBooking.restaurantId,
          guestName: newBooking.customerName,
          guestPhone: newBooking.customerPhone,
          guestCount: newBooking.guestCount,
          bookingDate: newBooking.date,
          timeSlot: newBooking.timeSlot,
        }),
      }).catch((e) => console.warn("Backend booking POST warning:", e.message));
    } catch (e) {
      console.warn("Backend sync warning:", e);
    }

    eventBus.publish("BOOKING_CREATED", newBooking);
    return newBooking;
  }

  public updateBookingStatus(bookingId: string, status: BookingStatus): BookingPayload | undefined {
    const bookings = this.getBookingsStorage();
    const target = bookings.find((b) => b.bookingId === bookingId);
    if (!target) return undefined;

    target.status = status;
    target.updatedAt = new Date().toISOString();
    this.setBookingsStorage(bookings);

    // Also patch to backend REST API
    try {
      fetch(`http://localhost:4000/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase() }),
      }).catch((e) => console.warn("Backend booking PATCH warning:", e.message));
    } catch (e) {
      console.warn("Backend sync warning:", e);
    }

    // Auto Table State Synchronization Rules
    const tables = this.getTablesStorage();
    const targetTable = tables.find((t) => t.tableNumber === target.tableNumber);
    if (targetTable) {
      if (status === "confirmed") targetTable.status = "reserved";
      if (status === "arrived") targetTable.status = "occupied";
      if (status === "completed") targetTable.status = "available";
      if (status === "rejected" || status === "cancelled") targetTable.status = "available";
      this.setTablesStorage(tables);
    }

    const eventTypeMap: Record<BookingStatus, any> = {
      pending: "BOOKING_CREATED",
      confirmed: "BOOKING_ACCEPTED",
      rejected: "BOOKING_REJECTED",
      arrived: "BOOKING_ARRIVED",
      completed: "BOOKING_COMPLETED",
      cancelled: "BOOKING_CANCELLED",
    };

    // Publish status event via EventBus
    eventBus.publish(eventTypeMap[status], target);

    return target;
  }
}

export const mockBookingRepo = new MockBookingRepository();

