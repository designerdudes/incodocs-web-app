import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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
import { cookies } from "next/headers";
import LotFormWrapper from "./components/LotFormWrapper";

interface Props {
  params: {
    id: string; // Assuming 'id' is the lot ID, clarify if 'lotid' is needed
  };
}

// Define the expected shape of LotData
interface LotData {
  lotId: string;
  lotName: string;
  materialType: string;
  blocksId: string[];
  transportCost: number;
  materialCost: number;
  markerCost: number;
  markerOperatorName: string;
  createdAt: string;
  updatedAt: string;
  blocks: Array<{
    dimensions: {
      weight: { value: number; units: string };
      length: { value: number; units: string };
      breadth: { value: number; units: string };
      height: { value: number; units: string };
    };
  }>;
}

export default async function AddBlockFormPage({ params }: Props) {
  const lotId = params.id; // Use params.id as lotId
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch block data
  // const blockResponse = await fetch(
  //   `https://incodocs-server.onrender.com/factory-management/inventory/blocksbylot/get/${lotId}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );
  // const blockData = await blockResponse.json();

  // Fetch lot data
  const lotResponse = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/lot/getbyid/${lotId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const lotData: LotData = await lotResponse.json();

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
            title={`Add New Block to ${lotData?.lotName}`}
          />
          <p className="text-muted-foreground text-sm">
            Add a new block to a lot by entering its details, ensuring accurate
            inventory tracking and management.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:w-2/3">
          <LotFormWrapper
            lotData={lotData}
          />
        </div>

        {/* Lot Details Card */}
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Lot Details</CardTitle>
            <CardDescription>{`Details of ${lotData?.lotName}`}</CardDescription>
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
                  <TableCell>{lotData?.lotName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Type
                  </TableCell>
                  <TableCell>{lotData?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Total Blocks
                  </TableCell>
                  <TableCell>{lotData?.blocksId?.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Transport Cost
                  </TableCell>
                  <TableCell>{lotData?.transportCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Cost
                  </TableCell>
                  <TableCell>{lotData?.materialCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Cost
                  </TableCell>
                  <TableCell>{lotData?.markerCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Operator
                  </TableCell>
                  <TableCell>{lotData?.markerOperatorName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Created At
                  </TableCell>
                  <TableCell>
                    {moment(lotData.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Updated At
                  </TableCell>
                  <TableCell>
                    {moment(lotData.updatedAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}