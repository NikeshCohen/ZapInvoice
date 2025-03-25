"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import { InvoiceData } from "@/types/schema";

// Define the context type
interface InvoiceContextType {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
  clearInvoice: () => void;
}

// Create the context
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Initial invoice data
const initialInvoiceData: InvoiceData = {
  customerName: "",
  invoiceNumber: "",
  date: "",
  items: [],
};

// Create the provider component
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

// Custom hook to use the invoice context
export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
}
