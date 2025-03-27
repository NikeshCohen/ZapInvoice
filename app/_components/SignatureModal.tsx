"use client";

import { useState } from "react";

import { useSignature } from "@/context/SignatureContext";
import { FileSignature } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SignatureModal() {
  const { signatureData, signatureRef, clearSignature, handleCanvasEnd } =
    useSignature();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {signatureData ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signatureData}
              alt="Signature"
              className="h-[100px] w-full rounded-md border bg-white"
            />
          ) : (
            <div className="flex h-[100px] w-full min-w-[200px] flex-col items-center justify-center rounded-md border bg-gray-50 hover:bg-gray-100">
              <FileSignature className="mb-2 h-6 w-6 text-neutral-500" />
              <span className="text-sm text-neutral-500">
                Click to add signature
              </span>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Your Signature</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="h-[200px] w-full rounded-md border bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "border rounded-md w-full touch-none",
                width: 400,
                height: 200,
              }}
              dotSize={2}
              minWidth={2}
              maxWidth={3}
              throttle={16}
              velocityFilterWeight={0.7}
              onEnd={handleCanvasEnd}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearSignature}>
              Clear
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
