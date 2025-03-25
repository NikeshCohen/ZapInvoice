import * as z from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  // From/To details
  fromName: z.string().min(1, "Your name/business name is required"),
  customerName: z.string().min(1, "Customer name is required"),

  // Invoice details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),

  // Items
  items: z.array(invoiceItemSchema),

  // Payment details
  paymentTerms: z.number().min(0, "Payment terms must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
