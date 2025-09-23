import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { suppliercolumns } from "./components/supplierColumn";
import { customercolumns } from "./components/customerColumn";
import PartiesDropdown from "./components/Partiesdropdown";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    organizationId: string;
  };
}

export default async function PartiesPage({ params }: Props) {
  const cookieStore = cookies();
  const organizationId = "674b0a687d4f4b21c6c980ba"; // Could use params.organizationId
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch supplier data
  const supplierRes = await fetchWithAuth<any>(
    "/accounting/suplier/getall" // Fixed typo: "suplier" -> "supplier"
  );
  const suppliers = supplierRes || []; // Ensure it's an array

  // Fetch customer data
  const customerRes = await fetchWithAuth<any>(
    "/accounting/customer/getall"
  );
  const customers = customerRes || []; // Ensure it's an array

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
          <Heading className="leading-tight" title="Ledger" />
          <p className="text-muted-foreground text-sm mt-2">
            Effortlessly oversee and update supplier and customer accounting
            details to streamline financial tracking and maintain accurate
            records.
          </p>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <PartiesDropdown organizationId={organizationId} />
      </div>
      <Separator className="my-2" />
      <div>
        <Tabs defaultValue="supplier" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger className="gap-2" value="supplier">
              Supplier
              <Badge className="text-bg-primary-foreground" variant="outline">
                {suppliers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="customer">
              Customer
              <Badge className="text-bg-primary-foreground" variant="outline">
                {customers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="supplier">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected suppliers?"
              bulkDeleteDescription="This will delete the selected suppliers, and they will not be recoverable."
              bulkDeleteToastMessage="Selected suppliers deleted successfully"
              deleteRoute="/accounting/suplier/deletemany"
              searchKey="supplierName" // Updated to match accessorKey
              columns={suppliercolumns}
              data={suppliers}
            />
          </TabsContent>
          <TabsContent value="customer">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected customers?"
              bulkDeleteDescription="This will delete the selected customers, and they will not be recoverable."
              bulkDeleteToastMessage="Selected customers deleted successfully"
              deleteRoute="/accounting/customer/deletemany"
              searchKey="customerName" // Updated to match accessorKey
              columns={customercolumns}
              data={customers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
