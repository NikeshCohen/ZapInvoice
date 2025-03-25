import { ChangeEvent, useEffect } from "react";

import { useInvoice } from "@/app/_context/InvoiceContext";
import { InvoiceData, invoiceSchema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function InvoiceForm() {
  const { invoiceData, setInvoiceData } = useInvoice();

  const form = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceData,
    mode: "onSubmit",
  });

  // Update context whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setInvoiceData(value as InvoiceData);
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, setInvoiceData]);

  const onSubmit = (data: InvoiceData) => {
    // Handle final form submission here if needed
    console.log("Form submitted:", data);
  };

  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      { description: "", quantity: 1, price: 0 },
    ]);
  };

  return (
    <div className="bg-background/40 rounded-lg p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="mb-2 text-lg font-medium">Items</h3>
            {form.watch("items")?.map((item, index) => (
              <div key={index} className="mb-4 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
                          {...field}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <div className="mt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={addItem}>
                Add Item
              </Button>
              <Button type="submit">Save Invoice</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
