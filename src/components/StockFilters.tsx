"use client";

import React from "react";
import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Sparkles,
  SlidersHorizontal
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
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-sm">
      
      {/* Top Search & View Switcher Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Item Code (e.g. HW-1001) or Item Name..."
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher (Desktop / Mobile friendly) */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              onClick={() => onViewModeChange("table")}
              title="Table View (Ideal for Desktop)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "table"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange("cards")}
              title="Card View (Ideal for Mobile)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "cards"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

      </div>

      {/* Filter Badges & Dropdowns Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/60">
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 border border-zinc-700/60"
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => onStatusFilterChange("low_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === "low_stock"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold"
                : "bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 border border-amber-800/50"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Low Stock Only
          </button>
          <button
            onClick={() => onStatusFilterChange("out_of_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "out_of_stock"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 font-bold"
                : "bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 border border-rose-800/50"
            }`}
          >
            Out of Stock
          </button>
          <button
            onClick={() => onStatusFilterChange("in_stock")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "in_stock"
                ? "bg-zinc-200 text-zinc-900 shadow-md font-bold"
                : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 border border-zinc-800"
            }`}
          >
            Normal Stock
          </button>
        </div>

        {/* Category & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories ({totalCount})</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <Filter className="w-3 h-3" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="code_asc">Code (A - Z)</option>
              <option value="name_asc">Name (A - Z)</option>
              <option value="qty_asc">Qty (Lowest first)</option>
              <option value="qty_desc">Qty (Highest first)</option>
              <option value="status_priority">Status (Low/Out first)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <ArrowUpDown className="w-3 h-3" />
            </div>
          </div>

          {/* Result Count Indicator */}
          <span className="text-[11px] font-mono text-zinc-400 shrink-0 ml-auto sm:ml-2">
            Showing <strong className="text-zinc-200">{totalFilteredCount.toLocaleString()}</strong> of {totalCount.toLocaleString()}
          </span>

        </div>

      </div>

    </div>
  );
}
