"use client";

import React, { useState } from "react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Package, 
  AlertTriangle, 
  IndianRupee,
  Layers,
  ArrowRight
} from "lucide-react";
import { StockItem, AppConfig } from "@/types/stock";

interface ItemDetailModalProps {
  item: StockItem | null;
  config: AppConfig;
  onClose: () => void;
}

export function ItemDetailModal({ item, config, onClose }: ItemDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isLow = item.status === "low_stock";
  const isOut = item.status === "out_of_stock";

  // Calculate stock percentage against reorder level for the health bar
  const maxBar = Math.max(item.reorderLevel * 2.5, item.quantity, 50);
  const percent = Math.min(100, Math.round((item.quantity / maxBar) * 100));

  const totalValue = (item.rate || 0) * item.quantity;

  const handleCopy = () => {
    const text = `📦 ${item.itemName} (${item.itemCode})\n` +
      `Category: ${item.category}\n` +
      `Current Stock: ${item.quantity} ${item.unit}\n` +
      `Reorder Level: ${item.reorderLevel} ${item.unit}\n` +
      `Status: ${isOut ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "IN STOCK"}\n` +
      (item.location ? `Location: ${item.location}\n` : "") +
      `Last Sync: ${item.lastUpdated}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const msg = `📦 *STOCK STATUS UPDATE - ${config.godownName}*\n\n` +
      `*Item:* ${item.itemName}\n` +
      `*Code:* ${item.itemCode}\n` +
      `*Category:* ${item.category}\n` +
      `*Available Qty:* ${item.quantity} ${item.unit}\n` +
      `*Status:* ${isOut ? "❌ OUT OF STOCK" : isLow ? "⚠️ LOW STOCK (Reorder: " + item.reorderLevel + ")" : "✅ AVAILABLE"}\n` +
      (item.location ? `*Godown Rack:* ${item.location}\n` : "") +
      `*As on:* ${item.lastUpdated}\n\n` +
      `_Sent via Godown Stock Web App_`;

    const encoded = encodeURIComponent(msg);
    const targetUrl = config.whatsappNumber 
      ? `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(targetUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      
      {/* Modal / Bottom Drawer Container */}
      <div 
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
              {item.itemCode}
            </span>
            <span className="text-xs text-zinc-400">{item.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Item Name */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {item.itemName}
            </h2>
          </div>

          {/* Quantity & Status Hero Box */}
          <div className={`p-4 rounded-2xl border ${
            isOut 
              ? "bg-rose-950/20 border-rose-900/60" 
              : isLow 
              ? "bg-amber-950/20 border-amber-900/60" 
              : "bg-emerald-950/20 border-emerald-900/60"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Current Stock on Hand
              </span>
              {isOut ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  OUT OF STOCK
                </span>
              ) : isLow ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  LOW STOCK ALERT
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HEALTHY STOCK
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                isOut ? "text-rose-400" : isLow ? "text-amber-400" : "text-emerald-300"
              }`}>
                {item.quantity.toLocaleString()}
              </span>
              <span className="text-lg text-zinc-300 font-semibold">{item.unit}</span>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Stock Level</span>
                <span>Reorder Point: {item.reorderLevel} {item.unit}</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOut ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                Godown Location
              </span>
              <span className="text-sm font-semibold text-zinc-200 font-mono">
                {item.location || "Central Bay"}
              </span>
            </div>

            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Last Sheet Update
              </span>
              <span className="text-sm font-semibold text-zinc-200 font-mono">
                {item.lastUpdated}
              </span>
            </div>

            {item.rate && item.rate > 0 && (
              <>
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-zinc-400" />
                    Unit Rate (Est.)
                  </span>
                  <span className="text-sm font-semibold text-zinc-200 font-mono">
                    ₹{item.rate.toLocaleString()} / {item.unit}
                  </span>
                </div>

                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    Total Stock Value
                  </span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    ₹{totalValue.toLocaleString()}
                  </span>
                </div>
              </>
            )}

          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center gap-3">
          
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Details</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

        </div>

      </div>

    </div>
  );
}
