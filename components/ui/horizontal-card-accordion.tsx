// components/horizontal-card-accordion.tsx
"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// 1. Define the props interface
interface HorizontalCardAccordionProps {
  children: React.ReactNode;
    title?: string;
}

// 2. Explicitly type the props
export function HorizontalCardAccordion({ children }: HorizontalCardAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion
      type="single"
      collapsible
      orientation="horizontal"
      className="flex"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => setIsOpen(value === "item-1")}
    >
      <AccordionItem
        value="item-1"
        className={cn(
          "flex border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "w-[400px]" : "w-10"
        )}
      >
        <AccordionTrigger
          className={cn(
            "flex items-center justify-center p-2 h-full bg-slate-100/50",
            "whitespace-nowrap flex-col"
          )}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </AccordionTrigger>
        <AccordionContent className="p-0 overflow-hidden">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
