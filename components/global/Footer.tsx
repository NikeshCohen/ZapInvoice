"use client";

import Link from "next/link";

import { Github } from "lucide-react";

import Logo from "@/components/global/Logo";
import ThemeToggle from "@/components/global/ThemeToggle";

function Footer() {
  return (
    <footer className="mr-auto ml-auto flex max-w-[1600px] flex-col items-center justify-center space-y-4 border-t p-4 lg:flex-row lg:justify-between lg:space-y-0">
      <div className="flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="https://github.com/NikeshCohen/ZapInvoice"
          target="_blank"
          className="bg-input/50 hover:text-primary hover flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        >
          <Github className="h-4 w-4" />
          <span className="sr-only">Github Repo</span>
        </Link>

        <ThemeToggle />
      </div>
    </footer>
  );
}

export default Footer;
