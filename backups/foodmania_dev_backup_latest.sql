--
-- PostgreSQL database dump
--

\restrict mZl5npLxbyr8saiX5P0F9hSiIwUXwjOIHrpSUFQmeaNqBMtsDlbwyEwXNLxfd4T

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "bookingCode" text NOT NULL,
    "guestName" text NOT NULL,
    "guestPhone" text NOT NULL,
    "guestCount" integer NOT NULL,
    "bookingDate" timestamp(3) without time zone NOT NULL,
    "timeSlot" text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "restaurantId" text NOT NULL,
    "tableId" text,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    "discountPercent" double precision NOT NULL,
    "maxDiscount" double precision,
    "minOrderAmount" double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "restaurantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO postgres;

--
-- Name: MenuCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenuCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "restaurantId" text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MenuCategory" OWNER TO postgres;

--
-- Name: MenuItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenuItem" (
    id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    description text,
    "imageUrl" text,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "categoryId" text NOT NULL,
    "restaurantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MenuItem" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'INFO'::text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "userId" text,
    "restaurantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "totalAmount" double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "paymentStatus" text DEFAULT 'PENDING_PAYMENT'::text NOT NULL,
    "restaurantId" text NOT NULL,
    "userId" text,
    "tableId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customerName" text,
    "customerPhone" text,
    "deliveryAddress" text,
    "paymentMethod" text DEFAULT 'CARD'::text NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "menuItemId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    amount double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    method text DEFAULT 'CARD'::text NOT NULL,
    "restaurantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    "failureReason" text,
    "gatewayOrderId" text,
    "gatewayPaymentId" text,
    "gatewaySignature" text,
    "userId" text
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Restaurant" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    city text NOT NULL,
    address text,
    phone text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "bannerUrl" text,
    code text,
    cuisine text DEFAULT 'Multi-Cuisine'::text,
    "deliveryFee" double precision DEFAULT 40 NOT NULL,
    "imageUrl" text,
    "minOrder" double precision DEFAULT 200 NOT NULL,
    rating double precision DEFAULT 4.5 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Restaurant" OWNER TO postgres;

--
-- Name: RestaurantOwner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RestaurantOwner" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    "restaurantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RestaurantOwner" OWNER TO postgres;

--
-- Name: RestaurantTable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RestaurantTable" (
    id text NOT NULL,
    "tableNumber" text NOT NULL,
    capacity integer DEFAULT 4 NOT NULL,
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    "restaurantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RestaurantTable" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "restaurantId" text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customerName" text
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    plan text DEFAULT 'BASIC'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "monthlyAmount" double precision NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "restaurantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    phone text,
    password text,
    role text DEFAULT 'CUSTOMER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "is2FAEnabled" boolean DEFAULT false NOT NULL,
    "restaurantCode" text,
    "restaurantId" text,
    "twoFactorSecret" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "bookingCode", "guestName", "guestPhone", "guestCount", "bookingDate", "timeSlot", status, "restaurantId", "tableId", "userId", "createdAt", "updatedAt") FROM stdin;
e0cbc4bb-552c-46e9-847f-f5baeff2f8c1	BK-42453	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-10 08:31:59.817	2026-08-10 08:31:59.847
a907f303-11dc-463d-9ff7-4d83616ca377	BK-25650	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	t-01	u-customer-1	2026-08-11 12:17:52.934	2026-08-11 12:17:52.991
83fb6393-94cf-4012-99fb-3ba5de795a30	BK-87121	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	CANCELLED	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	t-01	u-customer-1	2026-08-10 08:35:28.259	2026-08-10 08:35:28.416
d4fd4caf-cd71-4300-9424-86514736d3f9	BK-73468	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	d8ac74ce-3bff-44b1-b0f8-f82507550503	t-01	u-customer-1	2026-08-10 08:36:19.811	2026-08-10 08:36:19.842
ef15e5cd-fb28-4fb3-805b-3fb484269d71	BK-45890	Gaurav Sharma	+91 98765 43210	4	2026-08-07 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 08	\N	2026-08-07 12:30:44.073	2026-08-15 22:09:52.34
a562e0e3-b14e-4d50-bf6f-66e2f5bf4304	BK-92716	Gaurav Sharma	+91 98765 43210	4	2026-08-10 00:00:00	07:30 PM	PENDING	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	Table 06	\N	2026-08-10 08:52:26.54	2026-08-10 08:52:26.54
688a3c14-686a-4510-b843-dd6e9114f11c	BK-32038	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-11 12:40:09.562	2026-08-11 12:40:09.592
47087d01-9197-4723-aaa0-9839245fea33	BK-28787	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	52ba7639-afe8-48bb-a354-8c9541038a58	t-01	u-customer-1	2026-08-11 06:46:27.115	2026-08-11 06:46:27.151
fc96e707-2671-4f00-8a53-a9c2554247cc	BK-74958	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-11 07:26:45	2026-08-11 07:26:45.035
0aa7c597-954e-4aaf-9ffc-41ccb59159fb	BK-70664	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	00e53d62-c8ff-4438-8c9d-779a77b48e53	t-01	u-customer-1	2026-08-11 07:26:53.711	2026-08-11 07:26:53.737
b18d8952-e78b-4d3d-acd5-33db5eadb938	BK-39199	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	23bbf2b6-56c7-4fe3-9269-651705dac079	t-01	u-customer-1	2026-08-11 12:40:17.611	2026-08-11 12:40:17.642
6f63d1bf-e788-4938-a85d-252d58557157	BK-35244	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-11 11:57:38.085	2026-08-11 11:57:38.133
1b703fcb-e8c4-48fc-a23a-255b6fb0bdc0	BK-48826	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	2c49b364-beeb-4bb4-b348-8ee58317e5cd	t-01	u-customer-1	2026-08-11 11:57:43.65	2026-08-11 11:57:43.698
9ce0c447-caf4-472b-b50d-7f743fcc5bab	BK-95718	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-11 12:17:29.845	2026-08-11 12:17:29.86
237eae59-be28-4ea1-a86c-52e9af34828f	BK-52974	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-12 07:03:48.086	2026-08-12 07:03:48.123
9b35fd92-b696-4246-8b1e-911b36e7c659	BK-62412	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-13 07:03:50.757	2026-08-13 07:03:50.788
95e7f2f0-acb3-45b8-8826-6b400df83e27	BK-48959	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	t-01	u-customer-1	2026-08-12 07:03:53.078	2026-08-12 07:03:53.113
3a0de65a-f1e0-4777-a0ca-821d8ba1561f	BK-97275	Backend Audit Guest	+91 98888 77777	3	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-12 07:10:25.88	2026-08-12 07:10:25.911
74a791e5-31e1-4b6c-b247-85b8ae259d66	BK-24577	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-12 07:11:17.266	2026-08-12 07:11:17.281
037eeaf0-636f-426d-924d-91596a2100e9	BK-71648	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	5ecdc092-c3ed-465d-ad41-1503c75d9e42	t-01	u-customer-1	2026-08-13 07:03:59.171	2026-08-13 07:03:59.194
f6de12a1-2d45-464a-b8dc-d2377f14920d	BK-34879	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	t-01	u-customer-1	2026-08-12 07:11:21.141	2026-08-12 07:11:21.172
4f2e36a9-ba1e-4654-b2ab-154de46ed5d7	BK-86806	Gaurav SharmaGaurav	+91 98765 432109876543210	2	60820-02-19 18:30:00	08:00 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-13 07:20:58.458	2026-08-13 07:29:50.335
c6ff9cbf-777e-4789-ad6c-353b3ad99a29	BK-93318	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-15 07:21:57.149	2026-08-15 07:21:57.188
7eea0deb-8c59-4b2b-bfc3-00c1a4a4943e	BK-85546	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-14 06:32:39.177	2026-08-14 06:32:39.208
c97ad273-fccf-4a5b-a19a-b327418f76a3	BK-12730	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-14 06:41:59.667	2026-08-14 06:41:59.693
8105dbe0-78eb-4aa5-9738-f44e5aa24cc8	BK-60130	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	t-01	u-customer-1	2026-08-14 06:32:46.792	2026-08-14 06:32:46.817
2698aa39-d363-4851-8901-709ab9ee813d	BK-33934	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	8b592d07-b126-4da7-b2ec-7373389fc227	t-01	u-customer-1	2026-08-14 06:42:07.159	2026-08-14 06:42:07.184
d749366a-1f56-4bc5-bcfe-5f0e3ca701f1	BK-65607	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	e5688dbb-23b9-4b99-9df8-3fa867ad307b	t-01	u-customer-1	2026-08-15 07:22:03.225	2026-08-15 07:22:03.256
0561d775-7a69-456f-866e-40699a63f219	BK-86477	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-15 07:51:33.991	2026-08-15 07:51:34.031
26802f2f-f025-4753-8c0b-5112afdeb7d1	BK-33378	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	t-01	u-customer-1	2026-08-15 07:51:38.754	2026-08-15 07:51:38.786
e978132d-f289-4ab5-8285-740676c19cb9	BK-95677	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-15 19:36:29.359	2026-08-15 19:36:29.392
f0ec8018-572b-43da-87d9-d541e62c0ae4	BK-33690	Gaurav SharmaGaurav Sharma	+91 98765 43210+91 98765 43210	2	2026-08-15 00:00:00	08:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 07:54:04.288	2026-08-15 22:09:51.05
cd9c652b-b678-4a9a-8ab6-92bf39433121	BK-18907	Gaurav Sharma	+91 98765 43210	4	2026-08-15 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 07:42:33.727	2026-08-15 22:09:51.23
42c59f4b-1ce2-4285-8969-78ff1b7131e0	BK-76913	Gaurav Sharma	+91 98765 43210	4	2026-08-15 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 07:42:18.707	2026-08-15 22:09:51.415
119a1e00-037d-4c55-adea-c8c246a9f5fa	BK-46647	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-14 06:41:27.111	2026-08-15 22:09:51.602
d0626bd1-a9fb-4825-b0b9-036904810853	BK-30704	ga	9999999999	4	2026-08-12 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-12 07:45:07.56	2026-08-15 22:09:51.779
a458edfa-e568-4924-ad7e-e6bd0708198d	BK-46564	QA Test User	9999999999	2	2026-08-12 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-12 07:44:38.833	2026-08-15 22:09:51.961
bae19f4f-28a6-476c-a48f-8e4a527625e4	BK-57181	Gaurav Sharma	+91 98765 43210	4	2026-08-10 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 02	\N	2026-08-10 08:48:31.663	2026-08-15 22:09:52.151
b-1001	BK-84210	Gaurav Sharma	+91 98765 43210	4	2026-08-07 12:16:09.527	08:00 PM	COMPLETED	the-urban-cafe	t-03	u-customer-1	2026-08-07 12:16:09.529	2026-08-15 22:09:52.524
57d8fe28-a31b-4119-acfb-d8d0c28565a6	BK-63257	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	b8f37817-45f8-4eab-babf-20530fa53e8a	t-01	u-customer-1	2026-08-15 19:36:36.007	2026-08-15 19:36:36.039
31006017-c136-485c-b334-428a42b81405	BK-96010	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-15 20:09:23.709	2026-08-15 20:09:23.742
b562605e-97c9-45c5-a824-3c78b0e39ced	BK-79721	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	9d956e86-2f45-4048-844d-383bd9b52a63	t-01	u-customer-1	2026-08-15 20:09:29.304	2026-08-15 20:09:29.328
83134923-cce8-44b5-978b-87f4fe78d4e3	BK-59467	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-15 20:13:18.864	2026-08-15 20:13:18.915
6ba0e5ce-9722-406f-8528-10f5d3860810	BK-86200	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	t-01	u-customer-1	2026-08-15 20:13:25.609	2026-08-15 20:13:25.624
af912b40-dfbb-4738-8bb1-17c1658a8dc8	BK-31411	Gaurav Sharma	+91 98765 43210	4	2026-08-15 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 21:55:12.92	2026-08-15 22:09:49.779
adecccab-e9ff-452e-9a9f-bda0b4651a9a	BK-97934	Gaurav Sharma	+91 98765 43210	2	2026-08-15 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 20:34:13.965	2026-08-15 22:09:50.519
bde5d046-d94e-40e6-8b3c-72539958f37c	BK-93439	Gaurav Sharma	+91 98765 43210	4	2026-08-15 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 20:30:11.934	2026-08-15 22:09:50.705
5e0bb684-90be-475a-8a40-8b809fb991d2	BK-62920	Gaurav SharmaGaurav Sharma	+91 98765 43210+91 98765 43210	2	60820-02-19 18:30:00	08:30 PM	COMPLETED	the-urban-cafe	Table 04	\N	2026-08-15 19:42:23.602	2026-08-15 22:09:50.884
16e12191-474a-4130-82e4-49f6701986c1	BK-56765	Gaurav Sharma	+91 98765 43210	4	2026-08-15 00:00:00	07:30 PM	PENDING	the-urban-cafe	Table 04	\N	2026-08-15 22:15:42.659	2026-08-15 22:15:42.659
a02c8e23-7116-4475-beb6-70ca3b9a249e	BK-51295	Audit Test User	+91 99999 88888	4	2026-08-25 00:00:00	07:30 PM	COMPLETED	the-urban-cafe	t-01	\N	2026-08-16 07:14:23.445	2026-08-16 07:14:23.476
abd184eb-a3e8-4f38-87e7-e42e2ddec33a	BK-40212	Gaurav Sharma	+91 98765 43210	4	2026-08-20 00:00:00	07:30 PM	COMPLETED	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	t-01	u-customer-1	2026-08-16 07:14:25.3	2026-08-16 07:14:25.326
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Coupon" (id, code, "discountPercent", "maxDiscount", "minOrderAmount", "isActive", "restaurantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MenuCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenuCategory" (id, name, "restaurantId", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cat-starters	Starters & Appetizers	the-urban-cafe	1	2026-08-07 12:16:09.52	2026-08-07 12:16:09.52
cat-mains	Main Course	the-urban-cafe	2	2026-08-07 12:16:09.521	2026-08-07 12:16:09.521
cat-beverages	Beverages & Shakes	the-urban-cafe	3	2026-08-07 12:16:09.522	2026-08-07 12:16:09.522
cat-burgers	Signature Burgers	burger-hub	1	2026-08-07 12:16:09.527	2026-08-07 12:16:09.527
4e183f50-e59e-4ac5-bb35-b626fd364e71	Chef Specials	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	1	2026-08-10 08:17:31.894	2026-08-10 08:17:31.894
77d4e2a3-8ff1-4737-bdfb-f427b190030c	Chef Specials	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	1	2026-08-10 08:35:27.653	2026-08-10 08:35:27.653
ccb3ead6-77c8-43e9-a829-2656c0b22567	Handcrafted Pizzas	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2	2026-08-10 08:35:27.906	2026-08-10 08:35:27.906
1952ba73-adb7-4884-85a2-d11b2cf8dd88	Chef Specials	d8ac74ce-3bff-44b1-b0f8-f82507550503	1	2026-08-10 08:36:19.256	2026-08-10 08:36:19.256
b580caef-3978-4e03-ad5f-0a13c34dfa41	Handcrafted Pizzas	d8ac74ce-3bff-44b1-b0f8-f82507550503	2	2026-08-10 08:36:19.486	2026-08-10 08:36:19.486
b6c6d551-e78e-4bb4-84a1-ba9e2843970d	Chef Specials	52ba7639-afe8-48bb-a354-8c9541038a58	1	2026-08-11 06:46:26.182	2026-08-11 06:46:26.182
e2deef90-8f5e-4e7a-8a86-69bf6cfdbaa9	Handcrafted Pizzas	52ba7639-afe8-48bb-a354-8c9541038a58	2	2026-08-11 06:46:26.708	2026-08-11 06:46:26.708
d050706b-c405-4331-9fab-99abcd29d833	Chef Specials	00e53d62-c8ff-4438-8c9d-779a77b48e53	1	2026-08-11 07:26:52.884	2026-08-11 07:26:52.884
50ca77ac-6a03-4c24-8437-500774b3be5b	Handcrafted Pizzas	00e53d62-c8ff-4438-8c9d-779a77b48e53	2	2026-08-11 07:26:53.265	2026-08-11 07:26:53.265
2b17f899-83c4-4f03-a39e-ca344c9e2f77	Chef Specials	2c49b364-beeb-4bb4-b348-8ee58317e5cd	1	2026-08-11 11:57:42.941	2026-08-11 11:57:42.941
de7b58a2-cf68-40d3-b70b-3e4477ca17c4	Handcrafted Pizzas	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2	2026-08-11 11:57:43.254	2026-08-11 11:57:43.254
84797b28-a454-4661-b698-9513e7307f84	Chef Specials	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	1	2026-08-11 12:17:52.162	2026-08-11 12:17:52.162
0845b4da-5776-461d-8d48-cd0d424dfe5e	Handcrafted Pizzas	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2	2026-08-11 12:17:52.517	2026-08-11 12:17:52.517
43ee0c00-ad07-4046-96c9-c399e0ced31e	Chef Specials	23bbf2b6-56c7-4fe3-9269-651705dac079	1	2026-08-11 12:40:16.768	2026-08-11 12:40:16.768
6bbb7d33-bbe2-4bfa-823e-deca841b81c7	Handcrafted Pizzas	23bbf2b6-56c7-4fe3-9269-651705dac079	2	2026-08-11 12:40:17.148	2026-08-11 12:40:17.148
62a370e0-6b1c-4323-ba20-7930d130a061	Chef Specials	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	1	2026-08-12 07:03:52.471	2026-08-12 07:03:52.471
3bc62d92-fc02-4988-874d-ed81fa34925f	Handcrafted Pizzas	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2	2026-08-12 07:03:52.714	2026-08-12 07:03:52.714
8740263d-c853-4a9a-bf6f-78bd4c05f145	Chef Specials	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	1	2026-08-12 07:11:20.513	2026-08-12 07:11:20.513
3eeff149-054d-4d43-9b6c-d28c9f0172aa	Handcrafted Pizzas	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2	2026-08-12 07:11:20.763	2026-08-12 07:11:20.763
56d793a1-bf1d-4b3a-bd64-f8b0f913c587	Chef Specials	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	1	2026-08-12 07:47:48.455	2026-08-12 07:47:48.455
4424cfd3-5e7e-45c8-aa98-bbc0ffe21298	Chef Specials	5ecdc092-c3ed-465d-ad41-1503c75d9e42	1	2026-08-13 07:03:58.557	2026-08-13 07:03:58.557
731344a4-143e-493f-9d5c-72cf29f6ce14	Handcrafted Pizzas	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2	2026-08-13 07:03:58.823	2026-08-13 07:03:58.823
80d5ea25-83e4-47a6-9ba3-ceaccebb1411	Chef Specials	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	1	2026-08-14 06:32:46.043	2026-08-14 06:32:46.043
4a157d24-76b4-423e-8f90-69775b5f0316	Handcrafted Pizzas	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2	2026-08-14 06:32:46.439	2026-08-14 06:32:46.439
4bbc7387-fbe9-4d4c-b9ca-d2465e17637a	Chef Specials	8b592d07-b126-4da7-b2ec-7373389fc227	1	2026-08-14 06:42:06.52	2026-08-14 06:42:06.52
7c9b37b6-4834-4f3b-87cb-f20ce73d6a67	Handcrafted Pizzas	8b592d07-b126-4da7-b2ec-7373389fc227	2	2026-08-14 06:42:06.835	2026-08-14 06:42:06.835
fe63fc15-cae6-4afb-8dac-a58a1f680812	Chef Specials	e5688dbb-23b9-4b99-9df8-3fa867ad307b	1	2026-08-15 07:22:02.497	2026-08-15 07:22:02.497
e4ffcecd-59a5-49ba-8589-755fe2da4cea	Handcrafted Pizzas	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2	2026-08-15 07:22:02.839	2026-08-15 07:22:02.839
9522a63f-e685-4458-86e9-f2b55502780f	Chef Specials	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	1	2026-08-15 07:51:38.155	2026-08-15 07:51:38.155
1f81bef8-2a55-489f-ac30-09dc550c0c3e	Handcrafted Pizzas	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2	2026-08-15 07:51:38.362	2026-08-15 07:51:38.362
2272c8ab-51fd-49e4-b269-0e7d0d7e7869	Chef Specials	b8f37817-45f8-4eab-babf-20530fa53e8a	1	2026-08-15 19:36:35.371	2026-08-15 19:36:35.371
1080a488-ccd7-42cc-aefe-7f8a0433be4e	Handcrafted Pizzas	b8f37817-45f8-4eab-babf-20530fa53e8a	2	2026-08-15 19:36:35.637	2026-08-15 19:36:35.637
71166911-2131-45c9-8f27-5306c4342346	Chef Specials	9d956e86-2f45-4048-844d-383bd9b52a63	1	2026-08-15 20:09:28.697	2026-08-15 20:09:28.697
6a88232f-5a12-4d73-92cb-6bb2420779fd	Handcrafted Pizzas	9d956e86-2f45-4048-844d-383bd9b52a63	2	2026-08-15 20:09:28.96	2026-08-15 20:09:28.96
47726b77-bd8c-4cec-8273-d408c6fad400	Chef Specials	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	1	2026-08-15 20:13:24.988	2026-08-15 20:13:24.988
cbeefedf-5bb4-4459-8e82-e35d51239637	Handcrafted Pizzas	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2	2026-08-15 20:13:25.254	2026-08-15 20:13:25.254
faf51890-95ce-4d2d-8aa8-db418f19161e	Chef Specials	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	1	2026-08-15 22:05:15.338	2026-08-15 22:05:15.338
5567f359-846a-4718-8216-d3fa823da3f5	Chef Specials	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	1	2026-08-16 07:14:24.691	2026-08-16 07:14:24.691
b60569f4-6f81-4ed2-b048-dfc0e563dc06	Handcrafted Pizzas	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2	2026-08-16 07:14:24.96	2026-08-16 07:14:24.96
\.


--
-- Data for Name: MenuItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenuItem" (id, name, price, description, "imageUrl", "isAvailable", "categoryId", "restaurantId", "createdAt", "updatedAt") FROM stdin;
item-101	Classic Artisan Cappuccino	240	Rich double-shot espresso topped with velvet steamed milk and cocoa dust.	https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500	t	cat-beverages	the-urban-cafe	2026-08-07 12:16:09.523	2026-08-07 12:16:09.523
item-102	Truffle Mushroom Risotto	520	Arborio rice cooked in wild mushroom broth, finished with white truffle oil and aged parmesan.	https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500	t	cat-mains	the-urban-cafe	2026-08-07 12:16:09.524	2026-08-07 12:16:09.524
item-103	Crispy Avocado Bruschetta	360	Toasted sourdough topped with smashed avocado, cherry tomatoes, and balsamic reduction.	https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500	t	cat-starters	the-urban-cafe	2026-08-07 12:16:09.525	2026-08-07 12:16:09.525
item-201	Double Smash Bacon Cheeseburger	390	Two smashed beef patties, crispy bacon, cheddar, grilled onions, and house sauce.	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500	t	cat-burgers	burger-hub	2026-08-07 12:16:09.528	2026-08-07 12:16:09.528
33597539-c286-44ab-b26f-6fdfe35c9173	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	4e183f50-e59e-4ac5-bb35-b626fd364e71	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:31.896	2026-08-10 08:17:31.896
41ce20c3-abe8-4ea9-b59e-884b3ba7298a	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	77d4e2a3-8ff1-4737-bdfb-f427b190030c	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:27.655	2026-08-10 08:35:27.655
13d78bee-6663-4299-ae85-2cd705478b4e	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	d050706b-c405-4331-9fab-99abcd29d833	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:52.887	2026-08-11 07:26:52.887
091b0a50-1320-4e40-a52f-13867b141068	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	1952ba73-adb7-4884-85a2-d11b2cf8dd88	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.257	2026-08-10 08:36:19.257
984e84bb-4d6f-4378-a49a-65445cd4c00d	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	b580caef-3978-4e03-ad5f-0a13c34dfa41	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.562	2026-08-10 08:36:19.562
ede2dc7f-8480-4c47-ac70-0bac0ea3f5e7	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	b6c6d551-e78e-4bb4-84a1-ba9e2843970d	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.185	2026-08-11 06:46:26.185
11d1dc82-b5c0-4ad7-9240-a4c0bbf3a274	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	e2deef90-8f5e-4e7a-8a86-69bf6cfdbaa9	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.817	2026-08-11 06:46:26.817
c53ede2c-5ed8-4867-b47e-2cf908c44544	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	50ca77ac-6a03-4c24-8437-500774b3be5b	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.387	2026-08-11 07:26:53.387
70882ff4-7a96-4dad-a3d5-6fe9fa039c96	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	2b17f899-83c4-4f03-a39e-ca344c9e2f77	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:42.942	2026-08-11 11:57:42.942
5b6910f3-fc6a-4302-a73c-a976729756ab	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	43ee0c00-ad07-4046-96c9-c399e0ced31e	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:16.769	2026-08-11 12:40:16.769
36e209d9-8e05-46be-9214-cecd8e4a09bb	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	de7b58a2-cf68-40d3-b70b-3e4477ca17c4	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.351	2026-08-11 11:57:43.351
9a14544e-99ad-415d-bb24-d35aacdcdaba	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	84797b28-a454-4661-b698-9513e7307f84	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.163	2026-08-11 12:17:52.163
7fb00dc4-e2d6-4746-9588-240c2dcf25e0	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	0845b4da-5776-461d-8d48-cd0d424dfe5e	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.629	2026-08-11 12:17:52.629
f8e2b6fe-3c26-408f-8c26-270d60d6f3bb	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	62a370e0-6b1c-4323-ba20-7930d130a061	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.472	2026-08-12 07:03:52.472
7f314972-2268-41a3-b4f1-8399ab758b21	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	6bbb7d33-bbe2-4bfa-823e-deca841b81c7	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.257	2026-08-11 12:40:17.257
b768def3-1c0c-4b3b-9964-93a2b69cee1d	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	3bc62d92-fc02-4988-874d-ed81fa34925f	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.794	2026-08-12 07:03:52.794
b0fc17ca-a3b4-4575-8c4f-2d726a3e52b3	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	8740263d-c853-4a9a-bf6f-78bd4c05f145	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.515	2026-08-12 07:11:20.515
2e729434-1148-440b-94c4-acadddd16a25	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	3eeff149-054d-4d43-9b6c-d28c9f0172aa	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.846	2026-08-12 07:11:20.846
72a94e07-6874-4b89-98b0-8d879aae8445	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	56d793a1-bf1d-4b3a-bd64-f8b0f913c587	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	2026-08-12 07:47:48.456	2026-08-12 07:47:48.456
item-104	Smoked Salmon Bagel	480	Fresh Norwegian smoked salmon, cream cheese, capers, and red onion on toasted sesame bagel.	https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500	f	cat-starters	the-urban-cafe	2026-08-07 12:16:09.526	2026-08-14 07:14:15.409
37c90fa4-5708-4911-bc3c-be54424db002	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	4424cfd3-5e7e-45c8-aa98-bbc0ffe21298	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:58.559	2026-08-13 07:03:58.559
8d77c7e0-4fbf-4613-abca-5c387848e28f	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	e4ffcecd-59a5-49ba-8589-755fe2da4cea	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:02.946	2026-08-15 07:22:02.946
ee7f95b0-ed52-4bb8-9ffd-13141a32f223	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	731344a4-143e-493f-9d5c-72cf29f6ce14	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:58.912	2026-08-13 07:03:58.912
e739eb94-35ab-4865-b96d-7e1a63646cf2	Garlic Bread	150	Warm garlic bread toasted with herbs and olive oil.	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400	t	cat-starters	the-urban-cafe	2026-08-13 07:28:29.615	2026-08-13 07:28:54.709
26437479-e589-4d75-8df7-f277af67b412	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	80d5ea25-83e4-47a6-9ba3-ceaccebb1411	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.046	2026-08-14 06:32:46.046
0ab01fe1-e5ab-4d04-a269-2af770d930c8	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	4a157d24-76b4-423e-8f90-69775b5f0316	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.539	2026-08-14 06:32:46.539
01adfd97-272b-4560-8d51-89a2a64bf37b	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	9522a63f-e685-4458-86e9-f2b55502780f	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.156	2026-08-15 07:51:38.156
53ac853c-7f5d-4d65-89bb-b3b16792839b	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	4bbc7387-fbe9-4d4c-b9ca-d2465e17637a	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:06.521	2026-08-14 06:42:06.521
07cef8e6-537b-4dc4-bd24-1bb7adb0d59e	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	7c9b37b6-4834-4f3b-87cb-f20ce73d6a67	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:06.921	2026-08-14 06:42:06.921
e71f7fce-11ef-4974-9798-e4766c2d60ab	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	1f81bef8-2a55-489f-ac30-09dc550c0c3e	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.469	2026-08-15 07:51:38.469
81430369-4a89-4795-a2f7-763a6a3ccc00	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	fe63fc15-cae6-4afb-8dac-a58a1f680812	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:02.499	2026-08-15 07:22:02.499
ed8216ca-62dd-40be-bbba-1aaac3731852	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	71166911-2131-45c9-8f27-5306c4342346	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:28.698	2026-08-15 20:09:28.698
bd700ea2-055e-4c4e-8007-e07ecdf317db	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	2272c8ab-51fd-49e4-b269-0e7d0d7e7869	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.373	2026-08-15 19:36:35.373
9cdd27d4-5eeb-4321-a8ec-8343f6c94835	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	1080a488-ccd7-42cc-aefe-7f8a0433be4e	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.736	2026-08-15 19:36:35.736
582c67d8-55a8-4fcc-a8d9-9eaeb0d8a524	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	cbeefedf-5bb4-4459-8e82-e35d51239637	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.34	2026-08-15 20:13:25.34
0c3c4352-ebf0-4fdb-af8a-ddd6fdce04f4	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	6a88232f-5a12-4d73-92cb-6bb2420779fd	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.059	2026-08-15 20:09:29.059
2f4cd2f9-bfd5-4de4-a3d1-615586c66cda	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	faf51890-95ce-4d2d-8aa8-db418f19161e	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	2026-08-15 22:05:15.339	2026-08-15 22:05:15.339
dcf04876-8c2d-49ae-a564-671b17cbaa14	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	47726b77-bd8c-4cec-8273-d408c6fad400	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:24.99	2026-08-15 20:13:24.99
997d467e-215c-4c98-9987-87b8cdf52c12	chilly patato	299	chilly patato\ngand jal jaye gi	https://share.google/sT9iJQ3fmXVa928Xf	t	cat-starters	the-urban-cafe	2026-08-15 22:08:12.596	2026-08-15 22:08:12.596
c9a5f7d6-3651-4ca1-86e0-c6f85e76c8c3	Signature House Special	450	Delightful house special recipe prepared with fresh organic ingredients.	https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500	t	5567f359-846a-4718-8216-d3fa823da3f5	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:24.692	2026-08-16 07:14:24.692
d6969698-6989-489d-9e01-24bfb6a66d23	Signature Woodfired Margherita	480	San Marzano tomatoes, buffalo mozzarella, fresh basil.	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500	t	b60569f4-6f81-4ed2-b048-dfc0e563dc06	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.051	2026-08-16 07:14:25.051
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, title, message, type, "isRead", "userId", "restaurantId", "createdAt", "updatedAt") FROM stdin;
b02d61bd-cfac-41bd-9f22-a5b5cb496dc0	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-07 12:30:44.077	2026-08-07 12:30:44.077
0169999f-2df5-42bb-98de-8a4850374666	New Order Received	Order #ORD-676144 placed for ₹1150	ORDER	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:32.05	2026-08-10 08:17:32.05
ff1d8ef5-2a79-46c5-a08c-3248ade07625	Order Status Updated	Order #ORD-676144 status changed to ACCEPTED	ORDER_STATUS	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:32.115	2026-08-10 08:17:32.115
fd5655a1-7356-4ea2-aed5-cb44112b87f0	Order Status Updated	Order #ORD-676144 status changed to PREPARING	ORDER_STATUS	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:32.127	2026-08-10 08:17:32.127
9088c0f5-c47d-43f7-bd54-bad64bf97762	Order Status Updated	Order #ORD-676144 status changed to READY	ORDER_STATUS	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:32.143	2026-08-10 08:17:32.143
f76c8527-9384-44fe-8c25-fffb69ed137f	Order Status Updated	Order #ORD-676144 status changed to DELIVERED	ORDER_STATUS	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:32.158	2026-08-10 08:17:32.158
5cedaa44-5ae9-49b6-8815-fafbfdc4d524	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-10 08:31:59.821	2026-08-10 08:31:59.821
d37c2daf-0a89-44f2-bf23-d25d814f942f	Reservation Status Updated	Booking #BK-42453 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-10 08:31:59.834	2026-08-10 08:31:59.834
4dc200c5-0473-4df9-8617-427f57e088ed	Reservation Status Updated	Booking #BK-42453 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-10 08:31:59.848	2026-08-10 08:31:59.848
67a1eb9f-9dcd-49a2-8948-b86fc22cab53	New Order Received	Order #ORD-818199 placed for ₹600	ORDER	f	\N	the-urban-cafe	2026-08-10 08:31:59.881	2026-08-10 08:31:59.881
0191eebe-44f4-46e6-b5d5-7379ef4c3bac	Order Status Updated	Order #ORD-818199 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-10 08:31:59.964	2026-08-10 08:31:59.964
0008814e-43e4-48ae-9ab3-d0b8259988bb	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-10 08:31:59.981	2026-08-10 08:32:00.141
c8ddfeab-3c8e-487c-8faa-fbd29916e9a8	New Order Received	Order #ORD-300160 placed for ₹960	ORDER	f	\N	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.053	2026-08-10 08:35:28.053
f916ac42-82f2-4baf-9576-9611d2494a92	Order Status Updated	Order #ORD-300160 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.101	2026-08-10 08:35:28.101
925d0288-376f-4440-b8b5-1d374960312d	Order Status Updated	Order #ORD-300160 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.137	2026-08-10 08:35:28.137
76b79b5e-744c-4cd1-bcd9-a6b8f0267559	Order Status Updated	Order #ORD-300160 status changed to READY	ORDER_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.168	2026-08-10 08:35:28.168
668de587-c7d8-4cab-ab5d-46dfab9d1eb6	Order Status Updated	Order #ORD-300160 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.199	2026-08-10 08:35:28.199
d5afd1bd-0697-453c-a1cd-9774329b30ba	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.262	2026-08-10 08:35:28.262
9965a972-4493-4e02-9fe2-b325054d8fb9	Reservation Status Updated	Booking #BK-87121 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.277	2026-08-10 08:35:28.277
4df6e760-095e-40d5-92a5-507849c71480	Reservation Status Updated	Booking #BK-87121 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	t	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.288	2026-08-10 08:35:28.332
9784f0ee-f948-496d-a086-c89effe14f68	Order Status Updated	Order #ORD-300160 status changed to CANCELLED	ORDER_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.366	2026-08-10 08:35:28.366
6e3af1df-703b-4a14-ae7e-3230a18524e6	Reservation Status Updated	Booking #BK-87121 for Gaurav Sharma status changed to CANCELLED	BOOKING_STATUS	f	u-customer-1	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:28.417	2026-08-10 08:35:28.417
12dee0ec-5536-4b3f-b305-16c852c295a5	New Order Received	Order #ORD-684802 placed for ₹960	ORDER	f	\N	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.645	2026-08-10 08:36:19.645
3c0ee729-b0d4-4307-a883-f57d6d339283	Order Status Updated	Order #ORD-684802 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.69	2026-08-10 08:36:19.69
25aab667-4147-499f-9ad2-b68b43a7f424	Order Status Updated	Order #ORD-684802 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.704	2026-08-10 08:36:19.704
30c1d974-f750-44ec-b0d0-909a0b2625b2	Order Status Updated	Order #ORD-684802 status changed to READY	ORDER_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.72	2026-08-10 08:36:19.72
024d6c3a-5c92-4bdb-a199-2174d4ae055a	Order Status Updated	Order #ORD-684802 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.751	2026-08-10 08:36:19.751
49779754-0588-4a44-8437-c895fc8012c5	Reservation Status Updated	Booking #BK-73468 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.828	2026-08-10 08:36:19.828
67f7c832-6ef1-4b00-aba1-156c73bff93f	Reservation Status Updated	Booking #BK-73468 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.843	2026-08-10 08:36:19.843
f0b5f48b-3384-43cb-8857-a63013813470	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.812	2026-08-10 08:36:19.877
215ea5db-933a-4248-8bc0-2bb7627a20b4	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-10 08:48:31.689	2026-08-10 08:48:31.689
35f1fddb-9f1b-4d51-8f5b-674eb86d37ce	Reservation Status Updated	Booking #BK-57181 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-10 08:48:47.917	2026-08-10 08:48:47.917
ec2c1e26-ebea-42cd-9c17-15fe48825bb9	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:52:26.543	2026-08-10 08:52:26.543
eb1d2658-f89a-46f9-bd40-9ecd11eae86f	New Order Received	Order #ORD-822094 placed for ₹960	ORDER	f	\N	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.94	2026-08-11 06:46:26.94
398706b4-1a6e-49f3-b8e0-2b658f4512ce	Order Status Updated	Order #ORD-822094 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.987	2026-08-11 06:46:26.987
8461fa57-d5e3-4622-9679-74a2336302bb	Order Status Updated	Order #ORD-822094 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.022	2026-08-11 06:46:27.022
0e8a2afc-8eba-42df-9b54-ca94416359a2	Order Status Updated	Order #ORD-822094 status changed to READY	ORDER_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.04	2026-08-11 06:46:27.04
d9a91899-5e78-4a2d-bac9-ec35639fdf5f	Order Status Updated	Order #ORD-822094 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.078	2026-08-11 06:46:27.078
800e0f82-2aa1-47c5-9128-b5e64faa6bfe	Reservation Status Updated	Booking #BK-28787 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.129	2026-08-11 06:46:27.129
92a933dd-9064-4735-9a5d-e0dcac21cc3a	Reservation Status Updated	Booking #BK-28787 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.153	2026-08-11 06:46:27.153
bcec9b7b-49d4-4704-a2e6-ae6752b09b81	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:27.118	2026-08-11 06:46:27.177
4640be53-0f35-4700-af99-8add3e9ee413	New Order Received	Order #ORD-181188 placed for ₹848	ORDER	f	\N	the-urban-cafe	2026-08-11 06:59:23.26	2026-08-11 06:59:23.26
73f7bc0c-baad-44b4-a3a1-6e4117f19d7e	Order Status Updated	Order #ORD-181188 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 07:04:15.318	2026-08-11 07:04:15.318
eb46f885-b9cb-459a-b4c6-33727cba1f2c	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-11 07:26:45.003	2026-08-11 07:26:45.003
4e663d51-0e86-42e1-884e-4895c1bedde5	Reservation Status Updated	Booking #BK-74958 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 07:26:45.029	2026-08-11 07:26:45.029
625b37db-f56e-452f-8268-67ffb3df07c1	Reservation Status Updated	Booking #BK-74958 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 07:26:45.036	2026-08-11 07:26:45.036
d9a94d71-7667-4ccd-a3cc-e20a1122c9b7	New Order Received	Order #ORD-892584 placed for ₹600	ORDER	f	\N	the-urban-cafe	2026-08-11 07:26:45.052	2026-08-11 07:26:45.052
046d5d2f-8c6f-4415-a3e3-c3353dab8c1f	Order Status Updated	Order #ORD-892584 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 07:26:45.27	2026-08-11 07:26:45.27
2decf73b-44e0-4ece-9ba1-9b172e9406f7	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-11 07:26:45.296	2026-08-11 07:26:45.567
3741a70a-980d-416d-8cc8-74d479737471	New Order Received	Order #ORD-836097 placed for ₹960	ORDER	f	\N	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.502	2026-08-11 07:26:53.502
696c619d-8023-4dd2-9e5d-f2adb0a025f6	Order Status Updated	Order #ORD-836097 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.536	2026-08-11 07:26:53.536
6e43b511-7750-4a1c-988d-f49b4f32234e	Order Status Updated	Order #ORD-836097 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.577	2026-08-11 07:26:53.577
b171996c-80f7-42e1-ba1e-c999f30ceadb	Order Status Updated	Order #ORD-836097 status changed to READY	ORDER_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.618	2026-08-11 07:26:53.618
63f812f6-2075-4c09-aa4a-af1f5be43073	Order Status Updated	Order #ORD-836097 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.655	2026-08-11 07:26:53.655
b7ff28ff-a726-4563-9154-f34b9df4f249	Reservation Status Updated	Booking #BK-70664 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.728	2026-08-11 07:26:53.728
3f5455ae-8f95-4720-b180-d39d0fe8e740	Reservation Status Updated	Booking #BK-70664 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.738	2026-08-11 07:26:53.738
bdd03e43-1777-4a6d-bebb-4c89053f49c4	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:53.713	2026-08-11 07:26:53.756
81202aa0-388b-4d29-b72a-48966b7f55b1	New Order Received	Order #ORD-758647 placed for ₹1200 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:55:40.407	2026-08-11 11:55:40.407
3b1c108e-00d7-40c7-8403-826684931022	New Order Received	Order #ORD-369357 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:55:40.434	2026-08-11 11:55:40.434
ed783a04-a00f-4466-9471-cd95959f99b5	New Order Received	Order #ORD-573255 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:55:40.445	2026-08-11 11:55:40.445
f70af92a-adac-4ab5-81f9-a431d86623c0	New Order Received	Order #ORD-984537 placed for ₹350 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:55:40.499	2026-08-11 11:55:40.499
9e5f6cf8-f1e1-4fab-aa75-d07a6dc83f40	New Order Received	Order #ORD-338910 placed for ₹1200 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:56:25.359	2026-08-11 11:56:25.359
1f4f5bd0-8685-417d-ba63-69bd55bcd06b	New Order Received	Order #ORD-723985 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:56:25.405	2026-08-11 11:56:25.405
bcd26c1a-8e49-4f67-bf4c-9c0b896aaeab	New Order Received	Order #ORD-564643 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:56:25.434	2026-08-11 11:56:25.434
dc06f173-7d32-499c-9672-57fc8aa5f276	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-11 11:57:38.093	2026-08-11 11:57:38.093
e659f6dc-7c13-4fe8-9efa-0a4de6cf8415	Reservation Status Updated	Booking #BK-35244 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 11:57:38.113	2026-08-11 11:57:38.113
080f1269-f16d-42f6-aadc-547389919da1	Reservation Status Updated	Booking #BK-35244 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 11:57:38.135	2026-08-11 11:57:38.135
ceb6e843-a99f-404b-bb15-d424d4446113	New Order Received	Order #ORD-181571 placed for ₹480 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:57:38.172	2026-08-11 11:57:38.172
5b13d078-eb96-4cac-81f3-4c056c4535de	Order Status Updated	Order #ORD-181571 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 11:57:38.284	2026-08-11 11:57:38.284
1b66cc57-883e-4c7a-92f8-0117775130be	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-11 11:57:38.314	2026-08-11 11:57:38.491
f7f7ce50-ea56-4658-9149-844576352cac	New Order Received	Order #ORD-641668 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.462	2026-08-11 11:57:43.462
66c55ee8-4e7c-4212-aa25-d61e17e64827	Order Status Updated	Order #ORD-641668 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.511	2026-08-11 11:57:43.511
0f660e19-224a-441e-8fbc-ec72e90aa640	Order Status Updated	Order #ORD-641668 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.53	2026-08-11 11:57:43.53
d5e2b09e-a9b2-48a6-bc52-55fded4d3d29	Order Status Updated	Order #ORD-641668 status changed to READY	ORDER_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.554	2026-08-11 11:57:43.554
4ebe0dd9-36a5-4254-8090-f432b3cd9bab	Order Status Updated	Order #ORD-641668 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.597	2026-08-11 11:57:43.597
ee703c51-c6b1-49a6-88a9-f14565bc3b9c	Reservation Status Updated	Booking #BK-48826 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.685	2026-08-11 11:57:43.685
806a46e8-1c2b-414d-b67d-b310fe526a3e	Reservation Status Updated	Booking #BK-48826 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.699	2026-08-11 11:57:43.699
e8e16f25-a0fd-436c-a1a1-c418300035bf	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.662	2026-08-11 11:57:43.729
a21a303a-d8bf-46cd-96fb-f9e32e6fe6b6	New Order Received	Order #ORD-224393 placed for ₹1200 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:57:59.451	2026-08-11 11:57:59.451
fdf98c4a-9f6a-4757-aaf1-572e2e9ffa90	New Order Received	Order #ORD-792810 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:57:59.471	2026-08-11 11:57:59.471
6b74373d-2de6-4490-ae4b-6e40a5c07650	New Order Received	Order #ORD-758272 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:57:59.488	2026-08-11 11:57:59.488
21c23119-90d5-4bba-a5df-7e387d4d690d	New Order Received	Order #ORD-661487 placed for ₹760 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 11:59:48.451	2026-08-11 11:59:48.451
c2452151-8bf8-4b13-85d1-4778d1200065	Order Status Updated	Order #ORD-661487 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:07:41.468	2026-08-11 12:07:41.468
8da2bd2f-a1e0-4706-9ad9-0c4d3d7ca22c	Order Status Updated	Order #ORD-661487 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:07:43.372	2026-08-11 12:07:43.372
1ae3ad97-6f87-4ad4-a97e-479bae983624	Order Status Updated	Order #ORD-661487 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:07:44.339	2026-08-11 12:07:44.339
c7a7767d-6c65-480b-82f4-c9e5a81ec485	Order Status Updated	Order #ORD-661487 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:07:45.334	2026-08-11 12:07:45.334
c8607223-3bf6-4075-91f6-d73a678e7d86	New Order Received	Order #ORD-809750 placed for ₹1200 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:16:21.421	2026-08-11 12:16:21.421
74176108-f653-4163-8e3e-fe99a76472f2	New Order Received	Order #ORD-945576 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:16:21.447	2026-08-11 12:16:21.447
b3c0e005-aba3-4723-ac3e-ec26f15f812c	New Order Received	Order #ORD-682294 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:16:21.459	2026-08-11 12:16:21.459
fc942631-ed12-4f1c-bdc7-94f7d726c5ca	New Order Received	Order #ORD-903364 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:16:21.824	2026-08-11 12:16:21.824
5dd74a3d-f3a1-4a50-be93-d38f7c8a951d	Order Status Updated	Order #ORD-809750 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-11 12:16:21.863	2026-08-11 12:16:21.863
86c17d68-02b4-4822-932d-fc82d95dfd1b	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-11 12:17:29.849	2026-08-11 12:17:29.849
0a4a9e2f-feee-4167-b61e-c31286082c98	Reservation Status Updated	Booking #BK-95718 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 12:17:29.855	2026-08-11 12:17:29.855
5fc8d63c-80a9-4891-adc7-ddc8abb26d1b	Reservation Status Updated	Booking #BK-95718 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 12:17:29.861	2026-08-11 12:17:29.861
770d810e-8e99-4011-b8c2-ebf3578a4630	New Order Received	Order #ORD-118573 placed for ₹480 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:17:29.889	2026-08-11 12:17:29.889
9e17fb18-1e50-4b9d-a173-52bdb228b000	Order Status Updated	Order #ORD-118573 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:17:29.966	2026-08-11 12:17:29.966
7fd94900-e66f-407c-8efa-17f2db0810e4	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-11 12:17:29.983	2026-08-11 12:17:30.109
8a9c59b1-7055-43b6-939c-00d58616c3ac	New Order Received	Order #ORD-193387 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.755	2026-08-11 12:17:52.755
0e95963c-7583-44d4-a4c3-7673f963a924	Order Status Updated	Order #ORD-193387 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.794	2026-08-11 12:17:52.794
ebf174dc-e98a-4359-972b-43ddd4f88ce7	Order Status Updated	Order #ORD-193387 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.815	2026-08-11 12:17:52.815
4d9e48e9-ad90-4fee-802b-e0d551d9edab	Order Status Updated	Order #ORD-193387 status changed to READY	ORDER_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.86	2026-08-11 12:17:52.86
e2f84762-829b-47a1-b3e6-0b1961a78e0c	Order Status Updated	Order #ORD-193387 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.885	2026-08-11 12:17:52.885
f4acab81-0d20-434f-a616-57fdd046a1f0	Reservation Status Updated	Booking #BK-25650 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.968	2026-08-11 12:17:52.968
b813d0b3-4232-4d36-b29e-a27986274be1	Reservation Status Updated	Booking #BK-25650 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.992	2026-08-11 12:17:52.992
9367ac4b-27e6-4dbc-986e-3f5812fc7f32	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.944	2026-08-11 12:17:53.014
0cbe04a7-56de-4706-83d4-14018a3454ff	New Order Received	Order #ORD-358423 placed for ₹760 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:30:39.981	2026-08-11 12:30:39.981
251e849b-f97f-4cc6-af92-512544e474cb	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-11 12:40:09.563	2026-08-11 12:40:09.563
22fe369f-d073-4ddf-a30d-08e383765681	Reservation Status Updated	Booking #BK-32038 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 12:40:09.58	2026-08-11 12:40:09.58
f01cc556-8db3-40a5-8f79-9166e341deb9	Reservation Status Updated	Booking #BK-32038 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-11 12:40:09.594	2026-08-11 12:40:09.594
cacd3a38-1df4-454b-938d-e5d7d5ad00a4	New Order Received	Order #ORD-135321 placed for ₹480 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-11 12:40:09.629	2026-08-11 12:40:09.629
161ba9e7-5935-44c1-8ce3-4e7adf08133d	Order Status Updated	Order #ORD-135321 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-11 12:40:09.743	2026-08-11 12:40:09.743
d89391ac-8ac2-4cca-8cc9-2ad554e3981a	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-11 12:40:09.763	2026-08-11 12:40:09.882
6e022749-72b8-4855-b147-fd0cf6d4f960	New Order Received	Order #ORD-450361 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.423	2026-08-11 12:40:17.423
7ae1cc0c-8c96-4b88-825a-e278d4b49d6a	Order Status Updated	Order #ORD-450361 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.461	2026-08-11 12:40:17.461
cbbdb6a6-11db-450a-84bf-1c5c55a3df73	Order Status Updated	Order #ORD-450361 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.489	2026-08-11 12:40:17.489
f6f31338-f116-4263-9e97-08a19344db61	Order Status Updated	Order #ORD-450361 status changed to READY	ORDER_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.52	2026-08-11 12:40:17.52
c729ae8f-0b54-46a1-ad43-296ddc1c9b49	Order Status Updated	Order #ORD-450361 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.551	2026-08-11 12:40:17.551
ad961b2d-7c41-4380-86f3-e1d36bf99938	Reservation Status Updated	Booking #BK-39199 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.625	2026-08-11 12:40:17.625
94dbfef9-2771-468f-9bf9-f332a38b6c98	Reservation Status Updated	Booking #BK-39199 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.643	2026-08-11 12:40:17.643
b01297ed-a3c0-4836-aa2b-11e02dca591f	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.619	2026-08-11 12:40:17.672
edc0d3ec-04ea-4fd7-93cf-a8c0f54f2e09	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-12 07:03:48.089	2026-08-12 07:03:48.089
075a5dec-7e5b-482c-a423-91e4fe9255ac	Reservation Status Updated	Booking #BK-52974 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:03:48.104	2026-08-12 07:03:48.104
f3774f00-58f6-4dd2-a628-df1e3cfe5061	Reservation Status Updated	Booking #BK-52974 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:03:48.124	2026-08-12 07:03:48.124
f8c07a84-724f-4bfc-bf9a-9ab95e2fc222	New Order Received	Order #ORD-425421 placed for ₹480 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-12 07:03:48.164	2026-08-12 07:03:48.164
46a9f1b3-fdec-4fe2-9502-881486e6004a	Order Status Updated	Order #ORD-425421 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-12 07:03:48.354	2026-08-12 07:03:48.354
70e0d63b-8190-4947-8eb8-0664c89416e9	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-12 07:03:48.37	2026-08-12 07:03:48.446
38e8e42b-20bd-4b3a-8502-626d57c6a629	New Order Received	Order #ORD-376363 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.888	2026-08-12 07:03:52.888
f712221c-ddf6-42ec-9c1c-95fd5ae51d01	Order Status Updated	Order #ORD-376363 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.919	2026-08-12 07:03:52.919
d2d9982a-291b-4281-842f-329fa94d3bd7	Order Status Updated	Order #ORD-376363 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.958	2026-08-12 07:03:52.958
a0c5c1ca-bb43-45ff-9c8c-eb4720bc3b3b	Order Status Updated	Order #ORD-376363 status changed to READY	ORDER_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.992	2026-08-12 07:03:52.992
8392ce7a-f889-4a85-add3-c115b87af9b7	Order Status Updated	Order #ORD-376363 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:53.027	2026-08-12 07:03:53.027
92a4bfa2-df12-4c25-85c2-eaa35af43ac3	Reservation Status Updated	Booking #BK-48959 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:53.095	2026-08-12 07:03:53.095
1d636f22-42fe-4db4-a724-6075f5012a7c	Reservation Status Updated	Booking #BK-48959 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:53.114	2026-08-12 07:03:53.114
eb40ba4e-2227-44c2-8e75-d81df917e088	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:53.08	2026-08-12 07:03:53.152
405000b4-edd9-4677-9c01-5c8933660446	New Table Reservation	Table reservation request for Backend Audit Guest (3 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-12 07:10:25.882	2026-08-12 07:10:25.882
673efd1e-4f1d-4865-b620-e68a5ff2ac96	Reservation Status Updated	Booking #BK-97275 for Backend Audit Guest status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:10:25.899	2026-08-12 07:10:25.899
53c38da4-dc4c-4f63-bb6e-9cb80b97332c	Reservation Status Updated	Booking #BK-97275 for Backend Audit Guest status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:10:25.912	2026-08-12 07:10:25.912
23f427cf-08b1-4f61-93b2-ab5792b0ad8c	New Order Received	Order #ORD-904497 placed for ₹480 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-12 07:10:25.946	2026-08-12 07:10:25.946
079b98c1-530f-45ba-8d3f-4ab7ddcb5d1d	Order Status Updated	Order #ORD-904497 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-12 07:10:26.062	2026-08-12 07:10:26.062
612b787c-1df3-4529-a152-162f12ad56fa	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-12 07:10:26.078	2026-08-12 07:10:26.204
01f9b846-a5ea-4bb2-b327-2e3c7438f399	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-12 07:10:46.403	2026-08-12 07:10:46.522
ec0f3b8b-fa0e-4a1a-b92a-fa3d04788727	New Order Received	Order #ORD-957375 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-12 07:10:58.391	2026-08-12 07:10:58.391
e7f80248-6e34-4893-ba7f-a33ea033dad2	Order Status Updated	Order #ORD-957375 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-12 07:10:58.505	2026-08-12 07:10:58.505
eb2715d5-c745-4326-85fd-121841b3414f	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-12 07:10:58.518	2026-08-12 07:10:58.623
a2029770-fc1c-49c5-8e51-07705120c186	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-12 07:11:17.267	2026-08-12 07:11:17.267
7736aef7-3471-40db-a0b4-e8ef84678caa	Reservation Status Updated	Booking #BK-24577 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:11:17.277	2026-08-12 07:11:17.277
d6d7fcf6-224b-43c1-850c-9e87b6695510	Reservation Status Updated	Booking #BK-24577 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-12 07:11:17.282	2026-08-12 07:11:17.282
28da4678-055c-4c05-bc7c-d11895a4fa53	New Order Received	Order #ORD-414627 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-12 07:11:17.311	2026-08-12 07:11:17.311
b261312c-5c38-4759-aa5e-e4294263b7be	Order Status Updated	Order #ORD-414627 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-12 07:11:17.511	2026-08-12 07:11:17.511
5309934f-8251-4ce2-87ae-bbf08b36096a	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-12 07:11:17.536	2026-08-12 07:11:17.662
74918a04-17ce-4a8b-bd0b-189e2583569c	New Order Received	Order #ORD-134365 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.939	2026-08-12 07:11:20.939
ce012cac-5549-44f9-8be5-0d338cea716c	Order Status Updated	Order #ORD-134365 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.982	2026-08-12 07:11:20.982
0630cbdb-cd0d-4e84-adb6-9b9ca6ab201e	Order Status Updated	Order #ORD-134365 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.012	2026-08-12 07:11:21.012
964fafbd-aab0-4405-8287-d6e8dcab49b3	Order Status Updated	Order #ORD-134365 status changed to READY	ORDER_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.046	2026-08-12 07:11:21.046
372abdc7-f61d-434c-9dd8-11e363e73677	Order Status Updated	Order #ORD-134365 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.081	2026-08-12 07:11:21.081
af46e97c-3b19-4db4-8459-398e0a2f6e39	Reservation Status Updated	Booking #BK-34879 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.157	2026-08-12 07:11:21.157
bc9c1d69-617a-48c3-9a45-8d0769f9d734	Reservation Status Updated	Booking #BK-34879 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.172	2026-08-12 07:11:21.172
12d11438-250d-46a5-9acc-12624178c8b7	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:21.143	2026-08-12 07:11:21.197
441fb51a-c288-4e67-850b-e15dcb068c23	New Table Reservation	Table reservation request for QA Test User (2 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-12 07:44:38.859	2026-08-12 07:44:38.859
b6ebf7e0-4085-4f9e-b3c1-81d679cdb120	New Table Reservation	Table reservation request for ga (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-12 07:45:07.563	2026-08-12 07:45:07.563
c975c0a5-258e-4af3-b3eb-14d84220c3a4	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-13 07:03:50.76	2026-08-13 07:03:50.76
647f9ab7-44eb-4994-b61d-2bc7a82c75c3	Reservation Status Updated	Booking #BK-62412 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-13 07:03:50.774	2026-08-13 07:03:50.774
3d0d5c5c-3ec8-4326-826c-c73f64708d00	Reservation Status Updated	Booking #BK-62412 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-13 07:03:50.789	2026-08-13 07:03:50.789
cda2ae92-2bfd-4e23-a2c2-251bf3ca78d6	New Order Received	Order #ORD-293557 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-13 07:03:50.827	2026-08-13 07:03:50.827
62ab80e9-3251-49b2-b723-2e3f3074d9f6	Order Status Updated	Order #ORD-293557 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-13 07:03:51.016	2026-08-13 07:03:51.016
bd6ea95e-8cce-407b-868e-2aad64b114a6	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-13 07:03:51.044	2026-08-13 07:03:51.167
5ca5de24-9070-473c-a22c-50811bacac3a	New Order Received	Order #ORD-403643 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.02	2026-08-13 07:03:59.02
0da79e67-1cf0-49ad-91ac-6b7aef3de652	Order Status Updated	Order #ORD-403643 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.058	2026-08-13 07:03:59.058
303659e8-d3a6-4383-b01e-1333b5b6789d	Order Status Updated	Order #ORD-403643 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.084	2026-08-13 07:03:59.084
b2e2bdc0-7d6f-4a3f-a20c-81c051f5f2aa	Order Status Updated	Order #ORD-403643 status changed to READY	ORDER_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.112	2026-08-13 07:03:59.112
92ae42d8-6950-421f-8232-9ad9f4985769	Order Status Updated	Order #ORD-403643 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.13	2026-08-13 07:03:59.13
5e486d46-e800-41af-8f3a-44a695e886fe	Reservation Status Updated	Booking #BK-71648 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.181	2026-08-13 07:03:59.181
c51f7bb6-dba0-47da-b868-ef2f24a0f71b	Reservation Status Updated	Booking #BK-71648 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.195	2026-08-13 07:03:59.195
ccc0c207-94ad-47d3-9f84-35831443c573	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.174	2026-08-13 07:03:59.219
910134f0-6294-45bd-9bf9-26124ca88e75	New Order Received	Order #ORD-258800 placed for ₹840 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-13 07:19:13.284	2026-08-13 07:19:13.284
25ebcbdf-762b-4f33-83c5-4a46541bf521	New Table Reservation	Table reservation request for Gaurav SharmaGaurav (2 guests, 08:00 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-13 07:20:58.505	2026-08-13 07:20:58.505
de25f280-2c0c-431f-8117-c667a1ffff2a	New Review Received	Received a 5★ review: "Amazing food! Sourdough bruschetta was exceptional."	REVIEW	f	\N	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:22:15.14	2026-08-13 07:22:15.14
164c294d-8b65-4d18-91a1-5be52167936a	Order Status Updated	Order #ORD-258800 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-13 07:27:22.082	2026-08-13 07:27:22.082
7bab2066-27d1-4de7-a0c3-ec9a409b4385	Order Status Updated	Order #ORD-258800 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-13 07:27:35.946	2026-08-13 07:27:35.946
a829077f-169e-4218-9b2a-aae0a6a926eb	Reservation Status Updated	Booking #BK-86806 for Gaurav SharmaGaurav status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-13 07:29:50.345	2026-08-13 07:29:50.345
3d4c7818-bd0a-415b-a700-f44c84499878	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-14 06:32:39.181	2026-08-14 06:32:39.181
1f5134e8-325e-48aa-934b-2c58a57adc57	Reservation Status Updated	Booking #BK-85546 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-14 06:32:39.195	2026-08-14 06:32:39.195
f04afc3a-89b7-4505-abb2-1a404f769603	Reservation Status Updated	Booking #BK-85546 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-14 06:32:39.21	2026-08-14 06:32:39.21
d3534a2a-f742-4ca1-84f7-2bb2ceceb5f2	New Order Received	Order #ORD-270234 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:32:39.252	2026-08-14 06:32:39.252
ee49a2a3-3865-49ff-a97a-e354326738ec	Order Status Updated	Order #ORD-270234 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-14 06:32:39.363	2026-08-14 06:32:39.363
a90af45c-c942-4510-9f92-a53d9b6f8777	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-14 06:32:39.381	2026-08-14 06:32:39.52
eec6b7a0-1371-436f-b83a-21613fc8110c	New Order Received	Order #ORD-385169 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.625	2026-08-14 06:32:46.625
bc9f750a-5a34-4b30-9131-4f23e998129a	Order Status Updated	Order #ORD-385169 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.663	2026-08-14 06:32:46.663
4f08cefa-0cf7-4257-bc38-ee7f74936d30	Order Status Updated	Order #ORD-385169 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.695	2026-08-14 06:32:46.695
4eb50d7d-1161-4ac9-872d-aa859e8e8271	Order Status Updated	Order #ORD-385169 status changed to READY	ORDER_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.726	2026-08-14 06:32:46.726
265b6ecb-137f-4e4d-a423-5f23554e6a8e	Order Status Updated	Order #ORD-385169 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.754	2026-08-14 06:32:46.754
945ad22c-8a95-4211-b28a-4a3f0a1778aa	Reservation Status Updated	Booking #BK-60130 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.81	2026-08-14 06:32:46.81
02d07e6a-8b23-422d-97e6-3bd5bf66f8f2	Reservation Status Updated	Booking #BK-60130 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.818	2026-08-14 06:32:46.818
eeac3427-ac5d-4c4a-b043-7ce774af7c19	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.794	2026-08-14 06:32:46.841
dc5760e0-eca3-4b33-8933-8072839a4055	New Order Received	Order #ORD-824537 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:39:55.597	2026-08-14 06:39:55.597
5007b784-39f0-4b22-a0da-78c6acc1f6db	New Order Received	Order #ORD-713969 placed for ₹36000000 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:39:55.683	2026-08-14 06:39:55.683
c792aca2-e3f4-4246-949e-1fa2c01b01ca	New Order Received	Order #ORD-894293 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:39:55.696	2026-08-14 06:39:55.696
6e7c9978-0484-4297-8203-b0a6c91ae1ed	Order Status Updated	Order #ORD-824537 status changed to PAID	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-14 06:39:55.718	2026-08-14 06:39:55.718
ca0a646a-f7aa-4a86-bf0f-68e6aa50f276	Order Status Updated	Order #ORD-824537 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-14 06:39:55.746	2026-08-14 06:39:55.746
6f9f6d05-fa44-4f5d-a278-b5987c75ebaa	New Order Received	Order #ORD-220625 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:40:53.233	2026-08-14 06:40:53.233
ac36e696-7471-4aa4-9cde-909a1719b370	New Order Received	Order #ORD-980432 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:40:53.317	2026-08-14 06:40:53.317
a3c4eab0-88a1-4f22-8e75-908b075b2513	New Order Received	Order #ORD-759810 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:41:09.426	2026-08-14 06:41:09.426
73eb6974-9378-49ac-9e7b-4ae38a13097b	New Order Received	Order #ORD-709354 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:41:09.534	2026-08-14 06:41:09.534
e7b87d0d-5c2d-41f9-95dd-de7663fb1430	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-14 06:41:27.114	2026-08-14 06:41:27.114
fad748bd-d80c-4f77-947a-fc580e4b181e	New Order Received	Order #ORD-709831 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:41:27.164	2026-08-14 06:41:27.164
26218fd8-7630-454b-8878-c3897e887e31	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-14 06:41:27.397	2026-08-14 06:41:27.531
5dd5a191-82fb-4909-874b-b78a0399aed9	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-14 06:41:59.668	2026-08-14 06:41:59.668
1b860f5f-877f-4903-a41a-5b1c8074355a	Reservation Status Updated	Booking #BK-12730 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-14 06:41:59.68	2026-08-14 06:41:59.68
372b49e6-0a18-46ce-875b-04549a26b1ea	Reservation Status Updated	Booking #BK-12730 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-14 06:41:59.694	2026-08-14 06:41:59.694
879985af-408f-4556-8102-b8f92d0cacc8	New Order Received	Order #ORD-449237 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:41:59.721	2026-08-14 06:41:59.721
4a2ca789-6483-416d-baff-bc4a2f6cd185	Order Status Updated	Order #ORD-449237 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-14 06:41:59.835	2026-08-14 06:41:59.835
03ae835e-6f3c-4edb-84ed-0fda50f39205	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-14 06:41:59.86	2026-08-14 06:41:59.979
7e42e839-491d-4889-a013-a0f4e5d1b1c6	New Order Received	Order #ORD-173440 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.01	2026-08-14 06:42:07.01
e37a8258-df1e-4669-acba-94372b6cf078	Order Status Updated	Order #ORD-173440 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.038	2026-08-14 06:42:07.038
bbeb8bde-eb0f-4b78-bb65-32370b11e795	Order Status Updated	Order #ORD-173440 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.063	2026-08-14 06:42:07.063
0c1cac86-813e-437f-b05a-b8603892b652	Order Status Updated	Order #ORD-173440 status changed to READY	ORDER_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.096	2026-08-14 06:42:07.096
82b78945-39e1-45d1-8abd-b0a1a9e61632	Order Status Updated	Order #ORD-173440 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.121	2026-08-14 06:42:07.121
3a90cf80-209c-46ab-9008-d8742e7cf281	Reservation Status Updated	Booking #BK-33934 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.176	2026-08-14 06:42:07.176
b1d98f46-66d6-42c3-8b55-c3b814524c9c	Reservation Status Updated	Booking #BK-33934 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.185	2026-08-14 06:42:07.185
9c9c1b39-73d2-41c3-97a0-ebb5534dbcdd	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.161	2026-08-14 06:42:07.21
d6380629-60cd-42ce-b991-c2111563565e	New Order Received	Order #ORD-870565 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-14 06:46:47.161	2026-08-14 06:46:47.161
5f72d5b7-1e44-4d74-bbbe-b25f988f6bac	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 07:21:57.152	2026-08-15 07:21:57.152
53ab9eb2-15af-460e-a22c-c57410c64c1e	Reservation Status Updated	Booking #BK-93318 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 07:21:57.17	2026-08-15 07:21:57.17
08efc216-f1f6-4ef7-8f93-1850ab2a59f4	Reservation Status Updated	Booking #BK-93318 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 07:21:57.189	2026-08-15 07:21:57.189
cc768cf8-aa0c-4a13-a980-42420eed497b	New Order Received	Order #ORD-692057 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 07:21:57.225	2026-08-15 07:21:57.225
5f1e7031-696f-4c74-ac7c-15ce336a80f2	Order Status Updated	Order #ORD-692057 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:21:57.346	2026-08-15 07:21:57.346
19fe4bf7-3d65-45e8-aca6-cc20c4fde28d	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-15 07:21:57.362	2026-08-15 07:21:57.468
807c3c57-0606-4657-ac8a-fcfa882fea9e	New Order Received	Order #ORD-172919 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.03	2026-08-15 07:22:03.03
71927d31-6403-487d-8cb2-525f914da101	Order Status Updated	Order #ORD-172919 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.073	2026-08-15 07:22:03.073
7b705f05-5c72-4cfb-a564-e8de5a9a2abd	Order Status Updated	Order #ORD-172919 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.102	2026-08-15 07:22:03.102
c2c4cf83-27c3-4601-9360-3d492033763c	Order Status Updated	Order #ORD-172919 status changed to READY	ORDER_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.134	2026-08-15 07:22:03.134
cc8fde6b-2c84-416c-a145-2ea69108358c	Order Status Updated	Order #ORD-172919 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.164	2026-08-15 07:22:03.164
d864bda2-ea57-4280-9a7c-6a3534d9cca9	Reservation Status Updated	Booking #BK-65607 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.242	2026-08-15 07:22:03.242
34cf2f57-480a-40d4-bc87-06bace462569	Reservation Status Updated	Booking #BK-65607 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.257	2026-08-15 07:22:03.257
b8edd99e-4b07-4223-a563-bdf566cc2d71	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.227	2026-08-15 07:22:03.287
cacbd84b-608d-4727-a60a-19995e06d0c3	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 07:42:18.709	2026-08-15 07:42:18.709
9c475ef7-1d4e-460c-86a7-c26737d6440f	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 07:42:33.748	2026-08-15 07:42:33.748
155f095c-abac-4c5a-bb06-23aa89bcce36	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 07:51:33.994	2026-08-15 07:51:33.994
3b4fcc3f-9a43-437c-87de-4b40b5700445	Reservation Status Updated	Booking #BK-86477 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 07:51:34.014	2026-08-15 07:51:34.014
4fda5f46-6446-4275-87be-80ded973f908	Reservation Status Updated	Booking #BK-86477 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 07:51:34.033	2026-08-15 07:51:34.033
ad7d874e-59d5-4bdf-aa1b-149727a690b7	New Order Received	Order #ORD-232442 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 07:51:34.071	2026-08-15 07:51:34.071
014e55b9-dfdd-4fa4-8ece-b41b4e1499ec	Order Status Updated	Order #ORD-232442 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:51:34.152	2026-08-15 07:51:34.152
d5781d29-ebaa-4b5a-a9e5-bf8c4e852665	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-15 07:51:34.173	2026-08-15 07:51:34.321
ee6421df-bd98-4880-abc1-095f3542319d	New Order Received	Order #ORD-235739 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.553	2026-08-15 07:51:38.553
51e6079f-27e6-4415-829c-0110e05ac17c	Order Status Updated	Order #ORD-235739 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.596	2026-08-15 07:51:38.596
d3e2a225-858b-4e89-b777-408edb23ed92	Order Status Updated	Order #ORD-235739 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.632	2026-08-15 07:51:38.632
27cd026f-a909-4865-b26a-5a6c87b0767c	Order Status Updated	Order #ORD-235739 status changed to READY	ORDER_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.662	2026-08-15 07:51:38.662
be92a87d-f493-4191-8559-cf51e764a3a0	Order Status Updated	Order #ORD-235739 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.693	2026-08-15 07:51:38.693
8752669a-ea55-46aa-a8c9-3063ac8457e7	Reservation Status Updated	Booking #BK-33378 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.772	2026-08-15 07:51:38.772
da0cbee7-6a24-49c0-bd4a-afa5fb73ed86	Reservation Status Updated	Booking #BK-33378 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.787	2026-08-15 07:51:38.787
6e7cbdd3-674d-458f-bb6c-61ece9759b34	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.757	2026-08-15 07:51:38.817
cabfb773-b185-447e-9f3d-873c486022fc	New Order Received	Order #ORD-855006 placed for ₹520 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 07:52:44.998	2026-08-15 07:52:44.998
bdff20af-6f5f-4ccc-8f19-a2acce21e491	New Table Reservation	Table reservation request for Gaurav SharmaGaurav Sharma (2 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 07:54:04.315	2026-08-15 07:54:04.315
03bdca97-22aa-4826-8702-8258844a34cf	Order Status Updated	Order #ORD-855006 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:54:36.75	2026-08-15 07:54:36.75
65b6a70d-660c-40b6-95a9-c4c027185801	Order Status Updated	Order #ORD-855006 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:54:54.043	2026-08-15 07:54:54.043
2424ada5-8b2d-4c9d-beed-8c6e7a48de57	Order Status Updated	Order #ORD-855006 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:54:59.723	2026-08-15 07:54:59.723
2114b3f6-ab71-4a89-a592-9c813936791d	Order Status Updated	Order #ORD-855006 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 07:55:05.831	2026-08-15 07:55:05.831
b537bedb-2177-47b1-81b0-f052c2580731	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 19:36:29.363	2026-08-15 19:36:29.363
ccd328bb-9df0-4545-a047-ab5423628093	Reservation Status Updated	Booking #BK-95677 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 19:36:29.38	2026-08-15 19:36:29.38
bc629bab-98cd-4277-b8d6-c9d1cad08c64	Reservation Status Updated	Booking #BK-95677 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 19:36:29.394	2026-08-15 19:36:29.394
b840aa5a-e790-4a48-8565-9f0aefeeb1b9	New Order Received	Order #ORD-982172 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:36:29.421	2026-08-15 19:36:29.421
b4edf9d3-03ec-4ffd-a4c4-26b48fa3770a	Order Status Updated	Order #ORD-982172 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 19:36:29.66	2026-08-15 19:36:29.66
7c7e6778-8933-4763-8be4-f228d2875c27	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-15 19:36:29.683	2026-08-15 19:36:29.808
9253be8a-5ae9-40f0-9a42-daac00592ceb	New Order Received	Order #ORD-611221 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.831	2026-08-15 19:36:35.831
c5860b61-33c2-4c74-9a56-abb434e3e54e	Order Status Updated	Order #ORD-611221 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.864	2026-08-15 19:36:35.864
613b2329-bb17-4729-b686-03199ac2ac33	Order Status Updated	Order #ORD-611221 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.892	2026-08-15 19:36:35.892
5441e6fb-c0f9-44dd-a9dc-8e7ebb7c1625	Order Status Updated	Order #ORD-611221 status changed to READY	ORDER_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.919	2026-08-15 19:36:35.919
1bb2da6f-a208-428a-9f07-bf06dc1c8147	Order Status Updated	Order #ORD-611221 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.95	2026-08-15 19:36:35.95
2f073477-f578-4774-ae9b-b379a9b454ae	Reservation Status Updated	Booking #BK-63257 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:36.03	2026-08-15 19:36:36.03
7f4fcee5-0080-4f1f-9c5f-3eeae79cd85d	Reservation Status Updated	Booking #BK-63257 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:36.041	2026-08-15 19:36:36.041
abc70815-2f42-4ab0-98af-9d41c155b6ea	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:36.009	2026-08-15 19:36:36.072
c38a107b-77cf-4254-a229-0abe7c134f64	New Order Received	Order #ORD-542340 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:36:51.762	2026-08-15 19:36:51.762
7c20dc76-57af-43ae-9326-ab8b51cc1d34	New Order Received	Order #ORD-664416 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:36:51.868	2026-08-15 19:36:51.868
00e83511-b3f3-4205-adea-6bcf692e1297	New Order Received	Order #ORD-327287 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:36:53.683	2026-08-15 19:36:53.683
e88ec388-9baf-4ab6-a802-9db332dbcd8f	New Order Received	Order #ORD-905971 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:36:53.698	2026-08-15 19:36:53.698
4fefe445-db63-40c5-be96-bc9b8ea4bf18	New Order Received	Order #ORD-398361 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:37:21.379	2026-08-15 19:37:21.379
32adc736-1866-43c3-9354-381904c9905f	New Order Received	Order #ORD-594860 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:37:21.4	2026-08-15 19:37:21.4
d4d32b66-3b55-4ef3-8767-f99fdc568d31	New Order Received	Order #ORD-883751 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:37:44.518	2026-08-15 19:37:44.518
8f52b07d-6003-4c91-b01d-1c3e59a2c754	New Order Received	Order #ORD-907211 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:37:44.541	2026-08-15 19:37:44.541
f52be527-12b3-4861-9c23-5d30873b4e52	New Order Received	Order #ORD-676748 placed for ₹870 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:38:20.136	2026-08-15 19:38:20.136
c08e7e2d-ab17-4a0a-9088-4e007a88b7f4	New Order Received	Order #ORD-677262 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:38:20.163	2026-08-15 19:38:20.163
1d48819c-c1c1-44ae-9b7d-5fb790cbe715	New Order Received	Order #ORD-153817 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:38:20.178	2026-08-15 19:38:20.178
62da5fbc-8322-49cc-89a9-741faa9937c1	New Order Received	Order #ORD-903918 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:38:20.482	2026-08-15 19:38:20.482
6363cc6b-d3df-49f6-ac8e-b8fe980c9a1b	Order Status Updated	Order #ORD-676748 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 19:38:20.519	2026-08-15 19:38:20.519
97dbe5f5-259a-4e7d-ad55-63723bc5f729	New Order Received	Order #ORD-146913 placed for ₹520 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 19:41:25.145	2026-08-15 19:41:25.145
29aaab78-a20f-4167-a61c-3e005ba11dbb	New Table Reservation	Table reservation request for Gaurav SharmaGaurav Sharma (2 guests, 08:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 19:42:23.674	2026-08-15 19:42:23.674
c4e8a52c-55e0-4260-bb1b-3390259d48f6	Order Status Updated	Order #ORD-146913 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 19:59:22.063	2026-08-15 19:59:22.063
394e8100-da85-4891-8c4f-789c2e3b078f	New Order Received	Order #ORD-338704 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:08:28.94	2026-08-15 20:08:28.94
b32cc005-f8ab-481b-99c2-67a111129b89	New Order Received	Order #ORD-442880 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:08:28.975	2026-08-15 20:08:28.975
18f998b9-e9ad-41aa-890d-d6f3eb2e7bb9	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 20:09:23.712	2026-08-15 20:09:23.712
4a200fc7-0efb-4d05-85ac-5e131a8b488e	Reservation Status Updated	Booking #BK-96010 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 20:09:23.729	2026-08-15 20:09:23.729
64676c55-abb6-4d8b-8571-4f8323eaf5f3	Reservation Status Updated	Booking #BK-96010 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 20:09:23.744	2026-08-15 20:09:23.744
824b9096-6b8e-4e64-9e89-484ef8ea7f3a	New Order Received	Order #ORD-330898 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:09:23.767	2026-08-15 20:09:23.767
ef1192c4-e86a-4919-b073-37e4cef5d60c	Order Status Updated	Order #ORD-330898 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 20:09:23.89	2026-08-15 20:09:23.89
e4ca0658-8293-4c06-a9b6-11fc27fe4eca	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-15 20:09:23.917	2026-08-15 20:09:24.052
7b113c6e-58a5-4f41-adff-fdcf6c3e0714	New Order Received	Order #ORD-461037 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.147	2026-08-15 20:09:29.147
5759a09f-5539-4590-bb34-d1e1babbff31	Order Status Updated	Order #ORD-461037 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.185	2026-08-15 20:09:29.185
600d4492-18f8-4598-8c9b-3cb34b8fee27	Order Status Updated	Order #ORD-461037 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.206	2026-08-15 20:09:29.206
1d187cc1-f151-4868-be60-14d2d1a62594	Order Status Updated	Order #ORD-461037 status changed to READY	ORDER_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.237	2026-08-15 20:09:29.237
dc8143c5-9eac-4e7d-a25c-eee900f62304	Order Status Updated	Order #ORD-461037 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.27	2026-08-15 20:09:29.27
9b23db30-9bd2-4b17-a7b8-c2cc95a95197	Reservation Status Updated	Booking #BK-79721 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.317	2026-08-15 20:09:29.317
c3dc4eab-a97e-4d88-bf6c-fedefbd7f2f9	Reservation Status Updated	Booking #BK-79721 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.33	2026-08-15 20:09:29.33
ff5d2e40-5f0c-4142-99f1-3faa3399287e	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.307	2026-08-15 20:09:29.352
351ca04a-9481-498a-b936-a3c4258e2116	New Order Received	Order #ORD-841167 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:13:07.533	2026-08-15 20:13:07.533
1f59a30e-9bc3-49fd-bb3c-297872516b96	New Order Received	Order #ORD-818977 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:13:07.589	2026-08-15 20:13:07.589
c5e81c91-079c-4dca-902c-e9e076dd52bf	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 20:13:18.869	2026-08-15 20:13:18.869
7ed9d2ab-2655-4832-b8cd-faf810c8227c	Reservation Status Updated	Booking #BK-59467 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 20:13:18.894	2026-08-15 20:13:18.894
8e6406a0-0f20-4a50-9892-d692cf177ebf	Reservation Status Updated	Booking #BK-59467 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 20:13:18.917	2026-08-15 20:13:18.917
36fddf8c-437d-4578-8a8f-1faf4f3ba04c	New Order Received	Order #ORD-898710 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:13:18.934	2026-08-15 20:13:18.934
edab7293-0077-4436-b96d-1c46f39feae3	Order Status Updated	Order #ORD-898710 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 20:13:19.147	2026-08-15 20:13:19.147
f345d169-7b68-4d2d-86a0-bb96a535f41c	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-15 20:13:19.176	2026-08-15 20:13:19.342
297d7d0e-9f3d-449e-bc69-1e585bf5e5ce	New Order Received	Order #ORD-258106 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.428	2026-08-15 20:13:25.428
2bd5937f-c5df-424c-9099-20a96681e9a6	Order Status Updated	Order #ORD-258106 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.465	2026-08-15 20:13:25.465
8916c195-b8d3-44a3-b25b-d2708ed8d51d	Order Status Updated	Order #ORD-258106 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.496	2026-08-15 20:13:25.496
48b1a6b9-13eb-4494-90db-7ef51125d816	Order Status Updated	Order #ORD-258106 status changed to READY	ORDER_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.53	2026-08-15 20:13:25.53
728a553c-de64-4093-9c1c-bafee6d0819c	Order Status Updated	Order #ORD-258106 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.562	2026-08-15 20:13:25.562
df098f99-2070-4099-811b-a9048d1922c5	Reservation Status Updated	Booking #BK-86200 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.617	2026-08-15 20:13:25.617
a221fdd8-a2a6-4f29-8574-af2e87a1d16d	Reservation Status Updated	Booking #BK-86200 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.626	2026-08-15 20:13:25.626
0ba77b4b-2d31-4ef6-9b34-7e2e34707f38	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.612	2026-08-15 20:13:25.648
b5b0a947-937a-4b1a-850a-cd20faf79afd	New Order Received	Order #ORD-389928 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-15 20:19:01.572	2026-08-15 20:19:01.572
bf56e750-0223-4188-b26d-eb00659080d1	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 20:30:11.983	2026-08-15 20:30:11.983
39463f81-4f02-4add-8e61-5441b4ff88ac	New Table Reservation	Table reservation request for Gaurav Sharma (2 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 20:34:13.979	2026-08-15 20:34:13.979
947176a0-83fd-4f43-b701-4678e87cd1fd	Order Status Updated	Order #ORD-389928 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 21:29:53.976	2026-08-15 21:29:53.976
9cd28ca6-26f0-41fc-beef-4bc51e3bd85e	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 21:55:12.955	2026-08-15 21:55:12.955
0771a27a-89f8-4855-844b-1abbbd43987a	Order Status Updated	Order #ORD-818977 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:18.633	2026-08-15 22:06:18.633
a8d9bf49-dd3a-46a0-b479-9938ea7cf5a8	Order Status Updated	Order #ORD-442880 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:19.658	2026-08-15 22:06:19.658
baa06ae5-0554-4704-8f3e-56d0d820504f	Order Status Updated	Order #ORD-903918 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:20.855	2026-08-15 22:06:20.855
4292c6cf-2d54-468a-947f-ae40e5a64dd6	Order Status Updated	Order #ORD-677262 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:21.964	2026-08-15 22:06:21.964
6d9331a1-f33d-4e58-9d56-353d2105a38c	Order Status Updated	Order #ORD-883751 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:22.9	2026-08-15 22:06:22.9
37d4f3a9-ccec-4d45-89eb-f6e99b228235	Order Status Updated	Order #ORD-841167 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:25.614	2026-08-15 22:06:25.614
7b83e248-021d-4406-89ca-621bc110fb9a	Order Status Updated	Order #ORD-338704 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:25.787	2026-08-15 22:06:25.787
40f9287d-37b2-4d33-85b9-cfe14e5dc235	Order Status Updated	Order #ORD-153817 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:26.019	2026-08-15 22:06:26.019
03c5ebea-a1a6-4639-83d4-521a6e8af56e	Order Status Updated	Order #ORD-907211 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:26.239	2026-08-15 22:06:26.239
adc2b427-7d80-4197-a28b-2e22d3df17b7	Order Status Updated	Order #ORD-594860 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:26.439	2026-08-15 22:06:26.439
48d014ce-1a66-4bc9-b151-2c9dd9f2c74f	Order Status Updated	Order #ORD-398361 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:26.627	2026-08-15 22:06:26.627
ecdc3c69-5376-43d7-9b44-5d674d4a547a	Order Status Updated	Order #ORD-905971 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:26.807	2026-08-15 22:06:26.807
cdb44daa-c195-4fb6-9f5e-bdd7ed38d5e2	Order Status Updated	Order #ORD-327287 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:27.001	2026-08-15 22:06:27.001
8d1b626b-6113-461f-8e38-4401431dc7fd	Order Status Updated	Order #ORD-664416 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:27.181	2026-08-15 22:06:27.181
83a8555f-bd7f-46f8-abdf-82090facb577	Order Status Updated	Order #ORD-542340 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:27.362	2026-08-15 22:06:27.362
7052102b-2251-4350-b38a-f3d622d3775e	Order Status Updated	Order #ORD-870565 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:27.537	2026-08-15 22:06:27.537
cd9d05d4-7e42-41c6-b4a8-366c1d18c7d5	Order Status Updated	Order #ORD-709831 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:27.717	2026-08-15 22:06:27.717
06d1682c-dd80-4447-844c-5e410b3e3775	Order Status Updated	Order #ORD-709354 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:27.892	2026-08-15 22:06:27.892
354182f0-030e-48be-bf80-9d498ba6f65e	Order Status Updated	Order #ORD-759810 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.073	2026-08-15 22:06:28.073
ccd982f1-d47d-4da8-92fa-fc6181e0a8b5	Order Status Updated	Order #ORD-980432 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.253	2026-08-15 22:06:28.253
c5fb8f76-48e8-467c-bd5b-53db689ecefd	Order Status Updated	Order #ORD-220625 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.428	2026-08-15 22:06:28.428
783f34d5-f017-450e-9453-62749b64babf	Order Status Updated	Order #ORD-894293 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.602	2026-08-15 22:06:28.602
7f1170f2-1b37-47f1-bbca-c107460dc052	Order Status Updated	Order #ORD-713969 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.783	2026-08-15 22:06:28.783
a78e50a9-7897-4d5a-a04c-4d47f586b10a	Order Status Updated	Order #ORD-358423 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:28.963	2026-08-15 22:06:28.963
9ca3a5a4-53ca-4cf0-b588-0865947ab645	Order Status Updated	Order #ORD-903364 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:29.145	2026-08-15 22:06:29.145
8bf5ca53-61ac-4ac1-9c92-6b91be56b05c	Order Status Updated	Order #ORD-682294 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:29.319	2026-08-15 22:06:29.319
0031f5ea-8c9e-45b6-b549-68c7e8e1cc69	Order Status Updated	Order #ORD-945576 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:29.493	2026-08-15 22:06:29.493
398fed35-619e-41c7-8481-d7198f109092	Order Status Updated	Order #ORD-758272 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:29.668	2026-08-15 22:06:29.668
63d4ef1b-f8c1-40fc-b53f-9b289b3255eb	Order Status Updated	Order #ORD-792810 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:29.829	2026-08-15 22:06:29.829
8fac5212-e27d-4790-8567-c98ac983af6f	Order Status Updated	Order #ORD-224393 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:29.978	2026-08-15 22:06:29.978
464eed63-7ab7-4a3a-bc82-dc7fd00af4d5	Order Status Updated	Order #ORD-564643 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:30.152	2026-08-15 22:06:30.152
7aab6b68-34bb-4f96-b9f2-81aa5e60c7bb	Order Status Updated	Order #ORD-723985 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:30.43	2026-08-15 22:06:30.43
cc41e616-4e84-4cda-b987-f5ab7ca82a4e	Order Status Updated	Order #ORD-338910 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:30.617	2026-08-15 22:06:30.617
9b6fad5e-4655-4a28-982e-2f3c07f1bc22	Order Status Updated	Order #ORD-984537 status changed to ACCEPTED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:06:30.797	2026-08-15 22:06:30.797
0ca79724-7d47-4618-9a8e-76977982341c	Order Status Updated	Order #ORD-573255 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:30.96	2026-08-15 22:06:30.96
b7bd8e3a-e662-4e0d-b8da-f0bad87ffe5a	Order Status Updated	Order #ORD-369357 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:31.134	2026-08-15 22:06:31.134
18241791-0859-4239-ac90-8a2302569c23	Order Status Updated	Order #ORD-758647 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:06:31.302	2026-08-15 22:06:31.302
b3cfb420-43fe-49a8-ac88-ac2d24dffc83	Order Status Updated	Order #ORD-898710 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:09.01	2026-08-15 22:09:09.01
858172a9-ffb0-437e-a514-f00c9b072fd0	Order Status Updated	Order #ORD-898710 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:10.508	2026-08-15 22:09:10.508
d40c1223-fd6f-4294-b2a3-5ddd06b15b4d	Order Status Updated	Order #ORD-330898 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:18.837	2026-08-15 22:09:18.837
485517e0-b9e7-4741-99fb-9766ca29090f	Order Status Updated	Order #ORD-330898 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:19.831	2026-08-15 22:09:19.831
59d2ff8a-4f2a-47f5-af9e-e37ae8192426	Order Status Updated	Order #ORD-982172 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:20.788	2026-08-15 22:09:20.788
b5198579-e755-4a29-85fd-c13f546c3426	Order Status Updated	Order #ORD-982172 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:21.55	2026-08-15 22:09:21.55
a2f69238-dd4d-464f-b4d8-b09144550a42	Order Status Updated	Order #ORD-232442 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:22.494	2026-08-15 22:09:22.494
7aeb32e7-59b9-4e9d-bd62-144a5656eb2d	Order Status Updated	Order #ORD-232442 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:23.307	2026-08-15 22:09:23.307
c150e3b4-8378-42a3-a438-d7df0a8fc47a	Order Status Updated	Order #ORD-692057 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:24.413	2026-08-15 22:09:24.413
2aa36ce0-25ca-4194-bfc0-bfee74684c1c	Order Status Updated	Order #ORD-692057 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:25.188	2026-08-15 22:09:25.188
6922d762-fe78-4e63-9e55-39f0d2fead8d	Order Status Updated	Order #ORD-270234 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:26.246	2026-08-15 22:09:26.246
04e5cbe0-3678-4529-a8f3-4e80cab8d196	Order Status Updated	Order #ORD-270234 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:27.331	2026-08-15 22:09:27.331
b7a2aa90-decd-4812-b69f-3eeae9a5a24f	Order Status Updated	Order #ORD-293557 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:29.011	2026-08-15 22:09:29.011
6ff75054-c6c4-4e21-aa6a-60683a50ec57	Order Status Updated	Order #ORD-841167 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:29.845	2026-08-15 22:09:29.845
619e6d0d-44b0-4ffc-ae78-1171c19b5671	Order Status Updated	Order #ORD-442880 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:30.408	2026-08-15 22:09:30.408
4635d71d-03c7-4fcc-8a8f-cb8c9657662c	Order Status Updated	Order #ORD-338704 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:30.672	2026-08-15 22:09:30.672
cb1a362d-ea96-4eef-9d18-928d9c645917	Order Status Updated	Order #ORD-146913 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:30.906	2026-08-15 22:09:30.906
68ebec21-4948-4cd7-8b06-06d16d879b74	Order Status Updated	Order #ORD-338704 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:32.414	2026-08-15 22:09:32.414
e0f13505-3dc0-456c-91be-9f811133c6ac	Order Status Updated	Order #ORD-442880 status changed to READY	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:33.409	2026-08-15 22:09:33.409
0fdd08c3-30bb-4c6e-abc6-6ffa1877e941	Order Status Updated	Order #ORD-442880 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:34.663	2026-08-15 22:09:34.663
88409d57-06b9-47c0-9430-8dba90735ea8	Reservation Status Updated	Booking #BK-31411 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:49.783	2026-08-15 22:09:49.783
88cf27fb-b8df-4644-bd9a-20778cc88658	Reservation Status Updated	Booking #BK-97934 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:50.522	2026-08-15 22:09:50.522
c0a564d9-4a9e-4839-8b05-504e4f7f050e	Reservation Status Updated	Booking #BK-93439 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:50.706	2026-08-15 22:09:50.706
71a93437-dcc2-4b33-a9f4-154c7921f193	Reservation Status Updated	Booking #BK-62920 for Gaurav SharmaGaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:50.885	2026-08-15 22:09:50.885
277b1659-f0d8-4365-b238-dacc52e4e440	Reservation Status Updated	Booking #BK-33690 for Gaurav SharmaGaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.053	2026-08-15 22:09:51.053
a9c50497-ac7f-41b6-9be1-8f3e80f31107	Reservation Status Updated	Booking #BK-18907 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.231	2026-08-15 22:09:51.231
8e256018-d32b-4b3b-8acc-e6bd1e3ca721	Reservation Status Updated	Booking #BK-76913 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.417	2026-08-15 22:09:51.417
02406cbf-5479-458e-a082-6d3b6af3825d	Reservation Status Updated	Booking #BK-46647 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.604	2026-08-15 22:09:51.604
4e87ebfc-d27b-4e8e-8a53-64216598e124	Reservation Status Updated	Booking #BK-30704 for ga status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.781	2026-08-15 22:09:51.781
47ada153-77ed-475e-9786-91660a4c4685	Reservation Status Updated	Booking #BK-46564 for QA Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:51.963	2026-08-15 22:09:51.963
5b67e940-bdc7-4de3-b8be-0c0c46776bcc	Reservation Status Updated	Booking #BK-57181 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:52.153	2026-08-15 22:09:52.153
4d2d3d0b-7dfd-4d59-b3d6-0431b0f7651f	Reservation Status Updated	Booking #BK-45890 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:52.342	2026-08-15 22:09:52.342
0ae2590a-a588-4c84-9ac2-c2d100083651	Reservation Status Updated	Booking #BK-84210 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	the-urban-cafe	2026-08-15 22:09:52.525	2026-08-15 22:09:52.525
db75e183-0a96-4c4c-9217-85f9ce91f3ed	Order Status Updated	Order #ORD-338704 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:35.141	2026-08-15 22:09:35.141
67936577-65ca-4b8b-ae99-0c526d2b00fb	Order Status Updated	Order #ORD-293557 status changed to COMPLETED	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-15 22:09:36.252	2026-08-15 22:09:36.252
15153c92-f86c-4afd-be83-0d808b5c4bdf	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-15 22:15:42.663	2026-08-15 22:15:42.663
bf230cd6-b4a9-4208-8178-5c3bad335e2f	New Order Received	Order #ORD-523061 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:12.314	2026-08-16 07:14:12.314
e98a3e6d-ac01-431d-ae86-0425c42ac770	New Order Received	Order #ORD-353751 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:12.358	2026-08-16 07:14:12.358
9d2a35ab-0528-4b40-9d88-303ae3222a5a	New Table Reservation	Table reservation request for Audit Test User (4 guests, 07:30 PM)	BOOKING	f	\N	the-urban-cafe	2026-08-16 07:14:23.448	2026-08-16 07:14:23.448
6aa51137-9919-4aac-b7fd-5d512e05853d	Reservation Status Updated	Booking #BK-51295 for Audit Test User status changed to CONFIRMED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-16 07:14:23.465	2026-08-16 07:14:23.465
74c66324-3368-4758-8645-7e643fad2229	Reservation Status Updated	Booking #BK-51295 for Audit Test User status changed to COMPLETED	BOOKING_STATUS	f	\N	the-urban-cafe	2026-08-16 07:14:23.477	2026-08-16 07:14:23.477
a68cd500-2863-4a7c-85d6-3abbb30eab1c	New Order Received	Order #ORD-617225 placed for ₹720 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:23.505	2026-08-16 07:14:23.505
7a32b92b-d263-46e9-a19c-e4e6166eeb0a	Order Status Updated	Order #ORD-617225 status changed to PREPARING	ORDER_STATUS	f	\N	the-urban-cafe	2026-08-16 07:14:23.608	2026-08-16 07:14:23.608
22029563-aff2-4aa5-95b9-5e39df8f4656	New Review Received	Received a 5★ review: "Excellent food and great ambiance!"	REVIEW	t	\N	the-urban-cafe	2026-08-16 07:14:23.62	2026-08-16 07:14:23.742
b87dbfc8-06bb-4513-beef-fe3f973d44a6	New Order Received	Order #ORD-745105 placed for ₹960 (Awaiting Payment)	ORDER	f	\N	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.131	2026-08-16 07:14:25.131
9ffcaf47-47f6-4043-a142-14982d6a8602	Order Status Updated	Order #ORD-745105 status changed to CONFIRMED	ORDER_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.164	2026-08-16 07:14:25.164
b1d274d8-e0e8-43b6-af75-ea0a6f6aa20f	Order Status Updated	Order #ORD-745105 status changed to PREPARING	ORDER_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.194	2026-08-16 07:14:25.194
a312504c-5263-4669-ad94-1ef0b29e092d	Order Status Updated	Order #ORD-745105 status changed to READY	ORDER_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.213	2026-08-16 07:14:25.213
2480aa83-fe50-4013-b0fe-ce76e606ed37	Order Status Updated	Order #ORD-745105 status changed to COMPLETED	ORDER_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.253	2026-08-16 07:14:25.253
84d724a6-2678-44ac-a5ec-6fd2a26bc66e	Reservation Status Updated	Booking #BK-40212 for Gaurav Sharma status changed to CONFIRMED	BOOKING_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.318	2026-08-16 07:14:25.318
14e78675-c273-4340-b386-7e0eea4d5765	Reservation Status Updated	Booking #BK-40212 for Gaurav Sharma status changed to COMPLETED	BOOKING_STATUS	f	u-customer-1	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.328	2026-08-16 07:14:25.328
058081a6-ae5b-4474-8b33-7f422e0bf66f	New Table Reservation	Table reservation request for Gaurav Sharma (4 guests, 07:30 PM)	BOOKING	t	\N	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.303	2026-08-16 07:14:25.345
5c8915a0-7f4d-462a-9c0a-be6bc6993c89	New Order Received	Order #ORD-494528 placed for ₹870 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:36.345	2026-08-16 07:14:36.345
0e75abb3-f4bb-4560-89f7-1067b8e7b6b7	New Order Received	Order #ORD-706202 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:36.36	2026-08-16 07:14:36.36
38cbd8bd-4d0e-4df8-872e-419aa3a1ee93	New Order Received	Order #ORD-513553 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:36.37	2026-08-16 07:14:36.37
b3432b05-4652-4dc0-921a-14fb31d0c304	New Order Received	Order #ORD-717790 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:36.704	2026-08-16 07:14:36.704
edf73c04-11c9-46c4-b296-fce7ad2d2ffa	Order Status Updated	Order #ORD-494528 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-16 07:14:36.734	2026-08-16 07:14:36.734
fa865088-5d54-49ab-9d18-7d48485cbdf0	New Order Received	Order #ORD-746976 placed for ₹870 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:39.06	2026-08-16 07:14:39.06
e617e29e-b84b-4b31-a3a3-46132eb98583	New Order Received	Order #ORD-538882 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:39.075	2026-08-16 07:14:39.075
7aaadb9b-de34-4818-9f07-23e01edb3447	New Order Received	Order #ORD-324882 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:39.101	2026-08-16 07:14:39.101
acb02a8e-b1ac-48ad-b175-52aaf233903f	New Order Received	Order #ORD-838776 placed for ₹360 (Awaiting Payment)	ORDER	f	\N	the-urban-cafe	2026-08-16 07:14:39.428	2026-08-16 07:14:39.428
e9a5883d-ae25-4bef-8ddc-0aee6db47ecc	Order Status Updated	Order #ORD-746976 status changed to ACCEPTED	ORDER_STATUS	f	u-customer-1	the-urban-cafe	2026-08-16 07:14:39.456	2026-08-16 07:14:39.456
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "orderNumber", "totalAmount", status, "paymentStatus", "restaurantId", "userId", "tableId", "createdAt", "updatedAt", "customerName", "customerPhone", "deliveryAddress", "paymentMethod") FROM stdin;
ord-9001	ORD-9001	1000	PREPARING	PAID	the-urban-cafe	u-customer-1	t-02	2026-08-07 12:16:09.53	2026-08-07 12:16:09.53	Gaurav Sharma	+91 98765 43210	Bandra West, Mumbai	CARD
f38116d4-a697-469a-87b8-1e99312ee6a4	ORD-676144	1150	DELIVERED	PAID	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	\N	T-01	2026-08-10 08:17:32.041	2026-08-10 08:17:32.157	Aarav Sharma	+91 99887 76655	Table T-01 (Dine-In)	UPI
64e0355f-5359-44ca-b67e-112667dd3bc8	ORD-818199	600	PREPARING	PAID	the-urban-cafe	\N	t-01	2026-08-10 08:31:59.878	2026-08-10 08:31:59.962	Audit Tester	+91 99999 88888	Table 04	CARD
b0740a08-3c6f-4fe3-ac5e-b4169acad593	ORD-300160	960	CANCELLED	PAID	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	u-customer-1	\N	2026-08-10 08:35:28.049	2026-08-10 08:35:28.365	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
b193c5b8-77e7-45f1-b66e-f0741f6ab92b	ORD-984537	350	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-11 11:55:40.491	2026-08-15 22:06:30.797	Guest	+91 98765 00000	Dine-In / Delivery	CARD
77d55f74-80dd-4d5a-9351-771a8c318b74	ORD-684802	960	COMPLETED	PAID	d8ac74ce-3bff-44b1-b0f8-f82507550503	u-customer-1	\N	2026-08-10 08:36:19.641	2026-08-10 08:36:19.749	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
0800eb91-f1f4-41e6-8956-78ab68afadf4	ORD-181571	480	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-11 11:57:38.166	2026-08-11 11:57:38.276	Audit Tester	+91 99999 88888	Table 04	CARD
7f12bf06-c9f7-4afa-bb86-a170d0eb5910	ORD-822094	960	COMPLETED	PAID	52ba7639-afe8-48bb-a354-8c9541038a58	u-customer-1	\N	2026-08-11 06:46:26.926	2026-08-11 06:46:27.076	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
a5dc4ad3-ee2b-4cab-a363-1c14329a5f9d	ORD-181188	848	ACCEPTED	PAID	the-urban-cafe	\N	t-01	2026-08-11 06:59:23.214	2026-08-11 07:04:15.316	Gaurav Sharma	+91 98765 43210	Table 04 (Dine-In)	CASH
d49e9d9b-28e5-43da-b01d-ee9317263a2e	ORD-892584	600	PREPARING	PAID	the-urban-cafe	\N	t-01	2026-08-11 07:26:45.047	2026-08-11 07:26:45.261	Audit Tester	+91 99999 88888	Table 04	CARD
67a4f5d8-f6e9-4ef6-a9aa-6d61fac7d8a6	ORD-641668	960	COMPLETED	PENDING_PAYMENT	2c49b364-beeb-4bb4-b348-8ee58317e5cd	u-customer-1	\N	2026-08-11 11:57:43.448	2026-08-11 11:57:43.594	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
8f79903d-d7e2-4a7d-b56a-354a6d30fe27	ORD-836097	960	COMPLETED	PAID	00e53d62-c8ff-4438-8c9d-779a77b48e53	u-customer-1	\N	2026-08-11 07:26:53.493	2026-08-11 07:26:53.653	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
f5ac3729-b22e-4c40-81b3-91b35538f7a2	ORD-564643	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:56:25.431	2026-08-15 22:06:30.151	Guest	+91 98765 00000	Dine-In / Delivery	CARD
beed09eb-a81a-4d8f-8c8a-b246f68dd5c1	ORD-193387	960	COMPLETED	PENDING_PAYMENT	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	u-customer-1	\N	2026-08-11 12:17:52.744	2026-08-11 12:17:52.884	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
e276c470-ab2d-406e-a05c-12314e35dece	ORD-809750	1200	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-11 12:16:21.405	2026-08-11 12:16:21.86	Guest	+91 98765 00000	Dine-In / Delivery	CARD
3813d6ad-75b8-41af-87d6-f9421928f4e6	ORD-661487	760	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-11 11:59:48.433	2026-08-11 12:07:45.327	Gaurav Sharma	+91 98765 43210	Table 04 (Dine-In)	UPI
dec13afc-e4d4-4085-b986-a98fa31191ce	ORD-118573	480	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-11 12:17:29.886	2026-08-11 12:17:29.964	Audit Tester	+91 99999 88888	Table 04	CARD
7e20f3c7-3075-43db-b913-c93cea0cfbeb	ORD-135321	480	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-11 12:40:09.625	2026-08-11 12:40:09.735	Audit Tester	+91 99999 88888	Table 04	CARD
a1a71b8c-876f-445b-ad3a-d09ab3508bf7	ORD-425421	480	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-12 07:03:48.156	2026-08-12 07:03:48.352	Audit Tester	+91 99999 88888	Table 04	CARD
7d111dc7-b6e3-4dbd-afc9-9db478fde7d9	ORD-450361	960	COMPLETED	PENDING_PAYMENT	23bbf2b6-56c7-4fe3-9269-651705dac079	u-customer-1	\N	2026-08-11 12:40:17.413	2026-08-11 12:40:17.549	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
5b478809-021a-468a-b2b7-c35cadb7d4a9	ORD-376363	960	COMPLETED	PENDING_PAYMENT	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	u-customer-1	\N	2026-08-12 07:03:52.885	2026-08-12 07:03:53.025	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
d0a20573-5d65-4221-bd60-021c67730a0d	ORD-904497	480	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-12 07:10:25.942	2026-08-12 07:10:26.06	Audit Tester	+91 99999 88888	Table 04	CARD
82885085-db27-4940-8710-54db4c4e7ca3	ORD-957375	720	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-12 07:10:58.373	2026-08-12 07:10:58.503	Guest	+91 98765 00000	Dine-In / Delivery	CARD
e32dcecc-0e76-4006-826a-d6793f4b5f5f	ORD-414627	720	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-12 07:11:17.308	2026-08-12 07:11:17.509	Guest	+91 98765 00000	Dine-In / Delivery	CARD
5de97f19-4a4d-4714-9c10-796cafb6819b	ORD-358423	760	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-11 12:30:39.951	2026-08-15 22:06:28.963	Gaurav Sharma	+91 98765 43210	Table 04 (Dine-In)	UPI
a963ddcc-db5a-4df2-ae6e-709a1b4720b0	ORD-903364	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-11 12:16:21.821	2026-08-15 22:06:29.144	Guest	+91 98765 00000	Dine-In / Delivery	CARD
073ced24-a99e-477c-baf5-4ab47abb07ee	ORD-682294	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 12:16:21.456	2026-08-15 22:06:29.318	Guest	+91 98765 00000	Dine-In / Delivery	CARD
bfa9b31c-917b-46dc-ad9d-6ee984ed5e02	ORD-945576	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 12:16:21.443	2026-08-15 22:06:29.493	Guest	+91 98765 00000	Dine-In / Delivery	CARD
7776877d-6904-4be5-9fbc-37f1eb424cd2	ORD-758272	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:57:59.485	2026-08-15 22:06:29.667	Guest	+91 98765 00000	Dine-In / Delivery	CARD
0648106f-cbeb-4945-98b1-42ab8570287c	ORD-792810	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:57:59.467	2026-08-15 22:06:29.828	Guest	+91 98765 00000	Dine-In / Delivery	CARD
ce10e196-429f-4678-b9f3-a1020ef22462	ORD-224393	1200	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-11 11:57:59.439	2026-08-15 22:06:29.977	Guest	+91 98765 00000	Dine-In / Delivery	CARD
25e1e8a6-69da-4f9b-86bd-db7021669e75	ORD-723985	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:56:25.401	2026-08-15 22:06:30.429	Guest	+91 98765 00000	Dine-In / Delivery	CARD
6c31bdd0-0da8-4897-a8b1-6151a080fe66	ORD-338910	1200	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-11 11:56:25.339	2026-08-15 22:06:30.616	Guest	+91 98765 00000	Dine-In / Delivery	CARD
dbfabe6b-c59f-4eb5-a96f-b7a349602da2	ORD-573255	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:55:40.442	2026-08-15 22:06:30.959	Guest	+91 98765 00000	Dine-In / Delivery	CARD
af3b2433-567e-41a9-954e-d0b0989ba188	ORD-369357	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-11 11:55:40.431	2026-08-15 22:06:31.133	Guest	+91 98765 00000	Dine-In / Delivery	CARD
7f3edfa7-b0f8-4d39-83c0-bc35443b9388	ORD-758647	1200	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-11 11:55:40.39	2026-08-15 22:06:31.301	Guest	+91 98765 00000	Dine-In / Delivery	CARD
581a629f-2493-48a2-9874-5caccf252512	ORD-235739	960	COMPLETED	PENDING_PAYMENT	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	u-customer-1	\N	2026-08-15 07:51:38.551	2026-08-15 07:51:38.692	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
044b7793-143b-4164-a5d0-9469064d0642	ORD-134365	960	COMPLETED	PENDING_PAYMENT	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	u-customer-1	\N	2026-08-12 07:11:20.935	2026-08-12 07:11:21.08	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
8e705cab-9430-49ca-b038-ca8cae984c83	ORD-293557	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-13 07:03:50.821	2026-08-15 22:09:36.251	Guest	+91 98765 00000	Dine-In / Delivery	CARD
c89f1576-76aa-4d69-b2f3-40320afccdb5	ORD-173440	960	COMPLETED	PENDING_PAYMENT	8b592d07-b126-4da7-b2ec-7373389fc227	u-customer-1	\N	2026-08-14 06:42:07.006	2026-08-14 06:42:07.12	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
ec9c742b-ac1c-4e8e-9802-aaeb0bf834c6	ORD-403643	960	COMPLETED	PENDING_PAYMENT	5ecdc092-c3ed-465d-ad41-1503c75d9e42	u-customer-1	\N	2026-08-13 07:03:59.007	2026-08-13 07:03:59.129	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
9ca08944-7641-4f4a-be56-44424951d045	ORD-258800	840	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-13 07:19:13.263	2026-08-13 07:27:35.938	Gaurav SharmaGaurav	+91 98765 432109876543210	Table 04 (Dine-In)	CASH
6637f5db-b30e-43a5-b585-45009e203da9	ORD-270234	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:32:39.242	2026-08-15 22:09:27.33	Guest	+91 98765 00000	Dine-In / Delivery	CARD
18f1c131-8e29-47c4-903a-87a74e87578d	ORD-692057	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 07:21:57.221	2026-08-15 22:09:25.187	Guest	+91 98765 00000	Dine-In / Delivery	CARD
fc9ea85f-eebe-4db6-84e9-d7e0bdce06a9	ORD-611221	960	COMPLETED	PENDING_PAYMENT	b8f37817-45f8-4eab-babf-20530fa53e8a	u-customer-1	\N	2026-08-15 19:36:35.828	2026-08-15 19:36:35.949	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
bc5c69d7-129d-4d5e-a018-24f0984880d0	ORD-385169	960	COMPLETED	PENDING_PAYMENT	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	u-customer-1	\N	2026-08-14 06:32:46.621	2026-08-14 06:32:46.752	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
04d9956a-2f96-4ac8-9f24-bdde39667902	ORD-824537	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:39:55.59	2026-08-14 06:39:55.743	Safety Tester	9876543210	Dine-In / Delivery	CARD
f751e81d-8ca2-481d-8291-22d9fd1e8f22	ORD-449237	720	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:41:59.718	2026-08-14 06:41:59.833	Guest	+91 98765 00000	Dine-In / Delivery	CARD
676eae5d-28e1-4b52-8fb9-ca172ae792fc	ORD-172919	960	COMPLETED	PENDING_PAYMENT	e5688dbb-23b9-4b99-9df8-3fa867ad307b	u-customer-1	\N	2026-08-15 07:22:03.027	2026-08-15 07:22:03.163	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
019fee2b-842c-453e-bd7d-341f0fe38e19	ORD-232442	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 07:51:34.068	2026-08-15 22:09:23.306	Guest	+91 98765 00000	Dine-In / Delivery	CARD
81e5aa49-97c1-4cd0-8459-77590a409fa0	ORD-855006	520	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-15 07:52:44.995	2026-08-15 07:55:05.83	Gaurav SharmaGaurav Sharma	+91 98765 43210+91 98765 43210	Table 04 (Dine-In)	UPI
73dfb146-d7f5-49c1-a064-5ef139c76170	ORD-982172	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 19:36:29.413	2026-08-15 22:09:21.549	Guest	+91 98765 00000	Dine-In / Delivery	CARD
9ae87748-9ab2-4cdc-a074-436169d69656	ORD-676748	870	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-15 19:38:20.132	2026-08-15 19:38:20.517	Guest	+91 98765 00000	Dine-In / Delivery	CARD
f2fffca2-1cf0-4315-8116-336270a9254a	ORD-903918	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 19:38:20.48	2026-08-15 22:06:20.854	Guest	+91 98765 00000	Dine-In / Delivery	CARD
c207c9b6-ab45-4147-9f5d-17a3cdb28cbf	ORD-677262	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:38:20.161	2026-08-15 22:06:21.962	Guest	+91 98765 00000	Dine-In / Delivery	CARD
15e5179e-cb97-44c7-b4d0-3ea71b6e1630	ORD-883751	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:37:44.515	2026-08-15 22:06:22.899	Guest	+91 98765 00000	Dine-In / Delivery	CARD
8c622b0f-7109-4f9b-bd39-8ad3ae056bab	ORD-153817	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:38:20.175	2026-08-15 22:06:26.018	Guest	+91 98765 00000	Dine-In / Delivery	CARD
c9200655-7898-47af-91b0-d2ae562c0fca	ORD-907211	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:37:44.539	2026-08-15 22:06:26.238	Guest	+91 98765 00000	Dine-In / Delivery	CARD
76a9a9ae-e8d3-426d-b49a-0a73aaca917c	ORD-594860	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:37:21.398	2026-08-15 22:06:26.438	Guest	+91 98765 00000	Dine-In / Delivery	CARD
c4ea04ff-6572-4476-bd68-6d228a12db0e	ORD-398361	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:37:21.375	2026-08-15 22:06:26.626	Guest	+91 98765 00000	Dine-In / Delivery	CARD
ef3fdc75-588e-497f-80b9-dfde9e4f9b20	ORD-905971	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:36:53.696	2026-08-15 22:06:26.806	Guest	+91 98765 00000	Dine-In / Delivery	CARD
7c2d128b-ef3e-417b-961b-252784ee5a27	ORD-327287	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-15 19:36:53.681	2026-08-15 22:06:27	Guest	+91 98765 00000	Dine-In / Delivery	CARD
d8774f25-177e-4add-9e8b-333a7fdcfa2d	ORD-664416	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 19:36:51.866	2026-08-15 22:06:27.181	Guest	+91 98765 00000	Dine-In / Delivery	CARD
f9483c4d-3af1-4be0-9f95-570be45cfb98	ORD-542340	720	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 19:36:51.759	2026-08-15 22:06:27.361	Safety Tester	9876543210	Dine-In / Delivery	CARD
f37e8bd8-c05a-4273-ab8b-f98d48c16c69	ORD-870565	720	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-14 06:46:47.157	2026-08-15 22:06:27.536	CustomerTest Customer	+91 98765 43210+91 98765+91 98765 43210 43210	Table 04 (Dine-In)	CASH
bc725d80-ffca-4e06-a38d-3dc51f7694db	ORD-709831	720	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:41:27.161	2026-08-15 22:06:27.717	Guest	+91 98765 00000	Dine-In / Delivery	CARD
60a6d5ff-caa0-4f99-98df-644f90432a8c	ORD-709354	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:41:09.532	2026-08-15 22:06:27.891	Guest	+91 98765 00000	Dine-In / Delivery	CARD
8540a84b-be6c-47fc-ad6d-c4f819aefb0e	ORD-759810	720	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:41:09.422	2026-08-15 22:06:28.072	Safety Tester	9876543210	Dine-In / Delivery	CARD
3e9cf25f-ff24-41cb-9a26-35b2009d182c	ORD-980432	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:40:53.314	2026-08-15 22:06:28.252	Guest	+91 98765 00000	Dine-In / Delivery	CARD
9420ecfd-0bab-4c24-8914-eea7983e827d	ORD-220625	720	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:40:53.224	2026-08-15 22:06:28.427	Safety Tester	9876543210	Dine-In / Delivery	CARD
39f26239-25cc-4d7c-b3f5-8402674ed2a9	ORD-894293	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:39:55.693	2026-08-15 22:06:28.601	Guest	+91 98765 00000	Dine-In / Delivery	CARD
0faf8eb1-f494-440a-aaaf-9a1ff8ae24d5	ORD-713969	36000000	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-14 06:39:55.68	2026-08-15 22:06:28.782	Guest	+91 98765 00000	Dine-In / Delivery	CARD
677635c9-5880-45d9-8b88-5963d76244b5	ORD-746976	870	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:39.058	2026-08-16 07:14:39.456	Guest	+91 98765 00000	Dine-In / Delivery	CARD
a2ccc1bf-5270-4d7f-b147-1bd3043da60c	ORD-442880	360	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	t-02	2026-08-15 20:08:28.971	2026-08-15 22:09:34.662	Bob (T-02 Customer)	+91 98765 22222	Table T-02 (Dine-In)	CARD
f9958bed-4852-47e1-98e3-f2c2fd254bf1	ORD-338704	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-15 20:08:28.928	2026-08-15 22:09:35.14	Alice (T-01 Customer)	+91 98765 11111	Table T-01 (Dine-In)	CARD
d8a00e8c-a7fd-4fe5-b430-b1cbddd9bd3f	ORD-461037	960	COMPLETED	PENDING_PAYMENT	9d956e86-2f45-4048-844d-383bd9b52a63	u-customer-1	\N	2026-08-15 20:09:29.144	2026-08-15 20:09:29.268	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
fddf3567-f2c0-4481-8b55-ad60aff4d546	ORD-523061	720	PENDING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-16 07:14:12.297	2026-08-16 07:14:12.297	Alice (T-01 Customer)	+91 98765 11111	Table T-01 (Dine-In)	CARD
4f50e665-941f-483f-940e-f2fbc60ecaf8	ORD-353751	360	PENDING	PENDING_PAYMENT	the-urban-cafe	\N	t-02	2026-08-16 07:14:12.353	2026-08-16 07:14:12.353	Bob (T-02 Customer)	+91 98765 22222	Table T-02 (Dine-In)	CARD
2fddf904-a7a4-4dfb-b47a-6e52b037e7ce	ORD-617225	720	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-16 07:14:23.502	2026-08-16 07:14:23.607	Guest	+91 98765 00000	Dine-In / Delivery	CARD
55c2f987-5a2a-4751-b72b-04df8ce486dd	ORD-258106	960	COMPLETED	PENDING_PAYMENT	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	u-customer-1	\N	2026-08-15 20:13:25.424	2026-08-15 20:13:25.56	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
2c95c776-8e47-4989-b828-45f091a36e1a	ORD-389928	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	t-02	2026-08-15 20:19:01.567	2026-08-15 21:29:53.975	Gaurav SharmaTest Customer	+91 98765 432109876543210	Table T-02 (Dine-In)	CASH
e40269e6-89da-4814-b112-f9c62a487f11	ORD-818977	360	ACCEPTED	PENDING_PAYMENT	the-urban-cafe	\N	t-02	2026-08-15 20:13:07.586	2026-08-15 22:06:18.632	Bob (T-02 Customer)	+91 98765 22222	Table T-02 (Dine-In)	CARD
24a52f40-c0fb-4076-bf2b-72998d852a7f	ORD-898710	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 20:13:18.931	2026-08-15 22:09:10.507	Guest	+91 98765 00000	Dine-In / Delivery	CARD
07f9b393-de38-4d15-8fbd-c88a3df61756	ORD-745105	960	COMPLETED	PENDING_PAYMENT	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	u-customer-1	\N	2026-08-16 07:14:25.128	2026-08-16 07:14:25.252	Gaurav Sharma	+91 98765 43210	Table 02 (Indoor)	UPI
a41d852d-11ba-4102-a8f6-091b4204c614	ORD-330898	720	COMPLETED	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-15 20:09:23.763	2026-08-15 22:09:19.83	Guest	+91 98765 00000	Dine-In / Delivery	CARD
7a405081-4b0e-4bea-897a-b116d8c779eb	ORD-841167	720	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-15 20:13:07.52	2026-08-15 22:09:29.844	Alice (T-01 Customer)	+91 98765 11111	Table T-01 (Dine-In)	CARD
18a0ab4f-1009-4991-a904-e9f2116d419a	ORD-146913	520	PREPARING	PENDING_PAYMENT	the-urban-cafe	\N	t-01	2026-08-15 19:41:25.139	2026-08-15 22:09:30.904	Gaurav SharmaGaurav Sharma	+91 98765 43210+91 98765 43210	Table 04 (Dine-In)	CASH
6efb1f9f-1621-4ed4-994a-38f27905c1b1	ORD-706202	360	PENDING	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:36.358	2026-08-16 07:14:36.358	Guest	+91 98765 00000	Dine-In / Delivery	CARD
d02ab228-540d-4d2d-b5c6-fbd9452f6160	ORD-513553	360	PENDING	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:36.368	2026-08-16 07:14:36.368	Guest	+91 98765 00000	Dine-In / Delivery	CARD
7c38d77e-16a8-402e-8710-915d54645ec5	ORD-717790	360	PENDING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-16 07:14:36.702	2026-08-16 07:14:36.702	Guest	+91 98765 00000	Dine-In / Delivery	CARD
6fc9985f-ac35-42b3-9491-78101b84eae4	ORD-494528	870	ACCEPTED	PAID	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:36.341	2026-08-16 07:14:36.734	Guest	+91 98765 00000	Dine-In / Delivery	CARD
1bd327bd-91f6-4089-a7a8-ccd75aec2d98	ORD-538882	360	PENDING	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:39.073	2026-08-16 07:14:39.073	Guest	+91 98765 00000	Dine-In / Delivery	CARD
a8efe5f2-1cf3-4b39-8414-009814e09a2b	ORD-324882	360	PENDING	PENDING_PAYMENT	the-urban-cafe	u-customer-1	\N	2026-08-16 07:14:39.099	2026-08-16 07:14:39.099	Guest	+91 98765 00000	Dine-In / Delivery	CARD
70260316-eb2f-4505-9391-0ee235b8c72a	ORD-838776	360	PENDING	PENDING_PAYMENT	the-urban-cafe	\N	\N	2026-08-16 07:14:39.426	2026-08-16 07:14:39.426	Guest	+91 98765 00000	Dine-In / Delivery	CARD
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "menuItemId", quantity, price, "createdAt", "updatedAt") FROM stdin;
a23bd161-25ed-4e26-b345-b9553a669722	ord-9001	item-102	1	520	2026-08-07 12:16:09.531	2026-08-07 12:16:09.531
caf308c2-15e6-4f4b-a4ea-1967b99459c5	ord-9001	item-104	1	480	2026-08-07 12:16:09.532	2026-08-07 12:16:09.532
dd5c2455-1d03-4499-93f2-32da38a457b2	f38116d4-a697-469a-87b8-1e99312ee6a4	33597539-c286-44ab-b26f-6fdfe35c9173	2	450	2026-08-10 08:17:32.045	2026-08-10 08:17:32.045
fcc0faff-d779-46ef-a194-a2e677d0fa02	f38116d4-a697-469a-87b8-1e99312ee6a4	33597539-c286-44ab-b26f-6fdfe35c9173	1	250	2026-08-10 08:17:32.048	2026-08-10 08:17:32.048
f8d1fcb3-a3e0-46c2-8c4e-926c2b08f6f4	64e0355f-5359-44ca-b67e-112667dd3bc8	item-101	2	240	2026-08-10 08:31:59.88	2026-08-10 08:31:59.88
06175f43-b3a3-4fbf-8984-5a4cc4df1674	b0740a08-3c6f-4fe3-ac5e-b4169acad593	c2e3c1f5-46db-4f3c-951f-fc012398fc92	2	480	2026-08-10 08:35:28.052	2026-08-10 08:35:28.052
e9b159d2-799a-45e3-8ebd-e011043efd69	77d55f74-80dd-4d5a-9351-771a8c318b74	984e84bb-4d6f-4378-a49a-65445cd4c00d	2	480	2026-08-10 08:36:19.644	2026-08-10 08:36:19.644
ebd43ee4-222f-4e0a-b06f-b2ffd1c6136a	7f12bf06-c9f7-4afa-bb86-a170d0eb5910	11d1dc82-b5c0-4ad7-9240-a4c0bbf3a274	2	480	2026-08-11 06:46:26.938	2026-08-11 06:46:26.938
f7f2a7c0-2b6e-4473-ab6c-ab77c8c8ca1e	a5dc4ad3-ee2b-4cab-a363-1c14329a5f9d	item-102	1	650	2026-08-11 06:59:23.257	2026-08-11 06:59:23.257
3d707544-0d9a-4949-9ab4-8efaf0247950	a5dc4ad3-ee2b-4cab-a363-1c14329a5f9d	item-103	1	198	2026-08-11 06:59:23.259	2026-08-11 06:59:23.259
76585e69-747b-49b0-85ab-d2b2500f6dcd	d49e9d9b-28e5-43da-b01d-ee9317263a2e	item-101	2	240	2026-08-11 07:26:45.05	2026-08-11 07:26:45.05
3b7ea8b5-f10c-4722-abc7-4a46f7fe3bd7	8f79903d-d7e2-4a7d-b56a-354a6d30fe27	c53ede2c-5ed8-4867-b47e-2cf908c44544	2	480	2026-08-11 07:26:53.5	2026-08-11 07:26:53.5
2bd0a877-0f2c-437a-bfae-959a3742bbe7	7f3edfa7-b0f8-4d39-83c0-bc35443b9388	item-103	2	360	2026-08-11 11:55:40.398	2026-08-11 11:55:40.398
fa1a5900-ee3a-4901-9b35-92f1a7681cb3	7f3edfa7-b0f8-4d39-83c0-bc35443b9388	item-104	1	480	2026-08-11 11:55:40.401	2026-08-11 11:55:40.401
ceee2323-5b05-49c6-8a3a-2a015d9b1af8	af3b2433-567e-41a9-954e-d0b0989ba188	item-103	1	360	2026-08-11 11:55:40.432	2026-08-11 11:55:40.432
67891dfd-c1d0-492f-865d-cda923e6f85e	dbfabe6b-c59f-4eb5-a96f-b7a349602da2	item-103	1	360	2026-08-11 11:55:40.443	2026-08-11 11:55:40.443
9a8467c9-e0ec-47ba-b27d-59f83bdf4f1a	b193c5b8-77e7-45f1-b66e-f0741f6ab92b	5cd3073b-4364-4f5c-839f-0228dff2f2c4	1	350	2026-08-11 11:55:40.493	2026-08-11 11:55:40.493
946332f0-3bc7-4305-80ad-313ed87bbb1f	6c31bdd0-0da8-4897-a8b1-6151a080fe66	item-103	2	360	2026-08-11 11:56:25.353	2026-08-11 11:56:25.353
540dc2ca-03cf-4b18-83fc-f84f9cb60d98	6c31bdd0-0da8-4897-a8b1-6151a080fe66	item-104	1	480	2026-08-11 11:56:25.355	2026-08-11 11:56:25.355
4dbcd558-e029-4774-992d-b3859b089874	25e1e8a6-69da-4f9b-86bd-db7021669e75	item-103	1	360	2026-08-11 11:56:25.403	2026-08-11 11:56:25.403
4197d1a7-c1b3-45af-832e-9b05d633fb86	f5ac3729-b22e-4c40-81b3-91b35538f7a2	item-103	1	360	2026-08-11 11:56:25.432	2026-08-11 11:56:25.432
c02ba9d8-2be4-46a6-a416-418c0b880b00	0800eb91-f1f4-41e6-8956-78ab68afadf4	item-101	2	240	2026-08-11 11:57:38.169	2026-08-11 11:57:38.169
ce361bd0-bf28-4636-a1e4-a521ad8cf052	67a4f5d8-f6e9-4ef6-a9aa-6d61fac7d8a6	36e209d9-8e05-46be-9214-cecd8e4a09bb	2	480	2026-08-11 11:57:43.456	2026-08-11 11:57:43.456
030e20e9-d502-475a-9ce6-1c98c8b584b7	ce10e196-429f-4678-b9f3-a1020ef22462	item-103	2	360	2026-08-11 11:57:59.447	2026-08-11 11:57:59.447
45aaf9cf-d450-44c5-83a0-4f4090045e35	ce10e196-429f-4678-b9f3-a1020ef22462	item-104	1	480	2026-08-11 11:57:59.449	2026-08-11 11:57:59.449
2b9e436e-64ea-4ef3-bce8-8ee4d25a9c42	0648106f-cbeb-4945-98b1-42ab8570287c	item-103	1	360	2026-08-11 11:57:59.469	2026-08-11 11:57:59.469
0e124327-7534-46c3-bdb1-bb41f7637ba7	7776877d-6904-4be5-9fbc-37f1eb424cd2	item-103	1	360	2026-08-11 11:57:59.486	2026-08-11 11:57:59.486
2b17b032-e16a-48d7-a58b-14b10dd4fc2e	3813d6ad-75b8-41af-87d6-f9421928f4e6	item-102	1	520	2026-08-11 11:59:48.445	2026-08-11 11:59:48.445
81c008c1-097c-43af-ad36-ca7b2cb1d5bd	3813d6ad-75b8-41af-87d6-f9421928f4e6	item-101	1	240	2026-08-11 11:59:48.447	2026-08-11 11:59:48.447
5e8fbe2b-22b3-46be-bfac-7255fb10a401	e276c470-ab2d-406e-a05c-12314e35dece	item-103	2	360	2026-08-11 12:16:21.414	2026-08-11 12:16:21.414
62e2da65-af57-476a-9501-7b1f58b5b0be	e276c470-ab2d-406e-a05c-12314e35dece	item-104	1	480	2026-08-11 12:16:21.418	2026-08-11 12:16:21.418
63356cc3-6492-48ce-b854-db4e89e67c4d	bfa9b31c-917b-46dc-ad9d-6ee984ed5e02	item-103	1	360	2026-08-11 12:16:21.445	2026-08-11 12:16:21.445
6d9d16f3-51ab-47dd-8c45-7a909e7fe2b7	073ced24-a99e-477c-baf5-4ab47abb07ee	item-103	1	360	2026-08-11 12:16:21.457	2026-08-11 12:16:21.457
cb275961-f8c5-46b2-8e25-f40773f8432a	a963ddcc-db5a-4df2-ae6e-709a1b4720b0	item-103	1	360	2026-08-11 12:16:21.822	2026-08-11 12:16:21.822
a5694a72-099d-4591-9ac1-c80c64654c39	dec13afc-e4d4-4085-b986-a98fa31191ce	item-101	2	240	2026-08-11 12:17:29.887	2026-08-11 12:17:29.887
4dd69c18-af06-4549-98a9-b4d96e272056	beed09eb-a81a-4d8f-8c8a-b246f68dd5c1	7fb00dc4-e2d6-4746-9588-240c2dcf25e0	2	480	2026-08-11 12:17:52.752	2026-08-11 12:17:52.752
8579cf86-76d1-46f5-adf9-a9ee921b7cb3	5de97f19-4a4d-4714-9c10-796cafb6819b	item-102	1	520	2026-08-11 12:30:39.967	2026-08-11 12:30:39.967
b86a7bee-0d95-4604-9022-f1d5d21bd325	5de97f19-4a4d-4714-9c10-796cafb6819b	item-101	1	240	2026-08-11 12:30:39.97	2026-08-11 12:30:39.97
b6649f81-9c23-4fe0-90fc-aae499562f01	7e20f3c7-3075-43db-b913-c93cea0cfbeb	item-101	2	240	2026-08-11 12:40:09.627	2026-08-11 12:40:09.627
ccdf1331-3bfc-4c36-a1ea-797764888c03	7d111dc7-b6e3-4dbd-afc9-9db478fde7d9	7f314972-2268-41a3-b4f1-8399ab758b21	2	480	2026-08-11 12:40:17.42	2026-08-11 12:40:17.42
784353c9-a44e-4d22-8775-b92e8d2d4555	a1a71b8c-876f-445b-ad3a-d09ab3508bf7	item-101	2	240	2026-08-12 07:03:48.16	2026-08-12 07:03:48.16
f0876dc7-9073-4653-8039-6e018f188a06	5b478809-021a-468a-b2b7-c35cadb7d4a9	b768def3-1c0c-4b3b-9964-93a2b69cee1d	2	480	2026-08-12 07:03:52.886	2026-08-12 07:03:52.886
b82a077c-b486-46a5-adf0-8938460553a8	d0a20573-5d65-4221-bd60-021c67730a0d	item-101	2	240	2026-08-12 07:10:25.944	2026-08-12 07:10:25.944
18abc33d-c30f-400f-b44f-c9d00cc0e0e1	82885085-db27-4940-8710-54db4c4e7ca3	item-103	2	360	2026-08-12 07:10:58.375	2026-08-12 07:10:58.375
372f9e09-3fdb-488e-a701-a04bca5dc9e0	e32dcecc-0e76-4006-826a-d6793f4b5f5f	item-103	2	360	2026-08-12 07:11:17.309	2026-08-12 07:11:17.309
a92c58b2-ac83-473a-8443-8b0f9c0bc548	044b7793-143b-4164-a5d0-9469064d0642	2e729434-1148-440b-94c4-acadddd16a25	2	480	2026-08-12 07:11:20.937	2026-08-12 07:11:20.937
25b86d7c-db86-468a-9f40-68e120d894e1	8e705cab-9430-49ca-b038-ca8cae984c83	item-103	2	360	2026-08-13 07:03:50.824	2026-08-13 07:03:50.824
72cd897b-2303-4b06-82bd-fa0f4a51937f	ec9c742b-ac1c-4e8e-9802-aaeb0bf834c6	ee7f95b0-ed52-4bb8-9ffd-13141a32f223	2	480	2026-08-13 07:03:59.016	2026-08-13 07:03:59.016
13e67be9-b1b9-4bc6-938e-f0a9b3db0cf0	9ca08944-7641-4f4a-be56-44424951d045	item-103	1	360	2026-08-13 07:19:13.278	2026-08-13 07:19:13.278
5b849193-9f63-4a2e-af5a-79f1841c32f0	9ca08944-7641-4f4a-be56-44424951d045	item-104	1	480	2026-08-13 07:19:13.28	2026-08-13 07:19:13.28
56832456-a3df-4d8e-8e96-5a7f6ba6c11f	6637f5db-b30e-43a5-b585-45009e203da9	item-103	2	360	2026-08-14 06:32:39.246	2026-08-14 06:32:39.246
489cc7e7-d2f3-42cc-b2cb-f19090f0732f	bc5c69d7-129d-4d5e-a018-24f0984880d0	0ab01fe1-e5ab-4d04-a269-2af770d930c8	2	480	2026-08-14 06:32:46.622	2026-08-14 06:32:46.622
4367089e-5acc-4f97-b27e-1e57966d8253	04d9956a-2f96-4ac8-9f24-bdde39667902	item-103	2	360	2026-08-14 06:39:55.593	2026-08-14 06:39:55.593
1b3185ee-5221-40dd-b0fd-1260860dcc8c	0faf8eb1-f494-440a-aaaf-9a1ff8ae24d5	item-103	100000	360	2026-08-14 06:39:55.681	2026-08-14 06:39:55.681
610b8659-a714-47aa-9201-b20173b99633	39f26239-25cc-4d7c-b3f5-8402674ed2a9	item-103	1	360	2026-08-14 06:39:55.694	2026-08-14 06:39:55.694
d1510962-290d-4b94-bede-24cb85d1bdf7	9420ecfd-0bab-4c24-8914-eea7983e827d	item-103	2	360	2026-08-14 06:40:53.228	2026-08-14 06:40:53.228
d236ce85-d417-4aac-8ce6-ea0084309c7e	3e9cf25f-ff24-41cb-9a26-35b2009d182c	item-103	1	360	2026-08-14 06:40:53.315	2026-08-14 06:40:53.315
b189bb87-51ef-4551-9e9f-1d47786d6a2f	8540a84b-be6c-47fc-ad6d-c4f819aefb0e	item-103	2	360	2026-08-14 06:41:09.424	2026-08-14 06:41:09.424
18affd8e-348c-410d-be2b-6a305f61cb49	60a6d5ff-caa0-4f99-98df-644f90432a8c	item-103	1	360	2026-08-14 06:41:09.532	2026-08-14 06:41:09.532
7b6b338d-922e-43dd-a636-991d9c9f3523	bc725d80-ffca-4e06-a38d-3dc51f7694db	item-103	2	360	2026-08-14 06:41:27.162	2026-08-14 06:41:27.162
419aed65-abd3-4336-b6b0-1f1fe9669263	f751e81d-8ca2-481d-8291-22d9fd1e8f22	item-103	2	360	2026-08-14 06:41:59.719	2026-08-14 06:41:59.719
d5bb26e5-9d62-4ac7-9977-c5c4a4c1ea91	c89f1576-76aa-4d69-b2f3-40320afccdb5	07cef8e6-537b-4dc4-bd24-1bb7adb0d59e	2	480	2026-08-14 06:42:07.007	2026-08-14 06:42:07.007
47fcb0f7-991a-4ffe-9aed-adc59ce1ed6b	f37e8bd8-c05a-4273-ab8b-f98d48c16c69	item-103	2	360	2026-08-14 06:46:47.159	2026-08-14 06:46:47.159
0ec9eda7-9422-4474-9e36-387dba77e4ba	18f1c131-8e29-47c4-903a-87a74e87578d	item-103	2	360	2026-08-15 07:21:57.223	2026-08-15 07:21:57.223
38f07b0e-f667-486e-b1f9-6c453d9488c5	676eae5d-28e1-4b52-8fb9-ca172ae792fc	8d77c7e0-4fbf-4613-abca-5c387848e28f	2	480	2026-08-15 07:22:03.028	2026-08-15 07:22:03.028
194f464c-e340-4afb-9d66-9a7d8dd2bf9a	019fee2b-842c-453e-bd7d-341f0fe38e19	item-103	2	360	2026-08-15 07:51:34.069	2026-08-15 07:51:34.069
64689725-c398-4890-b3a0-2385bb595d58	581a629f-2493-48a2-9874-5caccf252512	e71f7fce-11ef-4974-9798-e4766c2d60ab	2	480	2026-08-15 07:51:38.552	2026-08-15 07:51:38.552
d6aebf23-88d2-4c91-95b3-9a88e9b7999c	81e5aa49-97c1-4cd0-8459-77590a409fa0	item-102	1	520	2026-08-15 07:52:44.996	2026-08-15 07:52:44.996
b4ff51c7-5cf1-471d-9877-15cfb094f091	73dfb146-d7f5-49c1-a064-5ef139c76170	item-103	2	360	2026-08-15 19:36:29.416	2026-08-15 19:36:29.416
5f596ec8-9a5c-49ba-a247-e1ad251f60cc	fc9ea85f-eebe-4db6-84e9-d7e0bdce06a9	9cdd27d4-5eeb-4321-a8ec-8343f6c94835	2	480	2026-08-15 19:36:35.829	2026-08-15 19:36:35.829
e24496c1-a138-4675-9d86-154f71d2dca6	f9483c4d-3af1-4be0-9f95-570be45cfb98	item-103	2	360	2026-08-15 19:36:51.761	2026-08-15 19:36:51.761
2466fc2c-7ec9-4004-9111-4a1f9e303caa	d8774f25-177e-4add-9e8b-333a7fdcfa2d	item-103	1	360	2026-08-15 19:36:51.866	2026-08-15 19:36:51.866
b519c3dd-2273-42ff-83aa-26d3b2c75e33	7c2d128b-ef3e-417b-961b-252784ee5a27	item-103	1	360	2026-08-15 19:36:53.682	2026-08-15 19:36:53.682
cdb4d8b1-fd12-44f6-ba0a-84888a3ce5fe	ef3fdc75-588e-497f-80b9-dfde9e4f9b20	item-103	1	360	2026-08-15 19:36:53.696	2026-08-15 19:36:53.696
5211eff9-34cc-4f8f-b221-42956ef91228	c4ea04ff-6572-4476-bd68-6d228a12db0e	item-103	1	360	2026-08-15 19:37:21.376	2026-08-15 19:37:21.376
ed7874a7-b442-4aaa-94f9-5cfb108c0aac	76a9a9ae-e8d3-426d-b49a-0a73aaca917c	item-103	1	360	2026-08-15 19:37:21.399	2026-08-15 19:37:21.399
98538a64-eb8b-43cc-8ed0-7a30f260609f	15e5179e-cb97-44c7-b4d0-3ea71b6e1630	item-103	1	360	2026-08-15 19:37:44.516	2026-08-15 19:37:44.516
92372530-3903-46f2-9937-8c9a207528f8	c9200655-7898-47af-91b0-d2ae562c0fca	item-103	1	360	2026-08-15 19:37:44.54	2026-08-15 19:37:44.54
6551f571-1ee6-4c3f-8732-7feed6711d7b	9ae87748-9ab2-4cdc-a074-436169d69656	item-103	2	360	2026-08-15 19:38:20.134	2026-08-15 19:38:20.134
fd9e5a4c-fa9d-4702-b796-6407e2977cad	9ae87748-9ab2-4cdc-a074-436169d69656	e739eb94-35ab-4865-b96d-7e1a63646cf2	1	150	2026-08-15 19:38:20.135	2026-08-15 19:38:20.135
26c37f3d-058c-490d-888e-de9f77ba37d0	c207c9b6-ab45-4147-9f5d-17a3cdb28cbf	item-103	1	360	2026-08-15 19:38:20.162	2026-08-15 19:38:20.162
8bc68040-b2f2-4d78-a26d-9235e2867949	8c622b0f-7109-4f9b-bd39-8ad3ae056bab	item-103	1	360	2026-08-15 19:38:20.177	2026-08-15 19:38:20.177
622daade-e5e5-46fb-8fa7-cbde6134a694	f2fffca2-1cf0-4315-8116-336270a9254a	item-103	1	360	2026-08-15 19:38:20.481	2026-08-15 19:38:20.481
a5cd51f8-3274-4fa2-ac22-6bc2fb09f201	18a0ab4f-1009-4991-a904-e9f2116d419a	item-102	1	520	2026-08-15 19:41:25.142	2026-08-15 19:41:25.142
c14ded9a-9d9e-4f95-9d7b-02009b4794aa	f9958bed-4852-47e1-98e3-f2c2fd254bf1	item-103	2	360	2026-08-15 20:08:28.935	2026-08-15 20:08:28.935
0a652ab7-5031-4457-ba33-40fd8aad2e24	a2ccc1bf-5270-4d7f-b147-1bd3043da60c	item-103	1	360	2026-08-15 20:08:28.972	2026-08-15 20:08:28.972
29ea232f-4457-4aaa-a9fc-a4c8143dc19c	a41d852d-11ba-4102-a8f6-091b4204c614	item-103	2	360	2026-08-15 20:09:23.765	2026-08-15 20:09:23.765
530b3b60-b898-4b10-8ceb-a352d9b63c01	d8a00e8c-a7fd-4fe5-b430-b1cbddd9bd3f	0c3c4352-ebf0-4fdb-af8a-ddd6fdce04f4	2	480	2026-08-15 20:09:29.145	2026-08-15 20:09:29.145
1982cbda-6bc8-445f-a4c9-cec9a3b3abd3	7a405081-4b0e-4bea-897a-b116d8c779eb	item-103	2	360	2026-08-15 20:13:07.529	2026-08-15 20:13:07.529
b6ea3108-eee8-4c08-ba2d-1ebf7ee2fc67	e40269e6-89da-4814-b112-f9c62a487f11	item-103	1	360	2026-08-15 20:13:07.588	2026-08-15 20:13:07.588
3aa9d803-b1ac-424a-8ccb-0683b737cfb5	24a52f40-c0fb-4076-bf2b-72998d852a7f	item-103	2	360	2026-08-15 20:13:18.933	2026-08-15 20:13:18.933
92ceb0c2-dd5a-490c-a6ac-38fdb9c3ff71	55c2f987-5a2a-4751-b72b-04df8ce486dd	582c67d8-55a8-4fcc-a8d9-9eaeb0d8a524	2	480	2026-08-15 20:13:25.425	2026-08-15 20:13:25.425
9379fda9-0c28-40de-ab70-58347ccd2969	2c95c776-8e47-4989-b828-45f091a36e1a	item-103	1	360	2026-08-15 20:19:01.569	2026-08-15 20:19:01.569
739129cd-77e1-44ad-8c27-09510c36cadc	fddf3567-f2c0-4481-8b55-ad60aff4d546	item-103	2	360	2026-08-16 07:14:12.308	2026-08-16 07:14:12.308
31c4a35a-38c2-4435-a965-5bb6070acc8f	4f50e665-941f-483f-940e-f2fbc60ecaf8	item-103	1	360	2026-08-16 07:14:12.355	2026-08-16 07:14:12.355
d13857a0-8d0a-4119-b9a1-2cac8b0e7197	2fddf904-a7a4-4dfb-b47a-6e52b037e7ce	item-103	2	360	2026-08-16 07:14:23.503	2026-08-16 07:14:23.503
40c78b92-f6d7-4b96-bfe5-478ed2f56a76	07f9b393-de38-4d15-8fbd-c88a3df61756	d6969698-6989-489d-9e01-24bfb6a66d23	2	480	2026-08-16 07:14:25.129	2026-08-16 07:14:25.129
e498fb36-0bcd-48b6-b06f-e56c30c8b30f	6fc9985f-ac35-42b3-9491-78101b84eae4	item-103	2	360	2026-08-16 07:14:36.343	2026-08-16 07:14:36.343
3744d08e-830e-4b61-8a45-c6350a249284	6fc9985f-ac35-42b3-9491-78101b84eae4	e739eb94-35ab-4865-b96d-7e1a63646cf2	1	150	2026-08-16 07:14:36.344	2026-08-16 07:14:36.344
efdf5be3-17c8-4fbb-b681-80a5b32791b6	6efb1f9f-1621-4ed4-994a-38f27905c1b1	item-103	1	360	2026-08-16 07:14:36.359	2026-08-16 07:14:36.359
ba9c21d7-838a-41cc-b6da-210a931f4bcb	d02ab228-540d-4d2d-b5c6-fbd9452f6160	item-103	1	360	2026-08-16 07:14:36.368	2026-08-16 07:14:36.368
71bdfc7d-d10a-4531-b9d0-d3ad30a53032	7c38d77e-16a8-402e-8710-915d54645ec5	item-103	1	360	2026-08-16 07:14:36.702	2026-08-16 07:14:36.702
48b8b654-754b-4906-a476-3f58078f3dc8	677635c9-5880-45d9-8b88-5963d76244b5	item-103	2	360	2026-08-16 07:14:39.058	2026-08-16 07:14:39.058
a9b4b9e3-6796-4c47-9fad-77c42a47d5b4	677635c9-5880-45d9-8b88-5963d76244b5	e739eb94-35ab-4865-b96d-7e1a63646cf2	1	150	2026-08-16 07:14:39.059	2026-08-16 07:14:39.059
8cb95499-f24e-4ee7-ae78-3735336bd8fa	1bd327bd-91f6-4089-a7a8-ccd75aec2d98	item-103	1	360	2026-08-16 07:14:39.073	2026-08-16 07:14:39.073
a6d1dd7f-28df-4403-aa0c-1e6e754d42fc	a8efe5f2-1cf3-4b39-8414-009814e09a2b	item-103	1	360	2026-08-16 07:14:39.1	2026-08-16 07:14:39.1
825fb1be-28cc-439d-8cd4-04720109946a	70260316-eb2f-4505-9391-0ee235b8c72a	item-103	1	360	2026-08-16 07:14:39.427	2026-08-16 07:14:39.427
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "orderId", amount, status, method, "restaurantId", "createdAt", "updatedAt", currency, "failureReason", "gatewayOrderId", "gatewayPaymentId", "gatewaySignature", "userId") FROM stdin;
2108a9c7-ce52-4a6c-83a1-588dc7ece41b	af3b2433-567e-41a9-954e-d0b0989ba188	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:55:40.433	2026-08-11 11:55:40.433	INR	\N	\N	\N	\N	u-customer-1
bda060c3-9105-4f29-ac36-dd289229b39b	dbfabe6b-c59f-4eb5-a96f-b7a349602da2	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:55:40.445	2026-08-11 11:55:40.445	INR	\N	\N	\N	\N	u-customer-1
34db7be9-684f-44e5-9b68-7b74eae9cc7c	b193c5b8-77e7-45f1-b66e-f0741f6ab92b	350	PENDING	CARD	the-urban-cafe	2026-08-11 11:55:40.497	2026-08-11 11:55:40.497	INR	\N	\N	\N	\N	\N
c6eb47f3-19fc-48ad-8c8c-d066e90accab	7f3edfa7-b0f8-4d39-83c0-bc35443b9388	1200	SUCCESS	CARD	the-urban-cafe	2026-08-11 11:55:40.404	2026-08-11 11:55:40.655	INR	\N	\N	pay_test_12345	\N	u-customer-1
b707a01e-8367-49be-9098-d779638cdf95	25e1e8a6-69da-4f9b-86bd-db7021669e75	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:56:25.404	2026-08-11 11:56:25.404	INR	\N	\N	\N	\N	u-customer-1
b1a27e45-c357-4d67-82a6-67ef0bd3f62b	f5ac3729-b22e-4c40-81b3-91b35538f7a2	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:56:25.433	2026-08-11 11:56:25.433	INR	\N	\N	\N	\N	u-customer-1
e7b0aea3-20d4-4db0-a998-5da7fd8201ba	6c31bdd0-0da8-4897-a8b1-6151a080fe66	1200	SUCCESS	CARD	the-urban-cafe	2026-08-11 11:56:25.357	2026-08-11 11:56:25.725	INR	\N	\N	pay_test_12345	\N	u-customer-1
4fea6813-1d71-40f2-93f9-0f5b3c29bf14	0800eb91-f1f4-41e6-8956-78ab68afadf4	480	PENDING	CARD	the-urban-cafe	2026-08-11 11:57:38.17	2026-08-11 11:57:38.17	INR	\N	\N	\N	\N	\N
1dda7de6-c58c-4e77-92ed-d6d9844de3ea	67a4f5d8-f6e9-4ef6-a9aa-6d61fac7d8a6	960	PENDING	UPI	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:43.46	2026-08-11 11:57:43.46	INR	\N	\N	\N	\N	u-customer-1
fd830d9d-7c85-4f21-ba37-65b39680688b	0648106f-cbeb-4945-98b1-42ab8570287c	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:57:59.47	2026-08-11 11:57:59.47	INR	\N	\N	\N	\N	u-customer-1
4de9306e-5f97-463b-9b49-9c66c0870820	7776877d-6904-4be5-9fbc-37f1eb424cd2	360	PENDING	CARD	the-urban-cafe	2026-08-11 11:57:59.487	2026-08-11 11:57:59.487	INR	\N	\N	\N	\N	u-customer-1
27f6ae7f-923c-4f87-85e8-1a7ed6de2800	ce10e196-429f-4678-b9f3-a1020ef22462	1200	SUCCESS	CARD	the-urban-cafe	2026-08-11 11:57:59.45	2026-08-11 11:57:59.789	INR	\N	\N	pay_test_12345	\N	u-customer-1
14e075ca-8a43-423e-9c68-f9bb56dcece8	3813d6ad-75b8-41af-87d6-f9421928f4e6	760	PENDING	UPI	the-urban-cafe	2026-08-11 11:59:48.449	2026-08-11 11:59:48.449	INR	\N	\N	\N	\N	\N
7887f006-3e7e-419c-9917-fc1c89f04fb6	bfa9b31c-917b-46dc-ad9d-6ee984ed5e02	360	PENDING	CARD	the-urban-cafe	2026-08-11 12:16:21.446	2026-08-11 12:16:21.446	INR	\N	\N	\N	\N	u-customer-1
2847f544-ec14-474b-adc0-3d89df023959	073ced24-a99e-477c-baf5-4ab47abb07ee	360	PENDING	CARD	the-urban-cafe	2026-08-11 12:16:21.458	2026-08-11 12:16:21.458	INR	\N	\N	\N	\N	u-customer-1
d42e78fb-914a-4310-bcf7-977a558bbc6b	e276c470-ab2d-406e-a05c-12314e35dece	1200	SUCCESS	CARD	the-urban-cafe	2026-08-11 12:16:21.42	2026-08-11 12:16:21.78	INR	\N	\N	pay_test_12345	\N	u-customer-1
4397b5b2-1a85-4e67-9ca7-5e3eadb124f4	a963ddcc-db5a-4df2-ae6e-709a1b4720b0	360	PENDING	CARD	the-urban-cafe	2026-08-11 12:16:21.823	2026-08-11 12:16:21.823	INR	\N	\N	\N	\N	\N
73209080-1ddb-43ff-8af9-9169beae56b5	dec13afc-e4d4-4085-b986-a98fa31191ce	480	PENDING	CARD	the-urban-cafe	2026-08-11 12:17:29.888	2026-08-11 12:17:29.888	INR	\N	\N	\N	\N	\N
b770e188-07df-429c-b858-b38041e18bc7	beed09eb-a81a-4d8f-8c8a-b246f68dd5c1	960	PENDING	UPI	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.753	2026-08-11 12:17:52.753	INR	\N	\N	\N	\N	u-customer-1
64b17b96-70d2-4756-b055-8dd8a12a50f7	5de97f19-4a4d-4714-9c10-796cafb6819b	760	PENDING	UPI	the-urban-cafe	2026-08-11 12:30:39.974	2026-08-11 12:30:39.974	INR	\N	\N	\N	\N	\N
b1488744-1214-4540-9372-025811a48841	7e20f3c7-3075-43db-b913-c93cea0cfbeb	480	PENDING	CARD	the-urban-cafe	2026-08-11 12:40:09.628	2026-08-11 12:40:09.628	INR	\N	\N	\N	\N	\N
69a8789d-a533-4dec-99d9-998168b6a4dc	7d111dc7-b6e3-4dbd-afc9-9db478fde7d9	960	PENDING	UPI	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:17.422	2026-08-11 12:40:17.422	INR	\N	\N	\N	\N	u-customer-1
d565f98c-941c-4833-ba38-18db2620bc12	a1a71b8c-876f-445b-ad3a-d09ab3508bf7	480	PENDING	CARD	the-urban-cafe	2026-08-12 07:03:48.162	2026-08-12 07:03:48.162	INR	\N	\N	\N	\N	\N
ee295940-d95a-4a24-b7c8-794a1e06d1c5	5b478809-021a-468a-b2b7-c35cadb7d4a9	960	PENDING	UPI	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.887	2026-08-12 07:03:52.887	INR	\N	\N	\N	\N	u-customer-1
f995c4a0-f2d9-48cc-b327-31161b5bff8a	d0a20573-5d65-4221-bd60-021c67730a0d	480	PENDING	CARD	the-urban-cafe	2026-08-12 07:10:25.945	2026-08-12 07:10:25.945	INR	\N	\N	\N	\N	\N
69952b5e-3764-49a5-9d90-a4f109c23b8b	82885085-db27-4940-8710-54db4c4e7ca3	720	PENDING	CARD	the-urban-cafe	2026-08-12 07:10:58.384	2026-08-12 07:10:58.384	INR	\N	\N	\N	\N	\N
72c8b1bd-6240-4377-8631-3252f78e9dfd	e32dcecc-0e76-4006-826a-d6793f4b5f5f	720	PENDING	CARD	the-urban-cafe	2026-08-12 07:11:17.31	2026-08-12 07:11:17.31	INR	\N	\N	\N	\N	\N
f6ed2c4f-2e72-4f3f-95dd-0abedfd62631	044b7793-143b-4164-a5d0-9469064d0642	960	PENDING	UPI	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.938	2026-08-12 07:11:20.938	INR	\N	\N	\N	\N	u-customer-1
52705d92-e892-4cbe-ab26-dedf885ce758	8e705cab-9430-49ca-b038-ca8cae984c83	720	PENDING	CARD	the-urban-cafe	2026-08-13 07:03:50.826	2026-08-13 07:03:50.826	INR	\N	\N	\N	\N	\N
1ff15f02-60c0-455a-8e21-77caef2c93ee	ec9c742b-ac1c-4e8e-9802-aaeb0bf834c6	960	PENDING	UPI	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:59.018	2026-08-13 07:03:59.018	INR	\N	\N	\N	\N	u-customer-1
f51aded6-5100-4760-ab8b-8a86964e0097	9ca08944-7641-4f4a-be56-44424951d045	840	PENDING	CASH	the-urban-cafe	2026-08-13 07:19:13.281	2026-08-13 07:19:13.281	INR	\N	\N	\N	\N	\N
33b8da34-2527-442b-876a-9aefaccabce9	6637f5db-b30e-43a5-b585-45009e203da9	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:32:39.249	2026-08-14 06:32:39.249	INR	\N	\N	\N	\N	\N
f8f88020-a1c9-4847-a307-e1fd57fce6cf	bc5c69d7-129d-4d5e-a018-24f0984880d0	960	PENDING	UPI	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.624	2026-08-14 06:32:46.624	INR	\N	\N	\N	\N	u-customer-1
296300cc-38f8-486e-93f7-58e5c390d2e0	04d9956a-2f96-4ac8-9f24-bdde39667902	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:39:55.595	2026-08-14 06:39:55.595	INR	\N	\N	\N	\N	\N
958181b1-4773-4416-9e2e-217d62a02bd1	0faf8eb1-f494-440a-aaaf-9a1ff8ae24d5	36000000	PENDING	CARD	the-urban-cafe	2026-08-14 06:39:55.682	2026-08-14 06:39:55.682	INR	\N	\N	\N	\N	\N
a1156fc8-2905-42f7-bebe-a13c52ea5d91	39f26239-25cc-4d7c-b3f5-8402674ed2a9	360	PENDING	CARD	the-urban-cafe	2026-08-14 06:39:55.695	2026-08-14 06:39:55.695	INR	\N	\N	\N	\N	\N
33a744ec-da7e-41ba-be73-4b669dfc20b9	9420ecfd-0bab-4c24-8914-eea7983e827d	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:40:53.231	2026-08-14 06:40:53.231	INR	\N	\N	\N	\N	\N
81c8ac24-590a-4eef-8ad3-fc9619817f0e	3e9cf25f-ff24-41cb-9a26-35b2009d182c	360	PENDING	CARD	the-urban-cafe	2026-08-14 06:40:53.316	2026-08-14 06:40:53.316	INR	\N	\N	\N	\N	\N
572481d4-e81a-48ba-941d-c912b719e155	8540a84b-be6c-47fc-ad6d-c4f819aefb0e	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:41:09.425	2026-08-14 06:41:09.425	INR	\N	\N	\N	\N	\N
27fe898d-eba0-4327-b358-407ca4400bea	60a6d5ff-caa0-4f99-98df-644f90432a8c	360	PENDING	CARD	the-urban-cafe	2026-08-14 06:41:09.533	2026-08-14 06:41:09.533	INR	\N	\N	\N	\N	\N
f7335bf9-3916-4aef-80eb-c94da2b9d93e	bc725d80-ffca-4e06-a38d-3dc51f7694db	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:41:27.163	2026-08-14 06:41:27.163	INR	\N	\N	\N	\N	\N
78f8625d-588c-4ecf-b2b9-5edd41a3f2bb	f751e81d-8ca2-481d-8291-22d9fd1e8f22	720	PENDING	CARD	the-urban-cafe	2026-08-14 06:41:59.72	2026-08-14 06:41:59.72	INR	\N	\N	\N	\N	\N
5d75bb5a-9c81-4c45-9ab3-495d36af9eb4	c89f1576-76aa-4d69-b2f3-40320afccdb5	960	PENDING	UPI	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:07.008	2026-08-14 06:42:07.008	INR	\N	\N	\N	\N	u-customer-1
dc93bcd1-7230-43bd-b0fc-b32186cdee4e	f37e8bd8-c05a-4273-ab8b-f98d48c16c69	720	PENDING	CASH	the-urban-cafe	2026-08-14 06:46:47.16	2026-08-14 06:46:47.16	INR	\N	\N	\N	\N	\N
d7043121-784a-4a12-97bc-f468646992cf	18f1c131-8e29-47c4-903a-87a74e87578d	720	PENDING	CARD	the-urban-cafe	2026-08-15 07:21:57.224	2026-08-15 07:21:57.224	INR	\N	\N	\N	\N	\N
7c8ece36-4dda-4647-a31f-caadfdad3bea	676eae5d-28e1-4b52-8fb9-ca172ae792fc	960	PENDING	UPI	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:03.029	2026-08-15 07:22:03.029	INR	\N	\N	\N	\N	u-customer-1
289b056c-d272-4470-82f7-e6c4810c1269	019fee2b-842c-453e-bd7d-341f0fe38e19	720	PENDING	CARD	the-urban-cafe	2026-08-15 07:51:34.07	2026-08-15 07:51:34.07	INR	\N	\N	\N	\N	\N
52a1a49d-856b-44c2-be35-389f8239e561	581a629f-2493-48a2-9874-5caccf252512	960	PENDING	UPI	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.553	2026-08-15 07:51:38.553	INR	\N	\N	\N	\N	u-customer-1
2efd4122-e2d4-455c-81f7-bf150e761a0b	81e5aa49-97c1-4cd0-8459-77590a409fa0	520	PENDING	UPI	the-urban-cafe	2026-08-15 07:52:44.997	2026-08-15 07:52:44.997	INR	\N	\N	\N	\N	\N
05c39797-aeb7-43ab-b672-594c49f8151c	73dfb146-d7f5-49c1-a064-5ef139c76170	720	PENDING	CARD	the-urban-cafe	2026-08-15 19:36:29.42	2026-08-15 19:36:29.42	INR	\N	\N	\N	\N	\N
ca211314-a8b1-438f-9cec-4af9567f83fa	fc9ea85f-eebe-4db6-84e9-d7e0bdce06a9	960	PENDING	UPI	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.83	2026-08-15 19:36:35.83	INR	\N	\N	\N	\N	u-customer-1
f6843fc7-ec9c-4945-b781-9debe7eafc86	f9483c4d-3af1-4be0-9f95-570be45cfb98	720	PENDING	CARD	the-urban-cafe	2026-08-15 19:36:51.762	2026-08-15 19:36:51.762	INR	\N	\N	\N	\N	\N
b89ca3d5-f31f-4bf7-a3b4-9663bf01aa13	d8774f25-177e-4add-9e8b-333a7fdcfa2d	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:36:51.867	2026-08-15 19:36:51.867	INR	\N	\N	\N	\N	\N
811ead58-5250-4568-a382-512b80942396	7c2d128b-ef3e-417b-961b-252784ee5a27	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:36:53.683	2026-08-15 19:36:53.683	INR	\N	\N	\N	\N	u-customer-1
60ab0af9-00ae-4a60-ba83-a8f14e33c708	ef3fdc75-588e-497f-80b9-dfde9e4f9b20	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:36:53.697	2026-08-15 19:36:53.697	INR	\N	\N	\N	\N	u-customer-1
d570e26d-a718-43e6-89f0-d8718d56afab	c4ea04ff-6572-4476-bd68-6d228a12db0e	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:37:21.378	2026-08-15 19:37:21.378	INR	\N	\N	\N	\N	u-customer-1
56ff46ab-d157-4756-850a-01da67a07ead	76a9a9ae-e8d3-426d-b49a-0a73aaca917c	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:37:21.4	2026-08-15 19:37:21.4	INR	\N	\N	\N	\N	u-customer-1
a122c468-2e53-41bd-9275-dbad84fda850	15e5179e-cb97-44c7-b4d0-3ea71b6e1630	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:37:44.517	2026-08-15 19:37:44.517	INR	\N	\N	\N	\N	u-customer-1
6f6c5ae4-68df-4ab5-b51c-525362823ba7	c9200655-7898-47af-91b0-d2ae562c0fca	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:37:44.54	2026-08-15 19:37:44.54	INR	\N	\N	\N	\N	u-customer-1
da9d780d-5031-4fbf-8900-637b43a40466	c207c9b6-ab45-4147-9f5d-17a3cdb28cbf	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:38:20.162	2026-08-15 19:38:20.162	INR	\N	\N	\N	\N	u-customer-1
60ef0dc6-9a70-4f91-a292-aee02ffb78da	8c622b0f-7109-4f9b-bd39-8ad3ae056bab	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:38:20.177	2026-08-15 19:38:20.177	INR	\N	\N	\N	\N	u-customer-1
d3f0f911-8e4d-4e80-a0c2-c8dfaf9a77d1	9ae87748-9ab2-4cdc-a074-436169d69656	870	SUCCESS	CARD	the-urban-cafe	2026-08-15 19:38:20.135	2026-08-15 19:38:20.439	INR	\N	\N	pay_test_12345	\N	u-customer-1
b4805a53-bfd5-4911-ae6b-8397691bdcb2	f2fffca2-1cf0-4315-8116-336270a9254a	360	PENDING	CARD	the-urban-cafe	2026-08-15 19:38:20.481	2026-08-15 19:38:20.481	INR	\N	\N	\N	\N	\N
838f505b-1072-4cae-be00-e073eeaf0ac2	18a0ab4f-1009-4991-a904-e9f2116d419a	520	PENDING	CASH	the-urban-cafe	2026-08-15 19:41:25.144	2026-08-15 19:41:25.144	INR	\N	\N	\N	\N	\N
72d5961d-489f-441d-9375-ab04e6761518	f9958bed-4852-47e1-98e3-f2c2fd254bf1	720	PENDING	CARD	the-urban-cafe	2026-08-15 20:08:28.938	2026-08-15 20:08:28.938	INR	\N	\N	\N	\N	\N
bd386fc5-158a-41e7-aa89-ff69b275a2b8	a2ccc1bf-5270-4d7f-b147-1bd3043da60c	360	PENDING	CARD	the-urban-cafe	2026-08-15 20:08:28.974	2026-08-15 20:08:28.974	INR	\N	\N	\N	\N	\N
9bbc6169-01b8-4455-88cb-b10cd10fa850	a41d852d-11ba-4102-a8f6-091b4204c614	720	PENDING	CARD	the-urban-cafe	2026-08-15 20:09:23.766	2026-08-15 20:09:23.766	INR	\N	\N	\N	\N	\N
b35d0bb8-d2a8-43de-9d4e-2a8afab4e815	d8a00e8c-a7fd-4fe5-b430-b1cbddd9bd3f	960	PENDING	UPI	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:29.147	2026-08-15 20:09:29.147	INR	\N	\N	\N	\N	u-customer-1
3b1ab391-9273-4680-a021-40c481ddd048	7a405081-4b0e-4bea-897a-b116d8c779eb	720	PENDING	CARD	the-urban-cafe	2026-08-15 20:13:07.531	2026-08-15 20:13:07.531	INR	\N	\N	\N	\N	\N
a5785d15-ffc1-4786-bcfa-1b8da8db0452	e40269e6-89da-4814-b112-f9c62a487f11	360	PENDING	CARD	the-urban-cafe	2026-08-15 20:13:07.589	2026-08-15 20:13:07.589	INR	\N	\N	\N	\N	\N
6f79ac02-d937-4b66-9c67-dbb40d0a67d7	24a52f40-c0fb-4076-bf2b-72998d852a7f	720	PENDING	CARD	the-urban-cafe	2026-08-15 20:13:18.933	2026-08-15 20:13:18.933	INR	\N	\N	\N	\N	\N
9242bafb-d766-4dbb-8df6-5a4ea61307c3	55c2f987-5a2a-4751-b72b-04df8ce486dd	960	PENDING	UPI	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:25.426	2026-08-15 20:13:25.426	INR	\N	\N	\N	\N	u-customer-1
83cd0aca-b9a5-4725-bb56-0f493ece0dc2	2c95c776-8e47-4989-b828-45f091a36e1a	360	PENDING	CASH	the-urban-cafe	2026-08-15 20:19:01.571	2026-08-15 20:19:01.571	INR	\N	\N	\N	\N	\N
3c21ef96-5eef-48d5-a578-9d0b1e85502d	fddf3567-f2c0-4481-8b55-ad60aff4d546	720	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:12.311	2026-08-16 07:14:12.311	INR	\N	\N	\N	\N	\N
a72ce801-2693-4f24-8be8-4e3a619e2b0b	4f50e665-941f-483f-940e-f2fbc60ecaf8	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:12.356	2026-08-16 07:14:12.356	INR	\N	\N	\N	\N	\N
0a7b9442-fd6e-415c-8acf-938852897c59	2fddf904-a7a4-4dfb-b47a-6e52b037e7ce	720	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:23.504	2026-08-16 07:14:23.504	INR	\N	\N	\N	\N	\N
918d79e6-ae7e-4857-98d6-caffbf90f0fd	07f9b393-de38-4d15-8fbd-c88a3df61756	960	PENDING	UPI	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:25.13	2026-08-16 07:14:25.13	INR	\N	\N	\N	\N	u-customer-1
9fa87d66-751c-4d0f-9d45-e60b1432c58e	6efb1f9f-1621-4ed4-994a-38f27905c1b1	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:36.36	2026-08-16 07:14:36.36	INR	\N	\N	\N	\N	u-customer-1
cfe70db0-7223-4e02-aa47-bcd36c39b116	d02ab228-540d-4d2d-b5c6-fbd9452f6160	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:36.369	2026-08-16 07:14:36.369	INR	\N	\N	\N	\N	u-customer-1
71c01ddd-f5bb-4509-b9c9-70b257c50369	6fc9985f-ac35-42b3-9491-78101b84eae4	870	SUCCESS	CARD	the-urban-cafe	2026-08-16 07:14:36.344	2026-08-16 07:14:36.653	INR	\N	\N	pay_test_12345	\N	u-customer-1
f790972a-14fa-4add-bca7-4fa20754e46c	7c38d77e-16a8-402e-8710-915d54645ec5	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:36.703	2026-08-16 07:14:36.703	INR	\N	\N	\N	\N	\N
45a11860-ec6d-46d0-96d8-fa1aa2cb0acf	1bd327bd-91f6-4089-a7a8-ccd75aec2d98	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:39.074	2026-08-16 07:14:39.074	INR	\N	\N	\N	\N	u-customer-1
86a5c75b-317f-4f7b-982e-11b08fa8559a	a8efe5f2-1cf3-4b39-8414-009814e09a2b	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:39.101	2026-08-16 07:14:39.101	INR	\N	\N	\N	\N	u-customer-1
a7fc497d-60fa-4bdc-afd5-49017858de8f	677635c9-5880-45d9-8b88-5963d76244b5	870	SUCCESS	CARD	the-urban-cafe	2026-08-16 07:14:39.059	2026-08-16 07:14:39.377	INR	\N	\N	pay_test_12345	\N	u-customer-1
f6af8065-6aa5-4924-81c6-bd89a0623077	70260316-eb2f-4505-9391-0ee235b8c72a	360	PENDING	CARD	the-urban-cafe	2026-08-16 07:14:39.427	2026-08-16 07:14:39.427	INR	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Restaurant" (id, name, slug, city, address, phone, status, "createdAt", "updatedAt", "bannerUrl", code, cuisine, "deliveryFee", "imageUrl", "minOrder", rating, "reviewCount") FROM stdin;
burger-hub	Burger Hub	burger-hub	Mumbai	Andheri West, Link Road, Mumbai	+91 98765 22222	ACTIVE	2026-08-07 12:16:09.508	2026-08-07 12:16:09.508	https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200	BURGER123	American & Burgers	35	https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800	150	4.6	18
spice-symphony	Spice Symphony	spice-symphony	Pune	Koregaon Park, Lane 7, Pune	+91 98765 33333	ACTIVE	2026-08-07 12:16:09.509	2026-08-07 12:16:09.509	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200	SPICE123	North Indian & Mughlai	50	https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800	300	4.7	32
61fc09de-12db-4e4a-86b1-a370f9b5e8a8	Royal Spice Palace 1786349851640	royal-spice-palace-1786349851640	Mumbai	Marine Drive, Nariman Point, Mumbai	+91 98200 12345	ACTIVE	2026-08-10 08:17:31.687	2026-08-10 08:17:31.687	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	ROYA155	North Indian & Mughlai	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
52ba7639-afe8-48bb-a354-8c9541038a58	E2E Artisan Bistro	e2e-bistro-1786430786017	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-11 06:46:26.037	2026-08-15 21:28:28.079	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST135	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
2c49b364-beeb-4bb4-b348-8ee58317e5cd	E2E Artisan Bistro	e2e-bistro-1786449462843	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-11 11:57:42.847	2026-08-15 21:28:23.987	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST790	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
d8ac74ce-3bff-44b1-b0f8-f82507550503	E2E Artisan Bistro	e2e-bistro-1786350979183	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-10 08:36:19.184	2026-08-15 21:28:29.552	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST832	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	E2E Artisan Bistro	e2e-bistro-1786518232394	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-12 07:03:52.4	2026-08-15 21:28:18.632	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST572	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
b8f37817-45f8-4eab-babf-20530fa53e8a	E2E Artisan Bistro	e2e-bistro-1786822595299	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-15 19:36:35.364	2026-08-16 07:27:14.485	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST796	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
8bc60fae-24c1-4807-adc3-0cba5ae82ac2	E2E Artisan Bistro	e2e-bistro-1786350927572	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-10 08:35:27.581	2026-08-15 21:28:31.062	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST677	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
00e53d62-c8ff-4438-8c9d-779a77b48e53	E2E Artisan Bistro	e2e-bistro-1786433212730	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-11 07:26:52.742	2026-08-15 21:28:25.232	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST192	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
23bbf2b6-56c7-4fe3-9269-651705dac079	E2E Artisan Bistro	e2e-bistro-1786452016613	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-11 12:40:16.619	2026-08-15 21:28:19.946	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST826	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
6a15a48a-1fe6-4a83-99f3-997f93cbf35a	E2E Artisan Bistro	e2e-bistro-1786450672025	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-11 12:17:52.033	2026-08-15 21:28:22.565	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST904	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
b5a95f0b-c274-4b6b-82b4-f13e73ab281b	lux	lux	hjsjhh	hjsjhh City Center	898038-0279	ACTIVE	2026-08-12 07:47:48.295	2026-08-15 22:04:35.677	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	LUX604	Multi-Cuisine	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	E2E Artisan Bistro	e2e-bistro-1786780298087	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-15 07:51:38.148	2026-08-15 21:28:02.607	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST485	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
e5688dbb-23b9-4b99-9df8-3fa867ad307b	E2E Artisan Bistro	e2e-bistro-1786778522426	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-15 07:22:02.43	2026-08-15 21:28:04.599	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST892	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
8b592d07-b126-4da7-b2ec-7373389fc227	E2E Artisan Bistro	e2e-bistro-1786689726438	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-14 06:42:06.442	2026-08-15 21:28:07.752	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST561	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
43f65dae-8fd4-49f9-8b5a-107e26c1f51c	E2E Artisan Bistro	e2e-bistro-1786689165952	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-14 06:32:45.958	2026-08-15 21:28:11.613	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST660	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
5ecdc092-c3ed-465d-ad41-1503c75d9e42	E2E Artisan Bistro	e2e-bistro-1786604638424	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-13 07:03:58.426	2026-08-15 21:28:13.24	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST245	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	5	1
49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	E2E Artisan Bistro	e2e-bistro-1786518680431	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-12 07:11:20.438	2026-08-15 21:28:17.126	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST225	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
8af9db6e-46c7-4b93-abcd-23dc874c3bdb	E2E Artisan Bistro	e2e-bistro-1786864464619	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-16 07:14:24.685	2026-08-16 07:27:06.89	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST353	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
4cafb979-9130-4b8d-ae44-2f8604e1f0c8	E2E Artisan Bistro	e2e-bistro-1786824804885	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-15 20:13:24.981	2026-08-15 21:27:44.003	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST921	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
9d956e86-2f45-4048-844d-383bd9b52a63	E2E Artisan Bistro	e2e-bistro-1786824568627	Bengaluru	Bengaluru City Center	+91 98000 12345	SUSPENDED	2026-08-15 20:09:28.691	2026-08-15 21:27:45.698	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	BST681	Continental & Bistro	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
2580e8e3-dac4-407f-8e31-37b2a91e5a7c	hey	hey	hai	hai City Center	07098867908	ACTIVE	2026-08-15 22:05:15.329	2026-08-16 07:27:09.558	https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200	HEY658	Multi-Cuisine	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	4.8	0
the-urban-cafe	The Urban Cafe	the-urban-cafe	Mumbai	Bandra West, Hill Road, Mumbai	+91 98765 11111	ACTIVE	2026-08-07 12:16:09.507	2026-08-16 07:20:22.903	https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200	URBAN123	Café & Italian	40	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800	200	5	21
\.


--
-- Data for Name: RestaurantOwner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RestaurantOwner" (id, name, email, phone, "restaurantId", "createdAt", "updatedAt") FROM stdin;
a574ef2b-aa06-4887-aa6c-1ed59492a824	Rohit Sharma	rohit@urbancafe.com	+91 98765 11111	the-urban-cafe	2026-08-07 12:16:09.513	2026-08-07 12:16:09.513
b5669f5e-17c3-4d85-ba7d-9a3a0a9d6e24	Vikramaditya Roy	owner_1786349851640@royalspice.com	+91 98200 12345	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:31.816	2026-08-10 08:17:31.816
b0e4b370-1993-40b5-a307-565ed7239158	Bistro Owner	owner.e2e-bistro-1786350927572@foodmania.com	+91 98000 12345	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:27.585	2026-08-10 08:35:27.585
e244212b-bfec-410c-9e45-2e8b2648ac2e	Bistro Owner	owner.e2e-bistro-1786350979183@foodmania.com	+91 98000 12345	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.188	2026-08-10 08:36:19.188
2d245155-7a30-437f-a81d-86535f5642be	Bistro Owner	owner.e2e-bistro-1786430786017@foodmania.com	+91 98000 12345	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.051	2026-08-11 06:46:26.051
04747a15-a6a9-4e06-9638-5ab477e3dbe5	Bistro Owner	owner.e2e-bistro-1786433212730@foodmania.com	+91 98000 12345	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:52.753	2026-08-11 07:26:52.753
28070e5b-b37a-4f34-99db-66ee49c3ff7a	Bistro Owner	owner.e2e-bistro-1786449462843@foodmania.com	+91 98000 12345	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:42.857	2026-08-11 11:57:42.857
d370f219-9d4e-4861-b88a-294cb3104d03	Bistro Owner	owner.e2e-bistro-1786450672025@foodmania.com	+91 98000 12345	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.042	2026-08-11 12:17:52.042
78efd004-898e-49fc-aa2e-a085936703d8	Bistro Owner	owner.e2e-bistro-1786452016613@foodmania.com	+91 98000 12345	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:16.627	2026-08-11 12:40:16.627
8259a40b-9d9b-4936-bce6-8b7f1490d713	Bistro Owner	owner.e2e-bistro-1786518232394@foodmania.com	+91 98000 12345	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.402	2026-08-12 07:03:52.402
158a9ded-f7f8-47de-ad55-9cb151bf5503	Bistro Owner	owner.e2e-bistro-1786518680431@foodmania.com	+91 98000 12345	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.441	2026-08-12 07:11:20.441
20234863-2bd5-461a-ab6e-9a982838f5e9	lucifer morning star	lux@gmail.com	898038-0279	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	2026-08-12 07:47:48.321	2026-08-12 07:47:48.321
f20678b8-9212-4642-ad68-b4cffe07cb39	Bistro Owner	owner.e2e-bistro-1786604638424@foodmania.com	+91 98000 12345	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:58.436	2026-08-13 07:03:58.436
63858463-7db7-4b0f-8042-3cb7071b4182	Bistro Owner	owner.e2e-bistro-1786689165952@foodmania.com	+91 98000 12345	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:45.963	2026-08-14 06:32:45.963
c0e13492-6443-464d-b195-cfd0423acb64	Bistro Owner	owner.e2e-bistro-1786689726438@foodmania.com	+91 98000 12345	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:06.451	2026-08-14 06:42:06.451
be023799-d634-4022-bf59-d5a81c4a9d5c	Bistro Owner	owner.e2e-bistro-1786778522426@foodmania.com	+91 98000 12345	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:02.432	2026-08-15 07:22:02.432
c78722bf-0ce4-4d6d-89bc-e86c17151533	Bistro Owner	owner.e2e-bistro-1786780298087@foodmania.com	+91 98000 12345	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.149	2026-08-15 07:51:38.149
fd526fb3-e095-4f4d-92f0-63a0c47f9d42	Bistro Owner	owner.e2e-bistro-1786822595299@foodmania.com	+91 98000 12345	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.366	2026-08-15 19:36:35.366
1a42adc2-9c82-495e-b11b-ac967ad8536d	Bistro Owner	owner.e2e-bistro-1786824568627@foodmania.com	+91 98000 12345	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:28.692	2026-08-15 20:09:28.692
f7219804-a555-49c7-a497-890734536d14	Bistro Owner	owner.e2e-bistro-1786824804885@foodmania.com	+91 98000 12345	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:24.982	2026-08-15 20:13:24.982
85b550d8-4e54-4d49-9ec9-4c2f24748fcf	kai	jo@com	07098867908	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	2026-08-15 22:05:15.331	2026-08-15 22:05:15.331
11068c96-4023-4c42-a412-2d84347848da	Bistro Owner	owner.e2e-bistro-1786864464619@foodmania.com	+91 98000 12345	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:24.687	2026-08-16 07:14:24.687
\.


--
-- Data for Name: RestaurantTable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RestaurantTable" (id, "tableNumber", capacity, status, "restaurantId", "createdAt", "updatedAt") FROM stdin;
162eb9c1-1433-4830-86f8-6735dde7d7aa	T-01	4	AVAILABLE	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:31.898	2026-08-10 08:17:31.898
9dbd6191-88a0-4010-bf1f-4eebe0bfe31c	T-01	4	AVAILABLE	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:27.657	2026-08-10 08:35:27.657
6b05e648-4121-499a-a3c2-77da91313b2a	T-01	4	AVAILABLE	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.258	2026-08-10 08:36:19.258
77812bd6-e956-45e4-be0a-d327b5d6f6fe	T-01	4	AVAILABLE	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.188	2026-08-11 06:46:26.188
babb60a7-1e59-474f-9e37-bf699ff5c9e4	T-01	4	AVAILABLE	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:52.89	2026-08-11 07:26:52.89
15c503d6-01fa-4ccc-8d45-493479df95e6	T-01	4	AVAILABLE	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	2026-08-15 22:05:15.34	2026-08-15 22:05:15.34
67961379-c88f-4771-91c2-5763bd08f2ac	T-01	4	AVAILABLE	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:42.944	2026-08-11 11:57:42.944
d2d7712c-bd21-41dd-91b4-564a5e1010f5	T-01	4	AVAILABLE	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.165	2026-08-11 12:17:52.165
t-03	T-03	6	AVAILABLE	the-urban-cafe	2026-08-07 12:16:09.519	2026-08-15 22:09:52.525
9e25fa08-b6eb-4982-b04e-12b9d1939650	T-01	4	AVAILABLE	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:16.771	2026-08-11 12:40:16.771
3603e456-f2f3-4ca7-981f-2a2c71aa6632	T-01	4	AVAILABLE	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.473	2026-08-12 07:03:52.473
f65cdced-d8da-4166-81c9-05203866a2f1	T-01	4	AVAILABLE	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.516	2026-08-12 07:11:20.516
20a90c63-b6ca-448a-aff2-d26d2e54ad22	T-01	4	AVAILABLE	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	2026-08-12 07:47:48.458	2026-08-12 07:47:48.458
95720b69-752d-42c8-ac53-e0040d084a6d	T-01	4	AVAILABLE	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:58.561	2026-08-13 07:03:58.561
7c00419f-5b8d-4b61-9e32-5dc285636591	T-01	4	AVAILABLE	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:24.693	2026-08-16 07:14:24.693
25113b32-9d73-4c14-8a8a-535505ea008f	T-01	4	AVAILABLE	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.047	2026-08-14 06:32:46.047
t-01	T-01	2	AVAILABLE	the-urban-cafe	2026-08-07 12:16:09.516	2026-08-16 07:14:25.327
b3901e1e-6f5e-48d3-8580-531722eec197	T-01	4	AVAILABLE	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:06.523	2026-08-14 06:42:06.523
5466b2de-e590-4c43-9c14-f4f4beb5a7bb	T-01	4	AVAILABLE	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:02.5	2026-08-15 07:22:02.5
t-02	T-02	4	OCCUPIED	the-urban-cafe	2026-08-07 12:16:09.518	2026-08-16 07:24:36.459
39ab4027-2da6-444c-8635-b6014d75251a	T-01	4	AVAILABLE	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.157	2026-08-15 07:51:38.157
3b3ebc91-ad77-427a-b46e-a997fa772338	T-01	4	AVAILABLE	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.374	2026-08-15 19:36:35.374
fd03c9de-4af1-4313-9249-f30ac4a5b98f	T-01	4	AVAILABLE	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:28.699	2026-08-15 20:09:28.699
3e42f68b-6440-46a6-916a-20c015dc8fac	T-01	4	AVAILABLE	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:24.991	2026-08-15 20:13:24.991
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, rating, comment, "restaurantId", "userId", "createdAt", "updatedAt", "customerName") FROM stdin;
3dde7c06-e535-4dc6-bfdd-0df6b80e526c	5	Absolutely amazing ambiance and delicious Truffle Risotto! Highly recommended.	the-urban-cafe	u-customer-1	2026-08-07 12:16:09.533	2026-08-07 12:16:09.533	Gaurav Sharma
96b3e924-ad02-4a34-96dd-942c0d68e19d	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-10 08:31:59.976	2026-08-10 08:31:59.976	Gaurav Sharma
3e1188b1-ea13-4868-b51a-a2a70209b0e3	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-11 07:26:45.291	2026-08-11 07:26:45.291	Gaurav Sharma
9f593f1e-cf4e-4cfa-acba-6149ad04147d	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-11 11:57:38.309	2026-08-11 11:57:38.309	Gaurav Sharma
3c6f2ea8-70bb-419b-97cb-50d946502759	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-11 12:17:29.978	2026-08-11 12:17:29.978	Gaurav Sharma
220483c6-b1fc-4355-906f-7cd31b88c48a	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-11 12:40:09.758	2026-08-11 12:40:09.758	Gaurav Sharma
17dcfc21-76a9-4f4f-bdde-40f6a9a18190	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-12 07:03:48.367	2026-08-12 07:03:48.367	Gaurav Sharma
98c58be0-40b5-49b6-bf95-7b32e49c1fee	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-12 07:10:26.074	2026-08-12 07:10:26.074	Gaurav Sharma
c7466304-cc66-4353-9754-543412d2c8e3	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-12 07:10:46.378	2026-08-12 07:10:46.378	Gaurav Sharma
7d55ae78-56b2-4232-891e-eeb346b93fac	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-12 07:10:58.514	2026-08-12 07:10:58.514	Gaurav Sharma
c5be4e31-414b-4f4f-91b5-cec9fac73fe1	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-12 07:11:17.534	2026-08-12 07:11:17.534	Gaurav Sharma
42de242d-d48f-4272-8008-b452e7a3285d	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-13 07:03:51.035	2026-08-13 07:03:51.035	Gaurav Sharma
d9659a8e-6051-4970-8e9b-887b11205314	5	Amazing food! Sourdough bruschetta was exceptional.	5ecdc092-c3ed-465d-ad41-1503c75d9e42	\N	2026-08-13 07:22:15.132	2026-08-13 07:22:15.132	Gaurav Sharma
108becad-eac8-4503-bd75-3dcf1d232561	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-14 06:32:39.375	2026-08-14 06:32:39.375	Gaurav Sharma
c9bcd219-5127-4ae4-9201-769d1fbcdf1e	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-14 06:41:27.389	2026-08-14 06:41:27.389	Gaurav Sharma
ae00cc9a-65a8-4593-a3b5-17d27a827023	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-14 06:41:59.856	2026-08-14 06:41:59.856	Gaurav Sharma
17b7fa77-4d09-4ec5-885a-91ce625dd52f	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-15 07:21:57.358	2026-08-15 07:21:57.358	Gaurav Sharma
f9c8099a-f763-4d22-88de-7f0e6b5a165c	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-15 07:51:34.169	2026-08-15 07:51:34.169	Gaurav Sharma
44bae228-c168-47d3-91a3-6776891a9da1	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-15 19:36:29.678	2026-08-15 19:36:29.678	Gaurav Sharma
6f36c007-dd6d-4a35-9a8b-196d2122cecc	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-15 20:09:23.912	2026-08-15 20:09:23.912	Gaurav Sharma
966a7535-d2c2-4605-b5fa-c29c3526bc37	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-15 20:13:19.167	2026-08-15 20:13:19.167	Gaurav Sharma
2271330d-cfcc-4948-b0ee-653e41cb0b4b	5	Excellent food and great ambiance!	the-urban-cafe	\N	2026-08-16 07:14:23.616	2026-08-16 07:14:23.616	Gaurav Sharma
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" (id, plan, status, "monthlyAmount", "startDate", "endDate", "restaurantId", "createdAt", "updatedAt") FROM stdin;
b5def761-51f6-4c74-aca9-a67048b0e083	PRO	ACTIVE	4999	2026-08-07 12:16:09.513	2026-09-06 12:16:09.513	the-urban-cafe	2026-08-07 12:16:09.515	2026-08-07 12:16:09.515
3bc13ecc-47e6-4290-8f6c-4e34b8ce4116	PRO	ACTIVE	4999	2026-08-10 08:17:31.891	2026-09-09 08:17:31.891	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	2026-08-10 08:17:31.892	2026-08-10 08:17:31.892
54547b79-6ed7-4be4-9a31-7c6a39f88659	PRO	ACTIVE	4999	2026-08-10 08:35:27.65	2026-09-09 08:35:27.65	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	2026-08-10 08:35:27.651	2026-08-10 08:35:27.651
57b8bac3-8041-47a1-b74c-ece55c7f0e5e	PRO	ACTIVE	4999	2026-08-10 08:36:19.255	2026-09-09 08:36:19.255	d8ac74ce-3bff-44b1-b0f8-f82507550503	2026-08-10 08:36:19.255	2026-08-10 08:36:19.255
3ddc56ff-3026-4478-b5ab-025099f28884	PRO	ACTIVE	4999	2026-08-11 06:46:26.176	2026-09-10 06:46:26.176	52ba7639-afe8-48bb-a354-8c9541038a58	2026-08-11 06:46:26.178	2026-08-11 06:46:26.178
7cd99895-c632-4fb0-9932-ff5ffb720c44	PRO	ACTIVE	4999	2026-08-11 07:26:52.878	2026-09-10 07:26:52.878	00e53d62-c8ff-4438-8c9d-779a77b48e53	2026-08-11 07:26:52.879	2026-08-11 07:26:52.879
ad41614c-c733-41e3-bd8f-6c5e0e65d0da	PRO	ACTIVE	4999	2026-08-11 11:57:42.938	2026-09-10 11:57:42.938	2c49b364-beeb-4bb4-b348-8ee58317e5cd	2026-08-11 11:57:42.94	2026-08-11 11:57:42.94
ebc8c374-ff85-4a27-aaf8-2db0fb2aefb2	PRO	ACTIVE	4999	2026-08-11 12:17:52.157	2026-09-10 12:17:52.157	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	2026-08-11 12:17:52.158	2026-08-11 12:17:52.158
91050409-f282-4bd4-8555-9170bdb29c1d	PRO	ACTIVE	4999	2026-08-11 12:40:16.765	2026-09-10 12:40:16.765	23bbf2b6-56c7-4fe3-9269-651705dac079	2026-08-11 12:40:16.766	2026-08-11 12:40:16.766
326b7ff6-cb1a-4d29-9b8b-375d1747602b	PRO	ACTIVE	4999	2026-08-12 07:03:52.469	2026-09-11 07:03:52.469	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	2026-08-12 07:03:52.47	2026-08-12 07:03:52.47
50a9c941-e887-4084-a65e-678355005a17	PRO	ACTIVE	4999	2026-08-12 07:11:20.512	2026-09-11 07:11:20.512	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	2026-08-12 07:11:20.512	2026-08-12 07:11:20.512
9a4dd66e-e334-4966-a659-9cdf5dbb617b	PRO	ACTIVE	4999	2026-08-12 07:47:48.452	2026-09-11 07:47:48.452	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	2026-08-12 07:47:48.453	2026-08-12 07:47:48.453
b0a632a2-04ea-4a90-aace-66a5d6b8c812	PRO	ACTIVE	4999	2026-08-13 07:03:58.554	2026-09-12 07:03:58.554	5ecdc092-c3ed-465d-ad41-1503c75d9e42	2026-08-13 07:03:58.555	2026-08-13 07:03:58.555
5ab68964-0669-452b-856c-1d99cb2405de	PRO	ACTIVE	4999	2026-08-14 06:32:46.04	2026-09-13 06:32:46.04	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	2026-08-14 06:32:46.041	2026-08-14 06:32:46.041
a5df5e63-93c0-4769-8845-c7cdcba8bd2b	PRO	ACTIVE	4999	2026-08-14 06:42:06.518	2026-09-13 06:42:06.518	8b592d07-b126-4da7-b2ec-7373389fc227	2026-08-14 06:42:06.519	2026-08-14 06:42:06.519
1cd1b839-05d3-4f72-9b78-6b50696ad10f	PRO	ACTIVE	4999	2026-08-15 07:22:02.496	2026-09-14 07:22:02.496	e5688dbb-23b9-4b99-9df8-3fa867ad307b	2026-08-15 07:22:02.496	2026-08-15 07:22:02.496
46a094cd-1c4b-4152-8e91-5b29a1cc385f	PRO	ACTIVE	4999	2026-08-15 07:51:38.154	2026-09-14 07:51:38.154	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	2026-08-15 07:51:38.154	2026-08-15 07:51:38.154
f2ca4dde-9f70-4007-a9c9-335fc905d283	PRO	ACTIVE	4999	2026-08-15 19:36:35.37	2026-09-14 19:36:35.37	b8f37817-45f8-4eab-babf-20530fa53e8a	2026-08-15 19:36:35.37	2026-08-15 19:36:35.37
99ebace4-2f7a-4ee0-9f58-78a92a91097e	PRO	ACTIVE	4999	2026-08-15 20:09:28.696	2026-09-14 20:09:28.696	9d956e86-2f45-4048-844d-383bd9b52a63	2026-08-15 20:09:28.696	2026-08-15 20:09:28.696
0b34cf80-34f4-47de-b494-3fb8b42412ec	PRO	ACTIVE	4999	2026-08-15 20:13:24.986	2026-09-14 20:13:24.986	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	2026-08-15 20:13:24.987	2026-08-15 20:13:24.987
dd549f3f-204f-40f2-a08a-1c0b31f522d3	PRO	ACTIVE	4999	2026-08-15 22:05:15.336	2026-09-14 22:05:15.336	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	2026-08-15 22:05:15.337	2026-08-15 22:05:15.337
b7b596fd-9210-4319-9a59-123a274f8e6b	PRO	ACTIVE	4999	2026-08-16 07:14:24.69	2026-09-15 07:14:24.69	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	2026-08-16 07:14:24.691	2026-08-16 07:14:24.691
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, phone, password, role, "createdAt", "updatedAt", "is2FAEnabled", "restaurantCode", "restaurantId", "twoFactorSecret") FROM stdin;
u-admin-1	admin@foodmania.com	Super Admin	+91 99999 99999	$2a$10$h6joRPirEr96.IVJPGcHC.rTkmoR1SyRz/EUVPBovqqj6a1aMh.du	SUPER_ADMIN	2026-08-07 12:16:09.495	2026-08-07 12:16:09.495	t	\N	\N	\N
u-customer-1	gaurav@example.com	Gaurav Sharma	+91 98765 43210	$2a$10$13vmBjIdqKQdd2bNx3N7y.0zZ32rre0eXlbCemZTEcfusggf8IxAG	CUSTOMER	2026-08-07 12:16:09.505	2026-08-07 12:16:09.505	f	\N	\N	\N
u-customer-2	priya@example.com	Priya Patel	+91 98123 45678	$2a$10$13vmBjIdqKQdd2bNx3N7y.0zZ32rre0eXlbCemZTEcfusggf8IxAG	CUSTOMER	2026-08-07 12:16:09.506	2026-08-07 12:16:09.506	f	\N	\N	\N
u-owner-1	rohit@urbancafe.com	Rohit Sharma	+91 98765 11111	$2a$10$DoEk9bYCISrH5F6e8kYEvO1KkQ/d4cdUmXFB/Urkt1xCzw3S1eYqe	OWNER	2026-08-07 12:16:09.51	2026-08-07 12:16:09.51	f	URBAN123	the-urban-cafe	\N
u-staff-1	staff@urbancafe.com	Urban Cafe Staff	+91 98765 11122	$2a$10$pat/7.rYqjrBoAWFOiKXwuVB4K95A2kShh030pfThctrvEjc/QO/C	STAFF	2026-08-07 12:16:09.512	2026-08-07 12:16:09.512	f	URBAN123	the-urban-cafe	\N
082c4980-5e3c-4644-89fe-96d0076e2c50	owner_1786349851640@royalspice.com	Vikramaditya Roy	+91 98200 12345	$2a$10$qCHJbxMNCqH5Tn8tXq8ZCefivx8Du5If0ldz2QlM8INfcY4Ru9Wr2	OWNER	2026-08-10 08:17:31.886	2026-08-10 08:17:31.886	f	ROYA155	61fc09de-12db-4e4a-86b1-a370f9b5e8a8	\N
a4cb17a6-68e0-4038-a166-b6b99947b343	owner.e2e-bistro-1786350927572@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$yPxhOq.bLyq9w7QHf1a2Auc81/M5LBnaZ5CntHqPj6qeIBVwfexo.	OWNER	2026-08-10 08:35:27.648	2026-08-10 08:35:27.648	f	BST677	8bc60fae-24c1-4807-adc3-0cba5ae82ac2	\N
ec8f79d0-cc56-47a6-80f6-98136429e37f	owner.e2e-bistro-1786350979183@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$jbs5LkIIbB7z2ycp8cMscOaMf51DxmxdC3QxwP/L.RUMWaMrHxXX2	OWNER	2026-08-10 08:36:19.253	2026-08-10 08:36:19.253	f	BST832	d8ac74ce-3bff-44b1-b0f8-f82507550503	\N
bc1a5369-5c90-40d3-86b3-d3117aad4bf7	qatest@gmail.com	QA Test User	9999999999	$2a$10$0mxZcB8fi7er4omt0QiFluHsV8TYh5bOZwoxLFIt7a5xQfdRfc7bW	CUSTOMER	2026-08-10 08:45:58.88	2026-08-10 08:45:58.88	f	\N	\N	\N
fe32d448-e8fa-4585-b406-880ad58af79e	owner.e2e-bistro-1786430786017@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$9SloB2UT3lYkvHE0pnpNgefwbf73NKqFHJBUiskwi1HiCSvanmwPu	OWNER	2026-08-11 06:46:26.164	2026-08-11 06:46:26.164	f	BST135	52ba7639-afe8-48bb-a354-8c9541038a58	\N
8979263d-1096-4bf7-bbcd-944f6a16182d	owner.e2e-bistro-1786433212730@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$/qg5IOuioN0i74zzEV21Xe91xDNuud9twWSdcjHB/ZlfPfVVGlapu	OWNER	2026-08-11 07:26:52.866	2026-08-11 07:26:52.866	f	BST192	00e53d62-c8ff-4438-8c9d-779a77b48e53	\N
1aa83f07-5a56-4a5b-b71f-4f02c3951c73	owner_burger_security_test@example.com	Burger Hub Owner	\N	$2a$10$OrCf2DHr/4xWxc7UvyUQD.wilnCK5eTAB5kEbnpCA5XtCxZUScUwS	OWNER	2026-08-11 11:56:25.697	2026-08-11 11:56:25.697	f	BURGER123	burger-hub	\N
54a78b15-3810-4cf4-9873-eb007ca8ba62	owner.e2e-bistro-1786449462843@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$HUHFRcA8PouKewKPYp1D3ubaoTabYjAN17OlJp82ePTwgWuOBSQLe	OWNER	2026-08-11 11:57:42.93	2026-08-11 11:57:42.93	f	BST790	2c49b364-beeb-4bb4-b348-8ee58317e5cd	\N
cbb8a9f4-1745-4540-9ebc-193c120b5573	owner.e2e-bistro-1786450672025@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$nctFaxnQbpUL0o0MBq.IP.bdUAipnfbvyVkCW7YYbf.Z/0420ixn2	OWNER	2026-08-11 12:17:52.148	2026-08-11 12:17:52.148	f	BST904	6a15a48a-1fe6-4a83-99f3-997f93cbf35a	\N
f0ca4ab4-3711-46c5-8d7f-a887efb4fd0c	owner.e2e-bistro-1786452016613@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$2rL0kToD5thvVV6VTz2hOebrZ3tPLTdhnqa6QGdm7v.tstST8IG0i	OWNER	2026-08-11 12:40:16.756	2026-08-11 12:40:16.756	f	BST826	23bbf2b6-56c7-4fe3-9269-651705dac079	\N
8202a3ea-01b5-4508-b76d-978b4d38e9ed	owner.e2e-bistro-1786518232394@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$noLTYLhplHX9YfaJ9SCumOzt3PmcWsqe3YUFLAwqeY0HIpZGOeO5a	OWNER	2026-08-12 07:03:52.467	2026-08-12 07:03:52.467	f	BST572	214ab2ab-2a82-42e3-8efd-f3881d3b5fb3	\N
7d6c0346-35e4-4504-890e-1664dcc55c23	owner.e2e-bistro-1786518680431@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$UTmECaFYqJsuTcThXPTM8.KxAXBRSlgche4i.Ac8tUCVvhm6AsBH2	OWNER	2026-08-12 07:11:20.51	2026-08-12 07:11:20.51	f	BST225	49f92d1b-bc53-4e4a-aea3-9fd6f3e0e253	\N
f3d3503d-4a94-4609-87e4-5c1517114972	lux@gmail.com	lucifer morning star	898038-0279	$2a$10$5KETFfA0Af.OkRWsFZjXY.rArm4pn64vimE/18CNKu60Ag7jyOz9u	OWNER	2026-08-12 07:47:48.449	2026-08-12 07:47:48.449	f	LUX604	b5a95f0b-c274-4b6b-82b4-f13e73ab281b	\N
6de4bc4e-0534-442a-9b66-d8cd6a216ca0	owner.e2e-bistro-1786604638424@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$EA4oKtuO06h68tgbNKyaauynyRmqn4C8tN2E0qy.hHXUIL4vyDs32	OWNER	2026-08-13 07:03:58.545	2026-08-13 07:03:58.545	f	BST245	5ecdc092-c3ed-465d-ad41-1503c75d9e42	\N
136026ee-7814-4f34-8bc4-2dddcd972694	owner.e2e-bistro-1786689165952@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$Ul75Yn49aY9LimAtnvcvwuViOW3H6oileTEOVlzU6w8Thyi39D/.y	OWNER	2026-08-14 06:32:46.037	2026-08-14 06:32:46.037	f	BST660	43f65dae-8fd4-49f9-8b5a-107e26c1f51c	\N
1d62a4e3-5c11-4e66-873c-854eb4f5e3c7	owner.e2e-bistro-1786689726438@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$z5hdpuiHPa42TU7OHcYX0uYBB.X9puYw03N7oScYXjG6Woqd9.Kge	OWNER	2026-08-14 06:42:06.514	2026-08-14 06:42:06.514	f	BST561	8b592d07-b126-4da7-b2ec-7373389fc227	\N
16207fc7-9e31-464c-8d98-e76de5ddaa2d	+91 98765 43210+91 98765 43210@customer.foodmania.com	Customer	+91 98765 43210+91 98765 43210	\N	CUSTOMER	2026-08-14 06:45:10.602	2026-08-14 06:45:10.602	f	\N	\N	\N
799b002b-df06-4bd0-8283-03e44ca74388	owner.e2e-bistro-1786778522426@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$0jdwf3.rH9Gplrm1hklVOeTxATjicW04jwtoClX.Uoo0OIpoOHvdW	OWNER	2026-08-15 07:22:02.495	2026-08-15 07:22:02.495	f	BST892	e5688dbb-23b9-4b99-9df8-3fa867ad307b	\N
db6eade7-282a-40eb-a4db-ba3810195efc	owner.e2e-bistro-1786780298087@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$lsQb2BEHH/wAcc1fC4Jly.TiRelvupMg.Gv.ZtRSdxrcsWrjwSDm6	OWNER	2026-08-15 07:51:38.153	2026-08-15 07:51:38.153	f	BST485	0b8ffc9a-820e-4a9f-9db4-91c083bcd7f5	\N
45e6d4ee-9917-40b0-8856-97b7a3321560	owner.e2e-bistro-1786822595299@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$ZvWWFM5xAw9XyMKKN1raF.f4LjZDIHA56kgMzUEB1ws8kwKcaw60C	OWNER	2026-08-15 19:36:35.369	2026-08-15 19:36:35.369	f	BST796	b8f37817-45f8-4eab-babf-20530fa53e8a	\N
5c466f66-2b20-4824-81c9-43588aa60bb0	owner.e2e-bistro-1786824804885@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$sYG.JY8hkjK6weSEGgUh..09HLMLfMUDESdrdS72PCW6XiqKn94nm	BANNED	2026-08-15 20:13:24.985	2026-08-15 21:27:35.989	f	BST921	4cafb979-9130-4b8d-ae44-2f8604e1f0c8	\N
00d5ef1d-1187-4f78-95c9-1db1509dd87d	owner.e2e-bistro-1786824568627@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$W/BDPXbnXcxjYSUoD4I8N.E97o8QSC9BVbQY/O0Lr7LZBjI.b75Sy	BANNED	2026-08-15 20:09:28.695	2026-08-15 21:27:39.104	f	BST681	9d956e86-2f45-4048-844d-383bd9b52a63	\N
d881fc1f-8c05-4686-8ab1-6c1956bbc532	jo@com	kai	07098867908	$2a$10$8GckrOnAOcybesLdkBk3yOAvTfYRDil6rc3G.9qGE51ExMIsjmWSW	OWNER	2026-08-15 22:05:15.335	2026-08-15 22:05:15.335	f	HEY658	2580e8e3-dac4-407f-8e31-37b2a91e5a7c	\N
a14d4ac6-3bd7-4a99-8582-c47833765769	owner.e2e-bistro-1786864464619@foodmania.com	Bistro Owner	+91 98000 12345	$2a$10$TQ7Z/B2A5NsbPT2lmPL5YuBax9UeVGwbCU8TBzDq561Ak8UIKoJJm	OWNER	2026-08-16 07:14:24.689	2026-08-16 07:14:24.689	f	BST353	8af9db6e-46c7-4b93-abcd-23dc874c3bdb	\N
\.


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: MenuCategory MenuCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuCategory"
    ADD CONSTRAINT "MenuCategory_pkey" PRIMARY KEY (id);


--
-- Name: MenuItem MenuItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: RestaurantOwner RestaurantOwner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RestaurantOwner"
    ADD CONSTRAINT "RestaurantOwner_pkey" PRIMARY KEY (id);


--
-- Name: RestaurantTable RestaurantTable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RestaurantTable"
    ADD CONSTRAINT "RestaurantTable_pkey" PRIMARY KEY (id);


--
-- Name: Restaurant Restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Restaurant"
    ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Booking_bookingCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Booking_bookingCode_key" ON public."Booking" USING btree ("bookingCode");


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: RestaurantOwner_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RestaurantOwner_email_key" ON public."RestaurantOwner" USING btree (email);


--
-- Name: Restaurant_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Restaurant_code_key" ON public."Restaurant" USING btree (code);


--
-- Name: Restaurant_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Restaurant_slug_key" ON public."Restaurant" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- PostgreSQL database dump complete
--

\unrestrict mZl5npLxbyr8saiX5P0F9hSiIwUXwjOIHrpSUFQmeaNqBMtsDlbwyEwXNLxfd4T

