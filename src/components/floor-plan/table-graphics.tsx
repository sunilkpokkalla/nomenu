"use client";

import React from "react";
import { Users } from "lucide-react";

export type TableShapeType = 
  | "square-2"
  | "square-4"
  | "round-2"
  | "round-4"
  | "round-6"
  | "rectangle-4"
  | "rectangle-6"
  | "rectangle-8"
  | "booth-4"
  | "cabana";

export const TABLE_SHAPES = [
  { id: "square-2", label: "Square (2)", capacity: 2, defaultWidth: 80, defaultHeight: 80 },
  { id: "square-4", label: "Square (4)", capacity: 4, defaultWidth: 100, defaultHeight: 100 },
  { id: "round-2", label: "Round (2)", capacity: 2, defaultWidth: 80, defaultHeight: 80 },
  { id: "round-4", label: "Round (4)", capacity: 4, defaultWidth: 100, defaultHeight: 100 },
  { id: "round-6", label: "Round (6)", capacity: 6, defaultWidth: 120, defaultHeight: 120 },
  { id: "rectangle-4", label: "Rectangle (4)", capacity: 4, defaultWidth: 120, defaultHeight: 80 },
  { id: "rectangle-6", label: "Rectangle (6)", capacity: 6, defaultWidth: 160, defaultHeight: 90 },
  { id: "rectangle-8", label: "Rectangle (8)", capacity: 8, defaultWidth: 200, defaultHeight: 100 },
  { id: "booth-4", label: "Booth (4)", capacity: 4, defaultWidth: 140, defaultHeight: 100 },
  { id: "cabana", label: "Cabana", capacity: 6, defaultWidth: 180, defaultHeight: 140 },
] as const;

interface TableGraphicProps {
  shape: TableShapeType;
  tableNumber: string;
  isOccupied: boolean;
  isSelected?: boolean;
  amount?: number | null;
  capacity: number;
}

// Helper to determine colors based on state
const getColors = (isOccupied: boolean, isSelected?: boolean) => {
  if (isSelected) {
    return {
      bg: "#EEF2FF", // indigo-50
      border: "#6366F1", // indigo-500
      text: "#4338CA", // indigo-700
      chair: "#C7D2FE", // indigo-200
    };
  }
  if (isOccupied) {
    return {
      bg: "#FEF2F2", // red-50
      border: "#EF4444", // red-500
      text: "#B91C1C", // red-700
      chair: "#FECACA", // red-200
    };
  }
  return {
    bg: "#ECFDF5", // emerald-50
    border: "#34D399", // emerald-400
    text: "#047857", // emerald-700
    chair: "#A7F3D0", // emerald-200
  };
};

export const TableGraphic = ({ shape, tableNumber, isOccupied, isSelected, amount, capacity }: TableGraphicProps) => {
  const colors = getColors(isOccupied, isSelected);

  // Reusable core component for the table label and details
  const TableContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="font-bold text-lg" style={{ color: colors.text }}>{tableNumber}</span>
      {capacity > 0 && (
        <div className="flex items-center gap-1 text-[10px] mt-0.5 opacity-80" style={{ color: colors.text }}>
          <Users className="w-3 h-3" /> {capacity}
        </div>
      )}
      {isOccupied && amount !== undefined && amount !== null && (
        <span className="text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-sm bg-white/90 shadow-sm" style={{ color: colors.text }}>
          ${(amount / 100).toFixed(2)}
        </span>
      )}
    </div>
  );

  // SVG Renderers for different shapes
  // Chairs are rendered as SVG rects/circles outside the main table path
  
  if (shape.startsWith("square")) {
    const s = shape === "square-2" ? 80 : 100;
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${s} ${s}`} className="overflow-visible transition-all">
          {/* Chairs */}
          {shape === "square-2" ? (
            <>
              <rect x={s/2 - 15} y={-10} width={30} height={10} rx={4} fill={colors.chair} />
              <rect x={s/2 - 15} y={s} width={30} height={10} rx={4} fill={colors.chair} />
            </>
          ) : (
            <>
              <rect x={s/2 - 15} y={-10} width={30} height={10} rx={4} fill={colors.chair} />
              <rect x={s/2 - 15} y={s} width={30} height={10} rx={4} fill={colors.chair} />
              <rect y={s/2 - 15} x={-10} height={30} width={10} rx={4} fill={colors.chair} />
              <rect y={s/2 - 15} x={s} height={30} width={10} rx={4} fill={colors.chair} />
            </>
          )}
          {/* Table */}
          <rect x={0} y={0} width={s} height={s} rx={12} fill={colors.bg} stroke={colors.border} strokeWidth={3} />
        </svg>
        <TableContent />
      </div>
    );
  }

  if (shape.startsWith("round")) {
    const s = shape === "round-6" ? 120 : (shape === "round-4" ? 100 : 80);
    const r = s / 2;
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${s} ${s}`} className="overflow-visible transition-all">
          {/* Chairs based on capacity */}
          {shape === "round-2" && (
            <>
              <rect x={r - 15} y={-12} width={30} height={12} rx={6} fill={colors.chair} />
              <rect x={r - 15} y={s} width={30} height={12} rx={6} fill={colors.chair} />
            </>
          )}
          {shape === "round-4" && (
            <>
              <rect x={r - 15} y={-12} width={30} height={12} rx={6} fill={colors.chair} />
              <rect x={r - 15} y={s} width={30} height={12} rx={6} fill={colors.chair} />
              <rect y={r - 15} x={-12} height={30} width={12} rx={6} fill={colors.chair} />
              <rect y={r - 15} x={s} height={30} width={12} rx={6} fill={colors.chair} />
            </>
          )}
          {shape === "round-6" && (
            <g>
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <rect 
                  key={i} 
                  x={r - 15} y={-12} width={30} height={12} rx={6} 
                  fill={colors.chair} 
                  transform={`rotate(${angle} ${r} ${r})`} 
                />
              ))}
            </g>
          )}
          {/* Table */}
          <circle cx={r} cy={r} r={r} fill={colors.bg} stroke={colors.border} strokeWidth={3} />
        </svg>
        <TableContent />
      </div>
    );
  }

  if (shape.startsWith("rectangle")) {
    const w = shape === "rectangle-8" ? 200 : (shape === "rectangle-6" ? 160 : 120);
    const h = shape === "rectangle-6" ? 90 : (shape === "rectangle-8" ? 100 : 80);
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible transition-all">
          {/* Chairs */}
          {/* Top/Bottom chairs */}
          {Array.from({ length: shape === "rectangle-8" ? 3 : (shape === "rectangle-6" ? 2 : 2) }).map((_, i, arr) => {
            const spacing = w / (arr.length + 1);
            const x = spacing * (i + 1) - 15;
            return (
              <g key={i}>
                <rect x={x} y={-10} width={30} height={10} rx={4} fill={colors.chair} />
                <rect x={x} y={h} width={30} height={10} rx={4} fill={colors.chair} />
              </g>
            );
          })}
          {/* Side chairs for rect-6 and rect-8 */}
          {(shape === "rectangle-6" || shape === "rectangle-8") && (
            <>
              <rect y={h/2 - 15} x={-10} height={30} width={10} rx={4} fill={colors.chair} />
              <rect y={h/2 - 15} x={w} height={30} width={10} rx={4} fill={colors.chair} />
            </>
          )}
          {/* Table */}
          <rect x={0} y={0} width={w} height={h} rx={12} fill={colors.bg} stroke={colors.border} strokeWidth={3} />
        </svg>
        <TableContent />
      </div>
    );
  }

  if (shape === "booth-4") {
    const w = 140;
    const h = 100;
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible transition-all">
          {/* Bench Tops */}
          <rect x={-10} y={10} width={20} height={h-20} rx={10} fill={colors.chair} />
          <rect x={w-10} y={10} width={20} height={h-20} rx={10} fill={colors.chair} />
          {/* Table */}
          <rect x={15} y={0} width={w-30} height={h} rx={8} fill={colors.bg} stroke={colors.border} strokeWidth={3} />
        </svg>
        <TableContent />
      </div>
    );
  }

  if (shape === "cabana") {
    const w = 180;
    const h = 140;
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible transition-all">
          {/* Cabana frame (Outer box) */}
          <rect x={-5} y={-5} width={w+10} height={h+10} rx={16} fill="transparent" stroke={colors.chair} strokeWidth={4} strokeDasharray="10 5" />
          
          {/* Lounge Seats */}
          <rect x={10} y={10} width={w-20} height={30} rx={8} fill={colors.chair} />
          <rect x={10} y={h-40} width={w-20} height={30} rx={8} fill={colors.chair} />
          
          {/* Central Table */}
          <rect x={40} y={50} width={w-80} height={40} rx={8} fill={colors.bg} stroke={colors.border} strokeWidth={3} />
        </svg>
        <TableContent />
      </div>
    );
  }

  // Fallback
  return (
    <div className="relative w-full h-full rounded-xl flex items-center justify-center border-[3px]" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
      <TableContent />
    </div>
  );
};
