import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { ExportDocscolumns } from "./components/columns";

interface Props {
  params: {
    organizationId: string;
  };
}

export default async function ExportDocsPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch data (unchanged)
//   const ExportDocsData = await fetch(
//     `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${orgaanisationID}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//     }
//   ).then((response) => response.json());
//     const shippingLine = ExportDocsData; 

  const ExpoDocs = {} ;

 
  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="/documentation/dashboard">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Export Docs" />
          <p className="text-muted-foreground text-sm mt-2">
          A comprehensive solution for managing exportdocs, monitoring
          efficiently.
          </p>
        </div>
        <Button className="bg-primary text-white">Export</Button>
      </div>
      {/* Moved PartiesDropdown here */}
      
      <Separator className="my-2" />
      <div>
        <Tabs defaultValue="shippingLine" className="w-full">
          
          <TabsContent value="shippingLine">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
              bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
              bulkDeleteToastMessage="Selected shipping lines deleted successfully"
              deleteRoute="/shipment/shippingline/deletemany"
              searchKey="name"
              columns={ExportDocscolumns}
              data={ExpoDocs as any}
            />
          </TabsContent>
        
        </Tabs>
      </div>
    </div>
  );
}
