import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { expensecolumns } from "./components/expenseColumns";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

export type expense = {
  _id: string;
  expenseName: string;
  expenseValue: Number;
  gstPercentage: number;
  paidBy: string;
  purchasedBy: string;
  paymentProof: string;
  expenseDate: string;
};

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  let expenseData;
  try {
    var res = await fetchWithAuth<expense[]>("/expense/getall");
  } catch (error) {
    console.log("Error while fetching expense data", error);
    res = [];
  }
  expenseData = res;

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Expenses page" />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track, manage, and analyze your expenses effortlessly
            with our user-friendly interface.
          </p>
        </div>
        <Link href="./Expenses/create-new">
          <Button> Create New Expense</Button>
        </Link>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-250 container mx-auto py-10">
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Expenses?"
          bulkDeleteDescription="This will delete the selected expenses, and they will not be recoverable."
          bulkDeleteToastMessage="Selected Expenses deleted successfully"
          deleteRoute="/expense/delete-multiple"
          searchKey="expenseName"
          columns={expensecolumns}
          data={expenseData}
        />
      </div>
    </div>
  );
}
