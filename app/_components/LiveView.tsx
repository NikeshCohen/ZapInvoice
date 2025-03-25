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
      <h2 className="mb-6 text-2xl font-bold">Invoice Preview</h2>

      <div className="space-y-4">
        <div>
          <span className="font-medium">Customer Name:</span>
          <span className="ml-2">{invoiceData.customerName}</span>
        </div>

        <div>
          <span className="font-medium">Invoice Number:</span>
          <span className="ml-2">{invoiceData.invoiceNumber}</span>
        </div>

        <div>
          <span className="font-medium">Date:</span>
          <span className="ml-2">{invoiceData.date}</span>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Items</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Quantity</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {item.description || "No description"}
                  </td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right font-medium">
                  Total:
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  ${calculateTotal().toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
