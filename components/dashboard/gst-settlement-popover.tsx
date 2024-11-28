"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface GSTSettlementPopoverProps {
  type: "igst" | "cgst" | "sgst";
  settlement: any;
}

export function GSTSettlementPopover({ type, settlement }: GSTSettlementPopoverProps) {
  const getSettlementContent = () => {
    switch (type) {
      case "igst":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm">Initial Payable:</span>
              <span className="text-sm font-medium">₹{settlement.igst.payable.toLocaleString()}</span>
            </div>
            {settlement.igst.settledWithIgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with IGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.igst.settledWithIgst.toLocaleString()}</span>
              </div>
            )}
            {settlement.igst.settledWithCgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with CGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.igst.settledWithCgst.toLocaleString()}</span>
              </div>
            )}
            {settlement.igst.settledWithSgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with SGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.igst.settledWithSgst.toLocaleString()}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 border-t pt-2">
              <span className="text-sm font-medium">Final Payable:</span>
              <span className="text-sm font-bold">₹{settlement.igst.finalPayable.toLocaleString()}</span>
            </div>
          </div>
        );
      case "cgst":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm">Initial Payable:</span>
              <span className="text-sm font-medium">₹{settlement.cgst.payable.toLocaleString()}</span>
            </div>
            {settlement.cgst.settledWithIgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with IGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.cgst.settledWithIgst.toLocaleString()}</span>
              </div>
            )}
            {settlement.cgst.settledWithCgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with CGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.cgst.settledWithCgst.toLocaleString()}</span>
              </div>
            )}
            {settlement.cgst.settledWithSgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with SGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.cgst.settledWithSgst.toLocaleString()}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 border-t pt-2">
              <span className="text-sm font-medium">Final Payable:</span>
              <span className="text-sm font-bold">₹{settlement.cgst.finalPayable.toLocaleString()}</span>
            </div>
          </div>
        );
      case "sgst":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm">Initial Payable:</span>
              <span className="text-sm font-medium">₹{settlement.sgst.payable.toLocaleString()}</span>
            </div>
            {settlement.sgst.settledWithIgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with IGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.sgst.settledWithIgst.toLocaleString()}</span>
              </div>
            )}
            {settlement.sgst.settledWithSgst > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Settled with SGST:</span>
                <span className="text-sm font-medium text-green-600">-₹{settlement.sgst.settledWithSgst.toLocaleString()}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 border-t pt-2">
              <span className="text-sm font-medium">Final Payable:</span>
              <span className="text-sm font-bold">₹{settlement.sgst.finalPayable.toLocaleString()}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{type.toUpperCase()} Settlement Details</h4>
          <div className="pt-2">
            {getSettlementContent()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}