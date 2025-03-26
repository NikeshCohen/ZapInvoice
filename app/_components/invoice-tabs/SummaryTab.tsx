import { LogoUpload } from "@/app/_components/LogoUpload";
import { SignatureModal } from "@/app/_components/SignatureModal";
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

  const formatCurrency = (amount: number) => {
    const symbol = values.selectedCurrency?.symbol || "$";
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Logo & Signature</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm text-gray-500">Company Logo</h4>
            <div className="flex justify-start">
              <LogoUpload />
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm text-gray-500">Signature</h4>
            <div className="flex justify-start">
              <SignatureModal />
            </div>
          </div>
        </div>
      </div>

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
            <span className="font-medium">Issue Date:</span> {values.issueDate}
          </p>
          <p>
            <span className="font-medium">Due Date:</span> {values.dueDate}
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
                {item.quantity} x {formatCurrency(item.price)} ={" "}
                {formatCurrency(item.quantity * item.price)}
              </p>
            </div>
          ))}
          <div className="mt-4 border-t pt-4">
            <p className="text-right font-medium">
              Total: {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Payment Details</h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {values.paymentMethod}
          </p>
          {values.paymentNotes && (
            <p>
              <span className="font-medium">Payment Notes:</span>{" "}
              <span className="whitespace-pre-wrap">{values.paymentNotes}</span>
            </p>
          )}
          {values.paymentMethod === "Bank Transfer" && values.bankDetails && (
            <>
              <p>
                <span className="font-medium">Bank Name:</span>{" "}
                {values.bankDetails.bankName}
              </p>
              <p>
                <span className="font-medium">Account Number:</span>{" "}
                {values.bankDetails.accountNumber}
              </p>
              <p>
                <span className="font-medium">Account Holder:</span>{" "}
                {values.bankDetails.accountHolder}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
