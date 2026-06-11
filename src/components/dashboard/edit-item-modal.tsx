"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateItemForm, MenuItemData } from "@/components/dashboard/create-item-form";
import { editMenuItem } from "@/app/dashboard/actions";

interface EditItemModalProps {
  item: MenuItemData;
  menus: { id: string; name: string }[];
  categories: { id: string; name: string; menu_id: string }[];
  trigger?: React.ReactNode;
}

export function EditItemModal({ item, menus, categories, trigger }: EditItemModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-slate-500 hover:text-slate-900 p-2"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details for "{item.name}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <CreateItemForm
            menus={menus}
            categories={categories}
            createAction={editMenuItem}
            initialData={item}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
