import { DetailsTab } from "@/app/_components/invoice-tabs/DetailsTab";
import { FromToTab } from "@/app/_components/invoice-tabs/FromToTab";
import { ItemsTab } from "@/app/_components/invoice-tabs/ItemsTab";
import { SummaryTab } from "@/app/_components/invoice-tabs/SummaryTab";
import type { InvoiceFormFields } from "@/types/schema";

export const TABS = [
  {
    id: "from-to",
    label: "From/To",
    fields: [
      "from.name",
      "from.email",
      "from.phone",
      "from.address",
      "from.city",
      "from.zipCode",
      "from.country",
      "to.name",
      "to.email",
      "to.phone",
      "to.address",
      "to.city",
      "to.zipCode",
      "to.country",
    ] as InvoiceFormFields[],
    component: FromToTab,
  },
  {
    id: "details",
    label: "Details",
    fields: [
      "invoiceNumber",
      "issueDate",
      "dueDate",
      "paymentTerms",
      "paymentMethod",
    ] as InvoiceFormFields[],
    component: DetailsTab,
  },
  {
    id: "items",
    label: "Items",
    fields: ["items"] as InvoiceFormFields[],
    component: ItemsTab,
  },
  {
    id: "summary",
    label: "Summary",
    fields: [] as InvoiceFormFields[],
    component: SummaryTab,
  },
] as const;
