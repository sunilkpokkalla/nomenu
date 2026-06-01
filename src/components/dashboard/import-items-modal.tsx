"use client";

import { useState } from "react";
import { CopyPlus, Loader2, ChevronDown, ChevronRight } from "lucide-react";
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

import { importSpecificItems } from "@/app/dashboard/actions";

interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  [key: string]: unknown;
}

interface ImportItemsModalProps {
  menus: { id: string; name: string; [key: string]: unknown }[];
  categories: { id: string; name: string; menu_id?: string; [key: string]: unknown }[];
  items: MenuItem[];
  targetMenuId: string;
}

export function ImportItemsModal({ menus, categories, items, targetMenuId }: ImportItemsModalProps) {
  const [open, setOpen] = useState(false);
  const [sourceMenuId, setSourceMenuId] = useState<string>("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Filter out the target menu so you can't import from yourself
  const availableMenus = menus.filter(m => m.id !== targetMenuId);
  
  // Get categories for the selected source menu
  const sourceCategories = categories.filter(c => c.menu_id === sourceMenuId);

  // Helper to toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  // Helper to handle individual item toggle
  const handleItemToggle = (itemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Helper to handle category-level "Select All" toggle
  const handleCategorySelectAll = (categoryId: string) => {
    const categoryItems = items.filter(i => i.category_id === categoryId);
    const categoryItemIds = categoryItems.map(i => i.id);
    
    // Check if all items in this category are currently selected
    const allSelected = categoryItemIds.every(id => selectedItemIds.includes(id));
    
    if (allSelected) {
      // Deselect all items in this category
      setSelectedItemIds(prev => prev.filter(id => !categoryItemIds.includes(id)));
    } else {
      // Select all items in this category
      setSelectedItemIds(prev => {
        const newIds = new Set([...prev, ...categoryItemIds]);
        return Array.from(newIds);
      });
    }
  };

  const handleGlobalSelectAll = () => {
    const allSourceItems = items.filter(i => sourceCategories.some(c => c.id === i.category_id));
    const allSourceItemIds = allSourceItems.map(i => i.id);

    if (selectedItemIds.length === allSourceItemIds.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(allSourceItemIds);
    }
  };

  const handleImport = async () => {
    if (!sourceMenuId || selectedItemIds.length === 0) return;
    
    setIsLoading(true);
    try {
      await importSpecificItems(targetMenuId, selectedItemIds);
      setOpen(false);
      setSourceMenuId("");
      setSelectedItemIds([]);
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

  const allSourceItems = items.filter(i => sourceCategories.some(c => c.id === i.category_id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CopyPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Import Items</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Specific Items</DialogTitle>
          <DialogDescription>
            Select individual items from another menu to copy them into your current menu.
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
                setSelectedItemIds([]);
                setExpandedCategories([]);
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
                <Label>Select Items</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-primary"
                  onClick={handleGlobalSelectAll}
                >
                  {selectedItemIds.length === allSourceItems.length && allSourceItems.length > 0 ? "Deselect All" : "Select All Items"}
                </Button>
              </div>
              
              <div className="border rounded-md max-h-[300px] overflow-y-auto bg-slate-50">
                {sourceCategories.map(cat => {
                  const categoryItems = items.filter(i => i.category_id === cat.id);
                  if (categoryItems.length === 0) return null;

                  const isExpanded = expandedCategories.includes(cat.id);
                  const selectedInCategory = categoryItems.filter(i => selectedItemIds.includes(i.id)).length;
                  const allSelected = selectedInCategory === categoryItems.length;

                  return (
                    <div key={cat.id} className="border-b last:border-b-0 border-slate-200">
                      <div className="flex items-center justify-between p-2 hover:bg-slate-100 transition-colors">
                        <div 
                          className="flex items-center gap-2 cursor-pointer flex-1" 
                          onClick={() => toggleCategory(cat.id)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                          <span className="text-sm font-medium">{cat.name}</span>
                          <span className="text-xs text-slate-400">({categoryItems.length})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {selectedInCategory > 0 && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {selectedInCategory} selected
                            </span>
                          )}
                          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleCategorySelectAll(cat.id)}>
                            <input 
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                              checked={allSelected}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-white px-4 py-2 space-y-2 border-t border-slate-100">
                          {categoryItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 py-1">
                              <input 
                                type="checkbox"
                                id={`item-${item.id}`}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedItemIds.includes(item.id)}
                                onChange={() => handleItemToggle(item.id)}
                              />
                              <label 
                                htmlFor={`item-${item.id}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                              >
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {sourceMenuId && sourceCategories.length === 0 && (
            <div className="text-sm text-slate-500 italic">
              This menu has no categories or items to import.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || selectedItemIds.length === 0}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import {selectedItemIds.length > 0 && `(${selectedItemIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
