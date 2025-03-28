"use client";

import { useState } from "react";

import { generateInvoiceData } from "@/actions/ai.actions";
import { useInvoice } from "@/context/InvoiceContext";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function GenWithAI() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setInvoiceData } = useInvoice();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Generating invoice data...");

    try {
      const result = await generateInvoiceData(prompt);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate invoice data");
      }

      setInvoiceData(result.data);
      toast.success("Invoice data generated successfully!");
      setOpen(false);
      setPrompt("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate invoice data",
      );
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-white">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Invoice Data</DialogTitle>
          <DialogDescription>
            Describe the invoice details you want to generate. Be as specific as
            possible with company details, services, rates, and any special
            requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <Textarea
            placeholder="Your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <p
            className="text-muted-foreground hover:text-primary cursor-pointer px-0 text-right text-xs underline"
            onClick={() =>
              setPrompt(
                "Bill John Doe, with the email john.doe@example.com, +1 234 567 890, 123 Main St, New York, NY 10001, USA this to the TO information. Invoice num INV-98373, issued on March 24, 2025, and due on March 31, 2025. The currency is USD, and payment will via Bank Transfer. The services provided: Website Design ($500), Website Development ($2,000), and Hosting & Deployment ($300), Apply a 10% discount and a 5% tax. The bank details for payment are: Bank Name - First National Bank, Account Number - 123456789, Account Holder - ZapInvoice Thank him for the business",
              )
            }
          >
            Use demo prompt
          </p>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="gap-2 text-white"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
