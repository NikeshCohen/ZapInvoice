import * as z from "zod";

const contactInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  // From/To details
  from: contactInfoSchema,
  to: contactInfoSchema,

  // Invoice details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),

  // Items
  items: z.array(invoiceItemSchema),

  // Payment details
  paymentTerms: z.number().min(0, "Payment terms must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type InvoiceFormFields = NestedKeyOf<InvoiceData>;
