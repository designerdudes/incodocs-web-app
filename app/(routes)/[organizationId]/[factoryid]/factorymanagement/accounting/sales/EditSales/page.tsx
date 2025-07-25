import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import EditSaleForm from "../components/editSales";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default async function EditSalePage({ params }: PageProps) {
  const factoryid = params?.factoryid;
  const cookieStore = cookies();

  const token = cookieStore.get("AccessToken")?.value || "";
  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/getslabsbyfactory/${factoryid}`,
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

  const slabsData = res;
  const Polished = Array.isArray(slabsData)
    ? slabsData.filter(
        (data: any) => data.inStock === true && data.status === "polished"
      )
    : [];

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href={`./`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Edit Sale Details" />
          <p className="text-muted-foreground text-sm">
            Update the form below to edit this Sale.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <EditSaleForm polishedSlabs={Polished} />
      </div>
    </div>
  );
}
