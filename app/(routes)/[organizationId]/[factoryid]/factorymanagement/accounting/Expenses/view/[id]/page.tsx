import React from "react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    id: string;
  };
}

export default async function ExpensePage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  try {
    var res = await fetchWithAuth<any>(`/expense/getbyid/${params.id}`);
  } catch (error) {
    console.log("Error while fetching expense data", error);
    res = null;
  }

  const expenseData = res;

  // Display data after fetching
  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title={`Expense Details`} />
          <p className="text-muted-foreground text-sm mt-2">
            Detailed overview of expenses, covering costs, categories, and dates
            to ensure efficient financial tracking and budget management.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardDescription>{`Details for Expense Name: ${expenseData.expenseName}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Expense Name
                    </TableCell>
                    <TableCell>{expenseData.expenseName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Expense Value
                    </TableCell>
                    <TableCell>{expenseData.expenseValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      GST Percentage
                    </TableCell>
                    <TableCell>{expenseData.gstPercentage}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">Purpose</TableCell>
                    <TableCell>{expenseData.purpose}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Bill Number
                    </TableCell>
                    <TableCell>{expenseData.billNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Item Name
                    </TableCell>
                    <TableCell>{expenseData.itemName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Taxable Value
                    </TableCell>
                    <TableCell>{expenseData.taxableValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">IGST</TableCell>
                    <TableCell>{expenseData.igst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">CGST</TableCell>
                    <TableCell>{expenseData.cgst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">SGST</TableCell>
                    <TableCell>{expenseData.sgst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Invoice Value
                    </TableCell>
                    <TableCell>{expenseData.invoiceValue}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">Paid By</TableCell>
                    <TableCell>{expenseData.paidBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Purchased By
                    </TableCell>
                    <TableCell>{expenseData.purchasedBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Payment Proof
                    </TableCell>
                    <TableCell>
                      <a
                        href={expenseData.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="link" className="p-0 m-0">
                          View Payment Proof
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Expense Date
                    </TableCell>
                    <TableCell>
                      {moment(expenseData.expenseDate).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Created At
                    </TableCell>
                    <TableCell>
                      {moment(expenseData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Updated At
                    </TableCell>
                    <TableCell>
                      {moment(expenseData.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
