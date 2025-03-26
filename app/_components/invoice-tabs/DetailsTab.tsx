"use client";

import type { InvoiceData } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency } from "@/components/ui/select-currency";
import { CurrencySelect } from "@/components/ui/select-currency";

interface DetailsTabProps {
  form: UseFormReturn<InvoiceData>;
}

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "Check"] as const;

export function DetailsTab({ form }: DetailsTabProps) {
  const paymentMethod = form.watch("paymentMethod");

  // Ensure bankDetails exists
  const bankDetails = form.getValues("bankDetails") || {
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  };

  const handleCurrencySelect = (currency: Currency) => {
    form.setValue("selectedCurrency", currency);
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="mb-4 font-medium text-lg">Invoice Details</h3>
        <div className="space-y-4">
          <div className="gap-4 grid sm:grid-cols-2">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="INV-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <CurrencySelect
                      onValueChange={field.onChange}
                      onCurrencySelect={handleCurrencySelect}
                      placeholder="Select currency"
                      currencies="all"
                      variant="default"
                      name="currency"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="gap-4 grid sm:grid-cols-2">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} placeholder="Select issue date" />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      placeholder="Select due date"
                      showPresets
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-medium text-lg">Payment Details</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms (Days)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === "Bank Transfer" && (
            <div className="space-y-4 bg-background/30 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Bank Details</h3>
              <FormField
                control={form.control}
                name="bankDetails.bankName"
                defaultValue={bankDetails.bankName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter bank name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails.accountNumber"
                defaultValue={bankDetails.accountNumber}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter account number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails.accountHolder"
                defaultValue={bankDetails.accountHolder}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter account holder name"
                      />
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
  );
}
