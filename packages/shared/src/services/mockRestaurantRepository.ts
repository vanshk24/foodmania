export interface RestaurantDetail {
  id: string;
  name: string;
  tagline: string;
  image: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  cuisines: string[];
  distance: string;
  time: string;
  address: string;
  phone: string;
  openNow: boolean;
  openTime: string;
  closeTime: string;
  priceForTwo: string;
  dietary: "veg" | "non-veg" | "mixed";
  tags: string[];
  about: string;
  offer?: string;
  menuCategories: Array<{
    name: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      isVeg: boolean;
      bestseller?: boolean;
      description: string;
      image: string;
    }>;
  }>;
}

const RESTAURANTS_DATABASE: Record<string, RestaurantDetail> = {
  "the-urban-cafe": {
    id: "the-urban-cafe",
    name: "The Urban Cafe",
    tagline: "Artisanal Coffee & Wood-fired Pizza",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 1200,
    cuisines: ["Cafe", "Italian", "Continental"],
    distance: "1.8 km",
    time: "25-30 min",
    address: "Andheri West, Mumbai",
    phone: "+91 98765 43210",
    openNow: true,
    openTime: "08:00 AM",
    closeTime: "11:30 PM",
    priceForTwo: "₹600 for two",
    dietary: "mixed",
    tags: ["Pure Veg", "Outdoor Seating", "Live Music", "Wi-Fi"],
    about: "A cozy rooftop cafe with a perfect blend of delicious food, ambiance and your favorite music.",
    offer: "20% OFF up to ₹120",
    menuCategories: [
      {
        name: "Pizzas",
        items: [
          { id: "m-1", name: "Cheese Burst Pizza", price: 349, isVeg: true, bestseller: true, description: "Loaded with melted mozzarella and cheddar.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80" },
          { id: "m-2", name: "Truffle Mushroom Pizza", price: 650, isVeg: true, description: "Wild mushrooms with black truffle oil.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80" },
        ],
      },
      {
        name: "Beverages",
        items: [
          { id: "m-3", name: "Artisanal Cold Brew", price: 240, isVeg: true, bestseller: true, description: "Steeped for 18 hours in cold purified water.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
        ],
      },
    ],
  },
  "spice-symphony": {
    id: "spice-symphony",
    name: "Spice Symphony",
    tagline: "Authentic North Indian & Biryani",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 892,
    cuisines: ["North Indian", "South Indian", "Biryani"],
    distance: "2.1 km",
    time: "30-35 min",
    address: "Bandra West, Mumbai",
    phone: "+91 98123 45678",
    openNow: true,
    openTime: "11:00 AM",
    closeTime: "11:00 PM",
    priceForTwo: "₹400 for two",
    dietary: "veg",
    tags: ["Pure Veg", "Family Dining", "AC", "Valet Parking"],
    about: "Rich aromatic spices, royal thalis, and authentic clay oven tandoori delicacies.",
    offer: "15% OFF up to ₹100",
    menuCategories: [
      {
        name: "Main Course",
        items: [
          { id: "s-1", name: "Paneer Butter Masala", price: 320, isVeg: true, bestseller: true, description: "Cottage cheese cubes in rich tomato gravy.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
          { id: "s-2", name: "Hyderabadi Veg Dum Biryani", price: 290, isVeg: true, description: "Fragrant basmati rice layered with vegetables.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
        ],
      },
    ],
  },
  "royal-treat": {
    id: "royal-treat",
    name: "Royal Treat Hotel",
    tagline: "Fine Dining Multi-Cuisine Buffet",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    ],
    rating: 4.2,
    reviewCount: 1540,
    cuisines: ["Multi-Cuisine", "Buffet", "Chinese"],
    distance: "3.4 km",
    time: "40-45 min",
    address: "Juhu Beach, Mumbai",
    phone: "+91 98999 11223",
    openNow: true,
    openTime: "12:00 PM",
    closeTime: "10:30 PM",
    priceForTwo: "₹1,200 for two",
    dietary: "non-veg",
    tags: ["Buffet", "Sea View", "Full Bar", "Luxury"],
    about: "A royal dining experience with unlimited chef special buffets and live grill stations.",
    offer: "Free Dessert",
    menuCategories: [
      {
        name: "Buffet Spread",
        items: [
          { id: "r-1", name: "Unlimited Royal Lunch Buffet", price: 799, isVeg: false, bestseller: true, description: "Includes 40+ dishes, starter grills & dessert bar.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
        ],
      },
    ],
  },
  "burger-hub": {
    id: "burger-hub",
    name: "Burger Hub",
    tagline: "Smash Burgers & Thick Shakes",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
    photos: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 980,
    cuisines: ["American", "Fast Food", "Burgers"],
    distance: "0.9 km",
    time: "15-20 min",
    address: "Powai, Mumbai",
    phone: "+91 98444 55566",
    openNow: true,
    openTime: "11:00 AM",
    closeTime: "11:00 PM",
    priceForTwo: "₹450 for two",
    dietary: "mixed",
    tags: ["Fast Food", "Late Night", "AC", "Takeaway"],
    about: "Handcrafted smash burgers with house-made sauces and crispy fries.",
    offer: "Buy 1 Get 1",
    menuCategories: [
      {
        name: "Signature Burgers",
        items: [
          { id: "b-1", name: "Double Cheese Smash Burger", price: 249, isVeg: false, bestseller: true, description: "Double smashed patty with melted cheddar.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80" },
        ],
      },
    ],
  },
  "italian-corner": {
    id: "italian-corner",
    name: "Italian Corner",
    tagline: "Authentic Wood-fired Pizzas & Pastas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    photos: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 1240,
    cuisines: ["Italian", "Pasta", "Pizza"],
    distance: "1.5 km",
    time: "20-25 min",
    address: "Lower Parel, Mumbai",
    phone: "+91 98222 33344",
    openNow: true,
    openTime: "12:30 PM",
    closeTime: "11:00 PM",
    priceForTwo: "₹900 for two",
    dietary: "veg",
    tags: ["Pure Veg", "Wood-fired", "Romantic", "Wine Bar"],
    about: "Authentic Italian trattoria serving freshly rolled pasta and thin crust wood-fired pizzas.",
    offer: "Free Appetizer",
    menuCategories: [
      {
        name: "Wood-Fired Pizza",
        items: [
          { id: "i-1", name: "Neapolitan Margherita", price: 450, isVeg: true, bestseller: true, description: "San Marzano tomatoes, fresh mozzarella, basil.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80" },
        ],
      },
    ],
  },
};

export class MockRestaurantRepository {
  public getAllRestaurants(): RestaurantDetail[] {
    return Object.values(RESTAURANTS_DATABASE);
  }

  public getRestaurantById(id: string): RestaurantDetail {
    const slug = id?.toLowerCase();
    return (
      RESTAURANTS_DATABASE[slug] || {
        ...RESTAURANTS_DATABASE["the-urban-cafe"]!,
        id: slug || "the-urban-cafe",
        name: slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "The Urban Cafe",
      }
    );
  }

  public async fetchAllFromBackend(search?: string, city?: string): Promise<RestaurantDetail[]> {
    try {
      const apiRes = await fetch(
        `http://localhost:4000/restaurants${
          city || search
            ? "?" +
              new URLSearchParams({
                ...(search && { search }),
                ...(city && city !== "All" && { city }),
              }).toString()
            : ""
        }`
      );
      if (apiRes.ok) {
        const json = await apiRes.json();
        const items = json.data || json;
        if (Array.isArray(items) && items.length > 0) {
          return items.map((r: any) => ({
            id: r.slug || r.id,
            name: r.name,
            tagline: "Authentic Restaurant & Fine Dining",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
            photos: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
            rating: r.reviewRating || 4.8,
            reviewCount: r.ordersCount || 120,
            cuisines: ["Cafe", "Multi-Cuisine", "Gourmet"],
            distance: "2.1 km",
            time: "20-30 min",
            address: r.address || `${r.city}`,
            phone: r.phone || "+91 98765 43210",
            openNow: true,
            openTime: "09:00 AM",
            closeTime: "11:00 PM",
            priceForTwo: "₹500 for two",
            dietary: "mixed",
            tags: ["Verified", "QR Ordering", "Table Booking"],
            about: `Welcome to ${r.name} in ${r.city}. Authentic food served fresh every day.`,
            menuCategories: [],
          }));
        }
      }
    } catch (e) {
      console.warn("Backend fetch error, using local database fallback:", e);
    }
    return this.getAllRestaurants();
  }

  public async fetchByIdFromBackend(idOrSlug: string): Promise<RestaurantDetail> {
    try {
      const apiRes = await fetch(`http://localhost:4000/restaurants/${idOrSlug}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        const r = json.data || json;
        if (r && r.name) {
          const formattedCategories = (r.categories || []).map((cat: any) => ({
            name: cat.name,
            items: (r.menuItems || [])
              .filter((mi: any) => mi.categoryId === cat.id)
              .map((mi: any) => ({
                id: mi.id,
                name: mi.name,
                price: mi.price,
                isVeg: true,
                bestseller: true,
                description: mi.description || "",
                image: mi.imageUrl || "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
              })),
          }));

          return {
            id: r.slug || r.id,
            name: r.name,
            tagline: "Artisanal Food & Fine Dining",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
            photos: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"],
            rating: r.avgRating || 4.8,
            reviewCount: r.reviewsCount || 15,
            cuisines: ["Cafe", "Gourmet"],
            distance: "1.8 km",
            time: "25-30 min",
            address: r.address || `${r.city}`,
            phone: r.phone || "+91 98765 43210",
            openNow: true,
            openTime: "08:00 AM",
            closeTime: "11:30 PM",
            priceForTwo: "₹600 for two",
            dietary: "mixed",
            tags: ["Verified", "QR Ordering", "Table Booking"],
            about: `Experience fine culinary dining at ${r.name}.`,
            menuCategories: formattedCategories.length > 0 ? formattedCategories : RESTAURANTS_DATABASE["the-urban-cafe"]!.menuCategories,
          };
        }
      }
    } catch (e) {
      console.warn("Backend fetch error by ID, using local database fallback:", e);
    }
    return this.getRestaurantById(idOrSlug);
  }
}

export const mockRestaurantRepo = new MockRestaurantRepository();

