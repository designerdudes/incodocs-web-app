import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "../components1/columns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import ShipmentDataTable from "@/components/shipmentDataTable";

interface params {
  params: {
    organizationId: string;
  };
}

export default async function DraftsPage(params: params) {
  
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  let draftData = [];
  try {
    const res = await fetch(
      `https://incodocs-server.onrender.com/shipmentdrafts/getbyorg/${params.params.organizationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    const response = await res.json();
    console.log("Drafts API Response:", response); // Log raw API response
    draftData = response.data || response || []; // Handle various response structures
    console.log("Processed draftData:", draftData); // Log processed data
  } catch (error) {
    console.error("Error fetching draft data:", error);
  }

  return (
    <div className="flex flex-col p-6 h-[92%]">
      <div className="flex justify-between h-[8%] items-center gap-2">
        <Link
          href={`/${params?.params?.organizationId}/documentation/dashboard`}
        >
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Shipment Drafts" />
          <p className="text-muted-foreground text-sm">
            Manage and review your draft shipment records.
          </p>
        </div>
        
      </div>
      <Separator className="my-2" />
      <div className="h-[92%]">
        {draftData.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No drafts available.
          </div>
        ) : (
          <ShipmentDataTable
          
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected draft shipments?"
            bulkDeleteDescription="This will delete all the selected draft shipments, and they will not be recoverable."
            bulkDeleteToastMessage="Selected draft shipments deleted successfully"
            deleteRoute="/shipmentdrafts/deleteall"
            searchKeys={[
              "shipmentId",
              "saleInvoiceDetails.consignee", // Fixed typo
              "bookingDetails.invoiceNumber",
              "bookingDetails.bookingNumber",
              "shippingDetails.shippingLineInvoices.invoiceNumber",
            ]}
            data={draftData}
            columns={columns as any}
            statusColumnName={"status"}
            // deleteConfig={{ token }} // Pass token for bulk deletion
          />
        )}
      </div>
    </div>
  );
}