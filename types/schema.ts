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

const bankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountHolder: z.string().min(1, "Account holder name is required"),
});

const adjustmentSchema = z.object({
  enabled: z.boolean().default(false),
  type: z.enum(["percentage", "fixed"]).default("percentage"),
  value: z.number().min(0).default(0),
});

export const invoiceSchema = z
  .object({
    from: contactInfoSchema,
    to: contactInfoSchema,
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    paymentMethod: z.enum(["Bank Transfer", "Cash", "Check"]),
    bankDetails: bankDetailsSchema.optional(),
    currency: z.string().min(1, "Currency is required"),
    selectedCurrency: z
      .object({
        code: z.string(),
        decimals: z.number(),
        name: z.string(),
        number: z.string(),
        symbol: z.string().optional(),
      })
      .optional(),
    paymentNotes: z.string().optional(),
    discount: adjustmentSchema.default({
      enabled: false,
      type: "percentage",
      value: 0,
    }),
    tax: adjustmentSchema.default({
      enabled: false,
      type: "percentage",
      value: 0,
    }),
  })
  .refine(
    (data) => {
      if (!data.issueDate || !data.dueDate) return true;
      return new Date(data.dueDate) >= new Date(data.issueDate);
    },
    {
      message: "Due date can not be before issue date",
      path: ["dueDate"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod !== "Bank Transfer") return true;
      return (
        !!data.bankDetails?.bankName &&
        !!data.bankDetails?.accountNumber &&
        !!data.bankDetails?.accountHolder
      );
    },
    {
      message: "Bank details are required for bank transfer",
      path: ["bankDetails"],
    },
  );

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type InvoiceFormFields =
  | NestedKeyOf<InvoiceData>
  | `${NestedKeyOf<InvoiceData> & string}.${string}`;
