"use client";

import React from "react";
import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List
} from "lucide-react";
import { StockFilterStatus } from "@/types/stock";

interface StockFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: { name: string; count: number }[];
  statusFilter: StockFilterStatus;
  onStatusFilterChange: (status: StockFilterStatus) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  totalFilteredCount: number;
  totalCount: number;
}

export function StockFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalCount
}: StockFiltersProps) {
  return (
    <div className="bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3.5 backdrop-blur-sm shadow-xs dark:shadow-none transition-colors">
      
      {/* Row 1: Status Filter Pills & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Status Filter Pills (Horizontal swipeable on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusFilter === "all"
                ? "bg-blue-600 dark:bg-blue-500 text-white shadow-xs"
                : "bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/60"
            }`}
          >
            All Stock
          </button>
          
          <button
            onClick={() => onStatusFilterChange("low_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              statusFilter === "low_stock"
                ? "bg-amber-500 text-black shadow-xs font-black"
                : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Low Stock Only
          </button>

          <button
            onClick={() => onStatusFilterChange("out_of_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusFilter === "out_of_stock"
                ? "bg-rose-600 dark:bg-rose-500 text-white shadow-xs font-black"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/50"
            }`}
          >
            Out of Stock
          </button>

          <button
            onClick={() => onStatusFilterChange("in_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              statusFilter === "in_stock"
                ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black shadow-xs font-black"
                : "bg-slate-100 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700/60 border border-slate-200 dark:border-zinc-800"
            }`}
          >
            Normal Stock
          </button>
        </div>

        {/* Category & Sort & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Categories ({totalCount})</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 dark:text-zinc-400">
              <Filter className="w-3 h-3" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="name_asc">Name (A - Z)</option>
              <option value="code_asc">Code (A - Z)</option>
              <option value="qty_asc">Qty (Lowest)</option>
              <option value="qty_desc">Qty (Highest)</option>
              <option value="status_priority">Status (Low first)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 dark:text-zinc-400">
              <ArrowUpDown className="w-3 h-3" />
            </div>
          </div>

          {/* View Switcher (Table vs Cards) */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => onViewModeChange("table")}
              title="Table View (Desktop)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange("cards")}
              title="Card View (Mobile)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>

        </div>

      </div>

      {/* Row 2: SEARCH BAR — PLACED DIRECTLY ABOVE PRODUCTS LIST! */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          
          {/* Prominent Instant Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-400">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products directly (e.g. COOKER, TAWA, BIRIYANI POT)..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Showing Count Badge */}
          <span className="hidden sm:inline-flex items-center px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-500 dark:text-zinc-400 shrink-0">
            <span><strong className="text-slate-900 dark:text-zinc-100">{totalFilteredCount.toLocaleString()}</strong> / {totalCount.toLocaleString()}</span>
          </span>

        </div>
      </div>

    </div>
  );
}
