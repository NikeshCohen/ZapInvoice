import { ChangeEvent } from "react";

import { useInvoice } from "@/app/_context/InvoiceContext";
import type { InvoiceData } from "@/types/schema";
import {
  ArrowDown,
  ArrowUp,
  MoreVertical,
  Percent,
  Trash2,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

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

  const handleAdjustmentChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<InvoiceData, "discount.value" | "tax.value">,
    isPercentage: boolean,
  ) => {
    const inputValue = e.target.value;
    if (isPercentage) {
      // Remove leading zeros unless it's just "0"
      const cleanValue =
        inputValue === "0" ? "0" : inputValue.replace(/^0+/, "");
      field.onChange(Number(cleanValue));
      return;
    }

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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adjustments</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Discount Controls */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="discount-enabled" className="font-medium">
                Enable Discount
              </Label>
              <FormField
                control={form.control}
                name="discount.enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        id="discount-enabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("discount.enabled") && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="discount.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="percentage"
                              id="discount-percentage"
                            />
                            <Label htmlFor="discount-percentage">
                              Percentage
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="discount-fixed" />
                            <Label htmlFor="discount-fixed">Fixed Amount</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          {form.watch("discount.type") === "percentage" ? (
                            <>
                              <Input
                                type="text"
                                min="0"
                                max="100"
                                placeholder="0"
                                className="pr-8"
                                {...field}
                                value={field.value?.toString() || ""}
                                onChange={(e) =>
                                  handleAdjustmentChange(e, field, true)
                                }
                              />
                              <span className="absolute top-1/2 right-3 -translate-y-1/2">
                                <Percent className="text-muted-foreground h-4 w-4" />
                              </span>
                            </>
                          ) : (
                            <>
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
                                onChange={(e) =>
                                  handleAdjustmentChange(e, field, false)
                                }
                              />
                            </>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Tax Controls */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tax-enabled" className="font-medium">
                Enable Tax
              </Label>
              <FormField
                control={form.control}
                name="tax.enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        id="tax-enabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("tax.enabled") && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tax.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="percentage"
                              id="tax-percentage"
                            />
                            <Label htmlFor="tax-percentage">Percentage</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="tax-fixed" />
                            <Label htmlFor="tax-fixed">Fixed Amount</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          {form.watch("tax.type") === "percentage" ? (
                            <>
                              <Input
                                type="text"
                                min="0"
                                max="100"
                                placeholder="0"
                                className="pr-8"
                                {...field}
                                value={field.value?.toString() || ""}
                                onChange={(e) =>
                                  handleAdjustmentChange(e, field, true)
                                }
                              />
                              <span className="absolute top-1/2 right-3 -translate-y-1/2">
                                <Percent className="text-muted-foreground h-4 w-4" />
                              </span>
                            </>
                          ) : (
                            <>
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
                                onChange={(e) =>
                                  handleAdjustmentChange(e, field, false)
                                }
                              />
                            </>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
                  <span className="text-muted-foreground">
                    Item {index + 1}
                  </span>
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
                      <ArrowUp />
                      Move Up
                    </DropdownMenuItem>
                  )}
                  {index !== form.watch("items").length - 1 && (
                    <DropdownMenuItem
                      onClick={() => moveItem(index, "down")}
                      className="text-xs"
                    >
                      <ArrowDown />
                      <span className="text-xs">Move Down</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => removeItem(index)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="text-red-600 focus:text-red-600" />
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
    </div>
  );
}
