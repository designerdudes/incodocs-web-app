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
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    id: string; // Assuming 'id' is the lot ID, clarify if 'lotid' is needed
  };
}

// Define the expected shape of LotData
interface LotData {
  _id: string;
  lotName: string;
  materialType: string;
  blockNumber: number;
  blocksId: string[];
  blockLoadingCost: number;
  materialCost: number;
  markerCost: number;
  permitCost: number;
  markerOperatorName: string;
  quarryCost: number;
  commissionCost: number;
  lotId: string;
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
  let lotData: LotData;

  try {
    const lotResponse = await fetchWithAuth<LotData>(
      `/factory-management/inventory/lot/getbyid/${lotId}`
    );
    lotData = lotResponse;
  } catch (error) {
    console.error("Failed to fetch lot data:", error);
    // Provide a fallback object so TypeScript is happy
    lotData = {
      _id: "",
      lotName: "",
      materialType: "",
      blockNumber: 0,
      blocksId: [],
      blockLoadingCost: 0,
      materialCost: 0,
      markerCost: 0,
      permitCost: 0,
      markerOperatorName: "",
      quarryCost: 0,
      commissionCost: 0,
      lotId: "",
      createdAt: "",
      updatedAt: "",
      blocks: [],
    };
  }

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
          <LotFormWrapper lotData={lotData} />
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
                  <TableCell className="whitespace-nowrap">Lot Id</TableCell>
                  <TableCell>{lotData?.lotId}</TableCell>
                </TableRow>
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
                    Block Loading Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.blockLoadingCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.materialCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Permit Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.permitCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.markerCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Operator
                  </TableCell>
                  <TableCell>{lotData?.markerOperatorName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Qarry Transport cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.quarryCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Comission cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(lotData?.commissionCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Created At
                  </TableCell>
                  <TableCell>
                    {moment(lotData.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Updated At
                  </TableCell>
                  <TableCell>
                    {moment(lotData.updatedAt).format("DD MMM YYYY")}
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
