"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Save, Trash2, Edit2, CheckCircle2, User, Users } from "lucide-react";
import { saveTableLayout } from "./floor-plan-actions";

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
  initialFloorPlan: any;
  activeOrders: any[];
}

export function FloorPlanBoard({ restaurantId, initialFloorPlan, activeOrders }: FloorPlanBoardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tables, setTables] = useState<RestaurantTable[]>(initialFloorPlan.restaurant_tables || []);
  const [deletedTableIds, setDeletedTableIds] = useState<string[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleAddTable = () => {
    const newTable: RestaurantTable = {
      id: `temp-${Date.now()}`,
      floor_plan_id: initialFloorPlan.id,
      table_number: `${tables.length + 1}`,
      capacity: 4,
      shape: "rectangle",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      isNew: true
    };
    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Filter out 'isNew' flag for the backend, but we handle that in the action or we can map it here
    const tablesToUpsert = tables.map(t => {
      const { isNew, ...rest } = t;
      return rest;
    });

    const res = await saveTableLayout(initialFloorPlan.id, tablesToUpsert, deletedTableIds);
    if (res.success) {
      setIsEditMode(false);
      setDeletedTableIds([]);
      // Remove temp IDs by re-fetching or assuming they'll be re-fetched by Next.js revalidatePath
      // But we will let the parent's server component refresh via revalidatePath
    } else {
      alert("Failed to save layout.");
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

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (!isEditMode) return;
    
    setSelectedTableId(id);
    const table = tables.find(t => t.id === id);
    if (!table) return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate offset of mouse click from the table's top-left corner
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

      // Snap to grid (optional, 10px grid)
      newX = Math.round(newX / 10) * 10;
      newY = Math.round(newY / 10) * 10;

      // Basic bounds checking (prevent dragging completely out of view)
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
      {/* Controls Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{initialFloorPlan.name}</h2>
          <p className="text-sm text-slate-500">
            {isEditMode ? "Drag tables to reposition them." : "Live view of occupied tables."}
          </p>
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
            // Check if occupied in live mode
            const activeOrder = !isEditMode ? activeOrders.find(o => String(o.table_number) === String(table.table_number)) : null;
            const isOccupied = !!activeOrder;

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
                  flex flex-col items-center justify-center border-2 shadow-sm transition-colors select-none
                  ${table.shape === 'circle' ? 'rounded-full' : 'rounded-xl'}
                  ${isEditMode && selectedTableId === table.id ? 'border-indigo-500 shadow-indigo-200/50 shadow-lg ring-4 ring-indigo-50' : ''}
                  ${!isEditMode && isOccupied ? 'bg-red-50 border-red-500 text-red-700' : ''}
                  ${!isEditMode && !isOccupied ? 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100' : ''}
                  ${isEditMode && selectedTableId !== table.id ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-400' : ''}
                  ${isEditMode && selectedTableId === table.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : ''}
                `}
              >
                <span className="font-bold text-lg">{table.table_number}</span>
                {table.capacity > 0 && (
                  <div className="flex items-center gap-1 text-[10px] opacity-70 mt-1">
                    <Users className="w-3 h-3" /> {table.capacity}
                  </div>
                )}
                {!isEditMode && isOccupied && activeOrder?.total_amount && (
                  <span className="text-xs font-medium mt-1 bg-white/80 px-2 py-0.5 rounded-full">
                    ${(activeOrder.total_amount / 100).toFixed(2)}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Edit Properties Sidebar */}
        {isEditMode && selectedTableData && (
          <div className="w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6 animate-in slide-in-from-right-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Edit Table</h3>
              <p className="text-xs text-slate-500">Update table properties</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Table Label / Number</label>
                <input 
                  type="text" 
                  value={selectedTableData.table_number}
                  onChange={(e) => updateSelectedTable({ table_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  value={selectedTableData.capacity}
                  onChange={(e) => updateSelectedTable({ capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shape</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateSelectedTable({ shape: 'rectangle', width: 100, height: 100 })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border ${selectedTableData.shape === 'rectangle' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Rectangle
                  </button>
                  <button 
                    onClick={() => updateSelectedTable({ shape: 'circle', width: 100, height: 100 })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border ${selectedTableData.shape === 'circle' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dimensions</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={selectedTableData.width}
                    onChange={(e) => updateSelectedTable({ width: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Width"
                  />
                  <input 
                    type="number" 
                    value={selectedTableData.height}
                    onChange={(e) => updateSelectedTable({ height: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleDeleteTable(selectedTableData.id)}
                className="w-full flex items-center justify-center gap-2 py-2 text-red-600 bg-red-50 font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Table
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
