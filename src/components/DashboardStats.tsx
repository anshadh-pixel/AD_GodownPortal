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
  CheckCircle2
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
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-slate-100/80 to-blue-500/10 dark:from-emerald-950/40 dark:via-zinc-900/90 dark:to-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs dark:shadow-lg transition-colors">
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
          <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 font-mono text-xs font-semibold shadow-xs">
            <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {summary.totalItems.toLocaleString()} items registered
          </span>
        </div>
      </div>

      {/* Upgraded 4 Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Items (Tech Blue / Electric Cyan Theme) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("all")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "all"
              ? "bg-blue-50/90 dark:bg-blue-950/35 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10"
              : "bg-white/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-blue-400/60 dark:hover:border-blue-500/40 hover:shadow-sm"
          }`}
        >
          {/* Top glowing neon accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "all"
              ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"
              : "bg-blue-500/20 group-hover:bg-blue-500/60"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Total Items
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-100/70 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 group-hover:scale-110"
            }`}>
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-blue-100 font-mono">
              {summary.totalItems.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium truncate">
                In {summary.categoriesCount} Categories
              </span>
              {activeStatusFilter === "all" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 2. Low Stock (Golden Amber / Warm Orange Theme) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("low_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "low_stock"
              ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-amber-200/80 dark:border-amber-900/30 hover:border-amber-400 dark:hover:border-amber-700/60 hover:shadow-sm"
          }`}
        >
          {/* Top glowing neon accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "low_stock"
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400"
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
                : "bg-amber-100/70 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 group-hover:scale-110"
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-mono">
              {summary.lowStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-amber-700 dark:text-amber-400/90 font-medium flex items-center gap-1 truncate">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                Below reorder
              </span>
              {activeStatusFilter === "low_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 3. Out of Stock (Crimson / Coral Red Theme) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("out_of_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "out_of_stock"
              ? "bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-rose-200/80 dark:border-rose-900/30 hover:border-rose-400 dark:hover:border-rose-700/60 hover:shadow-sm"
          }`}
        >
          {/* Top glowing neon accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "out_of_stock"
              ? "bg-gradient-to-r from-rose-500 via-red-600 to-rose-400"
              : "bg-rose-400/30 group-hover:bg-rose-500"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Out of Stock
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "out_of_stock"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-100/70 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 group-hover:scale-110"
            }`}>
              <XCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              {summary.outOfStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-rose-700 dark:text-rose-400/90 font-medium truncate">
                Zero available
              </span>
              {activeStatusFilter === "out_of_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-700 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* 4. Normal Stock (Mint Emerald / Forest Green Theme) */}
        <motion.button
          type="button"
          layout
          whileHover={{ y: -3, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={() => onSelectStatusFilter("in_stock")}
          className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            activeStatusFilter === "in_stock"
              ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/15"
              : "bg-white/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-700/60 hover:shadow-sm"
          }`}
        >
          {/* Top glowing neon accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
            activeStatusFilter === "in_stock"
              ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-green-400"
              : "bg-emerald-400/30 group-hover:bg-emerald-500"
          }`} />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Normal Stock
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              activeStatusFilter === "in_stock"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-100/70 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 group-hover:scale-110"
            }`}>
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-300 font-mono">
              {normalStockCount.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium truncate">
                Sufficient stock
              </span>
              {activeStatusFilter === "in_stock" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 shrink-0">
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
