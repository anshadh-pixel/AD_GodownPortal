"use client";

import React, { useState } from "react";
import { 
  X, 
  Save, 
  FileSpreadsheet, 
  ShieldCheck, 
  Download, 
  CheckCircle2
} from "lucide-react";
import { AppConfig, StockItem } from "@/types/stock";
import { parseStockCsv } from "@/lib/stock-service";

interface GoogleSheetSettingsModalProps {
  isOpen: boolean;
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
  onImportCsvItems: (items: StockItem[], filename: string) => void;
  onClose: () => void;
}

export function GoogleSheetSettingsModal({
  isOpen,
  config,
  onSaveConfig,
  onImportCsvItems,
  onClose
}: GoogleSheetSettingsModalProps) {
  const [formData, setFormData] = useState<AppConfig>({ ...config });
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        try {
          const items = parseStockCsv(text);
          if (items.length > 0) {
            onImportCsvItems(items, file.name);
            setCsvUploadSuccess(`Successfully loaded ${items.length} items from ${file.name}`);
            setFormData(prev => ({ ...prev, useDemoData: false }));
          } else {
            alert("Could not parse items from this CSV. Check column headers.");
          }
        } catch (err) {
          alert("Error parsing CSV file: " + String(err));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = 
      "ItemName,ItemCode,Balance,Opening,Sales\n" +
      "VK ALUMINIUM COOKER IB 3 LTR,VK ALUMINIUM COOKER IB 3 LTR,18,20,2\n" +
      "VK BIRIYANI POT 10L - NIB W/GL,VK BIRIYANI POT 10L - NIB W/GL,16,16,0\n" +
      "VK APPACHATTY 200,VK APPACHATTY 200,183,183,0\n" +
      "VK IB TAWA 250,VK IB TAWA 250,272,272,0\n" +
      "VK KADAI 240 NIB W GL,VK KADAI 240 NIB W GL,-2,-2,0\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "VK_Billing_Stock_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Godown & Data Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Configure Google Sheet sync, billing CSV upload, and security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Data Source Selector */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block">
              Inventory Data Source
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                formData.useDemoData
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
              }`}>
                <input
                  type="radio"
                  name="dataSource"
                  checked={formData.useDemoData}
                  onChange={() => setFormData({ ...formData, useDemoData: true })}
                  className="mt-1 text-emerald-600 dark:text-emerald-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Demo Godown Data
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-semibold">
                      2,500+ Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Test high-speed 60 FPS virtualization, search, and low-stock filters instantly.
                  </p>
                </div>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                !formData.useDemoData
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
              }`}>
                <input
                  type="radio"
                  name="dataSource"
                  checked={!formData.useDemoData}
                  onChange={() => setFormData({ ...formData, useDemoData: false })}
                  className="mt-1 text-emerald-600 dark:text-emerald-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Live Google Sheet / CSV
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Connect your real Google Sheet URL or upload billing export CSV.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Google Sheets Sync Settings */}
          {!formData.useDemoData && (
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-zinc-950/70 rounded-xl border border-slate-200 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Google Sheet URL or Spreadsheet ID
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                  value={formData.sheetUrl}
                  onChange={(e) => setFormData({ ...formData, sheetUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">
                  💡 <strong>Tip:</strong> In Google Sheets, click <em>Share → General Access → &quot;Anyone with the link can view&quot;</em>. That&apos;s all!
                </p>
              </div>

              {/* Direct CSV Upload Alternative */}
              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Or Upload Billing Software Export CSV Directly
                  </label>
                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3 h-3" />
                    Download CSV Template
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-500 dark:text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 dark:file:bg-zinc-800 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-slate-300 dark:hover:file:bg-zinc-700 cursor-pointer"
                  />
                </div>

                {csvUploadSuccess && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {csvUploadSuccess}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Godown Name & WhatsApp Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Godown / Business Name
              </label>
              <input
                type="text"
                value={formData.godownName}
                onChange={(e) => setFormData({ ...formData, godownName: e.target.value })}
                placeholder="e.g. VK Godown Stock Portal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Default WhatsApp Contact (Optional)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ""}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Security PIN Lock */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/70 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Staff Passcode Security Lock
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pinLockEnabled}
                  onChange={(e) => setFormData({ ...formData, pinLockEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {formData.pinLockEnabled && (
              <div className="pt-2">
                <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                  4-Digit Unlock PIN:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="1234"
                  className="w-32 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-center font-mono text-base tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-700/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save & Apply Settings
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
