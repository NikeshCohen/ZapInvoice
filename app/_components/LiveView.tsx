import { useInvoice } from "@/app/_context/InvoiceContext";

export default function LiveView() {
  const { invoiceData } = useInvoice();

  const calculateTotal = () => {
    return invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
  };

  return (
    <div className="rounded-lg bg-white p-6 text-neutral-900 shadow-lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-x-2">
          <span className="font-medium">Customer Name:</span>
          <span className="break-all">{invoiceData.customerName}</span>
        </div>

        <div className="flex flex-wrap gap-x-2">
          <span className="font-medium">Invoice Number:</span>
          <span className="break-all">{invoiceData.invoiceNumber}</span>
        </div>

        <div className="flex flex-wrap gap-x-2">
          <span className="font-medium">Date:</span>
          <span className="break-all">{invoiceData.date}</span>
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
                {invoiceData.items.map((item, index) => (
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
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-right font-medium whitespace-nowrap"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-2 text-right font-medium whitespace-nowrap">
                    ${calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
