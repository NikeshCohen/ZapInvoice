import { type InvoiceData } from "@/types/schema";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

export async function generatePDF(
  invoiceData: InvoiceData,
  logoData?: string | null,
  signatureData?: string | null,
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper functions from LiveView
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

  const formatPDFPrice = (amount: number) => {
    const currency = invoiceData.selectedCurrency;
    const formattedNumber = amount.toLocaleString();

    // Handle special currency symbols/codes
    if (!currency?.symbol || currency.symbol.length > 1) {
      return `${formattedNumber} ${currency?.code || "$"}`;
    }
    return `${currency.symbol}${formattedNumber}`;
  };

  // Set font
  pdf.setFont("helvetica");

  // Header section
  let currentY = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const pageWidth = rightMargin - leftMargin;

  // Company name/logo on the left
  if (logoData) {
    const img = new Image();
    img.src = logoData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    pdf.addImage(img, "PNG", leftMargin, currentY - 5, 40, 20);
  } else {
    pdf.setFontSize(14);
    pdf.text(invoiceData.from.name, leftMargin, currentY);
  }

  // Invoice title and company details on the right
  pdf.setFontSize(14);
  pdf.text("Invoice " + invoiceData.invoiceNumber, rightMargin, currentY, {
    align: "right",
  });
  currentY += 8;

  // Company details (email, etc.)
  pdf.setFontSize(10);
  const fromDetails = [
    invoiceData.from.email,
    invoiceData.from.address,
    `${invoiceData.from.city}, ${invoiceData.from.zipCode}`,
    invoiceData.from.country,
  ];
  pdf.text(fromDetails, rightMargin, currentY, { align: "right" });

  // Reset currentY for the next section
  currentY += 30;

  // Bill To and Dates section
  pdf.setFontSize(12);
  pdf.text("Bill To:", leftMargin, currentY);

  // Dates aligned to the right
  pdf.setFontSize(10);
  const dates = [
    `Invoice Date: ${format(new Date(invoiceData.issueDate), "MMMM dd, yyyy")}`,
    `Due Date: ${format(new Date(invoiceData.dueDate), "MMMM dd, yyyy")}`,
  ];
  pdf.text(dates, rightMargin, currentY, { align: "right" });

  // Bill To details
  currentY += 5;
  pdf.setFontSize(10);
  pdf.text(
    [
      invoiceData.to.name,
      invoiceData.to.address,
      `${invoiceData.to.city}, ${invoiceData.to.zipCode}`,
      invoiceData.to.country,
    ],
    leftMargin,
    currentY,
  );

  currentY += 30;

  // Items table header
  const tableColumns = {
    description: { x: leftMargin, width: pageWidth * 0.4 },
    quantity: { x: leftMargin + pageWidth * 0.5, width: pageWidth * 0.15 },
    price: { x: leftMargin + pageWidth * 0.65, width: pageWidth * 0.15 },
    subtotal: { x: rightMargin, width: pageWidth * 0.15 },
  };

  pdf.setFontSize(10);
  pdf.text("Description", tableColumns.description.x, currentY);
  pdf.text("Quantity", tableColumns.quantity.x, currentY, { align: "right" });
  pdf.text("Price", tableColumns.price.x, currentY, { align: "right" });
  pdf.text("Subtotal", tableColumns.subtotal.x, currentY, { align: "right" });

  currentY += 5;
  pdf.line(leftMargin, currentY, rightMargin, currentY);
  currentY += 5;

  // Items
  invoiceData.items.forEach((item) => {
    pdf.text(item.description, tableColumns.description.x, currentY);
    pdf.text(item.quantity.toString(), tableColumns.quantity.x, currentY, {
      align: "right",
    });
    pdf.text(formatPDFPrice(item.price), tableColumns.price.x, currentY, {
      align: "right",
      maxWidth: tableColumns.price.width,
    });
    pdf.text(
      formatPDFPrice(item.quantity * item.price),
      tableColumns.subtotal.x,
      currentY,
      { align: "right", maxWidth: tableColumns.subtotal.width },
    );
    currentY += 10;
  });

  // Totals section
  currentY += 5;
  pdf.line(leftMargin, currentY, rightMargin, currentY);
  currentY += 5;

  // Subtotal
  pdf.text("Subtotal:", tableColumns.price.x, currentY, { align: "right" });
  pdf.text(formatPDFPrice(calculateSubtotal()), rightMargin, currentY, {
    align: "right",
    maxWidth: tableColumns.subtotal.width,
  });

  // Discount if enabled
  if (invoiceData.discount.enabled && invoiceData.discount.value > 0) {
    currentY += 5;
    const discountText = `Discount (${invoiceData.discount.value}%):`;
    pdf.text(discountText, tableColumns.price.x, currentY, { align: "right" });
    pdf.text(
      `-${formatPDFPrice(calculateDiscount(calculateSubtotal()))}`,
      rightMargin,
      currentY,
      { align: "right", maxWidth: tableColumns.subtotal.width },
    );
  }

  // Tax if enabled
  if (invoiceData.tax.enabled && invoiceData.tax.value > 0) {
    currentY += 5;
    const taxText = `Tax (${invoiceData.tax.value}%):`;
    pdf.text(taxText, tableColumns.price.x, currentY, { align: "right" });
    pdf.text(
      formatPDFPrice(
        calculateTax(
          calculateSubtotal() - calculateDiscount(calculateSubtotal()),
        ),
      ),
      rightMargin,
      currentY,
      { align: "right", maxWidth: tableColumns.subtotal.width },
    );
  }

  // Total
  currentY += 10;
  pdf.setFont("helvetica", "bold");
  pdf.text("Total:", tableColumns.price.x, currentY, { align: "right" });
  pdf.text(formatPDFPrice(calculateTotal()), rightMargin, currentY, {
    align: "right",
    maxWidth: tableColumns.subtotal.width,
  });
  pdf.setFont("helvetica", "normal");

  currentY += 20;

  // Payment and Bank Details
  if (
    invoiceData.paymentMethod === "Bank Transfer" &&
    invoiceData.bankDetails
  ) {
    pdf.setFontSize(12);
    pdf.text("Bank Details", leftMargin, currentY);
    currentY += 5;
    pdf.setFontSize(10);
    pdf.text(
      [
        `Bank Name: ${invoiceData.bankDetails.bankName}`,
        `Account Number: ${invoiceData.bankDetails.accountNumber}`,
        `Account Holder: ${invoiceData.bankDetails.accountHolder}`,
      ],
      leftMargin,
      currentY,
    );
  }

  // Payment Method and Notes
  pdf.text(
    `Payment Method: ${invoiceData.paymentMethod}`,
    rightMargin,
    currentY,
    { align: "right" },
  );
  currentY += 5;
  if (invoiceData.paymentNotes) {
    pdf.text(`Notes: ${invoiceData.paymentNotes}`, rightMargin, currentY, {
      align: "right",
    });
  }

  currentY += 20;

  // Contact Information
  pdf.setFontSize(12);
  pdf.text("Contact Information", leftMargin, currentY);
  currentY += 5;
  pdf.setFontSize(10);
  pdf.text(
    "If you have any questions concerning this invoice, use the following contact information:",
    leftMargin,
    currentY,
  );
  currentY += 10;
  pdf.text(
    [invoiceData.from.name, invoiceData.from.email, invoiceData.from.phone],
    leftMargin,
    currentY,
  );

  // Signature if exists
  if (signatureData) {
    currentY += 20;
    const img = new Image();
    img.src = signatureData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    pdf.addImage(img, "PNG", rightMargin - 50, currentY, 50, 25);
    currentY += 30;
    pdf.setFontSize(10);
    pdf.text("Signature", rightMargin - 25, currentY, { align: "center" });
  }

  // Save the PDF
  pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
}
