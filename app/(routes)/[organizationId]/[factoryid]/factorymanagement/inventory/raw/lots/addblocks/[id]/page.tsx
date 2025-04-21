// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AddBlockForm } from "@/components/forms/AddBlockForm";
import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
interface Props {
  params: {
    id: string;
    lotid: string;
  };
}
import CostCalculationTable from "./components/CostCalculationTable";



export default async function AddBlockFormPage({ params }: Props) {
  let lotId = null;
  lotId = params.id;
  console.log(params.id);
  let BlockData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/blocksbylot/get/${params?.id}`,
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
  const res2 = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/lot/getbyid/${params?.id}`,
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
  BlockData = res;
  let LotData = res2;
  console.log("lotsdata", LotData);
  // At the top of your component
  

  return (
    <div className="w-full space-y-4 h-full flex p-6 flex-col">
      {/* Topbar */}
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`Add New Block to ${LotData?.lotName}`}
          />
          <p className="text-muted-foreground text-sm">
            Add a new block to a lot by entering its details, ensuring accurate
            inventory tracking and management.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col lg:flex-row gap-2 w-full">
        <div className="w-full lg:w-3/5">
          <AddBlockForm gap={3} params={{ lotId }} />
        </div>

        {/* Lot Details Card */}
        <Card className="w-full lg:w-2/5">
          <CardHeader>
            <CardTitle>Lot Details</CardTitle>
            <CardDescription>{`Details of ${LotData?.lotName}`}</CardDescription>
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
                  <TableCell className="whitespace-nowrap">Lot Name</TableCell>
                  <TableCell>{LotData?.lotName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Type
                  </TableCell>
                  <TableCell>{LotData?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Total Blocks
                  </TableCell>
                  <TableCell>{LotData?.blocksId?.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Transport Cost
                  </TableCell>
                  <TableCell>{LotData?.transportCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Cost
                  </TableCell>
                  <TableCell>{LotData?.materialCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Cost
                  </TableCell>
                  <TableCell>{LotData?.markerCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Operator
                  </TableCell>
                  <TableCell>{LotData?.markerOperatorName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Created At
                  </TableCell>
                  <TableCell>
                    {moment(LotData.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Updated At
                  </TableCell>
                  <TableCell>
                    {moment(LotData.updatedAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          {/* Cost Calculation Table */}
        <CostCalculationTable LotData={LotData} />
        </Card>

        
      </div>
    </div>
  );
}
