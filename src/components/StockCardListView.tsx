"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  AlertTriangle, 
  Share2, 
  ChevronRight,
  MapPin 
} from "lucide-react";
import { StockItem } from "@/types/stock";

interface StockCardListViewProps {
  items: StockItem[];
  onSelectItem: (item: StockItem) => void;
  onShareWhatsApp: (item: StockItem, e: React.MouseEvent) => void;
}

export function StockCardListView({
  items,
  onSelectItem,
  onShareWhatsApp
}: StockCardListViewProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Generous height to show full product names across 2-3 lines without truncating
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 142,
    overscan: 8
  });

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">
        <AlertTriangle className="w-8 h-8 text-slate-400 dark:text-zinc-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-300">No items match your filter</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Try resetting search or filters.</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{ 
        overscrollBehavior: "contain", 
        overscrollBehaviorY: "contain", 
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch"
      }}
      className="h-[calc(100dvh-270px)] min-h-[460px] overflow-y-auto overflow-x-hidden momentum-scroll scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 relative rounded-2xl pb-16 transition-colors"
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
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
              className="p-1.5"
            >
              <div
                onClick={() => onSelectItem(item)}
                className={`min-h-[132px] p-3.5 rounded-xl border transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between shadow-xs ${
                  item.quantity < 0
                    ? "bg-rose-50/90 dark:bg-rose-950/25 border-rose-300 dark:border-rose-900/50"
                    : isOut
                    ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                    : isLow
                    ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                    : "bg-white dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                {/* Header row: Code + Status Badge + WhatsApp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-950 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                      {item.itemCode}
                    </span>
                    {item.quantity < 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50">
                        NEG ({item.quantity})
                      </span>
                    ) : isOut ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 animate-pulse">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
                        IN STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => onShareWhatsApp(item, e)}
                      title="Share to WhatsApp"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 active:scale-90"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  </div>
                </div>

                {/* Middle: Full Item Name (NO TRUNCATION, shows full name completely!) */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 leading-snug break-words my-2">
                  {item.itemName}
                </h3>

                {/* Bottom Row: Category & Quantity */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-zinc-800/60 text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-[11px] truncate">
                    <span>{item.category}</span>
                    {item.location && (
                      <span className="font-mono bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded text-[10px] shrink-0">
                        {item.location}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-slate-400 dark:text-zinc-500 text-[10px]">Qty:</span>
                    <span
                      className={`text-base sm:text-lg font-black ${
                        isOut
                          ? "text-rose-600 dark:text-rose-400"
                          : isLow
                          ? "text-amber-600 dark:text-amber-400 font-black"
                          : "text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {item.quantity.toLocaleString()}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400 text-xs font-semibold">
                      {item.unit}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
