"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import { InvoiceData } from "@/types/schema";

interface InvoiceContextType {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
  clearInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);
// const initialInvoiceData: InvoiceData = {
//   from: {
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     country: "",
//   },
//   to: {
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     country: "",
//   },

//   invoiceNumber: "",
//   issueDate: "",
//   dueDate: "",
//   items: [],
//   paymentMethod: "Bank Transfer",
//   bankDetails: {
//     bankName: "",
//     accountNumber: "",
//     accountHolder: "",
//   },
//   currency: "USD",
//   selectedCurrency: undefined,
//   paymentNotes: "",
//   discount: {
//     enabled: false,
//     type: "percentage" as const,
//     value: 0,
//   },
//   tax: {
//     enabled: false,
//     type: "percentage" as const,
//     value: 0,
//   },
// };

const initialInvoiceData: InvoiceData = {
  from: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    city: "Anytown",
    zipCode: "12345",
    country: "USA",
  },
  to: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    address: "456 Elm St",
    city: "Othertown",
    zipCode: "54321",
    country: "USA",
  },

  invoiceNumber: "INV-001",
  issueDate: "2023-10-01",
  dueDate: "2023-10-15",
  items: [
    {
      description: "Web Development Services",
      quantity: 1,
      price: 1500,
    },
    {
      description: "Hosting Services",
      quantity: 1,
      price: 200,
    },
  ],
  paymentMethod: "Bank Transfer",
  bankDetails: {
    bankName: "Sample Bank",
    accountNumber: "123456789",
    accountHolder: "John Doe",
  },
  currency: "USD",
  selectedCurrency: undefined,
  paymentNotes: "Thank you for your business!",
  discount: {
    enabled: false,
    type: "percentage" as const,
    value: 0,
  },
  tax: {
    enabled: false,
    type: "percentage" as const,
    value: 0,
  },
};

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoiceData, setInvoiceDataState] =
    useState<InvoiceData>(initialInvoiceData);

  const setInvoiceData = (data: InvoiceData) => {
    setInvoiceDataState(data);
  };

  const clearInvoice = () => {
    setInvoiceDataState(initialInvoiceData);
  };

  return (
    <InvoiceContext.Provider
      value={{ invoiceData, setInvoiceData, clearInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
}
