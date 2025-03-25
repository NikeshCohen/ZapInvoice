import type { InvoiceData } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

interface SummaryTabProps {
  form: UseFormReturn<InvoiceData>;
}

export function SummaryTab({ form }: SummaryTabProps) {
  const values = form.getValues();
  const total = values.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">From/To</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">From:</span> {values.from.name}
          </p>
          <p>
            <span className="font-medium">To:</span> {values.to.name}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Invoice Details</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Invoice Number:</span>{" "}
            {values.invoiceNumber}
          </p>
          <p>
            <span className="font-medium">Date:</span> {values.date}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Items</h3>
        <div className="space-y-2">
          {values.items.map((item, index) => (
            <div key={index} className="text-sm">
              <p className="font-medium">{item.description}</p>
              <p className="text-muted-foreground">
                {item.quantity} x ${item.price.toFixed(2)} = $
                {(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="mt-4 border-t pt-4">
            <p className="text-right font-medium">Total: ${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Payment Details</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Payment Terms:</span>{" "}
            {values.paymentTerms} days
          </p>
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {values.paymentMethod}
          </p>
        </div>
      </div>
    </div>
  );
}
