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
  fromName: "", // Added missing property
  customerName: "",
  invoiceNumber: "",
  date: "",
  items: [],
  paymentTerms: 0,
  paymentMethod: "",
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
