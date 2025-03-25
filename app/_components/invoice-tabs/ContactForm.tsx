import type { InvoiceData } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ContactFormProps {
  form: UseFormReturn<InvoiceData>;
  type: "from" | "to";
  title: string;
}

interface FieldConfig {
  name: keyof InvoiceData["from"];
  label: string;
  placeholder: string;
  type?: string;
}

export function ContactForm({ form, type, title }: ContactFormProps) {
  const fields: FieldConfig[] = [
    { name: "name", label: "Name", placeholder: "Enter name" },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "Enter phone number",
      type: "tel",
    },
    { name: "address", label: "Address", placeholder: "Enter address" },
    { name: "city", label: "City", placeholder: "Enter city" },
    {
      name: "zipCode",
      label: "ZIP/Postal Code",
      placeholder: "Enter ZIP/postal code",
    },
    { name: "country", label: "Country", placeholder: "Enter country" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={`${type}.${field.name}` as const}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    value={formField.value ?? ""}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
