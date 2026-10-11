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

  // Each card is roughly 110px in height
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 114,
    overscan: 10
  });

  if (items.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 text-center">
        <AlertTriangle className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-zinc-300">No items match your filter</h3>
        <p className="text-xs text-zinc-500 mt-1">Try resetting search or filters.</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[620px] overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 relative rounded-2xl"
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
              className="p-1"
            >
              <div
                onClick={() => onSelectItem(item)}
                className={`h-[106px] p-3 rounded-xl border transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                  isOut
                    ? "bg-rose-950/20 border-rose-900/50 hover:bg-rose-950/30"
                    : isLow
                    ? "bg-amber-950/20 border-amber-900/50 hover:bg-amber-950/30"
                    : "bg-zinc-900/90 border-zinc-800/80 hover:bg-zinc-850 hover:border-zinc-700"
                }`}
              >
                {/* Header row: Code + Status Badge + WhatsApp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {item.itemCode}
                    </span>
                    {item.quantity < 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/50">
                        NEG ({item.quantity})
                      </span>
                    ) : isOut ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        IN STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => onShareWhatsApp(item, e)}
                      title="Share to WhatsApp"
                      className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 active:scale-90"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>

                {/* Middle: Item Name */}
                <p className="text-sm font-semibold text-zinc-100 truncate mt-1">
                  {item.itemName}
                </p>

                {/* Bottom Row: Category & Quantity */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50 text-xs">
                  <span className="text-zinc-400 truncate max-w-[170px] text-[11px]">
                    {item.category}
                  </span>
                  
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-zinc-500 text-[10px]">Qty:</span>
                    <span
                      className={`text-base font-extrabold ${
                        isOut
                          ? "text-rose-400"
                          : isLow
                          ? "text-amber-400 font-black"
                          : "text-emerald-300"
                      }`}
                    >
                      {item.quantity.toLocaleString()}
                    </span>
                    <span className="text-zinc-400 text-xs font-normal">
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
