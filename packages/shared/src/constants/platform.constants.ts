/**
 * Food Mania — Platform-wide constants.
 *
 * All magic numbers, string literals, and configuration constants
 * that are referenced across multiple apps are centralized here.
 * This prevents drift and makes updates atomic.
 */

// ─── App Identity ─────────────────────────────────────────────────────────────
export const APP_NAME = "Food Mania" as const;
export const APP_TAGLINE = "Scan. Order. Enjoy." as const;
export const APP_DOMAIN = "foodmania.com" as const;

// ─── Application URLs ─────────────────────────────────────────────────────────
export const APP_URLS = {
  CUSTOMER: "https://foodmania.com",
  BUSINESS: "https://business.foodmania.com",
  ADMIN: "https://admin.foodmania.com",
} as const;

// ─── API ──────────────────────────────────────────────────────────────────────
export const API_VERSION = "v1" as const;
export const API_TIMEOUT_MS = 15_000;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Authentication ───────────────────────────────────────────────────────────
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300;       // 5 minutes
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_BLOCK_DURATION_MINUTES = 10;
export const SESSION_EXPIRY_DAYS = 30;
export const GUEST_SESSION_EXPIRY_HOURS = 4;

// ─── Reservation Rules ────────────────────────────────────────────────────────
export const RESERVATION_SLOT_HOLD_MINUTES = 5;     // Slot locked on form open
export const RESERVATION_GRACE_PERIOD_MINUTES = 15; // Before auto-release
export const RESERVATION_REMINDER_HOURS_24 = 24;
export const RESERVATION_REMINDER_HOURS_2 = 2;
export const WAITLIST_NOTIFICATION_SMS_DELAY_SEC = 30;

// ─── QR Code ──────────────────────────────────────────────────────────────────
export const QR_URL_PATH = "/qr" as const;
export const QR_HMAC_ALGORITHM = "SHA-256" as const;

// ─── Order Lifecycle ──────────────────────────────────────────────────────────
export const PAYMENT_TIMEOUT_SECONDS = 30;
export const PAYMENT_POLL_INTERVAL_MS = 3_000;
export const ORDER_MODIFICATION_CUTOFF_STATUS = "PREPARING"; // Orders beyond this status cannot be modified

// ─── KDS Timers ───────────────────────────────────────────────────────────────
export const KDS_TIMER_WARN_MINUTES = 10;
export const KDS_TIMER_CRITICAL_MINUTES = 20;

// ─── Subscription & Billing ───────────────────────────────────────────────────
export const FREE_TRIAL_DAYS = 14;
export const SUBSCRIPTION_GRACE_PERIOD_DAYS = 7;
export const SUBSCRIPTION_EXPIRY_REMINDER_DAYS = [7, 3, 1];

// ─── File Upload ──────────────────────────────────────────────────────────────
export const MAX_UPLOAD_SIZE_MB = 5;
export const MAX_RESTAURANT_PHOTOS = 10;
export const MIN_RESTAURANT_PHOTOS = 3;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;

// ─── Notification Channels ────────────────────────────────────────────────────
export const WHATSAPP_FALLBACK_DELAY_SEC = 30;

// ─── Table Configuration ──────────────────────────────────────────────────────
export const MAX_GUESTS_PER_TABLE = 20;
export const MIN_GUESTS_PER_TABLE = 1;
