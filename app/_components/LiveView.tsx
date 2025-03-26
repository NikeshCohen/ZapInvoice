import { useInvoice } from "@/app/_context/InvoiceContext";
import { useLogo } from "@/app/_context/LogoContext";
import { useSignature } from "@/app/_context/SignatureContext";

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

  const ContactInfo = ({
    title,
    data,
  }: {
    title: string;
    data: typeof invoiceData.from;
  }) => (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-1 text-sm">
        <div>{data.name || "—"}</div>
        <div>{data.email || "—"}</div>
        <div>{data.phone || "—"}</div>
        <div>{data.address || "—"}</div>
        <div>{data.city || "—"}</div>
        <div>{data.zipCode || "—"}</div>
        <div>{data.country || "—"}</div>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg bg-white p-6 text-neutral-900 shadow-lg">
      <div className="space-y-6">
        {/* Logo Section */}
        {logoData && (
          <div className="flex justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoData}
              alt="Company Logo"
              className="h-[60px] w-auto object-contain"
            />
          </div>
        )}

        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <ContactInfo title="From" data={invoiceData.from} />
          <ContactInfo title="To" data={invoiceData.to} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Invoice Number:</span>
            <span className="break-all">
              {invoiceData.invoiceNumber || "—"}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Issue Date:</span>
            <span className="break-all">{invoiceData.issueDate || "—"}</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Due Date:</span>
            <span className="break-all">{invoiceData.dueDate || "—"}</span>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-fixed divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="w-[40%] px-4 py-2 text-left">Description</th>
                    <th className="w-[20%] px-4 py-2 text-right">Quantity</th>
                    <th className="w-[20%] px-4 py-2 text-right">Price</th>
                    <th className="w-[20%] px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceData.items.length > 0 ? (
                    invoiceData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <div className="break-words">
                            {item.description || "No description"}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No items added
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t border-gray-200">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-right font-medium whitespace-nowrap"
                    >
                      Subtotal:
                    </td>
                    <td className="px-4 py-2 text-right font-medium whitespace-nowrap">
                      {formatCurrency(calculateSubtotal())}
                    </td>
                  </tr>
                  {invoiceData.discount.enabled &&
                    invoiceData.discount.value > 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-2 text-right font-medium whitespace-nowrap text-red-600"
                        >
                          Discount{" "}
                          {invoiceData.discount.type === "percentage"
                            ? `(${invoiceData.discount.value}%)`
                            : ""}
                          :
                        </td>
                        <td className="px-4 py-2 text-right font-medium whitespace-nowrap text-red-600">
                          -
                          {formatCurrency(
                            calculateDiscount(calculateSubtotal()),
                          )}
                        </td>
                      </tr>
                    )}
                  {invoiceData.tax.enabled && invoiceData.tax.value > 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right font-medium whitespace-nowrap"
                      >
                        Tax{" "}
                        {invoiceData.tax.type === "percentage"
                          ? `(${invoiceData.tax.value}%)`
                          : ""}
                        :
                      </td>
                      <td className="px-4 py-2 text-right font-medium whitespace-nowrap">
                        {formatCurrency(
                          calculateTax(
                            calculateSubtotal() -
                              calculateDiscount(calculateSubtotal()),
                          ),
                        )}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-200">
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-right font-medium whitespace-nowrap"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-2 text-right font-medium whitespace-nowrap">
                      {formatCurrency(calculateTotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Payment Method:</span>
            <span className="break-all">{invoiceData.paymentMethod}</span>
          </div>

          {invoiceData.paymentNotes && (
            <div className="flex flex-wrap gap-x-2">
              <span className="font-medium">Payment Notes:</span>
              <span className="break-all whitespace-pre-wrap">
                {invoiceData.paymentNotes}
              </span>
            </div>
          )}

          {invoiceData.paymentMethod === "Bank Transfer" && (
            <div className="space-y-2">
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

          {/* Signature Section */}
          <div className="mt-8 border-t pt-8">
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
      </div>
    </div>
  );
}
