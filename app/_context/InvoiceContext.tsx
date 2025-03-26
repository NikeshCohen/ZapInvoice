"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import { InvoiceData } from "@/types/schema";

interface InvoiceContextType {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
  clearInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);
const initialInvoiceData: InvoiceData = {
  from: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  },
  to: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  },

  invoiceNumber: "",
  issueDate: "",
  dueDate: "",
  items: [],
  paymentMethod: "Bank Transfer",
  bankDetails: {
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  },
  currency: "USD",
  selectedCurrency: undefined,
  paymentNotes: "",
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
