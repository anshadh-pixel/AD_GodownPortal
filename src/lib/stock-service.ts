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
  godownName: "AD GODOWN PORTAL"
};

const CONFIG_KEY = "godown_stock_config";
const CACHED_ITEMS_KEY = "godown_stock_cached_items";
const CACHED_TIME_KEY = "godown_stock_cached_time";

export function loadStoredConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (!saved) return DEFAULT_CONFIG;
    const parsed = JSON.parse(saved);
    if (parsed.godownName === "VK Godown Stock Portal" || parsed.godownName === "Central Godown (Hub 1)" || !parsed.godownName) {
      parsed.godownName = "AD GODOWN PORTAL";
    }
    return { ...DEFAULT_CONFIG, ...parsed };
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
    if (item.quantity > 0) {
      totalQty += item.quantity;
    }
    categories.add(item.category);
    if (item.quantity <= 0) {
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
 * Automatically detects Cookware/Kitchenware categories from Item Name
 * when the billing software export doesn't have an explicit Category column.
 */
export function detectCookwareCategory(itemName: string): string {
  const upper = itemName.toUpperCase();

  if (upper.includes("COOKER")) return "Cookers (Aluminium/IB)";
  if (upper.includes("BIRIYANI") || upper.includes("POT")) return "Biriyani Pots";
  if (upper.includes("APPACHATTY") || upper.includes("APPAM")) return "Appachatty";
  if (upper.includes("KADAI") || upper.includes("KADAHI")) return "Kadai";
  if (upper.includes("FRYPAN") || upper.includes("FRY PAN")) return "Frypans";
  if (upper.includes("PATHIRI") || upper.includes("TAWA")) return "Tawas & Pathiri";
  if (upper.includes("CASSEROLE")) return "Casseroles";
  if (upper.includes("GRILLPAN") || upper.includes("GRILL PAN")) return "Grill Pans";
  if (upper.includes("PANIYARAKKAL")) return "Paniyarakkal";
  if (upper.includes("KETTLE")) return "Electric Kettles";
  if (upper.includes("BOTTLE") || upper.includes("FLASK")) return "Bottles & Flasks";
  if (upper.includes("KTF") || upper.includes("PCS SET") || upper.includes("SET")) return "Cookware Sets";
  if (upper.includes("DIE CAST")) return "Die Cast Cookware";
  
  return "General Cookware";
}

/**
 * Parses CSV text from billing software export or Google Sheets into structured StockItem[]
 * Directly handles Billing columns: ItemName, ItemCode, Balance, Opening, Sales, etc.
 */
export function parseStockCsv(csvText: string): StockItem[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, "")
  });

  const now = new Date();
  const defaultDate = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`;

  return parsed.data.map((row, idx) => {
    // 1. Item Name
    const itemName = 
      row.itemname || 
      row.name || 
      row.description || 
      row.item || 
      `Stock Item ${idx + 1}`;

    // 2. Item Code (fallback to ItemName or generated code)
    const itemCode = 
      row.itemcode || 
      row.code || 
      row.sku || 
      itemName;

    // 3. Category: Use row category if present, otherwise auto-detect from product name!
    const category = 
      row.category || 
      row.group || 
      row.department || 
      detectCookwareCategory(itemName);

    // 4. Quantity: Primary from "balance" column in the billing software, or "quantity", "qty", "stock"
    const balanceStr = row.balance || row.quantity || row.qty || row.stock || "0";
    const quantity = parseFloat(balanceStr) || 0;

    // 5. Opening & Sales columns from billing software
    const opening = row.opening ? parseFloat(row.opening) : undefined;
    const sales = row.sales ? parseFloat(row.sales) : undefined;

    // 6. Unit
    const unit = row.unit || row.uom || "Nos";

    // 7. Reorder Level: default to 10 if not provided
    const reorderLevel = parseFloat(row.reorderlevel || row.reorder || row.minqty || "10") || 10;

    // 8. Last Updated
    const lastUpdated = row.lastupdated || row.updated || row.date || defaultDate;

    // 9. Location & Rate
    const location = row.location || row.rack || row.godown || "";
    const rate = parseFloat(row.rate || row.price || row.mrp || "0") || 0;

    // Status logic: <= 0 is out of stock (including negative overbilled balances)
    let status: StockItem["status"] = "in_stock";
    if (quantity <= 0) {
      status = "out_of_stock";
    } else if (quantity <= reorderLevel) {
      status = "low_stock";
    }

    return {
      id: `stock-${idx}-${itemCode.replace(/\s+/g, "_")}`,
      itemCode,
      itemName,
      category,
      quantity,
      opening,
      sales,
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
 * Fetches stock data from Google Sheets or returns Cookware Mock Data
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
      source: "Cookware Inventory (2,500+ Items)"
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
