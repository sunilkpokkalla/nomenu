"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Save, Trash2, Edit2, CheckCircle2, User, Users, Coffee, Ban } from "lucide-react";
import { saveTableLayout, addFloorPlanArea } from "./floor-plan-actions";
import { useRouter } from "next/navigation";
import { createWalkInTab, voidTableTab } from "./actions";

type TableShape = "rectangle" | "circle";

interface RestaurantTable {
  id: string;
  floor_plan_id: string;
  table_number: string;
  capacity: number;
  shape: TableShape;
  x: number;
  y: number;
  width: number;
  height: number;
  isNew?: boolean;
}

interface FloorPlanBoardProps {
  restaurantId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFloorPlans: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeOrders: any[];
  onSelectTable?: (tables: RestaurantTable[], compositeTableString: string) => void;
}

export function FloorPlanBoard({ restaurantId, initialFloorPlans, activeOrders, onSelectTable }: FloorPlanBoardProps) {
  const [activePlanId, setActivePlanId] = useState<string>(initialFloorPlans[0]?.id || "");
  const activePlan = initialFloorPlans.find(p => p.id === activePlanId) || initialFloorPlans[0];
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [tables, setTables] = useState<RestaurantTable[]>(activePlan?.restaurant_tables || []);
  const [deletedTableIds, setDeletedTableIds] = useState<string[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingLiveAction, setIsProcessingLiveAction] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Live Mode Selection State
  const [selectedLiveTableIds, setSelectedLiveTableIds] = useState<string[]>([]);
  
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };
  
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activePlan) {
      setTables(activePlan.restaurant_tables || []);
      setSelectedTableId(null);
    }
  }, [activePlanId, activePlan]);

  const handleAddTable = () => {
    const newTable: RestaurantTable = {
      id: `temp-${Date.now()}`,
      floor_plan_id: activePlanId,
      table_number: `${tables.length + 1}`,
      capacity: 4,
      shape: "rectangle",
      x: 50,
      y: 50,
      width: 120,
      height: 80,
      isNew: true
    };
    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
  };

  const handleSave = async () => {
    if (!activePlanId) return;
    setIsSaving(true);
    // Filter out 'isNew' flag for the backend
    const tablesToUpsert = tables.map(t => {
      const { isNew, ...rest } = t;
      return rest;
    });

    const res = await saveTableLayout(activePlanId, tablesToUpsert, deletedTableIds);
    if (res.success) {
      setIsEditMode(false);
      setDeletedTableIds([]);
      router.refresh();
    } else {
      showError("Failed to save layout.");
    }
    setIsSaving(false);
  };

  const handleDeleteTable = (id: string) => {
    if (!id.startsWith("temp-")) {
      setDeletedTableIds([...deletedTableIds, id]);
    }
    setTables(tables.filter(t => t.id !== id));
    setSelectedTableId(null);
  };

  const updateSelectedTable = (updates: Partial<RestaurantTable>) => {
    setTables(tables.map(t => t.id === selectedTableId ? { ...t, ...updates } : t));
  };

  const handleAddArea = async () => {
    if (!newAreaName.trim()) return;
    setIsProcessingLiveAction(true);
    try {
      const res = await addFloorPlanArea(restaurantId, newAreaName.trim());
      if (res.success) {
        setNewAreaName("");
        setIsAddingArea(false);
        router.refresh();
        if (res.area) {
          setActivePlanId(res.area.id);
        }
      } else {
        showError("Failed to add floor plan.");
      }
    } catch (error) {
      showError("Error adding floor plan.");
    }
    setIsProcessingLiveAction(false);
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;

    if (!isEditMode) {
      // Find if this table is currently occupied
      const compositeName = `${activePlan?.name || "Main Floor"} - ${table.table_number}`;
      const activeOrder = activeOrders.find(o => 
        o.table_number && String(o.table_number).split(',').map(s=>s.trim()).includes(compositeName)
      );

      if (activeOrder) {
        if (onSelectTable) {
          showError(`Table ${table.table_number} is already occupied!`);
          return;
        }
        // If they click an occupied table in standard live mode, we select all tables in that active order
        const occupiedTableNumbers = String(activeOrder.table_number).split(',').map(s=>s.trim());
        const associatedTableIds = tables.filter(t => occupiedTableNumbers.includes(`${activePlan?.name || "Main Floor"} - ${t.table_number}`)).map(t => t.id);
        setSelectedLiveTableIds(associatedTableIds);
      } else {
        // Empty table - toggle selection
        setSelectedLiveTableIds(prev => {
          // If we had occupied tables selected before, clear them when clicking an empty one
          const hasOccupiedSelected = prev.some(tid => {
            const t = tables.find(tb => tb.id === tid);
            if (!t) return false;
            const cName = `${activePlan?.name || "Main Floor"} - ${t.table_number}`;
            return activeOrders.some(o => o.table_number && String(o.table_number).split(',').map(s=>s.trim()).includes(cName));
          });
          
          if (hasOccupiedSelected) {
            return [id];
          }

          if (prev.includes(id)) {
            return prev.filter(tid => tid !== id);
          }
          return [...prev, id];
        });
      }
      return;
    }
    
    setSelectedTableId(id);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - table.x;
      const offsetY = e.clientY - rect.top - table.y;
      
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isEditMode || !selectedTableId) return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - rect.left - dragOffset.x;
      let newY = e.clientY - rect.top - dragOffset.y;

      newX = Math.round(newX / 10) * 10;
      newY = Math.round(newY / 10) * 10;

      newX = Math.max(0, Math.min(newX, rect.width - 50));
      newY = Math.max(0, Math.min(newY, rect.height - 50));

      setTables(tables.map(t => t.id === selectedTableId ? { ...t, x: newX, y: newY } : t));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const selectedTableData = tables.find(t => t.id === selectedTableId);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Areas Tabs */}
      <div className="flex items-center gap-2">
        {initialFloorPlans.length > 0 && (
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            {initialFloorPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  if (!isEditMode) setActivePlanId(plan.id);
                }}
                disabled={isEditMode}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activePlanId === plan.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        )}
        
        {!isEditMode && !onSelectTable && (
          isAddingArea ? (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <input 
                type="text"
                autoFocus
                value={newAreaName}
                onChange={e => setNewAreaName(e.target.value)}
                placeholder="e.g. Patio"
                className="px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-0 w-32"
                onKeyDown={e => e.key === 'Enter' && handleAddArea()}
              />
              <button 
                onClick={handleAddArea}
                disabled={isProcessingLiveAction || !newAreaName.trim()}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsAddingArea(false);
                  setNewAreaName("");
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingArea(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Floor
            </button>
          )
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{activePlan?.name || "Floor Plan"}</h2>
          {errorMessage ? (
            <p className="text-sm font-bold text-rose-600 animate-in fade-in duration-300">
              {errorMessage}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              {isEditMode ? "Drag tables to reposition them." : "Live view of occupied tables."}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isEditMode ? (
            <>
              <button 
                onClick={handleAddTable}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Table
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Layout</>}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Layout
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-[600px]">
        {/* Canvas */}
        <div 
          ref={containerRef}
          className={`flex-1 bg-slate-50 rounded-xl border-2 overflow-hidden relative touch-none ${isEditMode ? "border-indigo-200 shadow-inner" : "border-slate-200"}`}
          style={{ backgroundImage: isEditMode ? 'radial-gradient(#cbd5e1 1px, transparent 1px)' : 'none', backgroundSize: '20px 20px' }}
        >
          {tables.map(table => {
            const compositeName = `${activePlan?.name || "Main Floor"} - ${table.table_number}`;
            const activeOrder = !isEditMode ? activeOrders.find(o => 
              o.table_number && String(o.table_number).split(',').map(s=>s.trim()).includes(compositeName)
            ) : null;
            const isOccupied = !!activeOrder;
            const isSelectedLive = !isEditMode && selectedLiveTableIds.includes(table.id);

            return (
              <div
                key={table.id}
                onPointerDown={(e) => handlePointerDown(e, table.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  position: 'absolute',
                  left: `${table.x}px`,
                  top: `${table.y}px`,
                  width: `${table.width}px`,
                  height: `${table.height}px`,
                  cursor: isEditMode ? (isDragging && selectedTableId === table.id ? 'grabbing' : 'grab') : 'pointer',
                  zIndex: selectedTableId === table.id ? 10 : 1
                }}
                className={`
                  flex flex-col items-center justify-center border-2 shadow-sm transition-colors select-none relative
                  ${table.shape === 'circle' ? 'rounded-full' : 'rounded-xl'}
                  ${isEditMode && selectedTableId !== table.id ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-400' : ''}
                  ${isEditMode && selectedTableId === table.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : ''}
                  ${!isEditMode && isOccupied ? 'bg-red-50 border-red-500 text-red-700' : ''}
                  ${!isEditMode && !isOccupied ? 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100' : ''}
                  ${isSelectedLive && isOccupied ? 'ring-4 ring-red-200 shadow-lg' : ''}
                  ${isSelectedLive && !isOccupied ? 'ring-4 ring-emerald-200 shadow-lg' : ''}
                `}
              >
                {/* Render visual chairs around the table */}
                {Array.from({ length: table.capacity }).map((_, i) => {
                  // Distribute chairs evenly along the perimeter
                  const angle = (i / table.capacity) * 2 * Math.PI;
                  const chairOffset = 12; // Distance from table edge
                  
                  let left, top;
                  if (table.shape === 'circle') {
                    const radius = table.width / 2;
                    left = radius + (radius + chairOffset) * Math.cos(angle) - 8; // -8 to center the 16px chair
                    top = radius + (radius + chairOffset) * Math.sin(angle) - 8;
                  } else {
                    // Approximate rectangle perimeter placement
                    // For simplicity, just use a slightly padded bounding box logic or ellipse
                    const rx = table.width / 2;
                    const ry = table.height / 2;
                    left = rx + (rx + chairOffset) * Math.cos(angle) - 8;
                    top = ry + (ry + chairOffset) * Math.sin(angle) - 8;
                  }

                  return (
                    <div 
                      key={i} 
                      className={`absolute w-4 h-4 rounded-full border-2 ${
                        isEditMode ? 'bg-slate-200 border-slate-300' : (isOccupied ? 'bg-red-200 border-red-300' : 'bg-emerald-200 border-emerald-300')
                      }`}
                      style={{ left: `${left}px`, top: `${top}px` }}
                    />
                  );
                })}

                <span className="font-bold text-lg z-10">{table.table_number}</span>
                {table.capacity > 0 && (
                  <div className="flex items-center gap-1 text-[10px] opacity-70 mt-1 z-10">
                    <Users className="w-3 h-3" /> {table.capacity}
                  </div>
                )}
                {!isEditMode && isOccupied && activeOrder?.total_amount && (
                  <span className="text-xs font-medium mt-1 bg-white/90 px-2 py-0.5 rounded-full z-10 shadow-sm">
                    ${(activeOrder.total_amount / 100).toFixed(2)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Editor Sidebar */}
        {isEditMode && selectedTableData && (
          <div className="w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center justify-between">
              Table Settings
              <button 
                onClick={() => handleDeleteTable(selectedTableData.id)}
                className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                title="Delete Table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Table Number</label>
                <input 
                  type="text" 
                  value={selectedTableData.table_number}
                  onChange={(e) => updateSelectedTable({ table_number: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Capacity (Seats)</label>
                <input 
                  type="number" 
                  min="1"
                  value={selectedTableData.capacity}
                  onChange={(e) => updateSelectedTable({ capacity: parseInt(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Shape</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => updateSelectedTable({ shape: 'rectangle', width: 120, height: 80 })}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${selectedTableData.shape === 'rectangle' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Rectangle
                  </button>
                  <button 
                    onClick={() => updateSelectedTable({ shape: 'circle', width: 100, height: 100 })}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${selectedTableData.shape === 'circle' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Width (px)</label>
                  <input 
                    type="number" 
                    min="50"
                    step="10"
                    value={selectedTableData.width}
                    onChange={(e) => updateSelectedTable({ width: parseInt(e.target.value) || 50 })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Height (px)</label>
                  <input 
                    type="number" 
                    min="50"
                    step="10"
                    value={selectedTableData.height}
                    onChange={(e) => updateSelectedTable({ height: parseInt(e.target.value) || 50 })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Seating Confirmation Sidebar */}
        {!isEditMode && onSelectTable && selectedLiveTableIds.length > 0 && (
          <div className="w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
            {(() => {
              const allTables = initialFloorPlans.flatMap(p => (p.restaurant_tables || []).map((t: Record<string, unknown>) => ({ ...t, _planName: p.name })));
              const selectedTables = allTables.filter(t => selectedLiveTableIds.includes(t.id));
              const tableNumbersString = selectedTables.map(t => t.table_number).join(', ');
              const compositeTableString = selectedTables.map(t => `${t._planName || "Main Floor"} - ${t.table_number}`).join(', ');
              const totalCapacity = selectedTables.reduce((sum, t) => sum + (t.capacity || 0), 0);
              
              // Extract unique plan names for display
              const planNames = Array.from(new Set(selectedTables.map(t => t._planName || "Main Floor"))).join(' & ');

              return (
                <div className="flex flex-col h-full gap-4">
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 leading-tight">Table {tableNumbersString}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {totalCapacity} Seats • {planNames}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      onSelectTable(selectedTables, compositeTableString);
                      setSelectedLiveTableIds([]);
                    }}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                  >
                    Confirm Seating
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Live Action Sidebar */}
        {!isEditMode && !onSelectTable && selectedLiveTableIds.length > 0 && (
          <div className="w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col overflow-y-auto">
            {(() => {
              const allTables = initialFloorPlans.flatMap(p => (p.restaurant_tables || []).map((t: Record<string, unknown>) => ({ ...t, _planName: p.name })));
              const selectedTables = allTables.filter(t => selectedLiveTableIds.includes(t.id));
              const tableNumbersString = selectedTables.map(t => t.table_number).join(', ');
              const compositeTableString = selectedTables.map(t => `${t._planName || "Main Floor"} - ${t.table_number}`).join(', ');
              const totalCapacity = selectedTables.reduce((sum, t) => sum + (t.capacity || 0), 0);
              
              // Extract unique plan names for display
              const planNames = Array.from(new Set(selectedTables.map(t => t._planName || "Main Floor"))).join(' & ');
              
              const activeOrder = activeOrders.find(o => 
                o.table_number && String(o.table_number) === compositeTableString
              );

              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-2xl text-slate-900 leading-tight">Table {tableNumbersString}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {totalCapacity} Seats • {planNames}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedLiveTableIds([])}
                      className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Close</span>
                    </button>
                  </div>

                  {activeOrder ? (
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col items-center justify-center py-6 mb-2">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                          <Coffee className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-red-900 text-lg">Occupied</span>
                        <span className="text-red-600 font-medium text-sm mt-1 text-center">{activeOrder.customer_name || 'Walk-in'}</span>
                        {activeOrder.total_amount > 0 && (
                          <span className="mt-3 font-black text-2xl text-red-950">${(activeOrder.total_amount / 100).toFixed(2)}</span>
                        )}
                      </div>
                      
                      <button 
                        disabled={isProcessingLiveAction}
                        onClick={async () => {
                          setIsProcessingLiveAction(true);
                          try {
                            await voidTableTab(restaurantId, compositeTableString, activeOrder.customer_name || 'Walk-in');
                            setSelectedLiveTableIds([]);
                            router.refresh();
                          } catch (error) {
                            showError("Failed to clear table.");
                          }
                          setIsProcessingLiveAction(false);
                        }}
                        className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors disabled:opacity-50"
                      >
                        <Ban className="w-5 h-5" />
                        Clear / Void Table
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center py-8 mb-2">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-emerald-900 text-lg">Available</span>
                      </div>
                      
                      <button 
                        disabled={isProcessingLiveAction}
                        onClick={async () => {
                          setIsProcessingLiveAction(true);
                          try {
                            await createWalkInTab(restaurantId, compositeTableString, "Walk-in");
                            setSelectedLiveTableIds([]);
                            router.refresh();
                          } catch (error) {
                            showError("Failed to start tab.");
                          }
                          setIsProcessingLiveAction(false);
                        }}
                        className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                        Start Walk-in Tab
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
