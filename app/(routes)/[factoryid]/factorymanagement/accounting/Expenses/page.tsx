"use client";
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { expensecolumns } from './components/expensesColums';
import { fetchData } from '@/axiosUtility/api';


export type expense = {
  _id: string;
  ExpenseName: string;
  ExpenseValue : string;
  GSTPercentage: number;
  ExpenseDate: string;
}


function Page() {
    const [expenseData, setExpenseData] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenseData = async () => { 
            try {
                setLoading(true);
                const data = await fetchData("/expense/getall");
                setExpenseData(data);
                console.log("thi is data",expenseData)
            } catch (error) {
                console.error("Error fetching expense data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchExpenseData();
    }, []);
    

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
                        Efficiently track, manage, and analyze your expenses effortlessly with our user-friendly interface.
                    </p>
                </div>
                <Link href='./Expenses/create-new'>
                    <Button> Create New Expense</Button>
                </Link>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                        <DataTable
                            bulkDeleteIdName="order_id"
                            bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                            bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                            bulkDeleteToastMessage="Selected slabs deleted successfully"
                            searchKey="title"
                            columns={expensecolumns}
                            data={expenseData}
                        />
            </div>
        </div>
    );
}
export default Page;