
"use client";

import { useState } from "react";
import { CopyPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { importCategoriesAndItems } from "@/app/dashboard/actions";

interface ImportItemsModalProps {
  menus: { id: string; name: string; [key: string]: unknown }[];
  categories: { id: string; name: string; menu_id?: string; [key: string]: unknown }[];
  targetMenuId: string;
}

export function ImportItemsModal({ menus, categories, targetMenuId }: ImportItemsModalProps) {
  const [open, setOpen] = useState(false);
  const [sourceMenuId, setSourceMenuId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Filter out the target menu so you can't import from yourself
  const availableMenus = menus.filter(m => m.id !== targetMenuId);
  
  // Get categories for the selected source menu
  const sourceCategories = categories.filter(c => c.menu_id === sourceMenuId);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === sourceCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(sourceCategories.map(c => c.id));
    }
  };

  const handleImport = async () => {
    if (!sourceMenuId || selectedCategories.length === 0) return;
    
    setIsLoading(true);
    try {
      await importCategoriesAndItems(sourceMenuId, targetMenuId, selectedCategories);
      setOpen(false);
      setSourceMenuId("");
      setSelectedCategories([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to import items");
    } finally {
      setIsLoading(false);
    }
  };

  if (availableMenus.length === 0) {
    return null; // Can't import if there are no other menus
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CopyPlus className="h-4 w-4" />
          Import Items
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Categories & Items</DialogTitle>
          <DialogDescription>
            Copy entire categories (including all their items) from another menu into this one.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Select Source Menu</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={sourceMenuId}
              onChange={(e) => {
                setSourceMenuId(e.target.value);
                setSelectedCategories([]);
              }}
            >
              <option value="" disabled>Choose a menu to import from...</option>
              {availableMenus.map(menu => (
                <option key={menu.id} value={menu.id}>{menu.name}</option>
              ))}
            </select>
          </div>

          {sourceMenuId && sourceCategories.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Categories</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-primary"
                  onClick={handleSelectAll}
                >
                  {selectedCategories.length === sourceCategories.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="border rounded-md p-3 space-y-3 max-h-[200px] overflow-y-auto">
                {sourceCategories.map(cat => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                    />
                    <label 
                      htmlFor={`cat-${cat.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sourceMenuId && sourceCategories.length === 0 && (
            <div className="text-sm text-slate-500 italic">
              This menu has no categories to import.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || selectedCategories.length === 0}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
