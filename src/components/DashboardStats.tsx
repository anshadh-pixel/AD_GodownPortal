"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  TrendingDown, 
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
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
  const normalStockCount = Math.max(0, summary.totalItems - summary.lowStockCount - summary.outOfStockCount);

  return (
    <div className="space-y-4">
      {/* Prominent Official Status Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-slate-100/80 to-amber-500/10 dark:from-emerald-950/40 dark:via-zinc-900/90 dark:to-amber-950/30 border border-slate-200 dark:border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs dark:shadow-lg transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                AD Godown Stock Overview
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
              Last Updated: <span className="font-extrabold text-emerald-600 dark:text-emerald-300 font-mono">{summary.lastSyncTime || "Checking..."}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 sm:text-right border-t sm:border-t-0 border-slate-200 dark:border-zinc-800 pt-2 sm:pt-0">
          <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 font-mono text-xs font-semibold shadow-xs">
            <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {summary.totalItems.toLocaleString()} items registered
          </span>
        </div>
      </div>

      {/* Professional Interactive KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Items */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("all")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "all"
              ? "bg-white dark:bg-zinc-850 border-emerald-500 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/10"
              : "bg-white/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm"
          }`}
        >
          {/* Top glowing accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "all"
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-transparent group-hover:bg-slate-200 dark:group-hover:bg-zinc-700"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Total Items
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "all"
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 group-hover:scale-110"
            }`}>
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
              {summary.totalItems.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">
                In {summary.categoriesCount} Categories
              </span>
              {activeStatusFilter === "all" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 2. Low Stock (Highlight in Amber/Orange) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("low_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "low_stock"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/60 shadow-md shadow-amber-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-amber-200/80 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-sm"
          }`}
        >
          {/* Top glowing accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "low_stock"
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-amber-400/30 group-hover:bg-amber-400"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              Low Stock
              {summary.lowStockCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "low_stock"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 group-hover:scale-110"
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-mono">
              {summary.lowStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-amber-700 dark:text-amber-400/90 font-medium flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Below reorder level
              </span>
              {activeStatusFilter === "low_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 3. Out of Stock (Red Alert) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("out_of_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "out_of_stock"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/60 shadow-md shadow-rose-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-rose-200/80 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700/60 hover:shadow-sm"
          }`}
        >
          {/* Top glowing accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "out_of_stock"
              ? "bg-gradient-to-r from-rose-500 to-red-600"
              : "bg-rose-400/30 group-hover:bg-rose-500"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Out of Stock
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "out_of_stock"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 group-hover:scale-110"
            }`}>
              <XCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              {summary.outOfStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-rose-700 dark:text-rose-400/90 font-medium">
                Zero quantity available
              </span>
              {activeStatusFilter === "out_of_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 4. Normal Stock (Healthy Green) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("in_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "in_stock"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/60 shadow-md shadow-emerald-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-zinc-700 hover:shadow-sm"
          }`}
        >
          {/* Top glowing accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "in_stock"
              ? "bg-gradient-to-r from-emerald-500 to-green-500"
              : "bg-emerald-400/30 group-hover:bg-emerald-500"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Normal Stock
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "in_stock"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 group-hover:scale-110"
            }`}>
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-300 font-mono">
              {normalStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">
                Sufficient quantities
              </span>
              {activeStatusFilter === "in_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

      </div>
    </div>
  );
}
