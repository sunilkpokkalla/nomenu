"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { ChefLibraryModal } from "@/components/dashboard/chef-library-modal";
import { LibraryDish } from "@/lib/global-dish-library";

export interface MenuItemData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
}

interface CreateItemFormProps {
  cuisineType?: string | null;
  menus: { id: string; name: string }[];
  categories: { id: string; name: string; menu_id: string }[];
  createAction: (formData: FormData) => Promise<void>;
  initialData?: MenuItemData;
}

export function CreateItemForm({ cuisineType, menus, categories, createAction, initialData }: CreateItemFormProps) {
  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData ? initialData.price.toString() : "");
  const [calories, setCalories] = useState(initialData?.calories?.toString() || "");
  const initialCategory = categories.find(c => c.id === initialData?.category_id);
  const [menuId, setMenuId] = useState(initialCategory?.menu_id || menus[0]?.id || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // Dietary states
  const [isPopular, setIsPopular] = useState(initialData?.is_popular ?? false);
  const [isVegetarian, setIsVegetarian] = useState(initialData?.is_vegetarian ?? false);
  const [isVegan, setIsVegan] = useState(initialData?.is_vegan ?? false);
  const [isGlutenFree, setIsGlutenFree] = useState(initialData?.is_gluten_free ?? false);
  const [isSpicy, setIsSpicy] = useState(initialData?.is_spicy ?? false);
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");

  const filteredCategories = categories.filter(cat => cat.menu_id === menuId);

  const handleSelectDish = (dish: LibraryDish) => {
    setName(dish.name);
    setDescription(dish.description);
    
    setImageUrl(dish.imageUrl || "");
    
    setIsPopular(true);
    setIsVegetarian(!!dish.isVegetarian);
    setIsVegan(!!dish.isVegan);
    setIsGlutenFree(!!dish.isGlutenFree);
    setIsSpicy(!!dish.isSpicy);
    
    // Attempt to select a relevant category or let user choose
    const categoryMatch = filteredCategories.find(c => 
      c.name.toLowerCase().includes(dish.category.toLowerCase()) || 
      dish.category.toLowerCase().includes(c.name.toLowerCase())
    );
    if (categoryMatch) {
      setCategoryId(categoryMatch.id);
      setNewCategoryName("");
    } else {
      setCategoryId("");
      setNewCategoryName(dish.category);
    }
  };

  return (
    <div className="space-y-4">
      {!initialData && (
        <>
          <ChefLibraryModal
            cuisineType={cuisineType}
            menus={menus}
            categories={categories}
            onSelectDish={handleSelectDish}
          />
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-1">Or Create Custom</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </>
      )}

      <form action={createAction} className="space-y-4">
        {initialData && <input type="hidden" name="itemId" value={initialData.id} />}
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="e.g. Ribeye Steak, Cappuccino" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        
        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              placeholder="e.g. 450"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="menuId">Assign to Menu</Label>
            <select
              id="menuId"
              name="menuId"
              value={menuId}
              onChange={(e) => {
                setMenuId(e.target.value);
                setCategoryId("");
              }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

        <div className="space-y-2 border-t pt-3">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">— Create New Category (Enter below) —</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newCategoryName">Or Create New Category</Label>
          <Input
            id="newCategoryName"
            name="newCategoryName"
            placeholder="e.g. Starters, Desserts, Cocktails"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Creates category in the chosen menu if select above is set to create new.
          </p>
        </div>

        <div className="space-y-2 border-t pt-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description</Label>
            <button
              type="button"
              onClick={() => setDescription("Served with seasonal roasted vegetables and fresh garlic herb butter.")}
              className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
            >
              Autofill Example
            </button>
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="e.g. Served with seasonal roasted vegetables and fresh garlic herb butter."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2 border-t pt-3">
          <Label>Dietary & Marketing Labels</Label>
          <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isPopular" value="true" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              Popular / Chef Spec
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isVegetarian" value="true" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              Vegetarian
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isVegan" value="true" checked={isVegan} onChange={(e) => setIsVegan(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              Vegan
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isGlutenFree" value="true" checked={isGlutenFree} onChange={(e) => setIsGlutenFree(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              Gluten Free
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isSpicy" value="true" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              Spicy
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="checkbox" name="isAvailable" value="true" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
              In Stock / Available
            </label>
          </div>
        </div>

        <div className="pt-2 border-t mt-4">
          <ImageUploader value={imageUrl} onChange={setImageUrl} />
        </div>

        <Button type="submit" className="w-full">
          {initialData ? null : <Plus className="mr-2 h-4 w-4" />}
          {initialData ? "Save Changes" : "Save Menu Item"}
        </Button>
      </form>
    </div>
  );
}
