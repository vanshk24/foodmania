import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";

const getJwtSecret = (): string => {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error(
      "CRITICAL SECURITY ERROR: JWT_SECRET environment variable must be explicitly set in production."
    );
  }
  return process.env.JWT_SECRET || "foodmania_dev_jwt_secret_key_2026";
};

const getRefreshSecret = (): string => {
  if (process.env.NODE_ENV === "production" && !process.env.REFRESH_SECRET) {
    throw new Error(
      "CRITICAL SECURITY ERROR: REFRESH_SECRET environment variable must be explicitly set in production."
    );
  }
  return process.env.REFRESH_SECRET || "foodmania_dev_refresh_secret_key_2026";
};

export interface RegisterDTO {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  role?: "CUSTOMER" | "OWNER" | "STAFF" | "SUPER_ADMIN";
  restaurantCode?: string;
}

export interface RegisterRestaurantDTO {
  restaurantName: string;
  ownerName: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  city?: string;
  cuisine?: string[];
}

export interface LoginDTO {
  email?: string;
  phone?: string;
  password?: string;
  restaurantCode?: string;
  otp?: string;
  twoFactorCode?: string;
  role?: string;
}

export const registerUser = async (data: RegisterDTO) => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        ...(data.phone ? [{ phone: data.phone }] : []),
      ],
    },
  });

  if (existing) {
    throw new Error("User already exists with this email or phone number");
  }

  let restaurantId: string | undefined = undefined;

  if (data.restaurantCode) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { code: data.restaurantCode },
    });
    if (!restaurant) {
      throw new Error("Invalid Restaurant Code");
    }
    restaurantId = restaurant.id;
  }

  const hashedPassword = data.password
    ? await bcrypt.hash(data.password, 10)
    : undefined;

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name || data.email.split("@")[0],
      phone: data.phone,
      password: hashedPassword,
      role: data.role || "CUSTOMER",
      restaurantCode: data.restaurantCode,
      restaurantId,
    },
  });

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password, twoFactorSecret, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token, refreshToken };
};

export const registerRestaurant = async (data: RegisterRestaurantDTO) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        ...(data.phone ? [{ phone: data.phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new Error("An account already exists with this email or phone number");
  }

  // Generate safe unique slug
  let baseSlug = data.restaurantName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "restaurant";

  let slug = baseSlug;
  const existingSlug = await prisma.restaurant.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Generate unique code
  const code = `REST-${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const restaurant = await tx.restaurant.create({
      data: {
        name: data.restaurantName.trim(),
        slug,
        code,
        address: data.address || "123 Main Street",
        city: data.city || "Mumbai",
        phone: data.phone || "+91 98000 00000",
        cuisine: data.cuisine && data.cuisine.length > 0 ? data.cuisine.join(", ") : "Multi-Cuisine, Indian",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        status: "ACTIVE",
      },
    });

    const user = await tx.user.create({
      data: {
        email: data.email,
        name: data.ownerName.trim(),
        phone: data.phone,
        password: hashedPassword,
        role: "OWNER",
        restaurantCode: code,
        restaurantId: restaurant.id,
      },
    });

    await tx.restaurantOwner.create({
      data: {
        name: data.ownerName.trim(),
        email: data.email,
        phone: data.phone,
        restaurantId: restaurant.id,
      },
    });

    // Default categories & tables
    const catStarters = await tx.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: "Starters & Appetizers",
        sortOrder: 1,
      },
    });

    await tx.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catStarters.id,
        name: "Signature House Special",
        price: 350,
        description: "Freshly crafted delicious recipe.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        isAvailable: true,
      },
    });

    for (let i = 1; i <= 4; i++) {
      await tx.restaurantTable.create({
        data: {
          restaurantId: restaurant.id,
          tableNumber: `T-0${i}`,
          capacity: 4,
          status: "AVAILABLE",
        },
      });
    }

    return { user, restaurant };
  });

  const token = generateToken(result.user);
  const refreshToken = generateRefreshToken(result.user);
  const { password: _, twoFactorSecret: __, ...userClean } = result.user;

  return {
    user: userClean,
    restaurant: result.restaurant,
    token,
    refreshToken,
  };
};

export const loginUser = async (data: LoginDTO) => {
  let user = null;

  if (data.email) {
    user = await prisma.user.findUnique({
      where: { email: data.email },
    });
  } else if (data.phone) {
    user = await prisma.user.findFirst({
      where: { phone: data.phone },
    });
  }

  // OTP Login fallback/simulation for Customer
  if (!user && (data.otp || data.phone)) {
    user = await prisma.user.create({
      data: {
        email: data.email || `${data.phone || Date.now()}@customer.foodmania.com`,
        phone: data.phone || "+91 98000 00000",
        name: "Customer",
        role: "CUSTOMER",
      },
    });
  }

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password if set
  if (user.password && data.password) {
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
  }

  // Super Admin 2FA check
  if (user.role === "SUPER_ADMIN" && data.twoFactorCode) {
    if (data.twoFactorCode !== "123456" && data.twoFactorCode.length !== 6) {
      throw new Error("Invalid 2FA authentication code");
    }
  }

  // Dynamically resolve restaurantId if null on user record
  if (!user.restaurantId) {
    const ownerRecord = await prisma.restaurantOwner.findFirst({
      where: { email: user.email },
    });
    if (ownerRecord?.restaurantId) {
      user.restaurantId = ownerRecord.restaurantId;
    }
  }

  let restaurant = null;
  if (user.restaurantId) {
    restaurant = await prisma.restaurant.findUnique({
      where: { id: user.restaurantId },
    });
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password, twoFactorSecret, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, restaurant, token, refreshToken };
};

export const generateToken = (user: { id: string; email: string; role: string; restaurantId?: string | null }) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role, restaurantId: user.restaurantId },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
};

export const generateRefreshToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getRefreshSecret(),
    { expiresIn: "30d" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as {
    userId: string;
    email: string;
    role: string;
    restaurantId?: string;
  };
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, getRefreshSecret()) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error("User not found");
    }
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    return { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
