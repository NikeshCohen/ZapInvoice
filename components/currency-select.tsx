"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty" },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "COP", symbol: "CO$", name: "Colombian Peso" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol" },
  { code: "MOP", symbol: "MOP$", name: "Macanese Pataca" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "BND", symbol: "B$", name: "Brunei Dollar" },
  { code: "GYD", symbol: "G$", name: "Guyanese Dollar" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "PYG", symbol: "₲", name: "Paraguayan Guaraní" },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "SOS", symbol: "Sh", name: "Somali Shilling" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "TJS", symbol: "ЅM", name: "Tajikistani Somoni" },
  { code: "TMT", symbol: "T", name: "Turkmenistani Manat" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "UZS", symbol: "лв", name: "Uzbekistani Som" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" },
];

interface CurrencySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  onCurrencySelect?: (currency: Currency) => void;
  placeholder?: string;
  disabled?: boolean;
  currencies?: "all" | Currency[];
  variant?: "default" | "small";
  className?: string;
}

export function CurrencySelect({
  value,
  onValueChange,
  onCurrencySelect,
  placeholder = "Select currency",
  disabled = false,
  currencies: customCurrencies = "all",
  variant = "default",
  className,
}: CurrencySelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCurrency = React.useMemo(() => {
    if (!value) return null;
    const currencyList =
      customCurrencies === "all" ? currencies : customCurrencies;
    return currencyList.find((currency) => currency.code === value) || null;
  }, [value, customCurrencies]);

  const handleSelect = (currency: Currency) => {
    onValueChange(currency.code);
    onCurrencySelect?.(currency);
    setOpen(false);
  };

  const currencyList =
    customCurrencies === "all" ? currencies : customCurrencies;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            variant === "small" && "h-8 px-2 text-sm",
            className,
          )}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <span>{selectedCurrency.code}</span>
              <span className="text-muted-foreground">
                ({selectedCurrency.symbol})
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencyList.map((currency) => (
              <CommandItem
                key={currency.code}
                value={currency.code}
                onSelect={() => handleSelect(currency)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === currency.code ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex items-center gap-2">
                  <span>{currency.code}</span>
                  <span className="text-muted-foreground">
                    ({currency.symbol})
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
