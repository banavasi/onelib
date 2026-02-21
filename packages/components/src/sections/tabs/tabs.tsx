// Source: Sera UI (seraui.com)
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

const Tabs = ({ items, defaultValue, className = "" }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(
    defaultValue || (items.length > 0 ? items[0].value : ""),
  );

  const activeItem = items.find((item) => item.value === activeTab);

  return (
    <div className={className}>
      {/* Tab list */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-xl border border-white/5">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setActiveTab(item.value)}
            className={`relative flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.value
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {activeTab === item.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-600 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeItem.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export type { TabItem, TabsProps };
export { Tabs };
export default Tabs;
