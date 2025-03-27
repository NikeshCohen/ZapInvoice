"use client";

import { ChangeEvent, useRef } from "react";

import { useLogo } from "@/context/LogoContext";
import { Image as ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LogoUpload() {
  const { logoData, setLogoData, clearLogo } = useLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setLogoData(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    clearLogo();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {logoData ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoData}
            alt="Company Logo"
            className="h-[100px] w-auto object-contain"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="bg-background absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleClearClick}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-[100px] w-[200px]"
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-6 w-6 text-neutral-500" />
            <span className="text-sm text-neutral-500">Upload Logo</span>
          </div>
        </Button>
      )}
    </div>
  );
}
