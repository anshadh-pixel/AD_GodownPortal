"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  AlertTriangle, 
  MapPin, 
  Share2, 
  ChevronRight
} from "lucide-react";
import { StockItem } from "@/types/stock";

interface StockTableViewProps {
  items: StockItem[];
  onSelectItem: (item: StockItem) => void;
  onShareWhatsApp: (item: StockItem, e: React.MouseEvent) => void;
}

export function StockTableView({
  items,
  onSelectItem,
  onShareWhatsApp
}: StockTableViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 15
  });

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200">No matching stock items found</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Try clearing your search query or changing category/status filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-md transition-colors">
      
      {/* Sticky Table Header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-slate-50/95 dark:bg-zinc-950/90 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 select-none">
        <div className="col-span-2">Code & Status</div>
        <div className="col-span-4">Item Name & Category</div>
        <div className="col-span-2 text-right">Stock Quantity</div>
        <div className="col-span-2 text-right">Reorder Level</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* Virtualized Rows Container */}
      <div
        ref={parentRef}
        className="h-[calc(100dvh-290px)] min-h-[500px] overflow-auto momentum-scroll scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 relative"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];
            if (!item) return null;

            const isLow = item.status === "low_stock";
            const isOut = item.status === "out_of_stock";

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
                className={`grid grid-cols-12 gap-3 px-5 py-2.5 items-center border-b border-slate-100 dark:border-zinc-850 hover:bg-slate-50/90 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors group select-none ${
                  item.quantity < 0
                    ? "bg-rose-50/70 dark:bg-rose-950/25"
                    : isOut 
                    ? "bg-rose-50/40 dark:bg-rose-950/10 hover:bg-rose-50/80 dark:hover:bg-rose-950/25" 
                    : isLow 
                    ? "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/80 dark:hover:bg-amber-950/25" 
                    : ""
                }`}
              >
                
                {/* Item Code & Status Pill */}
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.itemCode}
                  </span>
                  
                  {item.quantity < 0 ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600/15 dark:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50 shrink-0">
                      NEG ({item.quantity})
                    </span>
                  ) : isOut ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shrink-0">
                      OUT
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 shrink-0 animate-pulse">
                      LOW
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 shrink-0">
                      OK
                    </span>
                  )}
                </div>

                {/* Item Name & Category */}
                <div className="col-span-4 min-w-0 pr-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-slate-950 dark:group-hover:text-white leading-snug">
                    {item.itemName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                      {item.category}
                    </span>
                    {item.location && (
                      <span className="hidden xl:inline-flex items-center gap-0.5 text-[10px] text-slate-600 dark:text-zinc-400 font-mono bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded">
                        <MapPin className="w-2.5 h-2.5" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Quantity */}
                <div className="col-span-2 text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span
                      className={`text-base font-extrabold font-mono tracking-tight ${
                        isOut
                          ? "text-rose-600 dark:text-rose-400"
                          : isLow
                          ? "text-amber-600 dark:text-amber-400 font-black"
                          : "text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {item.quantity.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {item.unit}
                    </span>
                  </div>
                  {item.rate && item.rate > 0 && (
                    <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-mono">
                      ₹{item.rate.toLocaleString()} / {item.unit}
                    </span>
                  )}
                </div>

                {/* Reorder Level */}
                <div className="col-span-2 text-right font-mono text-xs text-slate-600 dark:text-zinc-400">
                  <span className="bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-750">
                    Min: {item.reorderLevel} {item.unit}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => onShareWhatsApp(item, e)}
                    title="Share Stock on WhatsApp"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-800/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    title="View details"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-all group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Footer bar with total items rendered */}
      <div className="px-5 py-2.5 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
        <span className="font-mono">
          Virtual Engine: rendering 60 FPS across {items.length.toLocaleString()} items
        </span>
        <span className="text-slate-500 dark:text-zinc-400">Click any row to open complete details</span>
      </div>

    </div>
  );
}
