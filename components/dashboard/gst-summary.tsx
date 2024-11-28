"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/types/gst";
import { calculateGSTBalance } from "@/lib/utils/gst-calculations";
import { calculateGSTSettlement } from "@/lib/utils/gst-settlement";
import { GSTSettlementPopover } from "./gst-settlement-popover";

interface GSTSummaryProps {
  transactions: Transaction[];
}

export function GSTSummary({ transactions }: GSTSummaryProps) {
  const gstBalance = calculateGSTBalance(transactions);
  const gstSettlement = calculateGSTSettlement(gstBalance);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Input Tax Credit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">IGST:</span>
              <span className="font-medium">₹{gstBalance.input.igst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">CGST:</span>
              <span className="font-medium">₹{gstBalance.input.cgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">SGST:</span>
              <span className="font-medium">₹{gstBalance.input.sgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Total Credit:</span>
              <span className="font-bold">₹{gstBalance.input.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Output Tax</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">IGST:</span>
              <span className="font-medium">₹{gstBalance.output.igst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">CGST:</span>
              <span className="font-medium">₹{gstBalance.output.cgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">SGST:</span>
              <span className="font-medium">₹{gstBalance.output.sgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Total Output:</span>
              <span className="font-bold">₹{gstBalance.output.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={gstSettlement.igst.finalPayable + gstSettlement.cgst.finalPayable + gstSettlement.sgst.finalPayable > 0 ? "bg-red-50" : "bg-green-50"}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Final GST Payable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">IGST:</span>
                <GSTSettlementPopover type="igst" settlement={gstSettlement} />
              </div>
              <span className="font-medium">₹{gstSettlement.igst.finalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">CGST:</span>
                <GSTSettlementPopover type="cgst" settlement={gstSettlement} />
              </div>
              <span className="font-medium">₹{gstSettlement.cgst.finalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">SGST:</span>
                <GSTSettlementPopover type="sgst" settlement={gstSettlement} />
              </div>
              <span className="font-medium">₹{gstSettlement.sgst.finalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Total Payable:</span>
              <span className="font-bold">₹{(
                gstSettlement.igst.finalPayable +
                gstSettlement.cgst.finalPayable +
                gstSettlement.sgst.finalPayable
              ).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}