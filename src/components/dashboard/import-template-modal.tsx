"use client";

import { useState, useTransition } from "react";
import { 
  Coffee, UtensilsCrossed, Pizza, Fish, Loader2, 
  Flame, Wine, Leaf, Beer, Soup, Salad, Croissant, Beef, 
  Wand2, Search, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { applyMenuTemplate } from "@/app/dashboard/actions";
import { MENU_TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

export function ImportTemplateModal({ 
  menuId, 
  restaurantId 
}: { 
  menuId: string;
  restaurantId: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    
    startTransition(async () => {
      try {
        await applyMenuTemplate(menuId, restaurantId, selectedTemplateId);
        setOpen(false);
        setSelectedTemplateId(null);
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Failed to apply template";
        alert(errorMessage);
      }
    });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "cafe": return <Coffee className="h-4 w-4 text-amber-600" />;
      case "italian": return <Pizza className="h-4 w-4 text-red-600" />;
      case "japanese": return <Fish className="h-4 w-4 text-blue-600" />;
      case "mexican": return <Flame className="h-4 w-4 text-orange-600" />;
      case "finedining": return <Wine className="h-4 w-4 text-purple-700" />;
      case "vegan": return <Leaf className="h-4 w-4 text-emerald-500" />;
      case "indian": return <Flame className="h-4 w-4 text-orange-500" />;
      case "pub": return <Beer className="h-4 w-4 text-amber-500" />;
      case "chinese": return <Soup className="h-4 w-4 text-red-500" />;
      case "thai": return <Flame className="h-4 w-4 text-orange-400" />;
      case "mediterranean": return <Salad className="h-4 w-4 text-green-600" />;
      case "bakery": return <Croissant className="h-4 w-4 text-amber-700" />;
      case "french": return <Croissant className="h-4 w-4 text-amber-700" />;
      case "korean": return <Beef className="h-4 w-4 text-red-700" />;
      case "seafood": return <Fish className="h-4 w-4 text-teal-600" />;
      case "fine-dining": return <Wine className="h-4 w-4 text-slate-800" />;
      default: return <UtensilsCrossed className="h-4 w-4 text-slate-600" />;
    }
  };

  const filteredTemplates = MENU_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTemplate = MENU_TEMPLATES.find(t => t.id === selectedTemplateId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 className="h-4 w-4 text-indigo-500" />
          <span className="hidden sm:inline">Import Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white gap-0">
        <div className="flex h-[600px] flex-col sm:flex-row">
          
          {/* Left Sidebar: List of templates */}
          <div className="w-full sm:w-[300px] border-r border-slate-100 flex flex-col bg-slate-50/30">
            <div className="p-4 border-b border-slate-100">
              <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 mb-3">Templates</DialogTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search cuisines..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No templates found.
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200",
                      selectedTemplateId === template.id 
                        ? "bg-white border border-indigo-100 shadow-[0_2px_10px_-3px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/10 text-indigo-900" 
                        : "hover:bg-white/60 text-slate-600 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg shrink-0 transition-colors",
                      selectedTemplateId === template.id ? "bg-indigo-50" : "bg-white shadow-sm border border-slate-100"
                    )}>
                      {getIcon(template.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{template.name}</div>
                      <div className={cn("text-xs truncate", selectedTemplateId === template.id ? "text-indigo-600 font-medium" : "text-slate-400")}>
                        {template.categories.length} categories
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="flex-1 flex flex-col bg-white min-w-0">
            {selectedTemplate ? (
              <>
                {/* Premium Gradient Header */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
                  {/* Abstract decorative shapes */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
                  <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl" />
                  
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-white tracking-tight">{selectedTemplate.name}</h3>
                      <p className="text-indigo-100/80 mt-2 text-sm leading-relaxed max-w-md">{selectedTemplate.description}</p>
                    </div>
                    <div className="shrink-0 text-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl shadow-xl">
                      <div className="text-3xl font-bold text-white">
                        {selectedTemplate.categories.reduce((acc, cat) => acc + cat.items.length, 0)}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mt-1">Total Items</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Menu Structure Preview</h4>
                  <div className="space-y-8">
                    {selectedTemplate.categories.map((cat, i) => (
                      <div key={i} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                          <span className="font-bold text-slate-900 text-lg">{cat.name}</span>
                          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full ring-1 ring-indigo-500/20">
                            {cat.items.length} items
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          {cat.items.slice(0, 6).map((item, j) => (
                            <div key={j} className="text-sm flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                              <span className="text-slate-700 font-medium truncate">{item.name}</span>
                            </div>
                          ))}
                          {cat.items.length > 6 && (
                            <div className="text-sm text-indigo-400/80 italic flex items-center gap-2.5 font-medium">
                               <div className="w-1.5 h-1.5 rounded-full bg-transparent mt-1 shrink-0" />
                              + {cat.items.length - 6} more dishes
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <Wand2 className="h-8 w-8 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Explore Templates</h3>
                <p className="mt-2 text-sm max-w-[250px] leading-relaxed">Select a cuisine from the list to preview its beautiful menu structure.</p>
              </div>
            )}
            
            {/* Bottom Action Bar */}
            <div className="mt-auto p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
              <p className="text-xs font-medium text-slate-400 max-w-[300px] hidden sm:block">
                Importing will cleanly generate these items in your menu. You can customize them anytime.
              </p>
              <div className="flex justify-end gap-3 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending} className="hover:bg-slate-100 font-medium">
                  Cancel
                </Button>
                <Button 
                  disabled={!selectedTemplateId || isPending} 
                  onClick={handleApplyTemplate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px] shadow-md hover:shadow-lg transition-all font-bold"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import to Menu"
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
