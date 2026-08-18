# Food Mania — Payment API Contract & Architecture Specification

## 1. Architecture Decision: Option A (Order First → Payment Pending → Gateway Verification)

### Architectural Flow:
```
Customer Portal                Backend API (Express/Prisma)         Razorpay Gateway
      │                                     │                              │
      │── 1. POST /orders ─────────────────>│                              │
      │      (items & quantities)           │ (Authoritative DB prices)     │
      │                                     │ (Create Order & Payment row) │
      │<── 2. Order (PENDING_PAYMENT) ──────│                              │
      │                                     │                              │
      │── 3. POST /payments/create ────────>│                              │
      │                                     │── 4. Create Gateway Order ──>│
      │<── 5. Razorpay Order ID & Key ──────│<── 6. order_xyz123 ──────────│
      │                                     │                              │
      │── 7. Open Razorpay Modal ─────────────────────────────────────────>│
      │<── 8. payment_id & signature ──────────────────────────────────────│
      │                                     │                              │
      │── 9. POST /payments/verify ────────>│                              │
      │      (gateway signature payload)    │ (HMAC SHA-256 validation)    │
      │                                     │ (Payment -> SUCCESS)         │
      │                                     │ (Order -> PAID)              │
      │<── 10. Payment & Order Confirmed ───│                              │
```

### Rationale:
1. **Consistency with Monorepo Architecture**: Orders in Food Mania represent physical table dining or takeaway. The order number (`ORD-XXXXXX`), kitchen display (KDS), and reservation linkages belong to the core `Order` entity.
2. **Authoritative Server Pricing**: The backend calculates subtotal and totals from PostgreSQL `MenuItem.price` tables, eliminating client-side price tampering.
3. **Razorpay Standard Mapping**: Razorpay's native order checkout (`razorpay.orders.create` followed by signature verification on capture) mirrors this exact two-phase pattern.
4. **Idempotency & Replay Protection**: Each payment attempt is linked to the order via `Payment.orderId` and `Payment.gatewayOrderId`, guarding against duplicate charge confirmations.

---

## 2. Payment Lifecycle States

### Order `paymentStatus`:
- `PENDING_PAYMENT`: Order created, awaiting customer transaction.
- `PAYMENT_PROCESSING`: Customer opened gateway modal or webhook transaction in flight.
- `PAID`: Payment signature cryptographically verified by server.
- `PAYMENT_FAILED`: Payment failed or timed out.
- `REFUNDED`: Admin processed refund reversal.

### Payment `status`:
- `PENDING`: Initial record generated on order placement.
- `PROCESSING`: Gateway order created / transaction in progress.
- `SUCCESS`: Verified and captured.
- `FAILED`: Declined by bank or cancelled.
- `REFUNDED`: Returned to original payment method.

---

## 3. Endpoints Contract (Phase 6.2 Target)

### A. Create Gateway Order
- **Endpoint**: `POST /payments/create`
- **Auth**: Customer (`Bearer <JWT>`)
- **Request Body**:
```json
{
  "orderId": "uuid-order-id",
  "method": "UPI" // "UPI" | "CARD" | "NETBANKING" | "WALLET"
}
```
- **Response (201)**:
```json
{
  "status": "ok",
  "data": {
    "paymentId": "uuid-payment-id",
    "orderId": "uuid-order-id",
    "amount": 1200,
    "currency": "INR",
    "gatewayOrderId": "order_Hk82bNd9s82Lsk",
    "keyId": "rzp_test_..."
  }
}
```

### B. Verify Gateway Payment
- **Endpoint**: `POST /payments/verify`
- **Auth**: Customer (`Bearer <JWT>`)
- **Request Body**:
```json
{
  "orderId": "uuid-order-id",
  "razorpayOrderId": "order_Hk82bNd9s82Lsk",
  "razorpayPaymentId": "pay_Hk83xZ92js81Ks",
  "razorpaySignature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
- **Response (200)**:
```json
{
  "status": "ok",
  "message": "Payment verified successfully",
  "data": {
    "orderId": "uuid-order-id",
    "orderNumber": "ORD-758647",
    "paymentStatus": "PAID",
    "paymentId": "uuid-payment-id",
    "amount": 1200
  }
}
```

### C. Webhook Listener
- **Endpoint**: `POST /payments/webhook`
- **Auth**: Header `x-razorpay-signature` validated with `RAZORPAY_WEBHOOK_SECRET`
- **Events Handled**:
  - `payment.captured`: Sync Order to `PAID` and Payment to `SUCCESS`.
  - `payment.failed`: Sync Order to `PAYMENT_FAILED` and record `failureReason`.
  - `refund.processed`: Sync Payment to `REFUNDED` and notify customer.

### D. Get Payment Details
- **Endpoint**: `GET /payments/:id`
- **Auth**: Bearer token (Customer owner, Restaurant owner, or Super Admin)
- **Response (200)**: Full payment record with authoritative order details.

### E. Process Refund
- **Endpoint**: `POST /payments/refund`
- **Auth**: Super Admin only (`role: SUPER_ADMIN`)
- **Request Body**:
```json
{
  "paymentId": "uuid-payment-id",
  "amount": 1200,
  "reason": "Customer cancellation / service issue"
}
```
