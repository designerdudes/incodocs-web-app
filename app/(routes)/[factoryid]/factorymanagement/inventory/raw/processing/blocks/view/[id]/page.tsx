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
import { columns } from "../../../../blocks/components/columns";
import { DataTable } from "@/components/ui/data-table";
import React from "react";

interface Props {
  params: {
    id: string;
    factoryid:string;
  };
}

export default async function BlocksPage({ params }: Props) {
  let BlockData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `http://localhost:4080/factory-management/inventory/raw/get/${params?.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => {
    return response.json();
  });

   BlockData  = res;
 
  let SlabData = null;
    
    const resp = await fetch(
      `http://localhost:4080/factory-management/inventory/slabsbyblock/get/${params?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).then((response) => {
      return response.json();
    });
  
    SlabData = resp;
    console.log("Slab Data",SlabData)

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={` Details of Block ${BlockData.blockNumber} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track Slabs with detailed insights into its current
            status and progress through the production cycle.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Block Details</CardTitle>
              <CardDescription>{`Details of ${BlockData?.blockNumber}`}</CardDescription>
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
                      Lot Name
                    </TableCell>
                    <TableCell>{BlockData?.lotId?.lotName}</TableCell>
                  </TableRow>
                  <TableRow/>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Number
                    </TableCell>
                    <TableCell>{BlockData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Number of slabs
                    </TableCell>
                    <TableCell>{BlockData?.SlabsId?.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Material Type
                    </TableCell>
                    <TableCell>{BlockData?.materialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">Status</TableCell>
                    <TableCell>{BlockData?.status === "cut" ? "Ready for Polish" : BlockData?.status || "N/A"}</TableCell>
                    
                  </TableRow>
                
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Weight (tons)
                    </TableCell>
                    <TableCell>{BlockData?.dimensions?.weight?.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Length (inch)
                    </TableCell>
                    <TableCell>{BlockData?.dimensions?.length?.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Breadth (inch)
                    </TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.breadth?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Height (inch)
                    </TableCell>
                    <TableCell>{BlockData?.dimensions?.height?.value}</TableCell>
                  </TableRow>
                 
                  
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Created At
                    </TableCell>
                    <TableCell>
                      {moment(BlockData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Updated At
                    </TableCell>
                    <TableCell>
                      {moment(BlockData.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>


          {/* Slabs DataTable */}
                    <div className="container mx-auto">
                      <DataTable
                        bulkDeleteIdName="_id"
                        bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                        bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                        bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                        deleteRoute="/category/ids"
                        searchKey="slabNumber"
                        columns={columns}
                        data={SlabData as any}
                      />
                    </div>
        </div>
      </div>
    </div>
  );
}
