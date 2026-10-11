"use client";

import React from "react";
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  TrendingDown, 
  Calendar,
  Sparkles
} from "lucide-react";
import { StockSummary, StockFilterStatus } from "@/types/stock";

interface DashboardStatsProps {
  summary: StockSummary;
  activeStatusFilter: StockFilterStatus;
  onSelectStatusFilter: (status: StockFilterStatus) => void;
}

export function DashboardStats({
  summary,
  activeStatusFilter,
  onSelectStatusFilter
}: DashboardStatsProps) {
  return (
    <div className="space-y-4">
      {/* Prominent Last Updated Alert Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-amber-950/30 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Official Godown Stock Status
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-100 mt-0.5">
              Last Updated: <span className="font-bold text-emerald-300 font-mono">{summary.lastSyncTime || "Checking..."}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-400 sm:text-right border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
          <span className="inline-block bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/60 font-mono">
            {summary.totalItems.toLocaleString()} items registered
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Items */}
        <button
          onClick={() => onSelectStatusFilter("all")}
          className={`text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            activeStatusFilter === "all"
              ? "bg-zinc-850 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30"
              : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Items</span>
            <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {summary.totalItems.toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 truncate">
              In {summary.categoriesCount} Categories
            </p>
          </div>
        </button>

        {/* Low Stock Items (Highlight in Orange) */}
        <button
          onClick={() => onSelectStatusFilter("low_stock")}
          className={`text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] relative overflow-hidden ${
            activeStatusFilter === "low_stock"
              ? "bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-950/30 ring-1 ring-amber-500/40"
              : "bg-zinc-900/60 border-amber-900/30 hover:border-amber-600/50 hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
              Low Stock
              {summary.lowStockCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-400 font-mono">
              {summary.lowStockCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Below reorder level
            </p>
          </div>
        </button>

        {/* Out of Stock (Red) */}
        <button
          onClick={() => onSelectStatusFilter("out_of_stock")}
          className={`text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            activeStatusFilter === "out_of_stock"
              ? "bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-950/30 ring-1 ring-rose-500/40"
              : "bg-zinc-900/60 border-rose-900/30 hover:border-rose-600/50 hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-300">Out of Stock</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-400 font-mono">
              {summary.outOfStockCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-rose-400/80 mt-1">
              Zero quantity available
            </p>
          </div>
        </button>

        {/* Categories / Healthy Stock */}
        <button
          onClick={() => onSelectStatusFilter("in_stock")}
          className={`text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            activeStatusFilter === "in_stock"
              ? "bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/40"
              : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">Normal Stock</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-300 font-mono">
              {(summary.totalItems - summary.lowStockCount - summary.outOfStockCount).toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Sufficient quantities
            </p>
          </div>
        </button>

      </div>
    </div>
  );
}
