"use client";

import React, { useState, useEffect } from "react";
// next/image removed: menu item images are user-provided DB URLs (arbitrary hosts)
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Leaf,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  isVeg: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  description: string;
  image: string;
}

export default function BusinessMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Starters & Appetizers");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState(299);
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [restaurantId, setRestaurantId] = useState("");

  const fetchLiveMenu = async () => {
    let rId = "";
    try {
      const stored = localStorage.getItem("fm_restaurant_id");
      if (stored) rId = stored;
    } catch {}
    setRestaurantId(rId);

    setLoading(true);
    setError(null);

    try {
      const [menuRes, restRes] = await Promise.all([
        fetch(`${API_BASE_URL}/restaurants/${rId}/menu`),
        fetch(`${API_BASE_URL}/restaurants/${rId}`),
      ]);

      const menuJson = menuRes.ok ? await menuRes.json() : null;
      const restJson = restRes.ok ? await restRes.json() : null;

      const categoriesData = menuJson?.data || menuJson || [];
      const restaurantData = restJson?.data || restJson;

      let extractedCategories: { id: string; name: string }[] = [];
      let extractedItems: MenuItem[] = [];

      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        categoriesData.forEach((c: any) => {
          extractedCategories.push({ id: c.id, name: c.name });
          (c.items || []).forEach((m: any) => {
            extractedItems.push({
              id: m.id,
              name: m.name,
              category: c.name,
              categoryId: c.id,
              price: Number(m.price),
              isVeg: true,
              isBestseller: false,
              isAvailable: m.isAvailable !== false,
              description: m.description || "Freshly crafted delicious recipe.",
              image: m.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
            });
          });
        });
      } else if (restaurantData) {
        const cats = restaurantData.categories || [];
        const rawItems = restaurantData.menuItems || [];
        cats.forEach((c: any) => extractedCategories.push({ id: c.id, name: c.name }));
        rawItems.forEach((m: any) => {
          const matchedCat = cats.find((c: any) => c.id === m.categoryId);
          extractedItems.push({
            id: m.id,
            name: m.name,
            category: matchedCat?.name || "Main Course",
            categoryId: m.categoryId,
            price: Number(m.price),
            isVeg: true,
            isBestseller: false,
            isAvailable: m.isAvailable !== false,
            description: m.description || "Freshly crafted delicious recipe.",
            image: m.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          });
        });
      }

      setCategoriesList(extractedCategories);
      setItems(extractedItems);
    } catch (err) {
      setError("Failed to connect to backend menu service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMenu();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName("");
    const defaultCat = categoriesList[0];
    setFormCategory(defaultCat?.name || "Main Course");
    setFormCategoryId(defaultCat?.id || "cat-mains");
    setFormPrice(299);
    setFormIsVeg(true);
    setFormIsBestseller(false);
    setFormDescription("");
    setFormImage("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormCategoryId(item.categoryId || "");
    setFormPrice(item.price);
    setFormIsVeg(item.isVeg);
    setFormIsBestseller(item.isBestseller);
    setFormDescription(item.description);
    setFormImage(item.image);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setFormLoading(true);

    try {
      if (editingItem) {
        // UPDATE ITEM
        const res = await fetch(`${API_BASE_URL}/restaurants/items/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            price: formPrice,
            description: formDescription,
          }),
        });

        if (res.ok) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === editingItem.id
                ? {
                    ...i,
                    name: formName,
                    price: formPrice,
                    description: formDescription,
                    image: formImage || i.image,
                  }
                : i
            )
          );
        }
      } else {
        // CREATE NEW ITEM
        const targetCatId = formCategoryId || categoriesList[0]?.id || "cat-mains";
        const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            price: formPrice,
            description: formDescription,
            imageUrl: formImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
            categoryId: targetCatId,
          }),
        });
        const json = await res.json();
        const created = json.data;

        if (res.ok && created) {
          const newItem: MenuItem = {
            id: created.id,
            name: created.name,
            category: formCategory,
            categoryId: created.categoryId,
            price: Number(created.price),
            isVeg: formIsVeg,
            isBestseller: formIsBestseller,
            isAvailable: true,
            description: created.description || formDescription,
            image: created.imageUrl || formImage,
          };
          setItems((prev) => [newItem, ...prev]);
        }
      }
    } catch (e) {
      console.warn("Menu item save error:", e);
    } finally {
      setFormLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/restaurants/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.warn("Menu item delete warning:", e);
    }
  };

  const toggleAvailability = async (id: string) => {
    const current = items.find((i) => i.id === id);
    const nextState = !current?.isAvailable;

    try {
      await fetch(`${API_BASE_URL}/restaurants/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: nextState }),
      });
    } catch (e) {
      console.warn("Availability toggle warning:", e);
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isAvailable: nextState } : i))
    );
  };

  const categoryNames = ["All", ...categoriesList.map((c) => c.name)];

  const filteredItems = items.filter((i) => {
    const matchesCat = selectedCategory === "All" || i.category === selectedCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <UtensilsCrossed className="text-[#FF6B4A]" />
            <span>Digital Menu Management</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage restaurant categories, dish prices, dietary tags, and live availability in PostgreSQL.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} className="min-h-[44px]">
          <Plus size={18} />
          <span>Add New Dish</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border min-h-[38px] ${
                selectedCategory === cat
                  ? "bg-[#FF6B4A] text-white border-[#FF6B4A] shadow-sm"
                  : "bg-white text-[#666666] border-[#ECECEC] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu dishes..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#ECECEC] text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
          />
        </div>
      </div>

      {/* Main Items Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-[24px] border border-[#ECECEC]">
          <Loader2 className="animate-spin text-[#FF6B4A] mx-auto" size={32} />
          <p className="text-xs text-[#8C8CA1]">Loading live menu from PostgreSQL database...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-[24px] text-center space-y-2">
          <AlertCircle className="mx-auto text-red-500" size={28} />
          <p className="text-xs text-red-600 font-semibold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchLiveMenu}>Retry</Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] border border-[#ECECEC] space-y-3">
          <UtensilsCrossed size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
          <h3 className="font-display font-bold text-base text-[#222222]">No Dishes Found</h3>
          <p className="text-xs text-[#8C8CA1]">Add your first dish or adjust your filter/search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              padding="md"
              className={`bg-white border transition-all ${
                item.isAvailable ? "border-[#ECECEC] shadow-card" : "border-gray-200 opacity-60 bg-gray-50"
              }`}
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-[16px] overflow-hidden shrink-0 bg-gray-100">
                  {/* Plain img used: src is user-provided/DB-stored and may be any external host */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display font-bold text-sm text-[#222222] truncate">{item.name}</h3>
                    <span className="font-display font-extrabold text-sm text-[#FF6B4A]">₹{item.price}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#ECECEC] text-[#666666]">
                      {item.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${item.isVeg ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#666666] line-clamp-2">{item.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ECECEC] text-xs">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`font-semibold flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    item.isAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-200 text-gray-700 border-gray-300"
                  }`}
                >
                  {item.isAvailable ? <Check size={12} /> : <X size={12} />}
                  <span>{item.isAvailable ? "Available" : "Sold Out"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-[#666666] hover:text-[#222222]"
                    aria-label="Edit dish"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 text-[#666666] hover:text-red-600"
                    aria-label="Delete dish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h3 className="font-display font-bold text-lg text-[#222222]">
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#999999] hover:text-[#222222]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Truffle Burrata Pizza"
                  className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px] px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => {
                      setFormCategoryId(e.target.value);
                      const catObj = categoriesList.find((c) => c.id === e.target.value);
                      if (catObj) setFormCategory(catObj.name);
                    }}
                    className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px] px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px] px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Freshly prepared recipe details..."
                  className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px] px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px] px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={formLoading}>
                  {formLoading ? "Saving..." : "Save Dish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
