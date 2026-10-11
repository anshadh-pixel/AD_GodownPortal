"use client";

import React from "react";
import { 
  Warehouse, 
  RefreshCw, 
  Settings, 
  Lock, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet
} from "lucide-react";
import { AppConfig } from "@/types/stock";

interface HeaderProps {
  config: AppConfig;
  lastUpdated: string;
  source: string;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onLockApp: () => void;
}

export function Header({
  config,
  lastUpdated,
  source,
  isLoading,
  onRefresh,
  onOpenSettings,
  onLockApp
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Godown Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-950/40 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {config.godownName || "Godown Stock Viewer"}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Live Viewer
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-zinc-400 truncate mt-0.5">
                <span className="flex items-center gap-1 font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-500 hidden sm:inline">Last Sync:</span> 
                  <span className="text-zinc-300 font-medium">{lastUpdated || "Syncing..."}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Source indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[150px]">{source}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Stock Data"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">{isLoading ? "Syncing..." : "Sync"}</span>
            </button>

            {/* Lock Button (if enabled) */}
            {config.pinLockEnabled && (
              <button
                onClick={onLockApp}
                title="Lock App"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 transition-all active:scale-95"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Settings & Google Sheet Setup"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
