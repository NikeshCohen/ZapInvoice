import type { InvoiceData } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FromToTabProps {
  form: UseFormReturn<InvoiceData>;
}

export function FromToTab({ form }: FromToTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="fromName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name/Business Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="From" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer/Client Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="To" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
