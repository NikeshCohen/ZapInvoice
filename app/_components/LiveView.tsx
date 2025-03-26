import { useInvoice } from "@/app/_context/InvoiceContext";
import { useLogo } from "@/app/_context/LogoContext";
import { useSignature } from "@/app/_context/SignatureContext";
import { format } from "date-fns";

import { Currency } from "@/components/ui/select-currency";

export default function LiveView() {
  const { invoiceData } = useInvoice();
  const { signatureData } = useSignature();
  const { logoData } = useLogo();

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
  };

  const calculateDiscount = (subtotal: number) => {
    if (!invoiceData.discount.enabled || invoiceData.discount.value === 0) {
      return 0;
    }
    return invoiceData.discount.type === "percentage"
      ? (subtotal * invoiceData.discount.value) / 100
      : invoiceData.discount.value;
  };

  const calculateTax = (amountAfterDiscount: number) => {
    if (!invoiceData.tax.enabled || invoiceData.tax.value === 0) {
      return 0;
    }
    return invoiceData.tax.type === "percentage"
      ? (amountAfterDiscount * invoiceData.tax.value) / 100
      : invoiceData.tax.value;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const amountAfterDiscount = subtotal - discount;
    const tax = calculateTax(amountAfterDiscount);
    return amountAfterDiscount + tax;
  };

  const formatCurrency = (amount: number) => {
    const currency = invoiceData.selectedCurrency as Currency | undefined;
    return `${currency?.symbol || "$"}${amount.toFixed(2)}`;
  };

  const formatPrice = (amount: number) => {
    const currency = invoiceData.selectedCurrency as Currency | undefined;
    return `${currency?.symbol || "$"}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 text-neutral-900 shadow-lg">
      <div className="flex items-center justify-between text-right">
        {logoData ? (
          <div className="flex justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoData}
              alt="Company Logo"
              className="h-[60px] w-auto object-contain"
            />
          </div>
        ) : (
          <p className="text-lg font-bold">{invoiceData.from.name}</p>
        )}

        <div>
          <p className="text-lg font-bold">
            Invoice {invoiceData.invoiceNumber}
          </p>
          <div className="text-sm text-neutral-600">
            <p>{invoiceData.from.address}</p>
            <p>
              {invoiceData.from.city}, {invoiceData.from.zipCode}
            </p>
            <p>{invoiceData.from.country}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-left text-sm">
          <p className="font-bold">Bill To:</p>

          <div>
            <p>{invoiceData.to.name}</p>
            <p>{invoiceData.to.address}</p>
            <p>
              {invoiceData.to.city}, {invoiceData.to.zipCode}
            </p>
            <p>{invoiceData.to.country}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p>
            <span className="font-bold">Invoice Date:</span>{" "}
            {invoiceData.issueDate
              ? format(new Date(invoiceData.issueDate), "MMMM dd, yyyy")
              : "-"}
          </p>
          <p>
            <span className="font-bold">Due Date:</span>{" "}
            {invoiceData.dueDate
              ? format(new Date(invoiceData.dueDate), "MMMM dd, yyyy")
              : "-"}
          </p>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <div className="w-full min-w-full divide-y divide-gray-200">
            <div className="flex font-normal">
              <div className="w-[40%] px-4 py-2 text-left font-normal">
                Description
              </div>
              <div className="w-[20%] px-4 py-2 text-right font-normal">
                Quantity
              </div>
              <div className="w-[20%] px-4 py-2 text-right font-normal">
                Price
              </div>
              <div className="w-[20%] px-4 py-2 text-right font-normal">
                Subtotal
              </div>
            </div>
            <div className="divide-y divide-gray-200 text-sm">
              {invoiceData.items.length > 0 ? (
                invoiceData.items.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="w-[40%] px-4 py-2 break-words">
                      {item.description || "No description"}
                    </div>
                    <div className="w-[20%] px-4 py-2 text-right whitespace-nowrap">
                      {item.quantity}
                    </div>
                    <div className="w-[20%] px-4 py-2 text-right whitespace-nowrap">
                      {formatPrice(item.price)}
                    </div>
                    <div className="w-[20%] px-4 py-2 text-right whitespace-nowrap">
                      {formatPrice(item.quantity * item.price)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex">
                  <div className="w-full px-4 py-2 text-center text-gray-500">
                    No items added
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 text-sm">
              <div className="flex">
                <div className="w-[80%] px-4 pt-2 pb-2 text-right font-normal whitespace-nowrap">
                  Subtotal:
                </div>
                <div className="w-[20%] px-4 pt-2 pb-2 text-right font-normal whitespace-nowrap">
                  {formatPrice(calculateSubtotal())}
                </div>
              </div>
              <div className="pb-2">
                {invoiceData.discount.enabled &&
                  invoiceData.discount.value > 0 && (
                    <div className="flex">
                      <div className="w-[80%] px-4 text-right font-normal whitespace-nowrap text-red-600">
                        Discount{" "}
                        {invoiceData.discount.type === "percentage"
                          ? `(${invoiceData.discount.value}%)`
                          : ""}
                        :
                      </div>
                      <div className="w-[20%] px-4 text-right font-normal whitespace-nowrap text-red-600">
                        -{formatPrice(calculateDiscount(calculateSubtotal()))}
                      </div>
                    </div>
                  )}
                {invoiceData.tax.enabled && invoiceData.tax.value > 0 && (
                  <div className="flex">
                    <div className="w-[80%] px-4 text-right font-normal whitespace-nowrap">
                      Tax{" "}
                      {invoiceData.tax.type === "percentage"
                        ? `(${invoiceData.tax.value}%)`
                        : ""}
                      :
                    </div>
                    <div className="w-[20%] px-4 text-right font-normal whitespace-nowrap">
                      {formatPrice(
                        calculateTax(
                          calculateSubtotal() -
                            calculateDiscount(calculateSubtotal()),
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex border-t border-gray-200">
                <div className="w-[80%] px-4 py-2 text-right font-bold whitespace-nowrap">
                  Total:
                </div>
                <div className="w-[20%] px-4 py-2 text-right font-bold whitespace-nowrap">
                  {formatPrice(calculateTotal())}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {/* Bank Details Section */}
        {invoiceData.paymentMethod === "Bank Transfer" && (
          <div className="w-[50%] space-y-2 text-left">
            <h3 className="text-lg font-medium">Bank Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex flex-wrap gap-x-2">
                <span className="font-medium">Bank Name:</span>
                <span className="break-all">
                  {invoiceData.bankDetails?.bankName || "—"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <span className="font-medium">Account Number:</span>
                <span className="break-all">
                  {invoiceData.bankDetails?.accountNumber || "—"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <span className="font-medium">Account Holder:</span>
                <span className="break-all">
                  {invoiceData.bankDetails?.accountHolder || "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method and Notes Section */}
        <div className="w-[50%] text-right">
          <div className="flex flex-wrap justify-end gap-x-2">
            <span className="font-medium">Payment Method:</span>
            <span className="break-all">{invoiceData.paymentMethod}</span>
          </div>

          {invoiceData.paymentNotes && (
            <div className="flex flex-wrap justify-end gap-x-2 text-sm">
              <span className="font-medium">Payment Notes:</span>
              <span className="break-all whitespace-pre-wrap">
                {invoiceData.paymentNotes}
              </span>
            </div>
          )}
        </div>
        <div />
      </div>

      <div className="mt-4">
        <h3 className="text-md font-medium">Contact Information</h3>
        <p className="max-w-3/4 pb-2 text-sm">
          If you have any questions concerning this invoice, use the following
          contact information:
        </p>
        <div className="text-sm">
          <p>{invoiceData.from.name}</p>
          <p>{invoiceData.from.email}</p>
          <p>{invoiceData.from.phone}</p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="border-t pt-8">
        <div className="flex flex-col items-end">
          <div className="w-[200px]">
            {signatureData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signatureData}
                alt="Signature"
                className="h-[100px] w-full object-contain"
              />
            ) : (
              <div className="h-[100px] border-b border-dashed" />
            )}
            <div className="mt-2 text-center text-sm text-gray-500">
              Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
