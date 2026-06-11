"use client";

import { useState, useTransition } from "react";
import { 
  Coffee, UtensilsCrossed, Pizza, Fish, Loader2, 
  Flame, Wine, Leaf, Beer, Soup, Salad, Croissant, Beef
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applyMenuTemplate } from "@/app/dashboard/actions";
import { MENU_TEMPLATES } from "@/lib/templates";

export function MenuTemplateSelector({ 
  menuId, 
  restaurantId 
}: { 
  menuId: string;
  restaurantId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const handleApplyTemplate = (templateId: string) => {
    setLoadingTemplateId(templateId);
    startTransition(async () => {
      try {
        await applyMenuTemplate(menuId, restaurantId, templateId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTemplateId(null);
      }
    });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "cafe": return <Coffee className="h-6 w-6 text-amber-600" />;
      case "italian": return <Pizza className="h-6 w-6 text-red-600" />;
      case "japanese": return <Fish className="h-6 w-6 text-blue-600" />;
      case "mexican": return <Flame className="h-6 w-6 text-orange-600" />;
      case "finedining": return <Wine className="h-6 w-6 text-purple-700" />;
      case "vegan": return <Leaf className="h-6 w-6 text-emerald-500" />;
      case "indian": return <Flame className="h-6 w-6 text-orange-500" />;
      case "pub": return <Beer className="h-6 w-6 text-amber-500" />;
      case "chinese": return <Soup className="h-6 w-6 text-red-500" />;
      case "thai": return <Flame className="h-6 w-6 text-orange-400" />;
      case "mediterranean": return <Salad className="h-6 w-6 text-green-600" />;
      case "french": return <Croissant className="h-6 w-6 text-amber-700" />;
      case "korean": return <Beef className="h-6 w-6 text-red-700" />;
      case "bbq": return <Beef className="h-6 w-6 text-orange-800" />;
      case "middle_eastern": return <Salad className="h-6 w-6 text-green-500" />;
      case "tapas": return <Wine className="h-6 w-6 text-red-800" />;
      case "vietnamese": return <Soup className="h-6 w-6 text-amber-600" />;
      case "brazilian": return <Beef className="h-6 w-6 text-rose-800" />;
      case "seafood": return <Fish className="h-6 w-6 text-teal-600" />;
      default: return <UtensilsCrossed className="h-6 w-6 text-slate-600" />;
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Start from a Template</h3>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Save time by pre-populating your menu with standard categories and dummy items tailored to your cuisine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MENU_TEMPLATES.map((template) => (
          <Card 
            key={template.id} 
            className="group relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => {
              if (!isPending) handleApplyTemplate(template.id);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                  {getIcon(template.id)}
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {template.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {template.categories.slice(0, 4).map(cat => (
                  <span key={cat.name} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded">
                    {cat.name}
                  </span>
                ))}
                {template.categories.length > 4 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded">
                    +{template.categories.length - 4} more
                  </span>
                )}
              </div>
              <Button 
                variant={loadingTemplateId === template.id ? "secondary" : "outline"}
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                disabled={isPending}
              >
                {loadingTemplateId === template.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Use this template"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
