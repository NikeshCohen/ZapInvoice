import { DetailsTab } from "@/app/_components/invoice-tabs/DetailsTab";
import { FromToTab } from "@/app/_components/invoice-tabs/FromToTab";
import { ItemsTab } from "@/app/_components/invoice-tabs/ItemsTab";
import { PaymentTab } from "@/app/_components/invoice-tabs/PaymentTab";
import { SummaryTab } from "@/app/_components/invoice-tabs/SummaryTab";

export const TABS = [
  {
    id: "from-to",
    label: "From/To",
    fields: ["fromName", "customerName"] as const,
    component: FromToTab,
  },
  {
    id: "details",
    label: "Details",
    fields: ["invoiceNumber", "date"] as const,
    component: DetailsTab,
  },
  {
    id: "items",
    label: "Items",
    fields: ["items"] as const,
    component: ItemsTab,
  },
  {
    id: "payment",
    label: "Payment",
    fields: ["paymentTerms", "paymentMethod"] as const,
    component: PaymentTab,
  },
  {
    id: "summary",
    label: "Summary",
    fields: [] as const,
    component: SummaryTab,
  },
];
