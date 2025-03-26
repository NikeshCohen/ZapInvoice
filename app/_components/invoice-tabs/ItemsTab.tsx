import { ChangeEvent } from "react";

import { useInvoice } from "@/app/_context/InvoiceContext";
import type { InvoiceData } from "@/types/schema";
import { ArrowDown, ArrowUp, MoreVertical, Trash2 } from "lucide-react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemsTabProps {
  form: UseFormReturn<InvoiceData>;
}

export function ItemsTab({ form }: ItemsTabProps) {
  const { invoiceData } = useInvoice();

  const formatPrice = (value: number): string => {
    // Convert to string to check for decimal places
    const stringValue = value.toString();
    const hasDecimal = stringValue.includes(".");

    // Format with appropriate decimal places
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: hasDecimal ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const parsePrice = (value: string): number => {
    // Remove currency symbol and commas, but keep decimal points
    const cleanValue = value.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      // Keep first part and first decimal part
      return Number(parts[0] + "." + parts[1]) || 0;
    }

    return Number(cleanValue) || 0;
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<InvoiceData, `items.${number}.price`>,
  ) => {
    const inputValue = e.target.value;
    if (inputValue.endsWith(".")) {
      field.onChange(parsePrice(inputValue));
      return;
    }

    const value = parsePrice(inputValue);
    field.onChange(value);
  };

  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      { description: "", quantity: 0, price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items") || [];
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index),
    );
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const currentItems = form.getValues("items") || [];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= currentItems.length) return;

    const newItems = [...currentItems];
    [newItems[index], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[index],
    ];
    form.setValue("items", newItems);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Invoice Items</h3>

      {form.watch("items")?.map((item, index) => (
        <div
          key={index}
          className="grid items-start gap-4 rounded-lg border p-3"
        >
          <div className="flex items-center justify-between">
            <span className="max-w-[200px] truncate text-sm">
              {item.description ? (
                <span className="text-foreground">{item.description}</span>
              ) : (
                <span className="text-muted-foreground">Item {index + 1}</span>
              )}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {index !== 0 && (
                  <DropdownMenuItem onClick={() => moveItem(index, "up")}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Move Up
                  </DropdownMenuItem>
                )}
                {index !== form.watch("items").length - 1 && (
                  <DropdownMenuItem onClick={() => moveItem(index, "down")}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Move Down
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => removeItem(index)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name={`items.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Item Description" {...field} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      {...field}
                      value={field.value || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = Math.max(
                          0,
                          parseInt(e.target.value) || 0,
                        );
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                        {invoiceData.selectedCurrency?.symbol || "$"}
                      </span>
                      <Input
                        type="text"
                        className="pl-7"
                        placeholder="0"
                        {...field}
                        value={
                          field.value !== undefined
                            ? formatPrice(field.value)
                            : ""
                        }
                        onChange={(e) => handlePriceChange(e, field)}
                      />
                    </div>
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full"
      >
        Add Item
      </Button>
    </div>
  );
}
