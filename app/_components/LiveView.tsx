import { useInvoice } from "@/app/_context/InvoiceContext";

import { Currency } from "@/components/ui/select-currency";

export default function LiveView() {
  const { invoiceData } = useInvoice();

  const calculateTotal = () => {
    return invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
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
      <h3 className="font-medium text-lg">{title}</h3>
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
    <div className="bg-white shadow-lg p-6 rounded-lg text-neutral-900">
      <div className="space-y-6">
        <div className="flex sm:flex-row flex-col sm:justify-between gap-6">
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
            <h3 className="mb-2 font-medium text-lg">Items</h3>
            <div className="overflow-x-auto">
              <table className="divide-y divide-gray-200 w-full min-w-full table-fixed">
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-[40%] text-left">Description</th>
                    <th className="px-4 py-2 w-[20%] text-right">Quantity</th>
                    <th className="px-4 py-2 w-[20%] text-right">Price</th>
                    <th className="px-4 py-2 w-[20%] text-right">Subtotal</th>
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
                        className="px-4 py-2 text-gray-500 text-center"
                      >
                        No items added
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 font-medium text-right whitespace-nowrap"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-2 font-medium text-right whitespace-nowrap">
                      {formatCurrency(calculateTotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Payment Terms:</span>
            <span className="break-all">{invoiceData.paymentTerms} days</span>
          </div>

          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium">Payment Method:</span>
            <span className="break-all">{invoiceData.paymentMethod}</span>
          </div>

          {invoiceData.paymentMethod === "Bank Transfer" && (
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Bank Details</h3>
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
        </div>
      </div>
    </div>
  );
}
