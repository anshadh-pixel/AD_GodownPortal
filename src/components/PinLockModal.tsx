"use client";

import React, { useState } from "react";
import { Lock, Unlock, Warehouse, AlertCircle } from "lucide-react";

interface PinLockModalProps {
  correctPin: string;
  godownName: string;
  onUnlock: () => void;
}

export function PinLockModal({ correctPin, godownName, onUnlock }: PinLockModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin("");
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl">
      <div className="w-full max-w-sm flex flex-col items-center text-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
        
        {/* Godown Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/40">
          <Warehouse className="w-7 h-7" />
        </div>

        <h2 className="text-lg font-bold text-white tracking-tight">
          {godownName || "Godown Stock Viewer"}
        </h2>
        <p className="text-xs text-zinc-400 mt-1 mb-6">
          Enter 4-digit staff passcode to access stock inventory
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  error
                    ? "bg-rose-500 border-rose-400 animate-shake"
                    : isFilled
                    ? "bg-emerald-400 border-emerald-300 scale-110 shadow-md shadow-emerald-500/40"
                    : "bg-zinc-800 border-zinc-700"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-400 mb-4 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="h-14 rounded-2xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-white text-xl font-bold font-mono transition-all active:scale-90"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-xs font-semibold uppercase tracking-wider transition-all active:scale-90"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="h-14 rounded-2xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-white text-xl font-bold font-mono transition-all active:scale-90"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-xs font-semibold uppercase tracking-wider transition-all active:scale-90"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
