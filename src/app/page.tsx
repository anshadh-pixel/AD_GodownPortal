"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  StockItem, 
  StockFilterStatus, 
  AppConfig 
} from "@/types/stock";
import { 
  DEFAULT_CONFIG, 
  loadStoredConfig, 
  saveStoredConfig, 
  fetchStockData, 
  calculateSummary 
} from "@/lib/stock-service";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { StockFilters } from "@/components/StockFilters";
import { StockTableView } from "@/components/StockTableView";
import { StockCardListView } from "@/components/StockCardListView";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { GoogleSheetSettingsModal } from "@/components/GoogleSheetSettingsModal";
import { PinLockModal } from "@/components/PinLockModal";
import { Loader2, Warehouse, AlertCircle } from "lucide-react";

export default function StockViewerPage() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [items, setItems] = useState<StockItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [source, setSource] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Day / Night Theme State (defaults to "dark")
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StockFilterStatus>("all");
  const [sortBy, setSortBy] = useState("name_asc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Modals & Locks
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const applyTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    try {
      localStorage.setItem("godown_stock_theme", newTheme);
    } catch {}

    const isDark = newTheme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    try {
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute("content", isDark ? "#090d16" : "#ffffff");
      }
    } catch {}
  };

  // Load initial settings, theme, and auto-detect screen width
  useEffect(() => {
    // 1. Theme initialization
    let initialTheme: "dark" | "light" = "dark";
    try {
      const saved = localStorage.getItem("godown_stock_theme") as "dark" | "light" | null;
      if (saved === "light" || saved === "dark") {
        initialTheme = saved;
      }
    } catch {}
    applyTheme(initialTheme);

    // 2. Config & Lock
    const storedConfig = loadStoredConfig();
    setConfig(storedConfig);
    if (storedConfig.pinLockEnabled) {
      setIsLocked(true);
    }

    // 3. Auto-detect screen width: default to card view on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setViewMode("cards");
    }

    loadData(storedConfig);
  }, []);

  const loadData = async (cfg: AppConfig) => {
    setIsLoading(true);
    setSyncError(null);
    try {
      const data = await fetchStockData(cfg);
      setItems(data.items);
      setLastUpdated(data.lastUpdated);
      setSource(data.source);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncError(`Sync Error: ${msg}. Showing fallback data.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData(config);
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    saveStoredConfig(newConfig);
    loadData(newConfig);
  };

  const handleImportCsv = (importedItems: StockItem[], filename: string) => {
    setItems(importedItems);
    const now = new Date();
    const timeStr = `${now.toLocaleDateString("en-IN")} at ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    setLastUpdated(timeStr);
    setSource(`Imported CSV: ${filename}`);
  };

  // Categories with count
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      map.set(it.category, (map.get(it.category) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  // Overall summary stats
  const summary = useMemo(() => {
    return calculateSummary(items, lastUpdated);
  }, [items, lastUpdated]);

  // Filtered & Sorted items with high efficiency
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items
      .filter((it) => {
        // Status filter
        if (statusFilter === "low_stock" && it.status !== "low_stock") return false;
        if (statusFilter === "out_of_stock" && it.status !== "out_of_stock") return false;
        if (statusFilter === "in_stock" && it.status !== "in_stock") return false;

        // Category filter
        if (selectedCategory !== "all" && it.category !== selectedCategory) return false;

        // Search Query (matches Code or Name or Location)
        if (q) {
          const matchCode = it.itemCode.toLowerCase().includes(q);
          const matchName = it.itemName.toLowerCase().includes(q);
          const matchLoc = it.location ? it.location.toLowerCase().includes(q) : false;
          return matchCode || matchName || matchLoc;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.itemName.localeCompare(b.itemName);
          case "code_asc":
            return a.itemCode.localeCompare(b.itemCode, undefined, { numeric: true });
          case "qty_asc":
            return a.quantity - b.quantity;
          case "qty_desc":
            return b.quantity - a.quantity;
          case "status_priority": {
            const priority: Record<string, number> = { out_of_stock: 0, low_stock: 1, in_stock: 2 };
            return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
          }
          default:
            return 0;
        }
      });
  }, [items, searchQuery, selectedCategory, statusFilter, sortBy]);

  // WhatsApp quick share
  const handleQuickWhatsAppShare = (item: StockItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLow = item.status === "low_stock";
    const isOut = item.status === "out_of_stock";

    const msg = `📦 *STOCK CHECK - ${config.godownName || "AD GODOWN PORTAL"}*\n\n` +
      `*Item:* ${item.itemName}\n` +
      `*Code:* ${item.itemCode}\n` +
      `*Qty Available:* ${item.quantity} ${item.unit}\n` +
      `*Status:* ${item.quantity < 0 ? "⚠️ NEGATIVE (" + item.quantity + ")" : isOut ? "❌ OUT OF STOCK" : isLow ? "⚠️ LOW STOCK (Min: " + item.reorderLevel + ")" : "✅ IN STOCK"}\n` +
      (item.location ? `*Location:* ${item.location}\n` : "") +
      `*Updated:* ${item.lastUpdated}`;

    const encoded = encodeURIComponent(msg);
    const url = config.whatsappNumber
      ? `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      
      {/* PIN Lock Screen if locked */}
      {isLocked && (
        <PinLockModal
          correctPin={config.pinCode || "1234"}
          godownName={config.godownName || "AD GODOWN PORTAL"}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Main Header with Day/Night Switcher */}
      <Header
        config={config}
        lastUpdated={lastUpdated}
        source={source}
        isLoading={isLoading}
        theme={theme}
        onSelectTheme={applyTheme}
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLockApp={() => setIsLocked(true)}
      />

      {/* Error banner if any */}
      {syncError && (
        <div className="bg-rose-50 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-800 px-4 py-2 text-center text-xs text-rose-700 dark:text-rose-200 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* KPI Dashboard */}
        <DashboardStats
          summary={summary}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Search, Category, Status & View Filters */}
        <StockFilters
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
          categories={categoryCounts}
          statusFilter={statusFilter}
          onStatusFilterChange={(st) => setStatusFilter(st)}
          sortBy={sortBy}
          onSortByChange={(s) => setSortBy(s)}
          viewMode={viewMode}
          onViewModeChange={(m) => setViewMode(m)}
          totalFilteredCount={filteredItems.length}
          totalCount={items.length}
        />

        {/* Loading Skeleton or Virtualized Data List */}
        {isLoading && items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Syncing Godown Inventory...</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Preparing 2,000+ items with instant 60 FPS virtualization</p>
            </div>
          </div>
        ) : (
          <div>
            {viewMode === "table" ? (
              <StockTableView
                items={filteredItems}
                onSelectItem={(item) => setSelectedItem(item)}
                onShareWhatsApp={handleQuickWhatsAppShare}
              />
            ) : (
              <StockCardListView
                items={filteredItems}
                onSelectItem={(item) => setSelectedItem(item)}
                onShareWhatsApp={handleQuickWhatsAppShare}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/80 py-6 text-center text-xs text-slate-500 dark:text-zinc-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-700 dark:text-zinc-400">{config.godownName || "AD GODOWN PORTAL"}</span>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <span>Weekly Google Sheet Sync System</span>
          </div>

          <div className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
            ⚡ Virtual Engine: Powered by TanStack Virtual & Next.js 15
          </div>
        </div>
      </footer>

      {/* Item Detail Modal / Drawer */}
      <ItemDetailModal
        item={selectedItem}
        config={config}
        onClose={() => setSelectedItem(null)}
      />

      {/* Google Sheet & Godown Settings Modal */}
      <GoogleSheetSettingsModal
        isOpen={isSettingsOpen}
        config={config}
        onSaveConfig={handleSaveConfig}
        onImportCsvItems={handleImportCsv}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
