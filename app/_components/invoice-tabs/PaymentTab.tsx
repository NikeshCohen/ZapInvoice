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

interface PaymentTabProps {
  form: UseFormReturn<InvoiceData>;
}

export function PaymentTab({ form }: PaymentTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Terms (days)</FormLabel>
            <FormControl>
              <Input type="number" {...field} placeholder="30" />
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
            <FormControl>
              <Input {...field} placeholder="Bank Transfer" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
