import { StockItem, StockSummary, AppConfig } from "@/types/stock";
import { generateMockStockData } from "./mock-data";
import Papa from "papaparse";

export const DEFAULT_CONFIG: AppConfig = {
  sheetUrl: "",
  sheetId: "",
  sheetName: "Sheet1",
  useDemoData: true,
  pinLockEnabled: false,
  pinCode: "1234",
  whatsappNumber: "",
  godownName: "Central Godown (Hub 1)"
};

const CONFIG_KEY = "godown_stock_config";
const CACHED_ITEMS_KEY = "godown_stock_cached_items";
const CACHED_TIME_KEY = "godown_stock_cached_time";

export function loadStoredConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
}

export function calculateSummary(items: StockItem[], lastSyncTime: string): StockSummary {
  let totalQty = 0;
  let lowStock = 0;
  let outOfStock = 0;
  const categories = new Set<string>();

  for (const item of items) {
    totalQty += item.quantity;
    categories.add(item.category);
    if (item.quantity === 0) {
      outOfStock++;
    } else if (item.quantity <= item.reorderLevel) {
      lowStock++;
    }
  }

  return {
    totalItems: items.length,
    totalQuantity: totalQty,
    lowStockCount: lowStock,
    outOfStockCount: outOfStock,
    categoriesCount: categories.size,
    lastSyncTime
  };
}

/**
 * Parses raw CSV text (from Google Sheets or billing export) into structured StockItem[]
 */
export function parseStockCsv(csvText: string): StockItem[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_")
  });

  const now = new Date();
  const defaultDate = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`;

  return parsed.data.map((row, idx) => {
    // Tolerant column name matching
    const itemCode = row.item_code || row.code || row.itemcode || row.sku || `ITEM-${idx + 1}`;
    const itemName = row.item_name || row.name || row.description || row.item || `Stock Item ${idx + 1}`;
    const category = row.category || row.group || row.dept || "General";
    const quantity = parseFloat(row.quantity || row.qty || row.stock || "0") || 0;
    const unit = row.unit || row.uom || "Nos";
    const reorderLevel = parseFloat(row.reorder_level || row.reorder || row.min_qty || "10") || 10;
    const lastUpdated = row.last_updated || row.updated || row.date || defaultDate;
    const location = row.location || row.rack || row.bin || "";
    const rate = parseFloat(row.rate || row.price || row.mrp || "0") || 0;

    let status: StockItem["status"] = "in_stock";
    if (quantity === 0) {
      status = "out_of_stock";
    } else if (quantity <= reorderLevel) {
      status = "low_stock";
    }

    return {
      id: `${itemCode}-${idx}`,
      itemCode,
      itemName,
      category,
      quantity,
      unit,
      reorderLevel,
      lastUpdated,
      location,
      rate,
      status
    };
  });
}

/**
 * Fetches stock data from Google Sheets or returns Mock Data
 */
export async function fetchStockData(config: AppConfig): Promise<{ items: StockItem[]; lastUpdated: string; source: string }> {
  // If demo mode is active or no URL provided, return mock data
  if (config.useDemoData || (!config.sheetUrl && !config.sheetId)) {
    const items = generateMockStockData(2500);
    const now = new Date();
    const timeStr = `${now.toLocaleDateString("en-IN")} at ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    return {
      items,
      lastUpdated: timeStr,
      source: "Demo Godown Inventory (2,500+ Items)"
    };
  }

  let fetchUrl = config.sheetUrl;

  // If user pasted a Sheet ID or standard edit URL, convert it to public CSV export endpoint
  if (config.sheetId) {
    fetchUrl = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(config.sheetName || "Sheet1")}`;
  } else if (config.sheetUrl.includes("docs.google.com/spreadsheets/d/")) {
    const match = config.sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    }
  }

  try {
    const res = await fetch(fetchUrl, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google Sheet: HTTP ${res.status}`);
    }

    const csvText = await res.text();
    const items = parseStockCsv(csvText);

    const now = new Date();
    const timeStr = `${now.toLocaleDateString("en-IN")} at ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;

    // Cache locally for offline resilience
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CACHED_ITEMS_KEY, JSON.stringify(items));
        localStorage.setItem(CACHED_TIME_KEY, timeStr);
      } catch (e) {
        console.warn("Storage quota exceeded", e);
      }
    }

    return {
      items,
      lastUpdated: timeStr,
      source: "Live Google Sheet"
    };
  } catch (err) {
    console.error("Error fetching Google Sheet data, attempting offline cache:", err);
    
    // Check if offline cache is available
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHED_ITEMS_KEY);
      const cachedTime = localStorage.getItem(CACHED_TIME_KEY);
      if (cached) {
        return {
          items: JSON.parse(cached),
          lastUpdated: cachedTime || "Offline Cached Data",
          source: "Offline Cached (Google Sheet unreachable)"
        };
      }
    }

    throw err;
  }
}
