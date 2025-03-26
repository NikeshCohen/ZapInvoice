import { ContactForm } from "@/app/_components/invoice-tabs/ContactForm";
import type { InvoiceData } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

interface FromToTabProps {
  form: UseFormReturn<InvoiceData>;
}

export function FromToTab({ form }: FromToTabProps) {
  return (
    <div className="space-y-2">
      <ContactForm form={form} type="from" title="From (Your Details)" />
      <ContactForm form={form} type="to" title="To (Customer Details)" />
    </div>
  );
}
