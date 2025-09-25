import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SalesCreateNewForm } from "@/components/forms/salesForm";
import { useSearchParams } from "next/navigation";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface PageProps {
  params: {
    factoryid: string;
    organizationId: string;
  };
}
export default async function CreateNewFormPage({ params }: PageProps) {
  const factoryid = params?.factoryid;
  const cookieStore = cookies();

  const token = cookieStore.get("AccessToken")?.value || "";
  try {
    var res = await fetchWithAuth<any>(
      `/factory-management/inventory/getslabsbyfactory/${factoryid}`
    );
  } catch (error) {
    console.log("failed to fetch slabs");
    res = [];
  }

  const slabsData = res;
  const Polished = Array.isArray(slabsData)
    ? slabsData.filter(
        (data: any) => data.inStock === true && data.status === "polished"
      )
    : [];

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Create new Sale" />
          <p className="text-muted-foreground text-sm">
            Fill in the form below to sale the product.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <SalesCreateNewForm
          gap={3}
          orgId={params.organizationId}
          polishedSlabs={Polished}
        />
      </div>
    </div>
  );
}
