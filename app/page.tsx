"use client";

import React from "react";

import { InvoiceForm } from "@/app/_components/InvoiceForm";
import LiveView from "@/app/_components/LiveView";

export default function InvoicePage() {
  return (
    <section className="layout grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
      <InvoiceForm />
      <LiveView />
    </section>
  );
}
