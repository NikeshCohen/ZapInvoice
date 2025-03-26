"use client";

import React, { useEffect, useRef, useState } from "react";

import { SelectContent } from "@/components/ui/select";

interface VirtualizedSelectContentProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function VirtualizedSelectContent<T>({
  items,
  renderItem,
  itemHeight = 35,
  maxHeight = 300,
  className,
}: VirtualizedSelectContentProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });

  // Calculate buffer (render more items than visible to prevent flickering during scroll)
  const buffer = Math.ceil(maxHeight / itemHeight) * 2;
  const totalHeight = items.length * itemHeight;

  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;

      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + maxHeight) / itemHeight) + buffer,
      );

      setVisibleRange({ start, end });
    }
  }, [items.length, itemHeight, maxHeight, buffer]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Use passive: true for better scroll performance
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Initial calculation
      handleScroll();

      // Force a recalculation after a short delay to ensure proper rendering
      const timer = setTimeout(handleScroll, 100);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }
  }, [handleScroll, items]);

  return (
    <SelectContent className={className}>
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ maxHeight, position: "relative" }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {items
            .slice(visibleRange.start, visibleRange.end)
            .map((item, index) => (
              <div
                key={`item-${visibleRange.start + index}`}
                style={{
                  position: "absolute",
                  top: (visibleRange.start + index) * itemHeight,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                }}
              >
                {renderItem(item, visibleRange.start + index)}
              </div>
            ))}
        </div>
      </div>
    </SelectContent>
  );
}
