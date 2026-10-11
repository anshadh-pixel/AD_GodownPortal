export interface StockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  opening?: number;
  sales?: number;
  unit: string;
  reorderLevel: number;
  lastUpdated: string;
  location?: string;
  rate?: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface StockSummary {
  totalItems: number;
  totalQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoriesCount: number;
  lastSyncTime: string;
}

export type StockFilterStatus = 'all' | 'low_stock' | 'out_of_stock' | 'in_stock';

export interface AppConfig {
  sheetUrl: string;
  sheetId: string;
  sheetName: string;
  apiKey?: string;
  useDemoData: boolean;
  pinLockEnabled: boolean;
  pinCode: string;
  whatsappNumber?: string;
  godownName: string;
}
