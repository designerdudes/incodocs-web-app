import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import ShipmentDataTable from "@/components/shipmentDataTable";
import { useParams } from "next/navigation";
import { columns } from "./components/columns";
import DownloadInvRemittance from "./components/remittanceDownloadBtn";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface params {
  params: {
    organizationId: string;
  };
}

export default async function Page(params: params) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  //fetching remittance data from api
  try {
    var response = await fetchWithAuth<any>(
      `/remittance/inward/getall/${params.params.organizationId}`
    );
  } catch (error) {
    console.log("failed to fetch inward remittance");
    response = [];
  }

  const res = response;
  let remittanceData;
  remittanceData = res;

  return (
    <div className="flex flex-col p-6 h-[92%]">
      <div className="flex justify-between h-[8%] items-center gap-2">
        <Link
          href={`/${params?.params?.organizationId}/documentation/remittancePage`}
        >
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title=" Inward Remittances" />
          <p className="text-muted-foreground text-sm">
            Effectively oversee your Remittance records.
          </p>
        </div>
        {/* <Link href={`./remittance/createnew`}>
            <Button className="bg-primary text-white">Add New Remittance</Button>
        </Link> */}
        <DownloadInvRemittance remittanceData={remittanceData} />
        <a
          href="./inwardRemittance/addnew"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-primary text-white">Add New Remittance</Button>
        </a>
      </div>
      <Separator className="my-2" />
      <div className="h-[92%]">
        <DataTable
          searchKey="inwardRemittanceNumber"
          columns={columns as any}
          data={remittanceData}
        />
      </div>
    </div>
  );
}
