"use client";

import { useState } from "react";
import { Settings2, Trash2, Edit2, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { deleteCategory, updateCategory } from "@/app/dashboard/actions";

interface Category {
  id: string;
  name: string;
  menu_id: string;
}

interface ManageCategoriesModalProps {
  categories: Category[];
  targetMenuId: string;
}

export function ManageCategoriesModal({ categories, targetMenuId }: ManageCategoriesModalProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const menuCategories = categories.filter(c => c.menu_id === targetMenuId);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setEditingId(null);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Manage Categories</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Rename or delete categories for this menu. 
            (Deleting a category only affects this menu, but it will permanently delete all items inside of it).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {menuCategories.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No categories in this menu.</p>
          ) : (
            <div className="space-y-2">
              {menuCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                  {editingId === cat.id ? (
                    <form 
                      action={(formData) => {
                        updateCategory(formData);
                        setEditingId(null);
                      }} 
                      className="flex items-center gap-2 w-full"
                    >
                      <input type="hidden" name="categoryId" value={cat.id} />
                      <Input 
                        name="name" 
                        defaultValue={cat.name} 
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button type="submit" size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button type="button" onClick={() => setEditingId(null)} size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400">
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="font-medium text-sm truncate pr-4">{cat.name}</span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(cat.id)}
                          className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <DeleteConfirmForm
                          action={deleteCategory}
                          confirmMessage={`Are you sure you want to delete "${cat.name}"? ALL items inside this category will be permanently deleted from this menu!`}
                          name="categoryId"
                          value={cat.id}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteConfirmForm>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
