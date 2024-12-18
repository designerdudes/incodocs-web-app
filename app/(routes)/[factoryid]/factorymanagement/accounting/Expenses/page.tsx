import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { expensecolumns } from './components/expensesColoums';

export type expense = {
  _id: string;
  ExpenseName: string;
  ExpenseValue : string;
  GSTPercentage: number;
  ExpenseDate: string;
}


export default async function SlabsProcessingPage() {

    // const cookieStore = cookies();
    // const token = cookieStore.get('AccessToken')?.value || ""

    // const blockRes = await fetch('http://localhost:4080/factory-management/inventory/raw/get', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + token
    //     }
    // }).then(response => {
    //     return response.json()
    // })

    // const slabRes = await fetch('http://localhost:4080/factory-management/inventory/finished/get', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + token
    //     }
    // }).then(response => {
    //     return response.json()
    // })

    // let Blockdata
    // Blockdata = blockRes
    // console.log(Blockdata)
    // let Slabdata
    // Slabdata = slabRes
    // console.log("this is slabs data", Slabdata)

    // const inCutting = Blockdata.filter((data: any) => data.status === 'inCutting')
    // const readyForPolish = Blockdata.filter((data: any) => data.status === 'cut')
    // const inPolishing = Slabdata.filter((data: any) => data.status === 'inPolishing')
   
    const data = [
      {
        _id: "1",
        ExpenseName: "Ramesh Singh",
        ExpenseValue: "1234",
        GSTPercentage: 15,
        ExpenseDate: "120",
    },
    {
      _id: "2",
      ExpenseName: "Suresh Singh",
      ExpenseValue: "7890",
      GSTPercentage: 15,
      ExpenseDate: "120",
  },
    ]



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
                        Efficiently track and manage Expenses in process with detailed insights into their dimensions, weight, and progress through the cutting process.
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
                            data={data}
                        />
            </div>
        </div>
    );
};

// import React from 'react'

// const hello = () => {
//   return (
//     <div>
//       yo buddy
//     </div>
//   )
// }

// export default hello

