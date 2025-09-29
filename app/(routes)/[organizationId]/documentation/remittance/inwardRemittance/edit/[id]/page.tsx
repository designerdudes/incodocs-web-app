import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import EditInwardRemittanceForm from "@/components/forms/Editremittanceform";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface EditRemittancePageProps {
  params: {
    id: string;
    organizationId: string;
  };
}

export default async function EditInwardRemittance({ params }: EditRemittancePageProps) {
  const { id, organizationId } = params;

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  let EditData = null;

  try {
    var res = await fetchWithAuth<any>(`/remittance/inward/getbyid/${id}`, 
    );
  } catch (err) {
    console.error("Failed to fetch remittance data:", err);
    res = []
  }
  EditData =  res;

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      {/* Top Bar */}
      <div className="topbar w-full flex items-center justify-between">
        <Link href={`/${organizationId}/documentation/remittancePage/inwardRemittance`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Edit Inward Remittance" />
          <p className="text-muted-foreground text-sm">
            Update the form below to modify the inward remittance details
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      {/* Form */}
      <div className="max-h-full ">
        <EditInwardRemittanceForm params = {EditData} />
      </div>
    </div>
  );
}
