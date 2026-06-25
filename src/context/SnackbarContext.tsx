"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type SnackbarType = "success" | "error" | "warning" | "info";

interface SnackbarState {
  id: number;
  title: string;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showSnackbar: (title: string, message: string, type: SnackbarType) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSnackbar, setActiveSnackbar] = useState<SnackbarState | null>(null);

  const showSnackbar = useCallback((title: string, message: string, type: SnackbarType) => {
    setActiveSnackbar({
      id: Date.now(),
      title,
      message,
      type,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setActiveSnackbar(null);
  }, []);

  useEffect(() => {
    if (!activeSnackbar) return;

    const timer = setTimeout(() => {
      setActiveSnackbar(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeSnackbar]);

  // Color configurations based on Flutter spec
  const getConfig = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4CAF50",
          textColor: "#FFFFFF",
          Icon: CheckCircle,
        };
      case "error":
        return {
          backgroundColor: "#F44336",
          textColor: "#FFFFFF",
          Icon: AlertCircle,
        };
      case "warning":
        return {
          backgroundColor: "#FFC107",
          textColor: "#1E1E1E",
          Icon: AlertTriangle,
        };
      case "info":
        return {
          backgroundColor: "#2196F3",
          textColor: "#FFFFFF",
          Icon: Info,
        };
    }
  };

  const currentConfig = activeSnackbar ? getConfig(activeSnackbar.type) : null;

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <AnimatePresence>
        {activeSnackbar && currentConfig && (
          <motion.div
            key={activeSnackbar.id}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-6 left-4 right-4 min-[800px]:left-1/2 min-[800px]:right-4 z-[9999] pointer-events-auto"
          >
            <div
              className="w-full flex flex-col overflow-hidden rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-all duration-300"
              style={{
                backgroundColor: currentConfig.backgroundColor,
                color: currentConfig.textColor,
                fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
              }}
            >
              <div className="flex items-start px-4 py-3">
                <currentConfig.Icon
                  className="flex-shrink-0 w-6 h-6 mt-[2px]"
                  style={{ color: currentConfig.textColor }}
                />
                
                <div className="flex-1 min-w-0 ml-3 mr-2">
                  <h4 className="text-[14px] font-semibold leading-tight tracking-wide">
                    {activeSnackbar.title}
                  </h4>
                  <p
                    className="text-[12px] mt-[2px] leading-tight opacity-90"
                    style={{ color: currentConfig.textColor }}
                  >
                    {activeSnackbar.message}
                  </p>
                </div>

                <button
                  onClick={hideSnackbar}
                  className="flex-shrink-0 p-0.5 hover:opacity-80 transition-opacity rounded-full outline-none focus:ring-1 focus:ring-offset-1 focus:ring-current"
                  style={{ color: currentConfig.textColor }}
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Progress Bar at the bottom */}
              <div className="w-full h-[3px] overflow-hidden bg-black/10">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full"
                  style={{
                    backgroundColor:
                      currentConfig.textColor === "#FFFFFF"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 30, 30, 0.7)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SnackbarContext.Provider>
  );
};
