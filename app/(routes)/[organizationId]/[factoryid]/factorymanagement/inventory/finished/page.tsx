import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cookies } from "next/headers";
import { Polishedcolumns } from "./components/polishedColumns";
import { Badge } from "@/components/ui/badge";
import { SoldColumns } from "./components/SoldColumns";
import { polishingInchesWithAllowanceColumns } from "./components/polishingWithAllowanceColumns";
import { polishingInchesWithOutAllowanceColumns } from "./components/polishingWithOutAllowanceColumns";
import { CuttingInchesWithAllowanceColumns } from "./components/cuttingWithAllowanceColumns";
import { CuttingInchesWithOutAllowanceColumns } from "./components/cuttingWithOutAllowanceColumns";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

export type FinishedMaterial = {
  _id: string;
  slabNumber: string; // <-- change this from number → string
  blockNumber: string;
  factoryId: string;
  productName: string;
  quantity: number;
  status: string;
  inStock: boolean;
  dimensions: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  trim: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  workersCuttingPay: number;
  workersPolishingPay: number;
  cuttingPaymentStatus: { status: string };
  polishingPaymentStatus: { status: string };
  createdAt: string;
  updatedAt: string;
};


interface Props {
  params: {
    factoryid: string;
  };
}

export default async function FinishedMaterialPage({ params }: Props) {
  let slabsData: FinishedMaterial[] = [];
  let Polished: FinishedMaterial[] = [];
  let Sold: FinishedMaterial[] = [];

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";

    const res = await fetchWithAuth<FinishedMaterial[]>(
      `/factory-management/inventory/getslabsbyfactory/${params.factoryid}`
    );

    slabsData = res;

    Polished = Array.isArray(slabsData)
      ? slabsData.filter(
          (data) => data.inStock === true && data.status === "polished"
        )
      : [];

    Sold = Array.isArray(slabsData)
      ? slabsData.filter(
          (data) => data.inStock === false && data.status === "polished"
        )
      : [];
  } catch (error) {
    console.error("Error fetching slabs data:", error);
    // Optional: show empty state or fallback
    slabsData = [];
    Polished = [];
    Sold = [];
  }

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight "
            title="Finished Material Inventory "
          />
          <p className="text-muted-foreground text-sm mt-2">
            Track and manage finished materials with detailed insights into
            dimensions, weight, and processing stages for accurate inventory
            control, efficient cutting, and real-time stock updates.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto py-10">
        <Tabs defaultValue="CuttingData" className="w-full">
          <div className="text-center mb-4">
            <TabsList className="gap-6">
              <TabsTrigger className="gap-2" value="CuttingData">
                Cutting Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {slabsData?.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger className="gap-2" value="PolishingData">
                Polishing Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {slabsData?.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger className="gap-2" value="Polished">
                Polished Slab Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {Polished?.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger className="gap-2" value="Sold">
                Sold Slab Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {Sold?.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="CuttingData">
            <Tabs defaultValue="CuttingInchesWithAllowance" className="w-full">
              <div className="text-center mt-4">
                <TabsList className="gap-6">
                  <TabsTrigger
                    className="gap-2"
                    value="CuttingInchesWithAllowance"
                  >
                    Cutting Inches With Allowance
                  </TabsTrigger>
                  <TabsTrigger
                    className="gap-2"
                    value="CuttinginchesWithOutAllowance"
                  >
                    Cutting Inches WithOut Allowance
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="CuttingInchesWithAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                  bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected Slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={CuttingInchesWithAllowanceColumns}
                  data={slabsData}
                  tab="cuttingInchesWithAllowance"
                />
              </TabsContent>

              <TabsContent value="CuttinginchesWithOutAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                  bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected Slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={CuttingInchesWithOutAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="PolishingData">
            <Tabs
              defaultValue="PolishingInchesWithAllowance"
              className="w-full"
            >
              <div className="text-center mt-4">
                <TabsList className="gap-6">
                  <TabsTrigger
                    className="gap-2"
                    value="PolishingInchesWithAllowance"
                  >
                    Polishing Inches With Allowance
                  </TabsTrigger>
                  <TabsTrigger
                    className="gap-2"
                    value="PolishingInchesWithOutAllowance"
                  >
                    Polishing Inches WithOut Allowance
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="PolishingInchesWithAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                  bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={polishingInchesWithAllowanceColumns}
                  data={slabsData}
                  tab="polishingInchesWithAllowance"
                />
              </TabsContent>
              <TabsContent value="PolishingInchesWithOutAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                  bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={polishingInchesWithOutAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="Polished">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
              bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected slabs deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleslabs  "
              searchKey="slabNumber"
              columns={Polishedcolumns}
              data={Polished}
            />
          </TabsContent>
          <TabsContent value="Sold">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
              bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected slabs deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleslabs"
              searchKey="slabNumber"
              columns={SoldColumns}
              data={Sold}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
