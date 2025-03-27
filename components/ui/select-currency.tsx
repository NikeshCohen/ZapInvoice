"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { allCurrencies } from "@/constants/currencies";
import { customCurrencies } from "@/constants/currencies";
import type { SelectProps } from "@radix-ui/react-select";
import { currencies as AllCurrencies } from "country-data-list";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualizedSelectContent } from "@/components/ui/virtualized-select.tsx";

import { cn } from "@/lib/utils";

export interface Currency {
  code: string;
  decimals: number;
  name: string;
  number: string;
  symbol?: string;
}

interface CurrencySelectProps extends Omit<SelectProps, "onValueChange"> {
  onValueChange?: (value: string) => void;
  onCurrencySelect?: (currency: Currency) => void;
  name: string;
  placeholder?: string;
  currencies?: "custom" | "all";
  variant?: "default" | "small";
  valid?: boolean;
  selectedCurrency?: Currency;
}

// Pre-process currencies outside component to avoid recalculation
const processedCurrencies = {
  all: new Map<string, Currency>(),
  custom: new Map<string, Currency>(),
};

// Initialize the processed currencies
(() => {
  AllCurrencies.all.forEach((currency: Currency) => {
    if (currency.code && currency.name && currency.symbol) {
      // Process for "all" currencies
      if (!allCurrencies.includes(currency.code)) {
        const currencyData = {
          code: currency.code,
          name: currency.code === "EUR" ? "Euro" : currency.name,
          symbol: currency.symbol,
          decimals: currency.decimals,
          number: currency.number,
        };
        processedCurrencies.all.set(currency.code, currencyData);
      }

      // Process for "custom" currencies
      if (customCurrencies.includes(currency.code)) {
        const currencyData = {
          code: currency.code,
          name: currency.code === "EUR" ? "Euro" : currency.name,
          symbol: currency.symbol,
          decimals: currency.decimals,
          number: currency.number,
        };
        processedCurrencies.custom.set(currency.code, currencyData);
      }
    }
  });
})();

const CurrencySelect = React.memo(
  React.forwardRef<HTMLButtonElement, CurrencySelectProps>(
    (
      {
        value,
        onValueChange,
        onCurrencySelect,
        name,
        placeholder = "Select currency",
        currencies = "all",
        variant = "default",
        valid = true,
        selectedCurrency: initialSelectedCurrency,
        ...props
      },
      ref,
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        initialSelectedCurrency || null,
      );

      useEffect(() => {
        if (initialSelectedCurrency) {
          setSelectedCurrency(initialSelectedCurrency);
        }
      }, [initialSelectedCurrency]);

      const uniqueCurrencies = useMemo<Currency[]>(() => {
        const currencyMap =
          currencies === "custom"
            ? processedCurrencies.custom
            : processedCurrencies.all;

        return Array.from(currencyMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      }, [currencies]);

      const handleValueChange = useCallback(
        (newValue: string) => {
          const fullCurrencyData = uniqueCurrencies.find(
            (curr) => curr.code === newValue,
          );

          if (fullCurrencyData) {
            setSelectedCurrency(fullCurrencyData);
            onValueChange?.(newValue);
            onCurrencySelect?.(fullCurrencyData);
          }
        },
        [uniqueCurrencies, onValueChange, onCurrencySelect],
      );

      // Render a currency item
      const renderCurrencyItem = useCallback(
        (currency: Currency) => (
          <SelectItem value={currency?.code || ""}>
            <div className="flex w-full items-center gap-2">
              <span className="text-muted-foreground w-8 text-left text-sm">
                {currency?.code}
              </span>
              <span className="hidden">{currency?.symbol}</span>
              <span>{currency?.name}</span>
            </div>
          </SelectItem>
        ),
        [],
      );

      return (
        <Select
          value={value}
          onValueChange={handleValueChange}
          {...props}
          name={name}
          data-valid={valid}
        >
          <SelectTrigger
            className={cn("w-full", variant === "small" && "w-fit gap-2")}
            data-valid={valid}
            ref={ref}
          >
            {value && variant === "small" ? (
              <SelectValue placeholder={placeholder}>
                <span>{value}</span>
              </SelectValue>
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </SelectTrigger>

          <VirtualizedSelectContent
            items={uniqueCurrencies}
            renderItem={(currency) => renderCurrencyItem(currency)}
            maxHeight={300}
          />
        </Select>
      );
    },
  ),
);

CurrencySelect.displayName = "OptimizedCurrencySelect";

export { CurrencySelect };
