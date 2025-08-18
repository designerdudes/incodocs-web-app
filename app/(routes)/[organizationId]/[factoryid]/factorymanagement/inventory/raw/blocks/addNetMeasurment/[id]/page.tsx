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

interface Props {
  params: {
    blockid: string;
  };
}

// Define the expected shape of LotData
interface LotData {
  _id: string;
  lotName: string;
  materialType: string;
   blockNumber: number;
  blocksId: string[];
  transportCost: number;
  materialCost: number;
  markerCost: number;
  markerOperatorName: string;
  quarryCost: number;
  commissionCost: number;
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

export default async function SlabsPage({ params }: Props) {
  let BlockData = null;
  let SlabData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/raw/get/${params?.blockid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  BlockData = res;

  // Fetch lot data
//   const resp = await fetch(
//     `https://incodocs-server.onrender.com/factory-management/inventory/slabsbyblock/get/${params?.blockid}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     }
//   ).then((response) => response.json());

//   SlabData = resp;


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
            title={`Add New Block to ${BlockData?.blockNumber}`}
          />
          <p className="text-muted-foreground text-sm">
            Add a new block to a lot by entering its details, ensuring accurate
            inventory tracking and management.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* <div className="w-full lg:w-2/3">
          <LotFormWrapper BlockData={BlockData} />
        </div> */}

        {/* Lot Details Card */}
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Lot Details</CardTitle>
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
                  <TableCell className="whitespace-nowrap">Lot Id</TableCell>
                  <TableCell>{BlockData?.lotName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Lot Name</TableCell>
                  <TableCell>{}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Type
                  </TableCell>
                  <TableCell>{BlockData?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Total Blocks
                  </TableCell>
                  <TableCell>{BlockData?.blocksId?.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Transport Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(BlockData?.transportCost)}
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
                    }).format(BlockData?.materialCost)}
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
                    }).format(BlockData?.markerCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Operator
                  </TableCell>
                  <TableCell>{BlockData?.markerOperatorName}</TableCell>
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
                    }).format(BlockData?.quarryCost || 0)}
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
                    }).format(BlockData?.commissionCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Created At
                  </TableCell>
                  <TableCell>
                    {moment(BlockData.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Updated At
                  </TableCell>
                  <TableCell>
                    {moment(BlockData.updatedAt).format("DD MMM YYYY")}
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
