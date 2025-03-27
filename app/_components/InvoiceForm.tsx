import { useEffect, useState } from "react";

import { TABS } from "@/constants/tabs";
import { useInvoice } from "@/context/InvoiceContext";
import { useLogo } from "@/context/LogoContext";
import { useSignature } from "@/context/SignatureContext";
import { type InvoiceData, invoiceSchema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { generatePDF } from "@/lib/generate";
import { cn } from "@/lib/utils";

const defaultValues: InvoiceData = {
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
  items: [{ description: "", quantity: 1, price: 0 }],
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
    type: "percentage",
    value: 0,
  },
  tax: {
    enabled: false,
    type: "percentage",
    value: 0,
  },
};

export function InvoiceForm() {
  const { setInvoiceData } = useInvoice();
  const { logoData } = useLogo();
  const { signatureData } = useSignature();
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("from-to");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setInvoiceData(value as InvoiceData);
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, setInvoiceData]);

  const onSubmit = async (data: InvoiceData) => {
    setInvoiceData(data);
    try {
      // Generate PDF after successful submission
      await generatePDF(data, logoData, signatureData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Optionally add error handling UI here
    }
  };

  const isTabValid = (tabId: (typeof TABS)[number]["id"]) => {
    const tab = TABS.find((t) => t.id === tabId);
    if (!tab || tab.fields.length === 0) return true;

    const { errors } = form.formState;
    return !tab.fields.some((field) => {
      if (field === "items") {
        // Special handling for items array
        const itemErrors = errors.items;
        return itemErrors && Object.keys(itemErrors).length > 0;
      }

      // Handle nested fields (from.* and to.*)
      if (field.includes(".")) {
        const [parent, child] = field.split(".") as [
          keyof typeof errors,
          string,
        ];
        return errors[parent]?.[child as keyof (typeof errors)[typeof parent]];
      }

      // Handle top-level fields
      return errors[field as keyof typeof errors];
    });
  };

  const currentTabIndex = TABS.findIndex((tab) => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === TABS.length - 1;

  const handleNext = () => {
    if (isTabValid(activeTab) && !isLastTab) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (!isFirstTab) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as (typeof TABS)[number]["id"]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const isValid = await form.trigger();
    if (!isValid) {
      const firstErrorTab = TABS.find((tab) => !isTabValid(tab.id));
      if (firstErrorTab) {
        setActiveTab(firstErrorTab.id);
      }
      return;
    }

    await form.handleSubmit(onSubmit)(e);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="bg-background/40 relative flex min-h-[600px] flex-col rounded-2xl p-4"
      >
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    hasSubmitted && !isTabValid(tab.id) && "text-red-600",
                  )}
                >
                  {tab.label}
                  {hasSubmitted && !isTabValid(tab.id) && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <tab.component form={form} />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-8 flex justify-between border-t pt-4">
          {!isFirstTab ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isFirstTab}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {isLastTab ? (
            <Button type="submit">Save Invoice</Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
