"use client";

import React from "react";
import { 
  Warehouse, 
  RefreshCw, 
  Settings, 
  Lock, 
  Clock, 
  FileSpreadsheet,
  Sun,
  Moon
} from "lucide-react";
import { AppConfig } from "@/types/stock";

interface HeaderProps {
  config: AppConfig;
  lastUpdated: string;
  source: string;
  isLoading: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  onLockApp: () => void;
}

export function Header({
  config,
  lastUpdated,
  source,
  isLoading,
  theme,
  onToggleTheme,
  onRefresh,
  onOpenSettings,
  onLockApp
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Godown Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-900 dark:bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {config.godownName || "Godown Stock Viewer"}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Live Portal
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  <span className="hidden sm:inline">Last Sync:</span> 
                  <span className="text-slate-700 dark:text-zinc-300 font-semibold">{lastUpdated || "Syncing..."}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Source indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[150px]">{source}</span>
            </div>

            {/* Day / Night Theme Switcher */}
            <button
              onClick={onToggleTheme}
              title={theme === "dark" ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
                  <span className="hidden sm:inline text-amber-300 font-medium">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
                  <span className="hidden sm:inline text-indigo-600 font-medium">Night</span>
                </>
              )}
            </button>

            {/* Refresh / Sync Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Stock Data"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-medium transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
              <span className="hidden sm:inline">{isLoading ? "Syncing..." : "Sync"}</span>
            </button>

            {/* Lock Button (if enabled) */}
            {config.pinLockEnabled && (
              <button
                onClick={onLockApp}
                title="Lock App"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-amber-500 dark:text-amber-400 transition-all active:scale-95 shadow-sm"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Settings & Google Sheet Setup"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-700/20 transition-all active:scale-95"
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
